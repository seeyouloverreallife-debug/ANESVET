'use strict';const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),sw=read('service-worker.js'),life=read('lifecycle-coordinator.js'),view=read('viewport-coordinator.js'),mob=read('mobile-or-owner.js'),work=read('workspace-owner.js');
const scripts=[...h.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0]);
const idx=x=>scripts.findIndex(v=>v.endsWith(x));
const T=[
['No duplicate production script refs',new Set(scripts).size===scripts.length],
['Lifecycle first',idx('lifecycle-coordinator.js')===0],
['Viewport before workspace',idx('viewport-coordinator.js')<idx('workspace-owner.js')],
['Workspace before mobile owner',idx('workspace-owner.js')<idx('mobile-or-owner.js')],
['Workspace before V17.10 workflow controllers',idx('workspace-owner.js')<idx('patient-preop-simplification.js')&&idx('workspace-owner.js')<idx('drug-start-simplification.js')],
['Mobile owner early DOM guard',mob.includes('if(!document.body)return next')],
['Mobile owner exposes deterministic sync result',mob.includes('return next;')],
['Workspace reconciles pageshow/BFCache',work.includes("subscribe('pageshow',syncWorkflow)")],
['Lifecycle owns pageshow',life.includes("window.addEventListener('pageshow'")],
['Viewport coordinator owns resize',view.includes("window.addEventListener('resize'")&&view.includes("vv?.addEventListener('resize'")],
['Current manifest version',read('manifest.webmanifest').includes('17.10.6')],
['Current SW version',sw.includes('17.10.6')],
['Patient simplification cached',sw.includes('patient-preop-simplification.js?v=17.10.6')],
['Drug simplification cached',sw.includes('drug-start-simplification.js?v=17.10.6')],
['OR refinement cached',sw.includes('or-workflow-refinement.js?v=17.10.6')],
['Recovery refinement cached',sw.includes('recovery-end-refinement.js?v=17.10.6')],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')]
];let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);