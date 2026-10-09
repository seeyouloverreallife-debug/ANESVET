'use strict';
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'../..');
const read=f=>fs.readFileSync(path.join(R,f),'utf8');
const html=read('index.html'),or=read('runtime/controllers/or-live-controller.js'),css=read('src/styles/canonical/style.css'),bundle=read('assets/css/anesvet-ui-bundle.css'),map=JSON.parse(read('config/runtime-map.json')),app=read('app.js'),sw=read('service-worker.js');
const T=[];const add=(n,v)=>T.push([n,!!v]);
const renderBlock=or.slice(or.indexOf('function renderOrMedicationQueue(){'),or.indexOf('function openPlannedMedicationRow'));
const setBlock=or.slice(or.indexOf('let medicationQueueUserExpanded=false;'),or.indexOf('function renderOrMedicationQueue(){'));
add('Release is V17.14.8',/const APP_VERSION='17\.14\.8'/.test(app)&&map.release==='17.14.8');
add('Service Worker cache is V17.14.8',sw.includes("anesvet-v17-14-8-startup"));
add('Runtime policy records visible pending plan',map.policy?.clinicalUxImprovement==='or-medication-queue-keeps-pending-plan-visible');
add('Medication queue toggle exists',html.includes('id="orMedicationQueueToggleBtn"'));
add('Medication queue toggle controls the list',html.includes('aria-controls="orMedicationQueueList"'));
add('Queue has local presentation expansion state',setBlock.includes('medicationQueueUserExpanded'));
add('User expansion setter only changes presentation state',setBlock.includes('medicationQueueUserExpanded=!!expanded')&&!setBlock.includes('state.')&&!setBlock.includes('save('));
add('Current and later pending medications force expanded queue',renderBlock.includes('hasPendingPlan=needsReview||later.length>0,expanded=hasPendingPlan||medicationQueueUserExpanded'));
add('Queue compacts only when not expanded',renderBlock.includes("panel.classList.toggle('compact',!expanded)"));
add('Compact queue hides row list',renderBlock.includes('list.hidden=!expanded'));
add('Compact queue hides action row',renderBlock.includes("actions.hidden=!expanded"));
add('Pending plan hides collapse toggle',renderBlock.includes('toggle.hidden=hasPendingPlan'));
add('Toggle announces expanded state',renderBlock.includes("toggle.setAttribute('aria-expanded',expanded?'true':'false')"));
add('Clear current phase is explicit in badge',renderBlock.includes('CURRENT CLEAR'));
add('No-review next-planned action is hidden',renderBlock.includes('next.hidden=!review.length'));
add('Full medication workspace remains available',renderBlock.includes("all.textContent=review.length?'All medications':'Open medication workspace'"));
add('Collapsed state resets when queue is not applicable',renderBlock.includes('if(panel.hidden){medicationQueueUserExpanded=false;return;}'));
add('Toggle binding is owned by OR LIVE controller',or.includes("$('orMedicationQueueToggleBtn')?.addEventListener('click',()=>setMedicationQueueExpanded(!medicationQueueUserExpanded))"));
add('Queue renderer does not write clinical state',!renderBlock.includes('state.casePhase=')&&!renderBlock.includes('state.drugAdministrations=')&&!renderBlock.includes('recordDrugAdministration(')&&!renderBlock.includes('save('));
add('Queue renderer does not alter dose calculations',!renderBlock.includes('calculatedMl=')&&!renderBlock.includes('concentration=')&&!renderBlock.includes('actual='));
add('CSS hides list/actions reliably despite author display rules',css.includes('.or-medication-queue-list[hidden],.or-medication-queue-actions[hidden]{display:none!important}'));
add('Compact queue has dedicated presentation rule',css.includes('.or-medication-queue.compact{'));
add('Mobile compact queue remains explicitly styled',css.includes('@media(max-width:760px)')&&css.includes('.or-medication-queue.compact{padding:7px 8px}'));
add('Runtime bundle contains focused queue CSS',bundle.includes('.or-medication-queue.compact{')&&bundle.includes('.or-medication-queue-list[hidden],.or-medication-queue-actions[hidden]'));
add('Medication review safety remains primary',or.includes("status:actual?'given':provisional?'given-pending':'pending'")&&or.includes("medicationQueueTimingBucket(r)==='review'"));
add('Induction details-pending contract remains',or.includes('details pending')&&or.includes('given-pending'));
add('End Surgery workflow remains',or.includes("action='surgery-end'"));
add('Emergency Return path remains outside queue change',html.includes('id="emergencyReturnOrBtn"'));

// Deterministic controller behavior with a minimal DOM shim.
function fakeClassList(){const set=new Set();return{toggle(c,on){if(on)set.add(c);else set.delete(c)},contains(c){return set.has(c)}}}
function fakeEl(){return{hidden:false,textContent:'',innerHTML:'',disabled:false,className:'',dataset:{},classList:fakeClassList(),attrs:{},setAttribute(k,v){this.attrs[k]=String(v)},addEventListener(){},querySelector(sel){return sel==='.or-medication-queue-actions'?elements.orMedicationQueueActions:null}}}
const elements={};['orMedicationQueue','orMedicationQueueList','orMedicationQueueBadge','orMedicationQueueNextBtn','orMedicationQueueAllBtn','orMedicationQueueHint','orMedicationQueueToggleBtn','orMedicationQueueActions'].forEach(id=>elements[id]=fakeEl());
elements.orMedicationQueue.querySelector=sel=>sel==='.or-medication-queue-actions'?elements.orMedicationQueueActions:null;
const state={caseStartedAt:1,caseLocked:false,casePhase:'intraop',protocolSnapshot:{caseDrugPlan:[{id:'post1',name:'Post med',phase:'post',route:'SC'}]},drugAdministrations:[],inductionProvisionalAdministrations:[]};
global.document={addEventListener(){},activeElement:null,querySelector(){return null},body:{classList:fakeClassList()}};
const factory=require(path.join(R,'runtime/controllers/or-live-controller.js'));
const ctl=factory.create({$:id=>elements[id]||null,$$:()=>[],getState:()=>state,workflow:{},procedureTemplates:{},caseDrugPlanPhaseLabel:v=>String(v||''),fmtDose:v=>String(v??'')});
ctl.renderOrMedicationQueue();
add('Runtime: later-only plan stays expanded',!elements.orMedicationQueue.classList.contains('compact')&&elements.orMedicationQueueList.hidden===false&&elements.orMedicationQueueActions.hidden===false);
add('Runtime: later-only plan cannot collapse and is not auto-next',elements.orMedicationQueueToggleBtn.hidden===true&&elements.orMedicationQueueNextBtn.hidden===true);
state.drugAdministrations=[{id:'admin1',drug:'Post med',actual:1,route:'SC'}];
ctl.renderOrMedicationQueue();
add('Runtime: fully documented plan compacts',elements.orMedicationQueue.classList.contains('compact')&&elements.orMedicationQueueList.hidden&&elements.orMedicationQueueToggleBtn.hidden===false);
ctl.setMedicationQueueExpanded(true);
add('Runtime: user can expand a clear-phase plan',!elements.orMedicationQueue.classList.contains('compact')&&elements.orMedicationQueueList.hidden===false&&elements.orMedicationQueueActions.hidden===false&&elements.orMedicationQueueToggleBtn.textContent==='Hide plan');
state.protocolSnapshot.caseDrugPlan.unshift({id:'pre1',name:'Current med',phase:'pre',route:'IV'});
ctl.renderOrMedicationQueue();
add('Runtime: current-phase review forces full queue',elements.orMedicationQueue.classList.contains('compact')===false&&elements.orMedicationQueueList.hidden===false&&elements.orMedicationQueueNextBtn.hidden===false);
add('Runtime: current-phase review cannot be collapsed',elements.orMedicationQueueToggleBtn.hidden===true&&/NEED REVIEW/.test(elements.orMedicationQueueBadge.textContent));
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++;}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
