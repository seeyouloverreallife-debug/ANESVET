/* R09: Patient setup edit / unlink integrity across Patient → Pre-op → Drug → OR LIVE.
 * Exercises shipped event handlers, no clinical doses or storage schemas are modified.
 */
'use strict';
const fs=require('fs'), vm=require('vm'), assert=require('assert');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
const tests=[];
function test(name,fn){try{fn();tests.push({name,pass:true});console.log('PASS',name)}catch(e){tests.push({name,pass:false,error:e.message});console.error('FAIL',name,e.stack)}}
class FakeElement{
 constructor(id,value=''){this.id=id;this.value=value;this.type='text';this.tagName='INPUT';this.events={};this.textContent='';this.className='';}
 addEventListener(name,fn){(this.events[name]??=[]).push(fn)}
 emit(name){for(const fn of this.events[name]||[])fn({target:this})}
}
function formEnv(){
 const field=new Map(),get=id=>{if(!field.has(id))field.set(id,new FakeElement(id));return field.get(id)};
 const state={patientSaved:true,preOrReadinessOverride:{blockerKeys:['x']}};
 const events=[];
 get('patientProcedure').value='Routine procedure';get('procedure').value='Routine procedure';
 const ctx={$:get,state,updateDashboard:o=>events.push(['render',o?.persist]),updatePatientSaveStatus:()=>events.push(['save-status',state.patientSaved]),
 invalidatePreOrOverride:()=>{events.push(['invalidate']);state.preOrReadinessOverride=null},
 renderProcedureTemplatePicker:()=>events.push(['template'])};
 const begin=app.indexOf('function syncPatientProcedureToCase(){');
 const end=app.indexOf('function currentCaseIdentityFromForm(){',begin);
 assert(begin>0&&end>begin,'procedure listeners found');
 vm.runInNewContext(app.slice(begin,end),ctx);
 return{get,state,events};
}
test('secondary Procedure field changes Patient Procedure and invalidates SAVED',()=>{
 const x=formEnv();x.get('procedure').value='Dental scaling';x.get('procedure').emit('input');
 assert.equal(x.get('patientProcedure').value,'Dental scaling');
 assert.equal(x.state.patientSaved,false,'updated procedure must require Save Patient again');
 assert.equal(x.state.preOrReadinessOverride,null,'old override invalidated');
 assert(x.events.some(e=>e[0]==='save-status'&&e[1]===false),'save status refreshed');
});
test('primary Patient Procedure edit keeps normal draft flow and invalidates SAVED',()=>{
 const x=formEnv();x.get('patientProcedure').value='Ovariohysterectomy';x.get('patientProcedure').emit('input');
 assert.equal(x.get('procedure').value,'Ovariohysterectomy');assert.equal(x.state.patientSaved,false);
});
test('procedure edit does not write any medication administration or start case',()=>{
 const x=formEnv();x.state.drugAdministrations=[{id:'saved',actualMl:0.3}];x.get('procedure').value='New procedure';x.get('procedure').emit('input');
 assert.deepEqual(x.state.drugAdministrations,[{id:'saved',actualMl:0.3}]);assert.equal(x.state.caseStartedAt,undefined);
});
function masterEnv({active=false,records=false}={}){
 const field=new Map(),get=id=>{if(!field.has(id))field.set(id,new FakeElement(id));return field.get(id)};
 get('patientMasterId').value='master-1';const state={patientMasterId:'master-1',patientSaved:true,
 preOrReadinessOverride:{blockerKeys:['patient-save']},caseStartedAt:active?111:null,
 timer:{running:false,elapsedMs:0},records:records?[{id:'record-1'}]:[]};
 const toasts=[];let invalidations=0,refreshes=0;
 const ctx={$:get,$$:()=>[],getState:()=>state,getPatientCache:()=>[],setPatientCache:()=>{},
 patientDomain:{normalizeKey:x=>x},patientOrchestration:{resolveActivePatient:()=>null},
 toast:s=>toasts.push(s),invalidatePreOrOverride:()=>{invalidations++;state.preOrReadinessOverride=null},
 updateDashboard:()=>{refreshes++}};
 const controller=require('./patient-master-controller.js').create(ctx);assert(controller);
 controller.bind();return{get,state,toasts,get invalidations(){return invalidations},get refreshes(){return refreshes}};
}
test('unlinking Patient Master before start invalidates SAVED and readiness override',()=>{
 const x=masterEnv();x.get('unlinkPatientBtn').emit('click');
 assert.equal(x.get('patientMasterId').value,'');assert.equal(x.state.patientMasterId,'');
 assert.equal(x.state.patientSaved,false,'unlink must require new Patient Save');
 assert.equal(x.state.preOrReadinessOverride,null,'override must not survive patient unlink');
 assert.equal(x.get('patientSaveStatus').textContent,'NOT SAVED');
});
test('patient unlink denied after case started to protect frozen identity',()=>{
 const x=masterEnv({active:true});x.get('unlinkPatientBtn').emit('click');
 assert.equal(x.get('patientMasterId').value,'master-1');assert.equal(x.state.patientMasterId,'master-1');
 assert.equal(x.state.patientSaved,true);assert(x.toasts.some(s=>/case|เคส/i.test(s)));
});
test('patient unlink denied if an anesthesia record exists',()=>{
 const x=masterEnv({records:true});x.get('unlinkPatientBtn').emit('click');
 assert.equal(x.get('patientMasterId').value,'master-1');assert.equal(x.state.patientMasterId,'master-1');
});
test('current setup data keys and dosage calculations remain unchanged',()=>{
 assert(app.includes("const CURRENT_KEY = 'anesvet_v14_3_current'"));
 assert(app.includes("const TAB_KEY = 'anesvet_v14_3_tab'"));
 const primary=app.slice(app.indexOf('function syncPatientProcedureToCase(){'),app.indexOf('function currentCaseIdentityFromForm(){'));
 assert(!primary.includes('state.drugAdministrations='));assert(!primary.includes('calculateLibraryDrug('));
});
// Run the real pre-OR readiness validator against the form state, not a mock gate.
function clinicalReadinessEnv(){
 const x=formEnv(),keys=['consent','fasting','exam','risk','labs','iv','oxygen','machine','vaporizer','absorber','airway','suction','monitor','warming','emergency'];
 const initial={patientName:'Test patient',species:'dog',weight:'9',asa:'II',patientProcedure:'Procedure',anesthetist:'Vet',surgeon:'Vet'};
 for(const [key,value] of Object.entries(initial))x.get(key).value=value;
 x.state.preopChecks=Object.fromEntries(keys.map(k=>[k,true]));x.state.preopNA={};
 x.state.preopExamRecordedAt=1;x.state.preopRiskRecordedAt=1;x.state.caseDrugPlanReviewedAt=1;
 x.state.preOrReadinessOverride=null;
 const from=app.indexOf('function preOrReadinessStatus(){'),to=app.indexOf('function readinessOverrideValid(',from);
 assert(from>0&&to>from);
 const ctx={$:x.get,state:x.state,PRE_OR_REQUIRED_CHECK_KEYS:keys,currentWeightKg:()=>Number(x.get("weight").value)||null};
 vm.runInNewContext(app.slice(from,to)+'\nthis.checkReadiness=preOrReadinessStatus;',ctx);
 return {...x,checkReadiness:ctx.checkReadiness};
}
test('pre-OR validator goes from READY to patient-save required after secondary procedure edit',()=>{
 const x=clinicalReadinessEnv();assert.equal(x.checkReadiness().ready,true);
 x.get('procedure').value='Another procedure';x.get('procedure').emit('input');
 const after=x.checkReadiness();assert.equal(after.ready,false);assert(after.hard.some(h=>h.key==='patient-save'));
});
test('pre-OR validator requires a new Patient Save after unlink',()=>{
 const x=masterEnv();x.get('unlinkPatientBtn').emit('click');
 assert.equal(x.state.patientSaved,false); // requestOrLiveAccess requires saved setup
 assert.equal(x.state.preOrReadinessOverride,null);
});
const passed=tests.filter(t=>t.pass).length;
console.log(JSON.stringify({suite:'R09-Patient-Setup-Dirty',passed,total:tests.length,failures:tests.filter(t=>!t.pass)},null,2));
if(passed!==tests.length)process.exitCode=1;
