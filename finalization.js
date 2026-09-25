/* ANESVET V15.20.0 — End Case & Report Flow */
(function(){
  'use strict';

  const $=id=>document.getElementById(id);
  const q=(sel,root=document)=>root.querySelector(sel);
  const qa=(sel,root=document)=>Array.from(root.querySelectorAll(sel));
  let refreshToken=null;

  function settings(){
    try{
      if(typeof currentSettingsObject==='function') return currentSettingsObject()||{};
      return JSON.parse(localStorage.getItem('anesvet_v14_3_settings')||'{}')||{};
    }catch(e){ return {}; }
  }
  function preferredReport(){ return settings().defaultReport==='full'?'full':'summary'; }
  function unresolvedAlerts(){ return (state?.alertEpisodes||[]).filter(x=>!x.resolvedAt); }
  function activeComplications(){ return (state?.complications||[]).filter(x=>x.status!=='resolved'); }
  function checklistDefs(){
    return [
      ['endConfirmRecovery','ตรวจ Recovery แล้ว'],
      ['endConfirmRecord','ตรวจ Anesthesia record แล้ว'],
      ['endConfirmDrugs','ตรวจ Drug / Event แล้ว'],
      ['endConfirmPdf','ตรวจ report / พร้อม export']
    ];
  }
  function signoffMissing(){
    const fs=state?.finalSignoff||{};
    const out=[];
    if(!fs.anesthetist)out.push({type:'sign-anesthetist',label:'Anesthetist sign-off'});
    if(!fs.surgeon)out.push({type:'sign-surgeon',label:'Surgeon sign-off'});
    return out;
  }
  function blockers(){
    const out=[];
    if(!state?.recoveryCompletedAt) out.push({type:'recovery',label:'Recovery ยังไม่ complete',tone:'danger'});
    const alerts=unresolvedAlerts();
    if(alerts.length) out.push({type:'alerts',label:`${alerts.length} unresolved alert${alerts.length>1?'s':''}`,tone:'danger'});
    const comps=activeComplications();
    if(comps.length) out.push({type:'complications',label:`${comps.length} active complication${comps.length>1?'s':''}`,tone:'danger'});
    out.push(...signoffMissing().map(x=>({...x,tone:'warn'})));
    checklistDefs().forEach(([id,label])=>{ if(!$(id)?.checked)out.push({type:id,label,tone:'muted'}); });
    return out;
  }
  function checklistProgress(){
    const defs=checklistDefs(),done=defs.filter(([id])=>!!$(id)?.checked).length;
    return {done,total:defs.length};
  }
  function reportIdentity(){
    const patient=$('patientName')?.value.trim()||state?.patientName||'Unnamed patient';
    let hospital='';
    try{
      const b=window.AnesvetBranding?.effectiveForState?.(state)||window.AnesvetBranding?.getCurrent?.()||{};
      hospital=b.hospitalShortName||b.hospitalName||'';
    }catch(e){}
    const record=state?.humanRecordId||state?.visitId||state?.hospitalId||((state?.caseId||'').slice(0,8));
    return [hospital,patient,record?`Record ${record}`:''].filter(Boolean).join(' • ');
  }
  function setChecklistVisuals(){
    checklistDefs().forEach(([id])=>{
      const el=$(id),label=el?.closest('label');
      if(label)label.classList.toggle('done',!!el.checked);
    });
    ['anesthetist','surgeon'].forEach(role=>{
      const card=$(`signoff${role[0].toUpperCase()+role.slice(1)}Name`)?.closest('.signoff-card');
      if(card)card.classList.toggle('signed',!!state?.finalSignoff?.[role]);
    });
  }
  function renderBlockers(list){
    const wrap=$('endCaseBlockers');if(!wrap)return;
    if(state?.caseLocked){
      wrap.innerHTML='<span class="endcase-blocker-chip good">✓ Final record locked & archived</span>';
      return;
    }
    if(!list.length){
      wrap.innerHTML='<span class="endcase-blocker-chip good">✓ Final checks complete</span>';
      return;
    }
    wrap.innerHTML=list.slice(0,8).map(x=>`<span class="endcase-blocker-chip ${x.tone||'muted'}">${escapeHtml(x.label)}</span>`).join('');
  }
  function nextDescriptor(list){
    if(state?.caseLocked) return {label:'＋ Start new case',action:'new-case'};
    const order=['recovery','alerts','complications','sign-anesthetist','sign-surgeon','endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'];
    for(const key of order){
      const hit=list.find(x=>x.type===key);if(hit)return {label:`→ ${hit.label}`,action:key};
    }
    return {label:'✓ End, Lock & Archive Case',action:'finalize'};
  }
  function renderPreferredReport(){
    const pref=preferredReport(),btn=$('endPreferredReportBtn'),hint=$('endPreferredReportHint');
    if(btn)btn.textContent=pref==='summary'?'Export preferred • 1-page Summary':'Export preferred • Full PDF';
    if(hint)hint.textContent=pref==='summary'?'Default report: 1-page Summary • Full PDF ยังอยู่ด้านล่าง':'Default report: Full PDF • 1-page Summary ยังอยู่ด้านล่าง';
    const post=$('finalizedPreferredReportBtn');if(post)post.textContent=pref==='summary'?'Export 1-page Summary':'Export Full PDF';
  }
  function render(){
    const page=$('endcase');if(!page)return;
    const list=blockers(),next=nextDescriptor(list),progress=checklistProgress();
    const title=$('endCaseEfficiencyTitle'),summary=$('endCaseEfficiencySummary'),btn=$('endCaseNextTaskBtn');
    if(state?.caseLocked){
      if(title)title.textContent='Final record complete';
      if(summary)summary.textContent='เคสถูก lock และ archive แล้ว • Export report ได้ต่อก่อนเริ่มเคสใหม่';
    }else if(!list.length){
      if(title)title.textContent='พร้อม Final Lock';
      if(summary)summary.textContent='Recovery, sign-off และ final checklist ครบแล้ว';
    }else{
      if(title)title.textContent='ทำรายการที่ยังค้างให้ครบ';
      if(summary)summary.textContent=`Final checklist ${progress.done}/${progress.total} • ${list.length} รายการยังต้อง review`;
    }
    if(btn){btn.textContent=next.label;btn.dataset.action=next.action;btn.classList.toggle('good',!list.length&&!state?.caseLocked);}
    renderBlockers(list);
    setChecklistVisuals();
    const focus=$('endCaseFocusPending');if(page)page.classList.toggle('endcase-focus-pending',!!focus?.checked&&!state?.caseLocked);
    const badge=$('endReportReadyBadge');if(badge){const ready=!list.length||!!state?.caseLocked;badge.textContent=state?.caseLocked?'LOCKED':ready?'READY':'REVIEW';badge.className=`status-pill ${ready?'good':'warn'}`;}
    if($('endReportIdentity'))$('endReportIdentity').textContent=reportIdentity()||'ANESVET report';
    renderPreferredReport();
  }
  function schedule(){clearTimeout(refreshToken);refreshToken=setTimeout(render,20);}
  function scrollTo(el){if(!el)return;try{el.scrollIntoView({behavior:'smooth',block:'center'});}catch(e){el.scrollIntoView();}el.classList.add('endcase-target-pulse');setTimeout(()=>el.classList.remove('endcase-target-pulse'),1100);}
  function runNext(){
    const action=$('endCaseNextTaskBtn')?.dataset.action||'';
    if(action==='new-case'){ if(confirm('เริ่มเคสใหม่? Final record นี้ถูก archive แล้ว'))resetCurrent(); return; }
    if(action==='recovery'){setTab('recovery',{force:true});setTimeout(()=>scrollTo($('recoveryFocusCompleteBtn')||$('recoveryReadiness')),120);return;}
    if(action==='alerts'){setTab(state?.casePhase==='recovery'?'recovery':'orlive',{force:true});setTimeout(()=>scrollTo($('recoveryProblemsPanel')||q('.or-alert-panel')),120);return;}
    if(action==='complications'){setTab('events');setTimeout(()=>scrollTo(q('.complication-workflow-panel')),120);return;}
    if(action==='sign-anesthetist'){scrollTo($('signAnesthetistBtn'));return;}
    if(action==='sign-surgeon'){scrollTo($('signSurgeonBtn'));return;}
    if(action.startsWith('endConfirm')){scrollTo($(action));return;}
    if(action==='finalize'){$('endSaveArchiveBtn')?.click();return;}
  }
  function markReportReviewed(){
    const cb=$('endConfirmPdf');if(cb&&!cb.checked&&!state?.caseLocked){cb.checked=true;cb.dispatchEvent(new Event('change',{bubbles:true}));}
    schedule();
  }
  function exportPreferred(){
    markReportReviewed();
    if(preferredReport()==='full')exportPdfReport();else exportPdfSummary();
  }
  function openFinalizedDialog(){
    render();
    const d=$('caseFinalizedDialog');
    if($('caseFinalizedSummary')){
      const patient=$('patientName')?.value.trim()||state?.patientName||'Patient';
      $('caseFinalizedSummary').textContent=`${patient} • Final record ถูก lock และบันทึกใน Cases แล้ว`;
    }
    if(!d)return;
    try{if(!d.open)d.showModal();}catch(e){d.setAttribute('open','');}
  }
  function closeFinalizedDialog(){const d=$('caseFinalizedDialog');if(!d)return;try{if(d.open)d.close();else d.removeAttribute('open');}catch(e){d.removeAttribute('open');}}

  window.showCaseFinalizedDialog=openFinalizedDialog;

  $('endCaseNextTaskBtn')?.addEventListener('click',runNext);
  $('endCaseFocusPending')?.addEventListener('change',render);
  $('endPreferredReportBtn')?.addEventListener('click',exportPreferred);
  $('endExportSummaryPdfBtn')?.addEventListener('click',markReportReviewed);
  $('endExportPdfBtn')?.addEventListener('click',markReportReviewed);
  $('finalizedPreferredReportBtn')?.addEventListener('click',exportPreferred);
  $('finalizedFullReportBtn')?.addEventListener('click',()=>exportPdfReport());
  $('finalizedViewArchiveBtn')?.addEventListener('click',()=>{closeFinalizedDialog();setTab('cases');});
  $('finalizedStayBtn')?.addEventListener('click',()=>{closeFinalizedDialog();setTab('endcase');});
  $('finalizedNewCaseBtn')?.addEventListener('click',()=>{closeFinalizedDialog();resetCurrent();});

  ['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf','signAnesthetistBtn','signSurgeonBtn','endSaveArchiveBtn'].forEach(id=>$(id)?.addEventListener('click',schedule));
  document.addEventListener('change',e=>{if(e.target.closest?.('#endcase'))schedule();});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="endcase"],[data-mobile-tab="endcase"]'))setTimeout(render,40);});

  const readinessSignal=$('endCaseReadiness');
  if(readinessSignal&&window.MutationObserver){
    new MutationObserver(schedule).observe(readinessSignal,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render,{once:true});else render();
})();
