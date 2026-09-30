/* ANESVET R08 focused QA + historical regressions + packaged-asset checks. */
'use strict';
const fs=require('fs'),cp=require('child_process'),path=require('path');
const suites=[
  'QA_R08_MODAL_NAVIGATION.js','QA_R07_SHORTCUT_TAP_ORIGIN.js',
  'QA_R06_TOUCH_OVERLAY_GUARD.js','QA_R06_NAVIGATION.js','QA_R06_ASA_CLICK_TRACE.js',
  'QA_BOOT_RUNTIME_V17_2_12.js','QA_R04_PATIENT_ASA_INTERACTION.js','QA_R01_PATIENT_ASA_BINDING.js',
  'QA_INTERACTION_GATE_V17_2_4.js','QA_ACTIVE_CASE_RESCUE_V17_2_3.js',
  'QA_MOBILE_RESCUE_V17_2_2.js','QA_SYNC_FOUNDATION_V17_1_0.js','QA_SYNC_SAFETY_V17_2_0.js'
];
const summary=[];let errors=0;
for(const file of suites){
 const p=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8',timeout:15000});
 const passed=p.status===0&&!p.error;summary.push({file,passed});
 console.log(`${passed?'PASS':'FAIL'} ${file}`);
 if(!passed){errors++;console.error((p.stderr||p.stdout||p.error?.message||'').slice(-3000))}
}
let jsOK=0;for(const file of fs.readdirSync(__dirname).filter(x=>x.endsWith('.js'))){
 const p=cp.spawnSync(process.execPath,['--check',path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8',timeout:4000});
 if(p.status===0)jsOK++;else{errors++;console.error('FAIL JS syntax',file,(p.stderr||'').slice(-1000))}
}
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'service-worker.js'),'utf8');
const refs=[...html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:\?[^"#]*)?"/g)].map(m=>m[1]);
const assetLine=sw.match(/const ASSETS=(\[[^\n]*?\]);/);
let assets=[];try{assets=JSON.parse(assetLine?.[1]||'[]')}catch(e){errors++;console.error('cache parse failed',e)}
const missing=[...new Set([...refs,...assets.map(s=>s.replace(/^\.\//,'').split('?')[0])].filter(x=>x&&x!=='.'&&!fs.existsSync(path.join(__dirname,x))))];
if(missing.length){errors++;console.error('FAIL missing assets',missing)}
const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const repeated=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
if(repeated.length){errors++;console.error('FAIL duplicate ids',repeated)}
const manifest=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.webmanifest'),'utf8'));
const versionGood=html.includes('<title>ANESVET V17.2.12</title>')&&html.includes('./app.js?v=17.2.12')
 &&sw.includes("const CACHE='anesvet-v17-2-12-r08-modal-navigation'")
 &&fs.readFileSync(path.join(__dirname,'app.js'),'utf8').includes("const APP_VERSION='17.2.12'")
 &&manifest.start_url==='./?v=17.2.12';
if(!versionGood){errors++;console.error('FAIL version consistency')}
const result={version:'17.2.12',checkpoint:'R08',suitePassed:summary.filter(s=>s.passed).length,suiteTotal:suites.length,jsSyntaxPassed:jsOK,htmlIds:ids.length,duplicateIds:repeated.length,cachedAssets:assets.length,missingAssets:missing.length,versionConsistency:versionGood,errors,suites:summary};
fs.writeFileSync(path.join(__dirname,'QA_R08_RESULTS.json'),JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({...result,suites:undefined},null,2));
if(errors)process.exitCode=1;
