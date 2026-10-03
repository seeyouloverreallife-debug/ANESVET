(()=>{
'use strict';
function clone(v){return v==null?v:JSON.parse(JSON.stringify(v))}
function resolveActivePatient(cache,id){let p=(cache||[]).find(x=>x.patientId===id),seen=new Set();while(p?.mergedInto&&!seen.has(p.patientId)){seen.add(p.patientId);p=(cache||[]).find(x=>x.patientId===p.mergedInto)||p}return p||null}
function findMergeTargets(cache,query,sourceId,normalizeKey){const norm=typeof normalizeKey==='function'?normalizeKey:(v=>String(v||'').toLowerCase().trim()),q=norm(query);return (cache||[]).filter(p=>p.patientId!==sourceId&&!p.mergedInto&&!p.retiredAt&&(norm(p.patientId)===q||norm(p.hospitalId)===q||norm(p.microchip)===q||norm(p.patientName)===q))}
function findRestoreConflict(cache,p,{hnKeys,chipKeys}={}){if(!p)return null;const h=new Set(typeof hnKeys==='function'?[...hnKeys(p)]:[]),c=new Set(typeof chipKeys==='function'?[...chipKeys(p)]:[]);const conflict=(cache||[]).find(x=>{if(x.patientId===p.patientId||x.retiredAt||x.mergedInto)return false;const hnConflict=typeof hnKeys==='function'&&[...h].some(k=>hnKeys(x).has(k));const chipConflict=typeof chipKeys==='function'&&[...c].some(k=>chipKeys(x).has(k));return hnConflict||chipConflict});return conflict||null}
function retireRecord(patient,reason='',epoch=Date.now()){const p=clone(patient);if(!p)return null;p.retiredAt=epoch;p.retiredReason=String(reason||'').trim();return p}
function restoreRecord(patient){const p=clone(patient);if(!p)return null;p.retiredAt=null;p.retiredReason='';return p}
function mergeRecords(sourcePatient,targetPatient,epoch=Date.now()){
  const source=clone(sourcePatient),target=clone(targetPatient);if(!source||!target)throw new Error('source and target required');
  const fill=['hospitalId','patientName','species','sex','reproductiveStatus','microchip','breed','birthDate','ageSource','estimatedBirthPeriod','allergies','comorbidities','precautions'];
  fill.forEach(k=>{if(!target[k]&&source[k])target[k]=source[k]});
  if((source.lastWeightAt||0)>(target.lastWeightAt||0)){target.lastWeight=source.lastWeight;target.lastWeightAt=source.lastWeightAt;target.lastBcs=source.lastBcs||target.lastBcs}
  target.mergedPatientIds=[...new Set([...(target.mergedPatientIds||[]),source.patientId,...(source.mergedPatientIds||[])])];
  target.hnAliases=[...new Set([...(target.hnAliases||[]),source.hospitalId,...(source.hnAliases||[])].filter(Boolean))];
  target.microchipAliases=[...new Set([...(target.microchipAliases||[]),source.microchip,...(source.microchipAliases||[])].filter(Boolean))];
  target.mergeAudit=[...(target.mergeAudit||[]),{epoch,sourcePatientId:source.patientId,sourceName:source.patientName||'',sourceHn:source.hospitalId||''}];
  source.retiredAt=epoch;source.retiredReason='Merged duplicate';source.mergedInto=target.patientId;
  return {source,target};
}
window.ANESVET_PATIENT_MASTER_ORCHESTRATION=Object.freeze({resolveActivePatient,findMergeTargets,findRestoreConflict,retireRecord,restoreRecord,mergeRecords});
})();
