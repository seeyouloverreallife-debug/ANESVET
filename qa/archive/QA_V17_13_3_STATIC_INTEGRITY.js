'use strict';
const fs=require('fs'),path=require('path'),R=__dirname,read=f=>fs.readFileSync(path.join(R,f),'utf8');
const h=read('index.html'),sw=read('service-worker.js'),css=read('anesvet-ui-bundle.css');
const scripts=[...h.matchAll(/<script[^>]+src=["\']([^"\']+)["\']/g)].map(x=>x[1]);
const ids=[...h.matchAll(/\sid=["\']([^"\']+)["\']/g)].map(x=>x[1]);
const dup=[...new Set(ids.filter((x,i,a)=>a.indexOf(x)!==i))];
const local=p=>p.split('?')[0].replace(/^\.\//,'');
const scriptFiles=scripts.map(local);
const styleFiles=[...h.matchAll(/<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']/g)].map(x=>local(x[1]));
const swAssets=[...sw.matchAll(/["'](\.\/[^"]+?)(?:\?v=[^"']+)?["']/g)].map(x=>local(x[1])).filter(x=>x&&x!=='./');
const missingScripts=scriptFiles.filter(x=>!fs.existsSync(path.join(R,x)));
const missingStyles=styleFiles.filter(x=>!fs.existsSync(path.join(R,x)));
const missingSw=[...new Set(swAssets)].filter(x=>x!=='index.html'&&x!=='manifest.webmanifest'&&!fs.existsSync(path.join(R,x)));
const pos=x=>scriptFiles.indexOf(x);
const retired=['usability-hardening.js','mobile-first-r27.js'];
const T=[
 ['70 runtime scripts',scriptFiles.length===70],
 ['All runtime scripts exist',missingScripts.length===0],
 ['All linked stylesheets exist',missingStyles.length===0],
 ['All local service-worker assets exist',missingSw.length===0],
 ['HTML IDs are unique',dup.length===0],
 ['Lifecycle coordinator loads before workspace owners',pos('lifecycle-coordinator.js')>=0&&pos('lifecycle-coordinator.js')<pos('workspace-owner.js')],
 ['App shell loads before app core',pos('app-shell.js')>=0&&pos('app-shell.js')<pos('app.js')],
 ['Finalization loads before repeat presentation owner',pos('finalization.js')>=0&&pos('finalization.js')<pos('repeat-presentation-owner.js')],
 ['OR speed hardening remains after OR owners',pos('or-speed-hardening.js')>pos('or-workspace-restructure.js')],
 ['Retirement III JS absent everywhere active',retired.every(x=>!scriptFiles.includes(x)&&!sw.includes('./'+x+'?v='))],
 ['Migrated usability classes still have CSS',css.includes('.ux-inline-fix')&&css.includes('.ux-save-assist')&&css.includes('.ux-return-case')&&css.includes('.ux-actionable-blocker')],
 ['Migrated mobile identity keeps CSS',css.includes('#mobileIdentityBtn')&&css.includes('.r27-identity-icon')],
 ['Deployment refs use only V17.13.3',!h.includes('17.13.2')&&!sw.includes('17.13.2')&&h.includes('17.13.3')&&sw.includes('17.13.3')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(!v){if(n.includes('scripts'))console.log(missingScripts);if(n.includes('stylesheets'))console.log(missingStyles);if(n.includes('service-worker'))console.log(missingSw);if(n.includes('IDs'))console.log(dup)}else p++}console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
