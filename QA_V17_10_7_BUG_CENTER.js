'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),u=read('app-pure-utils.js'),vm=read('recovery-handoff-view-model.js'),pm=read('patient-master-controller.js'),app=read('app.js'),sw=read('service-worker.js');
const scripts=[...h.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0]),idx=x=>scripts.findIndex(v=>v.endsWith(x));
const T=[
['App utils exports required global',u.includes('root.ANESVET_APP_UTILS=api')],
['App utils loads before handoff model',idx('app-pure-utils.js')>=0&&idx('app-pure-utils.js')<idx('recovery-handoff-view-model.js')],
['Handoff model loads before app',idx('recovery-handoff-view-model.js')<idx('app.js')],
['Handoff model dependency contract present',vm.includes('ANESVET_APP_UTILS must load before recovery-handoff-view-model.js')],
['No undefined refreshPanel diagnostic call',!h.includes('refreshPanel()')],
['Navigation diagnostic uses existing renderer',h.includes('if(panel&&!panel.hidden)renderIssues()')],
['Diagnostic copy captures button before await',h.includes("const btn=e.currentTarget,value=copyIssueText()")],
['Diagnostic copy does not use async currentTarget after await',!h.includes("await navigator.clipboard.writeText(value);e.currentTarget")],
['ASA cards have click handler',pm.includes("$$('.asa-card').forEach(card=>card.addEventListener('click'")],
['ASA handler writes hidden input',pm.includes("input.value=card.dataset.asa")],
['ASA handler synchronizes selected cards',pm.includes('syncAsaCards();updatePatientSaveStatus()')],
['ASA is required by readiness',app.includes("required.push({key:'asa',label:'ASA Physical Status'")],
['Current SW caches utils',sw.includes('app-pure-utils.js?v=17.10.10')],
['Current SW caches handoff model',sw.includes('recovery-handoff-view-model.js?v=17.10.10')],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')]
];let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);