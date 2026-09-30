/* R04 reproducible curated QA runner. Historical version-pinned QA files are preserved but not re-run on newer sources. */
'use strict';
const cp=require('child_process'),fs=require('fs'),path=require('path');
const cwd=__dirname;
const suites=[
 'QA_R04_PATIENT_ASA_INTERACTION.js','QA_R04_ASA_CLICK_TRACE.js','QA_BOOT_RUNTIME_V17_2_8.js',
 'QA_R01_PATIENT_ASA_BINDING.js','QA_INTERACTION_GATE_V17_2_4.js','QA_ACTIVE_CASE_RESCUE_V17_2_3.js',
 'QA_MOBILE_RESCUE_V17_2_2.js','QA_SYNC_FOUNDATION_V17_1_0.js','QA_SYNC_SAFETY_V17_2_0.js'];
let failures=0;
for(const suite of suites){
 const p=cp.spawnSync(process.execPath,[path.join(cwd,suite)],{cwd,encoding:'utf8'});
 console.log(`${p.status===0?'PASS':'FAIL'} ${suite}`);
 if(p.status!==0){failures++;console.error(p.stderr||p.stdout||'Unknown failure')}
}
let syntax=0;
for(const file of fs.readdirSync(cwd).filter(x=>x.endsWith('.js'))){
 const p=cp.spawnSync(process.execPath,['--check',path.join(cwd,file)],{cwd,encoding:'utf8'});
 if(p.status!==0){failures++;console.error(`FAIL syntax: ${file} ${p.stderr}`)}else syntax++;
}
console.log(`R04 QA suites ${suites.length-failures}/${suites.length} passed; JavaScript syntax ${syntax} passed; errors ${failures}`);
if(failures)process.exitCode=1;
