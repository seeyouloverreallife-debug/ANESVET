/* R21 cumulative QA. Build atop the verified R20 test manifest; preserve historical baselines. */
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),root=__dirname;
const prev=JSON.parse(fs.readFileSync(path.join(root,'QA_R20_RESULTS.json'),'utf8'));
const map={
 'QA_R20_NAVIGATION_REGRESSION.js':'QA_R21_NAVIGATION_REGRESSION.js',
 'QA_R20_ASA_TRACE_REGRESSION.js':'QA_R21_ASA_TRACE_REGRESSION.js',
 'QA_R20_BOOT_REPORT_PREFERENCE.js':'QA_R21_BOOT_REPORT_PREFERENCE_REGRESSION.js',
 'QA_BOOT_RUNTIME_V17_2_24.js':'QA_BOOT_RUNTIME_V17_2_25.js'
};
const suites=['QA_R21_CRITICAL_BOOT_BRIDGES.js',...prev.suites.map(r=>map[r.file]||r.file)];
const results=[];
for(const file of suites){const p=cp.spawnSync(process.execPath,[path.join(root,file)],{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:3*1024*1024});const ok=p.status===0&&!p.error;results.push({file,passed:ok,error:ok?'':String(p.error?.message||p.stderr||p.stdout).slice(0,1200)});console.log((ok?'PASS ':'FAIL ')+file);if(!ok)console.log(results.at(-1).error)}
const jsFiles=fs.readdirSync(root).filter(f=>f.endsWith('.js'));
const syntaxErrors=[];
for(const file of jsFiles){const p=cp.spawnSync(process.execPath,['--check',path.join(root,file)],{cwd:root,encoding:'utf8',timeout:10000});if(p.status!==0)syntaxErrors.push({file,message:String(p.stderr||p.error||'').slice(0,450)})}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),app=fs.readFileSync(path.join(root,'app.js'),'utf8'),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);const duplicates=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
const assets=[...sw.matchAll(/"(\.\/[^"\s]+)"/g)].map(x=>x[1]);const cacheAssets=assets.slice(0,assets.indexOf('./icon-maskable-512.png')+1);
const missing=cacheAssets.filter(url=>!fs.existsSync(path.join(root,url.replace(/^\.\//,'').split('?')[0])));
const versionConsistency=manifest.start_url==='./?v=17.2.25'&&html.includes('<title>ANESVET V17.2.25</title>')&&html.includes("const VERSION='17.2.25'")&&app.includes("const APP_VERSION='17.2.25'")&&sw.includes("const CACHE='anesvet-v17-2-25-r21-critical-boot-bridges'")&&html.includes('./app.js?v=17.2.25')&&sw.includes('./app.js?v=17.2.25');
const report={version:'17.2.25',checkpoint:'R21',suitePassed:results.filter(x=>x.passed).length,suiteTotal:results.length,jsSyntaxPassed:jsFiles.length-syntaxErrors.length,jsSyntaxTotal:jsFiles.length,syntaxErrors,htmlIds:ids.length,duplicateIds:duplicates,cachedAssets:cacheAssets.length,missingAssets:missing,versionConsistency,suites:results,limitations:['No physical Android/iPad validation of startup-complete','No real browser E2E validation in this environment','JavaScript boot static audit and simulated controller tests cannot guarantee absence of runtime-only ReferenceErrors']};
fs.writeFileSync(path.join(root,'QA_R21_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log('R21_SUMMARY',JSON.stringify({suitePassed:report.suitePassed,suiteTotal:report.suiteTotal,jsSyntaxPassed:report.jsSyntaxPassed,jsSyntaxTotal:report.jsSyntaxTotal,duplicateIds:duplicates.length,missingAssets:missing.length,versionConsistency}));
if(report.suitePassed!==report.suiteTotal||syntaxErrors.length||duplicates.length||missing.length||!versionConsistency)process.exitCode=1;
