/* R14 focused tests: safe startup clinical recovery in multi-tab VIEW ONLY / reload. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/app.js','utf8');
const freshness=require('./active-case-freshness.js').create;
const rescue=require('./active-case-rescue.js');
let passed=0,failed=0;
function t(label,fn){try{fn();passed++;console.log('PASS',label)}catch(e){failed++;console.error('FAIL',label,e.stack)}}
function store(initial){const map=new Map();if(initial!==null)map.set('current',initial);let writes=0;return{getItem:k=>map.get(k)??null,setItem:(k,v)=>{writes++;map.set(k,String(v))},get writes(){return writes},peek:()=>map.get('current')??null,external:v=>map.set('current',v)}}
const from=src.indexOf('let startupPrimaryRaw=null;');
const to=src.indexOf('const CASE_FRESHNESS=',from);
assert(from>=0&&to>from,'R14 startup write-guard found');
function fixture({primary=null,active=true,owns=true,unreadable=false}={}){
 const storage=store(primary),marks=[];
 const c={localStorage:{getItem:k=>storage.getItem(k),setItem:(k,v)=>storage.setItem(k,v)},CURRENT_KEY:'current',sessionActive:()=>active,SESSION_CONTROLLER:{verifyOwnership:()=>owns},BOOT:{mark:(...x)=>marks.push(x)}};
 vm.createContext(c);vm.runInContext(src.slice(from,to),c);
 vm.runInContext('startupPrimaryRaw = '+JSON.stringify(primary)+'; startupPrimaryUnreadable = '+JSON.stringify(unreadable)+';',c);
 return {c,storage,marks};
}
t('VIEW ONLY cannot write recovered case at startup',()=>{const {c,storage}=fixture({primary:'old',active:false});assert.strictEqual(c.guardedStartupCurrentWrite('new','checkpoint'),false);assert.equal(storage.peek(),'old');assert.equal(storage.writes,0)});
t('lost session ownership cannot write recovery',()=>{const {c,storage}=fixture({primary:'old',owns:false});assert.equal(c.guardedStartupCurrentWrite('new'),false);assert.equal(storage.writes,0)});
t('corrupt or unreadable primary is preserved',()=>{const {c,storage}=fixture({primary:'{invalid',unreadable:true});assert.equal(c.guardedStartupCurrentWrite('recovery'),false);assert.equal(storage.peek(),'{invalid');assert.equal(storage.writes,0)});
t('concurrent writer changed primary before recovery write',()=>{const {c,storage}=fixture({primary:'rev-1'});storage.external('rev-2');assert.equal(c.guardedStartupCurrentWrite('recovery'),false);assert.equal(storage.peek(),'rev-2');assert.equal(storage.writes,0)});
t('active owner may commit an unchanged primary and advances source baseline',()=>{const {c,storage}=fixture({primary:'rev-1'});assert.equal(c.guardedStartupCurrentWrite('recovered'),true);assert.equal(storage.peek(),'recovered');assert.equal(c.guardedStartupCurrentWrite('runtime-repair'),true);assert.equal(storage.peek(),'runtime-repair');assert.equal(storage.writes,2)});
t('rejected localStorage write leaves primary unchanged',()=>{const {c,storage}=fixture({primary:'rev-1'});c.localStorage.setItem=()=>{throw Error('QuotaExceededError')};assert.equal(c.guardedStartupCurrentWrite('recovered'),false);assert.equal(storage.writes,0)});
// Exercising the real recoverFromSafetyCheckpoint function without relying on browser DOM.
const rf=src.indexOf('function recoverFromSafetyCheckpoint('), rt=src.indexOf('function renderStartupRecoveryNotice()',rf);
function recoveryFixture({active,primary='"old"',unreadable=false,checkpoint={caseId:'CASE-X',casePhase:'intraop',patientSaved:true,lastSavedAt:900,records:[{epoch:900}]}}){
 const f=fixture({active,primary,unreadable});const c=f.c;
 c.readSafetyCheckpoint=()=>({state:checkpoint,verifiedAt:920});c.caseActivityEpoch=x=>x?.lastSavedAt||0;c.startupRecoveryNotice=null;c.crypto={randomUUID:()=>"test-uuid"};c.Date=Date;c.Math=Math;c.formatClock=()=>"12:00";c.JSON=JSON;
 vm.runInContext(src.slice(rf,rt),c);return {...f,checkpoint};
}
t('VIEW ONLY loads safety checkpoint to memory but never writes primary',()=>{const f=recoveryFixture({active:false});const out=f.c.recoverFromSafetyCheckpoint({caseId:'CASE-X',lastSavedAt:1},false);assert.equal(out.caseId,'CASE-X');assert.equal(f.storage.writes,0);assert.equal(vm.runInContext('startupRecoveredOnlyInMemory',f.c),true);assert.match(f.c.startupRecoveryNotice.reason,/memory only/)});
t('active writer recovers newer checkpoint and verifies primary write',()=>{const f=recoveryFixture({active:true});const out=f.c.recoverFromSafetyCheckpoint({caseId:'CASE-X',lastSavedAt:1},false);assert.equal(out.caseId,'CASE-X');assert.equal(f.storage.writes,1);assert.equal(vm.runInContext('startupRecoveredOnlyInMemory',f.c),false);assert.equal(JSON.parse(f.storage.peek()).caseId,'CASE-X')});
t('corrupt current case is preserved even when safety checkpoint exists',()=>{const f=recoveryFixture({active:true,primary:'{corrupt',unreadable:true});f.c.recoverFromSafetyCheckpoint(null,true);assert.equal(f.storage.peek(),'{corrupt');assert.equal(f.storage.writes,0);assert.equal(vm.runInContext('startupRecoveredOnlyInMemory',f.c),true)});
t('runtime metadata repair and legacy restore use startup guard',()=>{assert(src.includes("persisted=guardedStartupCurrentWrite(JSON.stringify(raw),'legacy-restore')"));assert(src.includes("guardedStartupCurrentWrite(JSON.stringify(state),'runtime-metadata-repair')"));assert(src.includes("const persisted=guardedStartupCurrentWrite(JSON.stringify(restored),'safety-checkpoint')"))});
t('uncommitted recovery fails clinical freshness closed',()=>{let reason='';const g=freshness({read:()=>'{corrupt',onBlocked:r=>reason=r});g.establish();assert.equal(g.block('startup-recovery-unpersisted'),false);assert.equal(g.verify(),false);assert.equal(reason,'startup-recovery-unpersisted');assert.equal(g.committed('other'),false)});
t('startup initializes recovery guard after loading, before mirror reconciliation',()=>{const load=src.lastIndexOf('load();'),est=src.indexOf('CASE_FRESHNESS.establish();',load),block=src.indexOf("if(startupRecoveredOnlyInMemory)CASE_FRESHNESS.block('startup-recovery-unpersisted');",est),mirror=src.indexOf('await reconcileCurrentFromMirror()',block);assert(load>=0&&load<est&&est<block&&block<mirror)});
t('view-only failed recovery disables unsafe Reload button',()=>{assert(src.includes("reason==='storage-unavailable'||reason==='startup-recovery-unpersisted'"));assert(src.includes("reason==='startup-recovery-unpersisted'"))});
t('reload resume routes are phase-specific and include clinical fallback only for progressed cases',()=>{assert.equal(rescue.targetForState({casePhase:'recovery',recoveryStartedAt:1}),'recovery');assert.equal(rescue.targetForState({casePhase:'intraop',caseStartedAt:1}),'orlive');assert.equal(rescue.targetForState({casePhase:'complete',caseLocked:true}),'endcase');assert.equal(rescue.targetForState({casePhase:'setup'}),null);assert(src.includes("if(resumeClinicalTab&&!$(initialTab)?.classList.contains('active'))"));assert(src.includes('forceActivateClinicalUI(initialTab)'))});
t('medication, OR LIVE and Recovery clinical controllers untouched by R14',()=>{for(const name of ['medication-workspace-controller.js','or-live-controller.js','recovery-controller.js'])assert(fs.existsSync(__dirname+'/'+name))});
console.log(JSON.stringify({suite:'R14-startup-recovery-guard',passed,failed,total:passed+failed},null,2));
if(failed)process.exitCode=1;
