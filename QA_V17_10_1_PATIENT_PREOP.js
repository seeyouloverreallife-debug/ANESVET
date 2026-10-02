'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),c=read('patient-preop-simplification.js'),css=read('anesvet-ui-bundle.css'),med=read('medication-workspace-controller.js');
const T=[
['Quick Case Setup surface',h.includes('id="patientMoreDetailsBtn"')&&h.includes('id="patientRequiredSummary"')],
['Core patient fields retained',['patientName','species','weight','patientProcedure','asa'].every(id=>h.includes(`id="${id}"`))],
['Secondary data retained',['visitId','microchip','bcs','caseWorkflowProfile','surgeon','anesthetist','surgicalAssistant'].every(id=>h.includes(`id="${id}"`))],
['Secondary progressive disclosure',css.includes('.patient-secondary-field:not(.patient-secondary-open)')],
['BW remains required',h.includes('Current weight วันนี้ (kg) <span class="required">*</span>')],
['Patient save native action retained',h.includes('id="savePatientBtn"')],
['Preop physical exam retained',h.includes('id="preopExamHeading"')&&h.includes('id="savePreopExamBtn"')],
['Preop risk retained',h.includes('id="preopRiskHeading"')],
['Preop quick next does not auto-complete',c.includes("preopNextIncompleteBtn")&&!c.includes('.checked=true')],
['Preop checklist progress retained',h.includes('id="preopProgress"')],
['End Surgery retained',h.includes('data-label="Surgery end"')],
['Calculated-as-given retained',h.includes('id="orQuickDrugChangeActual"')&&med.includes('actual=changeActual||!hasCalculatedDefault')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')]
];let p=0;for(const [n,o] of T){console.log((o?'PASS':'FAIL')+'  '+n);if(o)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);