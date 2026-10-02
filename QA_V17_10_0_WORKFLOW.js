/* ANESVET V17.10.8 workflow source-contract regression */
'use strict';const fs=require('fs'),p=require('path'),R=__dirname,read=f=>fs.readFileSync(p.join(R,f),'utf8');
const h=read('index.html'),n=read('clinical-next-step-controller.js');
const tests=[
['Next Step card exists',h.includes('id="clinicalNextStepCard"')&&h.includes('id="clinicalNextStepBtn"')],
['Patient save state drives next step',n.includes("patientSaveStatus")&&n.includes("setTab?.('patient')")],
['Preop state drives next step',n.includes("preopProgress")&&n.includes("setTab?.('preop')")],
['Drug plan reuses native task',n.includes("drugNextTaskBtn")],
['OR entry reuses native readiness gate',n.includes("goOrLiveFromDrugBtn")],
['Active case resumes OR',n.includes("s.caseStartedAt")&&n.includes("setTab?.('orlive')")],
['Recovery resumes Recovery',n.includes("s.recoveryStartedAt")&&n.includes("setTab?.('recovery')")],
['Completed Recovery goes End Case',n.includes("s.recoveryCompletedAt")&&n.includes("setTab?.('endcase')")],
['Controller does not directly Start Case',!n.includes("startCaseBtn')?.click")],
['Controller does not directly Complete Recovery',!n.includes("completeRecoveryBtn')?.click")],
['Controller does not directly Final Lock',!n.includes("finalizeCaseBtn')?.click")]
];let pass=0;for(const [x,o] of tests){console.log(`${o?'PASS':'FAIL'}  ${x}`);if(o)pass++}console.log(`\n${pass}/${tests.length} PASS`);process.exit(pass===tests.length?0:1);
