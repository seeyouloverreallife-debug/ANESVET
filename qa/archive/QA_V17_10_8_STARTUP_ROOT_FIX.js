'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8'),h=read('index.html'),vm=read('recovery-handoff-view-model.js'),app=read('app.js'),sw=read('service-worker.js');
const T=[
['Handoff VM no longer throws on missing APP_UTILS',!vm.includes("if(!U)throw")&&!vm.includes("must load before recovery-handoff")],
['Handoff VM has local side-effect-free fallback',vm.includes("const normalized=(name)=>")&&vm.includes("ANESVET_APP_UTILS?.normalizedHandoffDrugName")],
['Handoff VM still exports expected global',vm.includes("window.ANESVET_RECOVERY_HANDOFF_VM=Object.freeze")],
['App still requires handoff VM after script execution',app.includes("const RECOVERY_HANDOFF_VM=window.ANESVET_RECOVERY_HANDOFF_VM")],
['Versioned JS/CSS is network-first',sw.includes("const isVersionedCode=")&&sw.includes("fetch(e.request,{cache:'no-store'})")],
['Offline fallback remains for versioned code',sw.includes("catch(()=>caches.match(e.request))")],
['New SW cache generation',sw.includes("anesvet-v17-10-9-startup")],
['No undefined refreshPanel regression',!h.includes('refreshPanel()')],
['Diagnostic async currentTarget fix retained',h.includes("const btn=e.currentTarget,value=copyIssueText()")],
['ASA cards retained',h.includes('class="asa-card')&&h.includes('id="asa" type="hidden"')],
['End Surgery retained',h.includes('data-label="Surgery end"')],
['Emergency Return retained',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock retained',h.includes('id="endSaveArchiveBtn"')]
];let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);