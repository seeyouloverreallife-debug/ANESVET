/* R13 focused tests: current-case version fencing when session ownership changes. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/app.js','utf8');
const freshnessFactory=require('./active-case-freshness.js').create;
let passed=0,failed=0;
function t(label,fn){try{fn();passed++;console.log('PASS',label)}catch(e){failed++;console.error('FAIL',label,e.stack)}}
const v=(caseId,drug,record,stamp=100)=>JSON.stringify({caseId,lastSavedAt:stamp,drugAdministrations:[{id:drug}],records:[{id:record}]});
function storage(initial){const data={current:initial},writes=[];return{data,writes,getItem:k=>data[k]??null,setItem:(k,p)=>{data[k]=String(p);writes.push([k,String(p)])}}}
function guard(s,callback=()=>{}){return freshnessFactory({read:()=>s.getItem('current'),onBlocked:callback})}
t('verified local revision permits saving',()=>{const s=storage(v('A','d1','v1'));const g=guard(s);assert(g.establish());assert(g.verify());});
t('changed dose log blocks stale tab even when timestamps are identical',()=>{const s=storage(v('A','d1','v1'));let reason='';const g=guard(s,r=>reason=r);g.establish();s.setItem('current',v('A','d2','v1'));assert.equal(g.verify(),false);assert.equal(reason,'external-case-change');});
t('changed vital records block stale tab',()=>{const s=storage(v('A','d1','v1'));const g=guard(s);g.establish();s.setItem('current',v('A','d1','v2'));assert.equal(g.verify(),false);});
t('different case identity cannot be overwritten by older tab',()=>{const s=storage(v('A','d1','v1'));const g=guard(s);g.establish();s.setItem('current',v('B','d1','v1'));assert.equal(g.verify(),false);});
t('same-tab verified save moves only its own baseline',()=>{const s=storage(v('A','d1','v1'));const g=guard(s);g.establish();const newPayload=v('A','d2','v1',200);s.setItem('current',newPayload);g.committed(newPayload);assert(g.verify());});
t('blocked tab cannot rebase to another tab without reload',()=>{const s=storage(v('A','d1','v1'));const g=guard(s);g.establish();s.setItem('current',v('A','d2','v1'));assert(!g.verify());assert.equal(g.committed(s.getItem('current')),false);assert(!g.verify());});
t('storage inaccessible after successful load fails closed',()=>{let okay=true;const g=freshnessFactory({read:()=>{if(!okay)throw Error('SecurityError');return v('A','d1','v1')}});g.establish();okay=false;assert(!g.verify());assert.equal(g.reason(),'storage-unavailable');});
t('storage unreadable at initial hydration fails closed',()=>{const g=freshnessFactory({read:()=>{throw Error('SecurityError')}});assert.equal(g.establish(),false);assert.equal(g.verify(),false);});
t('uninitialized guard does not authorize clinical writes',()=>{const g=freshnessFactory({read:()=>null});assert.equal(g.verify(),false);});
t('block notification is emitted once even when multiple writes are attempted',()=>{const s=storage('old');let count=0;const g=guard(s,()=>count++);g.establish();s.setItem('current','new');g.verify();g.verify();assert.equal(count,1);});
t('matching empty saved case is supported',()=>{const s=storage(null);const g=guard(s);g.establish();assert(g.verify());});
t('persisted newer case blocks save before any field recapture',()=>{
  const from=src.indexOf('function save({persistLocked=false,reason='),to=src.indexOf('function cToF(',from);
  const s=storage(v('A','d2','v2'));let status='',reads=0;
  const ctx={CURRENT_KEY:'current',resetInProgress:false,autosaveTimer:null,sessionActive:()=>true,SESSION_CONTROLLER:{verifyOwnership:()=>true},CASE_FRESHNESS:{verify:()=>false},clearTimeout(){},renderSaveState(x){status=x},renderSessionMode(){},dataFields:['hr'],state:{caseId:'A'},$(){reads++;return{value:'99'}},localStorage:s};
  vm.createContext(ctx);vm.runInContext(src.slice(from,to),ctx);
  assert.equal(ctx.save({reason:'unsafe-overwrite'}),false);assert.equal(s.writes.length,0);assert.equal(reads,0);assert.equal(status,'error');
});
t('current-case save can commit exact verified payload when case is fresh',()=>{
  const from=src.indexOf('function save({persistLocked=false,reason='),to=src.indexOf('function cToF(',from);
  const s=storage(v('A','d1','v1'));let mirror=0,checkpoint=0,commits=[];
  const ctx={CURRENT_KEY:'current',resetInProgress:false,autosaveTimer:null,sessionActive:()=>true,SESSION_CONTROLLER:{verifyOwnership:()=>true},CASE_FRESHNESS:{verify:()=>true,committed:p=>commits.push(p)},clearTimeout(){},renderSaveState(){},renderSessionMode(){},dataFields:[],state:{caseId:'A',lastSavedAt:100,caseLocked:false,recoveryChecks:[],recoveryNA:[]},$:()=>null,$$:()=>[],localStorage:s,Date,queueCurrentMirror:()=>mirror++,writeSafetyCheckpoint:()=>{checkpoint++;return true},syncCaptureAfterLocalSave:()=>{},console};
  vm.createContext(ctx);vm.runInContext(src.slice(from,to),ctx);
  assert.equal(ctx.save({reason:'test'}),true);assert.equal(mirror,1);assert.equal(checkpoint,1);assert.equal(commits[0],s.getItem('current'));
});
t('pending mirror write blocked if persisted copy changed during delay',()=>{
  const from=src.indexOf('function queueCurrentMirror(verifiedPayload){'),to=src.indexOf('function getLegacyArchiveSeed(){',from);
  const s=storage(v('A','d1','v1'));const g=guard(s);g.establish();let callback,puts=0;
  const ctx={resetInProgress:false,currentMirrorTimer:null,state:JSON.parse(s.getItem('current')),localStorage:s,CURRENT_KEY:'current',Promise,BOOT:{mark:()=>{}},clearTimeout(){},setTimeout:fn=>{callback=fn;return 1},JSON,sessionActive:()=>true,SESSION_CONTROLLER:{verifyOwnership:()=>true},CASE_FRESHNESS:g,idbPutMeta:()=>puts++};
  vm.createContext(ctx);vm.runInContext(src.slice(from,to),ctx);
  ctx.queueCurrentMirror(s.getItem('current'));s.setItem('current',v('A','d2','v2'));callback();assert.equal(puts,0);assert(g.isBlocked());
});
t('pending mirror write persists normally for unchanged owner and revision',()=>{
  const from=src.indexOf('function queueCurrentMirror(verifiedPayload){'),to=src.indexOf('function getLegacyArchiveSeed(){',from);
  const s=storage(v('A','d1','v1'));const g=guard(s);g.establish();let callback,puts=0;
  const ctx={resetInProgress:false,currentMirrorTimer:null,state:JSON.parse(s.getItem('current')),localStorage:s,CURRENT_KEY:'current',Promise,BOOT:{mark:()=>{}},clearTimeout(){},setTimeout:fn=>{callback=fn;return 1},JSON,sessionActive:()=>true,SESSION_CONTROLLER:{verifyOwnership:()=>true},CASE_FRESHNESS:g,idbPutMeta:()=>puts++};
  vm.createContext(ctx);vm.runInContext(src.slice(from,to),ctx);ctx.queueCurrentMirror(s.getItem('current'));callback();assert.equal(puts,1);
});
t('session take-control callback checks case freshness again',()=>{assert(src.includes("if(mode==='active'){if(CASE_FRESHNESS.isEstablished())CASE_FRESHNESS.verify()"));});
t('clinical write, reset, and mirror restore require revision freshness',()=>{
 assert(src.includes("function clinicalWriteAllowed(){if(!CASE_FRESHNESS.verify()"));
 assert(src.includes('function resetCurrent(){\n  if(!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||!CASE_FRESHNESS.verify())'));
 assert(src.includes("guardedStartupCurrentWrite(payload,'indexeddb-mirror')"));
});
t('reload latest action cannot run on storage-unavailable',()=>{
 assert(src.includes("CASE_FRESHNESS.reason()==='storage-unavailable'"));
 assert(src.includes('freshnessReloadInProgress=true;cancelPendingPersistence();restartAtAppRoot()'));
});
t('R13 does not change dose calculations or vital duplicate guard',()=>{
 assert(src.includes('OR_VITAL_DUPLICATE_GUARD_MS=12000'));assert(src.includes('OR_RECORD_ORCH.commitVital('));
});
console.log(JSON.stringify({suite:'R13-current-case-freshness',passed,total:passed+failed,failed},null,2));
if(failed)process.exitCode=1;
