'use strict';const fs=require('fs'),R=__dirname,h=fs.readFileSync(R+'/index.html','utf8'),o=fs.readFileSync(R+'/or-live-controller.js','utf8'),c=fs.readFileSync(R+'/anesvet-ui-bundle.css','utf8');
const T=[
['Vaporizer rotary control',h.includes('id="setupVaporizerDial"')&&h.includes('id="setupVaporizerKnob"')],
['Vaporizer numeric fallback',h.includes('id="setupVaporizer"')&&h.includes('id="setupVaporizerMinus"')&&h.includes('id="setupVaporizerPlus"')],
['O2 vertical flow control',h.includes('id="setupO2Slider"')&&h.includes('id="setupO2Float"')],
['O2 numeric fallback',h.includes('id="setupO2Minus"')&&h.includes('id="setupO2Plus"')],
['Vaporizer sync',o.includes("setupVaporizerDial')?.addEventListener('input'")&&o.includes("setSetupHardware('vap'")],
['O2 sync',o.includes("setupO2Slider')?.addEventListener('input'")&&o.includes("setSetupHardware('o2'")],
['Visuals refresh on dialog open',o.includes('renderSetupHardware();')&&o.includes('dlg.showModal()')],
['Authoritative vaporizer field preserved',o.includes("['setupVaporizer','vaporizer']")],
['Authoritative O2 field preserved',o.includes("['setupO2','o2flow']")],
['Touch fallback controls are 44px',c.includes('.hardware-stepper button{min-height:44px')],
['Airway save preserved',h.includes('id="saveAirwaySetupBtn"')],
['PIP and ventilator RR preserved',h.includes('id="setupPip"')&&h.includes('id="setupVentRr"')],
['Fluid controls preserved',h.includes('id="setupFluidRate"')&&h.includes('id="setupFluidActual"')],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Final lock preserved',h.includes('id="endSaveArchiveBtn"')]
];let n=0;for(const [x,v] of T){console.log((v?'PASS':'FAIL')+'  '+x);if(v)n++}console.log(`\n${n}/${T.length} PASS`);process.exit(n===T.length?0:1);