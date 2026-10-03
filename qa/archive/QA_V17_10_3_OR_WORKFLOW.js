'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8'),h=read('index.html'),o=read('or-live-controller.js'),r=read('or-workflow-refinement.js'),m=read('medication-workspace-controller.js');
const T=[
['Core phase strip present',h.includes('id="orCorePhaseStrip"')&&['induction','airway','surgery','emergence','recovery'].every(x=>h.includes(`data-core-phase="${x}"`))],
['Mobile workflow transition remains visible intraop',o.includes("next.hidden=false")&&o.includes("action==='surgery-end'")],
['End Surgery confirmation preserved',o.includes("'surgery-end':{title:'End surgery?'")&&o.includes("openOrStepConfirm(action)")],
['End Surgery native milestone preserved',h.includes('data-label="Surgery end"')],
['Induction deferred documentation preserved',o.includes("inductionDocumentationMode='deferred-v1472'")],
['Multi-drug induction entry preserved',o.includes("openOrQuickDrug({phase:'induction',purpose:'induction'})")],
['Airway save records Intubation',o.includes("triggerOrMilestone('Intubation')")],
['Airway save avoids forced scroll while editing',o.includes("ANESVET_MOBILE_OR_OWNER?.editing?.()")&&o.includes("block:'nearest'")],
['Vitals focus save preserved',h.includes('id="orVitalsFocusSaveBtn"')&&o.includes("orVitalsFocusSaveBtn")],
['Medication queue preserved',h.includes('id="orMedicationQueue"')&&o.includes("orMedicationQueueNextBtn")],
['Calculated-as-given preserved',h.includes('id="orQuickDrugChangeActual"')&&m.includes('actual=changeActual||!hasCalculatedDefault')],
['Surgery End undo remains',o.includes("undoLastOrWorkflowStep")&&o.includes("WORKFLOW_STEP_UNDONE")],
['Extubation to Recovery preserved',o.includes("action==='extubation'")&&o.includes("triggerOrMilestone('Extubation')")],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Refinement is presentation-only',!r.includes('.click()')&&!r.includes('setTab(')&&!r.includes('addEvent(')]
];let p=0;for(const [n,x] of T){console.log((x?'PASS':'FAIL')+'  '+n);if(x)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);