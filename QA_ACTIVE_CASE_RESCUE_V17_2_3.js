const assert=require('assert');
const rescue=require('./active-case-rescue.js');
const tests=[];function t(name,fn){try{fn();tests.push({name,pass:true})}catch(e){tests.push({name,pass:false,error:e.message})}}

t('started case with stale SETUP repairs to intraop and targets OR LIVE',()=>{
  const src={caseStartedAt:1700000000000,casePhase:'setup',patientSaved:false,timer:{running:false,elapsedMs:5400000},caseIdentitySnapshot:{weight:12.4,patientName:'D',species:'dog'}};
  const r=rescue.normalizeState(src);
  assert.equal(r.state.casePhase,'intraop');assert.equal(r.target,'orlive');assert.equal(r.state.patientSaved,false);assert.equal(r.state.weight,12.4);
});

t('repair never marks Patient Setup saved',()=>{
  const r=rescue.normalizeState({caseStartedAt:1,casePhase:'setup',patientSaved:false,timer:{elapsedMs:1}});
  assert.strictEqual(r.state.patientSaved,false);
});

t('frozen case-start snapshot only fills missing identity fields',()=>{
  const r=rescue.normalizeState({caseStartedAt:1,casePhase:'intraop',weight:'',patientName:'Current',hospitalId:'',species:'',caseIdentitySnapshot:{weight:7.2,patientName:'Frozen',hospitalId:'HN9',species:'cat'}});
  assert.equal(r.state.weight,7.2);assert.equal(r.state.patientName,'Current');assert.equal(r.state.hospitalId,'HN9');assert.equal(r.state.species,'cat');
});

t('recovery evidence targets Recovery rather than OR LIVE',()=>{
  const r=rescue.normalizeState({caseStartedAt:1,casePhase:'setup',recoveryStartedAt:2,timer:{elapsedMs:100}});
  assert.equal(r.state.casePhase,'recovery');assert.equal(r.target,'recovery');
});

t('completed/locked case targets End Case',()=>{
  const r=rescue.normalizeState({caseStartedAt:1,casePhase:'setup',caseLocked:true,timer:{elapsedMs:100}});
  assert.equal(r.state.casePhase,'complete');assert.equal(r.target,'endcase');
});

t('fresh setup without case progress is not treated as active case',()=>{
  const r=rescue.normalizeState({casePhase:'setup',patientSaved:false,timer:{running:false,elapsedMs:0}});
  assert.equal(r.target,null);assert.equal(r.changed,false);
});

t('already-consistent intraop case is not mutated',()=>{
  const src={caseStartedAt:1,casePhase:'intraop',weight:5,timer:{elapsedMs:20},caseIdentitySnapshot:{weight:5}};
  const r=rescue.normalizeState(src);assert.equal(r.changed,false);assert.deepStrictEqual(r.state,src);
});

const out={version:'17.2.3',suite:'active-case-state-rescue',passed:tests.filter(x=>x.pass).length,total:tests.length,tests};
console.log(JSON.stringify(out,null,2));if(out.passed!==out.total)process.exit(1);
