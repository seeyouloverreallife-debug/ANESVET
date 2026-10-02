'use strict';const fs=require('fs'),R=__dirname,h=fs.readFileSync(R+'/index.html','utf8'),o=fs.readFileSync(R+'/or-live-controller.js','utf8'),c=fs.readFileSync(R+'/anesvet-ui-bundle.css','utf8');
const T=[
['Airway setup is no longer native dialog',h.includes('id="orAirwaySetupDialog" class="or-airway-setup-dialog" role="dialog"')&&!h.includes('<dialog id="orAirwaySetupDialog"')],
['No showModal dependency',!o.includes('dlg.showModal()')],
['Custom sheet explicitly opens',o.includes("dlg.hidden=false;dlg.classList.add('is-open')")],
['Custom sheet explicitly closes',o.includes("function closeAirwaySetup()")&&o.includes("dlg.hidden=true")],
['Close button works',o.includes("'orAirwaySetupClose')?.addEventListener('click',closeAirwaySetup")],
['Later button works',o.includes("'orAirwaySetupLater')?.addEventListener('click',closeAirwaySetup")],
['Backdrop tap can close',o.includes("if(e.target===$('orAirwaySetupDialog'))closeAirwaySetup()")],
['Sheet fixed to visible viewport',c.includes('.or-airway-setup-dialog.is-open{display:flex!important;position:fixed!important;inset:0!important')],
['Sheet has bounded mobile height',c.includes('max-height:90dvh!important')],
['Toast bottom forced auto',c.includes('bottom:auto!important')&&c.includes('max-height:120px!important')],
['Toast height forced auto',c.includes('height:auto!important;min-height:0!important')],
['Toast width content-bounded',c.includes('width:max-content!important')],
['Toast pointer events disabled',c.includes('pointer-events:none!important')],
['Vaporizer tactile control retained',h.includes('id="setupVaporizerDial"')],
['O2 flow tactile control retained',h.includes('id="setupO2Slider"')],
['Airway save retained',h.includes('id="saveAirwaySetupBtn"')],
['PIP/RR retained',h.includes('id="setupPip"')&&h.includes('id="setupVentRr"')],
['End Surgery retained',h.includes('data-label="Surgery end"')],
['Emergency return retained',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock retained',h.includes('id="endSaveArchiveBtn"')]
];let n=0;for(const [x,v] of T){console.log((v?'PASS':'FAIL')+'  '+x);if(v)n++}console.log(`\n${n}/${T.length} PASS`);process.exit(n===T.length?0:1);