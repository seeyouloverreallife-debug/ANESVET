/* ANESVET V17.10.7 source-contract regression harness. Run: node QA_V17_9_5_REGRESSION.js */
'use strict';
const fs=require('fs'),path=require('path'),R=__dirname;
const read=f=>fs.readFileSync(path.join(R,f),'utf8');
const html=read('index.html'),mobile=read('mobile-design.js'),mobOwner=read('mobile-or-owner.js'),orSpeed=read('or-speed-hardening.js'),workspace=read('workspace-owner.js'),repeat=read('repeat-presentation-owner.js'),med=read('medication-workspace-controller.js');
const tests=[
 ['End Surgery native hook',html.includes('data-label="Surgery end"')],
 ['Calculated-as-given checkbox',html.includes('id="orQuickDrugChangeActual"')],
 ['Calculated default is actual',med.includes('actual=changeActual||!hasCalculatedDefault')],
 ['Changed actual audit note',med.includes('Actual amount changed from calculated')],
 ['OR core safety exists',html.includes('id="orCoreSafety"')],
 ['OR details secondary exists',html.includes('id="orSecondaryDetails"')],
 ['Recovery handoff exists',html.includes('id="recoveryHandoffPanel"')],
 ['Recovery details secondary exists',html.includes('id="recoverySecondaryDetails"')],
 ['Emergency return exists',html.includes('id="emergencyReturnOrBtn"')],
 ['Mobile shell editing guard',mobile.includes('!view.editing')],
 ['Single keyboard presentation owner',mobOwner.includes("classList.toggle('anesvet-soft-keyboard'")&&mobOwner.includes("classList.toggle('av-editing'")],
 ['OR speed delegates viewport',orSpeed.includes('ANESVET_MOBILE_OR_OWNER?.subscribe')],
 ['Workspace owns workflow current step',workspace.includes("setAttribute('aria-current','step')")],
 ['Workspace owns active-tab alignment',workspace.includes("workflow.scrollTo({left,behavior:'auto'})")],
 ['Repeat owner owns Recovery→End Case action',repeat.includes("recoveryToEndCaseBtn")&&repeat.includes("setTab?.('endcase')")],
 ['Repeat owner owns guided Final Review action',repeat.includes("endCaseFastFinishBtn")&&repeat.includes("endCaseNextTaskBtn")]
];
let pass=0;for(const [name,ok] of tests){console.log(`${ok?'PASS':'FAIL'}  ${name}`);if(ok)pass++}
console.log(`\n${pass}/${tests.length} PASS`);process.exit(pass===tests.length?0:1);
