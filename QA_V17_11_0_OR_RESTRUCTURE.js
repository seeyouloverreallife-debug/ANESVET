'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),o=read('or-live-controller.js'),w=read('or-workspace-restructure.js'),c=read('or-workspace-restructure.css'),sw=read('service-worker.js');
const T=[
['Workspace assets wired',h.includes('or-workspace-restructure.css?v=17.11.0')&&h.includes('or-workspace-restructure.js?v=17.11.0')],
['Four OR workspaces defined',w.includes("data-or-workspace=\"monitor\"")&&w.includes("data-or-workspace=\"support\"")&&w.includes("data-or-workspace=\"airway\"")&&w.includes("data-or-workspace=\"meds\"")],
['Monitoring is default',w.includes("setView('monitor')")&&w.includes("let current='monitor'")],
['Vitals moved into Monitor',w.includes("const vf=$('orVitalsFocus'),vitals=q('#orlive .or-vital-grid')")],
['Vitals active through anesthesia phases',o.includes("monitoringActive=!!state.caseStartedAt&&!['recovery','complete','locked'].includes")],
['Authoritative Depth/Vaporizer/O2 moved, not cloned',w.includes("labelFor('orDepth')")&&w.includes("labelFor('orVaporizer')")&&w.includes("labelFor('orO2')")],
['Vaporizer tactile control uses authoritative OR field',w.includes("const vap=$('orVaporizer')")&&w.includes("orMonitorVaporizerRange")&&w.includes("dispatchInput(vap)")],
['O2 flow tactile control uses authoritative OR field',w.includes("const vap=$('orVaporizer'),o2=$('orO2')")&&w.includes("orMonitorO2Range")&&w.includes("dispatchInput(o2)")],
['Support owns fluid panel',w.includes("fluid=$('orFluidPanelDetails')")&&w.includes("orFluidWorkspaceSlot")],
['Support owns ventilator mode/settings',w.includes("labelFor('airwayVentMode')")&&w.includes("settings=$('ventilatorFields')")],
['Manual PPV can expose settings',o.includes("!['Manual PPV','Mechanical ventilation'].includes(mode)")],
['Airway workspace owns ET-tube panel',w.includes("const airway=$('orAirwayPanelDetails')")&&w.includes('ET tube / Airway details')],
['Medication workspace owns quick meds + queue + guardian',w.includes("q('.or-quick-med-strip')")&&w.includes("$('orMedicationQueue')")&&w.includes("$('orDocumentationGuardian')")],
['Intubation is timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&o.includes("triggerOrMilestone('Intubation')")],
['Intubation does not open airway editor',!o.includes("openAirwayWorkflow(action==='airway'?'intubation':'edit')")&&!o.includes("openAirwayWorkflow('intubation')")],
['Airway details is a separate action',o.includes("if(action==='airway-edit')")&&o.includes("openAirwayWorkflow('edit')")],
['Intubation copy explicitly defers details',o.includes("รายละเอียด ETT / ventilator / fluid ค่อยลงเมื่อผู้ป่วย stable")],
['Airway save avoids forced primary-action scroll',!o.includes("toast('Airway record saved')")&&o.includes("toast('Airway details saved')")],
['Primary documentation warning compacted on mobile',c.includes(".or-primary-documentation-note{display:none!important}")],
['Redundant status row hidden',w.includes("classList.add('or-redundant-status')")&&c.includes(".or-redundant-status{display:none!important}")],
['Legacy combined airway setup retired from active workflow',w.includes("oldSetup.hidden=true")],
['Workspace script has no clinical storage writes',!w.includes('localStorage')&&!w.includes('sessionStorage')&&!w.includes('indexedDB')],
['End Surgery preserved',h.includes('data-label="Surgery end"')&&o.includes("'surgery-end'")],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')],
['Current service worker caches new assets',sw.includes('or-workspace-restructure.css?v=17.11.0')&&sw.includes('or-workspace-restructure.js?v=17.11.0')],
['Current service worker generation',sw.includes("anesvet-v17-11-0-startup")]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
