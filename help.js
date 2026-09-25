/* ANESVET V15.19.0 — Help Center, contextual help, and first-use onboarding. */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const $$=sel=>[...document.querySelectorAll(sel)];
const ONBOARDING_KEY='anesvet_help_onboarding_v1_dismissed';
const CURRENT_KEY='anesvet_v14_3_current';
const ARCHIVE_KEY='anesvet_v14_3_archive_legacy';

const walkthrough=[
  {
    icon:'🩺',
    title:'เริ่มเคสจาก Patient → Pre-check',
    text:'ตรวจผู้ป่วย, Current BW, procedure และทีมให้ถูกต้องก่อน แล้วบันทึก Physical exam + Risk review + Checklist ข้อมูลนี้จะตามไปในทุกช่วงของเคส'
  },
  {
    icon:'💉',
    title:'วางแผนยา แล้วทบทวน Briefing',
    text:'Drug Calculator ช่วยคำนวณและสร้าง Case Drug Plan แต่ Planned dose ยังไม่ใช่ Actual administered จากนั้น Pre-OR Briefing จะสรุปความเสี่ยงและสิ่งที่ควรเตรียมก่อนเข้า OR'
  },
  {
    icon:'📈',
    title:'OR LIVE ใช้ VITALS เป็นงานหลัก',
    text:'ระหว่างวางยาใช้ VITALS / RECORD NOW เป็นหลัก, NEXT STEP สำหรับ milestone และ MORE สำหรับยา, airway, fluid/blood หรือ event/problem ตาม phase'
  },
  {
    icon:'🌙',
    title:'Recovery → End Case → Report',
    text:'ติดตาม recovery จนพร้อมส่งต่อ/complete แล้วทบทวน End Case และ Final Sign-off หากพบปัญหากด Report ได้จาก Mobile Quick Bar หรือ MORE โดยไม่ต้องออกจากเคส'
  }
];
let walkIndex=0;

function safeShow(dialog){
  if(!dialog)return;
  try{if(!dialog.open)dialog.showModal()}catch(e){dialog.setAttribute('open','')}
}
function safeClose(dialog){
  if(!dialog)return;
  try{if(dialog.open)dialog.close();else dialog.removeAttribute('open')}catch(e){dialog.removeAttribute('open')}
}
function closeOtherMenus(){
  const more=$('moreMenu');if(more)more.hidden=true;
  safeClose($('mobileWorkflowDialog'));
  safeClose($('orMoreDialog'));
  safeClose($('recoveryMoreDialog'));
}
function openHelp(topic=''){
  closeOtherMenus();
  const d=$('helpCenterDialog');
  safeShow(d);
  if(topic){
    setTimeout(()=>focusTopic(topic),50);
  }
}
function closeHelp(){safeClose($('helpCenterDialog'))}
function topicElement(topic){return document.querySelector(`[data-help-section="${CSS.escape(topic)}"]`)}
function focusTopic(topic){
  const section=topicElement(topic);if(!section)return;
  if(section.tagName==='DETAILS')section.open=true;
  $$('.help-topics details').forEach(d=>{if(d!==section&&d.open)d.open=false});
  try{section.scrollIntoView({behavior:'smooth',block:'start'})}catch(e){section.scrollIntoView()}
  section.classList.add('help-topic-highlight');
  setTimeout(()=>section.classList.remove('help-topic-highlight'),1300);
}
function gotoTab(tab){
  closeHelp();
  safeClose($('onboardingDialog'));
  const safe=String(tab).replace(/[^a-z0-9_-]/gi,'');
  const btn=document.querySelector(`[data-tab="${safe}"],[data-more-tab="${safe}"],[data-mobile-tab="${safe}"]`);
  if(btn){btn.click();setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),80)}
}
function openReportFromHelp(){
  closeHelp();
  safeClose($('onboardingDialog'));
  const b=$('pilotFeedbackBtn')||$('mobileQuickReportBtn');
  if(b)b.click();
}
function renderWalkthrough(){
  const x=walkthrough[walkIndex];
  if(!x)return;
  if($('onboardingStepLabel'))$('onboardingStepLabel').textContent=`${walkIndex+1} / ${walkthrough.length}`;
  if($('onboardingIcon'))$('onboardingIcon').textContent=x.icon;
  if($('onboardingTitle'))$('onboardingTitle').textContent=x.title;
  if($('onboardingText'))$('onboardingText').textContent=x.text;
  if($('onboardingBackBtn'))$('onboardingBackBtn').disabled=walkIndex===0;
  if($('onboardingNextBtn'))$('onboardingNextBtn').textContent=walkIndex===walkthrough.length-1?'เข้าใจแล้ว ✓':'ถัดไป →';
  if($('onboardingDots'))$('onboardingDots').innerHTML=walkthrough.map((_,i)=>`<span class="${i===walkIndex?'active':''}"></span>`).join('');
}
function openWalkthrough({replay=false}={}){
  closeHelp();closeOtherMenus();
  walkIndex=0;renderWalkthrough();safeShow($('onboardingDialog'));
  if(replay)$('onboardingDialog')?.setAttribute('data-replay','true');else $('onboardingDialog')?.removeAttribute('data-replay');
}
function dismissWalkthrough(){
  try{localStorage.setItem(ONBOARDING_KEY,'1')}catch(e){}
  safeClose($('onboardingDialog'));
}
function walkthroughNext(){
  if(walkIndex>=walkthrough.length-1){dismissWalkthrough();return}
  walkIndex++;renderWalkthrough();
}
function walkthroughBack(){if(walkIndex>0){walkIndex--;renderWalkthrough()}}
function currentLooksMeaningful(){
  try{
    const c=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null');
    if(c&&(c.patientSaved||c.caseStartedAt||c.patientName||c.hospitalId||(c.records||[]).length||(c.drugAdministrations||[]).length))return true;
  }catch(e){}
  try{
    const a=JSON.parse(localStorage.getItem(ARCHIVE_KEY)||'[]');
    if(Array.isArray(a)&&a.length)return true;
  }catch(e){}
  return false;
}
function maybeAutoOnboard(){
  let dismissed=false;try{dismissed=localStorage.getItem(ONBOARDING_KEY)==='1'}catch(e){}
  if(dismissed||currentLooksMeaningful())return;
  setTimeout(()=>{
    if(document.querySelector('dialog[open]'))return;
    openWalkthrough();
  },900);
}
function init(){
  $('openHelpCenterBtn')?.addEventListener('click',()=>openHelp());
  $('mobileHelpCenterBtn')?.addEventListener('click',()=>openHelp());
  $('orMoreHelpBtn')?.addEventListener('click',()=>openHelp('orlive'));
  $('recoveryMoreHelpBtn')?.addEventListener('click',()=>openHelp('recovery'));
  $('helpCenterCloseBtn')?.addEventListener('click',closeHelp);
  $('helpCenterCloseBottomBtn')?.addEventListener('click',closeHelp);
  $('helpCenterDialog')?.addEventListener('click',e=>{if(e.target===$('helpCenterDialog'))closeHelp()});
  $('startWalkthroughBtn')?.addEventListener('click',()=>openWalkthrough({replay:true}));
  $('helpReportIssueBtn')?.addEventListener('click',openReportFromHelp);
  $('helpOpenSettingsBtn')?.addEventListener('click',()=>gotoTab('settings'));
  $$('[data-help-topic]').forEach(b=>b.addEventListener('click',()=>openHelp(b.dataset.helpTopic||'')));
  $$('[data-help-go]').forEach(b=>b.addEventListener('click',()=>gotoTab(b.dataset.helpGo)));
  $('onboardingSkipBtn')?.addEventListener('click',dismissWalkthrough);
  $('onboardingCloseBtn')?.addEventListener('click',dismissWalkthrough);
  $('onboardingBackBtn')?.addEventListener('click',walkthroughBack);
  $('onboardingNextBtn')?.addEventListener('click',walkthroughNext);
  $('onboardingDialog')?.addEventListener('click',e=>{if(e.target===$('onboardingDialog'))dismissWalkthrough()});
  maybeAutoOnboard();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
window.AnesvetHelp=Object.freeze({open:openHelp,walkthrough:()=>openWalkthrough({replay:true})});
})();
