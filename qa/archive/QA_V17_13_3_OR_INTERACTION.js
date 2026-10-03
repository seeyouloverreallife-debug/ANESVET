'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),w=read('or-workspace-restructure.js'),c=read('or-workspace-restructure.css'),o=read('or-live-controller.js'),app=read('app.js'),sw=read('service-worker.js');
const T=[
['Current workspace version',w.includes("const VERSION='17.13.3'")],
['Vitals remain fixed above secondary navigation',w.includes("if(vitals&&command){vitals.hidden=false;command.after(vitals)}")&&w.includes("if(vitalGrid&&vitals)vitals.after(vitalGrid)")],
['Monitor is no longer a redundant secondary-nav button',!w.includes('data-or-workspace="monitor" class="active"')&&w.includes('data-or-workspace="fluid"')],
['Secondary nav contains Fluid Vent Airway Meds',w.includes('data-or-workspace="fluid"')&&w.includes('data-or-workspace="vent"')&&w.includes('data-or-workspace="airway"')&&w.includes('data-or-workspace="meds"')],
['Secondary panels provide Back to Monitor action',w.includes('data-or-back-monitor')&&w.includes("setView('monitor',{scroll:true})")],
['Clear safety state auto-compacts',w.includes('function syncSafetyCompact()')&&w.includes("classList.toggle('or-safety-clear',clear)")&&c.includes('.or-core-safety.or-safety-clear')],
['Active safety remains distinct',w.includes("classList.toggle('or-safety-active',!clear)")&&c.includes('.or-core-safety.or-safety-active')],
['Safety state observes current runtime text',w.includes("'orCoreSafetyTitle','orCoreSafetySummary','orAlertCount'")],
['Fluid main keeps rate hero',w.includes("const hero=q('.fluid-rate-hero',body)")&&w.includes("main.appendChild(hero)")],
['Fluid main keeps bolus visible',w.includes("if(cards[0])main.appendChild(cards[0])")],
['Fluid optional actual correction moves under More',w.includes("actual=heroCards.find(x=>x.classList?.contains('actual'))")&&w.includes('inner.appendChild(actual)')],
['Fluid blood loss urine blood product move under More',w.includes('cards.slice(1).forEach(card=>inner.appendChild(card))')],
['Fluid visible glance is Total In + Current Rate',w.includes('if(items[1])glance.appendChild(items[1])')&&w.includes('if(items[3])glance.appendChild(items[3])')],
['Fluid effective/net/history move under More',w.includes('[items[0],items[2]].filter(Boolean).forEach')&&w.includes('inner.appendChild(history)')],
['Vent has tap-first mode buttons',w.includes('id="orVentModeButtons"')&&w.includes('data-vent-mode="Spontaneous"')&&w.includes('data-vent-mode="Manual PPV"')&&w.includes('data-vent-mode="Mechanical ventilation"')],
['Vent quick buttons write authoritative airwayVentMode select',w.includes("select.value=b.dataset.ventMode")&&w.includes("select.dispatchEvent(new Event('change',{bubbles:true}))")],
['Authoritative vent select retained but visually hidden',w.includes("labelFor('airwayVentMode')")&&c.includes('.or-authoritative-mode')],
['Airway shows Intubation timestamp from authoritative milestone',w.includes("procedureMilestoneEvent?.('Intubation')")&&w.includes('id="orAirwayTimestamp"')],
['Airway Attempts field exists',h.includes('id="airwayAttempts"')&&app.includes("'airwayAttempts'")],
['Airway Note field exists',h.includes('id="airwayNote"')&&app.includes("'airwayNote'")],
['Airway Attempts and Note have fresh-state persistence',app.includes("airwayAttempts:'',airwayCircuit:'',airwayNote:''")],
['Airway Attempts and Note are in final report',app.includes("reportInfoItem('Attempts'")&&app.includes("reportInfoItem('Airway note'")],
['Airway autosave watches Attempts and Note',o.includes("'airwayAttempts','airwayCircuit','airwayNote'")],
['Vaporizer discrete 0.5 steps retained',w.includes("choiceStrip([5,4.5,4,3.5,3,2.5,2,1.5,1,0.5,0],'vap')")],
['O2 simple selector retained',w.includes("choiceStrip([3,2.5,2,1.5,1,0.5,0],'o2')")&&!w.includes('orMonitorO2Range')],
['Induction given/details-pending semantics preserved',o.includes('markPreparedInductionGivenAtMilestone')],
['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
['Legacy Clinical Simplicity retired from runtime',!h.includes('clinical-simplicity.js?v=')&&!sw.includes('clinical-simplicity.js?v=')],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')],
['Current service worker generation',sw.includes('anesvet-v17-13-3-startup')],
['Current workspace assets cached',sw.includes('or-workspace-restructure.js?v=17.13.3')&&sw.includes('or-workspace-restructure.css?v=17.13.3')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}
console.log(`\\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
