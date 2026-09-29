/* ANESVET V17.2.0 — Architecture Registry
   Non-clinical dependency inventory used by diagnostics and release QA. */
(function(root){
'use strict';
const VERSION='17.2.0';
const REQUIRED=Object.freeze([
  ['App shell','ANESVET_APP_SHELL'],['Case runtime','ANESVET_CASE_RUNTIME'],['Case lifecycle','ANESVET_CASE_LIFECYCLE'],['Session coordination','ANESVET_SESSION_COORDINATION'],['Session controller','ANESVET_SESSION_CONTROLLER'],['PWA controller','ANESVET_PWA_CONTROLLER'],['Dose reference controller','ANESVET_DOSE_REFERENCE_CONTROLLER'],['Patient domain','ANESVET_PATIENT_DOMAIN'],['OR domain','ANESVET_OR_DOMAIN'],['Recovery domain','ANESVET_RECOVERY_DOMAIN'],['Patient orchestration','ANESVET_PATIENT_MASTER_ORCHESTRATION'],['OR orchestration','ANESVET_OR_RECORD_ORCHESTRATION'],['Recovery orchestration','ANESVET_RECOVERY_ORCHESTRATION'],['Patient Master controller','ANESVET_PATIENT_MASTER_CONTROLLER'],['Pre-op controller','ANESVET_PREOP_CONTROLLER'],['OR LIVE controller','ANESVET_OR_LIVE_CONTROLLER'],['Medication workspace controller','ANESVET_MEDICATION_WORKSPACE_CONTROLLER'],['Recovery controller','ANESVET_RECOVERY_CONTROLLER'],['Backup / restore controller','ANESVET_BACKUP_RESTORE_CONTROLLER'],['Finalization & archive controller','ANESVET_FINALIZATION_ARCHIVE_CONTROLLER'],['Procedure templates','ANESVET_PROCEDURE_TEMPLATES'],['Hospital Protocol Governance','ANESVET_HOSPITAL_PROTOCOL_GOVERNANCE'],['Identity & Roles foundation','ANESVET_IDENTITY_ROLES'],['Security compatibility API','ANESVET_SECURITY_BASELINE'],['Sync transport boundary','ANESVET_SYNC_TRANSPORT'],['Multi-device Sync foundation','ANESVET_SYNC_FOUNDATION'],['Case Review & Quality Dashboard','ANESVET_CASE_REVIEW_DASHBOARD'],['Production Validation Center','ANESVET_VALIDATION_CENTER'],['Data Safety 2.0','ANESVET_DATA_SAFETY_2']
]);
function checks(){return REQUIRED.map(([label,key])=>({label,key,ok:!!root[key],detail:root[key]?`${key} loaded`:`${key} missing`}))}
function summarize(){const rows=checks(),passed=rows.filter(x=>x.ok).length;return{version:VERSION,ok:passed===rows.length,passed,total:rows.length,checks:rows}}
const api=Object.freeze({version:VERSION,required:REQUIRED,checks,summarize});root.ANESVET_ARCHITECTURE_REGISTRY=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
