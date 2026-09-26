/* ANESVET V15.22.0 — Planned-vs-Actual Medication Reconciliation
   End-case documentation safety layer. It does not recommend a drug, dose, route,
   or preparation. It only reconciles the frozen Case Drug Plan with documented
   Actual administrations and explicit Not-given decisions. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const app = () => window.AnesvetApp || null;
  const getState = () => app()?.getState?.() || null;
  const esc = value => app()?.escapeHtml?.(value) ?? String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  let pendingKey = '';

  const reasonLabels = {
    'plan-changed':'Plan changed / no longer intended',
    'not-required':'Not required after reassessment',
    'withheld':'Withheld / deferred',
    'other':'Other'
  };

  function normalizeName(value){ return String(value || '').trim().toLowerCase().replace(/\s+/g,' '); }
  function normalizeId(value){ return String(value || '').trim().toLowerCase(); }
  function isLegacyLockedWithoutStore(state){ return !!(state?.caseLocked && state?.finalChecksum && (!state.medicationReconciliation || typeof state.medicationReconciliation!=='object')); }
  function isStandby(item){
    const phase=String(item?.phase||'').toLowerCase(), role=String(item?.role||'').toLowerCase();
    return !!item?.standby || phase==='emergency' || role.includes('emergency') || role.includes('standby');
  }
  function sourcePlan(state){
    const plan=state?.protocolSnapshot?.caseDrugPlan || state?.caseDrugPlan || [];
    return Array.isArray(plan)?plan:[];
  }
  function plannedItems(state){
    const seen={};
    return sourcePlan(state).filter(x=>x&&!isStandby(x)).map((d,index)=>{
      const name=d.name||d.id||`Medication ${index+1}`, base=normalizeName(d.id||name)||`item-${index}`;
      seen[base]=(seen[base]||0)+1;
      return {...d,_index:index,_key:`${base}::${seen[base]}`,_name:name,_normalizedName:normalizeName(name)};
    });
  }
  function ensureStore(state){
    if(!state) return {version:1,decisions:{}};
    // Never mutate a checksummed legacy record merely by viewing it.
    if(isLegacyLockedWithoutStore(state)) return {version:1,decisions:{},legacyReadOnly:true};
    if(!state.medicationReconciliation || typeof state.medicationReconciliation!=='object') state.medicationReconciliation={version:1,decisions:{}};
    if(!state.medicationReconciliation.decisions || typeof state.medicationReconciliation.decisions!=='object') state.medicationReconciliation.decisions={};
    return state.medicationReconciliation;
  }
  function activeAdministrations(state){ return (state?.drugAdministrations||[]).filter(x=>x&&!x.voidedAt); }
  function reconciliationRows(state=getState()){
    if(!state) return [];
    const decisions=ensureStore(state).decisions, admins=activeAdministrations(state).slice().sort((a,b)=>(a.epoch||0)-(b.epoch||0)), used=new Set();
    return plannedItems(state).map(item=>{
      const plannedId=normalizeId(item.id), plannedName=item._normalizedName;
      let actual=null;
      if(plannedId){
        actual=admins.find(a=>!used.has(a.id)&&normalizeId(a?.calculationBasis?.drug?.id)===plannedId)||null;
      }
      if(!actual){
        actual=admins.find(a=>!used.has(a.id)&&normalizeName(a.drug)===plannedName)||null;
      }
      if(actual)used.add(actual.id);
      const decision=decisions[item._key]||null;
      return {item,actual,decision,status:actual?'given':decision?.status==='not-given'?'not-given':'pending'};
    });
  }
  function unplannedAdministrations(state=getState()){
    if(!state)return [];
    const rows=reconciliationRows(state), used=new Set(rows.filter(r=>r.actual).map(r=>r.actual.id));
    return activeAdministrations(state).filter(a=>!used.has(a.id));
  }
  function summary(state=getState()){
    if(isLegacyLockedWithoutStore(state))return {total:plannedItems(state).length,pending:0,given:0,notGiven:0,complete:true,unplanned:0,legacy:true};
    const rows=reconciliationRows(state), pending=rows.filter(r=>r.status==='pending').length, given=rows.filter(r=>r.status==='given').length, notGiven=rows.filter(r=>r.status==='not-given').length;
    return {total:rows.length,pending,given,notGiven,complete:pending===0,unplanned:unplannedAdministrations(state).length,legacy:false};
  }
  function isComplete(state=getState()){ return summary(state).complete; }
  function pendingCount(state=getState()){ return summary(state).pending; }
  function plannedReference(item){
    if(Number.isFinite(Number(item?.plannedMl)) && Number(item.plannedMl)>0)return `Planned ${Number(item.plannedMl).toFixed(3).replace(/0+$/,'').replace(/\.$/,'')} mL`;
    if(item?.plannedTotal)return String(item.plannedTotal);
    if(item?.dose!==undefined&&item?.dose!==null&&String(item.dose)!=='')return `Plan reference ${item.dose}${item.mode==='bwdiv'?' factor':''}`;
    return 'No planned volume';
  }
  function actualText(a){
    if(!a)return '';
    return `${a.actual} ${a.unit||'mL'} • ${a.route||'route not recorded'}${a.concentration?` • ${a.concentration}`:''}${a.clock?` • ${a.clock}`:''}`;
  }
  function render(){
    const state=getState(), panel=$('medicationReconciliationPanel'), list=$('medicationReconciliationList'), badge=$('medicationReconciliationStatus');
    if(!panel||!list||!badge||!state)return;
    const s=summary(state), locked=!!state.caseLocked, legacy=!!s.legacy, rows=legacy?[]:reconciliationRows(state);
    badge.textContent=legacy?'LEGACY LOCKED':s.total===0?'NO PLANNED MEDS':s.pending?`${s.pending} PENDING`:'RECONCILED';
    badge.className=`status-pill ${s.pending?'warn':'good'}`;
    panel.classList.toggle('med-reconciliation-complete',!s.pending);
    if(legacy){
      list.innerHTML='<div class="empty-state compact">Legacy locked record — medication reconciliation was not captured before V15.22.0. This final record is left unchanged to preserve its checksum.</div>';
    }else if(!rows.length){
      list.innerHTML='<div class="empty-state compact">No routine planned medications in the frozen Case Drug Plan. Emergency / standby items are excluded from reconciliation.</div>';
    }else{
      list.innerHTML=rows.map(({item,actual,decision,status})=>{
        const phase=item.phase?String(item.phase).replace(/[-_]/g,' '):'planned', statusText=status==='given'?'GIVEN':status==='not-given'?'NOT GIVEN':'PENDING';
        const decisionText=decision?`${reasonLabels[decision.reason]||decision.reason||'Not given'}${decision.note?` • ${decision.note}`:''}${decision.reviewedBy?` • by ${decision.reviewedBy}`:''}`:'';
        return `<article class="med-reconciliation-row ${status}" data-med-reconciliation-key="${esc(item._key)}">
          <div class="med-reconciliation-drug"><b>${esc(item._name)}</b><small>${esc(phase)} • ${esc(plannedReference(item))}</small></div>
          <div class="med-reconciliation-result"><span class="med-reconciliation-pill ${status}">${statusText}</span>${status==='given'?`<small>${esc(actualText(actual))}</small>`:status==='not-given'?`<small>${esc(decisionText)}</small>`:'<small>Actual administration not found and no Not-given decision documented.</small>'}</div>
          <div class="med-reconciliation-actions">${locked?'':status==='pending'?'<button class="btn med-mark-not-given" type="button">Mark not given</button>':status==='not-given'?'<button class="btn danger-outline med-clear-not-given" type="button">Clear decision</button>':''}</div>
        </article>`;
      }).join('');
    }
    const unplanned=legacy?[]:unplannedAdministrations(state), box=$('medicationReconciliationUnplanned');
    if(box){
      box.hidden=!unplanned.length;
      box.innerHTML=unplanned.length?`<b>Other actual administrations (${unplanned.length})</b><div>${unplanned.map(a=>`<span>${esc(a.drug)} • ${esc(actualText(a))}</span>`).join('')}</div>`:'';
    }
    const hint=$('medicationReconciliationHint');
    if(hint)hint.textContent=legacy?'Read-only legacy record • no reconciliation state was added after Final Lock':s.pending?`Reconcile ${s.pending} planned medication${s.pending===1?'':'s'} before Final Lock. Emergency / standby items are not required.`:`${s.given} given • ${s.notGiven} explicitly not given${s.unplanned?` • ${s.unplanned} other actual administration${s.unplanned===1?'':'s'}`:''}`;
  }
  function openDecision(key){
    const state=getState(); if(!state||state.caseLocked)return;
    const row=reconciliationRows(state).find(r=>r.item._key===key);if(!row||row.status==='given')return;
    pendingKey=key;
    if($('medReconcileDrugName'))$('medReconcileDrugName').textContent=row.item._name;
    if($('medReconcileReason'))$('medReconcileReason').value='plan-changed';
    if($('medReconcileNote'))$('medReconcileNote').value='';
    if($('medReconcileReviewer'))$('medReconcileReviewer').value=document.getElementById('anesthetist')?.value.trim()||'';
    if($('medReconcileError'))$('medReconcileError').textContent='';
    const d=$('medReconcileDialog');try{if(d&&!d.open)d.showModal()}catch(_){d?.setAttribute('open','')}
  }
  function closeDecision(){
    pendingKey='';const d=$('medReconcileDialog');if(!d)return;try{if(d.open)d.close();else d.removeAttribute('open')}catch(_){d.removeAttribute('open')}
  }
  function saveDecision(){
    const state=getState();if(!state||state.caseLocked||!pendingKey)return;
    const row=reconciliationRows(state).find(r=>r.item._key===pendingKey);if(!row||row.status==='given'){closeDecision();render();return}
    const reason=$('medReconcileReason')?.value||'',note=$('medReconcileNote')?.value.trim()||'',reviewer=$('medReconcileReviewer')?.value.trim()||'';
    if(!reason||!reviewer){if($('medReconcileError'))$('medReconcileError').textContent='Select a reason and enter Reviewed by.';return}
    if(reason==='other'&&!note){if($('medReconcileError'))$('medReconcileError').textContent='Add a note when Reason = Other.';return}
    const store=ensureStore(state), epoch=Date.now();
    store.decisions[pendingKey]={status:'not-given',reason,note,reviewedBy:reviewer,epoch,drug:row.item._name,phase:row.item.phase||''};
    app()?.audit?.('PLANNED_MEDICATION_NOT_GIVEN',`${row.item._name} • ${reasonLabels[reason]||reason}${note?` • ${note}`:''}`,reviewer);
    app()?.save?.();closeDecision();render();app()?.renderEndCase?.();document.dispatchEvent(new CustomEvent('anesvet:medication-reconciliation-changed'));
  }
  function clearDecision(key){
    const state=getState();if(!state||state.caseLocked)return;const store=ensureStore(state),decision=store.decisions[key];if(!decision)return;
    const row=reconciliationRows(state).find(r=>r.item._key===key);if(!confirm(`Clear Not-given decision for ${row?.item?._name||'this medication'}?`))return;
    delete store.decisions[key];app()?.audit?.('PLANNED_MEDICATION_RECONCILIATION_CLEARED',row?.item?._name||key,document.getElementById('anesthetist')?.value.trim()||'');app()?.save?.();render();app()?.renderEndCase?.();document.dispatchEvent(new CustomEvent('anesvet:medication-reconciliation-changed'));
  }
  function focusPending(){
    render();const row=document.querySelector('.med-reconciliation-row.pending'), panel=$('medicationReconciliationPanel'), target=row||panel;if(!target)return false;
    try{target.scrollIntoView({behavior:'smooth',block:'center'})}catch(_){target.scrollIntoView()}
    row?.classList.add('med-reconciliation-pulse');setTimeout(()=>row?.classList.remove('med-reconciliation-pulse'),1000);return true;
  }

  window.AnesvetMedicationReconciliation={summary,isComplete,pendingCount,reconciliationRows,unplannedAdministrations,render,focusPending};

  $('medicationReconciliationList')?.addEventListener('click',e=>{
    const row=e.target.closest?.('.med-reconciliation-row');if(!row)return;
    if(e.target.closest('.med-mark-not-given'))openDecision(row.dataset.medReconciliationKey);
    if(e.target.closest('.med-clear-not-given'))clearDecision(row.dataset.medReconciliationKey);
  });
  $('medReconcileCloseBtn')?.addEventListener('click',closeDecision);
  $('medReconcileCancelBtn')?.addEventListener('click',closeDecision);
  $('medReconcileSaveBtn')?.addEventListener('click',saveDecision);
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="endcase"],[data-mobile-tab="endcase"]'))setTimeout(render,40)});
  document.addEventListener('anesvet:drug-administration-changed',()=>{render();app()?.renderEndCase?.()});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(render,80),{once:true});else setTimeout(render,80);
})();
