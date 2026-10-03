(()=>{
'use strict';
function normalizeKey(v){return String(v||'').toLowerCase().trim().replace(/\s+/g,' ')}
function patientFromCase(c,epoch=Date.now()){
  if(!c?.patientName)return null;
  return {patientId:c.patientMasterId||crypto.randomUUID?.()||String(epoch+Math.random()),hospitalId:c.hospitalId||'',patientName:c.patientName||'',species:c.species||'dog',sex:c.sex||'',reproductiveStatus:c.reproductiveStatus||'',microchip:c.microchip||'',breed:c.breed||'',birthDate:c.birthDate||'',birthDateEstimated:!!c.birthDateEstimated,ageSource:c.ageSource||(c.birthDateEstimated?'estimated':c.birthDate?'dob':''),estimatedBirthPeriod:c.estimatedBirthPeriod||'',approxAgeYears:c.approxAgeYears||'0',approxAgeMonths:c.approxAgeMonths||'0',approxAgeWeeks:c.approxAgeWeeks||'0',lastWeight:c.weight||'',lastWeightAt:c.lastSavedAt||c.archivedAt||c.createdAt||null,lastBcs:c.bcs||'',allergies:c.patientAllergies||'',comorbidities:c.patientComorbidities||'',precautions:c.patientPrecautions||'',retiredAt:null,retiredReason:'',mergedInto:'',mergedPatientIds:[],hnAliases:[],microchipAliases:[],mergeAudit:[],createdAt:c.createdAt||epoch,updatedAt:c.archivedAt||c.lastSavedAt||c.createdAt||epoch};
}
function patientIdentityKey(p){
  const hn=normalizeKey(p?.hospitalId),chip=normalizeKey(p?.microchip);
  if(hn)return `hn:${hn}`;if(chip)return `chip:${chip}`;
  return `name:${normalizeKey(p?.patientName)}|${p?.species||''}|${normalizeKey(p?.birthDate||p?.estimatedBirthPeriod||p?.breed)}`;
}
function aliasIds(p){return new Set([p?.patientId,...(Array.isArray(p?.mergedPatientIds)?p.mergedPatientIds:[])].filter(Boolean))}
function hnKeys(p){return new Set([p?.hospitalId,...(Array.isArray(p?.hnAliases)?p.hnAliases:[])].map(normalizeKey).filter(Boolean))}
function chipKeys(p){return new Set([p?.microchip,...(Array.isArray(p?.microchipAliases)?p.microchipAliases:[])].map(normalizeKey).filter(Boolean))}
function caseMatchesPatient(c,p){if(!c||!p)return false;const ids=aliasIds(p);if(c.patientMasterId&&ids.has(c.patientMasterId))return true;const hn=normalizeKey(c.hospitalId),chip=normalizeKey(c.microchip);if(hn&&hnKeys(p).has(hn))return true;if(chip&&chipKeys(p).has(chip))return true;return false}
function anesthesiaHistory(archive,p){return (archive||[]).filter(c=>caseMatchesPatient(c,p)).sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0))}
function searchMatches(p,q){if(!q)return true;const s=normalizeKey(q);return[p?.patientName,p?.hospitalId,...(p?.hnAliases||[]),p?.microchip,...(p?.microchipAliases||[]),p?.breed,p?.sex,p?.reproductiveStatus,p?.patientId].some(v=>normalizeKey(v).includes(s))}
window.ANESVET_PATIENT_DOMAIN=Object.freeze({normalizeKey,patientFromCase,patientIdentityKey,aliasIds,hnKeys,chipKeys,caseMatchesPatient,anesthesiaHistory,searchMatches});
})();
