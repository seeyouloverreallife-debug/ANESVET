/* ANESVET R14 full QA: current-case revision fencing + prior release regressions. */
'use strict';
const fs=require('fs'),cp=require('child_process'),path=require('path');
const suites=[
  'QA_R14_STARTUP_RECOVERY_GUARD.js','QA_R13_CURRENT_CASE_FRESHNESS.js','QA_R13_R12_WAKE_REGRESSION.js','QA_R14_R11_STORAGE_REGRESSION.js',
  'QA_R10_SESSION_MODAL_GUARD.js','QA_R09_PATIENT_SETUP_DIRTY.js','QA_R08_MODAL_NAVIGATION.js',
  'QA_R07_SHORTCUT_TAP_ORIGIN.js','QA_R06_TOUCH_OVERLAY_GUARD.js',
  'QA_R14_NAVIGATION_REGRESSION.js','QA_R14_ASA_TRACE_REGRESSION.js','QA_BOOT_RUNTIME_V17_2_18.js',
  'QA_R04_PATIENT_ASA_INTERACTION.js','QA_R01_PATIENT_ASA_BINDING.js',
  'QA_INTERACTION_GATE_V17_2_4.js','QA_ACTIVE_CASE_RESCUE_V17_2_3.js',
  'QA_MOBILE_RESCUE_V17_2_2.js','QA_SYNC_FOUNDATION_V17_1_0.js','QA_SYNC_SAFETY_V17_2_0.js'
];
const summary=[];let errors=0;
for(const file of suites){
 const p=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8',timeout:16000});
 const passed=p.status===0&&!p.error;summary.push({file,passed});
 console.log(`${passed?'PASS':'FAIL'} ${file}`);
 if(!passed){errors++;console.error((p.stderr||p.stdout||p.error?.message||'').slice(-4000))}
}
let jsOK=0;for(const file of fs.readdirSync(__dirname).filter(x=>x.endsWith('.js'))){
 const p=cp.spawnSync(process.execPath,['--check',path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8',timeout:4000});
 if(p.status===0)jsOK++;else{errors++;console.error('FAIL JS syntax',file,(p.stderr||'').slice(-900))}
}
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'service-worker.js'),'utf8');
const refs=[...html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:\?[^"#]*)?"/g)].map(m=>m[1]);
const m=sw.match(/const ASSETS=(\[[^\n]*?\]);/);
let assets=[];try{assets=JSON.parse(m?.[1]||'[]')}catch(e){errors++;console.error('FAIL cache parse',e)}
const missing=[...new Set([...refs,...assets.map(s=>s.replace(/^\.\//,'').split('?')[0])].filter(x=>x&&x!=='.'&&!fs.existsSync(path.join(__dirname,x))))];
if(missing.length){errors++;console.error('FAIL missing assets',missing)}
const ids=[...html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const duplicateIds=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
if(duplicateIds.length){errors++;console.error('FAIL duplicate ids',duplicateIds)}
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.webmanifest'),'utf8'));
const versionGood=html.includes('<title>ANESVET V17.2.18</title>')
 &&html.includes('./app.js?v=17.2.18')
 &&sw.includes("const CACHE='anesvet-v17-2-18-r14-startup-recovery-guard'")
 &&fs.readFileSync(path.join(__dirname,'app.js'),'utf8').includes("const APP_VERSION='17.2.18'")
 &&manifest.start_url==='./?v=17.2.18'
 &&html.indexOf('active-case-freshness.js?v=17.2.18')>=0
 &&html.indexOf('active-case-freshness.js?v=17.2.18')<html.indexOf('app.js?v=17.2.18')
 &&sw.includes('./active-case-freshness.js?v=17.2.18');
if(!versionGood){errors++;console.error('FAIL version/cache/module load order')}
const result={version:'17.2.18',checkpoint:'R14',suitePassed:summary.filter(s=>s.passed).length,suiteTotal:suites.length,jsSyntaxPassed:jsOK,htmlIds:ids.length,duplicateIds:duplicateIds.length,cachedAssets:assets.length,missingAssets:missing.length,versionConsistency:versionGood,errors,suites:summary};
fs.writeFileSync(path.join(__dirname,'QA_R14_RESULTS.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,suites:undefined},null,2));
if(errors)process.exitCode=1;
