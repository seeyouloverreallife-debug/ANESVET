/* R19 cumulative QA gate: preserve historical baseline; advance only version-coupled suites. */
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process'),root=__dirname;
const prev=JSON.parse(fs.readFileSync(path.join(root,'QA_R18_RESULTS.json'),'utf8'));
const mapping={'QA_R15_CURRENT_MIRROR_INTEGRITY.js':'QA_R19_COMPAT_CURRENT_MIRROR_INTEGRITY.js','QA_R15_R14_STARTUP_REGRESSION.js':'QA_R19_COMPAT_R14_STARTUP_REGRESSION.js','QA_R15_R13_FRESHNESS_REGRESSION.js':'QA_R19_COMPAT_R13_FRESHNESS_REGRESSION.js','QA_R15_R12_WAKE_REGRESSION.js':'QA_R19_COMPAT_R12_WAKE_REGRESSION.js','QA_R15_R11_STORAGE_REGRESSION.js':'QA_R19_COMPAT_R11_STORAGE_REGRESSION.js','QA_R18_NAVIGATION_REGRESSION.js':'QA_R19_NAVIGATION_REGRESSION.js','QA_R18_ASA_TRACE_REGRESSION.js':'QA_R19_ASA_TRACE_REGRESSION.js','QA_BOOT_RUNTIME_V17_2_22.js':'QA_BOOT_RUNTIME_V17_2_23.js'};
const suites=['QA_R19_TRANSACTION_JOURNAL.js',...prev.suites.map(x=>mapping[x.file]||x.file)];
const results=[];
for(const file of suites){const run=cp.spawnSync(process.execPath,[path.join(root,file)],{cwd:root,encoding:'utf8',timeout:30000,maxBuffer:3*1024*1024});const ok=run.status===0&&!run.error;results.push({file,passed:ok,error:ok?'':String(run.error?.message||run.stderr||run.stdout).slice(0,2000)});console.log((ok?'PASS ':'FAIL ')+file);if(!ok)console.log(results.at(-1).error);}
const jsFiles=fs.readdirSync(root).filter(x=>x.endsWith('.js')),syntaxErrors=[];
for(const file of jsFiles){const r=cp.spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8',timeout:15000});if(r.status!==0)syntaxErrors.push({file,error:(r.stderr||'').slice(0,400)});}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]),repeats=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
const assets=[...sw.matchAll(/"(\.\/[^"\s]+)"/g)].map(m=>m[1]);
const cacheAssets=assets.slice(0,assets.indexOf('./icon-maskable-512.png')+1);
const missing=cacheAssets.filter(a=>!fs.existsSync(path.join(root,a.replace(/^\.\//,'').split('?')[0])));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const versionConsistency=manifest.start_url==='./?v=17.2.23'&&html.includes('<title>ANESVET V17.2.23</title>')&&app.includes("const APP_VERSION='17.2.23'")&&sw.includes("const CACHE='anesvet-v17-2-23-r19-restore-transaction-journal'")&&html.includes('./app.js?v=17.2.23')&&sw.includes('./app.js?v=17.2.23');
const report={version:'17.2.23',checkpoint:'R19',suitePassed:results.filter(x=>x.passed).length,suiteTotal:results.length,jsSyntaxPassed:jsFiles.length-syntaxErrors.length,jsSyntaxTotal:jsFiles.length,syntaxErrors,htmlIds:ids.length,duplicateIds:repeats,cachedAssets:cacheAssets.length,missingAssets:missing,versionConsistency,suites:results,limitations:['localStorage + IndexedDB cannot be a single atomic transaction','No real browser E2E or physical Android/iPad verified','Incomplete clinical store reconciliation must be handled by supervised recovery; manual REVIEW does not merge records']};
fs.writeFileSync(path.join(root,'QA_R19_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log('R19_SUMMARY',JSON.stringify({suitePassed:report.suitePassed,suiteTotal:report.suiteTotal,jsSyntaxPassed:report.jsSyntaxPassed,jsSyntaxTotal:report.jsSyntaxTotal,duplicateIds:repeats.length,missingAssets:missing.length,versionConsistency}));
if(report.suitePassed!==report.suiteTotal||syntaxErrors.length||repeats.length||missing.length||!versionConsistency)process.exitCode=1;
