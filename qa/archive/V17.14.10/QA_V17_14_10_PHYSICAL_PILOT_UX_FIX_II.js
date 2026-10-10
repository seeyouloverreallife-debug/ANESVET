'use strict';
const fs=require('fs'),path=require('path');const R=path.resolve(__dirname,'../..');
const read=f=>fs.readFileSync(path.join(R,f),'utf8');
const app=read('app.js'),html=read('index.html'),orctl=read('runtime/controllers/or-live-controller.js'),orws=read('or-workspace-restructure.js'),orcss=read('assets/css/or-workspace-restructure.css'),rec=read('runtime/controllers/recovery-controller.js'),mobile=read('src/styles/canonical/mobile-design.css'),bundle=read('assets/css/anesvet-ui-bundle.css'),map=JSON.parse(read('config/runtime-map.json')),sw=read('service-worker.js');
const T=[];const add=(n,v)=>T.push([n,!!v]);
add('Release is V17.14.10',/const APP_VERSION='17\.14\.10'/.test(app)&&map.release==='17.14.10'&&sw.includes('anesvet-v17-14-10-startup'));
add('Physical Pilot UX Fix II policy is recorded',String(map.policy?.physicalPilotUxFixII||'').includes('vent-canonical-owner'));

// Ventilation owner contract.
add('OR LIVE controller owns canonical ventilation setter',orctl.includes('function setVentilationMode(mode,{persist=true}={})'));
add('Ventilation setter synchronizes airway, OR mirror, and master controls',orctl.includes("const airway=$('airwayVentMode'),orMirror=$('orVentilation'),master=$('ventilation')")&&orctl.includes('if(airway)airway.value=mode')&&orctl.includes('if(orMirror)orMirror.value=mode')&&orctl.includes('if(master){master.value=mode'));
add('Ventilation setter controls ventilator field visibility',orctl.includes("$('ventilatorFields').hidden=!['Manual PPV','Mechanical ventilation'].includes(mode)"));
add('Ventilation setter is exported by OR controller',orctl.includes('renderAirwayPanel,setVentilationMode,renderOrLive'));
add('Vent workspace calls canonical OR owner instead of relying on select event chain',orws.includes("if(typeof owner?.setVentilationMode==='function')owner.setVentilationMode(mode)"));
add('Vent workspace provides visible selected-mode feedback',orws.includes('id="orVentModeFeedback"')&&orws.includes('Selected • ${select.value}')&&orcss.includes('.or-vent-mode-feedback.selected'));
add('Manual and Mechanical fields remain explicitly visible when selected',orcss.includes('#orlive .or-vent-workspace #ventilatorFields:not([hidden]){display:grid!important}'));

// Deterministic ventilation state simulation using the production controller.
function cls(){const s=new Set();return{add:c=>s.add(c),remove:(...c)=>c.forEach(x=>s.delete(x)),toggle(c,on){if(on===undefined){if(s.has(c))s.delete(c);else s.add(c)}else if(on)s.add(c);else s.delete(c)},contains:c=>s.has(c)}}
function el(tag='SELECT'){const listeners={};return{tagName:tag,value:'',hidden:false,textContent:'',innerHTML:'',disabled:false,dataset:{},className:'',classList:cls(),style:{},addEventListener(t,f){(listeners[t]??=[]).push(f)},dispatchEvent(e){for(const f of listeners[e.type]||[])f.call(this,e);return true},setAttribute(){},querySelector(){return null},closest(){return null}}}
const elements={airwayVentMode:el(),orVentilation:el(),ventilation:el(),ventilatorFields:el('DIV')};
const oldDoc=global.document,oldCE=global.CustomEvent,oldMM=global.matchMedia;
global.CustomEvent=class{constructor(type,init={}){this.type=type;this.detail=init.detail}};
global.matchMedia=()=>({matches:false,addEventListener(){}});
global.document={activeElement:null,body:{classList:cls()},documentElement:{},addEventListener(){},dispatchEvent(){return true},querySelector(){return null},querySelectorAll(){return[]}};
let saves=0;const state={casePhase:'intraop',records:[],events:[],timer:{running:false,elapsedMs:1}};
const mod=require(path.join(R,'runtime/controllers/or-live-controller.js'));
const ctl=mod.create({$:id=>elements[id]||null,$$:()=>[],getState:()=>state,workflow:{},procedureTemplates:{},save(){saves++}});
let runtimeOk=false;
try{
  ctl.setVentilationMode('Mechanical ventilation');
  const mech=elements.airwayVentMode.value==='Mechanical ventilation'&&elements.orVentilation.value==='Mechanical ventilation'&&elements.ventilation.value==='Mechanical ventilation'&&elements.ventilatorFields.hidden===false;
  ctl.setVentilationMode('Spontaneous');
  const spont=elements.airwayVentMode.value==='Spontaneous'&&elements.orVentilation.value==='Spontaneous'&&elements.ventilation.value==='Spontaneous'&&elements.ventilatorFields.hidden===true;
  runtimeOk=mech&&spont&&saves>=2;
}catch(e){runtimeOk=false}
global.document=oldDoc;global.CustomEvent=oldCE;global.matchMedia=oldMM;
add('Runtime: canonical ventilation setter changes all three controls and field visibility',runtimeOk);

// Recovery first-task contract.
add('Recovery has a dedicated editable vitals entry panel',html.includes('id="recoveryObservationPanel" class="panel recovery-vitals-entry-panel"'));
for(const id of ['recHR','recRR','recSpO2','recTemp','recMentation','recExtubation'])add(`Recovery primary vitals include ${id}`,html.includes(`id="${id}"`));
add('Recovery primary panel has direct Record vitals action',html.includes('id="recoveryObservationRecordBtn"')&&rec.includes("$('recoveryObservationRecordBtn')?.addEventListener('click',addRecord)"));
add('Recovery primary panel has direct Copy last action',html.includes('id="recoveryObservationCopyLastBtn"')&&rec.includes("$('recoveryObservationCopyLastBtn')?.addEventListener('click',copyLastVitals)"));
add('Secondary Recovery observations are grouped under More observations',html.includes('class="recovery-observation-more"')&&html.includes('MAP • O₂ support • interval • notes'));
add('Recovery organizer moves editable vitals before quick summary',rec.includes("const anchor=core||focus")&&rec.includes('anchor.after(obs)'));
add('Recovery record history remains secondary rather than replacing entry fields',rec.includes("const secondary=document.querySelector('#recoverySecondaryDetails .recovery-secondary-body')")&&rec.includes('secondary.appendChild(record)'));
add('Mobile order puts editable vitals before Recovery summary',mobile.includes('#recovery>#recoveryObservationPanel{order:1!important}')&&mobile.includes('#recovery>#recoveryFocus{order:2!important}'));
add('Mobile summary no longer duplicates latest-vitals dashboard',mobile.includes('#recovery .recovery-focus-latest{display:none!important}'));
add('Primary Recovery inputs use two-column mobile entry grid',mobile.includes('.recovery-vital-core-grid{display:grid!important;grid-template-columns:1fr 1fr!important'));
add('Recovery due state mirrors into primary entry panel',rec.includes("const badges=[$('recoveryDueBadge'),$('recoveryObservationDueBadge')].filter(Boolean)"));

// Recovery assessment returns to semantic selects, with minimal layout.
add('Recovery assessment retains descriptive 0/1/2 meanings',html.includes('0 • Concern / unstable')&&html.includes('1 • Improving / support needed')&&html.includes('2 • Acceptable'));
add('Recovery assessment explains score meaning in plain language',html.includes('0 = มีข้อกังวล, 1 = กำลังดีขึ้น/ยังต้องช่วย, 2 = ยอมรับได้'));
add('Quick numeric-only Recovery score controls are no longer installed',!rec.includes('installRecoveryScoreQuickControls')&&!rec.includes('syncRecoveryScoreQuickControls'));
add('Mobile Recovery score keeps native selects visible',mobile.includes('.recovery-score-native{position:static!important;width:100%!important')&&mobile.includes('.recovery-score-quick{display:none!important}'));
add('Mobile Recovery score uses compact label + descriptive-select rows',mobile.includes('.recovery-score-grid label{display:grid!important;grid-template-columns:minmax(105px,.42fr) minmax(0,1fr)!important'));
add('Recovery score save still blocks incomplete assessment',rec.includes('saveBtn.disabled=!!live.incomplete'));
add('Recovery clinical record requirements remain HR/RR + SpO2/Temp or N/A',rec.includes("if(!(hr>0&&rr>0&&(spoNA||spo2>0)&&(tempNA||(temp!==null&&temp>0))))"));
add('Emergency Return contract remains',rec.includes('emergencyReturnToOr'));
add('Final Lock remains present',html.includes('id="endSaveArchiveBtn"'));
add('Bundled mobile CSS contains Fix II Recovery ordering',bundle.includes('#recovery>#recoveryObservationPanel{order:1!important}'));

let p=0;for(const [n,v] of T){console.log(`${v?'PASS':'FAIL'}  ${n}`);if(v)p++;}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
