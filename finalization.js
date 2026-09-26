/* ANESVET V15.22.0 — End Case & Report Flow
   Uses the narrow ANESVET app bridge instead of reaching into app.js lexical state. */
(function(){
  'use strict';

  const $=id=>document.getElementById(id);
  const q=(sel,root=document)=>root.querySelector(sel);
  let refreshToken=null;
  const api=()=>window.AnesvetApp||null;
  const st=()=>api()?.getState?.()||null;
  const esc=value=>api()?.escapeHtml?.(value)??String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  function settings(){
    try{return api()?.settings?.()||{};}catch(e){return {};}
  }
  function preferredReport(){return settings().defaultReport==='full'?'full':'summary';}
  function unresolvedAlerts(){const s=st();return (s?.alertEpisodes||[]).filter(x=>!x.resolvedAt);}
  function activeComplications(){const s=st();return (s?.complications||[]).filter(x=>x.status!=='resolved');}
  function medicationSummary(){
    const s=st(),mr=window.AnesvetMedicationReconciliation;
    if(!s)return {total:0,pending:0,complete:true};
    if(mr?.summary)return mr.summary(s);
    const plan=s.protocolSnapshot?.caseDrugPlan||s.caseDrugPlan||[];
    const required=(Array.isArray(plan)?plan:[]).filter(d=>{const phase=String(d?.phase||'').toLowerCase(),role=String(d?.role||'').toLowerCase();return !d?.standby&&phase!=='emergency'&&!role.includes('emergency')&&!role.includes('standby')});
    return {total:required.length,pending:required.length,complete:required.length===0};
  }
  function checklistDefs(){return [['endConfirmRecovery','ตรวจ Recovery แล้ว'],['endConfirmRecord','ตรวจ Anesthesia record แล้ว'],['endConfirmDrugs','ตรวจ Drug / Event แล้ว'],['endConfirmPdf','ตรวจ report / พร้อม export']];}
  function signoffMissing(){
    const fs=st()?.finalSignoff||{},out=[];
    if(!fs.anesthetist)out.push({type:'sign-anesthetist',label:'Anesthetist sign-off'});
    if(!fs.surgeon)out.push({type:'sign-surgeon',label:'Surgeon sign-off'});
    return out;
  }
  function blockers(){
    const s=st(),out=[];if(!s)return out;
    if(!s.recoveryCompletedAt)out.push({type:'recovery',label:'Recovery ยังไม่ complete',tone:'danger'});
    const alerts=unresolvedAlerts();if(alerts.length)out.push({type:'alerts',label:`${alerts.length} unresolved alert${alerts.length>1?'s':''}`,tone:'danger'});
    const comps=activeComplications();if(comps.length)out.push({type:'complications',label:`${comps.length} active complication${comps.length>1?'s':''}`,tone:'danger'});
    const meds=medicationSummary();if(meds.pending)out.push({type:'med-reconciliation',label:`${meds.pending} planned medication${meds.pending>1?'s':''} pending reconciliation`,tone:'warn'});
    out.push(...signoffMissing().map(x=>({...x,tone:'warn'})));
    checklistDefs().forEach(([id,label])=>{if(!$(id)?.checked)out.push({type:id,label,tone:'muted'});});
    return out;
  }
  function checklistProgress(){const defs=checklistDefs(),done=defs.filter(([id])=>!!$(id)?.checked).length;return {done,total:defs.length};}
  function reportIdentity(){
    const s=st();if(!s)return 'ANESVET report';
    const patient=$('patientName')?.value.trim()||s.patientName||'Unnamed patient';let hospital='';
    try{const b=window.AnesvetBranding?.effectiveForState?.(s)||window.AnesvetBranding?.getCurrent?.()||{};hospital=b.hospitalShortName||b.hospitalName||'';}catch(e){}
    const record=s.humanRecordId||s.visitId||s.hospitalId||((s.caseId||'').slice(0,8));
    return [hospital,patient,record?`Record ${record}`:''].filter(Boolean).join(' • ');
  }
  function setChecklistVisuals(){
    const s=st();if(!s)return;
    checklistDefs().forEach(([id])=>{const el=$(id),label=el?.closest('label');if(label)label.classList.toggle('done',!!el.checked);});
    ['anesthetist','surgeon'].forEach(role=>{const card=$(`signoff${role[0].toUpperCase()+role.slice(1)}Name`)?.closest('.signoff-card');if(card)card.classList.toggle('signed',!!s.finalSignoff?.[role]);});
  }
  function renderBlockers(list){
    const s=st(),wrap=$('endCaseBlockers');if(!wrap||!s)return;
    if(s.caseLocked){wrap.innerHTML='<span class="endcase-blocker-chip good">✓ Final record locked & archived</span>';return;}
    if(!list.length){wrap.innerHTML='<span class="endcase-blocker-chip good">✓ Final checks complete</span>';return;}
    wrap.innerHTML=list.slice(0,9).map(x=>`<span class="endcase-blocker-chip ${x.tone||'muted'}">${esc(x.label)}</span>`).join('');
  }
  function nextDescriptor(list){
    const s=st();if(s?.caseLocked)return {label:'＋ Start new case',action:'new-case'};
    const order=['recovery','alerts','complications','med-reconciliation','sign-anesthetist','sign-surgeon','endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'];
    for(const key of order){const hit=list.find(x=>x.type===key);if(hit)return {label:`→ ${hit.label}`,action:key};}
    return {label:'✓ End, Lock & Archive Case',action:'finalize'};
  }
  function renderPreferredReport(){
    const pref=preferredReport(),btn=$('endPreferredReportBtn'),hint=$('endPreferredReportHint');
    if(btn)btn.textContent=pref==='summary'?'Export preferred • 1-page Summary':'Export preferred • Full PDF';
    if(hint)hint.textContent=pref==='summary'?'Default report: 1-page Summary • Full PDF ยังอยู่ด้านล่าง':'Default report: Full PDF • 1-page Summary ยังอยู่ด้านล่าง';
    const post=$('finalizedPreferredReportBtn');if(post)post.textContent=pref==='summary'?'Export 1-page Summary':'Export Full PDF';
  }
  function render(){
    const s=st(),page=$('endcase');if(!page||!s)return;
    window.AnesvetMedicationReconciliation?.render?.();
    const list=blockers(),next=nextDescriptor(list),progress=checklistProgress(),meds=medicationSummary();
    const title=$('endCaseEfficiencyTitle'),summary=$('endCaseEfficiencySummary'),btn=$('endCaseNextTaskBtn');
    if(s.caseLocked){if(title)title.textContent='Final record complete';if(summary)summary.textContent='เคสถูก lock และ archive แล้ว • Export report ได้ต่อก่อนเริ่มเคสใหม่';}
    else if(!list.length){if(title)title.textContent='พร้อม Final Lock';if(summary)summary.textContent='Recovery, medication reconciliation, sign-off และ final checklist ครบแล้ว';}
    else{if(title)title.textContent='ทำรายการที่ยังค้างให้ครบ';if(summary)summary.textContent=`Final checklist ${progress.done}/${progress.total} • Med reconciliation ${meds.total-meds.pending}/${meds.total} • ${list.length} รายการยังต้อง review`;}
    if(btn){btn.textContent=next.label;btn.dataset.action=next.action;btn.classList.toggle('good',!list.length&&!s.caseLocked);}
    renderBlockers(list);setChecklistVisuals();
    const focus=$('endCaseFocusPending');page.classList.toggle('endcase-focus-pending',!!focus?.checked&&!s.caseLocked);
    const badge=$('endReportReadyBadge');if(badge){const ready=!list.length||!!s.caseLocked;badge.textContent=s.caseLocked?'LOCKED':ready?'READY':'REVIEW';badge.className=`status-pill ${ready?'good':'warn'}`;}
    if($('endReportIdentity'))$('endReportIdentity').textContent=reportIdentity();renderPreferredReport();
  }
  function schedule(){clearTimeout(refreshToken);refreshToken=setTimeout(render,20);}
  function scrollTo(el){if(!el)return;try{el.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){el.scrollIntoView();}el.classList.add('endcase-target-pulse');setTimeout(()=>el.classList.remove('endcase-target-pulse'),1100);}
  function runNext(){
    const action=$('endCaseNextTaskBtn')?.dataset.action||'';
    if(action==='new-case'){if(confirm('เริ่มเคสใหม่? Final record นี้ถูก archive แล้ว'))api()?.resetCurrent?.();return;}
    if(action==='recovery'){api()?.setTab?.('recovery',{force:true});setTimeout(()=>scrollTo($('recoveryFocusCompleteBtn')||$('recoveryReadiness')),120);return;}
    if(action==='alerts'){api()?.setTab?.(st()?.casePhase==='recovery'?'recovery':'orlive',{force:true});setTimeout(()=>scrollTo($('recoveryProblemsPanel')||q('.or-alert-panel')),120);return;}
    if(action==='complications'){api()?.setTab?.('events');setTimeout(()=>scrollTo(q('.complication-workflow-panel')),120);return;}
    if(action==='med-reconciliation'){window.AnesvetMedicationReconciliation?.focusPending?.()||scrollTo($('medicationReconciliationPanel'));return;}
    if(action==='sign-anesthetist'){scrollTo($('signAnesthetistBtn'));return;}
    if(action==='sign-surgeon'){scrollTo($('signSurgeonBtn'));return;}
    if(action.startsWith('endConfirm')){scrollTo($(action));return;}
    if(action==='finalize'){$('endSaveArchiveBtn')?.click();}
  }
  function markReportReviewed(){const s=st(),cb=$('endConfirmPdf');if(cb&&!cb.checked&&!s?.caseLocked){cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}));}schedule();}
  function exportPreferred(){markReportReviewed();if(preferredReport()==='full')api()?.exportPdfReport?.();else api()?.exportPdfSummary?.();}
  function openFinalizedDialog(){
    render();const s=st(),d=$('caseFinalizedDialog');if($('caseFinalizedSummary')){const patient=$('patientName')?.value.trim()||s?.patientName||'Patient';$('caseFinalizedSummary').textContent=`${patient} • Final record ถูก lock และบันทึกใน Cases แล้ว`;}
    if(!d)return;try{if(!d.open)d.showModal();}catch(e){d.setAttribute('open','');}
  }
  function closeFinalizedDialog(){const d=$('caseFinalizedDialog');if(!d)return;try{if(d.open)d.close();else d.removeAttribute('open');}catch(e){d.removeAttribute('open');}}

  window.showCaseFinalizedDialog=openFinalizedDialog;
  $('endCaseNextTaskBtn')?.addEventListener('click',runNext);
  $('endCaseFocusPending')?.addEventListener('change',render);
  $('endPreferredReportBtn')?.addEventListener('click',exportPreferred);
  $('endExportSummaryPdfBtn')?.addEventListener('click',markReportReviewed);
  $('endExportPdfBtn')?.addEventListener('click',markReportReviewed);
  $('finalizedPreferredReportBtn')?.addEventListener('click',exportPreferred);
  $('finalizedFullReportBtn')?.addEventListener('click',()=>api()?.exportPdfReport?.());
  $('finalizedViewArchiveBtn')?.addEventListener('click',()=>{closeFinalizedDialog();api()?.setTab?.('cases');});
  $('finalizedStayBtn')?.addEventListener('click',()=>{closeFinalizedDialog();api()?.setTab?.('endcase');});
  $('finalizedNewCaseBtn')?.addEventListener('click',()=>{closeFinalizedDialog();api()?.resetCurrent?.();});
  ['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf','signAnesthetistBtn','signSurgeonBtn','endSaveArchiveBtn'].forEach(id=>$(id)?.addEventListener('click',schedule));
  document.addEventListener('change',e=>{if(e.target.closest?.('#endcase'))schedule();});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="endcase"],[data-mobile-tab="endcase"]'))setTimeout(render,40);});
  document.addEventListener('anesvet:medication-reconciliation-changed',schedule);
  document.addEventListener('anesvet:drug-administration-changed',schedule);
  const readinessSignal=$('endCaseReadiness');if(readinessSignal&&window.MutationObserver)new MutationObserver(schedule).observe(readinessSignal,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
