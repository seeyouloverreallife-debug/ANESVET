/* RETIRED in ANESVET V17.13.3 — no longer loaded at runtime. Behavior migrated to canonical owners. */
/* ANESVET V16.5.0 — Usability Hardening
   UX-only layer: actionable persistence feedback, direct-fix navigation,
   and one-tap return to the active clinical workspace.
   No dose, threshold, medication, readiness criteria, recovery criteria,
   record semantics, or finalization criteria are changed. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const q = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => [...root.querySelectorAll(sel)];
  const api = () => window.AnesvetApp || null;
  let dirtyTimer = 0;
  let refreshTimer = 0;

  const readinessMap = [
    [/^Patient name/i, 'patient', 'patientName'],
    [/^Species/i, 'patient', 'species'],
    [/^Current body weight/i, 'patient', 'weight'],
    [/^Save Patient/i, 'patient', 'savePatientBtn'],
    [/^Procedure/i, 'patient', 'patientProcedure'],
    [/^ASA Physical Status/i, 'patient', 'asaGrid'],
    [/^Recorded pre-anesthetic physical exam/i, 'preop', 'preopExamHeading'],
    [/^Recorded anesthetic risk review/i, 'preop', 'preopRiskStatus'],
    [/^Pre-op checklist reviewed/i, 'preop', 'preopProgress'],
    [/^Case Drug Plan/i, 'drugs', 'caseDrugPlanStatus'],
    [/^Anesthetist/i, 'patient', 'anesthetist'],
    [/^Surgeon/i, 'patient', 'surgeon']
  ];

  function schedule(){ clearTimeout(refreshTimer); refreshTimer=setTimeout(refresh,40); }
  function activePage(){ return q('.tabpage.active')?.id || ''; }
  function reveal(target){
    if(!target) return;
    try{ window.ANESVETProgressiveDisclosure?.openForElement?.(target); }catch(_){ }
    try{ window.ANESVETFocusedWorkspace?.openForElement?.(target); }catch(_){ }
    const container=target.closest?.('.panel,.preop-item,.case-drug-plan-panel,.final-signoff-panel')||target;
    setTimeout(()=>{
      try{container.scrollIntoView({behavior:'smooth',block:'center'});}catch(_){container.scrollIntoView?.();}
      const focusable=target.matches?.('input,select,textarea,button')?target:target.querySelector?.('input:not([disabled]),select:not([disabled]),textarea:not([disabled]),button:not([disabled])');
      setTimeout(()=>focusable?.focus?.({preventScroll:true}),220);
    },80);
  }
  function goFix(tab,targetId,dialog){
    try{ if(dialog?.open&&typeof dialog.close==='function') dialog.close(); else dialog?.removeAttribute?.('open'); }catch(_){ }
    api()?.setTab?.(tab,{force:true});
    setTimeout(()=>reveal($(targetId)),100);
  }

  function enhanceReadinessList(root){
    qa('li:not(.ready)',root).forEach(li=>{
      if(li.querySelector('.ux-inline-fix')) return;
      const text=(li.querySelector('b')?.textContent||li.textContent||'').trim();
      const hit=readinessMap.find(([re])=>re.test(text));
      if(!hit) return;
      const btn=document.createElement('button');
      btn.type='button';btn.className='ux-inline-fix';btn.textContent='ไปแก้';btn.setAttribute('aria-label',`ไปแก้ ${text}`);
      btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();goFix(hit[1],hit[2],$('preOrReadinessDialog'));});
      li.appendChild(btn);
    });
  }
  function enhanceReadiness(){
    const req=$('preOrRequiredList'),rec=$('preOrRecommendedList');
    if(req)enhanceReadinessList(req);if(rec)enhanceReadinessList(rec);
  }

  function inferEndAction(text){
    if(/Recovery.*not complete|Recovery ยังไม่ complete/i.test(text))return 'recovery';
    if(/unresolved alert/i.test(text))return 'alerts';
    if(/active complication/i.test(text))return 'complications';
    if(/pending reconciliation/i.test(text))return 'med-reconciliation';
    if(/Anesthetist sign-off/i.test(text))return 'sign-anesthetist';
    if(/Surgeon sign-off/i.test(text))return 'sign-surgeon';
    if(/ตรวจ Recovery/i.test(text))return 'endConfirmRecovery';
    if(/Anesthesia record/i.test(text))return 'endConfirmRecord';
    if(/Drug \/ Event/i.test(text))return 'endConfirmDrugs';
    if(/report|export/i.test(text))return 'endConfirmPdf';
    return '';
  }
  function runEndAction(action){
    const s=api()?.getState?.()||{};
    if(action==='recovery'){api()?.setTab?.('recovery',{force:true});setTimeout(()=>reveal($('recoveryFocusCompleteBtn')||$('recoveryReadiness')),100);return;}
    if(action==='alerts'){api()?.setTab?.(s.casePhase==='recovery'?'recovery':'orlive',{force:true});setTimeout(()=>reveal($('recoveryProblemsPanel')||q('.or-alert-panel')),100);return;}
    if(action==='complications'){api()?.setTab?.('events',{force:true});setTimeout(()=>reveal(q('.complication-workflow-panel')),100);return;}
    if(action==='med-reconciliation'){window.AnesvetMedicationReconciliation?.focusPending?.()||reveal($('medicationReconciliationPanel'));return;}
    if(action==='sign-anesthetist'){reveal($('signAnesthetistBtn'));return;}
    if(action==='sign-surgeon'){reveal($('signSurgeonBtn'));return;}
    if(action.startsWith('endConfirm')){reveal($(action));}
  }
  function enhanceEndBlockers(){
    const wrap=$('endCaseBlockers');if(!wrap)return;
    qa('.endcase-blocker-chip',wrap).forEach(chip=>{
      if(chip.dataset.uxAction||chip.classList.contains('good'))return;
      const action=inferEndAction(chip.textContent||'');if(!action)return;
      chip.dataset.uxAction=action;chip.classList.add('ux-actionable-blocker');chip.setAttribute('role','button');chip.setAttribute('tabindex','0');
      const run=()=>runEndAction(action);
      chip.addEventListener('click',run);
      chip.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();run();}});
    });
  }

  function ensureSaveAssist(){
    if($('uxSaveAssist'))return $('uxSaveAssist');
    const el=document.createElement('section');
    el.id='uxSaveAssist';el.className='ux-save-assist';el.hidden=true;el.setAttribute('role','status');el.setAttribute('aria-live','polite');
    el.innerHTML='<div><b id="uxSaveAssistTitle">Storage status</b><span id="uxSaveAssistText"></span></div><button id="uxSaveRetryBtn" class="btn" type="button" hidden>ลองบันทึกอีกครั้ง</button>';
    const anchor=$('updateBanner')||$('safetyRecoveryBanner')||q('.topbar');anchor?.insertAdjacentElement('afterend',el);
    $('uxSaveRetryBtn')?.addEventListener('click',()=>{const ok=api()?.save?.({reason:'ux-retry'});setTimeout(updateSaveAssist,40);if(ok===false)api()?.toast?.('ยังบันทึกไม่สำเร็จ — ตรวจพื้นที่จัดเก็บหรือ reload หลังสำรองข้อมูล');});
    return el;
  }
  function showSaveAssist(tone,title,text,retry=false){
    const el=ensureSaveAssist();if(!el)return;el.hidden=false;el.dataset.tone=tone;
    if($('uxSaveAssistTitle'))$('uxSaveAssistTitle').textContent=title;
    if($('uxSaveAssistText'))$('uxSaveAssistText').textContent=text;
    if($('uxSaveRetryBtn'))$('uxSaveRetryBtn').hidden=!retry;
  }
  function updateSaveAssist(){
    const save=$('saveState'),mode=save?.classList.contains('error')?'error':save?.classList.contains('dirty')?'dirty':save?.classList.contains('saving')?'saving':'saved';
    const offline=navigator.onLine===false;
    clearTimeout(dirtyTimer);
    if(mode==='error'){showSaveAssist('danger','บันทึกข้อมูลไม่สำเร็จ','ข้อมูลล่าสุดยังไม่ยืนยันว่าเก็บลงเครื่องแล้ว',true);return;}
    if(offline){showSaveAssist('offline','Offline • ยังทำเคสต่อได้','ANESVET จะบันทึก current case บนอุปกรณ์นี้ต่อไป โดยไม่ต้องใช้อินเทอร์เน็ต',mode==='dirty');return;}
    if(mode==='dirty'){
      dirtyTimer=setTimeout(()=>{const now=$('saveState');if(now?.classList.contains('dirty'))showSaveAssist('warn','ยังมีข้อมูลที่ยังไม่บันทึก','Autosave ใช้เวลานานกว่าปกติ สามารถลองบันทึกซ้ำได้',true);},1800);
      const el=$('uxSaveAssist');if(el)el.hidden=true;return;
    }
    const el=$('uxSaveAssist');if(el)el.hidden=true;
  }

  let lastResumePointerAt=0;
  let shortcutPress=null;
  let rejectShortcutPointerClickUntil=0;
  function resumeActiveCase(source='shortcut'){
    const a=api();if(!a)return false;
    if(typeof a.resumeActiveCase==='function')return a.resumeActiveCase({source});
    const s=a.getState?.()||{},target=s.casePhase==='recovery'?'recovery':'orlive';a.setTab?.(target,{force:true});return true;
  }
  function ensureReturnShortcut(){
    if($('uxReturnCase'))return $('uxReturnCase');
    const btn=document.createElement('button');btn.id='uxReturnCase';btn.type='button';btn.className='ux-return-case session-safe';btn.dataset.resumeActiveCase='1';btn.hidden=true;
    btn.addEventListener('click',e=>{if(!returnShortcutAvailable()||Date.now()-lastResumePointerAt<650||(e.detail>0&&Date.now()<rejectShortcutPointerClickUntil))return;e.preventDefault();e.stopPropagation();resumeActiveCase('shortcut-click')});
    document.body.appendChild(btn);return btn;
  }
  // R06: never allow the global pointer fallback to reach through a real modal,
  // a security lock, a view-only session, or an inert/hidden shortcut.
  function returnShortcutAvailable(){
    const btn=$('uxReturnCase');
    if(!btn||btn.hidden||btn.inert||btn.closest?.('[inert]'))return false;
    if(document.body?.classList?.contains('security-locked')||document.body?.classList?.contains('session-readonly'))return false;
    if($('securityLockOverlay')?.hidden===false||document.querySelector('dialog[open]'))return false;
    return true;
  }
  function pointerInsideReturnShortcut(e){
    const btn=$('uxReturnCase');if(!btn||btn.hidden)return false;let r;try{r=btn.getBoundingClientRect()}catch(_){return false}
    return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom;
  }
  function returnShortcutPointerEligible(e){
    if(!returnShortcutAvailable()||e.isPrimary===false||('button' in e&&e.button!==0))return false;
    if(!pointerInsideReturnShortcut(e))return false;
    const btn=$('uxReturnCase');
    // Coordinates alone are insufficient: an overlay or native dialog can
    // receive the pointer at the exact same screen position as the shortcut.
    if(!(e.target===btn||btn.contains(e.target)))return false;
    const topmost=document.elementFromPoint?.(e.clientX,e.clientY);
    return !!topmost&&(topmost===btn||btn.contains(topmost));
  }
  // R07: pointerup coordinates alone can accept a finger that started on an
  // unrelated control and ended over this floating shortcut (e.g. a swipe).
  // Record a genuine primary press on the *visible* shortcut before accepting
  // the document-level pointerup fallback. Native keyboard clicks still work.
  function rememberShortcutPress(e){
    shortcutPress=null;
    if(!returnShortcutAvailable()||e.isPrimary===false||('button' in e&&e.button!==0))return;
    if(!pointerInsideReturnShortcut(e))return;
    const btn=$('uxReturnCase'),hit=document.elementFromPoint?.(e.clientX,e.clientY);
    if(!(e.target===btn||btn.contains(e.target)))return;
    if(!hit||!(hit===btn||btn.contains(hit)))return;
    shortcutPress={pointerId:e.pointerId,x:e.clientX,y:e.clientY,startedAt:Date.now()};
  }
  function returnShortcutTapEligible(e){
    const start=shortcutPress;
    shortcutPress=null;
    if(!start||start.pointerId!==e.pointerId)return false;
    if(Date.now()-start.startedAt>1500)return false;
    // A scroll/drag is not a tap, even if it ends inside the same button.
    if(Math.hypot(e.clientX-start.x,e.clientY-start.y)>14)return false;
    return returnShortcutPointerEligible(e);
  }
  function handleShortcutPointerEnd(e){
    if(!returnShortcutTapEligible(e)){
      // Browser click synthesis can follow a rejected press; never turn a drag
      // into a resume. Keyboard-triggered click (detail=0) remains unaffected.
      rejectShortcutPointerClickUntil=Date.now()+700;
      return;
    }
    lastResumePointerAt=Date.now();
    if(e.cancelable)e.preventDefault();
    e.stopImmediatePropagation();
    resumeActiveCase('shortcut-pointer-fallback');
  }
  function updateReturnShortcut(){
    const btn=ensureReturnShortcut(),s=api()?.getState?.()||{},page=activePage();
    const active=!!s.caseStartedAt&&!s.caseLocked&&s.casePhase!=='complete';
    const target=s.casePhase==='recovery'?'recovery':'orlive';
    const show=active&&page!==target&&!(page==='endcase'&&s.casePhase==='recovery');
    btn.hidden=!show;if(!show)return;
    const clock=$('caseClock')?.textContent?.trim()||'';
    btn.innerHTML=`<span aria-hidden="true">↩</span><b>กลับ ${target==='recovery'?'Recovery':'OR LIVE'}</b>${clock?`<small>${clock}</small>`:''}`;
    btn.setAttribute('aria-label',`กลับ ${target==='recovery'?'Recovery':'OR LIVE'}${clock?` เวลาเคส ${clock}`:''}`);
  }

  function refresh(){
    enhanceReadiness();enhanceEndBlockers();updateSaveAssist();updateReturnShortcut();
    document.documentElement.classList.add('usability-hardening-v165');
  }
  function boot(){
    ensureSaveAssist();ensureReturnShortcut();
    ['preOrRequiredList','preOrRecommendedList','endCaseBlockers','saveState','caseClock','casePhaseBadge'].forEach(id=>{
      const el=$(id);if(el)new MutationObserver(schedule).observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden']});
    });
    qa('.tabpage').forEach(el=>new MutationObserver(schedule).observe(el,{attributes:true,attributeFilter:['class']}));
    window.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('connectivity',schedule);window.ANESVET_MOBILE_OR_OWNER?.subscribe((view,reason)=>{if(reason==='viewport'&&!view.editing)schedule()});
    document.addEventListener('click',e=>{if(e.target.closest?.('.workflow-tabs,.mobile-workflow-dialog,.mobile-quick-bar,#preOrReadinessDialog,#endcase'))schedule();},true);
    // Android/PWA rescue: allow pointer fallback only when the real shortcut is the topmost tap target.
    // Never capture another control by coordinates or bypass the lock, modal, or view-only safeguards.
    document.addEventListener('pointerdown',rememberShortcutPress,true);
    document.addEventListener('pointercancel',()=>{shortcutPress=null;rejectShortcutPointerClickUntil=Date.now()+700;},true);
    document.addEventListener('pointerup',handleShortcutPointerEnd,true);
    refresh();
  }
  window.ANESVET_LIFECYCLE_COORDINATOR?.ready(boot);
})();
