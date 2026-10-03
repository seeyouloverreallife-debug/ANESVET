'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),sw=read('service-worker.js'),own=read('presentation-ownership.js'),appShell=read('app-shell.js'),repeat=read('repeat-presentation-owner.js'),focus=read('focused-workspace.js'),pd=read('progressive-disclosure.js'),orw=read('or-workspace-restructure.js'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js');
const scripts=[...h.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0].replace(/^\.\//,''));
const retired=['ui-refinement.js','adaptive-workspace.js','clinical-simplicity.js','recovery-endcase-ux.js','repeat-use-ux.js','repeat-use-r26.js'];
const T=[
 ['Runtime script count reduced to 76',scripts.length===76],
 ['All retired modules absent from runtime',retired.every(x=>!scripts.includes(x))],
 ['Retired modules absent from service worker',retired.every(x=>!sw.includes('./'+x+'?v='))],
 ['Ownership registry exposes retired list',own.includes('retiredModules=Object.freeze')&&retired.every(x=>own.includes(x))],
 ['Save feedback moved to app shell',appShell.includes('function bindSaveStateFeedback()')&&appShell.includes("classList.add('ux-just-saved')")],
 ['Repeat owner installs resume actions',repeat.includes('function installReturnActions()')&&repeat.includes('r25ResumeFromPatient')],
 ['Repeat owner owns final-review simplification',repeat.includes('function simplifyFinalReview()')&&repeat.includes('r25FinalReviewDetails')],
 ['Repeat owner owns next-case CTA',repeat.includes('function buildNextCase()')&&repeat.includes('r26NextCaseButton')],
 ['Repeat owner owns Recovery Enter navigation',repeat.includes('function onRecoveryKey(e)')&&repeat.includes('RECOVERY_ENTRY')],
 ['Recovery Enter never auto-saves',!repeat.includes("recordRecoveryVitalsBtn')?.click")&&!repeat.includes("recordRecoveryVitalsBtn').click")],
 ['Focused workspace cannot mutate canonical OR layout',focus.includes("canMutate?.('orlive.layout','focused-workspace')")],
 ['Progressive disclosure respects owned Patient',pd.includes("group==='patient'?'patient.layout'")&&pd.includes('configs.filter(cfg=>canOwnGroup(cfg.group))')],
 ['Progressive disclosure respects owned Pre-op',pd.includes("group==='preop'?'preop.layout'")],
 ['Progressive disclosure respects owned Drug Plan',pd.includes("group==='drugs'?'drugs.layout'")],
 ['Progressive disclosure respects owned Recovery',pd.includes("group==='recovery'?'recovery.layout'")],
 ['Static Drug Plan label replaces clinical-simplicity mutation',h.includes('<span>ยา / Drug Plan</span>')],
 ['Static OR LIVE label replaces clinical-simplicity mutation',h.includes('<span>OR LIVE</span>')],
 ['Canonical OR owner still claimed',orw.includes("claim?.('orlive.layout','or-workspace-v17130')")],
 ['Induction given/details pending preserved',o.includes('markPreparedInductionGivenAtMilestone')&&m.includes("status:'given-details-pending'")],
 ['Editable induction administration time preserved',h.includes('id="orQuickDrugAdminTime"')&&m.includes('epochFromTimeInput')],
 ['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
 ['End Surgery preserved',h.includes('data-label="Surgery end"')],
 ['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
 ['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')],
 ['Current SW generation',sw.includes("anesvet-v17-13-1-startup")]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
