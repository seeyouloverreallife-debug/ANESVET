'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),sw=read('service-worker.js'),own=read('presentation-ownership.js'),shell=read('app-shell.js'),app=read('app.js'),fin=read('finalization.js'),repeat=read('repeat-presentation-owner.js'),ws=read('workspace-owner.js'),speed=read('or-speed-hardening.js'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js');
const scripts=[...h.matchAll(/<script[^>]+src=["\']([^"\']+)["\']/g)].map(x=>x[1].split('?')[0].replace(/^\.\//,''));
const retiredI=['ui-refinement.js','adaptive-workspace.js','clinical-simplicity.js','recovery-endcase-ux.js','repeat-use-ux.js','repeat-use-r26.js'];
const retiredII=['focused-workspace.js','progressive-disclosure.js','progressive-clinical-flow.js','pilot-efficiency.js'];
const retiredIII=['usability-hardening.js','mobile-first-r27.js'];
const retired=[...retiredI,...retiredII,...retiredIII];
const T=[
 ['Runtime scripts reduced to 70',scripts.length===70],
 ['Legacy Retirement III modules absent from runtime',retiredIII.every(x=>!scripts.includes(x))],
 ['Legacy Retirement III modules absent from service worker JS precache',retiredIII.every(x=>!sw.includes('./'+x+'?v='))],
 ['Ownership registry tracks all twelve retired modules',retired.every(x=>own.includes(x))],
 ['Retired source files retained for traceability',retiredIII.every(x=>fs.existsSync(R+'/'+x)&&read(x).startsWith('/* RETIRED in ANESVET V17.13.3'))],
 ['Readiness inline fix uses structured tab/target descriptors',app.includes('data-readiness-tab')&&app.includes('data-readiness-target')&&app.includes('function runPreOrReadinessFix')],
 ['Readiness no longer depends on retired regex map at runtime',!scripts.includes('usability-hardening.js')&&app.includes('x.tab')&&app.includes('x.target')],
 ['Storage status assist moved to app shell',shell.includes('function bindStorageStatusAssist()')&&shell.includes('uxSaveAssist')&&shell.includes("reason:'ux-retry'")],
 ['End Case blockers carry canonical action type',fin.includes('data-end-action')&&fin.includes("runNext(chip.dataset.endAction||'')")],
 ['End Case blocker keyboard access retained',fin.includes("e.key!=='Enter'&&e.key!==' '")],
 ['Floating return shortcut moved to repeat owner',repeat.includes('function ensureReturnShortcut()')&&repeat.includes("btn.id='uxReturnCase'")],
 ['Return shortcut still blocks modal/security/read-only reach-through',repeat.includes("classList?.contains('security-locked')")&&repeat.includes("classList?.contains('session-readonly')")&&repeat.includes("document.querySelector('dialog[open]')")],
 ['Return shortcut still requires a genuine pointer start',repeat.includes('function rememberShortcutPress')&&repeat.includes('Math.hypot')&&repeat.includes('elementFromPoint')],
 ['Return shortcut refreshes on tab and case-clock changes',repeat.includes("querySelectorAll('.tabpage')")&&repeat.includes("'caseClock'")],
 ['Mobile Identity bridge moved to workspace owner',ws.includes('function setupMobileIdentityBridge()')&&ws.includes("btn.id='mobileIdentityBtn'")&&ws.includes('chip.click()')],
 ['Mobile Identity still reuses security session surface',ws.includes("$('securityIdentityChip')")&&!scripts.includes('mobile-first-r27.js')],
 ['OR speed hardening intentionally retained',scripts.includes('or-speed-hardening.js')&&speed.includes('ANESVET_OR_SPEED_HARDENING')&&speed.includes('saveVitalsFromRail')],
 ['Repeat presentation owner intentionally retained',scripts.includes('repeat-presentation-owner.js')&&repeat.includes('ANESVET_REPEAT_PRESENTATION_OWNER')],
 ['Induction given/details pending preserved',o.includes('markPreparedInductionGivenAtMilestone')&&m.includes("status:'given-details-pending'")],
 ['Editable induction administration time preserved',h.includes('id="orQuickDrugAdminTime"')&&m.includes('epochFromTimeInput')],
 ['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
 ['End Surgery preserved',h.includes('data-label="Surgery end"')],
 ['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
 ['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')],
 ['Runtime app version is current',app.includes("const APP_VERSION='17.13.3'")],
 ['Manifest is current',read('manifest.webmanifest').includes('ANESVET V17.13.3')&&read('manifest.webmanifest').includes('v=17.13.3')],
 ['Current SW generation',sw.includes('anesvet-v17-13-3-startup')],
 ['No V17.13.2 deployment refs remain in index or service worker',!h.includes('17.13.2')&&!sw.includes('17.13.2')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
