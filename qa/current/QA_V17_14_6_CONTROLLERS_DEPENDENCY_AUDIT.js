'use strict';
const fs=require('fs'),path=require('path'),crypto=require('crypto'),R=path.resolve(__dirname,'../..');
const read=f=>fs.readFileSync(path.join(R,f),'utf8'),exists=f=>fs.existsSync(path.join(R,f));
const shaText=s=>crypto.createHash('sha256').update(s).digest('hex');
const h=read('index.html'),sw=read('service-worker.js'),map=JSON.parse(read('config/runtime-map.json'));
const ctrls=map.startupModules.filter(x=>x.group==='controllers').sort((a,b)=>a.order-b.order);
const names=['patient-master-controller.js','preop-controller.js','medication-workspace-controller.js','or-live-controller.js','recovery-controller.js','backup-restore-controller.js','finalization-archive-controller.js'];
const src=Object.fromEntries(names.map(n=>[n,read('runtime/controllers/'+n)]));
const startup=[...h.matchAll(/<script[^>]+src=["']([^"']+)["']/g)].map(x=>x[1].split('?')[0].replace(/^\.\//,''));
const swPaths=new Set([...sw.matchAll(/["'](\.\/[^"']+?)(?:\?v=[^"']+)?["']/g)].map(x=>x[1].replace(/^\.\//,'')));
const unsafe=s=>['fetch(','import(','new URL(','currentScript','importScripts','serviceWorker.register','Worker('].some(t=>s.includes(t));
const baselineHash={
 'patient-master-controller.js':'a580ff0d9c61b47bb88d169228a9decf0d70846d8998d05ed070b9d51f50a946',
 'preop-controller.js':'8eb9bfc4fda9931ad4212aa0b1840fb37f78c872bf040ef949ff8c9a54c1ede3',
 'medication-workspace-controller.js':'27a68208894e707cbb023cdd97d67b0fafab684cb7d2b8ec4f91bab8530d5ade',
 'or-live-controller.js':'b7b08d069ac8cfce26bb0bbce1bb75cdf822c7ba539ecd103cf0bca889eb4ffa',
 'recovery-controller.js':'65699c919f26df91d9adf1bd520b15effe000d0795f34ba518c50ca321d379ec',
 'backup-restore-controller.js':'c662caacd5dea0fb7c3208b28e53ef4f93d62253195f91f6ef95033515b35d42',
 'finalization-archive-controller.js':'c09c1698a2ea108c1c14779e1421a58972ae7c3e11d1bed535b814d735629431'
};
const normalizedHash=n=>shaText(src[n].replace(/17\.14\.6/g,'17.13.19'));
const T=[];const add=(n,v)=>T.push([n,!!v]);
add('Controller group contains seven modules',ctrls.length===7);
add('Controller orders remain 27–33',ctrls.every((x,i)=>x.order===27+i));
add('Controller paths live under runtime/controllers',ctrls.every(x=>x.path.startsWith('runtime/controllers/')));
add('Controller paths equal future paths',ctrls.every(x=>x.path===x.futurePath));
add('Controller files exist',ctrls.every(x=>exists(x.path)));
add('Controller root copies are absent',names.every(n=>!exists(n)));
add('Index startup positions 27–33 point to controller folder',ctrls.every(x=>startup[x.order-1]===x.path));
add('Service Worker precaches all controller paths',ctrls.every(x=>swPaths.has(x.path)));
add('No controller contains relative/path-sensitive loader logic',names.every(n=>!unsafe(src[n])));
add('Patient Master source preserved',normalizedHash('patient-master-controller.js')===baselineHash['patient-master-controller.js']);
add('Pre-op source preserved',normalizedHash('preop-controller.js')===baselineHash['preop-controller.js']);
add('Medication workspace physical-pilot fixes are scoped',src['medication-workspace-controller.js'].includes('function defaultRouteForDrug')&&src['medication-workspace-controller.js'].includes("normalizeMedicationIdentity(d?.name)==='tramadol'?'SC':''")&&src['medication-workspace-controller.js'].includes('allowStandby||!isStandbyDrug(x.d)'));
add('OR LIVE V17.14.6 delta is scoped to canonical ventilation ownership + existing focused queue',src['or-live-controller.js'].includes('function setVentilationMode(mode,{persist=true}={})')&&src['or-live-controller.js'].includes('function renderOrMedicationQueue(){')&&src['or-live-controller.js'].includes('FAST_FIELDS'));
add('Recovery V17.14.6 delta is scoped to vitals-first layout + descriptive score',src['recovery-controller.js'].includes('function organizeRecoveryLayout')&&src['recovery-controller.js'].includes('recovery-primary-vitals-entry')&&!src['recovery-controller.js'].includes('installRecoveryScoreQuickControls')&&src['recovery-controller.js'].includes('recoveryObservationRecordBtn'));
add('Backup/Restore source preserved',normalizedHash('backup-restore-controller.js')===baselineHash['backup-restore-controller.js']);
add('Finalization/Archive source preserved',normalizedHash('finalization-archive-controller.js')===baselineHash['finalization-archive-controller.js']);
add('Patient Master keeps injected domain/orchestration boundary',src['patient-master-controller.js'].includes('ctx.patientDomain')&&src['patient-master-controller.js'].includes('ctx.patientOrchestration'));
add('Patient Master keeps anesthesia-history behavior',src['patient-master-controller.js'].includes('patientAnesthesiaHistory'));
add('Pre-op keeps structured exam fields',src['preop-controller.js'].includes('PREOP_EXAM_FIELD_IDS')&&src['preop-controller.js'].includes('savePreopPhysicalExam'));
add('Pre-op keeps BOAS risk detail contract',src['preop-controller.js'].includes('BOAS_DETAIL_IDS')&&src['preop-controller.js'].includes('riskBOAS'));
add('Medication workspace keeps current-weight safety dependency',src['medication-workspace-controller.js'].includes('currentWeightReady')&&src['medication-workspace-controller.js'].includes('requireCurrentWeight'));
add('Medication workspace keeps explicit save navigation model',src['medication-workspace-controller.js'].includes('ANESVET_MEDICATION_WORKSPACE_CONTROLLER')&&src['medication-workspace-controller.js'].includes('quick'));
add('OR LIVE keeps prepared-induction details-pending contract',src['or-live-controller.js'].includes('markPreparedInductionGivenAtMilestone'));
add('OR LIVE keeps timestamp-only intubation mutation',src['or-live-controller.js'].includes("runOrWorkflowMutation('intubation'"));
add('OR LIVE keeps Fast Vital field ownership',src['or-live-controller.js'].includes('FAST_FIELDS')&&src['or-live-controller.js'].includes('focusFastField'));
add('Recovery keeps injected domain/orchestration boundary',src['recovery-controller.js'].includes('ctx.recoveryDomain')&&src['recovery-controller.js'].includes('ctx.recoveryOrchestration'));
add('Recovery keeps emergency return to OR',src['recovery-controller.js'].includes('emergencyReturnToOr')&&src['recovery-controller.js'].includes('returnAfterEmergency'));
add('Backup keeps integrity/restore journal safeguards',src['backup-restore-controller.js'].includes('RESTORE_JOURNAL_KEY')&&src['backup-restore-controller.js'].includes('BACKUP_SCHEMA'));
add('Backup keeps fail-closed recovery marker',src['backup-restore-controller.js'].includes('ANESVET_RESTORE_RECOVERY_BLOCKED'));
add('Finalization keeps dual sign-off contract',src['finalization-archive-controller.js'].includes('finalSignoff')&&src['finalization-archive-controller.js'].includes('anesthetist')&&src['finalization-archive-controller.js'].includes('surgeon'));
add('Finalization keeps locked-record guard',src['finalization-archive-controller.js'].includes('state.caseLocked'));
add('Deployment has no legacy root controller refs',names.every(n=>!h.includes(`./${n}?`)&&!sw.includes(`./${n}?`)));
add('Controller versioned refs use 17.14.6',ctrls.every(x=>h.includes(`./${x.path}?v=17.14.6`)&&sw.includes(`./${x.path}?v=17.14.6`)));
add('Runtime map policy records controller migration',map.policy?.controllersMigration==='positions-27-33-moved-to-runtime-controllers'&&map.policy?.movedStartupGroups?.includes('controllers-positions-27-33'));
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++;}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
