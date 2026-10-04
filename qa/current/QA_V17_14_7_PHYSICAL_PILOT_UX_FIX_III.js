'use strict';
const fs=require('fs'),path=require('path'),vm=require('vm');
const ROOT=path.resolve(__dirname,'../..');
const read=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
const ws=read('or-workspace-restructure.js'),orctl=read('runtime/controllers/or-live-controller.js'),app=read('app.js'),css=read('assets/css/or-workspace-restructure.css');
const checks=[];const add=(label,ok)=>checks.push([label,!!ok]);

add('Vent workspace owns dedicated visible editor', ['orVentEditorFields','orVentRrEditor','orVentPipEditor','orVentPeepEditor','orVentVtEditor'].every(x=>ws.includes(x)));
add('Vent no longer depends on re-parenting legacy ventilatorFields', !ws.includes("if(settings)q('#orVentSettingsSlot',panel).appendChild(settings)"));
add('Vent buttons use direct listeners', ws.includes("b.addEventListener('click'")&&ws.includes("owner.setVentilationMode(mode,{focus:true})"));
add('Vent editor mirrors visible inputs to authoritative airway fields', ws.includes("{editor:'orVentRrEditor',authoritative:'airwayVentRr'}")&&ws.includes("source.dispatchEvent(new Event('input',{bubbles:true}))"));
add('Mechanical mode requests focus in canonical owner', orctl.includes('function setVentilationMode(mode,{persist=true,focus=false}={})')&&orctl.includes("detail:{mode,focus}"));
add('Vent workspace sync API exported', ws.includes('syncVentEditor:(opts={})=>syncVentEditor'));
add('Vent editor has explicit visible/hidden CSS', css.includes('.or-vent-editor-fields{display:grid')&&css.includes('.or-vent-editor-fields[hidden]{display:none!important}'));

add('Quick preset still contains builtin NSAID', app.includes("post:['builtin_convenia','builtin_nsaid']"));
add('Case plan maps cat NSAID to meloxicam', app.includes("species==='cat'?'meloxicamDose':species==='dog'?'carprofenDose':''"));
add('Case plan maps builtin_nsaid into species-specific plan item', app.includes("{builtin_nsaid:nsaidId}"));

// Runtime: execute the production defaultCaseDrugPlanItems() function body with controlled protocol inputs.
let planMapRuntime=false;
try{
  const start=app.indexOf('function defaultCaseDrugPlanItems(){'),end=app.indexOf('function ensureCaseDrugPlanInitialized()',start);
  const src=app.slice(start,end);
  const planCtx={state:{species:'cat'},$:(id)=>id==='species'?{value:'cat'}:null,currentProtocolDrugDefinitions:()=>[{id:'meloxicamDose',name:'Meloxicam',phase:'post'},{id:'carprofenDose',name:'Carprofen',phase:'post'}],loadQuickPresets:()=>({induction:[],pre:[],post:['builtin_nsaid']}),cloneCasePlanDrug:d=>({...d})};
  vm.createContext(planCtx);vm.runInContext(src,planCtx);
  const catPlan=planCtx.defaultCaseDrugPlanItems();
  planCtx.state.species='dog';planCtx.$=(id)=>id==='species'?{value:'dog'}:null;const dogPlan=planCtx.defaultCaseDrugPlanItems();
  planMapRuntime=catPlan.length===1&&catPlan[0].id==='meloxicamDose'&&dogPlan.length===1&&dogPlan[0].id==='carprofenDose';
}catch(e){}
add('Runtime: builtin NSAID resolves to Meloxicam for cat and Carprofen for dog',planMapRuntime);
add('Emergency/standby remains excluded from routine OR medication queue', orctl.includes("standby=!!item.standby||phase==='emergency'||role.includes('emergency')||role.includes('standby')")&&orctl.includes('if(standby)return'));
add('Post-anesthetic planned medication becomes reviewable in emergence/recovery', orctl.includes("if(medPhase==='post')return ['emergence','recovery','complete','locked'].includes(phase)?'review':'later'"));

// Runtime: production OR controller must synchronize ventilation and ask workspace to focus the editor.
function el(tag='INPUT'){return {tagName:tag,value:'',hidden:true,dataset:{},classList:{contains(){return false},toggle(){}},addEventListener(){},dispatchEvent(){},textContent:'',disabled:false};}
const elements={airwayVentMode:el('SELECT'),orVentilation:el('SELECT'),ventilation:el('SELECT'),ventilatorFields:el('DIV')};
let syncOpts=null;
const context={console,setTimeout,clearTimeout,requestAnimationFrame:f=>f(),matchMedia:()=>({matches:false,addEventListener(){}}),innerHeight:800,scrollY:0,scrollBy(){},scrollTo(){},confirm:()=>true,CustomEvent:function(type,init){this.type=type;this.detail=init?.detail},Event:function(type){this.type=type},document:{activeElement:null,getElementById:id=>elements[id]||null,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},dispatchEvent(){},body:{classList:{toggle(){}}}},ANESVET_OR_WORKSPACE:{syncVentEditor(opts){syncOpts=opts}}};
context.window=context;context.globalThis=context;
vm.createContext(context);vm.runInContext(orctl,context);
const ctl=context.ANESVET_OR_LIVE_CONTROLLER.create({$:(id)=>elements[id]||null,$$:()=>[],getState:()=>({records:[],events:[],drugAdministrations:[],casePhase:'intraop'}),workflow:{},procedureTemplates:{},save(){}});
ctl.setVentilationMode('Mechanical ventilation',{focus:true});
add('Runtime: Mechanical synchronizes all authoritative controls',elements.airwayVentMode.value==='Mechanical ventilation'&&elements.orVentilation.value==='Mechanical ventilation'&&elements.ventilation.value==='Mechanical ventilation'&&elements.ventilatorFields.hidden===false);
add('Runtime: Mechanical requests visible Vent editor focus',syncOpts?.mode==='Mechanical ventilation'&&syncOpts?.focus===true);

// Runtime: post NSAID in a frozen plan must be a review item at emergence, while emergency standby is excluded.
const state={caseStartedAt:1,casePhase:'emergence',caseLocked:false,protocolSnapshot:{caseDrugPlan:[{id:'meloxicamDose',name:'Meloxicam',phase:'post',standby:false},{id:'adrenalineDose',name:'Adrenaline CPR',phase:'emergency',standby:true}]},drugAdministrations:[],inductionProvisionalAdministrations:[]};
const ctl2=context.ANESVET_OR_LIVE_CONTROLLER.create({$:(id)=>elements[id]||null,$$:()=>[],getState:()=>state,workflow:{},procedureTemplates:{},save(){}});
const rows=ctl2.plannedRoutineMedicationRows(),review=ctl2.reviewNowPlannedMedicationRows();
add('Runtime: emergency standby is absent from routine queue',rows.length===1&&rows[0].item.name==='Meloxicam');
add('Runtime: Meloxicam is NEEDS REVIEW at emergence',review.length===1&&review[0].item.name==='Meloxicam');

let pass=0;for(const [label,ok] of checks){console.log(`${ok?'PASS':'FAIL'}  ${label}`);if(ok)pass++;}
console.log(`\n${pass}/${checks.length} PASS`);if(pass!==checks.length)process.exit(1);
