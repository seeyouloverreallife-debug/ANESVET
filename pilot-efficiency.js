/* ANESVET V15.19.0 — Pilot efficiency / one-hand workflow helpers.
   UI-only layer. It never marks clinical items complete and never bypasses safety gates. */
(() => {
  'use strict';

  const byId = id => document.getElementById(id);
  const q = sel => document.querySelector(sel);
  const qa = sel => [...document.querySelectorAll(sel)];
  const MAIN_FLOW = ['patient','preop','drugs','orlive','recovery','endcase'];
  const NEXT_FLOW = {patient:'preop',preop:'drugs',drugs:'orlive'};
  let refreshTimer = 0;

  function activePageId(){ return q('.tabpage.active')?.id || ''; }
  function isGood(el){ return !!el && el.classList.contains('good'); }
  function scheduleRefresh(){ clearTimeout(refreshTimer); refreshTimer=setTimeout(refresh,40); }

  function clickWorkflowTab(id){
    const btn=q(`.workflow-tabs .tab[data-tab="${id}"]`);
    if(btn){ btn.click(); return true; }
    return false;
  }

  function scrollAndFocus(target){
    if(!target) return;
    const container = target.closest?.('.panel,.case-drug-plan-panel,.recovery-check-item') || target;
    try{ container.scrollIntoView({behavior:'smooth',block:'center'}); }
    catch(_){ container.scrollIntoView(); }
    const focusable = target.matches?.('input,select,textarea,button') ? target : target.querySelector?.('input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])');
    setTimeout(()=>focusable?.focus?.({preventScroll:true}),260);
  }

  function syncContinueButton(){
    const btn=byId('mobileQuickContinueBtn'), bar=byId('mobileQuickBar');
    if(!btn || !bar) return;
    const current=activePageId(), next=NEXT_FLOW[current] || '';
    btn.hidden=!next;
    bar.classList.toggle('has-continue',!!next);
    if(!next) return;
    const labels={preop:'Pre-check',drugs:'Drug Plan',orlive:'OR LIVE'};
    btn.title=`ไป ${labels[next]||next}`;
    btn.setAttribute('aria-label',`ไปขั้นตอนถัดไป: ${labels[next]||next}`);
    const b=btn.querySelector('b'); if(b) b.textContent='ต่อไป';
  }

  /* ---------- Pre-op efficiency ---------- */
  function preopItemReviewed(item){
    if(!item) return false;
    const cb=item.querySelector('.preop-check');
    return !!cb?.checked || item.classList.contains('na');
  }

  function firstIncompletePreopTarget(){
    const exam=byId('preopExamStatus'), risk=byId('preopRiskStatus');
    if(exam && !isGood(exam)) return q('.preop-exam-panel');
    if(risk && !isGood(risk)) return q('.preop-risk-panel');
    return qa('#preop .preop-item').find(item=>!preopItemReviewed(item)) || q('#preop .preop-footer');
  }

  function updatePreopEfficiency(){
    const page=byId('preop'), focus=byId('preopFocusIncomplete'), summary=byId('preopRemainingSummary'), nextBtn=byId('preopNextIncompleteBtn');
    if(!page || !focus || !summary || !nextBtn) return;
    const items=qa('#preop .preop-item');
    const remaining=items.filter(item=>!preopItemReviewed(item)).length;
    const examComplete=isGood(byId('preopExamStatus'));
    const riskComplete=isGood(byId('preopRiskStatus'));
    q('.preop-exam-panel')?.classList.toggle('preop-complete-ui',examComplete);
    q('.preop-risk-panel')?.classList.toggle('preop-complete-ui',riskComplete);
    page.classList.toggle('preop-focus-incomplete',focus.checked);
    summary.className=`preop-remaining-summary ${remaining===0?'complete':''}`;
    summary.textContent=remaining===0?'✓ Checklist ครบแล้ว':`เหลือ ${remaining} รายการ`;
    nextBtn.textContent=remaining===0?'✓ Checklist ครบ • ไปท้ายหน้า':'↓ รายการถัดไปที่ยังไม่เสร็จ';
  }

  /* ---------- Drug-plan efficiency ---------- */
  function drugPlanState(){
    const status=byId('caseDrugPlanStatus');
    const items=qa('#caseDrugPlanList .case-drug-plan-item');
    const standby=items.filter(x=>x.classList.contains('standby')).length;
    const txt=(status?.textContent||'').toLowerCase();
    const frozen=!!status?.classList.contains('frozen') || txt.includes('frozen');
    const reviewed=frozen || !!status?.classList.contains('reviewed') || (txt.includes('reviewed') && !txt.includes('not reviewed'));
    return {status,items,count:items.length,standby,frozen,reviewed};
  }

  function updateDrugEfficiency(){
    const page=byId('drugs'), focus=byId('drugFocusPlanOnly'), summary=byId('drugPlanEfficiencySummary'), btn=byId('drugNextTaskBtn');
    if(!page || !focus || !summary || !btn) return;
    const s=drugPlanState();
    page.classList.toggle('drug-focus-plan',focus.checked);
    const planned=Math.max(0,s.count-s.standby);
    summary.className=`drug-plan-efficiency-summary ${s.reviewed?'complete':''}`;
    summary.textContent=`${planned} planned${s.standby?` • ${s.standby} standby`:''} • ${s.frozen?'FROZEN':s.reviewed?'REVIEWED':'NOT REVIEWED'}`;
    btn.disabled=false;
    if(!s.count && !s.frozen){
      btn.dataset.action='build'; btn.textContent='↻ สร้างแผนจาก protocol';
    }else if(!s.reviewed && !s.frozen){
      btn.dataset.action='review'; btn.textContent='✓ Save / Review plan';
    }else{
      btn.dataset.action='orlive'; btn.textContent='ตรวจความพร้อม → OR LIVE';
    }
  }

  function runDrugNextTask(){
    const btn=byId('drugNextTaskBtn'); if(!btn) return;
    const action=btn.dataset.action;
    if(action==='build'){ byId('autoCaseDrugPlanBtn')?.click(); return; }
    if(action==='review'){ byId('reviewCaseDrugPlanBtn')?.click(); return; }
    byId('goOrLiveFromDrugBtn')?.click(); // existing readiness + briefing gates remain authoritative.
  }

  /* ---------- Recovery efficiency ---------- */
  function recoveryObservationNA(key){ return !!q(`.recovery-observation-na-btn[data-key="${key}"]`)?.classList.contains('active'); }
  function numberText(id){ const n=Number((byId(id)?.textContent||'').trim()); return Number.isFinite(n)?n:0; }
  function hasValue(id){ return !!String(byId(id)?.value||'').trim(); }

  function recoveryUiState(){
    const checks=qa('#recovery .recovery-check');
    const reviewed=checks.filter((cb,i)=>cb.checked || qa('#recovery .recovery-check-na-btn')[i]?.classList.contains('active')).length;
    const records=numberText('recoveryRecordCount');
    const scores=numberText('recoveryScoreCount');
    const scoreCurrent=(byId('recoveryScoreCurrent')?.textContent||'Incomplete').trim();
    const anyNA=qa('#recovery .recovery-check-na-btn.active,#recovery .recovery-observation-na-btn.active').length>0;
    const observation={
      rr:Number(byId('recRR')?.value||0)>0,
      spo: Number(byId('recSpO2')?.value||0)>0 || recoveryObservationNA('spo2'),
      temp: hasValue('recTemp') || recoveryObservationNA('temp'),
      ment: hasValue('recMentation'),
      ext: hasValue('recExtubation') || recoveryObservationNA('extubation'),
      naReason: !anyNA || hasValue('recNaReason')
    };
    const obsComplete=Object.values(observation).every(Boolean);
    const phase=(byId('recoveryPhaseBadge')?.textContent||'').trim().toUpperCase();
    const active=phase.includes('ACTIVE');
    const complete=phase.includes('COMPLETE');
    const ready=byId('recoveryFocusCompleteBtn')?.dataset.ready==='1' || byId('recoveryReadiness')?.classList.contains('good');
    return {checks,reviewed,total:checks.length,records,scores,scoreCurrent,observation,obsComplete,active,complete,ready,anyNA};
  }

  function firstRecoveryMissingTarget(s){
    if(!s.active && !s.complete) return byId('beginRecoveryBtn');
    if(!s.observation.rr) return byId('recRR');
    if(!s.observation.spo) return byId('recSpO2') || q('.recovery-observation-na-btn[data-key="spo2"]');
    if(!s.observation.temp) return byId('recTemp') || q('.recovery-observation-na-btn[data-key="temp"]');
    if(!s.observation.ment) return byId('recMentation');
    if(!s.observation.ext) return byId('recExtubation') || q('.recovery-observation-na-btn[data-key="extubation"]');
    if(!s.observation.naReason) return byId('recNaReason');
    if(!s.records) return byId('recordRecoveryVitalsBtn');
    const naButtons=qa('#recovery .recovery-check-na-btn');
    const missingIndex=s.checks.findIndex((cb,i)=>!cb.checked && !naButtons[i]?.classList.contains('active'));
    if(missingIndex>=0) return s.checks[missingIndex];
    if(!s.scores || /incomplete/i.test(s.scoreCurrent)){
      return qa('#recoveryScorePanel select').find(x=>!String(x.value||'').trim()) || byId('saveRecoveryScoreBtn');
    }
    return byId('recoveryFocusCompleteBtn');
  }

  function recoveryNextLabel(s){
    if(s.complete) return '✓ Recovery complete';
    if(!s.active) return '▶ Begin recovery';
    if(!s.obsComplete) return '↓ เติม Recovery observations';
    if(!s.records) return '＋ Record first vitals';
    if(s.reviewed<s.total) return `↓ Checklist ที่เหลือ ${s.total-s.reviewed}`;
    if(!s.scores || /incomplete/i.test(s.scoreCurrent)) return '↓ Complete readiness score';
    if(s.ready) return '✓ Review / complete recovery';
    return '↓ Review readiness';
  }

  function updateRecoveryEfficiency(){
    const page=byId('recovery'), focus=byId('recoveryFocusPending'), summary=byId('recoveryEfficiencySummary'), btn=byId('recoveryNextTaskBtn');
    if(!page || !focus || !summary || !btn) return;
    const s=recoveryUiState();
    page.classList.toggle('recovery-focus-pending',focus.checked);
    summary.className=`recovery-efficiency-summary ${s.ready||s.complete?'complete':''}`;
    summary.textContent=s.complete?'✓ COMPLETE':`Vitals ${s.records} • Checklist ${s.reviewed}/${s.total} • Score ${s.scores}${s.ready?' • READY':''}`;
    btn.textContent=recoveryNextLabel(s);
    btn.disabled=s.complete;
    btn.dataset.ready=s.ready?'1':'0';
  }

  function runRecoveryNextTask(){
    const s=recoveryUiState();
    const target=firstRecoveryMissingTarget(s);
    if(!target) return;
    if(target===byId('beginRecoveryBtn') || target===byId('recordRecoveryVitalsBtn') || target===byId('recoveryFocusCompleteBtn')){
      target.click();
      return;
    }
    scrollAndFocus(target);
  }

  function mobileStatusData(id){
    if(id==='patient'){
      const el=byId('patientSaveStatus');
      return {text:isGood(el)?'✓ SAVED':'ต้องบันทึก',tone:isGood(el)?'good':'warn'};
    }
    if(id==='preop'){
      const el=byId('preopProgress'), text=el?.textContent?.trim()||'—';
      return {text:text.replace(' REVIEWED',''),tone:isGood(el)?'good':'warn'};
    }
    if(id==='drugs'){
      const s=drugPlanState();
      return {text:s.reviewed?'✓ Plan reviewed':'Plan ยังไม่ review',tone:s.reviewed?'good':'muted'};
    }
    if(id==='orlive' || id==='recovery'){
      const src=q(`.workflow-tabs .tab[data-tab="${id}"]`), locked=src?.classList.contains('locked-step');
      if(id==='recovery'){
        const rs=recoveryUiState();
        if(rs.complete) return {text:'✓ Complete',tone:'good'};
        if(rs.active) return {text:`${rs.records} rec • ${rs.reviewed}/${rs.total}`,tone:rs.ready?'good':'warn'};
      }
      return {text:locked?'ยังล็อก':'พร้อมเปิด',tone:locked?'muted':'good'};
    }
    if(id==='endcase') return {text:'Final record',tone:'muted'};
    return {text:'',tone:'muted'};
  }

  function updateMobileWorkflowStatus(){
    qa('[data-mobile-tab]').forEach(btn=>{
      const id=btn.dataset.mobileTab;
      if(!MAIN_FLOW.includes(id)) return;
      let badge=btn.querySelector('.mobile-step-status');
      if(!badge){ badge=document.createElement('small'); badge.className='mobile-step-status'; btn.appendChild(badge); }
      const st=mobileStatusData(id);
      badge.textContent=st.text;
      badge.dataset.tone=st.tone;
    });
  }

  function refresh(){
    syncContinueButton();
    updatePreopEfficiency();
    updateDrugEfficiency();
    updateRecoveryEfficiency();
    updateMobileWorkflowStatus();
    document.documentElement.classList.add('pilot-efficiency-v1517');
  }

  byId('mobileQuickContinueBtn')?.addEventListener('click',()=>{
    const next=NEXT_FLOW[activePageId()];
    if(next) clickWorkflowTab(next);
  });

  byId('preopNextIncompleteBtn')?.addEventListener('click',()=>scrollAndFocus(firstIncompletePreopTarget()));
  byId('preopFocusIncomplete')?.addEventListener('change',updatePreopEfficiency);

  byId('drugNextTaskBtn')?.addEventListener('click',runDrugNextTask);
  byId('drugFocusPlanOnly')?.addEventListener('change',updateDrugEfficiency);

  byId('recoveryNextTaskBtn')?.addEventListener('click',runRecoveryNextTask);
  byId('recoveryFocusPending')?.addEventListener('change',updateRecoveryEfficiency);

  byId('mobileWorkflowMenuBtn')?.addEventListener('click',()=>setTimeout(updateMobileWorkflowStatus,0));

  document.addEventListener('change',e=>{
    if(e.target.closest?.('#preop,#drugs,#recovery')) scheduleRefresh();
  },true);
  document.addEventListener('input',e=>{
    if(e.target.closest?.('#recovery')) scheduleRefresh();
  },true);
  document.addEventListener('click',e=>{
    if(e.target.closest?.('#preop,#drugs,#recovery,.workflow-tabs,#mobileWorkflowDialog,#mobileQuickBar')) scheduleRefresh();
  },true);

  const observer=new MutationObserver(muts=>{
    if(muts.some(m=>m.type==='attributes'||m.type==='characterData'||m.type==='childList')) scheduleRefresh();
  });
  [
    'patientSaveStatus','preopProgress','preopExamStatus','preopRiskStatus','caseDrugPlanStatus',
    'caseDrugPlanList','recoveryPhaseBadge','recoveryStatus','recoveryReadiness','recoveryScoreCurrent',
    'recoveryScoreCount','recoveryRecordCount','recoveryFocusReadiness'
  ].forEach(id=>{
    const el=byId(id); if(el) observer.observe(el,{attributes:true,childList:true,characterData:true,subtree:true});
  });
  qa('.workflow-tabs .tab,.tabpage').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class']}));
  qa('#preop .preop-item').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class']}));
  qa('#recovery .recovery-check-item,.recovery-observation-na-btn').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class']}));

  refresh();
})();
