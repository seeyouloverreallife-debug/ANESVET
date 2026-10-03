'use strict';
const fs=require('fs'),path=require('path'),R=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(R,f),'utf8');
const h=read('index.html'),sw=read('service-worker.js'),css=read('assets/css/anesvet-ui-bundle.css');
const scripts=[...h.matchAll(/<script[^>]+src=["\']([^"\']+)["\']/g)].map(x=>x[1]);
const ids=[...h.matchAll(/\sid=["\']([^"\']+)["\']/g)].map(x=>x[1]);
const dup=[...new Set(ids.filter((x,i,a)=>a.indexOf(x)!==i))];
const local=p=>p.split('?')[0].replace(/^\.\//,'');
const scriptFiles=scripts.map(local);
const styleFiles=[...h.matchAll(/<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+)["\']/g)].map(x=>local(x[1]));
const swAssets=[...sw.matchAll(/["'](\.\/[^"']+?)(?:\?v=[^"']+)?["']/g)].map(x=>local(x[1])).filter(x=>x&&x!=='./');
const missingScripts=scriptFiles.filter(x=>!fs.existsSync(path.join(R,x)));
const missingStyles=styleFiles.filter(x=>!fs.existsSync(path.join(R,x)));
const missingSw=[...new Set(swAssets)].filter(x=>x!=='index.html'&&x!=='manifest.webmanifest'&&!fs.existsSync(path.join(R,x)));
const posBase=x=>scriptFiles.findIndex(p=>path.basename(p)===x);
const retired=['ui-refinement.js','adaptive-workspace.js','clinical-simplicity.js','recovery-endcase-ux.js','repeat-use-ux.js','repeat-use-r26.js','focused-workspace.js','progressive-disclosure.js','progressive-clinical-flow.js','pilot-efficiency.js','usability-hardening.js','mobile-first-r27.js','or-speed-hardening.js'];
const runtimeVersionFiles=['index.html','manifest.webmanifest','service-worker.js','app.js','architecture-registry.js','knowledge-loader.js','medication-workspace-controller.js','or-live-controller.js','or-workspace-restructure.js','runtime/platform/presentation-ownership.js','pwa-controller.js'];
const runtimeMap=JSON.parse(read('config/runtime-map.json'));
const lazyFiles=runtimeMap.lazyModules.map(x=>x.path);
const platformFiles=runtimeMap.startupModules.filter(x=>x.group==='platform-foundation').map(x=>x.path);
const T=[
 ['69 runtime scripts',scriptFiles.length===69],
 ['All startup runtime scripts exist at declared paths',missingScripts.length===0],
 ['Five platform startup modules exist under runtime/platform',platformFiles.length===5&&platformFiles.every(x=>x.startsWith('runtime/platform/')&&fs.existsSync(path.join(R,x)))],
 ['No platform startup root copies remain',platformFiles.every(x=>!fs.existsSync(path.join(R,path.basename(x))))],
 ['All seven lazy modules exist under runtime/knowledge',lazyFiles.length===7&&lazyFiles.every(x=>x.startsWith('runtime/knowledge/')&&fs.existsSync(path.join(R,x)))],
 ['No lazy knowledge module remains at root',lazyFiles.every(x=>!fs.existsSync(path.join(R,path.basename(x))))],
 ['All linked stylesheets exist',missingStyles.length===0],
 ['All local service-worker assets exist',missingSw.length===0],
 ['HTML IDs are unique',dup.length===0],
 ['Lifecycle coordinator loads before workspace owners',posBase('lifecycle-coordinator.js')>=0&&posBase('lifecycle-coordinator.js')<posBase('workspace-owner.js')],
 ['Platform five retain exact relative order',JSON.stringify(scriptFiles.slice(0,5).map(x=>path.basename(x)))===JSON.stringify(['lifecycle-coordinator.js','viewport-coordinator.js','workspace-owner.js','presentation-ownership.js','mobile-or-owner.js'])],
 ['App shell loads before app core',posBase('app-shell.js')>=0&&posBase('app-shell.js')<posBase('app.js')],
 ['OR LIVE controller loads before app core',posBase('or-live-controller.js')>=0&&posBase('or-live-controller.js')<posBase('app.js')],
 ['Medication workspace controller loads before app core',posBase('medication-workspace-controller.js')>=0&&posBase('medication-workspace-controller.js')<posBase('app.js')],
 ['PWA controller loads before app core',posBase('pwa-controller.js')>=0&&posBase('pwa-controller.js')<posBase('app.js')],
 ['Finalization loads before repeat presentation owner',posBase('finalization.js')>=0&&posBase('finalization.js')<posBase('repeat-presentation-owner.js')],
 ['All 13 retired JS owners are absent from startup and SW',retired.every(x=>!scriptFiles.some(p=>path.basename(p)===x)&&!sw.includes('/'+x+'?v='))],
 ['All 13 retired JS owners are preserved under src/legacy-js',retired.every(x=>fs.existsSync(path.join(R,'src/legacy-js',x)))],
 ['Fast-entry CSS remains in canonical bundle',css.includes('.or-fast-entry-rail')],
 ['Service worker precaches only two canonical production styles',(()=>{const refs=[...sw.matchAll(/["'](\.\/[^"']+\.css)\?v=/g)].map(x=>x[1]);return refs.length===2&&refs.includes('./assets/css/anesvet-ui-bundle.css')&&refs.includes('./assets/css/or-workspace-restructure.css')})()],
 ['Deployment runtime files use V17.13.13 only',runtimeVersionFiles.every(f=>read(f).includes('17.13.13')||f==='architecture-registry.js')&&!h.includes('17.13.12')&&!sw.includes('17.13.12')],
 ['Current SW cache generation is V17.13.13',sw.includes('anesvet-v17-13-13-startup')],
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++;else if(n.includes('scripts'))console.log(missingScripts);else if(n.includes('stylesheets'))console.log(missingStyles);else if(n.includes('service-worker'))console.log(missingSw);else if(n.includes('IDs'))console.log(dup)}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
