'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8'),h=read('index.html'),o=read('or-live-controller.js'),css=read('anesvet-ui-bundle.css'),sw=read('service-worker.js');
const T=[
['Knowledge mobile dialog forced to viewport',css.includes('#clinicalKnowledgeDialog.ck-dialog{position:fixed!important;inset:0!important;width:100vw!important')],
['Airway setup sheet exists',h.includes('id="orAirwaySetupDialog"')&&h.includes('id="saveAirwaySetupBtn"')],
['Intubation opens setup sheet',o.includes("const dlg=$('orAirwaySetupDialog')")&&o.includes('dlg.showModal()')],
['Airway setup includes ETT',h.includes('id="setupEttSize"')&&h.includes('id="setupEttDepth"')],
['Airway setup includes vaporizer/O2',h.includes('id="setupVaporizer"')&&h.includes('id="setupO2"')],
['Airway setup includes PIP/RR',h.includes('id="setupPip"')&&h.includes('id="setupVentRr"')],
['Airway setup includes PEEP/VT',h.includes('id="setupPeep"')&&h.includes('id="setupVt"')],
['Airway setup includes fluid rate/actual',h.includes('id="setupFluidRate"')&&h.includes('id="setupFluidActual"')],
['Induction meds remain accessible',h.includes('id="setupOpenInductionMeds"')&&o.includes("openOrQuickDrug({phase:'induction',purpose:'induction'})")],
['Single save copies setup into authoritative fields',o.includes("['setupEttSize','airwayEttSize']")&&o.includes("['setupFluidRate','fluidRateInput']")],
['Save records Intubation milestone',o.includes("if(!hasProcedureMilestone('Intubation'))triggerOrMilestone('Intubation')")],
['Legacy airway editor remains available',h.includes('id="orAirwayPanelDetails"')&&h.includes('id="saveAirwayBtn"')],
['OR mobile toast moved above action workspace',css.includes("body.or-mobile-active .toast,body.recovery-mobile-active .toast{bottom:auto!important;top:")],
['Startup root fix retained',read('recovery-handoff-view-model.js').includes("ANESVET_APP_UTILS?.normalizedHandoffDrugName")],
['Versioned code network-first retained',sw.includes("const isVersionedCode=")&&sw.includes("cache:'no-store'")],
['End Surgery retained',h.includes('data-label="Surgery end"')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock retained',h.includes('id="endSaveArchiveBtn"')]
];let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);