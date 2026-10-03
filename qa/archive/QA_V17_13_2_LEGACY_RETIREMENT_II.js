'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),sw=read('service-worker.js'),own=read('presentation-ownership.js'),ws=read('workspace-owner.js'),pp=read('patient-preop-simplification.js'),drug=read('drug-start-simplification.js'),rec=read('recovery-end-refinement.js'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js');
const scripts=[...h.matchAll(/<script[^>]+src=["\']([^"\']+)["\']/g)].map(x=>x[1].split('?')[0].replace(/^\.\//,''));
const retiredI=['ui-refinement.js','adaptive-workspace.js','clinical-simplicity.js','recovery-endcase-ux.js','repeat-use-ux.js','repeat-use-r26.js'];
const retiredII=['focused-workspace.js','progressive-disclosure.js','progressive-clinical-flow.js','pilot-efficiency.js'];
const retired=[...retiredI,...retiredII];
const T=[
 ['Runtime scripts reduced to 72',scripts.length===72],
 ['Legacy Retirement II modules absent from runtime',retiredII.every(x=>!scripts.includes(x))],
 ['Legacy Retirement II modules absent from service worker',retiredII.every(x=>!sw.includes('./'+x+'?v='))],
 ['Ownership registry tracks all retired modules',retired.every(x=>own.includes(x))],
 ['Patient owner owns linked-patient compact behavior',pp.includes('function setupPatientMasterCompact()')&&pp.includes('ux-linked-compact')],
 ['Patient owner owns Pre-op next incomplete behavior',pp.includes('function firstIncompletePreopTarget()')&&pp.includes("preopNextIncompleteBtn')?.addEventListener('click',preopNext")],
 ['Patient owner owns Pre-op focus state',pp.includes("preop-focus-incomplete")&&pp.includes('updatePreopEfficiency')],
 ['Patient owner retains secondary details owner',pp.includes("anesvet.patient.details.open")&&pp.includes('setDetails')],
 ['Drug owner derives next action without pilot module',drug.includes('function actionForPlan')&&drug.includes('function runAction')],
 ['Drug owner owns legacy next-task compatibility',drug.includes("drugNextTaskBtn')?.addEventListener")&&drug.includes('drug-plan-efficiency-summary')],
 ['Drug owner owns Quick Presets disclosure',drug.includes('function setupDrugSupportDisclosure()')&&drug.includes('ux-support-collapsed')],
 ['Recovery owner owns observation/checklist disclosure',rec.includes('function enhanceRecoveryPanel')&&rec.includes('ux-recovery-collapsible')],
 ['Recovery owner owns next-task behavior',rec.includes('function firstRecoveryMissingTarget')&&rec.includes('function runRecoveryNextTask')],
 ['Recovery owner owns focus pending UI',rec.includes('recovery-focus-pending')&&rec.includes('updateRecoveryEfficiency')],
 ['Recovery compatibility FocusedWorkspace surface preserved',rec.includes('root.ANESVETFocusedWorkspace=Object.freeze')],
 ['Workspace owner owns settings disclosure',ws.includes('function setupSettingsDisclosure()')&&ws.includes('pd-settings-toolbar')],
 ['ProgressiveDisclosure compatibility API preserved',ws.includes('root.ANESVETProgressiveDisclosure=Object.freeze')],
 ['Workspace owner owns workflow step state',ws.includes('btn.dataset.stepState=state')&&ws.includes('step ${i+1} of ${main.length}')],
 ['Workspace owner owns mobile Continue',ws.includes('function mobileContinueSpec()')&&ws.includes("mobileQuickContinueBtn')?.addEventListener")],
 ['Workspace owner owns mobile workflow status',ws.includes('function mobileStatusData')&&ws.includes('mobile-step-status')],
 ['Workspace focus opens canonical Recovery owner',ws.includes('ANESVET_RECOVERY_END_REFINEMENT?.openForElement')],
 ['Workspace focus opens canonical Patient details owner',ws.includes('ANESVET_PATIENT_PREOP_SIMPLIFICATION?.setDetails')],
 ['No current owner imports retired JS modules',![ws,pp,drug,rec].some(s=>retiredII.some(x=>s.includes(`./${x}`)))],
 ['OR canonical owner remains loaded',scripts.includes('or-workspace-restructure.js')],
 ['Induction given/details pending preserved',o.includes('markPreparedInductionGivenAtMilestone')&&m.includes("status:'given-details-pending'")],
 ['Editable induction administration time preserved',h.includes('id="orQuickDrugAdminTime"')&&m.includes('epochFromTimeInput')],
 ['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
 ['End Surgery preserved',h.includes('data-label="Surgery end"')],
 ['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
 ['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')],
 ['Current SW generation',sw.includes('anesvet-v17-13-2-startup')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
