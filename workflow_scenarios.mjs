import assert from 'node:assert/strict';

// Model-level deterministic scenarios for the V14.6 clinical workflow.
// These do not replace browser E2E; they protect the intended state-machine invariants.

const fresh=()=>({
  patientSaved:false,currentWeightKg:null,casePhase:'setup',started:false,
  drugAdministrations:[],complications:[],recoveryScores:[],recoveryComplete:false,
  finalSignoff:{anesthetist:false,surgeon:false},locked:false
});

function canStart(s){return s.patientSaved&&Number(s.currentWeightKg)>0}
function start(s){if(!canStart(s))return false;s.started=true;s.casePhase='intraoperative';return true}
function administer(s,{drug,actual,unit='mL',route,by}){
  if(!(Number(actual)>0)||!route||!by)throw new Error('incomplete medication administration');
  const x={id:`D${s.drugAdministrations.length+1}`,drug,actual:Number(actual),unit,route,by,voidedAt:null};
  s.drugAdministrations.push(x);return x;
}
function voidAdmin(s,id,reason,by){const x=s.drugAdministrations.find(v=>v.id===id);if(!x||x.voidedAt)throw new Error('invalid void');if(!reason||!by)throw new Error('void audit required');x.voidedAt=1;x.voidReason=reason;x.voidedBy=by;return x}
function complication(s,type,severity='moderate'){const x={id:`C${s.complications.length+1}`,type,severity,status:'active',responses:[]};s.complications.push(x);return x}
function respond(s,id,note,{resolve=false}={}){const x=s.complications.find(v=>v.id===id);if(!x||x.status==='resolved')throw new Error('invalid complication response');x.responses.push({note});if(resolve){if(!note)throw new Error('outcome note required');x.status='resolved';x.outcome=note}return x}
function scoreRecovery(s,{airway,oxygen,temp,mentation,comfort,naReason=''}){
  const values=[airway,oxygen,temp,mentation,comfort];
  const numeric=values.filter(v=>v!=='NA').map(Number);
  if(numeric.some(v=>!Number.isInteger(v)||v<0||v>2))throw new Error('invalid recovery score');
  const hasNA=values.includes('NA');if(hasNA&&!naReason)throw new Error('N/A reason required');
  const total=numeric.reduce((a,b)=>a+b,0),possible=numeric.length*2;
  const x={id:`R${s.recoveryScores.length+1}`,total,possible,percent:possible?Math.round(total/possible*100):0,naReason};
  s.recoveryScores.push(x);return x;
}
function canCompleteRecovery(s){return s.recoveryScores.length>0}
function completeRecovery(s){if(!canCompleteRecovery(s))return false;s.recoveryComplete=true;s.casePhase='complete';return true}
function canLock(s){return s.recoveryComplete&&s.recoveryScores.length>0&&s.complications.every(c=>c.status==='resolved')&&s.finalSignoff.anesthetist&&s.finalSignoff.surgeon}
function lockAndArchive(s){if(!canLock(s))return false;s.locked=true;s.archivedAt=1;return true}

// Scenario 1: routine case, Setup -> intraoperative -> medication -> Recovery -> Lock.
{
  const s=fresh();
  assert.equal(start(s),false,'must not start without patient setup/current weight');
  s.patientSaved=true;s.currentWeightKg=8.2;
  assert.equal(start(s),true);
  administer(s,{drug:'Propofol',actual:1.3,route:'IV',by:'Dr A'});
  assert.equal(s.drugAdministrations.length,1);
  scoreRecovery(s,{airway:2,oxygen:2,temp:2,mentation:2,comfort:2});
  assert.equal(completeRecovery(s),true);
  s.finalSignoff={anesthetist:true,surgeon:true};
  assert.equal(canLock(s),true,'routine case should be lock-ready');
  assert.equal(lockAndArchive(s),true,'routine case should reach Archive');
  assert.equal(s.locked,true);assert.equal(s.archivedAt,1);
}

// Scenario 2: active complication blocks final lock until an outcome is documented.
{
  const s=fresh();s.patientSaved=true;s.currentWeightKg=5;start(s);
  const c=complication(s,'Hypotension','moderate');
  scoreRecovery(s,{airway:2,oxygen:2,temp:1,mentation:2,comfort:2});completeRecovery(s);
  s.finalSignoff={anesthetist:true,surgeon:true};
  assert.equal(canLock(s),false,'active complication must block lock');
  respond(s,c.id,'MAP improved after intervention',{resolve:true});
  assert.equal(canLock(s),true,'resolved complication with outcome should permit lock');
}

// Scenario 3: medication correction uses VOID, never silently deletes the original administration.
{
  const s=fresh();const d=administer(s,{drug:'Atropine',actual:0.2,route:'IV',by:'Dr B'});
  voidAdmin(s,d.id,'Entered wrong volume','Dr B');
  assert.equal(s.drugAdministrations.length,1,'void must preserve original administration');
  assert.ok(s.drugAdministrations[0].voidedAt,'void marker required');
  assert.throws(()=>voidAdmin(s,d.id,'again','Dr B'),'cannot void twice');
}

// Scenario 4: Recovery N/A lowers the possible denominator and requires a reason.
{
  const s=fresh();
  assert.throws(()=>scoreRecovery(s,{airway:2,oxygen:'NA',temp:'NA',mentation:2,comfort:2}),'N/A must require reason');
  const r=scoreRecovery(s,{airway:2,oxygen:'NA',temp:'NA',mentation:2,comfort:2,naReason:'Not clinically applicable at this time'});
  assert.equal(r.total,6);assert.equal(r.possible,6);assert.equal(r.percent,100);
}

console.log('ANESVET V14.6.4 workflow model scenarios: PASS (4 scenarios)');
