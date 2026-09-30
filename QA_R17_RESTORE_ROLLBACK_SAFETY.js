/* R17: real Backup Restore Controller, simulated browser/IndexedDB failures.
   Tests deliberately distinguish persisted database contents from UI caches. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const controllerSource=fs.readFileSync(__dirname+'/backup-restore-controller.js','utf8');
let passed=0,failed=0;
async function test(name,fn){try{await fn();console.log('PASS',name);passed++}catch(e){console.error('FAIL',name,e.stack||e);failed++}}
const clone=v=>v==null?v:JSON.parse(JSON.stringify(v));
function fixture(opts={}){
 const ls=new Map(), idb=new Map();
 const storage={getItem:k=>ls.get(k)??null,setItem:(k,v)=>{if(opts.ignoreDrugStore&&k==='drugs')return;ls.set(k,String(v))},removeItem:k=>ls.delete(k)};
 const sandbox={console,localStorage:storage,TextEncoder,crypto:{randomUUID:()=>crypto.randomUUID()},setTimeout,Date};
 vm.createContext(sandbox);vm.runInContext(controllerSource,sandbox);
 let state={caseId:'LIVE',patientName:'Before',records:[{id:'vital',map:83}],caseLocked:false};
 let archiveCache=[{caseId:'OLD-CASE',patientName:'Old archived',records:[{id:'old',etco2:37}]}],patientCache=[{patientId:'OLD-P',patientName:'Old patient',patientNameLower:'old patient',updatedAt:1}];
 let durableArchive=clone(archiveCache),durablePatients=clone(patientCache),durableCurrent=clone(state),writes=0;
 ls.set('current',JSON.stringify(state));
 const ctx={ $:()=>null,keys:{current:'current',archive:'archive',patientFallback:'patients',settings:'settings',drugLibrary:'drugs',quickPreset:'presets',protocolAudit:'audit',breedAlias:'breeds'},
   appVersion:'17.2.20',getState:()=>state,save:()=>{if(opts.saveFails)return false;storage.setItem('current',JSON.stringify(state));return true},
   sha256Text:async text=>crypto.createHash('sha256').update(text).digest('hex'),computeCaseChecksum:async()=>'',
   getArchive:()=>clone(archiveCache),getPatients:()=>clone(patientCache),getArchiveCache:()=>archiveCache,getPatientCache:()=>patientCache,
   setArchiveCache:rows=>{archiveCache=clone(rows);if(opts.corruptCache&&archiveCache[0])archiveCache[0].records=[{id:'altered',map:0}]},
   setPatientCache:rows=>{patientCache=clone(rows)},getArchiveBackend:()=> 'IndexedDB',getPatientBackend:()=> 'IndexedDB',
   initArchiveDb:async()=>{},initPatientMaster:async()=>{},
   authorizeAction:async()=>({ok:true}),canWriteCurrent:()=>opts.viewOnly!==true,
   idbPutMeta:async(k,v)=>{if((opts.snapshotWriteFails||opts.failSnapshotCleanup&&v===null)&&k==='pre_restore_backup')return false;idb.set(k,clone(v));return true},
   idbGetMeta:async k=>{if(opts.snapshotReadFails&&k==='pre_restore_backup')return null;return idb.has(k)?{value:clone(idb.get(k))}:null},
   coreStorage:{replaceDataset:async data=>{writes++;if(opts.failRollbackWrite&&writes>=2)throw Error('rollback write failed');if(opts.noRealDbWrite)return true;durableArchive=clone(data.cases);durablePatients=clone(data.patients);durableCurrent=clone(data.current);if(opts.corruptDb&&durableArchive[0])durableArchive[0].records=[{id:'altered',map:0}];return true},
    getAllCases:async()=>clone(durableArchive),getAllPatients:async()=>clone(durablePatients),getMeta:async k=>k==='current'?{value:clone(durableCurrent)}:null},
   patientFromCase:c=>({patientId:c.patientId||'P-'+c.caseId,patientName:c.patientName||''}),patientIdentityKey:p=>p.patientId,
   loadBreedAliases:()=>[],loadDrugLibraryData:()=>[],loadQuickPresets:()=>[],getProtocolAudit:()=>[],getPilotFeedbackQueue:()=>[],
   formatDate:()=>'',formatClock:()=>'',renderArchives:()=>{},hasMutableActiveCase:()=>true,
 };
 const ctrl=sandbox.ANESVET_BACKUP_RESTORE_CONTROLLER.create(ctx);assert(ctrl);
 const backup={format:'ANESVET_BACKUP',backupSchema:1,version:'16.5',backupId:'LEGACY',exportedAt:1,
  current:{caseId:'NEW',patientName:'New',records:[{id:'drug',dose:1.8}]},
  archive:[{caseId:'NEW-ARCHIVE',patientName:'Arch',records:[{id:'vital',spo2:99,etco2:43}]}],
  patients:[{patientId:'NEW-P',patientName:'New patient',patientNameLower:'new patient',updatedAt:1}],
  drugLibrary:[],quickPresets:[],protocolAudit:[],breedAliases:[],pilotFeedbackQueue:[]};
 return {ctrl,backup,ctx,idb,ls,storage,get writes(){return writes},get durableArchive(){return durableArchive},get archiveCache(){return archiveCache},get durablePatients(){return durablePatients}};
}
(async()=>{
 await test('legacy backup restores completely when snapshot and stores persist',async()=>{const f=fixture();const r=await f.ctrl.applyRestorePayload(clone(f.backup));assert.equal(r.ok,true);assert.equal(r.verification.ok,true);assert.equal(r.rollbackStored,true);assert.equal(f.writes,1)});
 await test('no snapshot write must block destructive restore',async()=>{const f=fixture({snapshotWriteFails:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/snapshot|rollback/i);assert.equal(f.writes,0);assert.equal(JSON.parse(f.storage.getItem('current')).caseId,'LIVE')});
 await test('snapshot success without readback must block destructive restore',async()=>{const f=fixture({snapshotReadFails:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/snapshot|rollback/i);assert.equal(f.writes,0)});
 await test('legacy backup cannot report success when cached archived vitals altered',async()=>{const f=fixture({corruptCache:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/verification/i)});
 await test('legacy backup cannot report success when IndexedDB contents differ from cache',async()=>{const f=fixture({corruptDb:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/verification/i)});
 await test('no-op IndexedDB transaction must not pass restore verification',async()=>{const f=fixture({noRealDbWrite:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/verification/i)});
 await test('medication library silent write failure cannot report restore success',async()=>{const f=fixture({ignoreDrugStore:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/verification/i)});
 await test('VIEW ONLY must not modify the dataset',async()=>{const f=fixture({viewOnly:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/view only|session|control/i);assert.equal(f.writes,0)});
 await test('snapshot with uncommitted current case cannot proceed',async()=>{const f=fixture({saveFails:true});f.ctx.getState().records.push({id:'unsaved'});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/current|save|snapshot/i);assert.equal(f.writes,0)});
 await test('full-manifest backup keeps SHA-256 verification after durable restore',async()=>{const f=fixture();const raw=await f.ctrl.ensureIntegrityManifest(clone(f.backup));const r=await f.ctrl.applyRestorePayload(raw);assert.equal(r.verification.level,'full');assert.equal(r.verification.clinicalDigestMatch,true)});
 await test('manifest digest mismatch blocks restore before any destructive write',async()=>{const f=fixture();const raw=await f.ctrl.ensureIntegrityManifest(clone(f.backup));raw.archive[0].records[0].spo2=85;await assert.rejects(f.ctrl.applyRestorePayload(raw),/digest mismatch/i);assert.equal(f.writes,0)});
 await test('failed automatic rollback is reported and snapshot remains available',async()=>{const f=fixture({corruptCache:true,failRollbackWrite:true});await assert.rejects(f.ctrl.applyRestorePayload(clone(f.backup)),/rollback was incomplete/i);assert(await f.ctrl.getPreRestoreSnapshot())});
 await test('snapshot cleanup failure cannot claim complete rollback',async()=>{const f=fixture({failSnapshotCleanup:true});await f.ctrl.applyRestorePayload(clone(f.backup));await assert.rejects(f.ctrl.rollbackLastRestore(),/snapshot/i);assert(await f.ctrl.getPreRestoreSnapshot())});
 await test('rollback returns exactly to the pre-restore clinical data and consumes snapshot',async()=>{const f=fixture();const a=clone(f.durableArchive);await f.ctrl.applyRestorePayload(clone(f.backup));const r=await f.ctrl.rollbackLastRestore();assert(r.ok);assert.deepEqual(clone(f.durableArchive),a);assert.equal((await f.ctrl.getPreRestoreSnapshot()),null)});
 console.log(JSON.stringify({checkpoint:'R17',passed,failed,total:passed+failed}));if(failed)process.exitCode=1;
})();
