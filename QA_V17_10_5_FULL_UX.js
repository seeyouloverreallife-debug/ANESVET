'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),pc=read('progressive-clinical-flow.js'),pp=read('patient-preop-simplification.js'),w=read('workspace-owner.js'),pilot=read('pilot-efficiency.js'),or=read('or-live-controller.js'),rec=read('recovery-controller.js'),med=read('medication-workspace-controller.js');
const T=[
['Patient legacy disclosure owner is guarded',pc.includes('if(window.ANESVET_PATIENT_PREOP_SIMPLIFICATION)return')],
['Patient owner no duplicate global focusin',!pp.includes("document.addEventListener('focusin'")],
['Workspace owner reveals patient secondary',w.includes("closest?.('.patient-secondary-field')")&&w.includes('setDetails?.(true,persist)')],
['Transient patient focus reveal does not persist',pp.includes('function setDetails(open,persist=true)')&&pp.includes('if(persist){try{localStorage.setItem')],
['Workspace opens nested details ancestors',w.includes("while(node)")&&w.includes("node.tagName==='DETAILS'")],
['Workspace scroll protected while editing',w.includes('ANESVET_MOBILE_OR_OWNER?.editing?.()')&&w.includes("block:'nearest'")],
['Pilot navigation uses workspace owner',pilot.includes('ANESVET_WORKSPACE_OWNER?.openForElement')&&!pilot.includes("block:'center'")],
['No global shell input rerender in mobile-design',!read('mobile-design.js').includes("document.addEventListener('input',schedule)")],
['Patient core workflow retained',h.includes('id="patientRequiredSummary"')&&h.includes('id="savePatientBtn"')],
['Preop next retained',h.includes('id="preopQuickActionBtn"')],
['Drug next retained',h.includes('id="drugWorkflowPrimaryBtn"')],
['OR phase strip retained',h.includes('id="orCorePhaseStrip"')],
['End Surgery retained',h.includes('data-label="Surgery end"')&&or.includes("'surgery-end':{title:'End surgery?'")],
['Recovery phase strip retained',h.includes('id="recoveryCorePhaseStrip"')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')&&rec.includes('emergencyReturnToOr')],
['Final Lock/archive retained',h.includes('id="endSaveArchiveBtn"')&&h.includes('id="finalArchiveAssurancePanel"')],
['Calculated-as-given retained',h.includes('id="orQuickDrugChangeActual"')&&med.includes('actual=changeActual||!hasCalculatedDefault')],
['Geno V preparation remains hospital-specific',read('app.js').includes("hospital:'Geno V Pet Care'")]
];let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);