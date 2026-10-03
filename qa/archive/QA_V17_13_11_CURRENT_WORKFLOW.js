'use strict';
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(R,f),'utf8');
const h=read('index.html'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js'),w=read('or-workspace-restructure.js'),app=read('app.js'),sw=read('service-worker.js');
const startBranch=o.slice(o.indexOf("if(action==='start-induction')"),o.indexOf("if(action==='induction-drug')"));
const preparedBlock=m.slice(m.indexOf('function preparedInductionRows'),m.indexOf('function openOrQuickDrug'));
const recordPrepared=m.slice(m.indexOf('function recordPreparedInductionNow'),m.indexOf('function openOrQuickDrug'));
const saveBlock=m.slice(m.indexOf('function saveOrQuickDrug'),m.indexOf('function bind(){'));
const T=[
['Induction start marks prepared induction meds given provisionally',startBranch.includes('markPreparedInductionGivenAtMilestone')],
['Induction start does not create full drug administration records',!startBranch.includes('recordDrugAdministration')],
['Provisional list persisted in case state',app.includes('inductionProvisionalAdministrations:[]')],
['Only frozen planned induction meds are provisionally marked',preparedBlock.includes("d&&d.planned&&String(d.phase||'').toLowerCase()==='induction'")],
['Provisional record uses Induction milestone epoch',preparedBlock.includes("epoch:Number(milestone.epoch)")&&preparedBlock.includes("clock:milestone.clock")],
['Provisional status explicitly details-pending',preparedBlock.includes("status:'given-details-pending'")],
['Induction marking creates audit entry',preparedBlock.includes("INDUCTION_MEDICATIONS_MARKED_GIVEN")],
['Quick drug button later opens editor rather than recording a new-time administration',recordPrepared.includes('openOrQuickDrug({phase:\'induction\'')&&!recordPrepared.includes('recordDrugAdministration({')],
['Later review defaults to provisional Induction time',recordPrepared.includes('adminEpoch:provisional.epoch')&&recordPrepared.includes('adminClock:provisional.clock')],
['Editable administration time field exists',h.includes('id="orQuickDrugAdminTime" type="time" step="1"')],
['Time input is shown for induction medication review',m.includes("orQuickDrugTimeWrap')")&&m.includes("timeInputValue(adminEpoch)")],
['Edited clock converts safely around midnight',m.includes('function epochFromTimeInput')&&m.includes('43200000')&&m.includes('86400000')],
['Edited administration time is used in actual drug record',saveBlock.includes('epochFromTimeInput')&&saveBlock.includes('adminEpoch,adminElapsedMs:adminElapsed,adminClock')],
['Time adjustment is retained in audit note',saveBlock.includes('Administration time adjusted from Induction')],
['Confirming actual details completes provisional record',saveBlock.includes('clearProvisionalInductionForDrug(b.drug,entry)')],
['Induction review cannot complete with details pending',m.includes("pending=provisionalInductionList().filter(x=>!x.completedAt)")&&m.includes('still pending')],
['Queue recognizes Given-but-details-pending state',o.includes("status:actual?'given':provisional?'given-pending':'pending'")],
['Queue labels provisional administration as Given Review',o.includes("'GIVEN • REVIEW'")&&o.includes('Given ${provisional.clock')],
['Generic quick-med strip redirects provisional induction to review flow',o.includes("row?.status==='given-pending'")&&o.includes("recordPreparedInductionNow?.(b.dataset.orQuickMed)")],
['Undo restores induction provisional state',o.includes('inductionProvisionalAdministrations:deepCloneOrNull')&&o.includes('state.inductionProvisionalAdministrations=deepCloneOrNull')],
['Quick strip tells user Induction means drugs given',w.includes('Induction = prepared induction drugs given')],
['Prepared drug button shows Given details pending',w.includes('tap to review details')&&w.includes('row.provisional')],
['Prepared drug button is still actionable until details saved',w.includes("b.disabled=!status.started||!!row.given")],
['Actual completed drug becomes non-actionable in quick strip',w.includes("row.given?`✓ Details saved")],
['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
['Fluid, Vent and Airway remain deferred workspaces',w.includes('Fluids')&&w.includes('Ventilator / PPV')&&w.includes('ET tube details')],
['Current SW cache generation',sw.includes("anesvet-v17-13-11-startup")],
['Current workspace assets cached',sw.includes('or-workspace-restructure.js?v=17.13.11')&&sw.includes('assets/css/or-workspace-restructure.css?v=17.13.11')],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
