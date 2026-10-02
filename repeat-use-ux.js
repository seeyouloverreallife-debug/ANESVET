/* ANESVET R25 | Return-to-work UX. UI-only. All clinical state and safety gates stay native. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const api=()=>window.AnesvetApp||null;
 const caseState=()=>api()?.getState?.()||null;
 const isWorking=s=>!!s?.caseStartedAt&&!s?.caseLocked;
 const phaseName=s=>{
   if(s?.recoveryCompletedAt||s?.casePhase==='complete')return 'End Case';
   if(s?.casePhase==='recovery'||s?.recoveryStartedAt)return 'Recovery';
   return 'OR LIVE';
 };
 function createReturnButton(id,container){
   if(!container||$(id))return;
   const btn=document.createElement('button');btn.type='button';btn.id=id;
   btn.className='btn r25-resume-action';btn.hidden=true;
   btn.setAttribute('aria-label','กลับเข้าเคสการวางยาที่กำลังดำเนินอยู่');
   btn.addEventListener('click',()=>{
     const s=caseState();if(!isWorking(s))return;
     // Native rescue enforces identity lock, session, and clinical workspace routing.
     api()?.resumeActiveCase?.({source:'r25-ux-resume'});
   });
   container.insertBefore(btn,container.firstChild);
 }
 function installReturnActions(){
   createReturnButton('r25ResumeFromPatient',document.querySelector('#patient .patient-hero .page-help-actions'));
   createReturnButton('r25ResumeFromSummary',document.querySelector('#casesummary .case-summary-page .section-heading .button-row'));
   createReturnButton('r25ResumeFromCases',document.querySelector('#cases .section-heading .button-row'));
 }
 function simplifyFinalReview(){
   const page=$('endcase'),orig=$('endCaseEfficiencyCard'),main=$('endCaseFastFinish');
   if(!page||!orig||!main||$('r25FinalReviewDetails'))return;
   // Main R24 CTA remains authoritative and delegates to the native R25/R24 safety checks.
   orig.parentNode.insertBefore(main,orig);
   const detail=document.createElement('details');detail.id='r25FinalReviewDetails';
   detail.className='r25-review-details';
   const summary=document.createElement('summary');
   summary.textContent='ดูรายการตรวจทั้งหมดและ Focus pending';
   detail.appendChild(summary);
   orig.parentNode.insertBefore(detail,orig);detail.appendChild(orig);
   // Keep all blocker chips in the visible safety review, not inside the collapsed details.
   const blockers=$('endCaseBlockers');
   if(blockers){blockers.classList.add('r25-visible-blockers');main.insertAdjacentElement('afterend',blockers);}
   // The sign-off/reconciliation panels remain visible. Nothing clinical is auto-approved.
 }
 function reduceSummaryChoiceOverload(){
   const group=document.querySelector('#casesummary .case-summary-page .section-heading .button-row');
   if(!group||$('r25CaseSummaryExtras'))return;
   const detail=document.createElement('details');detail.id='r25CaseSummaryExtras';
   detail.className='r25-summary-extras';
   const summary=document.createElement('summary');summary.textContent='แก้ไข / เมนูอื่น';detail.appendChild(summary);
   const tools=document.createElement('div');tools.className='r25-extras-tools';
   // Navigation controls only. Keep native Start, OR LIVE and Pause accessible.
   ['editPatientBtn','openPreopBtn'].forEach(id=>{const btn=$(id);if(btn)tools.appendChild(btn)});
   detail.appendChild(tools);group.appendChild(detail);
 }
 function update(){window.ANESVET_REPEAT_PRESENTATION_OWNER?.schedule?.();}
 let scheduled=false;
 function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;update();});}
 function boot(){installReturnActions();simplifyFinalReview();reduceSummaryChoiceOverload();update();}
 window.ANESVET_LIFECYCLE_COORDINATOR?.ready(boot);
})();
