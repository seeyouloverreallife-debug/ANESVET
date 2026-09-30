/* R12: executable sleep/wake ownership and stale mirror protection regressions. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const coordination=fs.readFileSync(__dirname+'/session-coordination.js','utf8');
const controllerSrc=fs.readFileSync(__dirname+'/session-controller.js','utf8');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
// Execute the real R19 fail-closed guard in isolated VM test contexts.
const journalPrelude=app.slice(app.indexOf("const RESTORE_JOURNAL_KEY="),app.indexOf("const BREED_ALIAS_KEY=")).replace(/\bwindow\b/g,'globalThis');

const results=[];
function test(name,fn){try{fn();results.push({name,pass:true});console.log('PASS',name)}catch(e){results.push({name,pass:false,error:e.message});console.error('FAIL',name,e.stack)}}
function storage(initial={}){const values={...initial};const writes=[];return {values,writes,getItem:k=>values[k]??null,setItem:(k,v)=>{values[k]=String(v);writes.push({key:k,value:String(v)})},removeItem:k=>delete values[k]}}
let now=1700000000000;
function tab(shared,id){
  const listeners={}, docListeners={}, intervals=new Map();let intervalSerial=0;
  const session=storage();session.setItem('tabid',id);
  const root={};root.window=root;
  root.sessionStorage=session;root.localStorage=shared;root.Date={now:()=>now};
  root.crypto={randomUUID:()=>id};root.setInterval=(fn)=>{const k=++intervalSerial;intervals.set(k,fn);return k};
  root.clearInterval=k=>intervals.delete(k);
  root.addEventListener=(name,fn)=>{(listeners[name]??=[]).push(fn)};
  const body={classList:{toggle(){}},children:[]};
  root.document={body,visibilityState:'visible',addEventListener:(name,fn)=>{(docListeners[name]??=[]).push(fn)}};
  root.ANESVET_APP_SHELL={$:()=>null};
  vm.createContext(root);vm.runInContext(journalPrelude,root);vm.runInContext(coordination,root);vm.runInContext(controllerSrc,root);
  const events={dispatch:(name,doc=false)=>{(doc?docListeners:listeners)[name]?.forEach(f=>f())},intervals:()=>[...intervals.values()].forEach(f=>f())};
  const opts={lockKey:'lock',tabKey:'tabid',ttlMs:30000,heartbeatMs:5000,appVersion:'test',getCaseInfo:()=>({caseId:'case-1',patientName:'Dog'})};
  const coord=root.ANESVET_SESSION_COORDINATION.create(opts);
  const ctl=root.ANESVET_SESSION_CONTROLLER.create({...opts,toast:()=>{}});
  return{root,coord,ctl,events,session};
}
test('active heartbeat refuses to overwrite newer fresh foreign lock',()=>{
  const shared=storage();const a=tab(shared,'A');a.coord.init();assert.equal(a.coord.getMode(),'active');
  const b=tab(shared,'B');b.coord.init();assert.equal(b.coord.getMode(),'view');b.coord.takeControl('explicit');
  const before=shared.values.lock;const writes=shared.writes.length;
  a.events.intervals();assert.equal(a.coord.getMode(),'view');assert.equal(shared.values.lock,before);assert.equal(shared.writes.length,writes);
});
test('wake ownership verification switches suspended writer to VIEW ONLY',()=>{
  const shared=storage();const a=tab(shared,'A');a.ctl.init();a.ctl.bind();
  const b=tab(shared,'B');b.ctl.init();b.ctl.takeControl('explicit');
  a.events.dispatch('pageshow');assert.equal(a.ctl.isActive(),false);assert.equal(a.ctl.getMode(),'view');
  assert.equal(JSON.parse(shared.values.lock).tabId,'B');
});
test('visibility resume also rechecks ownership when storage events were missed',()=>{
  const shared=storage();const a=tab(shared,'A');a.ctl.init();a.ctl.bind();
  const b=tab(shared,'B');b.ctl.init();b.ctl.takeControl('explicit');
  a.events.dispatch('visibilitychange',true);assert.equal(a.ctl.getMode(),'view');
});
test('normal same-tab wake keeps ownership and lock updates work',()=>{
  const shared=storage();const a=tab(shared,'A');a.ctl.init();a.ctl.bind();
  a.events.dispatch('pageshow');assert(a.ctl.isActive());assert(a.ctl.verifyOwnership());
  assert(a.ctl.writeLock());assert.equal(JSON.parse(shared.values.lock).tabId,'A');
});
test('intentional Take Control remains available and other writer yields on next heartbeat',()=>{
  const shared=storage();const a=tab(shared,'A');a.coord.init();
  const b=tab(shared,'B');b.coord.init();b.coord.takeControl();a.events.intervals();
  assert.equal(a.coord.getMode(),'view');a.coord.takeControl('user explicitly requested');assert.equal(a.coord.getMode(),'active');
  assert.equal(JSON.parse(shared.values.lock).tabId,'A');b.events.intervals();assert.equal(b.coord.getMode(),'view');
});
test('stale session lock can still be reclaimed on startup for backward compatibility',()=>{
  now=1700000000000;const shared=storage({lock:JSON.stringify({tabId:'old',heartbeatAt:now-60000})});
  const a=tab(shared,'A');a.ctl.init();assert(a.ctl.isActive());assert.equal(JSON.parse(shared.values.lock).tabId,'A');
});
test('save refuses to write current case when ownership check demotes stale tab',()=>{
  const from=app.indexOf('function save({persistLocked=false,reason=');const to=app.indexOf('function cToF(',from);
  assert(from>0&&to>from);
  const shared=storage(), s={resetInProgress:false,autosaveTimer:null,sessionActive:()=>true,
    SESSION_CONTROLLER:{verifyOwnership:()=>false},renderSaveState:()=>{},renderSessionMode:()=>{s.modeRendered=true},cancelPendingPersistence:()=>{},clearTimeout:()=>{},localStorage:shared};
  vm.createContext(s);vm.runInContext(journalPrelude,s);vm.runInContext(app.slice(from,to),s);
  assert.equal(s.save({reason:'wake-autosave'}),false);assert.equal(shared.writes.length,0);assert.equal(s.modeRendered,true);
});
test('pending mirror callback does not write after session was lost',()=>{
  const from=app.indexOf('function queueCurrentMirror(verifiedPayload){');const to=app.indexOf('function getLegacyArchiveSeed(){',from);
  assert(from>0&&to>from);
  let pending=null, owns=true, inserted=[],caseData={caseId:'dog',lastSavedAt:10,records:[{id:'v1'}],drugAdministrations:[{id:'m1'}]};
  const s={resetInProgress:false,currentMirrorTimer:null,clearTimeout:()=>{},setTimeout:(fn)=>{pending=fn;return 10},
    state:caseData,JSON,Promise,localStorage:storage({current:JSON.stringify(caseData)}),CURRENT_KEY:'current',sessionActive:()=>owns,SESSION_CONTROLLER:{verifyOwnership:()=>owns},CASE_FRESHNESS:{verify:()=>owns,block:()=>{}},BOOT:{mark:()=>{}},idbPutMeta:(...x)=>{inserted.push(x)}};
  vm.createContext(s);vm.runInContext(journalPrelude,s);vm.runInContext(app.slice(from,to),s);
  s.queueCurrentMirror(JSON.stringify(caseData));owns=false;pending();assert.equal(inserted.length,0);
  assert.equal(caseData.records.length,1);assert.equal(caseData.drugAdministrations.length,1);
});
test('pending mirror callback still persists when session remains owner',()=>{
  const from=app.indexOf('function queueCurrentMirror(verifiedPayload){');const to=app.indexOf('function getLegacyArchiveSeed(){',from);
  let pending=null,inserted=[];
  const s={resetInProgress:false,currentMirrorTimer:null,clearTimeout:()=>{},setTimeout:(fn)=>{pending=fn;return 10},
    state:{caseId:'cat',records:[{id:'v2'}],drugAdministrations:[{id:'m2'}]},JSON,Promise,localStorage:storage({current:JSON.stringify({caseId:'cat',records:[{id:'v2'}],drugAdministrations:[{id:'m2'}]})}),CURRENT_KEY:'current',BOOT:{mark:()=>{}},
    sessionActive:()=>true,SESSION_CONTROLLER:{verifyOwnership:()=>true},CASE_FRESHNESS:{verify:()=>true,block:()=>{}},idbPutMeta:(...x)=>{inserted.push(x)}};
  vm.createContext(s);vm.runInContext(journalPrelude,s);vm.runInContext(app.slice(from,to),s);s.queueCurrentMirror(JSON.stringify(s.state));pending();
  assert.equal(inserted.length,1);assert.equal(inserted[0][0],'current');assert.equal(inserted[0][1].drugAdministrations[0].id,'m2');
});
test('clinical write path also verifies ownership before accepting edits',()=>{
  const line=app.split('\n').find(x=>x.startsWith('function clinicalWriteAllowed()'));
  assert(line?.includes('!SESSION_CONTROLLER.verifyOwnership()'));
});
test('R12 does not alter vital duplicate protections or dosage modules',()=>{
  assert(app.includes('OR_VITAL_DUPLICATE_GUARD_MS=12000'));
  assert(app.includes('OR_RECORD_ORCH.commitVital('));
});
const passed=results.filter(x=>x.pass).length;
console.log(JSON.stringify({suite:'r12-wake-session-ownership',passed,total:results.length,failed:results.filter(x=>!x.pass)},null,2));
if(passed!==results.length)process.exitCode=1;
