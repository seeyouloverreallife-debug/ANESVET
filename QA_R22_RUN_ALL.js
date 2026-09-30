/* R22 cumulative QA: preserves all historical R21 source/results files. */
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),root=__dirname;
const historical=JSON.parse(fs.readFileSync(path.join(root,'QA_R21_RESULTS.json'),'utf8'));
const rename=new Map([
['QA_R21_CRITICAL_BOOT_BRIDGES.js','QA_R22_CRITICAL_BOOT_BRIDGES.js'],
['QA_R21_BOOT_REPORT_PREFERENCE_REGRESSION.js','QA_R22_BOOT_REPORT_PREFERENCE_REGRESSION.js'],
['QA_R21_NAVIGATION_REGRESSION.js','QA_R22_NAVIGATION_REGRESSION.js'],
['QA_R21_ASA_TRACE_REGRESSION.js','QA_R22_ASA_TRACE_REGRESSION.js'],
['QA_BOOT_RUNTIME_V17_2_25.js','QA_BOOT_RUNTIME_V17_2_26.js']]);
const suiteNames=historical.suites.map(r=>rename.get(r.file)||r.file).concat(['QA_R22_UX_ASSERTIONS.js']);
const result=[];
for(const file of suiteNames){
 const r=cp.spawnSync(process.execPath,[path.join(root,file)],{cwd:root,encoding:'utf8',timeout:35000,maxBuffer:4*1024*1024});
 const ok=r.status===0&&!r.error;
 result.push({file,passed:ok,error:ok?'':String(r.error?.message||r.stderr||r.stdout).slice(0,2000)});
 console.log((ok?'PASS ':'FAIL ')+file);if(!ok)console.log(result.at(-1).error);
}
const jsFiles=fs.readdirSync(root).filter(f=>f.endsWith('.js'));
const syntaxErrors=[];
for(const f of jsFiles){const r=cp.spawnSync(process.execPath,['--check',path.join(root,f)],{cwd:root,encoding:'utf8'});if(r.status!==0)syntaxErrors.push(f)}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),app=fs.readFileSync(path.join(root,'app.js'),'utf8'),m=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest')));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);const duplicateIds=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
const a=[...sw.matchAll(/"(\.\/[^"\s]+)"/g)].map(x=>x[1]);const assets=a.slice(0,a.indexOf('./icon-maskable-512.png')+1);
const missingAssets=assets.filter(u=>!fs.existsSync(path.join(root,u.replace(/^\.\//,'').split('?')[0])));
const versionConsistency=m.start_url==='./?v=17.2.26'&&html.includes('<title>ANESVET V17.2.26</title>')&&html.includes("const VERSION='17.2.26'")&&app.includes("const APP_VERSION='17.2.26'")&&sw.includes("const CACHE='anesvet-v17-2-26-r22-clinical-simplicity'")&&html.includes('./clinical-simplicity.js?v=17.2.26')&&sw.includes('./clinical-simplicity.js?v=17.2.26');
const report={version:'17.2.26',checkpoint:'R22 UX',suitePassed:result.filter(x=>x.passed).length,suiteTotal:result.length,syntaxPassed:jsFiles.length-syntaxErrors.length,syntaxTotal:jsFiles.length,syntaxErrors,duplicateIds,missingAssets,versionConsistency,results:result,limits:['No live Android/iPad browser E2E; Chromium blocked by administrator','No live anesthesia cases tested']};
fs.writeFileSync(path.join(root,'QA_R22_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log('R22_SUMMARY',JSON.stringify({suitePassed:report.suitePassed,suiteTotal:report.suiteTotal,syntaxPassed:report.syntaxPassed,syntaxTotal:report.syntaxTotal,duplicateIds:duplicateIds.length,missingAssets:missingAssets.length,versionConsistency}));
if(report.suitePassed!==report.suiteTotal||syntaxErrors.length||duplicateIds.length||missingAssets.length||!versionConsistency)process.exitCode=1;
