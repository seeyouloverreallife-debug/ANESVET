const fs=require('fs'),vm=require('vm'),code=fs.readFileSync(__dirname+'/recovery-handoff-view-model.js','utf8');
const ctx={window:{}};vm.createContext(ctx);vm.runInContext(code,ctx);
if(!ctx.window.ANESVET_RECOVERY_HANDOFF_VM)throw new Error('VM did not initialize without APP_UTILS');
const api=ctx.window.ANESVET_RECOVERY_HANDOFF_VM;
const groups=api.medicationGroups([{drug:'Meloxicam',epoch:1},{drug:'Cefazolin',epoch:2},{drug:'Methadone',epoch:3}],[]);
if(groups.nsaid.length!==1||groups.antibiotic.length!==1||groups.analgesia.length!==1)throw new Error('Fallback normalization/classification failed');
console.log('3/3 PASS — handoff VM starts without APP_UTILS and classifies medications');
