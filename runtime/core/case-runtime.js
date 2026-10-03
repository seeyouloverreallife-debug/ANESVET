(()=>{
'use strict';
const pad=n=>String(n).padStart(2,'0');
function makeHumanRecordId(epoch=Date.now()){
  const d=new Date(epoch),date=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  const tail=(crypto.randomUUID?crypto.randomUUID().replace(/-/g,'').slice(-5):Math.random().toString(36).slice(-5)).toUpperCase();
  return `ANV-${date}-${tail}`;
}
function stableSortObject(v){
  if(Array.isArray(v))return v.map(stableSortObject);
  if(v&&typeof v==='object')return Object.keys(v).sort().reduce((o,k)=>{o[k]=stableSortObject(v[k]);return o},{});
  return v;
}
function originalClinicalPayload(caseObj){
  const x=JSON.parse(JSON.stringify(caseObj||{}));
  ['amendments','voidedAt','voidedBy','voidReason','archivedAt','lastSavedAt','finalChecksum','checksumAlgorithm','checksumCreatedAt','auditTrail'].forEach(k=>delete x[k]);
  if(x.timer){x.timer.running=false;x.timer.startedEpoch=null}
  return stableSortObject(x);
}
async function sha256Text(text){
  if(crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}
  let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return `FNV1A-${(h>>>0).toString(16).padStart(8,'0').toUpperCase()}`;
}
async function computeCaseChecksum(caseObj){return await sha256Text(JSON.stringify(originalClinicalPayload(caseObj)))}
function shortChecksum(v){if(!v)return '—';const s=String(v).replace(/[^A-Z0-9]/gi,'').toUpperCase();return s.slice(0,16).match(/.{1,4}/g)?.join('-')||v}
function caseActivityEpoch(c){
  if(!c||typeof c!=='object')return 0;
  const xs=[c.lastSavedAt,c.lockedAt,c.recoveryCompletedAt,c.recoveryStartedAt,c.caseStartedAt,c.createdAt];
  for(const arrName of ['records','events','complications','drugAdministrations','alertEpisodes','recoveryScores','recoveryRecords']){
    const a=Array.isArray(c[arrName])?c[arrName]:[];
    for(const x of a.slice(-3))xs.push(x?.epoch,x?.resolvedAt,x?.acknowledgedAt);
  }
  return Math.max(0,...xs.map(Number).filter(Number.isFinite));
}
function createState(epoch=Date.now()){
  return {
    caseId: crypto.randomUUID ? crypto.randomUUID() : String(epoch),
    humanRecordId: makeHumanRecordId(epoch),
    createdAt: epoch,
    timer: {running:false, startedEpoch:null, elapsedMs:0},
    records: [],events: [],complications: [],drugAdministrations: [],alertEpisodes: [],
    alertProtocolOverride:null,alertProtocolHistory:[],recoveryHandoffs:[],
    inductionDocumentationMode:'',inductionMedicationReviewCompletedAt:null,
    recoveryScores: [],recoveryChecks: [false,false,false,false,false,false],recoveryNA: [false,false,false,false,false,false],
    recoveryObservationNA:{spo2:false,temp:false,extubation:false},recHandoffNote:'',
    patientSaved:false,procedureTemplateId:'custom',procedureTemplateSnapshot:null,caseWorkflowProfile:'routine',patientMasterId:'',visitId:'',sex:'',reproductiveStatus:'',microchip:'',
    birthDate:'',birthDateEstimated:false,ageSource:'',estimatedBirthPeriod:'',approxAgeYears:'0',approxAgeMonths:'0',approxAgeWeeks:'0',
    preopChecks:{},preopNA:{},preopExamRecordedAt:null,preopExamRecordedBy:'',preopRiskRecordedAt:null,preopRiskRecordedBy:'',
    caseStartedAt:null,caseIdentitySnapshot:null,responses:[],corrections:[],casePhase:'setup',recoveryStartedAt:null,recoveryCompletedAt:null,
    recoveryCompletionOverride:null,recoveryRecords:[],emergencyReturnActive:false,surgeryEndedAt:null,extubatedAt:null,lastSavedAt:null,
    fluidRateHistory:[],caseLocked:false,lockedAt:null,protocolSnapshot:null,caseDrugPlan:[],caseDrugPlanInitialized:false,caseDrugPlanReviewedAt:null,
    caseDrugPlanReviewedBy:'',medicationReconciliation:{version:1,decisions:{}},preOrReadinessOverride:null,preOrBriefingReview:null,orLastTransition:null,
    auditTrail:[],amendments:[],finalSignoff:{anesthetist:null,surgeon:null},finalChecksum:null,checksumAlgorithm:null,checksumCreatedAt:null,
    voidedAt:null,voidedBy:'',voidReason:''
  };
}
window.ANESVET_CASE_RUNTIME=Object.freeze({createState,makeHumanRecordId,stableSortObject,originalClinicalPayload,sha256Text,computeCaseChecksum,shortChecksum,caseActivityEpoch});
})();
