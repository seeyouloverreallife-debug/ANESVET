/* R16 regression: Archive working-copy loading must not replace UI state or reload
 * until the current-case persistence bridge confirms a verified save.
 * Runs isolated shipped controller code with simulated storage/session behaviour.
 */
'use strict';
const assert=require('assert'),fs=require('fs'),vm=require('vm');
const archiveController=require('./finalization-archive-controller.js');
const appSource=fs.readFileSync(__dirname+'/app.js','utf8');
let passed=0,failed=0;
async function test(label,run){try{await run();passed++;console.log('PASS',label)}catch(e){failed++;console.error('FAIL',label,e.stack||e)}}
function makeFixture({locked=false,confirm=true,persist=()=>true,archived=null}={}){
  const original={caseId:'LIVE-1',patientName:'Current',records:[{id:'existing'}],timer:{elapsedMs:111,running:true}};
  const archive=archived||{caseId:'WORK-1',patientName:'Archived',caseLocked:locked,records:[{id:'archived'}],timer:{elapsedMs:4000,running:true,startedEpoch:3}};
  let state=original,confirmed=0;const log=[],messages=[];
  const bridge={
    $:()=>({}),$$:()=>[],getState:()=>state,toast:m=>messages.push(m),confirm:()=>{confirmed++;return confirm},
    getArchiveCache:()=>[archive],getLegacyArchiveSeed:()=>[],
    persistCurrentState:persist===null?null:(next)=>{log.push(['persist',next.caseId]);return persist(next)},
    replaceState:(next)=>{log.push(['replace',next.caseId]);state=next},
    queueCurrentMirror:()=>log.push(['unexpected-extra-mirror']),
    restartAtAppRoot:()=>{log.push(['restart'])}
  };
  const controller=archiveController.create(bridge);assert(controller,'controller available');
  return {controller,archive,original,log,messages,get state(){return state},get confirmed(){return confirmed}};
}
function actualPersistBridge({initial,active=true,ownership=true,upToDate=true,failSet=false,silent=false}={}){
  let stored=JSON.stringify(initial||{caseId:'LIVE-1'}),commits=[],mirrors=[];
  const localStorage={getItem:()=>stored,setItem:(_k,v)=>{if(failSet)throw Error('Quota exceeded');if(!silent)stored=v}};
  const sourceStart=appSource.indexOf('persistCurrentState:(next)=>{');
  const sourceEnd=appSource.indexOf(',queueCurrentMirror,restartAtAppRoot,',sourceStart);
  assert(sourceStart>=0&&sourceEnd>sourceStart,'real app bridge available');
  const fragment=appSource.slice(sourceStart,sourceEnd);
  const sandbox={sessionActive:()=>active,SESSION_CONTROLLER:{verifyOwnership:()=>ownership},CASE_FRESHNESS:{verify:()=>upToDate,committed:p=>commits.push(p)},localStorage,CURRENT_KEY:'CURRENT',queueCurrentMirror:p=>mirrors.push(p),JSON};
  const fn=vm.runInNewContext('({'+fragment+'})',sandbox).persistCurrentState;
  return {fn,get stored(){return stored},commits,mirrors};
}
(async()=>{
  await test('unavailable archive index does not change state',()=>{const f=makeFixture();assert.equal(f.controller.loadArchive(100),false);assert.strictEqual(f.state,f.original);assert.equal(f.log.length,0)});
  await test('locked final record cannot load as working copy',()=>{const f=makeFixture({locked:true});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(f.log.length,0);assert.equal(f.confirmed,0)});
  await test('cancelled working copy load leaves case intact',()=>{const f=makeFixture({confirm:false});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(f.log.length,0)});
  await test('explicit persistence failure blocks replacement and restart',()=>{const f=makeFixture({persist:()=>false});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.deepEqual(f.log,[['persist','WORK-1']]);assert(f.messages.length>0)});
  await test('storage exception blocks replacement and restart',()=>{const f=makeFixture({persist:()=>{throw Error('storage disabled')}});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.deepEqual(f.log,[['persist','WORK-1']])});
  await test('missing persistence callback never switches cases',()=>{const f=makeFixture({persist:null});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(f.log.length,0)});
  await test('undefined persistence result is not interpreted as success',()=>{const f=makeFixture({persist:()=>undefined});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.deepEqual(f.log,[['persist','WORK-1']])});
  await test('verified save precedes in-memory switch and restart',()=>{const f=makeFixture();assert.equal(f.controller.loadArchive(0),true);assert.deepEqual(f.log,[['persist','WORK-1'],['replace','WORK-1'],['restart']]);assert.equal(f.state.caseId,'WORK-1')});
  await test('loaded copy timer is stopped without mutating archive cache',()=>{const f=makeFixture();f.controller.loadArchive(0);assert.equal(f.state.timer.running,false);assert.equal(f.state.timer.startedEpoch,null);assert.equal(f.state.timer.elapsedMs,4000);assert.equal(f.archive.timer.running,true);assert.equal(f.archive.timer.startedEpoch,3)});
  await test('verified save does not separately queue an unverified mirror',()=>{const f=makeFixture();f.controller.loadArchive(0);assert(!f.log.some(x=>x[0]==='unexpected-extra-mirror'))});
  await test('real persistence bridge rejects VIEW ONLY',()=>{const b=actualPersistBridge({active:false});const f=makeFixture({persist:b.fn});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(b.mirrors.length,0)});
  await test('real persistence bridge rejects lost ownership',()=>{const b=actualPersistBridge({ownership:false});const f=makeFixture({persist:b.fn});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(b.mirrors.length,0)});
  await test('real persistence bridge rejects stale primary revision',()=>{const b=actualPersistBridge({upToDate:false});const f=makeFixture({persist:b.fn});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(b.mirrors.length,0)});
  await test('real persistence bridge rejects quota errors',()=>{const b=actualPersistBridge({failSet:true});const f=makeFixture({persist:b.fn});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(b.mirrors.length,0)});
  await test('real persistence bridge rejects silent ignored writes',()=>{const b=actualPersistBridge({silent:true});const f=makeFixture({persist:b.fn});f.controller.loadArchive(0);assert.strictEqual(f.state,f.original);assert.equal(b.mirrors.length,0)});
  await test('real persistence bridge commits once then mirrors matching data',()=>{const b=actualPersistBridge();const f=makeFixture({persist:b.fn});f.controller.loadArchive(0);assert.equal(f.state.caseId,'WORK-1');assert.equal(JSON.parse(b.stored).caseId,'WORK-1');assert.equal(b.commits.length,1);assert.equal(b.mirrors.length,1);assert.equal(b.commits[0],b.mirrors[0])});
  console.log(JSON.stringify({checkpoint:'R16',passed,total:passed+failed,failed}));if(failed)process.exitCode=1;
})();
