/* R18 cumulative regression gate; preserves older unmodified QA files. */
'use strict';
const fs=require('fs'),path=require('path'),cp=require('child_process');
const root=__dirname;
const prev=JSON.parse(fs.readFileSync(path.join(root,'QA_R17_RESULTS.json'),'utf8'));
const suites=['QA_R18_RESTORE_SESSION_RACE.js',...prev.suites.map(x=>({
 'QA_R17_NAVIGATION_REGRESSION.js':'QA_R18_NAVIGATION_REGRESSION.js',
 'QA_R17_ASA_TRACE_REGRESSION.js':'QA_R18_ASA_TRACE_REGRESSION.js',
 'QA_BOOT_RUNTIME_V17_2_21.js':'QA_BOOT_RUNTIME_V17_2_22.js'
})[x.file]||x.file)];
const result=[];
for(const file of suites){
 const run=cp.spawnSync(process.execPath,[path.join(root,file)],{cwd:root,encoding:'utf8',timeout:20000});
 const passed=run.status===0&&!run.error;
 result.push({file,passed,error:passed?'':String(run.error?.message||run.stderr||run.stdout).slice(0,1000)});
 process.stdout.write(`${passed?'PASS':'FAIL'} ${file}\n`);
}
const jsFiles=fs.readdirSync(root).filter(x=>x.endsWith('.js'));
let syntaxPass=0;const syntaxErrors=[];
for(const file of jsFiles){const r=cp.spawnSync(process.execPath,['--check',path.join(root,file)],{encoding:'utf8',timeout:10000});if(r.status===0)syntaxPass++;else syntaxErrors.push({file,error:(r.stderr||'').slice(0,400)});}
const html=fs.readFileSync(path.join(root,'index.html'),'utf8'),sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);const repeats=[...new Set(ids.filter((id,i)=>ids.indexOf(id)!==i))];
const assets=[...sw.matchAll(/"(\.\/[^"\s]+)"/g)].map(m=>m[1]);
const cacheAssets=assets.slice(0,assets.indexOf('./icon-maskable-512.png')+1);
const missing=cacheAssets.filter(a=>!fs.existsSync(path.join(root,a.replace(/^\.\//,'').split('?')[0])));
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const versionConsistency=manifest.start_url==='./?v=17.2.22'&&html.includes('<title>ANESVET V17.2.22</title>')&&app.includes("const APP_VERSION='17.2.22'")&&sw.includes("const CACHE='anesvet-v17-2-22-r18-restore-session-guard'")&&html.includes('./app.js?v=17.2.22')&&sw.includes('./app.js?v=17.2.22');
const report={version:'17.2.22',checkpoint:'R18',suitePassed:result.filter(x=>x.passed).length,suiteTotal:result.length,jsSyntaxPassed:syntaxPass,jsSyntaxTotal:jsFiles.length,jsSyntaxErrors:syntaxErrors,htmlIds:ids.length,duplicateIds:repeats,cachedAssets:cacheAssets.length,missingAssets:missing,versionConsistency,suites:result,limitations:['IndexedDB and localStorage cannot be committed as one atomic browser transaction','Browser E2E and physical Android/iPad not validated']};
fs.writeFileSync(path.join(root,'QA_R18_RESULTS.json'),JSON.stringify(report,null,2)+'\n');
console.log('SUMMARY',JSON.stringify({suitePassed:report.suitePassed,suiteTotal:report.suiteTotal,jsSyntaxPassed:syntaxPass,jsSyntaxTotal:jsFiles.length,htmlIds:ids.length,duplicateIds:repeats.length,cachedAssets:cacheAssets.length,missingAssets:missing.length,versionConsistency}));
if(report.suitePassed!==report.suiteTotal||syntaxPass!==jsFiles.length||repeats.length||missing.length||!versionConsistency)process.exitCode=1;
