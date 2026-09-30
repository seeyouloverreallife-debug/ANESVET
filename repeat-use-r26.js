/* ANESVET 17.2.30 R26 — Repeat-use path polish. UI only.
 * Never creates/locks/resets a case itself; forwards to existing gated native actions.
 */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const state=()=>window.AnesvetApp?.getState?.()||null;
  const active=id=>$(id)?.classList.contains('active');
  const RECOVERY_ENTRY=['recHR','recRR','recMAP','recSpO2','recTemp','recMentation'];

  function buildNextCase(){
    const panel=$('endCaseFastFinish');
    if(!panel||$('r26NextCase'))return;
    const row=document.createElement('div');
    row.id='r26NextCase';row.className='r26-next-case';row.hidden=true;
    const copy=document.createElement('div');
    copy.innerHTML='<b>เคสนี้ปิดแล้ว</b><small>เริ่มเคสถัดไปโดยใช้ขั้นตอนตรวจสอบ Archive เดิม</small>';
    const button=document.createElement('button');
    button.type='button';button.id='r26NextCaseButton';button.className='btn primary';
    button.textContent='＋ เริ่มเคสใหม่';
    button.setAttribute('aria-label','เริ่มเคสใหม่หลัง Final Lock และตรวจสอบ Archive');
    button.addEventListener('click',()=>{
      // Native handler is the only code allowed to verify archives and reset the case.
      if(!state()?.caseLocked)return;
      $('newCaseBtn')?.click();
    });
    row.append(copy,button);panel.insertAdjacentElement('afterend',row);
  }

  function repaint(){
    const s=state();if(!s)return;
    const done=!!s.caseLocked, row=$('r26NextCase');
    if(row)row.hidden=!done;
    // Do not conceal archive verification or safety blockers after Final Lock.
    $('endCaseFastFinish')?.classList.toggle('r26-sealed',done);
  }

  function recoveryEntryIsAllowed(el){
    if(!el||el.disabled||!active('recovery'))return false;
    // Do not navigate to fields hidden by N/A or a collapsed ancestor.
    return el.getClientRects().length>0;
  }
  function nextRecoveryField(current){
    const i=RECOVERY_ENTRY.indexOf(current);if(i<0)return null;
    for(let j=i+1;j<RECOVERY_ENTRY.length;j++){
      const next=$(RECOVERY_ENTRY[j]);if(recoveryEntryIsAllowed(next))return next;
    }
    return recoveryEntryIsAllowed($('recordRecoveryVitalsBtn'))?$('recordRecoveryVitalsBtn'):null;
  }
  function onRecoveryKey(e){
    if(!RECOVERY_ENTRY.includes(e.target?.id))return;
    if(!active('recovery')||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)return;
    if(e.key!=='Enter'&&e.key!=='NumpadEnter')return;
    const next=nextRecoveryField(e.target.id);if(!next)return;
    e.preventDefault();
    // Only focus: never submit/auto-click a record or change N/A/clinical values.
    try{next.focus({preventScroll:true})}catch(_){next.focus()}
    if(next.id==='recordRecoveryVitalsBtn') next.scrollIntoView?.({block:'nearest'});
  }

  let pending=false;
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;repaint()})}
  function boot(){
    buildNextCase();repaint();
    document.addEventListener('keydown',onRecoveryKey,true);
    ['endCaseReadiness','endCaseFastFinishTitle','endRecoveryStatus'].forEach(id=>{
      const el=$(id);if(el)new MutationObserver(schedule).observe(el,{subtree:true,childList:true,characterData:true});
    });
    document.addEventListener('anesvet:final-archive-status',schedule);
    document.addEventListener('click',e=>{
      if(e.target.closest?.('#endcase,#recovery,#cases,.workflow-tabs'))schedule();
    },true);
    window.addEventListener('pageshow',schedule);
    // Native record action remains explicit. Make the action's consequence clear.
    const save=$('recordRecoveryVitalsBtn');if(save){
      save.title='บันทึกค่าที่กรอก (Enter จากช่องสุดท้ายจะเลื่อนมาที่ปุ่มนี้ แต่ไม่บันทึกให้อัตโนมัติ)';
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
