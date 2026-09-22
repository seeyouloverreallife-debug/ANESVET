import assert from 'node:assert/strict';import {createDomApp,setupPatient} from './dom_harness.mjs';
let n=0;const ok=(v,m)=>{assert.ok(v,m);n++},eq=(a,b,m)=>{assert.equal(a,b,m);n++};

// Critical: stabilization can be documented before induction without starting anesthesia timer.
const c=await createDomApp();try{
 c.set('patientName','Critical Test');c.set('species','dog');c.set('weight',20);c.w.document.querySelector('.asa-card[data-asa="IV"]').click();c.set('anesthetist','Dr Test');c.set('surgeon','Dr Surgeon');c.set('caseWorkflowProfile','critical');await c.click('savePatientBtn');
 eq(c.state().caseWorkflowProfile,'critical');await c.click('openOrLiveBtn');
 const stab=c.w.document.querySelector('[data-workflow-action="stabilization"]');ok(stab,'critical stabilization action visible');stab.click();await c.settle();
 ok(c.state().events.some(e=>e.name==='Stabilization checkpoint'&&e.preAnesthetic),'pre-anesthetic stabilization event stored');
 eq(c.state().caseStartedAt,null,'stabilization checkpoint must not start anesthesia timer');
 eq(c.el('orWorkflowBadge').textContent,'CRITICAL');
}finally{c.close()}

// C-section: delivery milestones become primary actions and timing is computed.
const s=await createDomApp();try{
 await setupPatient(s);s.set('caseWorkflowProfile','csection');await s.click('savePatientBtn');await s.click('openOrLiveBtn');await s.click('orPrimaryActionBtn');
 // record airway, which also records Intubation
 s.set('airwayEttSize',7);await s.click('saveAirwayBtn');
 await s.click('orPrimaryActionBtn'); // Surgery start
 eq(s.state().casePhase,'intraop');eq(s.el('orPrimaryActionBtn').dataset.action,'first-neonate');
 await s.click('orPrimaryActionBtn');ok(s.state().events.some(e=>e.name==='First neonate delivered'));
 eq(s.el('orPrimaryActionBtn').dataset.action,'last-neonate');
 await s.click('orPrimaryActionBtn');ok(s.state().events.some(e=>e.name==='Last neonate delivered'));
 eq(s.el('orPrimaryActionBtn').dataset.action,'surgery-end');
 ok(s.el('orContextMetrics').textContent.includes('First → last neonate'));
 eq(s.el('orWorkflowBadge').textContent,'C-SECTION');
}finally{s.close()}
console.log(`V14.8 adaptive workflow DOM: PASS (${n} assertions)`);
