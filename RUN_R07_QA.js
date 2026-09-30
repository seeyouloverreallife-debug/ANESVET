/* R07 self-contained targeted and historical regression runner. */
'use strict';
const fs=require('fs'),cp=require('child_process'),path=require('path');
const suites=[
 'QA_R07_SHORTCUT_TAP_ORIGIN.js','QA_R06_TOUCH_OVERLAY_GUARD.js','QA_R06_NAVIGATION.js',
 'QA_R06_ASA_CLICK_TRACE.js','QA_BOOT_RUNTIME_V17_2_11.js',
 'QA_R04_PATIENT_ASA_INTERACTION.js','QA_R01_PATIENT_ASA_BINDING.js','QA_INTERACTION_GATE_V17_2_4.js',
 'QA_ACTIVE_CASE_RESCUE_V17_2_3.js','QA_MOBILE_RESCUE_V17_2_2.js',
 'QA_SYNC_FOUNDATION_V17_1_0.js','QA_SYNC_SAFETY_V17_2_0.js'
];
let errors=0;const summary=[];
for(const file of suites){
 const p=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8',timeout:12000});
 const ok=p.status===0&&!p.error;summary.push({suite:file,pass:ok});
 console.log(`${ok?'PASS':'FAIL'} ${file}`);
 if(!ok){errors++;console.error((p.stderr||p.stdout||p.error?.message||'no detail').slice(-2500));}
}
let jsOK=0;for(const file of fs.readdirSync(__dirname).filter(x=>x.endsWith('.js'))){
 const p=cp.spawnSync(process.execPath,['--check',path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8',timeout:4000});
 if(p.status===0)jsOK++;else{errors++;console.error(`FAIL syntax ${file}`,String(p.stderr||p.error).slice(-1200))}
}
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(__dirname,'service-worker.js'),'utf8');
const refs=[...html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:\?[^"#]*)?"/g)].map(m=>m[1]);
const assetsExpr=sw.match(/const ASSETS=(\[[^\n]*?\]);/);
let cacheAssets=[];try{cacheAssets=JSON.parse(assetsExpr?.[1]||'[]')}catch(e){errors++;console.error('FAIL parse cached assets',e)}
const missing=[...new Set([...refs,...cacheAssets.map(s=>s.replace(/^\.\//,'').split('?')[0])].filter(x=>x&&x!=='.'&&!fs.existsSync(path.join(__dirname,x))))];
if(missing.length){errors++;console.error('FAIL referenced assets missing:',missing)}
// HTML parser in the source uses one ID per declarative element; ignore runtime-created nodes.
const markup=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
const ids=[...markup.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const repeats=[...new Set(ids.filter((x,i)=>ids.indexOf(x)!==i))];
if(repeats.length){errors++;console.error('FAIL duplicate HTML IDs:',repeats)}
const consistency=['<title>ANESVET V17.2.11</title>', './app.js?v=17.2.11'].every(s=>html.includes(s))
 && sw.includes("const CACHE='anesvet-v17-2-11-r07-shortcut-tap-origin'")
 && fs.readFileSync(path.join(__dirname,'app.js'),'utf8').includes("const APP_VERSION='17.2.11'")
 && JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.webmanifest'),'utf8')).start_url==='./?v=17.2.11';
if(!consistency){errors++;console.error('FAIL version/cache mismatch')}
console.log(JSON.stringify({version:'17.2.11',checkpoint:'R07',suitePassed:summary.filter(x=>x.pass).length,suiteTotal:suites.length,jsSyntaxPassed:jsOK,htmlIds:ids.length,duplicatedIds:repeats.length,cachedAssets:cacheAssets.length,missingAssets:missing.length,versionConsistency:consistency,errors},null,2));
if(errors)process.exitCode=1;
