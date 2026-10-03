'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8'),h=read('index.html'),c=read('drug-start-simplification.js'),a=read('app.js'),m=read('medication-workspace-controller.js');
const T=[
['Medication Next Step surface',h.includes('id="drugWorkflowFocus"')&&h.includes('id="drugWorkflowPrimaryBtn"')],
['Current BW gate',c.includes("if(!bw)")&&c.includes("setTab?.('patient')")],
['Build delegates native protocol action',c.includes("autoCaseDrugPlanBtn")&&c.includes(".click()")],
['Review delegates native review action',c.includes("reviewCaseDrugPlanBtn")],
['OR entry delegates native readiness gate',c.includes("goOrLiveFromDrugBtn")],
['Controller never starts case directly',!c.includes("startCaseBtn")&&!c.includes("caseStartedAt=Date")],
['Frozen plan state represented',c.includes("PLAN FROZEN")&&c.includes("p.frozen")],
['Native Start Case retained',h.includes('id="startCaseBtn"')],
['Case Drug Plan retained',h.includes('id="caseDrugPlanList"')&&h.includes('id="caseDrugPlanStatus"')],
['Geno V Cefazolin profile retained',a.includes("Geno V Pet Care")&&a.includes("cefazolin")&&a.includes("250")],
['Geno V Convenia profile retained',a.includes("convenia")&&a.includes("80")],
['Calculated-as-given retained',h.includes('id="orQuickDrugChangeActual"')&&m.includes('actual=changeActual||!hasCalculatedDefault')],
['End Surgery retained',h.includes('data-label="Surgery end"')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')]
];let p=0;for(const [n,o] of T){console.log((o?'PASS':'FAIL')+'  '+n);if(o)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);