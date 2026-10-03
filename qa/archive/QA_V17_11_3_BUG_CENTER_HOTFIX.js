'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),cs=read('clinical-simplicity.js'),vm=read('recovery-handoff-view-model.js'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js'),w=read('or-workspace-restructure.js'),sw=read('service-worker.js');
const T=[
['Clinical Simplicity delegates OR layout to V17.11 owner',cs.includes("if (window.ANESVET_OR_WORKSPACE || $('orWorkspaceHost'))")&&cs.includes("delegated-v17113")],
['Legacy insertBefore has same-parent guard',cs.includes("primary.parentElement !== page || focus.parentElement !== page")&&cs.includes("page.insertBefore(primary, focus)")],
['Legacy OR reordering does not run under current owner',cs.indexOf("if (window.ANESVET_OR_WORKSPACE || $('orWorkspaceHost'))")<cs.indexOf("page.insertBefore(primary, focus)")],
['Bug Center issues carry release version',h.includes("version:VERSION,category,message:label")],
['Bug Center loads only current-release issues',h.includes("if(x?.version===VERSION)current.push(x);else stale.push(x)")],
['Previous-release issues are archived, not shown as current',h.includes("ISSUE_ARCHIVE_KEY='anesvet_issue_center_archive_v1'")&&h.includes("archive.concat(stale).slice(-100)")],
['Bug Center heading is release-scoped',h.includes("กลุ่มปัญหาของ V${VERSION}")],
['Current startup root fix remains non-throwing',vm.includes("ANESVET_APP_UTILS?.normalizedHandoffDrugName")&&!vm.includes("must load before recovery-handoff-view-model")],
['Current handoff VM still exports',vm.includes("ANESVET_RECOVERY_HANDOFF_VM")],
['Induction marks frozen prepared meds given provisionally',o.includes("markPreparedInductionGivenAtMilestone")],
['Induction provisional review model retained',m.includes("status:'given-details-pending'")&&m.includes("orQuickDrugAdminTime")],
['Induction time remains editable during review',m.includes("epochFromTimeInput")&&m.includes("Administration time adjusted from Induction")],
['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
['OR task workspaces retained',w.includes("data-or-workspace=\"monitor\"")&&w.includes("data-or-workspace=\"support\"")&&w.includes("data-or-workspace=\"airway\"")&&w.includes("data-or-workspace=\"meds\"")],
['End Surgery retained',h.includes('data-label="Surgery end"')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock retained',h.includes('id="endSaveArchiveBtn"')],
['Current SW generation',sw.includes("anesvet-v17-11-3-startup")],
['Current OR workspace assets cached',sw.includes("or-workspace-restructure.js?v=17.11.3")&&sw.includes("or-workspace-restructure.css?v=17.11.3")]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
