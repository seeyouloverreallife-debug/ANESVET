'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),w=read('or-workspace-restructure.js'),c=read('or-workspace-restructure.css'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js'),sw=read('service-worker.js');
const pos=x=>w.indexOf(x);
const T=[
['Current workspace version',w.includes("const VERSION='17.12.0'")],
['Vitals focus is placed immediately after patient command bar',w.includes("if(vitals&&command){vitals.hidden=false;command.after(vitals)}")],
['Vital input grid is placed directly after top save strip',w.includes("if(vitalGrid&&vitals)vitals.after(vitalGrid)")],
['Anesthesia controls come after vital inputs',w.includes("(vitalGrid||vitals||command).after(monitorControls)")],
['Workflow milestone comes after monitoring controls',w.includes("if(primary)monitorControls.after(primary)")],
['Vitals no longer live inside a Monitor tab panel',!w.includes("data-or-workspace-panel':'monitor'")],
['Monitor tab hides secondary host instead of hiding vitals',w.includes("host.hidden=view==='monitor'")],
['Secondary workspaces are Monitor Fluid Vent Airway Meds',w.includes("data-or-workspace=\"fluid\"")&&w.includes("data-or-workspace=\"vent\"")&&w.includes("data-or-workspace=\"airway\"")&&w.includes("data-or-workspace=\"meds\"")],
['Legacy combined Support workspace removed',!w.includes("data-or-workspace=\"support\"")&&!w.includes("data-or-workspace-panel':'support'")],
['Fluid and Vent are separate panels',w.includes("data-or-workspace-panel':'fluid'")&&w.includes("data-or-workspace-panel':'vent'")],
['Fluid exposes rate/bolus first and collapses secondary balance items',w.includes("More • blood loss / urine / blood product / history")&&w.includes("cards.slice(1).forEach")],
['Vent owns ventilation mode and ventilator fields',w.includes("labelFor('airwayVentMode')")&&w.includes("settings=$('ventilatorFields')")],
['Airway copy is ET tube focused',w.includes('ET tube details')&&w.includes('ETT size / depth / cuff / difficulty / circuit')],
['Vaporizer has exact discrete 0.5 steps from 5 to OFF',w.includes("choiceStrip([5,4.5,4,3.5,3,2.5,2,1.5,1,0.5,0],'vap')")],
['O2 uses simple discrete choices, not a flowmeter slider',w.includes("choiceStrip([3,2.5,2,1.5,1,0.5,0],'o2')")&&!w.includes('orMonitorO2Range')&&!w.includes('or-flowmeter')],
['Top Save Vitals button is explicitly visible in mobile CSS',c.includes('#orVitalsFocus #orVitalsFocusSaveBtn{display:block!important')],
['Vital cards are mobile compact',c.includes('#orlive>.or-vital-grid .or-vital-card')&&c.includes('min-height:88px!important')],
['Patient summary chips are single-row scrollable and compact',c.includes('.or-compact-summary-row')&&c.includes('flex-wrap:nowrap!important')&&c.includes('min-height:24px!important')],
['Primary workflow is compact after monitoring',c.includes('#orlive .or-primary-flow')&&c.includes('min-height:38px!important')],
['Safety card remains visible but compact',c.includes('#orlive .or-core-safety')&&c.includes('padding:7px 9px!important')],
['Bottom OR controls are reduced in height',c.includes('body[data-av-page=orlive] .av-nav button{min-height:44px!important')],
['Induction given/details-pending semantics preserved',o.includes('markPreparedInductionGivenAtMilestone')&&m.includes("status:'given-details-pending'")],
['Editable individual induction administration time preserved',h.includes('id="orQuickDrugAdminTime"')&&m.includes('epochFromTimeInput')],
['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')],
['Current service worker generation',sw.includes("anesvet-v17-12-0-startup")],
['Current workspace assets cached',sw.includes('or-workspace-restructure.js?v=17.12.0')&&sw.includes('or-workspace-restructure.css?v=17.12.0')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
