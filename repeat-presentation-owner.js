/* ANESVET V17.10.7 — single presentation owner for Recovery → End Case / repeat-use state. */
(function(root){
'use strict';
const VERSION='17.10.7',$=id=>document.getElementById(id),app=()=>root.AnesvetApp||null,state=()=>app()?.getState?.()||null;
let pending=false,observer=null;
function working(s){return !!s?.caseStartedAt&&!s?.caseLocked}
function phaseName(s){if(s?.recoveryCompletedAt||s?.casePhase==='complete')return'End Case';if(s?.casePhase==='recovery'||s?.recoveryStartedAt)return'Recovery';return'OR LIVE'}
function repaint(){
 const s=state();if(!s)return;
 const done=!!s.recoveryCompletedAt,locked=!!s.caseLocked,patient=(s.patientName||$('patientName')?.value||'').trim();
 ['r25ResumeFromPatient','r25ResumeFromSummary','r25ResumeFromCases'].forEach(id=>{const b=$(id);if(!b)return;b.hidden=!working(s);if(working(s)){const n=phaseName(s);b.textContent='↩ กลับไป '+n;b.title=`กลับเข้าสู่ ${n}${patient?' — '+patient:''} (ไม่เริ่มหรือจบเคสอัตโนมัติ)`}});
 $('endCaseFastFinish')?.classList.toggle('r25-case-locked',locked);$('endCaseFastFinish')?.classList.toggle('r26-sealed',locked);$('recoveryExitCard')?.classList.toggle('r25-done',done);
 document.body.classList.toggle('r24-recovery-finished',done);$('endcase')?.classList.toggle('r24-case-locked',locked);$('endcase')?.classList.toggle('r24-case-unlocked',!locked);
 if($('endCaseQuickIdentity'))$('endCaseQuickIdentity').textContent=[s.patientName||$('patientName')?.value||'ผู้ป่วยยังไม่ได้ระบุ',s.hospitalId?'HN '+s.hospitalId:''].filter(Boolean).join(' • ');
 const card=$('recoveryExitCard'),title=$('recoveryExitTitle'),note=$('recoveryExitNote'),go=$('recoveryToEndCaseBtn');
 card?.classList.toggle('r24-recovery-done',done);
 if(title)title.textContent=done?'✓ Recovery complete — ไปปิดเคส':'เปิด End Case เพื่อตรวจรายการได้ทันที';
 if(note)note.textContent=done?'ไปตรวจ Medication, Sign-off และ Final checklist ก่อน Lock & Archive':'ยังบันทึก Recovery ต่อได้ และยัง Final Lock ไม่ได้จนกว่า Recovery จะ complete';
 if(go)go.textContent=done?'→ ไป End Case / Final Review':'→ ตรวจ End Case';
 const progress=$('endCaseNextTaskBtn'),next=progress?.dataset.action||'',ready=next==='finalize',card2=$('endCaseFastFinish'),title2=$('endCaseFastFinishTitle'),note2=$('endCaseFastFinishNote'),go2=$('endCaseFastFinishBtn');
 card2?.classList.toggle('r24-ready',ready);
 if(locked){if(title2)title2.textContent='เคสถูก Final Lock แล้ว';if(note2)note2.textContent='ตรวจ Archive verification ก่อนเริ่มเคสใหม่';if(go2)go2.textContent=progress?.textContent?.trim()||'ตรวจ Archive'}
 else if(ready){if(title2)title2.textContent='✓ พร้อม End Case';if(note2)note2.textContent='ตรวจครบแล้ว • กดยืนยันเพื่อ Lock, Archive และ Verify';if(go2)go2.textContent='✓ End, Lock & Archive'}
 else{if(title2)title2.textContent='ยังมีรายการที่ต้องตรวจ';if(note2)note2.textContent=progress?.textContent?.trim()||'ตรวจ Recovery, Medication และ Final Sign-off';if(go2)go2.textContent='→ ทำรายการถัดไป'}
 const row=$('r26NextCase');if(row)row.hidden=!locked;
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;repaint()})}
function bind(){
 if(bind.done)return;bind.done=true;
 observer=new MutationObserver(schedule);
 ['casePhaseBadge','timerStateBadge','recoveryPhaseBadge','recoveryFocusReadiness','endCaseNextTaskBtn','endCaseReadiness','endRecoveryStatus'].forEach(id=>{const el=$(id);if(el)observer.observe(el,{subtree:true,attributes:true,childList:true,characterData:true})});
 document.addEventListener('click',e=>{if(e.target.closest?.('#recovery,#endcase,#casesummary,#patient,#cases,.workflow-tabs,.mobile-workflow-dialog,[data-mobile-tab="recovery"],[data-mobile-tab="endcase"]'))schedule()},true);
 document.addEventListener('change',e=>{if(e.target.closest?.('#endcase,#recovery,#patient'))schedule()},true);
 $('recoveryToEndCaseBtn')?.addEventListener('click',()=>{root.AnesvetApp?.setTab?.('endcase')});
 $('endCaseFastFinishBtn')?.addEventListener('click',()=>{$('endCaseNextTaskBtn')?.click()});
 root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('final-archive-status',schedule);root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',schedule);schedule();
}
const api=Object.freeze({version:VERSION,bind,schedule,repaint});root.ANESVET_REPEAT_PRESENTATION_OWNER=api;root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
