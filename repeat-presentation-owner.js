/* ANESVET V17.13.3 — single presentation owner for Recovery → End Case / repeat-use state. */
(function(root){
'use strict';
const VERSION='17.13.3',$=id=>document.getElementById(id),app=()=>root.AnesvetApp||null,state=()=>app()?.getState?.()||null;
const active=id=>$(id)?.classList.contains('active');
const RECOVERY_ENTRY=['recHR','recRR','recMAP','recSpO2','recTemp','recMentation'];
let pending=false,observer=null;
let lastResumePointerAt=0,shortcutPress=null,rejectShortcutPointerClickUntil=0;
function activePage(){return document.querySelector('.tabpage.active')?.id||''}
function resumeActiveCase(source='repeat-shortcut'){const a=app();if(!a)return false;if(typeof a.resumeActiveCase==='function')return a.resumeActiveCase({source});const s=state()||{},target=s.casePhase==='recovery'?'recovery':'orlive';a.setTab?.(target,{force:true});return true}
function ensureReturnShortcut(){if($('uxReturnCase'))return $('uxReturnCase');const btn=document.createElement('button');btn.id='uxReturnCase';btn.type='button';btn.className='ux-return-case session-safe';btn.dataset.resumeActiveCase='1';btn.hidden=true;btn.addEventListener('click',e=>{if(!returnShortcutAvailable()||Date.now()-lastResumePointerAt<650||(e.detail>0&&Date.now()<rejectShortcutPointerClickUntil))return;e.preventDefault();e.stopPropagation();resumeActiveCase('repeat-shortcut-click')});document.body.appendChild(btn);return btn}
function returnShortcutAvailable(){const btn=$('uxReturnCase');if(!btn||btn.hidden||btn.inert||btn.closest?.('[inert]'))return false;if(document.body?.classList?.contains('security-locked')||document.body?.classList?.contains('session-readonly'))return false;if($('securityLockOverlay')?.hidden===false||document.querySelector('dialog[open]'))return false;return true}
function pointerInsideReturnShortcut(e){const btn=$('uxReturnCase');if(!btn||btn.hidden)return false;let r;try{r=btn.getBoundingClientRect()}catch(_){return false}return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom}
function rememberShortcutPress(e){shortcutPress=null;if(!returnShortcutAvailable()||e.isPrimary===false||('button'in e&&e.button!==0)||!pointerInsideReturnShortcut(e))return;const btn=$('uxReturnCase'),hit=document.elementFromPoint?.(e.clientX,e.clientY);if(!(e.target===btn||btn.contains(e.target))||!hit||!(hit===btn||btn.contains(hit)))return;shortcutPress={pointerId:e.pointerId,x:e.clientX,y:e.clientY,startedAt:Date.now()}}
function returnShortcutTapEligible(e){const start=shortcutPress;shortcutPress=null;if(!start||start.pointerId!==e.pointerId||Date.now()-start.startedAt>1500||Math.hypot(e.clientX-start.x,e.clientY-start.y)>14)return false;if(!returnShortcutAvailable()||e.isPrimary===false||('button'in e&&e.button!==0)||!pointerInsideReturnShortcut(e))return false;const btn=$('uxReturnCase'),hit=document.elementFromPoint?.(e.clientX,e.clientY);return !!hit&&(e.target===btn||btn.contains(e.target))&&(hit===btn||btn.contains(hit))}
function handleShortcutPointerEnd(e){if(!returnShortcutTapEligible(e)){rejectShortcutPointerClickUntil=Date.now()+700;return}lastResumePointerAt=Date.now();if(e.cancelable)e.preventDefault();e.stopImmediatePropagation();resumeActiveCase('repeat-shortcut-pointer')}
function updateReturnShortcut(){const btn=ensureReturnShortcut(),s=state()||{},page=activePage(),isWorking=!!s.caseStartedAt&&!s.caseLocked&&s.casePhase!=='complete',target=s.casePhase==='recovery'?'recovery':'orlive',show=isWorking&&page!==target&&!(page==='endcase'&&s.casePhase==='recovery');btn.hidden=!show;if(!show)return;const clock=$('caseClock')?.textContent?.trim()||'';btn.innerHTML=`<span aria-hidden="true">↩</span><b>กลับ ${target==='recovery'?'Recovery':'OR LIVE'}</b>${clock?`<small>${clock}</small>`:''}`;btn.setAttribute('aria-label',`กลับ ${target==='recovery'?'Recovery':'OR LIVE'}${clock?` เวลาเคส ${clock}`:''}`)}
function working(s){return !!s?.caseStartedAt&&!s?.caseLocked}

function createReturnButton(id,container){
 if(!container||$(id))return;
 const btn=document.createElement('button');btn.type='button';btn.id=id;btn.className='btn r25-resume-action';btn.hidden=true;btn.setAttribute('aria-label','กลับเข้าเคสการวางยาที่กำลังดำเนินอยู่');
 btn.addEventListener('click',()=>{const s=state();if(!working(s))return;app()?.resumeActiveCase?.({source:'repeat-presentation-owner'})});container.insertBefore(btn,container.firstChild);
}
function installReturnActions(){
 createReturnButton('r25ResumeFromPatient',document.querySelector('#patient .patient-hero .page-help-actions'));
 createReturnButton('r25ResumeFromSummary',document.querySelector('#casesummary .case-summary-page .section-heading .button-row'));
 createReturnButton('r25ResumeFromCases',document.querySelector('#cases .section-heading .button-row'));
}
function simplifyFinalReview(){
 const orig=$('endCaseEfficiencyCard'),main=$('endCaseFastFinish');if(!orig||!main||$('r25FinalReviewDetails'))return;
 if(orig.parentNode&&main.parentNode===orig.parentNode)orig.parentNode.insertBefore(main,orig);
 const detail=document.createElement('details');detail.id='r25FinalReviewDetails';detail.className='r25-review-details';const summary=document.createElement('summary');summary.textContent='ดูรายการตรวจทั้งหมดและ Focus pending';detail.appendChild(summary);
 if(orig.parentNode){orig.parentNode.insertBefore(detail,orig);detail.appendChild(orig)}
 const blockers=$('endCaseBlockers');if(blockers){blockers.classList.add('r25-visible-blockers');main.insertAdjacentElement('afterend',blockers)}
}
function reduceSummaryChoiceOverload(){
 const group=document.querySelector('#casesummary .case-summary-page .section-heading .button-row');if(!group||$('r25CaseSummaryExtras'))return;
 const detail=document.createElement('details');detail.id='r25CaseSummaryExtras';detail.className='r25-summary-extras';const summary=document.createElement('summary');summary.textContent='แก้ไข / เมนูอื่น';detail.appendChild(summary);
 const tools=document.createElement('div');tools.className='r25-extras-tools';['editPatientBtn','openPreopBtn'].forEach(id=>{const btn=$(id);if(btn)tools.appendChild(btn)});detail.appendChild(tools);group.appendChild(detail);
}
function buildNextCase(){
 const panel=$('endCaseFastFinish');if(!panel||$('r26NextCase'))return;
 const row=document.createElement('div');row.id='r26NextCase';row.className='r26-next-case';row.hidden=true;const copy=document.createElement('div');copy.innerHTML='<b>เคสนี้ปิดแล้ว</b><small>เริ่มเคสถัดไปโดยใช้ขั้นตอนตรวจสอบ Archive เดิม</small>';
 const button=document.createElement('button');button.type='button';button.id='r26NextCaseButton';button.className='btn primary';button.textContent='＋ เริ่มเคสใหม่';button.setAttribute('aria-label','เริ่มเคสใหม่หลัง Final Lock และตรวจสอบ Archive');button.addEventListener('click',()=>{if(!state()?.caseLocked)return;$('newCaseBtn')?.click()});row.append(copy,button);panel.insertAdjacentElement('afterend',row);
}
function recoveryEntryIsAllowed(el){return !!el&&!el.disabled&&active('recovery')&&el.getClientRects().length>0}
function nextRecoveryField(current){const i=RECOVERY_ENTRY.indexOf(current);if(i<0)return null;for(let j=i+1;j<RECOVERY_ENTRY.length;j++){const next=$(RECOVERY_ENTRY[j]);if(recoveryEntryIsAllowed(next))return next}return recoveryEntryIsAllowed($('recordRecoveryVitalsBtn'))?$('recordRecoveryVitalsBtn'):null}
function onRecoveryKey(e){if(!RECOVERY_ENTRY.includes(e.target?.id)||!active('recovery')||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||(e.key!=='Enter'&&e.key!=='NumpadEnter'))return;const next=nextRecoveryField(e.target.id);if(!next)return;e.preventDefault();try{next.focus({preventScroll:true})}catch(_){next.focus()}if(next.id==='recordRecoveryVitalsBtn')next.scrollIntoView?.({block:'nearest'})}
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
 const row=$('r26NextCase');if(row)row.hidden=!locked;updateReturnShortcut();
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;repaint()})}
function bind(){
 if(bind.done)return;bind.done=true;
 installReturnActions();simplifyFinalReview();reduceSummaryChoiceOverload();buildNextCase();ensureReturnShortcut();
 document.addEventListener('keydown',onRecoveryKey,true);const recoverySave=$('recordRecoveryVitalsBtn');if(recoverySave)recoverySave.title='บันทึกค่าที่กรอก (Enter จากช่องสุดท้ายจะเลื่อนมาที่ปุ่มนี้ แต่ไม่บันทึกให้อัตโนมัติ)';
 document.addEventListener('pointerdown',rememberShortcutPress,true);document.addEventListener('pointercancel',()=>{shortcutPress=null;rejectShortcutPointerClickUntil=Date.now()+700},true);document.addEventListener('pointerup',handleShortcutPointerEnd,true);
 observer=new MutationObserver(schedule);
 ['casePhaseBadge','timerStateBadge','caseClock','recoveryPhaseBadge','recoveryFocusReadiness','endCaseNextTaskBtn','endCaseReadiness','endRecoveryStatus'].forEach(id=>{const el=$(id);if(el)observer.observe(el,{subtree:true,attributes:true,childList:true,characterData:true})});
 document.querySelectorAll('.tabpage').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class']}));
 document.addEventListener('click',e=>{if(e.target.closest?.('#recovery,#endcase,#casesummary,#patient,#cases,.workflow-tabs,.mobile-workflow-dialog,[data-mobile-tab="recovery"],[data-mobile-tab="endcase"]'))schedule()},true);
 document.addEventListener('change',e=>{if(e.target.closest?.('#endcase,#recovery,#patient'))schedule()},true);
 $('recoveryToEndCaseBtn')?.addEventListener('click',()=>{root.AnesvetApp?.setTab?.('endcase')});
 $('endCaseFastFinishBtn')?.addEventListener('click',()=>{$('endCaseNextTaskBtn')?.click()});
 root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('final-archive-status',schedule);root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',schedule);root.ANESVET_MOBILE_OR_OWNER?.subscribe?.((view,reason)=>{if(reason==='viewport'&&!view.editing)schedule()});schedule();
}
const api=Object.freeze({version:VERSION,bind,schedule,repaint});root.ANESVET_REPEAT_PRESENTATION_OWNER=api;root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
