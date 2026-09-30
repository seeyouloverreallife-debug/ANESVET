/* ANESVET V17.2.3 — Active Case State Rescue
   Repairs only contradictory runtime/navigation metadata for a case that has already started.
   Does not mark Patient Setup saved, infer undocumented clinical actions, alter doses, or overwrite recorded clinical evidence. */
(function(root){
'use strict';
const VERSION='17.2.3';
function finitePositive(v){const n=Number(v);return Number.isFinite(n)&&n>0?n:null}
function progressed(s={}){return !!(s.caseStartedAt||s.timer?.running||finitePositive(s.timer?.elapsedMs))}
function targetForState(s={}){
  if(s.caseLocked||s.casePhase==='complete'||s.recoveryCompletedAt)return 'endcase';
  if(s.casePhase==='recovery'||s.recoveryStartedAt)return 'recovery';
  if(progressed(s))return 'orlive';
  return null;
}
function normalizeState(input,{mutate=false}={}){
  const s=mutate?input:JSON.parse(JSON.stringify(input||{})),changes=[];
  if(!s||typeof s!=='object')return {state:s,changed:false,changes,target:null};
  const hasStarted=progressed(s);
  if(s.caseLocked||s.recoveryCompletedAt){
    if(s.casePhase!=='complete'){changes.push(`casePhase ${s.casePhase||'missing'} → complete`);s.casePhase='complete'}
  }else if(s.recoveryStartedAt){
    if(s.casePhase!=='recovery'&&!s.emergencyReturnActive){changes.push(`casePhase ${s.casePhase||'missing'} → recovery`);s.casePhase='recovery'}
  }else if(hasStarted&&(s.casePhase==='setup'||!s.casePhase)){
    changes.push(`casePhase ${s.casePhase||'missing'} → intraop`);s.casePhase='intraop';
  }
  // A frozen case-start identity snapshot is existing evidence. Fill only missing display/runtime fields.
  const snap=s.caseIdentitySnapshot||{};
  const snapWeight=finitePositive(snap.weight),curWeight=finitePositive(s.weight);
  if(hasStarted&&!curWeight&&snapWeight){s.weight=snapWeight;changes.push('restored missing current BW from frozen case-start snapshot')}
  for(const key of ['patientName','hospitalId','visitId','species','microchip']){
    if(hasStarted&&!String(s[key]??'').trim()&&String(snap[key]??'').trim()){
      s[key]=snap[key];changes.push(`restored missing ${key} from frozen case-start snapshot`);
    }
  }
  return {state:s,changed:changes.length>0,changes,target:targetForState(s)};
}
root.ANESVET_ACTIVE_CASE_RESCUE=Object.freeze({version:VERSION,progressed,targetForState,normalizeState});
if(typeof module!=='undefined'&&module.exports)module.exports={VERSION,progressed,targetForState,normalizeState};
})(typeof globalThis!=='undefined'?globalThis:this);
