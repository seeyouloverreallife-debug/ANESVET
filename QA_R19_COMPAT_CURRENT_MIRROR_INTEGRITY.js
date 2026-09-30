/* R15: test real isolated persistence/recovery functions against simulated multi-tab storage.
   Does not claim browser E2E or device validation. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
// Execute the real R19 fail-closed guard in isolated VM test contexts.
const journalPrelude=app.slice(app.indexOf("const RESTORE_JOURNAL_KEY="),app.indexOf("const BREED_ALIAS_KEY=")).replace(/\bwindow\b/g,'globalThis');

const createFreshness=require('./active-case-freshness.js').create;
let count=0,fail=0;
async function test(label,fn){try{await fn();console.log('PASS',label);count++}catch(e){console.error('FAIL',label,e.stack);fail++}}
function storage(initial=null){
 const data=new Map();if(initial!==null)data.set('current',initial);
 const calls=[];
 return {getItem:k=>data.get(k)??null,setItem:(k,v)=>{calls.push([k,v]);data.set(k,v)},external:(k,v)=>data.set(k,v),peek:k=>data.get(k)??null,calls};
}
function fixture(raw=null){
 const db=storage(raw), marks=[];let active=true,owner=true, callback=null,puts=[];
 const freshness=createFreshness({read:()=>db.getItem('current')});freshness.establish();
 const ctx={localStorage:db,CURRENT_KEY:'current',SESSION_CONTROLLER:{verifyOwnership:()=>owner},sessionActive:()=>active,CASE_FRESHNESS:freshness,
   BOOT:{mark:(...args)=>marks.push(args)},resetInProgress:false,currentMirrorTimer:null,clearTimeout:()=>{},setTimeout:f=>{callback=f;return 4},
   idbPutMeta:(key,value)=>{puts.push({key,value});return Promise.resolve(true)},JSON,Promise,Date,console,confirm:()=>true,
   idbGetMeta:async()=>({value:{caseId:'CASE-A',patientName:'patient',patientSaved:true,lastSavedAt:1000,records:[{id:'R1'}]},updatedAt:1000}),caseActivityEpoch:obj=>obj?.lastSavedAt||0,
   startupRecoveryNotice:null};
 vm.createContext(ctx);vm.runInContext(journalPrelude,ctx);
 const g0=app.indexOf('let startupPrimaryRaw=null;'),g1=app.indexOf('const CASE_FRESHNESS=',g0);
 vm.runInContext(app.slice(g0,g1),ctx);vm.runInContext('startupPrimaryRaw='+JSON.stringify(raw)+';',ctx);
 const from=app.indexOf('async function reconcileCurrentFromMirror(){'),to=app.indexOf('function getLegacyArchiveSeed(){',from);
 assert(from>=0&&to>from);vm.runInContext(app.slice(from,to),ctx);
 return {ctx,db,marks,freshness,get callback(){return callback},puts,setActive:v=>active=v,setOwner:v=>owner=v};
}
(async()=>{
 await test('mirror queue rejects unverified or malformed payload',()=>{const f=fixture();assert.equal(f.ctx.queueCurrentMirror(),false);assert.equal(f.ctx.queueCurrentMirror('bad json'),false);assert.equal(f.ctx.queueCurrentMirror('{}'),false);assert.equal(f.callback,null)});
 await test('mirror captures verified saved payload, not later in-memory modifications',async()=>{const initial=JSON.stringify({caseId:'CASE-A',lastSavedAt:5,drugAdministrations:[{id:'drug-1'}]});const f=fixture(initial);const inMemory={caseId:'CASE-A',drugAdministrations:[{id:'unsaved-dose'}]};f.ctx.state=inMemory;assert.equal(f.ctx.queueCurrentMirror(initial),true);f.callback();await Promise.resolve();assert.equal(f.puts.length,1);assert.equal(f.puts[0].value.drugAdministrations[0].id,'drug-1')});
 await test('mirror timer aborts after ownership loss',async()=>{const p=JSON.stringify({caseId:'CASE-A'}),f=fixture(p);f.ctx.queueCurrentMirror(p);f.setOwner(false);f.callback();await Promise.resolve();assert.equal(f.puts.length,0)});
 await test('mirror timer aborts after VIEW ONLY',async()=>{const p=JSON.stringify({caseId:'CASE-A'}),f=fixture(p);f.ctx.queueCurrentMirror(p);f.setActive(false);f.callback();await Promise.resolve();assert.equal(f.puts.length,0)});
 await test('mirror timer aborts when primary revision changes',async()=>{const p=JSON.stringify({caseId:'CASE-A',records:[]}),f=fixture(p);f.ctx.queueCurrentMirror(p);f.db.external('current',JSON.stringify({caseId:'CASE-A',records:[1]}));f.callback();await Promise.resolve();assert.equal(f.puts.length,0);assert.equal(f.freshness.isBlocked(),true)});
 await test('mirror timer uses exact primary payload, even if checksum timestamp identical',async()=>{const p=JSON.stringify({caseId:'CASE-A',lastSavedAt:20,records:[{id:'one'}]}),f=fixture(p);f.ctx.queueCurrentMirror(p);const q=JSON.stringify({caseId:'CASE-A',lastSavedAt:20,records:[{id:'two'}]});f.db.external('current',q);f.callback();await Promise.resolve();assert.equal(f.puts.length,0)});
 await test('mirror rejects newer uncommitted in-memory payload not saved',async()=>{const p=JSON.stringify({caseId:'CASE-A'}),f=fixture(p);const q=JSON.stringify({caseId:'CASE-A',records:[{id:'unsaved'}]});f.ctx.queueCurrentMirror(q);f.callback();await Promise.resolve();assert.equal(f.puts.length,0)});
 await test('mirror restore refuses corrupt primary without prompting',async()=>{const f=fixture('{bad');vm.runInContext('startupPrimaryUnreadable=true;',f.ctx);let prompts=0;f.ctx.confirm=()=>{prompts++;return true};assert.equal(await f.ctx.reconcileCurrentFromMirror(),false);assert.equal(prompts,0);assert.equal(f.db.peek('current'),'{bad');assert.equal(f.db.calls.length,0)});
 await test('VIEW ONLY cannot restore a newer mirror',async()=>{const f=fixture(null);f.setActive(false);assert.equal(await f.ctx.reconcileCurrentFromMirror(),false);assert.equal(f.db.calls.length,0)});
 await test('mirror restore refuses stale primary changed during confirm',async()=>{const p=JSON.stringify({caseId:'CASE-A',lastSavedAt:1}),f=fixture(p);f.ctx.confirm=()=>{f.db.external('current',JSON.stringify({caseId:'CASE-A',lastSavedAt:3}));return true};assert.equal(await f.ctx.reconcileCurrentFromMirror(),false);assert.equal(f.db.calls.length,0);assert(f.freshness.isBlocked())});
 await test('mirror restore persists with guarded readback and advances freshness',async()=>{const p=JSON.stringify({caseId:'CASE-A',lastSavedAt:1}),f=fixture(p);assert.equal(await f.ctx.reconcileCurrentFromMirror(),true);assert.equal(f.db.calls.length,1);assert.equal(f.freshness.verify(),true);assert.equal(JSON.parse(f.db.peek('current')).lastSavedAt,1000)});
 await test('mirror restore refuses another session owner',async()=>{const p=JSON.stringify({caseId:'CASE-A',lastSavedAt:1}),f=fixture(p);f.setOwner(false);assert.equal(await f.ctx.reconcileCurrentFromMirror(),false);assert.equal(f.db.calls.length,0)});
 await test('mirror write failure is logged without an uncaught exception',async()=>{const p=JSON.stringify({caseId:'CASE-A'}),f=fixture(p);f.ctx.idbPutMeta=()=>{throw Error('IndexedDB unavailable')};f.ctx.queueCurrentMirror(p);assert.doesNotThrow(()=>f.callback());assert(f.marks.some(m=>m[0]==='current-mirror-write-failed'))});
 await test('startup guard runs even without a recovery candidate',()=>{assert(app.includes("if(startupPrimaryUnreadable)CASE_FRESHNESS.block('startup-primary-unreadable');"));assert(app.indexOf('if(startupPrimaryUnreadable)CASE_FRESHNESS.block')>app.lastIndexOf('load();'));assert(app.includes("reason==='startup-primary-unreadable'"))});
 await test('save and sealed save pass verified persisted payload to mirror',()=>{assert(app.includes('queueCurrentMirror(payload);'));assert(!app.includes('queueCurrentMirror();'));assert(app.includes("if(localStorage.getItem(CURRENT_KEY)!==payload)throw new Error('Final save read-back failed')"))});
 await test('archive import bridge queues only after readback',()=>{const line=app.split('\n').find(x=>x.includes('persistCurrentState:(next)=>'));assert(line?.includes('if(localStorage.getItem(CURRENT_KEY)!==payload)return false'));assert(line.includes('queueCurrentMirror(payload)'))});
 console.log(JSON.stringify({checkpoint:'R15',focusedPassed:count,total:count+fail,failed:fail}));if(fail)process.exitCode=1;
})();
