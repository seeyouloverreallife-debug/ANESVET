/* R18 — restore-session loss tests running the real backup-restore-controller.js
   Two-tab ownership changes are simulated at asynchronous storage boundaries. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const source=fs.readFileSync(__dirname+'/backup-restore-controller.js','utf8');
const copy=x=>x==null?x:JSON.parse(JSON.stringify(x));
let passed=0,failed=0;
async function check(label,run){try{await run();console.log('PASS',label);passed++}catch(err){failed++;console.error('FAIL',label,err.stack||err)}}
function make(options={}){
 const ls=new Map(),idb=new Map(),trace=[];
 const current={caseId:'OLD',records:[{drug:'propofol',amount:1}]};
 ls.set('current',JSON.stringify(current));
 let owner='A',cache=[{caseId:'ARCH-OLD',records:[{spo2:97}]}],patients=[{patientId:'P-OLD',patientName:'Old'}],
   durableCases=copy(cache),durablePatients=copy(patients),durableCurrent=copy(current),writes=0;
 const storage={
  getItem:k=>ls.get(k)??null,
  setItem:(k,v)=>{trace.push('local:'+k);if(options.onSet)options.onSet(k,{takeover,ls});ls.set(k,String(v))},
  removeItem:k=>{trace.push('remove:'+k);ls.delete(k)}
 };
 function takeover(){owner='B';trace.push('takeover')}
 const sandbox={console,localStorage:storage,crypto:{randomUUID:()=>crypto.randomUUID()},TextEncoder,setTimeout,Date};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 const ctx={
  $:()=>null,keys:{current:'current',settings:'settings',drugLibrary:'drugs',quickPreset:'presets',protocolAudit:'audit',breedAlias:'breeds',archive:'archive',patientFallback:'patients'},
  appVersion:'17.2.22',getState:()=>current,save:()=>true,
  sha256Text:async str=>crypto.createHash('sha256').update(str).digest('hex'),computeCaseChecksum:async()=>'',
  getArchive:()=>copy(cache),getPatients:()=>copy(patients),getArchiveCache:()=>cache,setArchiveCache:x=>{cache=copy(x)},getPatientCache:()=>patients,setPatientCache:x=>{patients=copy(x)},
  getArchiveBackend:()=> 'IndexedDB',getPatientBackend:()=> 'IndexedDB',
  initArchiveDb:async()=>{trace.push('initDb');if(options.takeoverAt==='init')takeover()},
  authorizeAction:async()=>({ok:true}),
  canWriteCurrent:()=>owner==='A',canRestoreWrite:()=>owner==='A',
  idbPutMeta:async(k,v)=>{trace.push('meta:'+k);idb.set(k,copy(v));return true},
  idbGetMeta:async k=>idb.has(k)?{value:copy(idb.get(k))}:null,
  coreStorage:{
   replaceDataset:async x=>{writes++;trace.push('replace:'+writes);durableCases=copy(x.cases);durablePatients=copy(x.patients);durableCurrent=copy(x.current);
    if(options.takeoverAt==='replace'&&writes===1)takeover();
    if(options.throwReplace&&writes===1)throw Error('IDB transaction failed');
    return true},
   getAllCases:async()=>{trace.push('getCases');if(options.takeoverAt==='readback')takeover();return copy(durableCases)},
   getAllPatients:async()=>copy(durablePatients),getMeta:async k=>k==='current'?{value:copy(durableCurrent)}:null,
  },
  patientFromCase:c=>({patientId:'p-'+c.caseId,patientName:c.patientName||''}),patientIdentityKey:p=>p.patientId,
  loadBreedAliases:()=>[],loadDrugLibraryData:()=>[],loadQuickPresets:()=>[],getProtocolAudit:()=>[],getPilotFeedbackQueue:()=>[],
 };
 const ctrl=sandbox.ANESVET_BACKUP_RESTORE_CONTROLLER.create(ctx);
 const backup={format:'ANESVET_BACKUP',backupSchema:1,version:'17.2.21',backupId:'RESTORE',exportedAt:1,
  current:{caseId:'NEW',records:[{drug:'propofol',amount:2}]},archive:[{caseId:'ARCH-NEW',records:[{spo2:98}]}],
  patients:[{patientId:'P-NEW',patientName:'New',patientNameLower:'new',updatedAt:1}],
  drugLibrary:[],quickPresets:[],protocolAudit:[],breedAliases:[],pilotFeedbackQueue:[]};
 return {ctrl,backup,ls,idb,trace,takeover,get owner(){return owner},get writes(){return writes},get durableCurrent(){return durableCurrent}};
}
(async()=>{
 await check('normal verified restore works',async()=>{const f=make();const result=await f.ctrl.applyRestorePayload(f.backup);assert.equal(result.ok,true);assert.equal(JSON.parse(f.ls.get('current')).caseId,'NEW')});
 await check('takeover during DB initialization blocks destructive write',async()=>{const f=make({takeoverAt:'init'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/session|ownership|control/i);assert.equal(f.writes,0);assert.equal(JSON.parse(f.ls.get('current')).caseId,'OLD');assert(f.idb.has('pre_restore_backup'))});
 await check('takeover while IDB transaction commits cannot rollback via old tab',async()=>{const f=make({takeoverAt:'replace'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session|partial/i);assert.equal(f.writes,1);assert.equal(JSON.parse(f.ls.get('current')).caseId,'OLD');assert(f.idb.has('pre_restore_backup'))});
 await check('takeover during readback stops receipt and old-tab rollback',async()=>{const f=make({takeoverAt:'readback'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session|partial/i);assert.equal(f.writes,1);assert(!f.trace.some(x=>x==='local:anesvet_v16_19_last_restore_verification'));assert(f.idb.has('pre_restore_backup'))});
 await check('takeover in a synchronous local write error skips rollback',async()=>{const f=make({onSet:(k,{takeover})=>{if(k==='current'){takeover();throw Error('failed write')}}});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session|partial/i);assert.equal(f.writes,1);assert(f.idb.has('pre_restore_backup'))});
 await check('ordinary owned restore error rolls back IDB and local case',async()=>{const f=make({throwReplace:true});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/IDB transaction failed/);assert.equal(f.writes,2);assert.equal(f.durableCurrent.caseId,'OLD');assert.equal(JSON.parse(f.ls.get('current')).caseId,'OLD')});
 await check('ownership lost after restore verification never issues success receipt',async()=>{const f=make({onSet:(k,{takeover})=>{if(k==='anesvet_v16_19_last_restore_verification')takeover()}});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session|partial/i);assert(f.idb.has('pre_restore_backup'))});
 console.log(JSON.stringify({checkpoint:'R18',passed,failed,total:passed+failed}));if(failed)process.exitCode=1;
})();
