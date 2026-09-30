/* R24 | Presentation/controller bridge. Uses existing clinical safety-gated actions. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const getCase=()=>window.AnesvetApp?.getState?.()||null;
function repaint(){
  const s=getCase();if(!s)return;
  const done=!!s.recoveryCompletedAt,locked=!!s.caseLocked;
  document.body.classList.toggle('r24-recovery-finished',done);
  $('endcase')?.classList.toggle('r24-case-locked',locked);
  $('endcase')?.classList.toggle('r24-case-unlocked',!locked);
  if($('endCaseQuickIdentity'))$('endCaseQuickIdentity').textContent=[s.patientName||$('patientName')?.value||'ผู้ป่วยยังไม่ได้ระบุ',s.hospitalId?'HN '+s.hospitalId:''].filter(Boolean).join(' • ');
  const card=$('recoveryExitCard'),title=$('recoveryExitTitle'),note=$('recoveryExitNote'),go=$('recoveryToEndCaseBtn');
  if(card)card.classList.toggle('r24-recovery-done',done);
  if(title)title.textContent=done?'✓ Recovery complete — ไปปิดเคส':'เปิด End Case เพื่อตรวจรายการได้ทันที';
  if(note)note.textContent=done?'ไปตรวจ Medication, Sign-off และ Final checklist ก่อน Lock & Archive':'ยังบันทึก Recovery ต่อได้ และยัง Final Lock ไม่ได้จนกว่า Recovery จะ complete';
  if(go)go.textContent=done?'→ ไป End Case / Final Review':'→ ตรวจ End Case';
  const progress=$('endCaseNextTaskBtn');const next=progress?.dataset.action||'';
  const card2=$('endCaseFastFinish'),title2=$('endCaseFastFinishTitle'),note2=$('endCaseFastFinishNote'),go2=$('endCaseFastFinishBtn');
  const ready=next==='finalize';
  if(card2)card2.classList.toggle('r24-ready',ready);
  if(locked){
    if(title2)title2.textContent='เคสถูก Final Lock แล้ว';
    if(note2)note2.textContent='ตรวจ Archive verification ก่อนเริ่มเคสใหม่';
    if(go2)go2.textContent=progress?.textContent?.trim()||'ตรวจ Archive';
  }else if(ready){
    if(title2)title2.textContent='✓ พร้อม End Case';
    if(note2)note2.textContent='ตรวจครบแล้ว • กดยืนยันเพื่อ Lock, Archive และ Verify';
    if(go2)go2.textContent='✓ End, Lock & Archive';
  }else{
    if(title2)title2.textContent='ยังมีรายการที่ต้องตรวจ';
    if(note2)note2.textContent=progress?.textContent?.trim()||'ตรวจ Recovery, Medication และ Final Sign-off';
    if(go2)go2.textContent='→ ทำรายการถัดไป';
  }
}
$('recoveryToEndCaseBtn')?.addEventListener('click',()=>{
  // Navigation only. No implicit Recovery completion, sign-off, or lock.
  window.AnesvetApp?.setTab?.('endcase');
});
$('endCaseFastFinishBtn')?.addEventListener('click',()=>{
  // Delegate to native guided task/finalization handler with its hard safety checks.
  $('endCaseNextTaskBtn')?.click();
});
let pending=false;
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;repaint()})}
const observer=new MutationObserver(schedule);
for(const id of ['recoveryPhaseBadge','recoveryFocusReadiness','endCaseNextTaskBtn','endCaseReadiness']){
  const el=$(id);if(el)observer.observe(el,{subtree:true,attributes:true,childList:true,characterData:true});
}
document.addEventListener('click',e=>{
  if(e.target.closest?.('#recovery,#endcase,.workflow-tabs,[data-mobile-tab="recovery"],[data-mobile-tab="endcase"]'))schedule();
},true);
document.addEventListener('change',e=>{if(e.target.closest?.('#recovery,#endcase'))schedule()},true);
document.addEventListener('anesvet:final-archive-status',schedule);
window.addEventListener('pageshow',schedule);
schedule();
})();
