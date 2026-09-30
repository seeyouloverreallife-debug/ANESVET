/* R19: exercises the REAL Restore Controller with interruption + read-back scenarios. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const source=fs.readFileSync(__dirname+'/backup-restore-controller.js','utf8');
const appSource=fs.readFileSync(__dirname+'/app.js','utf8');
const clone=x=>x==null?x:JSON.parse(JSON.stringify(x));
const JOURNAL='anesvet_restore_journal_r19',META='restore_transaction_journal_r19';
let passed=0,failed=0;
async function test(label,fn){try{await fn();console.log('PASS',label);passed++}catch(e){console.error('FAIL',label,e.stack||e);failed++}}
function make(opts={}){
 const ls=opts.ls||new Map(),idb=opts.idb||new Map(),trace=[];
 const saved={caseId:'ORIGINAL',records:[{id:'p1',amount:1}]};
 if(!ls.has('current'))ls.set('current',JSON.stringify(saved));
 let owner='A',caseCache=[{caseId:'A1',records:[{map:78}]}],patientCache=[{patientId:'P1',patientName:'Before',patientNameLower:'before',updatedAt:1}],dbCases=clone(caseCache),dbPatients=clone(patientCache),dbCurrent=clone(saved),writes=0;
 const storage={getItem:k=>ls.get(k)??null,setItem:(k,v)=>{
  trace.push('local:'+k);
  if(opts.rejectMarker&&k===JOURNAL)throw Error('Storage quota denied');
  if(opts.silentMarker&&k===JOURNAL)return;
  if(opts.takeoverAt==='local-current'&&k==='current')owner='B';
  ls.set(k,String(v));
 },removeItem:k=>{trace.push('removed:'+k);if(opts.rejectMarkerRemove&&k===JOURNAL)throw Error('marker cleanup denied');ls.delete(k)}};
 const sandbox={console,localStorage:storage,TextEncoder,Date,crypto:{randomUUID:()=>crypto.randomUUID()},prompt:()=>opts.promptValue??'REVIEW'};
 vm.createContext(sandbox);vm.runInContext(source,sandbox);
 const ctx={ $:()=>null,appVersion:'17.2.23',
  keys:{current:'current',settings:'settings',drugLibrary:'drugs',quickPreset:'presets',protocolAudit:'audit',breedAlias:'breeds',archive:'archive',patientFallback:'patients'},
  getState:()=>saved,sha256Text:async s=>crypto.createHash('sha256').update(s).digest('hex'),computeCaseChecksum:async()=>'',
  getArchive:()=>clone(caseCache),getPatients:()=>clone(patientCache),getArchiveCache:()=>caseCache,getPatientCache:()=>patientCache,
  setArchiveCache:x=>{caseCache=clone(x)},setPatientCache:x=>{patientCache=clone(x)},
  getArchiveBackend:()=> 'IndexedDB',getPatientBackend:()=> 'IndexedDB',
  initArchiveDb:async()=>{if(opts.takeoverAt==='init')owner='B'},canWriteCurrent:()=>owner==='A',canRestoreWrite:()=>owner==='A',authorizeAction:async()=>({ok:true}),
  idbPutMeta:async (k,v)=>{trace.push('idb-meta:'+k);
   if(k===META&&opts.rejectJournal)return false;
   if(k===META&&opts.silentJournal)return true;
   idb.set(k,clone(v));if(k===META&&v?.stage==='database-initialized'&&opts.takeoverAt==='journal-dbinitialized')owner='B';if(k===META&&v?.stage==='completed'&&opts.takeoverAt==='journal-completed')owner='B';return true},
  idbGetMeta:async k=>idb.has(k)?{value:clone(idb.get(k))}:null,
  coreStorage:{replaceDataset:async x=>{writes++;trace.push('db-write');dbCases=clone(x.cases);dbPatients=clone(x.patients);dbCurrent=clone(x.current);if(opts.takeoverAt==='database')owner='B';if(opts.throwDatabase&&writes===1)throw Error('IDB failed');return true},
   getAllCases:async()=>clone(dbCases),getAllPatients:async()=>clone(dbPatients),getMeta:async k=>k==='current'?{value:clone(dbCurrent)}:null},
  patientFromCase:c=>({patientId:'p'+c.caseId,patientName:c.patientName||''}),patientIdentityKey:p=>p.patientId,
  loadBreedAliases:()=>[],getPilotFeedbackQueue:()=>[],setPilotFeedbackQueue:()=>{}
 };
 const ctrl=sandbox.ANESVET_BACKUP_RESTORE_CONTROLLER.create(ctx);
 const backup={format:'ANESVET_BACKUP',backupSchema:1,backupId:'R19-BACKUP',version:'17.2.20',current:{caseId:'RESTORED',records:[{dose:2}]},archive:[{caseId:'A2',records:[{map:90}]}],patients:[{patientId:'P2',patientName:'After',patientNameLower:'after',updatedAt:1}],drugLibrary:[],quickPresets:[],protocolAudit:[],breedAliases:[],pilotFeedbackQueue:[]};
 return {ls,idb,trace,ctrl,backup,sandbox,setOwner:o=>owner=o,get owner(){return owner},get writes(){return writes},get dbCurrent(){return dbCurrent}};
}
(async()=>{
 await test('completed restore preserves durable audit but removes fail-closed sentinel',async()=>{
  const f=make(),r=await f.ctrl.applyRestorePayload(f.backup);assert.equal(r.ok,true);assert.equal(f.ls.has(JOURNAL),false);assert.equal(f.idb.get(META).state,'completed');assert.equal((await f.ctrl.readRestoreJournal()).pending,false);
  assert.equal(f.dbCurrent.caseId,'RESTORED');assert.equal(JSON.parse(f.ls.get('current')).caseId,'RESTORED');
 });
 await test('journal captures stage and no patient-identifying data',async()=>{
  const f=make();await f.ctrl.applyRestorePayload(f.backup);const j=f.idb.get(META);assert.equal(j.stage,'completed');assert.equal(j.backupId,'R19-BACKUP');assert(j.snapshotDigest?.length===64);assert(!JSON.stringify(j).includes('dose'));
 });
 await test('journal IndexedDB denied: aborts before destructive clinical write',async()=>{
  const f=make({rejectJournal:true});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/journal/i);assert.equal(f.writes,0);assert.equal((await f.ctrl.readRestoreJournal()).pending,true);assert.equal(JSON.parse(f.ls.get('current')).caseId,'ORIGINAL');
 });
 await test('journal IndexedDB silently ignores write: readback prevents commit',async()=>{
  const f=make({silentJournal:true});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/journal/i);assert.equal(f.writes,0);assert(f.ls.has(JOURNAL));
 });
 await test('local sentinel write blocked: aborts before IDB replacement',async()=>{
  const f=make({rejectMarker:true});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/quota/i);assert.equal(f.writes,0);assert.equal(JSON.parse(f.ls.get('current')).caseId,'ORIGINAL');
 });
 await test('local sentinel write silently ignored: detects failed readback',async()=>{
  const f=make({silentMarker:true});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/sentinel/i);assert.equal(f.writes,0);
 });
 await test('crash during journal retirement retains fail-closed sentinel',async()=>{const f=make({takeoverAt:'journal-completed'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session/i);assert.equal(JSON.parse(f.ls.get(JOURNAL)).state,'running');assert.equal(f.idb.get(META).state,'completed');assert.equal((await f.ctrl.readRestoreJournal()).pending,true)});
 await test('takeover AFTER IndexedDB commits leaves forensic journal and snapshot',async()=>{
  const f=make({takeoverAt:'database'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session|partial/i);assert.equal(f.writes,1);assert.equal(f.dbCurrent.caseId,'RESTORED');assert.equal(JSON.parse(f.ls.get('current')).caseId,'ORIGINAL');
  const st=await f.ctrl.readRestoreJournal();assert.equal(st.pending,true);assert.equal(st.stage,'database-initialized');assert.equal(st.snapshotVerified,true);assert.equal(f.idb.has('pre_restore_backup'),true);
 });
 await test('reloaded controller reads existing interrupted marker without editing clinical data',async()=>{
  const f=make({takeoverAt:'database'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));const g=make({ls:f.ls,idb:f.idb});const before=f.ls.get('current');const st=await g.ctrl.inspectInterruptedRestore();assert.equal(st.pending,true);assert.equal(g.ls.get('current'),before);assert.equal(g.writes,0);
 });
 await test('starting another restore with pending marker is refused before mutation',async()=>{
  const f=make({takeoverAt:'database'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));f.setOwner('A');await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/unfinished transaction journal/i);assert.equal(f.writes,1);
 });
 await test('takeover during local Current Case write stops later local keys and never auto-rolls-back',async()=>{
  const f=make({takeoverAt:'local-current'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/ownership|session|partial/i);assert.equal(f.writes,1);assert.equal(f.ls.get('drugs'),undefined);assert.equal((await f.ctrl.readRestoreJournal()).pending,true);
 });
 await test('corrupt marker is treated as incomplete',async()=>{
  const f=make();f.ls.set(JOURNAL,'{{{');const status=await f.ctrl.readRestoreJournal();assert.equal(status.pending,true);await assert.rejects(f.ctrl.applyRestorePayload(f.backup),/unfinished/i);assert.equal(f.writes,0);
 });
 await test('unreviewed pending status is blocked without active ownership',async()=>{
  const f=make({takeoverAt:'database'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));await assert.rejects(f.ctrl.acknowledgeInterruptedRestore(),/VIEW ONLY/i);assert.equal((await f.ctrl.readRestoreJournal()).pending,true);
 });
 await test('manual REVIEW with verified snapshot retires marker, keeps data and journal audit',async()=>{
  const f=make({takeoverAt:'journal-dbinitialized'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));f.setOwner('A');const clinicalBefore=f.ls.get('current');const dbBefore=f.dbCurrent;
  const ack=await f.ctrl.acknowledgeInterruptedRestore();assert.equal(ack.ok,true);assert.equal(f.ls.has(JOURNAL),false);assert.equal(f.idb.get(META).state,'reviewed');assert.deepEqual(f.dbCurrent,dbBefore);assert.equal(f.ls.get('current'),clinicalBefore);assert.equal(f.idb.has('pre_restore_backup'),true);
 });
 await test('manual REVIEW requires exact confirmation',async()=>{
  const f=make({takeoverAt:'journal-dbinitialized',promptValue:'NO'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));f.setOwner('A');await assert.rejects(f.ctrl.acknowledgeInterruptedRestore(),/REVIEW confirmation/i);assert.equal((await f.ctrl.readRestoreJournal()).pending,true);
 });
 await test('manual REVIEW refuses corrupt rollback snapshot and does not clear journal',async()=>{
  const f=make({takeoverAt:'journal-dbinitialized'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));f.setOwner('A');f.idb.get('pre_restore_backup').payload.current.caseId='BAD';await assert.rejects(f.ctrl.acknowledgeInterruptedRestore(),/verified/i);assert(f.ls.has(JOURNAL));
 });
 await test('manual REVIEW refuses inconsistent clinical Current Case across stores',async()=>{const f=make({takeoverAt:'database'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));f.setOwner('A');const before=await f.ctrl.readRestoreJournal();assert.equal(before.currentStoresMatch,false);await assert.rejects(f.ctrl.acknowledgeInterruptedRestore(),/not verified/i);assert(f.ls.has(JOURNAL))});
 await test('manual REVIEW refuses local/IDB journal mismatch',async()=>{
  const f=make({takeoverAt:'journal-dbinitialized'});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));f.setOwner('A');f.idb.get(META).stage='OTHER';await assert.rejects(f.ctrl.acknowledgeInterruptedRestore(),/not verified/i);assert(f.ls.has(JOURNAL));
 });
 await test('unverified rollback stays fail-closed and preserves journal',async()=>{
  const f=make({throwDatabase:true});await assert.rejects(f.ctrl.applyRestorePayload(f.backup));assert.equal((await f.ctrl.readRestoreJournal()).pending,true);assert.equal(f.ls.has(JOURNAL),true);assert.equal(f.dbCurrent.caseId,'ORIGINAL');
 });
 await test('no clinical writes allowed during unfinished journal (source guard)',()=>{
  assert(appSource.includes('function restoreJournalNeedsReview()'));
  assert(appSource.includes("if(restoreJournalNeedsReview()){renderSaveState('error')"));
  assert(appSource.includes("if(restoreJournalNeedsReview())CASE_FRESHNESS.block('interrupted-restore-requires-review')"));
  assert(appSource.includes('canWriteCurrent:()=>!restoreJournalNeedsReview()'));
  assert(appSource.includes('function clinicalWriteAllowed(){if(restoreJournalNeedsReview())'));
 });
 console.log('R19 summary',JSON.stringify({passed,failed,total:passed+failed}));if(failed)process.exitCode=1;
})();
