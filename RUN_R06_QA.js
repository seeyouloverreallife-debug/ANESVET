/* R06: Retain historical QA artifacts, rerun all version-neutral suites and cloned version-pinned suites. */
'use strict';
const cp=require('child_process'),fs=require('fs'),path=require('path');
const suites=['QA_R06_TOUCH_OVERLAY_GUARD.js','QA_R06_NAVIGATION.js','QA_R06_ASA_CLICK_TRACE.js','QA_BOOT_RUNTIME_V17_2_10.js',
'QA_R04_PATIENT_ASA_INTERACTION.js','QA_R01_PATIENT_ASA_BINDING.js','QA_INTERACTION_GATE_V17_2_4.js',
'QA_ACTIVE_CASE_RESCUE_V17_2_3.js','QA_MOBILE_RESCUE_V17_2_2.js','QA_SYNC_FOUNDATION_V17_1_0.js','QA_SYNC_SAFETY_V17_2_0.js'];
let errors=0,passed=0,total=0;
for(const file of suites){const p=cp.spawnSync(process.execPath,[path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8'});
 const suiteOk=p.status===0;let parsed=null;
 if(suiteOk){const outputs=p.stdout||'';const matches=[...outputs.matchAll(/\{\s*"suite"\s*:\s*"[^"]+"[\s\S]*?\}/g)];
 // Version-specific existing suites log test names; use status for pass/fail.
 }
 console.log(`${suiteOk?'PASS':'FAIL'} ${file}`);
 if(!suiteOk){errors++;console.error((p.stderr||p.stdout||'unknown failure').slice(-4000));}
}
let syntax=0;for(const file of fs.readdirSync(__dirname).filter(x=>x.endsWith('.js'))){const p=cp.spawnSync(process.execPath,['--check',path.join(__dirname,file)],{cwd:__dirname,encoding:'utf8'});if(p.status===0)syntax++;else {errors++;console.error('FAIL syntax:',file,p.stderr)}}
console.log(`R06 QA suites: ${suites.length-errors}/${suites.length}  JavaScript syntax: ${syntax} passed  errors=${errors}`);
if(errors)process.exitCode=1;
