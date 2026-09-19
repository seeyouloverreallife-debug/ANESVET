(async() => {
'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const CURRENT_KEY = 'anesvet_v14_3_current';
const ARCHIVE_KEY = 'anesvet_v14_3_archive_legacy';
const TAB_KEY = 'anesvet_v14_3_tab';
const SETTINGS_KEY='anesvet_v14_3_settings';
const DRUG_LIBRARY_KEY='anesvet_v14_3_drug_library';
const QUICK_PRESET_KEY='anesvet_v14_3_quick_presets';
const ALERT_PREF_KEY='anesvet_due_alert_feedback';
const PROTOCOL_AUDIT_KEY='anesvet_v14_3_protocol_audit';
const LAST_BACKUP_KEY='anesvet_v14_3_last_backup';
const BREED_ALIAS_KEY='anesvet_v14_3_breed_aliases';
const PATIENT_FALLBACK_KEY='anesvet_v14_3_patients_fallback';
const SESSION_LOCK_KEY='anesvet_v14_3_active_session';
const SESSION_TAB_KEY='anesvet_session_tab_id';
const SESSION_TTL_MS=30000;
const SESSION_HEARTBEAT_MS=5000;
const DB_NAME='ANESVET_DB';
const DB_VERSION=2;

const numericFields = ['weight','hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal','recHR','recRR','recMAP','recSpO2','recTemp'];
const dataFields = [
  'patientName','hospitalId','visitId','patientMasterId','species','sex','reproductiveStatus','microchip','breed','weight','age','birthDate','birthDateEstimated','ageSource','estimatedBirthPeriod','approxAgeYears','approxAgeMonths','approxAgeWeeks','bcs','asa','emergency','patientProcedure','patientAllergies','patientComorbidities','patientPrecautions','procedure','surgeon','anesthetist','surgicalAssistant',
  'hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal',
  'depth','ventilation','bradyPoorPerf','bloodLoss','cardiacRisk','respRisk','recordInterval','reminderOn',
  'recordNote','recHR','recRR','recMAP','recSpO2','recTemp','recExtubation','recOxygen','recMentation','recPain','recNaReason','recRecordInterval','recScoreAirway','recScoreOxygen','recScoreTemp','recScoreMentation','recScoreComfort','recScoreNote','planPremed','planInduction','planMaintenance','planAnalgesia','planAntibiotic','planNSAID','planBlock','planNote','actualDiazepamMl','actualPropofolMl','actualTramadolMl','balanceCrystalloid','balanceBolus','balanceBloodIn','balanceBloodLoss','balanceUrine','fluidActualTotal','airwayEttSize','airwayEttDepth','airwayCuff','airwayDifficulty','airwayCircuit','airwayVentMode','airwayVt','airwayPip','airwayPeep','airwayVentRr','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'
];

let state = {
  caseId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  humanRecordId: makeHumanRecordId(Date.now()),
  createdAt: Date.now(),
  timer: {running:false, startedEpoch:null, elapsedMs:0},
  records: [],
  events: [],
  complications: [],
  drugAdministrations: [],
  alertEpisodes: [],
  alertProtocolOverride:null,alertProtocolHistory:[],recoveryHandoffs:[],
  recoveryScores: [],
  recoveryChecks: [false,false,false,false,false,false],
  recoveryNA: [false,false,false,false,false,false],
  recoveryObservationNA:{spo2:false,temp:false,extubation:false},
  patientSaved:false,
  patientMasterId:'',
  visitId:'',
  sex:'',
  reproductiveStatus:'',
  microchip:'',
  birthDate:'',
  birthDateEstimated:false,
  ageSource:'',
  estimatedBirthPeriod:'',
  approxAgeYears:'0',
  approxAgeMonths:'0',
  approxAgeWeeks:'0',
  preopChecks:{},preopNA:{},
  caseStartedAt:null,
  responses:[],
  corrections:[],
  casePhase:'setup',
  recoveryStartedAt:null,
  recoveryCompletedAt:null,
  recoveryRecords:[],
  emergencyReturnActive:false,
  surgeryEndedAt:null,
  extubatedAt:null,
  lastSavedAt:null,
  fluidRateHistory:[],
  caseLocked:false,
  lockedAt:null,
  protocolSnapshot:null,
  auditTrail:[],
  amendments:[],
  finalSignoff:{anesthetist:null,surgeon:null},
  finalChecksum:null,checksumAlgorithm:null,checksumCreatedAt:null,
  voidedAt:null,voidedBy:'',voidReason:''
};
let timerHandle = null;
let dueReminderToken = null;
// Prevent unload/visibility autosave from writing stale DOM values back over a fresh reset.
let resetInProgress = false;
let sessionMode='initializing';
let sessionHeartbeatHandle=null;
let sessionChannel=null;
const sessionTabId=(()=>{try{let id=sessionStorage.getItem(SESSION_TAB_KEY);if(!id){id=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());sessionStorage.setItem(SESSION_TAB_KEY,id)}return id}catch(e){return crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())}})();

function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function clamp(v,min,max,fallback=null){
  if(v === '' || v === null || v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? Math.max(min, Math.min(max,n)) : fallback;
}
function pad(n){return String(n).padStart(2,'0')}
function formatClock(epoch=Date.now()){
  const d=new Date(epoch);return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}
function formatDate(epoch){
  const d=new Date(epoch);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function formatElapsed(ms){
  const s=Math.max(0,Math.floor((ms||0)/1000)),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
function makeHumanRecordId(epoch=Date.now()){
  const d=new Date(epoch),date=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}`;
  const tail=(crypto.randomUUID?crypto.randomUUID().replace(/-/g,'').slice(-5):Math.random().toString(36).slice(-5)).toUpperCase();
  return `ANV-${date}-${tail}`;
}
function stableSortObject(v){
  if(Array.isArray(v))return v.map(stableSortObject);
  if(v&&typeof v==='object')return Object.keys(v).sort().reduce((o,k)=>{o[k]=stableSortObject(v[k]);return o},{});
  return v;
}
function originalClinicalPayload(caseObj){
  const x=JSON.parse(JSON.stringify(caseObj||{}));
  ['amendments','voidedAt','voidedBy','voidReason','archivedAt','lastSavedAt','finalChecksum','checksumAlgorithm','checksumCreatedAt','auditTrail'].forEach(k=>delete x[k]);
  if(x.timer){x.timer.running=false;x.timer.startedEpoch=null}
  return stableSortObject(x);
}
async function sha256Text(text){
  if(crypto.subtle){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}
  let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return `FNV1A-${(h>>>0).toString(16).padStart(8,'0').toUpperCase()}`;
}
async function computeCaseChecksum(caseObj){return await sha256Text(JSON.stringify(originalClinicalPayload(caseObj)))}
function shortChecksum(v){if(!v)return '—';const s=String(v).replace(/[^A-Z0-9]/gi,'').toUpperCase();return s.slice(0,16).match(/.{1,4}/g)?.join('-')||v}

function formatShortElapsed(ms){
  const s=Math.max(0,Math.floor((ms||0)/1000)),m=Math.floor(s/60),sec=s%60;
  return m>=60?formatElapsed(ms):`${m}:${pad(sec)}`;
}
function toast(msg){
  const t=$('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200);
}
function readSessionLock(){try{const x=JSON.parse(localStorage.getItem(SESSION_LOCK_KEY)||'null');return x&&x.tabId?x:null}catch(e){return null}}
function sessionLockIsFresh(lock){return !!(lock&&lock.tabId&&Number(lock.heartbeatAt)>0&&(Date.now()-Number(lock.heartbeatAt))<SESSION_TTL_MS)}
function writeSessionLock(){if(sessionMode!=='active')return;const lock={tabId:sessionTabId,heartbeatAt:Date.now(),caseId:state?.caseId||'',patientName:state?.patientName||'',version:'14.7'};try{localStorage.setItem(SESSION_LOCK_KEY,JSON.stringify(lock))}catch(e){};try{sessionChannel?.postMessage({type:'HEARTBEAT',...lock})}catch(e){}}
function releaseSessionLock(){const lock=readSessionLock();if(lock?.tabId===sessionTabId){try{localStorage.removeItem(SESSION_LOCK_KEY)}catch(e){};try{sessionChannel?.postMessage({type:'RELEASE',tabId:sessionTabId})}catch(e){}}}
function sessionSafeTarget(target){return !!target?.closest?.('.session-safe,[data-tab],[data-more-tab],#moreMenuBtn,.archive-pdf,.verify-integrity')}
function renderSessionMode(){
  const view=sessionMode!=='active',banner=$('sessionBanner');document.body.classList.toggle('session-readonly',view);
  if(banner)banner.hidden=!view;
  if(view){const lock=readSessionLock(),detail=lock?.patientName?`Active tab: ${lock.patientName}`:'Another ANESVET tab currently owns the clinical session';if($('sessionBannerText'))$('sessionBannerText').textContent=`${detail}. This tab will not save or modify clinical records.`}
  else if($('sessionBannerText'))$('sessionBannerText').textContent='This tab has control of the ANESVET clinical session.';
}
function setSessionMode(mode,reason=''){
  sessionMode=mode;if(sessionHeartbeatHandle){clearInterval(sessionHeartbeatHandle);sessionHeartbeatHandle=null}
  if(mode==='active'){writeSessionLock();sessionHeartbeatHandle=setInterval(writeSessionLock,SESSION_HEARTBEAT_MS);try{$('sessionDialog')?.close()}catch(e){};if(reason)toast(reason)}
  else{clearInterval(timerHandle);timerHandle=null;if(state?.timer?.running)renderTimerState();if(reason&&$('sessionDialogText'))$('sessionDialogText').textContent=reason}
  renderSessionMode();
}
function takeSessionControl(){setSessionMode('active','Control transferred to this tab');try{sessionChannel?.postMessage({type:'TAKE_CONTROL',tabId:sessionTabId,heartbeatAt:Date.now()})}catch(e){}}
function showSessionConflict(lock){setSessionMode('view');const text=`Another ANESVET tab is active${lock?.patientName?` with ${lock.patientName}`:''}. View only prevents current-case overwrite. Take control only if the other tab should stop recording.`;if($('sessionDialogText'))$('sessionDialogText').textContent=text;const d=$('sessionDialog');try{if(d&&!d.open)d.showModal()}catch(e){}}
function refreshSessionStatus(){const lock=readSessionLock();if(!sessionLockIsFresh(lock)||lock.tabId===sessionTabId){takeSessionControl();return}showSessionConflict(lock)}
function initSessionCoordination(){
  try{if('BroadcastChannel' in window){sessionChannel=new BroadcastChannel('anesvet-session-v14');sessionChannel.onmessage=e=>{const m=e.data||{};if(m.tabId===sessionTabId)return;if(m.type==='TAKE_CONTROL'&&sessionMode==='active'){setSessionMode('view','Another tab took control. This tab is now view-only.');toast('Another tab took control — VIEW ONLY')}else if(m.type==='RELEASE'&&sessionMode!=='active'){renderSessionMode()}}}}
  catch(e){}
  const lock=readSessionLock();if(!sessionLockIsFresh(lock)||lock.tabId===sessionTabId)setSessionMode('active','');else showSessionConflict(lock);
}
$('sessionViewOnlyBtn')?.addEventListener('click',()=>{try{$('sessionDialog')?.close()}catch(e){};setSessionMode('view');toast('Opened in VIEW ONLY mode')});
$('sessionDialogTakeControlBtn')?.addEventListener('click',takeSessionControl);$('sessionTakeControlBtn')?.addEventListener('click',takeSessionControl);$('sessionRefreshBtn')?.addEventListener('click',refreshSessionStatus);
window.addEventListener('storage',e=>{if(e.key!==SESSION_LOCK_KEY)return;const lock=readSessionLock();if(sessionMode==='active'&&sessionLockIsFresh(lock)&&lock.tabId!==sessionTabId){setSessionMode('view','Another tab took control. This tab is now view-only.');toast('Another tab took control — VIEW ONLY')}else if(sessionMode!=='active')renderSessionMode()});
document.addEventListener('click',e=>{if(sessionMode==='active'||sessionSafeTarget(e.target))return;const actionable=e.target.closest?.('button,input,select,textarea,label');if(actionable&&actionable.closest?.('.tabpage')){e.preventDefault();e.stopImmediatePropagation();toast('VIEW ONLY — Take control before editing');}},true);
document.addEventListener('input',e=>{if(sessionMode==='active'||sessionSafeTarget(e.target))return;if(e.target.closest?.('.tabpage')){e.preventDefault();e.stopImmediatePropagation();}},true);

let alertAudioContext=null;
let alertAudioReady=false;
let alertFeedbackEnabled=localStorage.getItem(ALERT_PREF_KEY)!=='off';
let recoveryDueReminderToken=null;
let criticalAlertLatch={map:false,spo2:false};
let currentClinicalGuideKey='';
let currentClinicalGuideAuto=false;
let currentClinicalAlertEpisodeId='';
let currentClinicalGuideHigh=false;

function renderAlertFeedbackState(){
  const btn=$('alertFeedbackBtn');if(!btn)return;
  btn.classList.remove('alert-on','alert-off','alert-need-tap');
  if(!alertFeedbackEnabled){
    btn.textContent='🔕 Alerts OFF';btn.classList.add('alert-off');
    if($('alertCapabilityText'))$('alertCapabilityText').textContent='Sound/vibration disabled';
  }else if(alertAudioReady){
    btn.textContent='🔔 Alerts ON';btn.classList.add('alert-on');
    if($('alertCapabilityText'))$('alertCapabilityText').textContent=`Sound ON • Vibration ${'vibrate' in navigator?'supported':'not supported'}`;
  }else{
    btn.textContent='🔔 Enable alerts';btn.classList.add('alert-need-tap');
    if($('alertCapabilityText'))$('alertCapabilityText').textContent='Tap once to enable sound; vibration depends on device/browser';
  }
}
async function primeAlertAudio(test=false){
  if(!alertFeedbackEnabled){renderAlertFeedbackState();return false}
  try{
    const AC=window.AudioContext||window.webkitAudioContext;
    if(!AC){alertAudioReady=false;renderAlertFeedbackState();return false}
    if(!alertAudioContext)alertAudioContext=new AC();
    if(alertAudioContext.state==='suspended')await alertAudioContext.resume();
    alertAudioReady=alertAudioContext.state==='running';
    if(test&&alertAudioReady)playDueTone('test');
    renderAlertFeedbackState();return alertAudioReady;
  }catch(e){alertAudioReady=false;renderAlertFeedbackState();return false}
}
function playDueTone(kind='anesthesia'){
  if(!alertFeedbackEnabled||!alertAudioReady||!alertAudioContext)return;
  const ctx=alertAudioContext,now=ctx.currentTime;
  const pattern=kind==='recovery'
    ? [[880,0,.12],[660,.18,.12],[880,.36,.16]]
    : [[880,0,.15],[880,.23,.15]];
  pattern.forEach(([freq,offset,dur])=>{
    const osc=ctx.createOscillator(),gain=ctx.createGain();
    osc.type='sine';osc.frequency.value=freq;
    gain.gain.setValueAtTime(0.0001,now+offset);
    gain.gain.exponentialRampToValueAtTime(0.12,now+offset+.015);
    gain.gain.exponentialRampToValueAtTime(0.0001,now+offset+dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now+offset);osc.stop(now+offset+dur+.03);
  });
}
function vibrateDue(kind='anesthesia'){
  if(!alertFeedbackEnabled||!('vibrate' in navigator))return;
  try{navigator.vibrate(kind==='recovery'?[140,90,140,90,180]:[140,90,140])}catch(e){}
}
function fireDueFeedback(kind='anesthesia'){
  if(!alertFeedbackEnabled)return;
  playDueTone(kind);vibrateDue(kind);
  const el=kind==='recovery'?$('recoveryDueBadge'):$('dueBanner');
  if(el){el.classList.remove('alert-pulse');void el.offsetWidth;el.classList.add('alert-pulse')}
}
$('alertFeedbackBtn')?.addEventListener('click',async()=>{
  if(alertFeedbackEnabled&&alertAudioReady){
    alertFeedbackEnabled=false;localStorage.setItem(ALERT_PREF_KEY,'off');
    if('vibrate' in navigator)try{navigator.vibrate(0)}catch(e){}
    renderAlertFeedbackState();toast('Sound/vibration alerts OFF');return;
  }
  alertFeedbackEnabled=true;localStorage.setItem(ALERT_PREF_KEY,'on');
  await primeAlertAudio(true);
  if('vibrate' in navigator)try{navigator.vibrate(60)}catch(e){}
  toast(alertAudioReady?'Sound/vibration alerts enabled':'Vibration enabled where supported • sound unavailable on this browser');
});
document.addEventListener('pointerdown',()=>{if(alertFeedbackEnabled&&!alertAudioReady)primeAlertAudio(false)},{once:true,passive:true});

function currentElapsed(){
  if(state.timer.running && state.timer.startedEpoch){
    return (state.timer.elapsedMs||0) + (Date.now()-state.timer.startedEpoch);
  }
  return state.timer.elapsedMs || 0;
}

function phaseLabel(){
  if(state.caseLocked)return 'LOCKED';
  return ({setup:'SETUP',induction:'INDUCTION',intraop:'INTRAOPERATIVE',emergence:'EMERGENCE',recovery:'RECOVERY',emergency:'EMERGENCY RETURN',complete:'COMPLETE'})[state.casePhase]||'SETUP';
}
function phaseClass(){
  if(state.caseLocked)return 'locked';
  return ({setup:'setup',induction:'induction',intraop:'intraop',emergence:'emergence',recovery:'recovery',emergency:'emergency',complete:'complete'})[state.casePhase]||'setup';
}

function renderOrPhaseTracker(){
  const current=state.caseLocked?'complete':(state.casePhase||'setup');
  const order=['setup','induction','intraop','emergence','recovery'];
  const idx=order.indexOf(current);
  const display={
    setup:['SETUP','เตรียมข้อมูลผู้ป่วย อุปกรณ์ และ pre-anesthetic checklist'],
    induction:['INDUCTION','เริ่มวางยา / induction และเตรียม airway'],
    intraop:['INTRAOPERATIVE','อยู่ระหว่างการผ่าตัดและเฝ้าระวัง anesthesia'],
    emergence:['SURGERY END / EMERGENCE','การผ่าตัดสิ้นสุด รอการตื่นและถอดท่อ'],
    recovery:['RECOVERY','หลังถอดท่อ บันทึก recovery vital signs เป็นช่วงเวลา'],
    emergency:['EMERGENCY RETURN','กลับ OR LIVE เพื่อ airway / ventilation / resuscitation'],
    complete:['COMPLETE','Recovery complete — พร้อม End Case']
  };
  const pair=display[current]||display.setup;
  if($('orPhaseCurrentText'))$('orPhaseCurrentText').textContent=pair[0];
  if($('orPhaseCurrentHelp'))$('orPhaseCurrentHelp').textContent=pair[1];

  document.querySelectorAll('[data-phase-step]').forEach(el=>{
    const p=el.dataset.phaseStep,pidx=order.indexOf(p);
    el.classList.remove('active','done','emergency-active');
    if(current==='emergency'){
      if(p==='recovery')el.classList.add('emergency-active');
      else if(pidx>=0&&pidx<4)el.classList.add('done');
    }else if(current==='complete'){
      el.classList.add('done');
    }else{
      if(p===current)el.classList.add('active');
      else if(pidx>=0&&idx>=0&&pidx<idx)el.classList.add('done');
    }
  });

  const hint={
    setup:'Next: กด Start case เพื่อเข้าสู่ Induction',
    induction:'Next: เมื่อเริ่มผ่าตัด กด Surgery start',
    intraop:'Next: เมื่อผ่าตัดเสร็จ กด Surgery end',
    emergence:'Next: เมื่อถอดท่อ กด Extubation → ระบบจะเข้า Recovery อัตโนมัติ',
    recovery:'Recovery active — OR LIVE ถูกล็อก ยกเว้น Emergency return',
    emergency:'EMERGENCY RETURN — เมื่อ stable แล้วกด Return to Recovery',
    complete:'Recovery complete — ไป End Case'
  }[current]||'';
  if($('orPhaseActionHint'))$('orPhaseActionHint').textContent=hint;
}

function renderCasePhase(){
  const label=phaseLabel(),cls=phaseClass();
  ['casePhaseBadge','orCasePhaseBadge'].forEach(id=>{
    const el=$(id);if(!el)return;
    el.textContent=label;el.className=`status-pill phase ${cls}`;
  });
  renderWorkflowLocks();
  renderOrPhaseTracker();
}
function setCasePhase(phase,log=true){
  if(state.caseLocked)return;
  if(state.casePhase===phase){renderCasePhase();return}
  state.casePhase=phase;
  addAudit('CASE_PHASE_CHANGE',`Phase → ${phase}`);
  if(phase==='recovery'){if(!state.recoveryStartedAt)state.recoveryStartedAt=Date.now();captureRecoveryHandoff('Recovery phase transition')}
  if(log){
    const name=({induction:'Induction phase',intraop:'Intraoperative phase',emergence:'Emergence phase',recovery:'Recovery phase',emergency:'Emergency return to OR',complete:'Case complete'})[phase];
    if(name)addEvent({category:'Phase',name,note:`Case phase → ${phase}`});
  }
  save();renderCasePhase();renderRecoveryState();renderCaseSummary();
}

function renderTimerState(){
  const badge=$('timerStateBadge'),startBtn=$('startCaseBtn'),pauseBtn=$('pauseCaseBtn');
  if(!badge||!startBtn||!pauseBtn)return;
  if(state.timer.running){
    badge.className='timer-state running';badge.textContent='● RUNNING';
    startBtn.textContent='Running';startBtn.disabled=true;pauseBtn.disabled=false;pauseBtn.textContent='Pause case';
  }else if((state.timer.elapsedMs||0)>0){
    badge.className='timer-state paused';badge.textContent='PAUSED';
    startBtn.textContent='▶ Resume case';startBtn.disabled=false;pauseBtn.disabled=true;pauseBtn.textContent='Paused';
  }else{
    badge.className='timer-state ready';badge.textContent='READY';
    startBtn.textContent='▶ Start case';startBtn.disabled=false;pauseBtn.disabled=true;pauseBtn.textContent='Pause';
  }
  if($('timelineElapsed')) $('timelineElapsed').textContent=formatElapsed(currentElapsed());
  if($('timelineStartClock')) $('timelineStartClock').textContent=state.caseStartedAt?formatClock(state.caseStartedAt):'—';
  renderSaveState();renderCasePhase();
}
function currentWeightKg(){const w=Number($('weight')?.value);return Number.isFinite(w)&&w>0?w:null}
function currentWeightReady(){return !!state.patientSaved&&currentWeightKg()!==null}
function requireCurrentWeight(action='continue'){
  if(currentWeightReady())return true;
  toast(`Current BW not confirmed — Save Patient & Case Setup before ${action}`);
  setTab('patient');$('weight')?.focus();return false;
}
function validateCaseReadyToStart(){
  if(!$('patientName')?.value.trim()){toast('กรุณากรอกชื่อผู้ป่วยก่อนเริ่มเคส');setTab('patient');$('patientName')?.focus();return false}
  if(!$('species')?.value){toast('กรุณาเลือก Species ก่อนเริ่มเคส');setTab('patient');$('species')?.focus();return false}
  if(!state.patientSaved){toast('Patient & Case Setup changed or not saved — Save setup before Start case');setTab('patient');$('savePatientBtn')?.focus();return false}
  if(currentWeightKg()===null){toast('Current BW required — enter today’s measured weight before Start case');setTab('patient');$('weight')?.focus();return false}
  return true;
}
function renderWeightSafetyState(){
  const ready=currentWeightReady();
  const ids=['drugAdminConfirmBtn'];ids.forEach(id=>{if($(id))$(id).disabled=!ready});
  $$('.drug-event-btn,.custom-drug-event-btn,.administered-btn').forEach(btn=>{btn.disabled=!ready;btn.title=ready?'':'Save Patient & Case Setup with today’s current BW first'});
  if($('currentWeightSafety')){$('currentWeightSafety').textContent=ready?`✓ Current BW confirmed: ${currentWeightKg().toFixed(1)} kg`:'⚠ Current BW not confirmed — enter today’s measured weight and Save Patient & Case Setup';$('currentWeightSafety').className=`current-weight-safety ${ready?'good':'warn'}`}
}
function ensureTimerStarted(){
  if(!clinicalWriteAllowed())return false;
  if(state.timer.running || state.timer.elapsedMs>0) return true;
  if(!validateCaseReadyToStart())return false;
  state.timer.running=true;
  state.timer.startedEpoch=Date.now();
  if(!state.caseStartedAt){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';captureProtocolSnapshot();addAudit('CASE_STARTED','Anesthesia case timer started')}
  startTimerLoop();renderTimerState();renderCasePhase();save();
  return true;
}
function startTimerLoop(){
  clearInterval(timerHandle);
  timerHandle=setInterval(()=>{
    $('caseClock').textContent=formatElapsed(currentElapsed());
    renderTimerState();
    if($('orlive')?.classList.contains('active')) renderOrLive();
    if(state.casePhase==='recovery'){renderRecoveryState();renderRecoveryRecords();updateRecoveryDue();}
    updateDue();
  },500);
}
function pauseTimer(){
  if(!state.timer.running) return;
  state.timer.elapsedMs=currentElapsed();
  state.timer.running=false;
  state.timer.startedEpoch=null;
  clearInterval(timerHandle);timerHandle=null;
  $('caseClock').textContent=formatElapsed(state.timer.elapsedMs);
  renderTimerState();
  save();
}
function renderSaveState(mode='saved'){
  const el=$('saveState');if(!el)return;
  if(mode==='error'){el.className='save-state error';el.textContent='⚠ Save failed';return}
  if(mode==='saving'){el.className='save-state saving';el.textContent='Saving…';return}
  const t=state.lastSavedAt?formatClock(state.lastSavedAt):'—';
  el.className='save-state saved';el.textContent=`✓ Saved locally ${t}`;
}

let archiveDbPromise=null;
let archiveCache=[];
let archiveBackend='initializing';
let currentMirrorTimer=null;
function openAnesvetDb(){
  if(archiveDbPromise)return archiveDbPromise;
  archiveDbPromise=new Promise((resolve,reject)=>{
    if(!('indexedDB' in window)){reject(new Error('IndexedDB unavailable'));return}
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains('cases')){const s=db.createObjectStore('cases',{keyPath:'caseId'});s.createIndex('archivedAt','archivedAt',{unique:false})}
      if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'});
      if(!db.objectStoreNames.contains('patients')){
        const p=db.createObjectStore('patients',{keyPath:'patientId'});
        p.createIndex('hospitalId','hospitalId',{unique:false});
        p.createIndex('patientNameLower','patientNameLower',{unique:false});
        p.createIndex('microchip','microchip',{unique:false});
        p.createIndex('updatedAt','updatedAt',{unique:false});
      }
    };
    let settled=false;
    req.onblocked=()=>{
      if(settled)return;settled=true;archiveDbPromise=null;archiveBackend='blocked';patientBackend='blocked';
      const msg='ANESVET database upgrade is blocked by another open tab. Close other ANESVET tabs/windows, then reload this page.';
      if($('storageStatus'))$('storageStatus').textContent='Storage: BLOCKED — close other ANESVET tabs and reload';
      try{alert(msg)}catch(e){}
      reject(new Error('IndexedDB upgrade blocked by another ANESVET tab'));
    };
    req.onsuccess=()=>{if(settled){try{req.result.close()}catch(e){}return}settled=true;resolve(req.result)};
    req.onerror=()=>{if(settled)return;settled=true;archiveDbPromise=null;reject(req.error||new Error('IndexedDB failed'))};
  });
  return archiveDbPromise;
}
async function idbGetAllCases(){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readonly').objectStore('cases').getAll();r.onsuccess=()=>resolve((r.result||[]).sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0)));r.onerror=()=>reject(r.error)})}
async function idbPutCase(c){const db=await openAnesvetDb(),copy=JSON.parse(JSON.stringify(c));if(!copy.caseId)copy.caseId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readwrite').objectStore('cases').put(copy);r.onsuccess=()=>resolve(copy);r.onerror=()=>reject(r.error)})}
async function idbDeleteCase(id){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readwrite').objectStore('cases').delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function idbClearCases(){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readwrite').objectStore('cases').clear();r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}

let patientCache=[];
let patientBackend='initializing';
async function idbGetAllPatients(){
  const db=await openAnesvetDb();
  return await new Promise((resolve,reject)=>{const r=db.transaction('patients','readonly').objectStore('patients').getAll();r.onsuccess=()=>resolve((r.result||[]).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)));r.onerror=()=>reject(r.error)});
}
async function idbPutPatient(p){
  const db=await openAnesvetDb(),copy=JSON.parse(JSON.stringify(p));
  if(!copy.patientId)copy.patientId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());
  copy.patientNameLower=String(copy.patientName||'').toLowerCase();copy.updatedAt=copy.updatedAt||Date.now();
  return await new Promise((resolve,reject)=>{const r=db.transaction('patients','readwrite').objectStore('patients').put(copy);r.onsuccess=()=>resolve(copy);r.onerror=()=>reject(r.error)});
}
async function idbClearPatients(){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('patients','readwrite').objectStore('patients').clear();r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
function loadFallbackPatients(){try{const p=JSON.parse(localStorage.getItem(PATIENT_FALLBACK_KEY)||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function saveFallbackPatients(){localStorage.setItem(PATIENT_FALLBACK_KEY,JSON.stringify(patientCache))}
function normalizePatientKey(v){return String(v||'').toLowerCase().trim().replace(/\s+/g,' ')}
function patientFromCase(c){
  if(!c?.patientName)return null;
  return {patientId:c.patientMasterId||crypto.randomUUID?.()||String(Date.now()+Math.random()),hospitalId:c.hospitalId||'',patientName:c.patientName||'',species:c.species||'dog',sex:c.sex||'',reproductiveStatus:c.reproductiveStatus||'',microchip:c.microchip||'',breed:c.breed||'',birthDate:c.birthDate||'',birthDateEstimated:!!c.birthDateEstimated,ageSource:c.ageSource||(c.birthDateEstimated?'estimated':c.birthDate?'dob':''),estimatedBirthPeriod:c.estimatedBirthPeriod||'',approxAgeYears:c.approxAgeYears||'0',approxAgeMonths:c.approxAgeMonths||'0',approxAgeWeeks:c.approxAgeWeeks||'0',lastWeight:c.weight||'',lastWeightAt:c.lastSavedAt||c.archivedAt||c.createdAt||null,lastBcs:c.bcs||'',allergies:c.patientAllergies||'',comorbidities:c.patientComorbidities||'',precautions:c.patientPrecautions||'',retiredAt:null,retiredReason:'',mergedInto:'',mergedPatientIds:[],hnAliases:[],microchipAliases:[],mergeAudit:[],createdAt:c.createdAt||Date.now(),updatedAt:c.archivedAt||c.lastSavedAt||c.createdAt||Date.now()};
}
function patientIdentityKey(p){
  const hn=normalizePatientKey(p.hospitalId),chip=normalizePatientKey(p.microchip);
  if(hn)return `hn:${hn}`;if(chip)return `chip:${chip}`;
  return `name:${normalizePatientKey(p.patientName)}|${p.species||''}|${normalizePatientKey(p.birthDate||p.estimatedBirthPeriod||p.breed)}`;
}
async function initPatientMaster(){
  try{
    patientCache=await idbGetAllPatients();patientBackend='IndexedDB';
    patientCache=patientCache.map(p=>({...p,retiredAt:p.retiredAt||null,retiredReason:p.retiredReason||'',mergedInto:p.mergedInto||'',mergedPatientIds:Array.isArray(p.mergedPatientIds)?p.mergedPatientIds:[],hnAliases:Array.isArray(p.hnAliases)?p.hnAliases:[],microchipAliases:Array.isArray(p.microchipAliases)?p.microchipAliases:[],mergeAudit:Array.isArray(p.mergeAudit)?p.mergeAudit:[]}));
    if(!patientCache.length){
      const seen=new Map();
      [...archiveCache].sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0)).forEach(c=>{const p=patientFromCase(c);if(!p)return;const k=patientIdentityKey(p);if(!seen.has(k))seen.set(k,p)});
      patientCache=[...seen.values()];for(const p of patientCache)await idbPutPatient(p);
    }
  }catch(e){
    patientBackend='localStorage fallback';patientCache=loadFallbackPatients().map(p=>({...p,retiredAt:p.retiredAt||null,retiredReason:p.retiredReason||'',mergedInto:p.mergedInto||'',mergedPatientIds:Array.isArray(p.mergedPatientIds)?p.mergedPatientIds:[],hnAliases:Array.isArray(p.hnAliases)?p.hnAliases:[],microchipAliases:Array.isArray(p.microchipAliases)?p.microchipAliases:[],mergeAudit:Array.isArray(p.mergeAudit)?p.mergeAudit:[]}));
    if(!patientCache.length){const seen=new Map();archiveCache.forEach(c=>{const p=patientFromCase(c);if(p&&!seen.has(patientIdentityKey(p)))seen.set(patientIdentityKey(p),p)});patientCache=[...seen.values()];saveFallbackPatients()}
  }
  patientCache.sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0));renderPatientMaster();return patientCache;
}
function getPatients(){return patientCache||[]}

async function idbPutMeta(key,value){try{const db=await openAnesvetDb();await new Promise((resolve,reject)=>{const r=db.transaction('meta','readwrite').objectStore('meta').put({key,value,updatedAt:Date.now()});r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}catch(e){}}
async function idbGetMeta(key){try{const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('meta','readonly').objectStore('meta').get(key);r.onsuccess=()=>resolve(r.result||null);r.onerror=()=>reject(r.error)})}catch(e){return null}}
function caseActivityEpoch(c){if(!c||typeof c!=='object')return 0;const xs=[c.lastSavedAt,c.lockedAt,c.recoveryCompletedAt,c.recoveryStartedAt,c.caseStartedAt,c.createdAt];for(const arrName of ['records','events','complications','drugAdministrations','alertEpisodes','recoveryScores','recoveryRecords']){const a=Array.isArray(c[arrName])?c[arrName]:[];for(const x of a.slice(-3))xs.push(x?.epoch,x?.resolvedAt,x?.acknowledgedAt)}return Math.max(0,...xs.map(Number).filter(Number.isFinite))}
async function reconcileCurrentFromMirror(){
  // Only the active writer tab may reconcile shared current-case state.
  if(sessionMode!=='active')return false;
  const rec=await idbGetMeta('current'),mirror=rec?.value;if(!mirror||typeof mirror!=='object')return false;
  let local=null;try{local=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null')}catch(e){}
  const mt=caseActivityEpoch(mirror),lt=caseActivityEpoch(local);
  const mirrorHasData=!!(mirror.patientSaved||mirror.timer?.running||(mirror.timer?.elapsedMs||0)>0||(mirror.records||[]).length||(mirror.events||[]).length||(mirror.complications||[]).length||(mirror.drugAdministrations||[]).length);
  if(!mirrorHasData)return false;
  const shouldOffer=!local||(mt>lt+250);if(!shouldOffer)return false;
  const stamp=mirror.lastSavedAt||mt||rec.updatedAt;
  const ok=confirm(`ANESVET found a newer current-case mirror in IndexedDB.\n\nPatient: ${mirror.patientName||'Unnamed'}\nLast saved: ${stamp?new Date(stamp).toLocaleString():'unknown'}\n\nRestore this newer clinical state?`);
  if(!ok)return false;
  localStorage.setItem(CURRENT_KEY,JSON.stringify(mirror));
  return true;
}
function queueCurrentMirror(){clearTimeout(currentMirrorTimer);const copy=JSON.parse(JSON.stringify(state));currentMirrorTimer=setTimeout(()=>idbPutMeta('current',copy),180)}
function getLegacyArchiveSeed(){
  const keys=['anesvet_v14_2_archive_legacy','anesvet_v14_1_archive_legacy','anesvet_v14_archive_legacy','anesvet_v13_4_archive','anesvet_v13_3_archive','anesvet_v13_2_archive','anesvet_v13_1_archive','anesvet_v13_archive','anesvet_v12_1_archive','anesvet_v12_archive','anesvet_v11_archive','anesvet_v10_archive','anesvet_v9_archive','anesvet_v8_archive','anesvet_v7_archive','anesvet_v6_1_archive','anesvet_v6_archive','anesvet_v5_archive','anesvet_v4_archive','anesvet_v3_archive'];
  for(const key of keys){try{const a=JSON.parse(localStorage.getItem(key)||'null');if(Array.isArray(a)&&a.length)return a.map(c=>{const x=JSON.parse(JSON.stringify(c));if(!x.caseId)x.caseId=crypto.randomUUID?crypto.randomUUID():String((x.createdAt||Date.now())+Math.random());if(!x.humanRecordId)x.humanRecordId=makeHumanRecordId(x.createdAt||Date.now());if(!Array.isArray(x.auditTrail))x.auditTrail=[];if(!Array.isArray(x.amendments))x.amendments=[];if(!x.finalSignoff)x.finalSignoff={anesthetist:null,surgeon:null};if(!('voidedAt' in x))x.voidedAt=null;return x})}catch(e){}}
  return [];
}
async function initArchiveDb(){
  try{
    let dbCases=await idbGetAllCases();
    if(!dbCases.length){const seed=getLegacyArchiveSeed();for(const c of seed)await idbPutCase(c);dbCases=seed}
    for(const c of dbCases){
      let changed=false;
      if(!c.humanRecordId){c.humanRecordId=makeHumanRecordId(c.createdAt||c.archivedAt||Date.now());changed=true}
      if(!Array.isArray(c.auditTrail)){c.auditTrail=[];changed=true}
      if(!Array.isArray(c.amendments)){c.amendments=[];changed=true}
      // Never mutate the signed clinical payload of an already locked/checksummed legacy case.
      // New V14.6+ collections are optional on older records and render with [] fallbacks.
      const canMigrateClinicalPayload=!(c.caseLocked&&c.finalChecksum);
      if(canMigrateClinicalPayload&&!Array.isArray(c.complications)){c.complications=[];changed=true}
      if(canMigrateClinicalPayload&&!Array.isArray(c.drugAdministrations)){c.drugAdministrations=[];changed=true}
      if(canMigrateClinicalPayload&&!Array.isArray(c.alertEpisodes)){c.alertEpisodes=[];changed=true}
      if(canMigrateClinicalPayload&&!Array.isArray(c.recoveryScores)){c.recoveryScores=[];changed=true}
      if(!c.finalSignoff){c.finalSignoff={anesthetist:null,surgeon:null};changed=true}
      if(!('voidedAt' in c)){c.voidedAt=null;changed=true}
      if(c.caseLocked&&!c.finalChecksum){c.finalChecksum=await computeCaseChecksum(c);c.checksumAlgorithm='SHA-256';c.checksumCreatedAt=Date.now();changed=true}
      if(changed)await idbPutCase(c);
    }
    archiveCache=dbCases;archiveBackend='IndexedDB';
  }catch(e){archiveCache=getLegacyArchiveSeed();archiveBackend='localStorage fallback'}
  await initPatientMaster();renderStorageStatus();renderArchives();return archiveCache;
}
function renderStorageStatus(){const el=$('storageStatus');if(el)el.textContent=`Storage: ${archiveBackend} • ${archiveCache.length} archived case${archiveCache.length===1?'':'s'} • no 50-case cap`}

function save({persistLocked=false}={}){
  if(sessionMode!=='active'){renderSaveState('saved');return false}
  // Only the final-lock transaction may persist the sealed payload; never resample UI fields.
  if(state.caseLocked){
    if(!persistLocked){renderSaveState('saved');return false}
    try{localStorage.setItem(CURRENT_KEY,JSON.stringify(state));queueCurrentMirror();renderSaveState('saved');return true}catch(e){renderSaveState('error');return false}
  }
  renderSaveState('saving');
  try{
    dataFields.forEach(id=>{
      const el=$(id);if(!el)return;
      if(id==='temp'||id==='recTemp') state[id]=el.value===''?'':(tempDisplayToStoredF(el.value)??'');
      else state[id]=el.type==='checkbox'?el.checked:el.value;
    });
    state.recoveryChecks=$$('.recovery-check').map(x=>x.checked);
    state.recoveryNA=$$('.recovery-check-na-btn').map(x=>x.classList.contains('active'));
    state.recoveryObservationNA={};$$('.recovery-observation-na-btn').forEach(x=>state.recoveryObservationNA[x.dataset.key]=x.classList.contains('active'));
    state.preopChecks={};$$('.preop-check').forEach(x=>state.preopChecks[x.dataset.key]=x.checked);
    state.preopNA={};$$('.preop-na-btn').forEach(x=>state.preopNA[x.dataset.key]=x.closest('.preop-item')?.classList.contains('na')||false);
    state.lastSavedAt=Date.now();
    localStorage.setItem(CURRENT_KEY, JSON.stringify(state));
    queueCurrentMirror();
    renderSaveState('saved');
    return true;
  }catch(e){renderSaveState('error');return false}
}
function cToF(c){return (Number(c)*9/5)+32}
function fToC(f){return (Number(f)-32)*5/9}
let activeTempDisplayUnit='F';
function normalizeTempUnit(u){return String(u||'').toUpperCase()==='C'?'C':'F'}
function tempSymbol(unit=activeTempDisplayUnit){return `°${normalizeTempUnit(unit)}`}
function tempStoredFToDisplay(v,unit=activeTempDisplayUnit){if(v===''||v===null||v===undefined)return '';const n=Number(v);if(!Number.isFinite(n))return '';return normalizeTempUnit(unit)==='C'?Number(fToC(n).toFixed(1)):Number(n.toFixed(1))}
function tempDisplayToStoredF(v,unit=activeTempDisplayUnit){if(v===''||v===null||v===undefined)return null;const n=Number(v);if(!Number.isFinite(n))return null;return normalizeTempUnit(unit)==='C'?Number(cToF(n).toFixed(1)):Number(n.toFixed(1))}
function tempInputStoredF(id){const el=$(id);return el?tempDisplayToStoredF(el.value):null}
function tempTextF(v,dec=1){if(v===''||v===null||v===undefined||!Number.isFinite(Number(v)))return '—';const d=tempStoredFToDisplay(Number(v));return `${Number(d).toFixed(dec)}${tempSymbol()}`}
function tempDeltaTextF(deltaF){const n=Number(deltaF);if(!Number.isFinite(n))return '—';const d=activeTempDisplayUnit==='C'?n*5/9:n;return `${d.toFixed(1)}${tempSymbol()}`}
function setTemperatureDisplayUnit(unit,{convertInputs=true,rerender=true}={}){
  const next=normalizeTempUnit(unit),prev=activeTempDisplayUnit;
  const ids=['temp','orTemp','recTemp'];
  if(convertInputs&&next!==prev){ids.forEach(id=>{const el=$(id);if(!el||el.value==='')return;const n=Number(el.value);if(!Number.isFinite(n))return;const storedF=prev==='C'?cToF(n):n;el.value=next==='C'?fToC(storedF).toFixed(1):Number(storedF).toFixed(1)});}
  activeTempDisplayUnit=next;
  ids.forEach(id=>{const el=$(id);if(!el)return;el.min=next==='C'?'25':'77';el.max=next==='C'?'45':'113';el.step='0.1'});
  if($('orTempUnit'))$('orTempUnit').textContent=tempSymbol();
  if($('tempUnitLabel'))$('tempUnitLabel').textContent=tempSymbol();
  if($('recTempUnitLabel'))$('recTempUnitLabel').textContent=tempSymbol();
  if($('chartTempUnit'))$('chartTempUnit').textContent=tempSymbol();
  if($('recordTempHeader'))$('recordTempHeader').textContent=`Temp ${tempSymbol()}`;
  if($('recoveryTempHeader'))$('recoveryTempHeader').textContent=`Temp ${tempSymbol()}`;
  if(rerender){renderRecords();renderRecoveryRecords();renderTrends();renderProcedureTimeline();renderResponses();renderOrLive();updateDashboard();}
}
function migrateV3Case(raw){
  if(!raw || typeof raw!=='object') return raw;
  const x=JSON.parse(JSON.stringify(raw));
  if(x.temp!==''&&x.temp!==null&&x.temp!==undefined&&Number.isFinite(Number(x.temp))&&Number(x.temp)<60) x.temp=Number(cToF(x.temp).toFixed(1));
  if(x.recTemp!==''&&x.recTemp!==null&&x.recTemp!==undefined&&Number.isFinite(Number(x.recTemp))&&Number(x.recTemp)<60) x.recTemp=Number(cToF(x.recTemp).toFixed(1));
  if(Array.isArray(x.records)) x.records=x.records.map(r=>({...r,temp:r.temp!==''&&r.temp!==null&&r.temp!==undefined&&Number.isFinite(Number(r.temp))&&Number(r.temp)<60?Number(cToF(r.temp).toFixed(1)):r.temp}));
  x.migratedFromV3=true;
  return x;
}
function load(){
  try{
    let raw=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null');
    if(!raw){const p143=JSON.parse(localStorage.getItem('anesvet_v14_2_current')||'null');if(p143){raw=p143;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const p142=JSON.parse(localStorage.getItem('anesvet_v14_1_current')||'null');if(p142){raw=p142;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const p141=JSON.parse(localStorage.getItem('anesvet_v14_current')||'null');if(p141){raw=p141;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev134=JSON.parse(localStorage.getItem('anesvet_v13_4_current')||'null');if(prev134){raw=prev134;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev133=JSON.parse(localStorage.getItem('anesvet_v13_3_current')||'null');if(prev133){raw=prev133;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev132=JSON.parse(localStorage.getItem('anesvet_v13_2_current')||'null');if(prev132){raw=prev132;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev131=JSON.parse(localStorage.getItem('anesvet_v13_1_current')||'null');if(prev131){raw=prev131;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev13=JSON.parse(localStorage.getItem('anesvet_v13_current')||'null');if(prev13){raw=prev13;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev121=JSON.parse(localStorage.getItem('anesvet_v12_1_current')||'null');if(prev121){raw=prev121;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){const prev12=JSON.parse(localStorage.getItem('anesvet_v12_current')||'null');if(prev12){raw=prev12;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));}}
    if(!raw){
      const v11=JSON.parse(localStorage.getItem('anesvet_v11_current')||'null');
      const v10=JSON.parse(localStorage.getItem('anesvet_v10_current')||'null');
      const v9=JSON.parse(localStorage.getItem('anesvet_v9_current')||'null');
      const v8=JSON.parse(localStorage.getItem('anesvet_v8_current')||'null');
      const v7=JSON.parse(localStorage.getItem('anesvet_v7_current')||'null');
      const v61=JSON.parse(localStorage.getItem('anesvet_v6_1_current')||'null');
      const v6=JSON.parse(localStorage.getItem('anesvet_v6_current')||'null');
      const v5=JSON.parse(localStorage.getItem('anesvet_v5_current')||'null');
      const v4=JSON.parse(localStorage.getItem('anesvet_v4_current')||'null');
      if(v11){raw=v11;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v10){raw=v10;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v9){
        raw=v9;if(!Array.isArray(raw.responses))raw.responses=[];if(!Array.isArray(raw.corrections))raw.corrections=[];if(!raw.casePhase)raw.casePhase='intraop';localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v8){
        raw=v8;if(!Array.isArray(raw.responses))raw.responses=[];localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v7){
        raw=v7;if(!Array.isArray(raw.responses))raw.responses=[];localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v61){
        raw=v61;
        if(!raw.preopChecks) raw.preopChecks={};
        if(!('caseStartedAt' in raw)) raw.caseStartedAt=null;
        localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v6){
        raw=v6;
        localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v5){
        raw=v5;
        if(!('breed' in raw)) raw.breed='';
        if(!('bcs' in raw)) raw.bcs='5';
        raw.patientSaved=!!raw.patientName;
        localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else if(v4){
        raw=v4;
        if(!('breed' in raw)) raw.breed='';
        if(!('bcs' in raw)) raw.bcs='5';
        raw.patientSaved=!!raw.patientName;
        localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
      }else{
        const old=JSON.parse(localStorage.getItem('anesvet_v3_current')||'null');
        if(old){
          raw=migrateV3Case(old);
          localStorage.setItem(CURRENT_KEY,JSON.stringify(raw));
        }
      }
    }
    if(raw && typeof raw==='object') state=raw.caseLocked?raw:{...state,...raw};if(!Array.isArray(state.fluidRateHistory))state.fluidRateHistory=[];
    if(!Array.isArray(state.corrections))state.corrections=[];
    if(!Array.isArray(state.complications))state.complications=[];
    if(!Array.isArray(state.drugAdministrations))state.drugAdministrations=[];
    if(!Array.isArray(state.alertEpisodes))state.alertEpisodes=[];
    if(!Array.isArray(state.recoveryScores))state.recoveryScores=[];
    if(!state.casePhase){
      if(state.caseLocked)state.casePhase='complete';
      else if(state.recoveryCompletedAt)state.casePhase='complete';
      else if(state.recoveryStartedAt)state.casePhase='recovery';
      else if(state.caseStartedAt)state.casePhase='intraop';
      else state.casePhase='setup';
    }
    if(!('caseLocked' in state))state.caseLocked=false;
    if(!Array.isArray(state.recoveryRecords))state.recoveryRecords=[];
    if(!Array.isArray(state.recoveryNA))state.recoveryNA=[false,false,false,false,false,false];
    if(!state.recoveryObservationNA||typeof state.recoveryObservationNA!=='object')state.recoveryObservationNA={spo2:false,temp:false,extubation:false};
    if(!('emergencyReturnActive' in state))state.emergencyReturnActive=false;
    if(!('surgeryEndedAt' in state))state.surgeryEndedAt=null;
    if(!('extubatedAt' in state))state.extubatedAt=null;
    if(!Array.isArray(state.auditTrail))state.auditTrail=[];
    if(!Array.isArray(state.amendments))state.amendments=[];
    if(!state.humanRecordId)state.humanRecordId=makeHumanRecordId(state.createdAt||Date.now());
    if(!state.finalSignoff)state.finalSignoff={anesthetist:null,surgeon:null};
    if(!('finalChecksum' in state))state.finalChecksum=null;
    if(!('voidedAt' in state))state.voidedAt=null;
    if(!('protocolSnapshot' in state))state.protocolSnapshot=null;
    if(!('visitId' in state))state.visitId='';
    if(!state.caseStartedAt && !(state.timer?.elapsedMs>0) && !state.recoveryStartedAt && !state.recoveryCompletedAt && !state.caseLocked)state.casePhase='setup';
  }catch(e){}
  dataFields.forEach(id=>{
    const el=$(id);if(!el || !(id in state)) return;
    if(el.type==='checkbox') el.checked=!!state[id]; else el.value=state[id] ?? '';
  });
  $$('.recovery-check').forEach((el,i)=>el.checked=!!(state.recoveryChecks||[])[i]);
  $$('.recovery-check-na-btn').forEach((btn,i)=>{const na=!!(state.recoveryNA||[])[i];btn.classList.toggle('active',na);const cb=$$('.recovery-check')[i];if(cb){cb.disabled=na;if(na)cb.checked=false}});
  $$('.recovery-observation-na-btn').forEach(btn=>{const na=!!(state.recoveryObservationNA||{})[btn.dataset.key];btn.classList.toggle('active',na);const input=btn.closest('.recovery-field-na')?.querySelector('input');if(input){input.disabled=na;if(na)input.value=''}});
  $$('.preop-check').forEach(el=>el.checked=!!(state.preopChecks||{})[el.dataset.key]);
  $$('.preop-na-btn').forEach(btn=>{const na=!!(state.preopNA||{})[btn.dataset.key];btn.closest('.preop-item')?.classList.toggle('na',na);if(na){const cb=btn.closest('.preop-item')?.querySelector('.preop-check');if(cb)cb.checked=false;}});
  if(state.timer.running && state.timer.startedEpoch && sessionMode==='active') startTimerLoop();
initArchiveDb();
if(sessionMode==='active'&&(state.timer.running||state.casePhase==='recovery')&&autoWakeEnabled())requestScreenWakeLock(true);
  $('caseClock').textContent=formatElapsed(currentElapsed());renderWeightSafetyState();
}


const BREED_CATALOG=[
  // Dogs
  {s:'dog',en:'Mixed Breed',th:'พันธุ์ผสม',a:['mixed','crossbreed','ลูกผสม','หมาพันธุ์ผสม']},
  {s:'dog',en:'Thai Ridgeback',th:'ไทยหลังอาน',a:['thai ridgeback dog','หลังอาน']},
  {s:'dog',en:'Thai Bangkaew Dog',th:'บางแก้ว',a:['bangkaew','บางแก้วไทย']},
  {s:'dog',en:'Pomeranian',th:'ปอมเมอเรเนียน',a:['pom','ปอม']},
  {s:'dog',en:'Chihuahua',th:'ชิวาวา',a:['chiwawa','ชิวาว่า']},
  {s:'dog',en:'Shih Tzu',th:'ชิสุ',a:['shihtzu','ชิห์สุ','ชิห์ซู']},
  {s:'dog',en:'Poodle',th:'พุดเดิ้ล',a:['พุดเดิล']},
  {s:'dog',en:'Toy Poodle',th:'ทอยพุดเดิ้ล',a:['toy poodle','พุดเดิ้ลทอย']},
  {s:'dog',en:'Miniature Poodle',th:'มินิเอเจอร์พุดเดิ้ล',a:['mini poodle','พุดเดิ้ลมินิ']},
  {s:'dog',en:'Yorkshire Terrier',th:'ยอร์กเชียร์ เทอร์เรีย',a:['yorkie','ยอร์คเชียร์','ยอร์กกี้']},
  {s:'dog',en:'Maltese',th:'มอลทีส',a:['มอลทิส']},
  {s:'dog',en:'Pug',th:'ปั๊ก',a:['ปั๊ก']},
  {s:'dog',en:'French Bulldog',th:'เฟรนช์ บูลด็อก',a:['frenchie','เฟรนช์บูลด็อก','เฟรนบูลด็อก']},
  {s:'dog',en:'English Bulldog',th:'อิงลิช บูลด็อก',a:['bulldog','บูลด็อก']},
  {s:'dog',en:'Boston Terrier',th:'บอสตัน เทอร์เรีย',a:['บอสตัน']},
  {s:'dog',en:'Beagle',th:'บีเกิล',a:['บีเกิ้ล']},
  {s:'dog',en:'Dachshund',th:'ดัชชุน',a:['sausage dog','ดัชชุนด์','ไส้กรอก']},
  {s:'dog',en:'Miniature Schnauzer',th:'มินิเอเจอร์ ชเนาเซอร์',a:['mini schnauzer','ชเนาเซอร์']},
  {s:'dog',en:'Cocker Spaniel',th:'ค็อกเกอร์ สแปเนียล',a:['cocker','ค็อกเกอร์']},
  {s:'dog',en:'Cavalier King Charles Spaniel',th:'คาวาเลียร์ คิง ชาร์ลส์ สแปเนียล',a:['cavalier','คาวาเลียร์']},
  {s:'dog',en:'Golden Retriever',th:'โกลเด้น รีทรีฟเวอร์',a:['golden','โกลเด้น']},
  {s:'dog',en:'Labrador Retriever',th:'ลาบราดอร์ รีทรีฟเวอร์',a:['labrador','lab','ลาบราดอร์']},
  {s:'dog',en:'German Shepherd Dog',th:'เยอรมัน เชพเพิร์ด',a:['gsd','german shepherd','อัลเซเชียน','เยอรมันเชพเพิร์ด']},
  {s:'dog',en:'Belgian Malinois',th:'เบลเยียน มาลินอยส์',a:['malinois','มาลินอยส์']},
  {s:'dog',en:'Siberian Husky',th:'ไซบีเรียน ฮัสกี',a:['husky','ฮัสกี้','ไซบีเรียน']},
  {s:'dog',en:'Alaskan Malamute',th:'อลาสกัน มาลามิวท์',a:['malamute','มาลามิวท์']},
  {s:'dog',en:'Samoyed',th:'ซามอยด์',a:['samoyed','ซามอย']},
  {s:'dog',en:'Chow Chow',th:'เชาเชา',a:['chow','เชาเชา']},
  {s:'dog',en:'Shiba Inu',th:'ชิบะ อินุ',a:['shiba','ชิบะ']},
  {s:'dog',en:'Akita Inu',th:'อากิตะ อินุ',a:['akita','อากิตะ']},
  {s:'dog',en:'Border Collie',th:'บอร์เดอร์ คอลลี่',a:['border','บอร์เดอร์']},
  {s:'dog',en:'Shetland Sheepdog',th:'เชทแลนด์ ชีพด็อก',a:['sheltie','เชลตี้']},
  {s:'dog',en:'Pembroke Welsh Corgi',th:'เพมโบรค เวลช์ คอร์กี้',a:['corgi','คอร์กี้']},
  {s:'dog',en:'Australian Shepherd',th:'ออสเตรเลียน เชพเพิร์ด',a:['aussie','ออสซี่']},
  {s:'dog',en:'Jack Russell Terrier',th:'แจ็ครัสเซล เทอร์เรีย',a:['jack russell','แจ็ครัสเซล']},
  {s:'dog',en:'American Pit Bull Terrier',th:'อเมริกัน พิตบูล เทอร์เรีย',a:['pit bull','pitbull','พิตบูล']},
  {s:'dog',en:'American Bully',th:'อเมริกัน บูลลี่',a:['bully','บูลลี่']},
  {s:'dog',en:'Bull Terrier',th:'บูล เทอร์เรีย',a:['bull terrier','บูลเทอร์เรีย']},
  {s:'dog',en:'Rottweiler',th:'ร็อตไวเลอร์',a:['rottweiler','ร็อตไวเลอร์']},
  {s:'dog',en:'Doberman Pinscher',th:'โดเบอร์แมน',a:['doberman','โดเบอร์แมน']},
  {s:'dog',en:'Great Dane',th:'เกรทเดน',a:['great dane','เกรทเดน']},
  {s:'dog',en:'Cane Corso',th:'คาเน คอร์โซ',a:['cane corso','คอร์โซ']},
  {s:'dog',en:'Boxer',th:'บ็อกเซอร์',a:['boxer','บ็อกเซอร์']},
  {s:'dog',en:'Bichon Frise',th:'บิชอง ฟริเซ่',a:['bichon','บิชอง']},
  {s:'dog',en:'Pekingese',th:'ปักกิ่ง',a:['pekingese','ปักกิ่ง']},
  {s:'dog',en:'Japanese Spitz',th:'เจแปนนิส สปิตซ์',a:['japanese spitz','สปิตซ์ญี่ปุ่น']},
  {s:'dog',en:'Papillon',th:'ปาปิยอง',a:['papillon','ปาปิยอง']},
  {s:'dog',en:'Bernese Mountain Dog',th:'เบอร์นีส เมาน์เทนด็อก',a:['bernese','เบอร์นีส']},
  {s:'dog',en:'Saint Bernard',th:'เซนต์ เบอร์นาร์ด',a:['st bernard','เซนต์เบอร์นาร์ด']},
  {s:'dog',en:'Weimaraner',th:'ไวมาราเนอร์',a:['weimaraner','ไวมา']},
  {s:'dog',en:'Vizsla',th:'วิซสลา',a:['vizsla','วิซลา']},

  // Cats
  {s:'cat',en:'Domestic Shorthair',th:'แมวบ้านขนสั้น',a:['dsh','domestic short hair','แมวบ้าน','แมวไทยผสม']},
  {s:'cat',en:'Domestic Longhair',th:'แมวบ้านขนยาว',a:['dlh','domestic long hair']},
  {s:'cat',en:'Siamese',th:'วิเชียรมาศ',a:['siamese cat','แมวสยาม','วิเชียรมาศ']},
  {s:'cat',en:'Korat',th:'สีสวาด',a:['korat cat','โคราช','แมวโคราช']},
  {s:'cat',en:'Khao Manee',th:'ขาวมณี',a:['khao manee','ขาวมณี']},
  {s:'cat',en:'Suphalak',th:'ศุภลักษณ์',a:['suphalak','ศุภลักษณ์']},
  {s:'cat',en:'Persian',th:'เปอร์เซีย',a:['persian cat','เปอร์เซีย']},
  {s:'cat',en:'Exotic Shorthair',th:'เอ็กโซติก ชอร์ตแฮร์',a:['exotic','เอ็กโซติก']},
  {s:'cat',en:'British Shorthair',th:'บริติช ชอร์ตแฮร์',a:['bsh','british','บริติช']},
  {s:'cat',en:'Scottish Fold',th:'สก็อตติช โฟลด์',a:['scottish','สก็อตติช','สก๊อตติช']},
  {s:'cat',en:'American Shorthair',th:'อเมริกัน ชอร์ตแฮร์',a:['ash','american shorthair','อเมริกันชอร์ตแฮร์']},
  {s:'cat',en:'Maine Coon',th:'เมนคูน',a:['mainecoon','เมนคูน']},
  {s:'cat',en:'Ragdoll',th:'แร็กดอลล์',a:['rag doll','แร็กดอล']},
  {s:'cat',en:'Bengal',th:'เบงกอล',a:['bengal cat','เบงกอล']},
  {s:'cat',en:'Sphynx',th:'สฟิงซ์',a:['sphinx','สฟิงซ์']},
  {s:'cat',en:'Russian Blue',th:'รัสเซียน บลู',a:['russianblue','รัสเซียนบลู']},
  {s:'cat',en:'Burmese',th:'เบอร์มีส',a:['burmese cat','เบอร์มีส']},
  {s:'cat',en:'Birman',th:'เบอร์แมน',a:['birman cat','เบอร์แมน']},
  {s:'cat',en:'Abyssinian',th:'อะบิสซิเนียน',a:['abyssinian','อะบิสซิเนียน']},
  {s:'cat',en:'Oriental Shorthair',th:'โอเรียนทัล ชอร์ตแฮร์',a:['oriental','โอเรียนทัล']},
  {s:'cat',en:'Norwegian Forest Cat',th:'นอร์วีเจียน ฟอเรสต์',a:['norwegian forest','นอร์วีเจียน']},
  {s:'cat',en:'Siberian Cat',th:'ไซบีเรียน',a:['siberian cat','ไซบีเรียนแมว']},
  {s:'cat',en:'Devon Rex',th:'เดวอน เร็กซ์',a:['devon rex','เดวอน']},
  {s:'cat',en:'Cornish Rex',th:'คอร์นิช เร็กซ์',a:['cornish rex','คอร์นิช']},
  {s:'cat',en:'Munchkin',th:'มันช์กิ้น',a:['munchkin','มันช์กิ้น']},
  {s:'cat',en:'Himalayan',th:'หิมาลายัน',a:['himalayan cat','หิมาลายัน']},
  {s:'cat',en:'Turkish Angora',th:'เตอร์กิช แองโกรา',a:['angora','แองโกรา']},
  {s:'cat',en:'Manx',th:'แมนซ์',a:['manx cat','แมนซ์']},
  {s:'cat',en:'Savannah',th:'ซาวันนาห์',a:['savannah cat','ซาวันนาห์']}
];


function loadBreedAliases(){try{const a=JSON.parse(localStorage.getItem(BREED_ALIAS_KEY)||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
let breedAliases=loadBreedAliases();
function saveBreedAliases(){localStorage.setItem(BREED_ALIAS_KEY,JSON.stringify(breedAliases))}
function effectiveBreedCatalog(){
  const list=BREED_CATALOG.map(b=>({...b,a:[...(b.a||[])]}));
  breedAliases.forEach(x=>{
    if(!x?.alias||!x?.canonical)return;
    const canon=normalizeBreedSearch(x.canonical);
    let target=list.find(b=>b.s===x.species&&[b.en,b.th,breedDisplay(b)].some(v=>normalizeBreedSearch(v)===canon));
    if(target)target.a=[...(target.a||[]),x.alias];else list.push({s:x.species||'dog',en:x.canonical,th:'',a:[x.alias],customAlias:true});
  });
  return list;
}
function renderBreedAliasSettings(){
  const box=$('breedAliasRows');if(!box)return;
  box.innerHTML=breedAliases.length?breedAliases.map((a,i)=>`<div class="breed-alias-row" data-alias-i="${i}">
    <label>Species<select data-alias-field="species"><option value="dog" ${a.species==='dog'?'selected':''}>Dog</option><option value="cat" ${a.species==='cat'?'selected':''}>Cat</option></select></label>
    <label>Alias<input data-alias-field="alias" type="text" value="${escapeHtml(a.alias||'')}" placeholder="เช่น ปอมขาว"></label>
    <label>Canonical breed<input data-alias-field="canonical" type="text" value="${escapeHtml(a.canonical||'')}" placeholder="Pomeranian / ปอมเมอเรเนียน"></label>
    <button type="button" class="remove-breed-alias" data-remove-alias="${i}">×</button></div>`).join(''):'<div class="empty-state">ยังไม่มี custom breed aliases</div>';
}
function readBreedAliasSettings(){breedAliases=$$('.breed-alias-row').map((row,i)=>({id:breedAliases[i]?.id||(crypto.randomUUID?crypto.randomUUID():String(Date.now()+i)),species:row.querySelector('[data-alias-field="species"]')?.value||'dog',alias:row.querySelector('[data-alias-field="alias"]')?.value.trim()||'',canonical:row.querySelector('[data-alias-field="canonical"]')?.value.trim()||''})).filter(x=>x.alias&&x.canonical)}
$('addBreedAliasBtn')?.addEventListener('click',()=>{readBreedAliasSettings();breedAliases.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),species:'dog',alias:'',canonical:''});renderBreedAliasSettings()});
$('breedAliasRows')?.addEventListener('click',e=>{const b=e.target.closest('[data-remove-alias]');if(!b)return;readBreedAliasSettings();breedAliases.splice(Number(b.dataset.removeAlias),1);renderBreedAliasSettings()});
$('saveBreedAliasesBtn')?.addEventListener('click',()=>{readBreedAliasSettings();saveBreedAliases();renderBreedAliasSettings();toast(`Saved ${breedAliases.length} breed aliases`)});

function normalizeBreedSearch(v){
  return String(v||'').toLowerCase().normalize('NFKC').replace(/[\s._\-\/]+/g,' ').trim();
}
function breedDisplay(b){return b.th?`${b.en} / ${b.th}`:b.en}
function breedHaystack(b){return normalizeBreedSearch([b.en,b.th,...(b.a||[])].join(' '))}
let breedSuggestionIndex=-1;

function matchingBreeds(q){
  const species=$('species')?.value||'dog',query=normalizeBreedSearch(q);
  const list=effectiveBreedCatalog().filter(b=>b.s===species);
  if(!query)return list.slice(0,10);
  return list
    .map(b=>({b,score:(normalizeBreedSearch(b.en).startsWith(query)||normalizeBreedSearch(b.th).startsWith(query))?0:breedHaystack(b).includes(query)?1:99}))
    .filter(x=>x.score<99).sort((a,b)=>a.score-b.score||a.b.en.localeCompare(b.b.en)).slice(0,10).map(x=>x.b);
}
function renderBreedSuggestions(){
  const input=$('breed'),box=$('breedSuggestions');if(!input||!box)return;
  const list=matchingBreeds(input.value);breedSuggestionIndex=-1;
  if(!document.activeElement||document.activeElement!==input){box.hidden=true;input.setAttribute('aria-expanded','false');return}
  box.hidden=false;input.setAttribute('aria-expanded','true');
  if(!list.length){box.innerHTML='<div class="breed-suggestion-empty">ไม่พบในรายการ — สามารถพิมพ์ชื่อพันธุ์เองแล้วบันทึกได้</div>';return}
  box.innerHTML=list.map((b,i)=>`<button type="button" class="breed-suggestion" role="option" data-breed-i="${i}"><b>${escapeHtml(b.en)}</b><span>${escapeHtml(b.th||'')}</span></button>`).join('');
  $$('.breed-suggestion').forEach((btn,i)=>btn.addEventListener('mousedown',e=>{e.preventDefault();selectBreed(list[i])}));
}
function selectBreed(b){
  if(!$('breed')||!b)return;$('breed').value=breedDisplay(b);
  $('breedSuggestions').hidden=true;$('breed').setAttribute('aria-expanded','false');
  state.patientSaved=false;updatePatientSaveStatus();updateDashboard();
}
$('breed')?.addEventListener('focus',renderBreedSuggestions);
$('breed')?.addEventListener('input',renderBreedSuggestions);
$('breed')?.addEventListener('keydown',e=>{
  const box=$('breedSuggestions');if(!box||box.hidden)return;
  const items=$$('.breed-suggestion');if(!items.length)return;
  if(e.key==='ArrowDown'){e.preventDefault();breedSuggestionIndex=Math.min(items.length-1,breedSuggestionIndex+1)}
  else if(e.key==='ArrowUp'){e.preventDefault();breedSuggestionIndex=Math.max(0,breedSuggestionIndex-1)}
  else if(e.key==='Enter'&&breedSuggestionIndex>=0){e.preventDefault();items[breedSuggestionIndex].dispatchEvent(new MouseEvent('mousedown',{bubbles:true}));return}
  else if(e.key==='Escape'){box.hidden=true;return}
  else return;
  items.forEach((x,i)=>x.classList.toggle('active',i===breedSuggestionIndex));
  items[breedSuggestionIndex]?.scrollIntoView({block:'nearest'});
});
$('breed')?.addEventListener('blur',()=>setTimeout(()=>{if($('breedSuggestions'))$('breedSuggestions').hidden=true},120));
$('species')?.addEventListener('change',()=>{
  const current=$('breed')?.value||'',norm=normalizeBreedSearch(current);
  if(norm){
    const exact=effectiveBreedCatalog().find(b=>normalizeBreedSearch(breedDisplay(b))===norm||normalizeBreedSearch(b.en)===norm||normalizeBreedSearch(b.th)===norm);
    if(exact&&exact.s!==$('species').value)$('breed').value='';
  }
  renderBreedSuggestions();state.patientSaved=false;updatePatientSaveStatus();updateDashboard();
});

function isoDateLocal(d){
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
}
function dateFromIso(v){
  if(!v)return null;const [y,m,d]=String(v).split('-').map(Number);
  if(!y||!m||!d)return null;const x=new Date(y,m-1,d);return Number.isNaN(x.getTime())?null:x;
}
function agePartsFromDob(dob,today=new Date()){
  if(!dob)return null;
  const start=new Date(dob.getFullYear(),dob.getMonth(),dob.getDate());
  const end=new Date(today.getFullYear(),today.getMonth(),today.getDate());
  if(start>end)return null;
  let years=end.getFullYear()-start.getFullYear();
  let months=end.getMonth()-start.getMonth();
  let days=end.getDate()-start.getDate();
  if(days<0){
    const prevMonthDays=new Date(end.getFullYear(),end.getMonth(),0).getDate();
    days+=prevMonthDays;months-=1;
  }
  if(months<0){months+=12;years-=1}
  const totalDays=Math.floor((end-start)/86400000);
  return {years,months,days,totalDays};
}
function formatAgeThai(parts,estimated=false){
  if(!parts)return '—';let text='';
  if(parts.totalDays<56){
    const weeks=Math.floor(parts.totalDays/7),days=parts.totalDays%7;
    text=`${weeks} สัปดาห์${days?` ${days} วัน`:''}`;
  }else if(parts.years<1){
    text=`${parts.months} เดือน${parts.days?` ${parts.days} วัน`:''}`;
  }else{
    text=`${parts.years} ปี${parts.months?` ${parts.months} เดือน`:''}`;
  }
  return estimated?`ประมาณ ${text}`:text;
}
function formatAgeCanonical(parts,estimated=false){
  if(!parts)return '';
  let text;
  if(parts.totalDays<56){
    const w=Math.floor(parts.totalDays/7),d=parts.totalDays%7;text=`${w} wk${d?` ${d} d`:''}`;
  }else if(parts.years<1){
    text=`${parts.months} mo${parts.days?` ${parts.days} d`:''}`;
  }else{
    text=`${parts.years} y${parts.months?` ${parts.months} mo`:''}`;
  }
  return estimated?`≈ ${text}`:text;
}
function estimatedBirthPeriodFor(anchor,y,m,w){
  if(!anchor)return '';
  if(y>0&&m===0&&w===0)return `~${anchor.getFullYear()}`;
  return `~${anchor.getFullYear()}-${pad(anchor.getMonth()+1)}`;
}
function renderAgeUI(){
  const dob=dateFromIso($('birthDate')?.value);
  const source=$('ageSource')?.value||($('birthDateEstimated')?.checked?'estimated':dob?'dob':'');
  const estimated=source==='estimated'||!!$('birthDateEstimated')?.checked,parts=agePartsFromDob(dob);
  if($('ageDisplay'))$('ageDisplay').textContent=parts?formatAgeThai(parts,estimated):($('age')?.value||'—');
  if(parts&&$('age'))$('age').value=formatAgeCanonical(parts,estimated);
  if($('birthDate'))$('birthDate').classList.toggle('estimated-dob',estimated&&!!dob);
  document.querySelector('.age-result-card')?.classList.toggle('estimated-age-card',estimated);
  if($('birthDateStatus')){
    if(dob&&estimated){
      const period=$('estimatedBirthPeriod')?.value||`~${dob.getFullYear()}-${pad(dob.getMonth()+1)}`;
      $('birthDateStatus').innerHTML=`อายุเป็นค่าประมาณ <span class="age-source-badge">ESTIMATED</span> • ช่วงเกิด ${escapeHtml(period)} • วันที่ในปฏิทินเป็น anchor สำหรับคำนวณอายุ`;
    }else if(dob)$('birthDateStatus').textContent=`วันเกิดที่ระบุ ${isoDateLocal(dob)} • Exact DOB`;
    else $('birthDateStatus').textContent='เลือกวันเกิด หรือกรอกอายุโดยประมาณ';
  }
  if($('birthDateUnknown'))$('birthDateUnknown').checked=estimated||(!$('birthDate')?.value&&!!$('birthDateUnknown').checked);
  if($('approxAgeControls'))$('approxAgeControls').hidden=!$('birthDateUnknown')?.checked;
}
function markPatientUnsaved(){state.patientSaved=false;updatePatientSaveStatus()}
function applyApproximateAge(){
  const y=Math.max(0,Number($('approxAgeYears')?.value||0)||0),m=Math.max(0,Number($('approxAgeMonths')?.value||0)||0),w=Math.max(0,Number($('approxAgeWeeks')?.value||0)||0);
  if(!(y||m||w)){toast('กรอกอายุโดยประมาณอย่างน้อย 1 ช่อง');return}
  const d=new Date();d.setHours(12,0,0,0);const originalDay=d.getDate();d.setDate(1);d.setFullYear(d.getFullYear()-y);d.setMonth(d.getMonth()-m);
  const lastDay=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(originalDay,lastDay));d.setDate(d.getDate()-(w*7));
  $('birthDate').value=isoDateLocal(d);$('birthDateEstimated').checked=true;$('ageSource').value='estimated';$('estimatedBirthPeriod').value=estimatedBirthPeriodFor(d,y,m,w);$('birthDateUnknown').checked=true;
  renderAgeUI();markPatientUnsaved();save();toast(`ตั้งอายุโดยประมาณ • ช่วงเกิด ${$('estimatedBirthPeriod').value}`);
}
$('applyApproxAgeBtn')?.addEventListener('click',applyApproximateAge);
$('birthDateUnknown')?.addEventListener('change',()=>{
  $('approxAgeControls').hidden=!$('birthDateUnknown').checked;
  if(!$('birthDateUnknown').checked&&$('birthDateEstimated').checked){$('birthDateUnknown').checked=true;$('approxAgeControls').hidden=false;toast('ข้อมูลนี้เป็น estimated age หากทราบวันเกิดจริงให้เลือกวันที่จากปฏิทิน')}
});
$('birthDate')?.addEventListener('change',()=>{
  const d=dateFromIso($('birthDate').value);
  if(d&&d>new Date()){toast('วันเกิดต้องไม่เป็นวันที่ในอนาคต');$('birthDate').value='';return}
  $('birthDateEstimated').checked=false;$('ageSource').value=d?'dob':'';$('estimatedBirthPeriod').value='';
  if($('birthDateUnknown'))$('birthDateUnknown').checked=false;if($('approxAgeControls'))$('approxAgeControls').hidden=true;
  if(d){$('approxAgeYears').value='0';$('approxAgeMonths').value='0';$('approxAgeWeeks').value='0'}
  renderAgeUI();markPatientUnsaved();updateDashboard();
});
function parseLegacyAge(text){
  const s=String(text||'').toLowerCase();
  const pick=(patterns)=>{for(const p of patterns){const m=s.match(p);if(m)return Number(m[1])||0}return 0};
  const years=pick([/(\d+(?:\.\d+)?)\s*(?:y|yr|yrs|year|years|ปี)/]);
  const months=pick([/(\d+(?:\.\d+)?)\s*(?:mo|mos|month|months|เดือน)/]);
  const weeks=pick([/(\d+(?:\.\d+)?)\s*(?:wk|wks|week|weeks|สัปดาห์)/]);
  return (years||months||weeks)?{years,months,weeks}:null;
}
function migrateLegacyAgeUi(){
  if($('birthDate')?.value){renderAgeUI();return}
  const legacy=$('age')?.value||state.age||'',parsed=parseLegacyAge(legacy);
  if(!parsed){renderAgeUI();return}
  $('approxAgeYears').value=parsed.years||0;$('approxAgeMonths').value=parsed.months||0;$('approxAgeWeeks').value=parsed.weeks||0;
  const d=new Date();d.setHours(12,0,0,0);const originalDay=d.getDate();d.setDate(1);d.setFullYear(d.getFullYear()-(parsed.years||0));d.setMonth(d.getMonth()-(parsed.months||0));const lastDay=new Date(d.getFullYear(),d.getMonth()+1,0).getDate();d.setDate(Math.min(originalDay,lastDay));d.setDate(d.getDate()-((parsed.weeks||0)*7));
  $('birthDate').value=isoDateLocal(d);$('birthDateEstimated').checked=true;$('ageSource').value='estimated';$('estimatedBirthPeriod').value=estimatedBirthPeriodFor(d,parsed.years||0,parsed.months||0,parsed.weeks||0);$('birthDateUnknown').checked=true;
  renderAgeUI();
}


function activePatientById(id){let p=patientCache.find(x=>x.patientId===id);const seen=new Set();while(p?.mergedInto&&!seen.has(p.patientId)){seen.add(p.patientId);p=patientCache.find(x=>x.patientId===p.mergedInto)||p}return p}
function patientAliasIds(p){return new Set([p?.patientId,...(Array.isArray(p?.mergedPatientIds)?p.mergedPatientIds:[])].filter(Boolean))}
function patientHnKeys(p){return new Set([p?.hospitalId,...(Array.isArray(p?.hnAliases)?p.hnAliases:[])].map(normalizePatientKey).filter(Boolean))}
function patientChipKeys(p){return new Set([p?.microchip,...(Array.isArray(p?.microchipAliases)?p.microchipAliases:[])].map(normalizePatientKey).filter(Boolean))}
function caseMatchesPatient(c,p){if(!c||!p)return false;const ids=patientAliasIds(p);if(c.patientMasterId&&ids.has(c.patientMasterId))return true;const hn=normalizePatientKey(c.hospitalId),chip=normalizePatientKey(c.microchip);if(hn&&patientHnKeys(p).has(hn))return true;if(chip&&patientChipKeys(p).has(chip))return true;return false}
function patientAnesthesiaHistory(p){return getArchive().filter(c=>caseMatchesPatient(c,p)).sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0))}
function caseLowestTemp(c){return globalThis.AnesvetWorkflow.measuredRange(c.records,'temp')?.min??null}
function caseLowestMap(c){return globalThis.AnesvetWorkflow.measuredRange(c.records,'map')?.min??null}
function caseLowestSpo2(c){return globalThis.AnesvetWorkflow.measuredRange(c.records,'spo2')?.min??null}
function caseHistoryConcern(c){const parts=[];const diff=String(c.airwayDifficulty||'').trim();if(diff&&!/^(none|easy|normal|no)$/i.test(diff))parts.push(`Difficult airway: ${diff}${c.airwayEttSize?` • ETT ${c.airwayEttSize}`:''}`);const lowMap=caseLowestMap(c);if(lowMap!==null&&lowMap<60)parts.push(`Lowest MAP ${fmtDose(lowMap)} mmHg`);const lowSpo2=caseLowestSpo2(c);if(lowSpo2!==null&&lowSpo2<94)parts.push(`Lowest SpO₂ ${fmtDose(lowSpo2)}%`);const low=caseLowestTemp(c);if(low!==null&&low<98)parts.push(`Lowest temp ${tempTextF(low)}`);const comp=[...new Set((c.complications||[]).map(x=>x.type||x.name).filter(Boolean))];if(comp.length)parts.push(`Complication: ${comp.slice(0,3).join(', ')}${comp.length>3?'…':''}`);if(c.emergencyReturnActive||(c.events||[]).some(e=>/emergency return/i.test(`${e.name||''} ${e.note||''}`)))parts.push('Emergency return to OR recorded');if(c.recoveryStartedAt&&!c.recoveryCompletedAt)parts.push('Recovery not marked complete');if(c.voidedAt)parts.push('Record voided');return parts}
function renderPatientHistory(p=null){
  const panel=$('patientHistoryPanel'),list=$('patientHistoryList'),summary=$('patientHistorySummary'),concerns=$('patientHistoryConcerns');if(!panel||!list||!summary)return;
  if(!p){panel.hidden=true;list.innerHTML='';if(concerns)concerns.hidden=true;return}
  const hist=patientAnesthesiaHistory(p);panel.hidden=false;summary.textContent=`${hist.length} archived case${hist.length===1?'':'s'}${hist[0]?` • last ${formatDate(hist[0].archivedAt||hist[0].createdAt)}`:''}`;
  const concernRows=[];hist.slice(0,5).forEach(c=>caseHistoryConcern(c).forEach(x=>concernRows.push(`${formatDate(c.archivedAt||c.createdAt||Date.now())}: ${x}`)));
  if(concerns){concerns.hidden=!concernRows.length;concerns.innerHTML=concernRows.length?`<b>Previous recorded concerns</b> • ${concernRows.map(escapeHtml).join(' • ')}`:''}
  list.innerHTML=hist.length?hist.slice(0,4).map(c=>`<div class="patient-history-item"><strong>${escapeHtml(formatDate(c.archivedAt||c.createdAt||Date.now()))}</strong><div><strong>${escapeHtml(c.procedure||c.patientProcedure||'Procedure —')}</strong><br><span>ASA ${escapeHtml(c.asa||'—')}${c.emergency?'-E':''} • ${escapeHtml(c.visitId?`Visit ${c.visitId}`:(c.humanRecordId||'No Visit ID'))}</span></div><span>${c.caseLocked?'Final':'Working'}${c.voidedAt?' • VOID':''}</span></div>`).join(''):'<div class="empty-state compact">No previous anesthesia cases linked to this patient.</div>';
}
function openPatientHistoryInArchive(){const p=activePatientById($('patientMasterId')?.value||state.patientMasterId||'');if(!p)return;setTab('cases');if($('archiveSearch'))$('archiveSearch').value=p.hospitalId||p.patientName||'';renderArchives()}
$('viewPatientHistoryBtn')?.addEventListener('click',openPatientHistoryInArchive);
async function persistPatientRecord(p){p.updatedAt=Date.now();if(patientBackend==='IndexedDB')await idbPutPatient(p);else saveFallbackPatients()}
async function retirePatient(id){let p=patientCache.find(x=>x.patientId===id);if(!p)return;if(state.timer.running||(state.timer.elapsedMs||0)>0||(state.records||[]).length){toast('Finish the current anesthesia case before managing Patient Master records');return}if(($('patientMasterId')?.value||state.patientMasterId)===p.patientId){toast('Switch or unlink the current patient before retiring this Patient Master');return}if(p.mergedInto){toast('This record is already merged into another patient');return}if(p.retiredAt){const hn=[...patientHnKeys(p)],chip=[...patientChipKeys(p)],conflict=patientCache.find(x=>x.patientId!==p.patientId&&!x.retiredAt&&!x.mergedInto&&(hn.some(k=>patientHnKeys(x).has(k))||chip.some(k=>patientChipKeys(x).has(k))));if(conflict){alert(`Cannot restore because an active Patient Master already uses the same HN or Microchip:
${conflict.patientName||'Unnamed'}${conflict.hospitalId?` • HN ${conflict.hospitalId}`:''}

Merge the duplicate records instead.`);return}if(!confirm(`Restore ${p.patientName||'this patient'} to active Patient Master?`))return;p.retiredAt=null;p.retiredReason='';await persistPatientRecord(p);renderPatientMaster();renderLinkedPatient();toast('Patient restored');return}const reason=prompt(`Retire ${p.patientName||'this patient'} from active Patient Master?\nArchived cases will not be deleted.\n\nReason (optional):`,'');if(reason===null)return;p.retiredAt=Date.now();p.retiredReason=reason.trim();await persistPatientRecord(p);renderPatientMaster();renderLinkedPatient();toast('Patient retired — history retained')}
function findMergeTarget(query,sourceId){const q=normalizePatientKey(query);const exact=patientCache.filter(p=>p.patientId!==sourceId&&!p.mergedInto&&!p.retiredAt&&(normalizePatientKey(p.patientId)===q||normalizePatientKey(p.hospitalId)===q||normalizePatientKey(p.microchip)===q||normalizePatientKey(p.patientName)===q));return exact}
async function mergePatientRecord(sourceId){const source=patientCache.find(x=>x.patientId===sourceId);if(!source||source.mergedInto)return;if(state.timer.running||(state.timer.elapsedMs||0)>0||(state.records||[]).length){toast('Finish the current anesthesia case before merging Patient Master records');return}const query=prompt(`Merge duplicate Patient Master\n\nSource: ${source.patientName||'Unnamed'}${source.hospitalId?` • HN ${source.hospitalId}`:''}\n\nEnter TARGET HN, Microchip, exact patient name, or Patient ID:`,'');if(!query?.trim())return;const matches=findMergeTarget(query,sourceId);if(matches.length!==1){alert(matches.length?'More than one target matched. Use HN, Microchip, or Patient ID to identify exactly one patient.':'No active target patient found.');return}const target=matches[0];if(!confirm(`Merge duplicate record?\n\nSOURCE (will be retired): ${source.patientName||'Unnamed'}${source.hospitalId?` • HN ${source.hospitalId}`:''}\nTARGET (kept): ${target.patientName||'Unnamed'}${target.hospitalId?` • HN ${target.hospitalId}`:''}\n\nLocked anesthesia records will NOT be rewritten. Their old patient IDs are preserved and linked through an alias.`))return;
  const fill=['hospitalId','patientName','species','sex','reproductiveStatus','microchip','breed','birthDate','ageSource','estimatedBirthPeriod','allergies','comorbidities','precautions'];fill.forEach(k=>{if(!target[k]&&source[k])target[k]=source[k]});
  if((source.lastWeightAt||0)>(target.lastWeightAt||0)){target.lastWeight=source.lastWeight;target.lastWeightAt=source.lastWeightAt;target.lastBcs=source.lastBcs||target.lastBcs}
  target.mergedPatientIds=[...new Set([...(target.mergedPatientIds||[]),source.patientId,...(source.mergedPatientIds||[])])];target.hnAliases=[...new Set([...(target.hnAliases||[]),source.hospitalId,...(source.hnAliases||[])].filter(Boolean))];target.microchipAliases=[...new Set([...(target.microchipAliases||[]),source.microchip,...(source.microchipAliases||[])].filter(Boolean))];target.mergeAudit=[...(target.mergeAudit||[]),{epoch:Date.now(),sourcePatientId:source.patientId,sourceName:source.patientName||'',sourceHn:source.hospitalId||''}];
  source.retiredAt=Date.now();source.retiredReason='Merged duplicate';source.mergedInto=target.patientId;
  try{await persistPatientRecord(target);await persistPatientRecord(source)}catch(e){toast('Patient merge failed');return}
  if(($('patientMasterId')?.value||state.patientMasterId)===source.patientId){usePatientMaster(target.patientId)}
  renderPatientMaster();renderLinkedPatient();toast('Duplicate merged — original anesthesia records preserved')
}
function sexReproText(p){const sex=({male:'Male',female:'Female'})[p.sex]||'Sex unknown',repro=({intact:'Intact',neutered:'Neutered',spayed:'Spayed'})[p.reproductiveStatus]||'status unknown';return `${sex} • ${repro}`}
function patientAgeText(p){const d=dateFromIso(p.birthDate||''),parts=agePartsFromDob(d);return parts?formatAgeThai(parts,!!p.birthDateEstimated):'Age —'}
function renderPreviousWeightReference(p=null){
  const box=$('previousWeightReference'),text=$('previousWeightText');if(!box||!text)return;
  if(!p||!(Number(p.lastWeight)>0)){box.hidden=true;text.textContent='—';return}
  const d=p.lastWeightAt?formatDate(p.lastWeightAt):null;
  box.hidden=false;text.textContent=`Previous weight: ${p.lastWeight} kg${d?` • recorded ${d}`:' • recorded date unavailable'} • reference only — enter today's measured weight below`;
}
function renderLinkedPatient(){
  const box=$('linkedPatientBanner'),id=$('patientMasterId')?.value||state.patientMasterId||'',raw=patientCache.find(x=>x.patientId===id),p=activePatientById(id)||raw;
  if(!box)return;box.hidden=!p;if(p&&$('linkedPatientText'))$('linkedPatientText').textContent=`${p.patientName}${p.hospitalId?' • HN '+p.hospitalId:''} • ${p.species==='cat'?'Cat':'Dog'}${p.breed?' • '+p.breed:''}${p.retiredAt?' • RETIRED':''}`;
  renderPreviousWeightReference(p||null);renderPatientHistory(p||null);
}
function patientSearchMatches(p,q){if(!q)return true;const s=normalizePatientKey(q);return[p.patientName,p.hospitalId,...(p.hnAliases||[]),p.microchip,...(p.microchipAliases||[]),p.breed,p.sex,p.reproductiveStatus,p.patientId].some(v=>normalizePatientKey(v).includes(s))}
function renderPatientMaster(){
  const box=$('patientMasterResults');if(!box)return;const q=$('patientMasterSearch')?.value||'',showRetired=!!$('showRetiredPatients')?.checked;
  const active=patientCache.filter(p=>!p.retiredAt&&!p.mergedInto),eligible=patientCache.filter(p=>showRetired||(!p.retiredAt&&!p.mergedInto));
  const list=eligible.filter(p=>patientSearchMatches(p,q)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,q?30:8);
  if($('patientMasterCount'))$('patientMasterCount').textContent=`${active.length} ACTIVE${patientCache.length!==active.length?` • ${patientCache.length-active.length} RETIRED`:''}`;
  if($('patientMasterSearchStatus'))$('patientMasterSearchStatus').textContent=q?`${list.length} matches`:`Recent ${Math.min(list.length,8)} patients`;
  if(!list.length){box.innerHTML='<div class="empty-state">ไม่พบผู้ป่วย • สามารถสร้าง New patient ได้</div>';renderLinkedPatient();return}
  box.innerHTML=list.map(p=>{const retired=!!p.retiredAt,merged=!!p.mergedInto;return `<div class="patient-master-card ${retired?'retired':''} ${merged?'merged':''}"><div><h3>${escapeHtml(p.patientName||'Unnamed')} ${p.hospitalId?`<span class="muted">• HN ${escapeHtml(p.hospitalId)}</span>`:''}${retired?'<span class="patient-retired-badge">RETIRED</span>':''}${merged?'<span class="patient-merged-badge">MERGED</span>':''}</h3><div class="patient-master-meta"><span>${p.species==='cat'?'Cat':'Dog'}</span><span>${escapeHtml(p.breed||'Breed —')}</span><span>${escapeHtml(sexReproText(p))}</span><span>${escapeHtml(patientAgeText(p))}</span>${p.lastWeight?`<span>Last BW ${escapeHtml(p.lastWeight)} kg</span>`:''}${p.microchip?`<span>Chip ${escapeHtml(p.microchip)}</span>`:''}${retired&&p.retiredReason?`<span>${escapeHtml(p.retiredReason)}</span>`:''}</div></div><div class="patient-master-actions">${!retired?`<button type="button" class="btn primary patient-use-btn" data-use-patient="${escapeHtml(p.patientId)}">Use patient</button>`:''}${merged?`<button type="button" class="btn" disabled>Merged → ${escapeHtml(activePatientById(p.patientId)?.patientName||'target')}</button>`:`<button type="button" class="btn patient-retire-btn" data-retire-patient="${escapeHtml(p.patientId)}">${retired?'Restore':'Retire'}</button>`}${!retired?`<button type="button" class="btn patient-merge-btn" data-merge-patient="${escapeHtml(p.patientId)}">Merge duplicate</button>`:''}</div></div>`}).join('');
  $$('.patient-use-btn').forEach(b=>b.addEventListener('click',()=>usePatientMaster(b.dataset.usePatient)));$$('.patient-retire-btn').forEach(b=>b.addEventListener('click',()=>retirePatient(b.dataset.retirePatient)));$$('.patient-merge-btn').forEach(b=>b.addEventListener('click',()=>mergePatientRecord(b.dataset.mergePatient)));renderLinkedPatient();
}
$('patientMasterSearch')?.addEventListener('input',renderPatientMaster);$('showRetiredPatients')?.addEventListener('change',renderPatientMaster);
function setPatientField(id,value){const el=$(id);if(!el)return;if(el.type==='checkbox')el.checked=!!value;else el.value=value??''}
function usePatientMaster(id){
  const p=activePatientById(id);if(!p)return;
  if(state.timer.running||(state.timer.elapsedMs||0)>0||(state.records||[]).length){toast('เคสเริ่มแล้ว ไม่สามารถเปลี่ยน Patient Master ได้');return}
  setPatientField('patientMasterId',p.patientId);state.patientMasterId=p.patientId;setPatientField('patientName',p.patientName);setPatientField('hospitalId',p.hospitalId);setPatientField('visitId','');setPatientField('species',p.species);setPatientField('sex',p.sex);setPatientField('reproductiveStatus',p.reproductiveStatus);setPatientField('microchip',p.microchip);setPatientField('breed',p.breed);setPatientField('birthDate',p.birthDate);setPatientField('birthDateEstimated',p.birthDateEstimated);setPatientField('ageSource',p.ageSource);setPatientField('estimatedBirthPeriod',p.estimatedBirthPeriod);setPatientField('approxAgeYears',p.approxAgeYears||'');setPatientField('approxAgeMonths',p.approxAgeMonths||'');setPatientField('approxAgeWeeks',p.approxAgeWeeks||'');setPatientField('weight','');setPatientField('bcs',p.lastBcs||'');setPatientField('patientAllergies',p.allergies);setPatientField('patientComorbidities',p.comorbidities);setPatientField('patientPrecautions',p.precautions);
  if($('birthDateUnknown'))$('birthDateUnknown').checked=!!p.birthDateEstimated;renderAgeUI();syncAsaCards();state.patientSaved=false;updatePatientSaveStatus();renderLinkedPatient();updateDashboard();toast(`ใช้ Patient Master: ${p.patientName}`);
}
function clearPatientRegistration(){
  if(state.timer.running||(state.timer.elapsedMs||0)>0||(state.records||[]).length){toast('เคสเริ่มแล้ว ไม่สามารถเปลี่ยนผู้ป่วยได้');return}
  ['patientMasterId','patientName','hospitalId','visitId','microchip','breed','birthDate','age','ageSource','estimatedBirthPeriod','patientAllergies','patientComorbidities','patientPrecautions'].forEach(id=>setPatientField(id,''));
  setPatientField('species','');setPatientField('sex','');setPatientField('reproductiveStatus','');setPatientField('birthDateEstimated',false);setPatientField('approxAgeYears','');setPatientField('approxAgeMonths','');setPatientField('approxAgeWeeks','');setPatientField('weight','');setPatientField('bcs','');setPatientField('asa','');
  if($('birthDateUnknown'))$('birthDateUnknown').checked=false;if($('approxAgeControls'))$('approxAgeControls').hidden=true;state.patientMasterId='';state.patientSaved=false;renderAgeUI();updatePatientSaveStatus();renderLinkedPatient();updateDashboard();$('patientName')?.focus();
}
$('newPatientMasterBtn')?.addEventListener('click',clearPatientRegistration);
$('unlinkPatientBtn')?.addEventListener('click',()=>{setPatientField('patientMasterId','');state.patientMasterId='';renderLinkedPatient();toast('Unlinked from Patient Master')});
function existingPatientLifecycle(id,key,fallback){const p=patientCache.find(x=>x.patientId===id);const v=p?.[key];return v===undefined?fallback:JSON.parse(JSON.stringify(v))}
function currentPatientMasterObject(){
  const id=$('patientMasterId')?.value||state.patientMasterId||'';
  return {patientId:id||crypto.randomUUID?.()||String(Date.now()+Math.random()),hospitalId:$('hospitalId')?.value.trim()||'',patientName:$('patientName')?.value.trim()||'',species:$('species')?.value||'',sex:$('sex')?.value||'',reproductiveStatus:$('reproductiveStatus')?.value||'',microchip:$('microchip')?.value.trim()||'',breed:$('breed')?.value.trim()||'',birthDate:$('birthDate')?.value||'',birthDateEstimated:!!$('birthDateEstimated')?.checked,ageSource:$('ageSource')?.value||'',estimatedBirthPeriod:$('estimatedBirthPeriod')?.value||'',approxAgeYears:$('approxAgeYears')?.value||'0',approxAgeMonths:$('approxAgeMonths')?.value||'0',approxAgeWeeks:$('approxAgeWeeks')?.value||'0',lastWeight:$('weight')?.value||'',lastWeightAt:Date.now(),lastBcs:$('bcs')?.value||'',allergies:$('patientAllergies')?.value.trim()||'',comorbidities:$('patientComorbidities')?.value.trim()||'',precautions:$('patientPrecautions')?.value.trim()||'',retiredAt:existingPatientLifecycle(id,'retiredAt',null),retiredReason:existingPatientLifecycle(id,'retiredReason',''),mergedInto:existingPatientLifecycle(id,'mergedInto',''),mergedPatientIds:existingPatientLifecycle(id,'mergedPatientIds',[]),hnAliases:existingPatientLifecycle(id,'hnAliases',[]),microchipAliases:existingPatientLifecycle(id,'microchipAliases',[]),mergeAudit:existingPatientLifecycle(id,'mergeAudit',[]),createdAt:Date.now(),updatedAt:Date.now()};
}
async function upsertPatientMasterFromCurrent(){
  if(!$('patientName')?.value.trim())return null;
  let p=currentPatientMasterObject(),existing=patientCache.find(x=>x.patientId===p.patientId);
  const hn=normalizePatientKey(p.hospitalId),chip=normalizePatientKey(p.microchip);
  const conflicts=patientCache.filter(x=>x.patientId!==p.patientId&&!x.mergedInto&&((hn&&patientHnKeys(x).has(hn))||(chip&&patientChipKeys(x).has(chip))));
  const unique=[...new Map(conflicts.map(x=>[x.patientId,x])).values()];
  if(unique.length>1){
    alert('Data conflict: HN / microchip matches more than one Patient Master. Please check the identifiers before saving.');
    return false;
  }
  if(unique.length===1){
    const m=unique[0],sameHn=hn&&patientHnKeys(m).has(hn),sameChip=chip&&patientChipKeys(m).has(chip);
    const mismatch=[];
    if(normalizePatientKey(m.patientName)!==normalizePatientKey(p.patientName))mismatch.push(`Name: ${m.patientName} ↔ ${p.patientName}`);
    if((m.species||'')!==(p.species||''))mismatch.push(`Species: ${m.species||'—'} ↔ ${p.species||'—'}`);
    if(normalizePatientKey(m.breed)!==normalizePatientKey(p.breed)&&m.breed&&p.breed)mismatch.push(`Breed: ${m.breed} ↔ ${p.breed}`);
    const reason=[sameHn?'HN match':'',sameChip?'Microchip match':''].filter(Boolean).join(' + ');
    const diffText=mismatch.length?`\n\nDifferences:\n• ${mismatch.join('\n• ')}`:'';
    const choice=prompt(`⚠ Existing Patient Master match (${reason})\n\nExisting: ${m.patientName||'Unnamed'} • ${m.species==='cat'?'Cat':'Dog'}${m.breed?' • '+m.breed:''}\nForm: ${p.patientName||'Unnamed'} • ${p.species==='cat'?'Cat':'Dog'}${p.breed?' • '+p.breed:''}${diffText}\n\nType USE = load existing patient\nType NEW = create a separate patient (conflicting identifier(s) will be cleared)\nCancel = return to check HN / microchip`,'');
    if(choice===null||!choice.trim())return false;
    if(choice.trim().toUpperCase()==='USE'){
      usePatientMaster(m.patientId);toast('Existing Patient Master loaded • enter today’s current weight and save again');return false;
    }
    if(choice.trim().toUpperCase()==='NEW'){
      if(sameHn)setPatientField('hospitalId','');if(sameChip)setPatientField('microchip','');setPatientField('patientMasterId','');state.patientMasterId='';state.patientSaved=false;updatePatientSaveStatus();renderLinkedPatient();
      toast('Conflicting identifier cleared • enter a unique HN / microchip, then Save again');
      if(sameHn)$('hospitalId')?.focus();else $('microchip')?.focus();return false;
    }
    toast('No merge performed • type USE or NEW, or check the identifiers');return false;
  }
  if(existing){p.patientId=existing.patientId;p.createdAt=existing.createdAt||p.createdAt;p.retiredAt=existing.retiredAt||null;p.retiredReason=existing.retiredReason||'';p.mergedInto=existing.mergedInto||'';p.mergedPatientIds=Array.isArray(existing.mergedPatientIds)?existing.mergedPatientIds:[];p.hnAliases=Array.isArray(existing.hnAliases)?existing.hnAliases:[];p.microchipAliases=Array.isArray(existing.microchipAliases)?existing.microchipAliases:[];p.mergeAudit=Array.isArray(existing.mergeAudit)?existing.mergeAudit:[]}
  try{if(patientBackend==='IndexedDB')p=await idbPutPatient(p);else{patientCache=patientCache.filter(x=>x.patientId!==p.patientId);patientCache.unshift(p);saveFallbackPatients()}}
  catch(e){patientBackend='localStorage fallback';patientCache=patientCache.filter(x=>x.patientId!==p.patientId);patientCache.unshift(p);saveFallbackPatients()}
  patientCache=patientCache.filter(x=>x.patientId!==p.patientId);patientCache.unshift(p);setPatientField('patientMasterId',p.patientId);state.patientMasterId=p.patientId;renderPatientMaster();renderLinkedPatient();return p;
}

function syncAsaCards(){
  const selected=$('asa')?.value||'';
  $$('.asa-card').forEach(c=>c.classList.toggle('selected',!!selected&&c.dataset.asa===selected));
  if($('selectedAsaBadge')) $('selectedAsaBadge').textContent=selected?`ASA ${selected}${$('emergency')?.checked?'-E':''}`:'ASA —';
}
function updatePatientSaveStatus(){
  const el=$('patientSaveStatus');if(!el)return;
  if(state.patientSaved){
    el.className='status-pill good';el.textContent='SAVED';
  }else{
    el.className='status-pill warn';el.textContent='NOT SAVED';
  }
}
$$('.asa-card').forEach(card=>card.addEventListener('click',()=>{
  $('asa').value=card.dataset.asa;
  state.patientSaved=false;
  loadSettings();syncAsaCards();updatePatientSaveStatus();updateDashboard();
}));


function renderPatientRiskBanner(){
  const parts=[];
  const allergy=$('patientAllergies')?.value.trim(),disease=$('patientComorbidities')?.value.trim(),caution=$('patientPrecautions')?.value.trim();
  if(allergy)parts.push(`ALLERGY: ${allergy}`);
  if(disease)parts.push(`DISEASE: ${disease}`);
  if(caution)parts.push(`CAUTION: ${caution}`);
  const b=$('patientRiskBanner');if(!b)return;
  b.hidden=!parts.length;
  if($('patientRiskText'))$('patientRiskText').textContent=parts.join(' • ');
}
$('editRiskBtn')?.addEventListener('click',()=>setTab('patient'));

function syncPatientProcedureToCase(){
  const v=$('patientProcedure')?.value??'';
  if($('procedure') && $('procedure').value!==v) $('procedure').value=v;
}
function syncCaseProcedureToPatient(){
  const v=$('procedure')?.value??'';
  if($('patientProcedure') && $('patientProcedure').value!==v) $('patientProcedure').value=v;
}
$('patientProcedure')?.addEventListener('input',()=>{syncPatientProcedureToCase();state.patientSaved=false;updatePatientSaveStatus();updateDashboard()});
$('procedure')?.addEventListener('input',()=>{syncCaseProcedureToPatient();updateDashboard()});

$('savePatientBtn').addEventListener('click',async()=>{
  renderAgeUI();
  const name=$('patientName').value.trim(),species=$('species')?.value||'',weight=Number($('weight').value);
  if(!name){toast('กรุณาใส่ชื่อสัตว์');$('patientName').focus();return}
  if(!species){toast('กรุณาเลือก Species');$('species')?.focus();return}
  if(!Number.isFinite(weight)||weight<=0){toast('กรุณาใส่น้ำหนักที่ถูกต้อง');$('weight').focus();return}
  syncPatientProcedureToCase();const master=await upsertPatientMasterFromCurrent();if(master===false)return;state.patientSaved=true;save();syncAsaCards();updatePatientSaveStatus();
  // V14.6.4: current-weight dependent UI was calculated while patientSaved=false during typing.
  // Recalculate immediately after Save so a NEW patient's confirmed BW propagates to Drug/Fluid/Plan views
  // without requiring a reload, another field edit, or re-selecting the patient.
  updateDashboard();
  toast('บันทึก Patient Master + Case Setup แล้ว');setTab('preop');
});
$('editPatientBtn').addEventListener('click',()=>setTab('patient'));
['patientName','hospitalId','visitId','species','sex','reproductiveStatus','microchip','breed','birthDate','approxAgeYears','approxAgeMonths','approxAgeWeeks','weight','bcs','emergency','patientProcedure','patientAllergies','patientComorbidities','patientPrecautions','surgeon','anesthetist','surgicalAssistant'].forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',()=>{
    state.patientSaved=false;updatePatientSaveStatus();
  });
});


function renderPreop(){
  const checks=$$('.preop-check'),total=checks.length;
  const done=checks.filter(x=>x.checked).length,na=$$('.preop-item.na').length,reviewed=done+na;
  if($('preopProgress')){$('preopProgress').textContent=`${reviewed}/${total} REVIEWED`;$('preopProgress').className=`status-pill ${reviewed===total?'good':'warn'}`;}
  if($('preopWarning'))$('preopWarning').textContent=reviewed===total?'Pre-anesthetic checklist reviewed':'ยังมีรายการที่ต้องเลือก Done หรือ N/A';
  save();
}
$$('.preop-check').forEach(el=>el.addEventListener('change',()=>{
  if(el.checked)el.closest('.preop-item')?.classList.remove('na');
  renderPreop();
}));
$$('.preop-na-btn').forEach(btn=>btn.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();
  const item=btn.closest('.preop-item'),next=!item.classList.contains('na');
  item.classList.toggle('na',next);
  const cb=item.querySelector('.preop-check');if(next&&cb)cb.checked=false;
  renderPreop();
}));
$('goDrugCalculatorBtn')?.addEventListener('click',()=>setTab('drugs'));
$('goOrLiveFromPreopBtn')?.addEventListener('click',()=>setTab('orlive'));
$('goOrLiveFromDrugBtn')?.addEventListener('click',()=>setTab('orlive'));
$('openPreopBtn')?.addEventListener('click',()=>setTab('preop'));


const OR_SYNC={orHr:'hr',orRr:'rr',orSap:'sap',orMap:'map',orDap:'dap',orSpo2:'spo2',orEtco2:'etco2',orTemp:'temp',orVaporizer:'vaporizer',orO2:'o2flow',orFluidRate:'fluidRateInput',orDepth:'depth',orVentilation:'ventilation'};
let wakeLock=null;
function syncOrFromMain(){Object.entries(OR_SYNC).forEach(([aId,bId])=>{const a=$(aId),b=$(bId);if(a&&b&&document.activeElement!==a)a.value=b.value})}
function syncMainFromOr(orId){const mainId=OR_SYNC[orId],a=$(orId),b=$(mainId);if(!a||!b)return;b.value=a.value;b.dispatchEvent(new Event(b.tagName==='SELECT'?'change':'input',{bubbles:true}))}
Object.keys(OR_SYNC).forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>syncMainFromOr(id))});
['map','spo2','orMap','orSpo2'].forEach(id=>$(id)?.addEventListener('blur',()=>setTimeout(maybeShowCriticalClinicalAlert,0)));
function orStatusText(level,good,warn,danger){return level==='neutral'?'No measurement entered':level==='danger'?danger:level==='warn'?warn:good}
function sparkSvg(values,minHint=null,maxHint=null){const vals=values.filter(v=>v!==null&&v!==''&&v!==undefined).map(Number).filter(Number.isFinite);if(vals.length<2)return '<div class="or-spark-empty">Need ≥2 records</div>';let min=Math.min(...vals),max=Math.max(...vals);if(Number.isFinite(minHint))min=Math.min(min,minHint);if(Number.isFinite(maxHint))max=Math.max(max,maxHint);if(max===min){max+=1;min-=1}const w=220,h=70,p=7;const coords=vals.map((v,i)=>{const x=p+(i/(vals.length-1))*(w-p*2),y=h-p-((v-min)/(max-min))*(h-p*2);return [x.toFixed(1),y.toFixed(1)]});const pts=coords.map(x=>x.join(',')).join(' '),last=coords[coords.length-1],lastVal=vals[vals.length-1];return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#14758c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3.5" fill="#0d5265"/><text x="${w-p}" y="${p+7}" text-anchor="end" font-size="10" fill="#54656f">${escapeHtml(lastVal)}</text></svg>`}
function renderOrMiniTrends(){const r=(state.records||[]).slice(-6),isC=activeTempDisplayUnit==='C',m={orSparkMap:['map',55,80],orSparkSpo2:['spo2',90,100],orSparkEtco2:['etco2',30,60],orSparkTemp:['temp',isC?tempStoredFToDisplay(98):98,isC?tempStoredFToDisplay(100):100]};Object.entries(m).forEach(([id,[key,min,max]])=>{if(!$(id))return;const vals=r.map(x=>key==='temp'&&x[key]!==null&&x[key]!==''&&x[key]!==undefined?tempStoredFToDisplay(x[key]):x[key]);$(id).innerHTML=sparkSvg(vals,min,max)})}
function renderOrRecent(){const items=[...(state.records||[]).slice(-5).map(r=>({epoch:r.epoch,elapsedMs:r.elapsedMs,kind:'Record',desc:`HR ${r.hr??'—'} • MAP ${r.map??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp==null?'—':tempTextF(r.temp)}`})),...(state.events||[]).slice(-5).map(e=>({epoch:e.epoch,elapsedMs:e.elapsedMs,kind:e.category,desc:`${e.name}${e.dose?' • '+e.dose:''}`}))].sort((a,b)=>b.epoch-a.epoch).slice(0,7);const box=$('orRecentActivity');if(!box)return;if(!items.length){box.className='or-recent-list empty-state compact';box.textContent='ยังไม่มีข้อมูล';return}box.className='or-recent-list';box.innerHTML=items.map(i=>`<div class="or-recent-item"><span class="t">${escapeHtml(formatShortElapsed(i.elapsedMs))}</span><span class="kind">${escapeHtml(i.kind)}</span><span class="desc">${escapeHtml(i.desc)}</span></div>`).join('')}
function renderOrTimerState(){if(!$('orTimerState'))return;if(state.timer.running){$('orTimerState').className='timer-state running';$('orTimerState').textContent='● RUNNING';$('orStartBtn').textContent='Running';$('orStartBtn').disabled=true;$('orPauseBtn').disabled=false;$('orPauseBtn').textContent='Pause case'}else if((state.timer.elapsedMs||0)>0){$('orTimerState').className='timer-state paused';$('orTimerState').textContent='PAUSED';$('orStartBtn').textContent='▶ Resume';$('orStartBtn').disabled=false;$('orPauseBtn').disabled=true;$('orPauseBtn').textContent='Paused'}else{$('orTimerState').className='timer-state ready';$('orTimerState').textContent='READY';$('orStartBtn').textContent='▶ Start case';$('orStartBtn').disabled=false;$('orPauseBtn').disabled=true;$('orPauseBtn').textContent='Pause'}$('orCaseClock').textContent=formatElapsed(currentElapsed())}

function renderAirwayPanel(){
  const mode=$('airwayVentMode')?.value||'';
  if($('ventilatorFields'))$('ventilatorFields').hidden=mode!=='Mechanical ventilation';
  const recorded=!!($('airwayEttSize')?.value||$('airwayCircuit')?.value||$('airwayDifficulty')?.value);
  if($('airwayStatus')){$('airwayStatus').textContent=recorded?'RECORDED':'NOT RECORDED';$('airwayStatus').className=`status-pill ${recorded?'good':'warn'}`;}
}
$('airwayVentMode')?.addEventListener('change',()=>{renderAirwayPanel();if($('orVentilation')){$('orVentilation').value=$('airwayVentMode').value;syncMainFromOr('orVentilation')}save()});
['airwayEttSize','airwayEttDepth','airwayCuff','airwayDifficulty','airwayCircuit','airwayVt','airwayPip','airwayPeep','airwayVentRr'].forEach(id=>{
  const el=$(id);if(!el)return;el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{renderAirwayPanel();save()});
});
$('saveAirwayBtn')?.addEventListener('click',()=>{
  save();renderAirwayPanel();
  const parts=[];if($('airwayEttSize').value)parts.push(`ETT ${$('airwayEttSize').value} mm`);if($('airwayEttDepth').value)parts.push(`depth ${$('airwayEttDepth').value} cm`);if($('airwayDifficulty').value)parts.push($('airwayDifficulty').value);if($('airwayVentMode').value)parts.push($('airwayVentMode').value);
  addEvent({category:'Airway',name:'Airway record updated',note:parts.join(' • ')||'Airway record updated'});toast('Airway record saved');
});
$('orVentilation')?.addEventListener('change',()=>{if($('airwayVentMode')){$('airwayVentMode').value=$('orVentilation').value;renderAirwayPanel();save()}});

function renderOrLive(){
  if(!$('orlive'))return;
  renderOrPhaseTracker();
  syncOrFromMain();
  const st=thresholds(),species=$('species').value,name=$('patientName').value.trim()||'Unnamed patient',breed=$('breed').value.trim(),weight=getVal('weight',0);
  $('orPatientName').textContent=name;$('orPatientMeta').textContent=`${species==='cat'?'Cat':species==='dog'?'Dog':'—'}${$('sex')?.value?' • '+({male:'M',female:'F'}[$('sex').value]||''):''}${$('reproductiveStatus')?.value?' '+({intact:'intact',neutered:'neutered',spayed:'spayed'}[$('reproductiveStatus').value]||''):''}${breed?' • '+breed:''}${$('age')?.value?' • '+$('age').value:''} • ${weight??'—'} kg`;
  $('orAsaBadge').textContent=`ASA ${$('asa').value}${$('emergency').checked?'-E':''}`;
  $('orProcedureLine').textContent=`Procedure: ${$('procedure').value.trim()||$('patientProcedure')?.value.trim()||'—'}`;
  if($('orTeamLine'))$('orTeamLine').textContent=`Team: Surgeon ${$('surgeon')?.value.trim()||'—'} • Anesthetist ${$('anesthetist')?.value.trim()||'—'} • Assistant ${$('surgicalAssistant')?.value.trim()||'—'}`;
  const riskParts=[];
  if($('patientAllergies')?.value.trim())riskParts.push(`Allergy: ${$('patientAllergies').value.trim()}`);
  if($('patientComorbidities')?.value.trim())riskParts.push(`Disease: ${$('patientComorbidities').value.trim()}`);
  if($('patientPrecautions')?.value.trim())riskParts.push(`Caution: ${$('patientPrecautions').value.trim()}`);
  if($('orRiskLine')){$('orRiskLine').hidden=!riskParts.length;$('orRiskLine').textContent=riskParts.length?'⚠ '+riskParts.join(' • '):'';}
  if($('orStickyPhase'))$('orStickyPhase').textContent=phaseLabel();if($('orStickyClock'))$('orStickyClock').textContent=formatElapsed(currentElapsed());
    $('orPhaseBadge').textContent=phaseLabel();
  $('orPhaseBadge').className=`status-pill phase ${phaseClass()}`;
  $('orlive').classList.toggle('recovery-mode',state.casePhase==='recovery');
  $('orlive').classList.toggle('emergency-return-mode',state.casePhase==='emergency');
  const overall=$('globalStatus').textContent;$('orGlobalStatus').textContent=overall;$('orGlobalStatus').className=overall==='INTERVENE'?'or-status-danger':overall==='REASSESS'?'or-status-warn':overall==='NO DATA'?'or-status-neutral':'or-status-good';
  const latest=latestRecord();$('orLastRecord').textContent=latest?`${latest.clock} • ${formatShortElapsed(latest.elapsedMs)}`:'—';
  if(latest){
    const due=latest.epoch+Number($('recordInterval').value||5)*60000,delta=due-Date.now();
    $('orNextDue').textContent=delta<=0?`DUE +${Math.floor(Math.abs(delta)/60000)}:${pad(Math.floor((Math.abs(delta)%60000)/1000))}`:`in ${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;
    $('orNextDueClock').textContent=`clock ${formatClock(due)}`;
    $('orRecordNowBtn').classList.toggle('due',delta<=0);

    $('orRecordNowBtn').textContent=delta<=0?'🔴 RECORD DUE':`＋ RECORD NOW • ${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;
  }else{
    const interval=Number($('recordInterval').value||5)*60000;
    if(state.caseStartedAt){
      const remaining=interval-currentElapsed(),dueNow=remaining<=0;
      $('orNextDue').textContent=dueNow?`FIRST DUE +${Math.floor(Math.abs(remaining)/60000)}:${pad(Math.floor((Math.abs(remaining)%60000)/1000))}`:`first in ${Math.floor(remaining/60000)}:${pad(Math.floor((remaining%60000)/1000))}`;
      $('orNextDueClock').textContent=`case + ${Math.round(interval/60000)} min`;
      $('orRecordNowBtn').classList.toggle('due',dueNow);$('orRecordNowBtn').textContent=dueNow?'🔴 FIRST RECORD DUE':`＋ RECORD FIRST SET • ${Math.floor(remaining/60000)}:${pad(Math.floor((remaining%60000)/1000))}`;
    }else{$('orNextDue').textContent='Starts with case';$('orNextDueClock').textContent='—';$('orRecordNowBtn').classList.remove('due');$('orRecordNowBtn').textContent='＋ RECORD FIRST SET'}
  }
  if($('orStickyDue')){$('orStickyDue').textContent=$('orNextDue')?.textContent||'—';$('orStickyDue').classList.toggle('due',$('orRecordNowBtn')?.classList.contains('due'))}
  const hints={hr:orStatusText(st.hr,species==='cat'?'100–180 screening':'60–150 screening','Reassess HR','Critical HR alert'),rr:orStatusText(st.rr,species==='cat'?'10–28 screening':'8–20 screening','Reassess RR','Critical RR / apnea risk'),map:orStatusText(st.map,'MAP acceptable','MAP 60–69','MAP <60'),spo2:orStatusText(st.spo2,'≥95%','SpO₂ <95%','SpO₂ <90%'),etco2:orStatusText(st.etco2,'40–55','Outside usual range','Critical ETCO₂ range'),temp:orStatusText(st.temp,'Temp acceptable','Warming indicated',`<${tempTextF(98)}`)};
  for(const key of WF.metrics)hints[key]=alertThresholdHint(key,st[key]);
  const cap={hr:'Hr',rr:'Rr',map:'Map',spo2:'Spo2',etco2:'Etco2',temp:'Temp'};
  ['hr','rr','map','spo2','etco2','temp'].forEach(k=>{const card=document.querySelector(`.or-vital-card[data-vital="${k}"]`);if(card){card.classList.remove('good','warn','danger','neutral');card.classList.add(st[k])}const h=$('or'+cap[k]+'Hint');if(h)h.textContent=hints[k]});
  const immediate=[];
  if(['warn','danger'].includes(st.hr))immediate.push({key:'hr',level:st.hr,title:'HR alert',text:hints.hr});
  if(['warn','danger'].includes(st.rr))immediate.push({key:'rr',level:st.rr,title:'RR alert',text:hints.rr});
  if(['warn','danger'].includes(st.map))immediate.push({key:'map',level:st.map,title:'Blood pressure',text:hints.map});
  if(['warn','danger'].includes(st.spo2))immediate.push({key:'spo2',level:st.spo2,title:'Oxygenation',text:hints.spo2});
  if(['warn','danger'].includes(st.etco2))immediate.push({key:'etco2',level:st.etco2,title:'Ventilation',text:hints.etco2});
  if(['warn','danger'].includes(st.temp))immediate.push({key:'temp',level:st.temp,title:'Temperature',text:hints.temp});
  immediate.sort((a,b)=>(a.level==='danger'?0:1)-(b.level==='danger'?0:1));
  const trends=withAlertAdvice(getSmartAlerts()),immediateWithAdvice=withAlertAdvice(immediate);
  const total=immediateWithAdvice.length+trends.length;$('orAlertCount').textContent=`${total} ALERT${total===1?'':'S'}`;$('orAlertCount').className=`status-pill ${immediateWithAdvice.some(a=>a.level==='danger')||trends.some(a=>a.level==='danger')?'danger':total?'warn':'good'}`;
  const group=(title,kind,arr)=>arr.length?`<div class="or-alert-group ${kind}"><div class="or-alert-group-title">${title}</div>${arr.map(a=>`<div class="or-alert-item ${a.level}"><b>${escapeHtml(a.title)}</b><span>${escapeHtml(a.text)}</span>${a.advice?`<small class="alert-advice">Suggested first checks: ${escapeHtml(a.advice)}</small>`:''}</div>`).join('')}</div>`:'';
  $('orAlertList').innerHTML=total?group('Immediate','immediate',immediateWithAdvice)+group('Trend','trend',trends):'<div class="empty-state compact">No active alerts</div>';
  renderOrFluidPanel();renderOrMiniTrends();renderOrRecent();renderOrTimerState();renderSaveState();renderRecoveryState();renderComplications();renderAlertProtocolStatus();renderActiveProblems();
}
function startCaseFromOr(){if(!clinicalWriteAllowed())return false;if(state.timer.running)return true;if(!validateCaseReadyToStart())return false;const preopTotal=$$('.preop-check').length,preopDone=$$('.preop-check').filter(x=>x.checked).length,preopNA=$$('.preop-item.na').length,preopReviewed=preopDone+preopNA;if(preopReviewed<preopTotal&&!confirm(`Pre-op checklist ยัง review ไม่ครบ (${preopReviewed}/${preopTotal}) — ต้องการเริ่มเคสต่อหรือไม่?`))return false;const firstStart=(state.timer.elapsedMs||0)===0&&!state.caseStartedAt;state.timer.running=true;state.timer.startedEpoch=Date.now();if(firstStart){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';captureProtocolSnapshot();addAudit('CASE_STARTED','Anesthesia case timer started');}startTimerLoop();renderTimerState();renderOrTimerState();renderCasePhase();save();if(autoWakeEnabled())requestScreenWakeLock(true);if(firstStart)addEvent({category:'Case',name:'Case started',note:'Anesthesia case timer started'});toast(firstStart?'Case timer started':'Case timer resumed');return true}
$('orStartBtn')?.addEventListener('click',startCaseFromOr);$('orPauseBtn')?.addEventListener('click',()=>{pauseTimer();renderOrLive()});$('orRecordNowBtn')?.addEventListener('click',()=>{if(!state.timer.running&&(state.timer.elapsedMs||0)===0){if(!startCaseFromOr())return}addRecord('');renderOrLive()});$('openOrLiveBtn')?.addEventListener('click',()=>setTab('orlive'));$('orOpenDrugBtn')?.addEventListener('click',openOrQuickDrug);$('orOpenTrendsBtn')?.addEventListener('click',()=>setTab('trends'));$('orOpenTimelineBtn')?.addEventListener('click',()=>setTab('timeline'));
$$('.or-milestone').forEach(btn=>btn.addEventListener('click',()=>{markMilestone(btn);renderOrLive()}));$$('.or-event').forEach(btn=>btn.addEventListener('click',()=>{addEvent({category:btn.dataset.cat,name:btn.dataset.label});renderOrLive()}));$$('.or-complication').forEach(btn=>btn.addEventListener('click',()=>openComplicationDialog(btn.dataset.complication||'')));
$('orFullscreenBtn')?.addEventListener('click',async()=>{try{if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();document.body.classList.add('or-fullscreen');$('orFullscreenBtn').textContent='Exit full screen'}else{if(document.exitFullscreen)await document.exitFullscreen();document.body.classList.remove('or-fullscreen');$('orFullscreenBtn').textContent='⛶ Full screen'}}catch(e){document.body.classList.toggle('or-fullscreen')}});document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('or-fullscreen');if($('orFullscreenBtn'))$('orFullscreenBtn').textContent='⛶ Full screen'}});
function renderBuiltInProtocolChips(cfg=currentSettingsObject()){
  const source=state?.protocolSnapshot?.builtInProtocol?activeBuiltInProtocol():cfg;
  const n=(k,f)=>Number(source?.[k]??f);
  if($('diazepamProtocolChip'))$('diazepamProtocolChip').textContent=`${fmtDose(n('diazepamDose',0.25))} mg/kg`;
  if($('propofolProtocolChip'))$('propofolProtocolChip').textContent=`${fmtDose(n('propofolDose',4))} mg/kg planned`;
  if($('tramadolProtocolChip'))$('tramadolProtocolChip').textContent=`${fmtDose(n('tramadolDose',4))} mg/kg`;
  if($('carprofenProtocolChip'))$('carprofenProtocolChip').textContent=`DOG • ${fmtDose(n('carprofenDose',4.4))} mg/kg`;
  if($('meloxicamProtocolChip'))$('meloxicamProtocolChip').textContent=`CAT • ${fmtDose(n('meloxicamDose',0.3))} mg/kg`;
  if($('cefazolinProtocolChip'))$('cefazolinProtocolChip').textContent=`BW ÷ ${fmtDose(n('cefazolinDivisor',10))} mL`;
  if($('conveniaProtocolChip'))$('conveniaProtocolChip').textContent=`BW ÷ ${fmtDose(n('conveniaDivisor',10))} mL`;
  if($('adrenalineProtocolChip'))$('adrenalineProtocolChip').textContent=`CPR ${fmtDose(n('adrenalineDose',0.01))} mg/kg IV/IO`;
  if($('atropineProtocolChip'))$('atropineProtocolChip').textContent=`Bradycardia ${fmtDose(n('atropineBradyDose',0.02))} mg/kg IV`;
  const mode=$('atropineMode');if(mode){const prev=mode.value,br=n('atropineBradyDose',0.02),cpr=n('atropineCprDose',0.04);mode.innerHTML=`<option value="${br}">Intra-op bradycardia • ${fmtDose(br)} mg/kg</option><option value="${cpr}">CPR / severe vagal bradycardia • ${fmtDose(cpr)} mg/kg</option>`;mode.value=[String(br),String(cpr)].includes(String(prev))?String(prev):String(br)}
}

function currentSettingsObject(){try{const x=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||JSON.parse(localStorage.getItem('anesvet_v14_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_4_settings')||'null');return {...defaultSettings(),...(x||{})}}catch(e){return defaultSettings()}}
async function requestScreenWakeLock(silent=true){if(!('wakeLock' in navigator))return false;try{if(wakeLock)return true;wakeLock=await navigator.wakeLock.request('screen');if($('orWakeBtn'))$('orWakeBtn').textContent='☀ Awake ON';wakeLock.addEventListener('release',()=>{wakeLock=null;if($('orWakeBtn'))$('orWakeBtn').textContent='☀ Keep awake'});if(!silent)toast('Screen will stay awake');return true}catch(e){if(!silent)toast('ไม่สามารถเปิด screen wake lock ได้');return false}}
async function releaseScreenWakeLock(silent=true){try{if(wakeLock)await wakeLock.release()}catch(e){}finally{wakeLock=null;if($('orWakeBtn'))$('orWakeBtn').textContent='☀ Keep awake'}if(!silent)toast('Screen wake lock off')}
function autoWakeEnabled(){return currentSettingsObject().autoWakeLock!==false}
$('orWakeBtn')?.addEventListener('click',async()=>{if(!('wakeLock' in navigator)){toast('Wake Lock ไม่รองรับใน browser นี้');return}if(wakeLock)await releaseScreenWakeLock(false);else await requestScreenWakeLock(false)});

function closeMoreMenu(){const m=$('moreMenu');if(m)m.hidden=true}
$('moreMenuBtn')?.addEventListener('click',(e)=>{
  e.preventDefault();e.stopPropagation();
  const m=$('moreMenu');if(m)m.hidden=!m.hidden;
});
$$('[data-more-tab]').forEach(btn=>btn.addEventListener('click',()=>{closeMoreMenu();setTab(btn.dataset.moreTab)}));

function syncQuickConcentrations(){
  const pairs={quickDiazepamConc:'diazepamConc',quickPropofolConc:'propofolConc',quickTramadolConc:'tramadolConc',quickRimadylConc:'rimadylConc',quickMetacamConc:'metacamConc',quickAtropineConc:'atropineConc'};
  Object.entries(pairs).forEach(([q,m])=>{if($(q)&&$(m))$(q).value=$(m).value});
}
$('toggleConcentrationBtn')?.addEventListener('click',()=>{const d=$('concentrationDrawer');if(!d)return;d.hidden=!d.hidden;if(!d.hidden)syncQuickConcentrations()});
$('openSettingsFromDrugBtn')?.addEventListener('click',()=>setTab('settings'));
$('saveQuickConcentrationBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked — concentration แก้ไม่ได้');return}
  const pairs={quickDiazepamConc:'diazepamConc',quickPropofolConc:'propofolConc',quickTramadolConc:'tramadolConc',quickRimadylConc:'rimadylConc',quickMetacamConc:'metacamConc',quickAtropineConc:'atropineConc'};
  Object.entries(pairs).forEach(([q,m])=>{if($(q)&&$(m)&&Number($(q).value)>0){$(m).value=$(q).value;$(m).dispatchEvent(new Event('input',{bubbles:true}))}});
  const settingsPairs={settingDiazepamConc:'diazepamConc',settingPropofolConc:'propofolConc',settingTramadolConc:'tramadolConc',settingRimadylConc:'rimadylConc',settingMetacamConc:'metacamConc',settingAtropineConc:'atropineConc'};
  Object.entries(settingsPairs).forEach(([s,m])=>{if($(s)&&$(m))$(s).value=$(m).value});
  $('saveSettingsBtn')?.click();updateDoseSpotlights();renderCasePhase();toast('Drug concentrations updated');
});
function mlText(id){const t=$(id)?.textContent||'';const m=t.match(/([0-9]+(?:\.[0-9]+)?)\s*mL/i);return m?m[1]:'—'}
function updateDoseSpotlights(){renderQuickPresetSummary();}
function renderFinalSignoff(){
  state.finalSignoff=state.finalSignoff||{anesthetist:null,surgeon:null};
  const defs=[['anesthetist','signoffAnesthetistName','signoffAnesthetistTime','signAnesthetistBtn'],['surgeon','signoffSurgeonName','signoffSurgeonTime','signSurgeonBtn']];
  defs.forEach(([role,nameId,timeId,btnId])=>{
    const signed=state.finalSignoff[role],source=$(role)?.value.trim()||'';
    if($(nameId))$(nameId).textContent=signed?.name||source||'—';
    if($(timeId))$(timeId).textContent=signed?`Signed ${formatDate(signed.epoch)} ${formatClock(signed.epoch)}`:'Not signed';
    if($(btnId)){$(btnId).disabled=!!signed;$(btnId).textContent=signed?'✓ Signed':`✓ Sign ${role}`;$(btnId).closest('.signoff-card')?.classList.toggle('signed',!!signed)}
  });
  const ok=!!state.finalSignoff.anesthetist&&!!state.finalSignoff.surgeon;
  if($('finalSignoffStatus')){$('finalSignoffStatus').textContent=ok?'SIGNED':'SIGN-OFF REQUIRED';$('finalSignoffStatus').className=`status-pill ${ok?'good':'warn'}`}
  return ok;
}
function signFinalRole(role){
  if(state.caseLocked){toast('Record already locked');return}
  const name=$(role)?.value.trim();if(!name){toast(`กรุณากรอกชื่อ ${role} ใน Patient & Case Setup ก่อน`);return}
  if(!confirm(`Sign final record as ${role}?\n${name}`))return;
  state.finalSignoff=state.finalSignoff||{anesthetist:null,surgeon:null};
  state.finalSignoff[role]={name,epoch:Date.now()};addAudit('FINAL_SIGNOFF',`${role}: ${name}`,name);save();renderFinalSignoff();renderEndCase();
}
$('signAnesthetistBtn')?.addEventListener('click',()=>signFinalRole('anesthetist'));
$('signSurgeonBtn')?.addEventListener('click',()=>signFinalRole('surgeon'));

function renderEndCase(){
  if(!$('endcase'))return;
  $('endPatient').textContent=`${$('patientName')?.value.trim()||'Unnamed'} • ${{cat:'Cat',dog:'Dog'}[$('species')?.value]||'—'} • ${$('weight')?.value||'—'} kg`;
  $('endProcedure').textContent=$('procedure')?.value.trim()||'—';
  $('endDuration').textContent=formatElapsed(currentElapsed());
  $('endRecordCount').textContent=(state.records||[]).length;
  $('endEventCount').textContent=(state.events||[]).length;
  if($('endDrugAdminCount'))$('endDrugAdminCount').textContent=(state.drugAdministrations||[]).filter(x=>!x.voidedAt).length;
  const activeComplications=(state.complications||[]).filter(x=>x.status!=='resolved').length;if($('endActiveComplications'))$('endActiveComplications').textContent=String(activeComplications);
  $('endRecoveryStatus').textContent=state.recoveryCompletedAt?'Complete':'Review recovery';
  const latestScore=(state.recoveryScores||[]).at(-1);if($('endRecoveryScore'))$('endRecoveryScore').textContent=latestScore?`${latestScore.total}/${latestScore.possible} (${latestScore.percent}%)`:'—';
  const endFm=getFluidMetrics();
  if($('endFluidTotal'))$('endFluidTotal').textContent=`${fmtVol(endFm.totalIn)} mL`;
  if($('endBloodLoss'))$('endBloodLoss').textContent=`${fmtVol(endFm.loss)} mL`;
  if($('endUrine'))$('endUrine').textContent=`${fmtVol(endFm.urine)} mL`;
  const signoffReady=renderFinalSignoff();
  const ready=signoffReady&&!(state.alertEpisodes||[]).some(a=>!a.resolvedAt)&&activeComplications===0&&['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].every(id=>!!$(id)?.checked);
  $('endCaseReadiness').textContent=ready?'READY TO END':'REVIEW';
  $('endCaseReadiness').className=`status-pill ${ready?'good':'warn'}`;
}
['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].forEach(id=>$(id)?.addEventListener('change',renderEndCase));
$('endBackupBtn')?.addEventListener('click',backupAllData);
$('endExportPdfBtn')?.addEventListener('click',()=>exportPdfReport());
$('endSaveArchiveBtn')?.addEventListener('click',async()=>{if(!clinicalWriteAllowed())return;if((state.alertEpisodes||[]).some(a=>!a.resolvedAt)){toast('Resolve active alerts / document outcome before Lock');return}const activeComplications=(state.complications||[]).filter(x=>x.status!=='resolved').length;const ready=renderFinalSignoff()&&activeComplications===0&&['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].every(id=>!!$(id)?.checked);if(activeComplications){toast(`ยังมี ${activeComplications} active complication — resolve/document outcome ก่อน Lock`);return}if(!ready){toast('กรุณาตรวจ checklist และ Final Sign-off ก่อน End Case');return}if(!confirm('End, LOCK & Archive this anesthesia case? หลัง archive เคสนี้จะถือเป็น final record'))return;if(state.timer.running)pauseTimer();state.casePhase='complete';state.caseLocked=true;state.lockedAt=Date.now();addAudit('CASE_LOCKED','Final clinical record locked');state.finalChecksum=await computeCaseChecksum(state);state.checksumAlgorithm='SHA-256';state.checksumCreatedAt=Date.now();renderCasePhase();save({persistLocked:true});await releaseScreenWakeLock(true);const ok=await archiveSnapshot();if(ok)setTimeout(()=>resetCurrent(),350)});


let amendmentArchiveIndex=null;
function openAmendmentDialog(i){const c=getArchive()[i];if(!c||!c.caseLocked){toast('Amendment ใช้กับ locked final record');return}amendmentArchiveIndex=i;$('amendmentCaseName').textContent=`${c.patientName||'Unnamed'} • ${c.procedure||c.patientProcedure||'—'}`;$('amendmentAuthor').value=$('anesthetist')?.value.trim()||'';$('amendmentReason').value='';$('amendmentText').value='';const d=$('amendmentDialog');if(d?.showModal)d.showModal();else d?.setAttribute('open','')}
function closeAmendmentDialog(){const d=$('amendmentDialog');if(!d)return;if(d.close)d.close();else d.removeAttribute('open');amendmentArchiveIndex=null}
$('amendmentCloseBtn')?.addEventListener('click',closeAmendmentDialog);$('amendmentCancelBtn')?.addEventListener('click',closeAmendmentDialog);
$('amendmentSaveBtn')?.addEventListener('click',async()=>{const i=amendmentArchiveIndex,c=getArchive()[i];if(!c)return;const author=$('amendmentAuthor').value.trim(),reason=$('amendmentReason').value.trim(),text=$('amendmentText').value.trim();if(!author||!reason||!text){toast('กรุณากรอก Author, Reason และ Amendment');return}if(!confirm('Add amendment to LOCKED FINAL record?\\nOriginal clinical data จะไม่ถูกแก้'))return;c.amendments=c.amendments||[];const a={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),epoch:Date.now(),clock:formatClock(),author,reason,text};c.amendments.push(a);c.auditTrail=c.auditTrail||[];c.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+1),epoch:Date.now(),clock:formatClock(),elapsedMs:c.timer?.elapsedMs||0,action:'AMENDMENT_ADDED',detail:`${reason} • ${text}`,actor:author});try{if(archiveBackend==='IndexedDB')await idbPutCase(c);else localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache));closeAmendmentDialog();renderArchives();toast('Amendment added')}catch(e){toast('Amendment save failed')}});
function renderCaseSummary(){
  if(!$('casesummary'))return;
  const species=({cat:'Cat',dog:'Dog'})[$('species')?.value]||'—';
  $('summaryPatient').textContent=`${$('patientName')?.value.trim()||'Unnamed'} • ${species} • ${$('weight')?.value||'—'} kg`;
  $('summaryAsa').textContent=`ASA ${$('asa')?.value||'—'}${$('emergency')?.checked?'-E':''}`;
  $('summaryProcedure').textContent=$('procedure')?.value.trim()||$('patientProcedure')?.value.trim()||'—';
  $('summarySurgeon').textContent=$('surgeon')?.value.trim()||'—';
  $('summaryAnesthetist').textContent=$('anesthetist')?.value.trim()||'—';
  $('summaryAssistant').textContent=$('surgicalAssistant')?.value.trim()||'—';
  $('summaryRecordCount').textContent=(state.records||[]).length;
  $('summaryEventCount').textContent=(state.events||[]).length;
  const fluidEntered=hasFluidCaseData();
  $('summaryFluidRate').textContent=fluidEntered?`${fmtVol(currentFluidRate())} mL/hr`:'—';
  const fm=getFluidMetrics();
  $('summaryFluidTotal').textContent=fluidEntered?`${fmtVol(fm.totalIn)} mL`:'—';
  $('summaryBloodLoss').textContent=fluidEntered?`${fmtVol(fm.loss)} mL`:'—';
  $('summaryCaseTime').textContent=formatElapsed(currentElapsed());
  const risks=[];
  if($('patientAllergies')?.value.trim())risks.push(`ALLERGY: ${$('patientAllergies').value.trim()}`);
  if($('patientComorbidities')?.value.trim())risks.push(`DISEASE: ${$('patientComorbidities').value.trim()}`);
  if($('patientPrecautions')?.value.trim())risks.push(`CAUTION: ${$('patientPrecautions').value.trim()}`);
  $('summaryRiskBox').hidden=!risks.length;
  $('summaryRiskText').textContent=risks.join(' • ')||'—';
}

function scrollAppTop(){
  requestAnimationFrame(()=>{
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(e){window.scrollTo(0,0)}
    document.documentElement.scrollTop=0;document.body.scrollTop=0;
  });
}
function orLiveLockedByRecovery(){
  return ['recovery','complete'].includes(state.casePhase) && !state.emergencyReturnActive;
}
function renderWorkflowLocks(){
  const tab=document.querySelector('.or-live-tab');
  if(tab){
    const locked=orLiveLockedByRecovery();
    tab.classList.toggle('locked-step',locked);
    tab.setAttribute('aria-disabled',locked?'true':'false');
    tab.title=locked?'Recovery active — ใช้ Emergency return to OR LIVE เมื่อจำเป็น':'';
  }
  if($('emergencyReturnOrBtn'))$('emergencyReturnOrBtn').disabled=state.casePhase!=='recovery'||!!state.recoveryCompletedAt;
}
function setTab(id,opts={}){
  if(!id || !document.getElementById(id)) return;
  if(id==='orlive' && orLiveLockedByRecovery() && !opts.force){
    toast('Recovery active — OR LIVE ถูกล็อก หากฉุกเฉินให้กด Emergency return to OR LIVE');
    renderWorkflowLocks();scrollAppTop();return;
  }
  closeMoreMenu();
  $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  $$('.tabpage').forEach(p=>p.classList.toggle('active',p.id===id));
  localStorage.setItem(TAB_KEY,id);
  if(id==='trends') renderTrends();
  if(id==='cases'){renderArchives();renderBackupHealth();}
  if(id==='casesummary') renderCaseSummary();
  if(id==='orlive'){renderOrLive();renderAirwayPanel();}
  if(id==='drugs'){updateDoseSpotlights();syncQuickConcentrations();}
  if(id==='recovery'){renderRecovery();renderRecoveryRecords();updateRecoveryDue();}
  if(id==='endcase') renderEndCase();
  if(id==='settings'){renderAlertProtocolStatus();renderDrugLibrarySettings();renderQuickPresetSettings();renderBreedAliasSettings();setTimeout(renderProtocolGovernance,0);}
  renderWorkflowLocks();
  scrollAppTop();
}
$$('.tab[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));

function getVal(id, fallback=null){
  const el=$(id); if(!el) return fallback;
  if(numericFields.includes(id)) return clamp(el.value,-99999,99999,fallback);
  return el.value;
}

function addAudit(action,detail='',actor=''){state.auditTrail=state.auditTrail||[];state.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),elapsedMs:currentElapsed(),action,detail,actor:actor||$('anesthetist')?.value.trim()||'Unspecified'})}
function getProtocolAudit(){
  const keys=[PROTOCOL_AUDIT_KEY,'anesvet_v14_2_protocol_audit','anesvet_v14_1_protocol_audit','anesvet_v14_protocol_audit','anesvet_v13_4_protocol_audit'];
  let current=[];
  for(const key of keys){
    try{
      const a=JSON.parse(localStorage.getItem(key)||'null');if(!Array.isArray(a))continue;
      if(key===PROTOCOL_AUDIT_KEY){current=a;if(a.length)return a;continue}
      if(a.length){localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(a));return a}
    }catch(e){}
  }
  return current;
}
function getLastBackupEpoch(){
  const keys=[LAST_BACKUP_KEY,'anesvet_v14_2_last_backup','anesvet_v14_1_last_backup','anesvet_v14_last_backup','anesvet_v13_4_last_backup'];
  for(const key of keys){const n=Number(localStorage.getItem(key)||0);if(Number.isFinite(n)&&n>0){if(key!==LAST_BACKUP_KEY)localStorage.setItem(LAST_BACKUP_KEY,String(n));return n}}
  return 0;
}
function addProtocolAudit(action,detail=''){const a=getProtocolAudit();a.push({epoch:Date.now(),clock:formatClock(),action,detail});localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(a.slice(-500)))}

function currentSnapshot(note=''){
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()),
    epoch: Date.now(),
    elapsedMs: currentElapsed(),
    clock: formatClock(),
    hr:getVal('hr'), rr:getVal('rr'), sap:getVal('sap'), map:getVal('map'), dap:getVal('dap'),
    spo2:getVal('spo2'), etco2:getVal('etco2'), temp:tempInputStoredF('temp'),
    vaporizer:getVal('vaporizer'), o2flow:getVal('o2flow'),
    fluidRate:getVal('fluidRateInput'), fluidTotal:getVal('fluidTotal'),
    depth:getVal('depth',''), ventilation:getVal('ventilation',''),
    alertProtocol:WF.clone(activeAlertProtocol()),
    note:(note || $('recordNote').value || '').trim()
  };
}


function alertGuidance(key,level='warn'){
  const guidance={
    hr:{
      warn:'Check pulse quality/ECG, review anesthetic depth, pain, temperature and recent drugs.',
      danger:'Verify pulse/ECG immediately, assess blood pressure and perfusion, review anesthetic depth/temperature/drugs, and support according to clinical judgment.'
    },
    rr:{
      warn:'Check spontaneous effort, airway patency, anesthetic depth and ETCO₂ trend.',
      danger:'Assess ventilation immediately: confirm airway/circuit, watch chest movement, and assist or control ventilation if indicated.'
    },
    map:{
      warn:'Recheck the reading, review anesthetic depth/vaporizer, HR and volume status, and correct trends before MAP drops further.',
      danger:'Verify the measurement, lighten anesthesia if appropriate, assess HR/rhythm/perfusion and blood loss, consider fluid bolus if hypovolemia is suspected, and use vasoactive support per clinician judgment.'
    },
    spo2:{
      warn:'Check probe position/perfusion, oxygen source, airway patency and ventilation.',
      danger:'Treat as urgent hypoxemia: confirm oxygen delivery and airway, assess ventilation immediately, and troubleshoot the circuit/probe at once.'
    },
    etco2:{
      warn:'Review ventilation, airway/circuit resistance and capnogram trend.',
      danger:'Check airway/circuit and ventilation immediately; assist/control ventilation if hypoventilation is present and assess perfusion if ETCO₂ is unexpectedly low.'
    },
    temp:{
      warn:'Start warming early, minimize heat loss and recheck temperature trend.',
      danger:'Provide active warming, minimize further heat loss and reassess temperature frequently.'
    }
  };
  return guidance[key]?.[level] || guidance[key]?.warn || '';
}
function withAlertAdvice(alerts){
  return (alerts||[]).map(a=>({
    ...a,
    advice:(WF.metrics.includes(a.key)&&activeAlertProtocol()[a.key].warningHigh!==null&&liveAlertValues()[a.key]>activeAlertProtocol()[a.key].warningHigh&&['map','spo2','temp'].includes(a.key))?'Verify measurement and reassess the patient using the hospital / case protocol.':a.advice || alertGuidance(a.key,a.level)
  }));
}

const CLINICAL_GUIDES={
  hypotension:{
    title:'Hypotension — quick checks',
    complication:'Hypotension',
    steps:[
      'Verify the blood-pressure reading: repeat the measurement and check cuff/position or arterial waveform if available.',
      'Review anesthetic depth and inhalant concentration; reduce cardiovascular depressant load if clinically appropriate.',
      'Assess HR/rhythm, pulse quality/perfusion, surgical blood loss and other evidence of reduced circulating volume.',
      'If hypovolemia is suspected, consider a targeted fluid challenge and reassess response rather than giving fluid automatically.',
      'If hypotension persists despite appropriate depth/volume correction, consider inotropic or vasopressor support according to the hospital protocol and patient physiology.'
    ],
    note:'MAP <60 mmHg is treated as a critical trigger in ANESVET. Blood pressure must be interpreted with perfusion, anesthetic depth and the individual patient.'
  },
  bradycardia:{
    title:'Bradycardia — quick checks',
    complication:'Bradycardia',
    steps:[
      'Confirm the heart rate and rhythm with pulse/ECG and determine whether perfusion or blood pressure is compromised.',
      'Review anesthetic depth, vagal stimulation, temperature and drugs that can reduce heart rate.',
      'If bradycardia is accompanied by hypotension or poor perfusion, treat the underlying cause promptly and use chronotropic support according to the hospital protocol when indicated.',
      'If perfusion and blood pressure remain adequate, avoid treating the monitor number alone; continue close reassessment.'
    ],
    note:'Heart-rate thresholds are screening triggers only and must be interpreted by species, rhythm and perfusion.'
  },
  hypoxemia:{
    title:'Hypoxemia — quick checks',
    complication:'Hypoxemia',
    steps:[
      'Confirm that the SpO₂ value is real: inspect pulse-ox waveform/signal quality, probe position and peripheral perfusion.',
      'Confirm oxygen supply and breathing-system connections, then check endotracheal-tube position and patency.',
      'Assess ventilation using chest movement and capnography/ETCO₂; assist or control ventilation if clinically indicated.',
      'Auscultate and consider airway obstruction, atelectasis, aspiration or other pulmonary causes if oxygenation remains poor.',
      'Persistent severe hypoxemia despite immediate troubleshooting requires escalation of ventilatory/diagnostic support.'
    ],
    note:'ANESVET treats SpO₂ <90% as a severe/critical trigger. Pulse oximetry can be artifact-prone, so confirm signal quality while acting on a credible low value.'
  },
  ventilation:{
    title:'Ventilation / ETCO₂ — quick checks',
    complication:'Hypercapnia / hypoventilation',
    steps:[
      'Inspect the capnogram before treating a number: verify sampling, circuit connection and waveform quality.',
      'For high ETCO₂, assess respiratory rate/tidal excursion, anesthetic depth, airway resistance, rebreathing and apparatus dead space.',
      'Assist or control ventilation when hypoventilation is clinically important and reassess ETCO₂ response.',
      'For unexpectedly low ETCO₂, consider disconnection/leak, excessive ventilation, reduced pulmonary perfusion or acute circulatory compromise.'
    ],
    note:'ETCO₂ reflects ventilation and is also affected by perfusion and equipment factors; always interpret the waveform and patient together.'
  },
  hypothermia:{
    title:'Hypothermia — quick checks',
    complication:'Hypothermia',
    steps:[
      'Start active warming early and reduce further heat loss from exposed surfaces and cold surroundings.',
      'Use safe warming methods and protect the patient from thermal injury; avoid direct excessive heat.',
      'Warm IV fluids when appropriate and continue serial temperature monitoring.',
      'Review anesthetic duration, body size, perfusion and other contributors if temperature continues to fall.'
    ],
    note:'The app flags falling temperature as a prompt to intervene early; the warming method and target should be individualized.'
  }
};
function alertEpisodeLabel(key){return ({hypotension:'MAP alert',hypoxemia:'SpO₂ alert',ventilation:'ETCO₂ alert',hypothermia:'Temperature alert'})[key]||key}
function ensureAlertEpisode(key){const metric=Object.keys(ALERT_KEYS).find(k=>ALERT_KEYS[k]===key);if(!metric)return null;const ep=(state.alertEpisodes||[]).slice().reverse().find(x=>x.key===key&&!x.resolvedAt);if(ep)return ep;if(sessionMode!=='active'||state.caseLocked)return null;const value=liveAlertValues()[metric],level=WF.classifyAlert(metric,value,activeAlertProtocol());return ['warn','danger'].includes(level)?newAlertEpisode(metric,value,level):null;}
function acknowledgeAlertEpisode(id,actor=''){if(!clinicalWriteAllowed())return null;const ep=(state.alertEpisodes||[]).find(x=>x.id===id);if(!ep||ep.acknowledgedAt||ep.resolvedAt)return ep;ep.acknowledgedAt=Date.now();ep.acknowledgedBy=actor||$('anesthetist')?.value.trim()||'Unspecified';addAudit('CLINICAL_ALERT_ACKNOWLEDGED',ep.label,ep.acknowledgedBy);save();renderProcedureTimeline();renderActiveProblems();return ep;}
function resolveAlertEpisode(key){if(!clinicalWriteAllowed())return;const ep=(state.alertEpisodes||[]).slice().reverse().find(x=>x.key===key&&!x.resolvedAt);if(ep)finishAlertEpisode(ep,'Measured within configured range',$('anesthetist')?.value.trim()||'Unspecified');}
function clinicalGuideKeyForAlert(key){return key==='map'?'hypotension':key==='spo2'?'hypoxemia':key==='rr'||key==='etco2'?'ventilation':key==='temp'?'hypothermia':key==='hr'?'bradycardia':''}
function clinicalGuideSeverityFor(key){
  const st=thresholds();
  if(key==='hypotension')return st.map==='danger'?'danger':'warn';
  if(key==='hypoxemia')return st.spo2==='danger'?'danger':'warn';
  if(key==='bradycardia')return st.hr==='danger'?'danger':'warn';
  if(key==='ventilation')return st.etco2==='danger'||st.rr==='danger'?'danger':'warn';
  if(key==='hypothermia')return st.temp==='danger'?'danger':'warn';
  return 'warn';
}
function clinicalGuideTriggerText(key){
  if(key==='hypotension')return `Current MAP: ${getVal('map')??'—'} mmHg`;
  if(key==='hypoxemia')return `Current SpO₂: ${getVal('spo2')??'—'}%`;
  if(key==='bradycardia')return `Current HR: ${getVal('hr')??'—'} bpm`;
  if(key==='ventilation')return `Current RR: ${getVal('rr')??'—'} /min • ETCO₂: ${getVal('etco2')??'—'} mmHg`;
  if(key==='hypothermia'){const t=tempInputStoredF('temp');return `Current temperature: ${t==null?'—':tempTextF(t)}`}
  return 'Current monitor values';
}
function openClinicalGuide(key,{auto=false}={}){
  const g=CLINICAL_GUIDES[key];if(!g)return;
  currentClinicalGuideKey=key;currentClinicalGuideAuto=!!auto;currentClinicalAlertEpisodeId=auto?(ensureAlertEpisode(key)?.id||''):'';
  const sev=clinicalGuideSeverityFor(key);
  if($('clinicalGuideTitle'))$('clinicalGuideTitle').textContent=g.title;
  if($('clinicalGuideTrigger'))$('clinicalGuideTrigger').textContent=clinicalGuideTriggerText(key);
  if($('clinicalGuideSteps'))$('clinicalGuideSteps').innerHTML=g.steps.map(x=>`<li>${escapeHtml(x)}</li>`).join('');
  if($('clinicalGuideNote'))$('clinicalGuideNote').textContent=g.note+' • Quick guide only — verify monitor data and use clinical judgment / hospital protocol.';
  const badge=$('clinicalGuideSeverity');if(badge){badge.textContent=sev==='danger'?'CRITICAL — ACT / REASSESS':'REASSESS';badge.className=`critical-guide-badge ${sev}`}
  const card=$('clinicalGuideDialog')?.querySelector('.clinical-guide-card');card?.classList.toggle('critical-guide-card-danger',sev==='danger');
  const metric=Object.keys(ALERT_KEYS).find(k=>ALERT_KEYS[k]===key),protocol=activeAlertProtocol();
  if(metric&&$('clinicalGuideNote'))$('clinicalGuideNote').textContent=thresholdSummary(metric,protocol)+' • Verify monitor data and use clinical judgment / hospital protocol.';
  currentClinicalGuideHigh=!!(metric&&['map','spo2','temp'].includes(metric)&&protocol[metric].warningHigh!==null&&liveAlertValues()[metric]>protocol[metric].warningHigh);
  if(currentClinicalGuideHigh){$('clinicalGuideTitle').textContent=WF.labels[metric]+' above configured threshold';$('clinicalGuideSteps').innerHTML='<li>Verify the measurement, sensor and patient condition.</li><li>Reassess the patient and follow the case / hospital protocol.</li>';$('clinicalGuideNote').textContent='Custom upper threshold; individualized clinical assessment required.';}
  const d=$('clinicalGuideDialog');try{if(d&&!d.open)d.showModal()}catch(e){d?.setAttribute('open','')}
  if(auto){playDueTone('test');vibrateDue('anesthesia')}
}
function closeClinicalGuide(){try{$('clinicalGuideDialog')?.close()}catch(e){$('clinicalGuideDialog')?.removeAttribute('open')}}
function maybeShowCriticalClinicalAlert(){syncAlertEpisodes();if(sessionMode!=='active'||state.caseLocked||!state.caseStartedAt||['recovery','complete'].includes(state.casePhase))return;if(currentSettingsObject().criticalPopupEnabled===false||document.querySelector('dialog[open]'))return;const ep=(state.alertEpisodes||[]).find(a=>!a.resolvedAt&&!a.acknowledgedAt&&!a.popupShownAt&&(a.level||'danger')==='danger');if(!ep)return;ep.popupShownAt=Date.now();openClinicalGuide(ep.key,{auto:true});save();}
function renderSapDapVisibility(){
  const cfg=currentSettingsObject(),show=cfg.showSapDap!==false;
  document.body.classList.toggle('hide-sap-dap',!show);
  if($('settingShowSapDap'))$('settingShowSapDap').checked=show;
  if($('settingCriticalPopup'))$('settingCriticalPopup').checked=cfg.criticalPopupEnabled!==false;
  const f=$('correctionField');if(f){[...f.options].forEach(o=>{if(o.dataset.sapDap==='1')o.hidden=!show});if(!show&&['sap','dap'].includes(f.value))f.value='map'}
  if($('bpChartSeriesLabel'))$('bpChartSeriesLabel').textContent=show?'SAP / MAP / DAP':'MAP';
}
$$('.clinical-guide-btn').forEach(btn=>btn.addEventListener('click',()=>openClinicalGuide(btn.dataset.guide||'')));
$('clinicalGuideCloseBtn')?.addEventListener('click',closeClinicalGuide);$('clinicalGuideDismissBtn')?.addEventListener('click',()=>{if(currentClinicalAlertEpisodeId)acknowledgeAlertEpisode(currentClinicalAlertEpisodeId);closeClinicalGuide()});
$('clinicalGuideComplicationBtn')?.addEventListener('click',()=>{const g=CLINICAL_GUIDES[currentClinicalGuideKey];if(currentClinicalAlertEpisodeId)acknowledgeAlertEpisode(currentClinicalAlertEpisodeId);closeClinicalGuide();if(g)openComplicationDialog(currentClinicalGuideHigh?'Other':g.complication||'')});

function plausibilityWarnings(v,context='anesthesia'){
  const w=[],num=x=>x===null||x===''||x===undefined?null:Number(x);
  const hr=num(v.hr),rr=num(v.rr),sap=num(v.sap),map=num(v.map),dap=num(v.dap),spo2=num(v.spo2),et=num(v.etco2),temp=num(v.temp);
  if(hr!==null&&(hr<20||hr>350))w.push(`HR ${hr} bpm ดูผิดปกติมาก`);
  if(rr!==null&&(rr<0||rr>120))w.push(`RR ${rr}/min ดูผิดปกติมาก`);
  if(spo2!==null&&(spo2<50||spo2>100))w.push(`SpO₂ ${spo2}% ตรวจหน่วย/การพิมพ์`);
  if(et!==null&&(et<5||et>100))w.push(`ETCO₂ ${et} mmHg ตรวจ waveform/การพิมพ์`);
  if(temp!==null&&(temp<90||temp>106))w.push(`Temp ${tempTextF(temp)} ตรวจหน่วยหรือ decimal`);
  if(map!==null&&(map<0||map>300))w.push(`MAP ${map} mmHg ตรวจการพิมพ์`);
  // SAP / DAP remain optional helper fields and do not trigger plausibility prompts.
  if(context==='recovery'&&rr===0)w.push('Recovery RR = 0 ต้องยืนยันว่าเป็น apnea จริง');
  return [...new Set(w)];
}
function confirmPlausibility(warnings,title){return confirm(`${title}: พบค่าที่ควรตรวจซ้ำ\n\n• ${warnings.join('\n• ')}\n\nกด OK เพื่อยืนยันว่าค่านี้เป็นค่าจริงและบันทึกต่อ`)}

function thresholds(){
  const species=$('species').value;
  const hr=getVal('hr'),rr=getVal('rr'),map=getVal('map'),spo2=getVal('spo2'),et=getVal('etco2'),temp=tempInputStoredF('temp');
  const status={hr:'neutral',rr:'neutral',map:'neutral',spo2:'neutral',etco2:'neutral',temp:'neutral'};
  if(hr!==null){status.hr='good';if(species==='cat'){if(hr<90||hr>225)status.hr='danger';else if(hr<100||hr>180)status.hr='warn'}else{if(hr<40||hr>190)status.hr='danger';else if(hr<60||hr>150)status.hr='warn'}}
  if(rr!==null){status.rr='good';if(species==='cat'){if(rr<7)status.rr='danger';else if(rr<10||rr>28)status.rr='warn'}else{if(rr<6)status.rr='danger';else if(rr<8||rr>20)status.rr='warn'}}
  const protocol=activeAlertProtocol();
  for(const [key,value] of Object.entries({map,spo2,etco2:et,temp}))status[key]=WF.classifyAlert(key,value,protocol);
  return status;
}
function setHint(id,level,text){
  const el=$(id);el.className=`vital-foot ${level}`;el.textContent=text;
}
function updateDashboard(){
  const st=thresholds();
  const speciesForAlert=$('species').value;
  const hrNow=getVal('hr'), rrNow=getVal('rr');

  if(hrNow===null)setHint('hrHint','neutral','No measurement entered');
  else if(speciesForAlert==='cat')setHint('hrHint',st.hr,st.hr==='danger'?(hrNow<90?'Critical bradycardia alert (<90)':'Marked tachycardia alert (>225)'):st.hr==='warn'?(hrNow<100?'Bradycardia alert (<100)':'Tachycardia alert (>180)'):'Cat HR acceptable screening range 100–180');
  else setHint('hrHint',st.hr,st.hr==='danger'?(hrNow<40?'Critical bradycardia alert (<40)':'Marked tachycardia alert (>190)'):st.hr==='warn'?(hrNow<60?'Bradycardia alert (<60)':'Tachycardia alert (>150)'):'Dog HR acceptable screening range 60–150');
  if(rrNow===null)setHint('rrHint','neutral','No measurement entered');
  else if(speciesForAlert==='cat')setHint('rrHint',st.rr,st.rr==='danger'?(rrNow===0?'Apnea / no spontaneous breaths':'Critical low RR (<7)'):st.rr==='warn'?(rrNow<10?'Low RR (<10)':'High RR (>28): reassess depth/pain'):'Cat RR screening range 10–28');
  else setHint('rrHint',st.rr,st.rr==='danger'?(rrNow===0?'Apnea / no spontaneous breaths':'Critical low RR (<6)'):st.rr==='warn'?(rrNow<8?'Low RR (<8)':'High RR (>20): reassess depth/pain'):'Dog RR screening range 8–20');
  for(const key of WF.metrics)setHint(key+'Hint',st[key],alertThresholdHint(key,st[key]));

  const levels=Object.values(st);
  if($('bradyPoorPerf').checked) levels.push('danger');
  const global=$('globalStatus'),measured=Object.values(st).filter(x=>x!=='neutral').length;
  if(levels.includes('danger')){global.className='status-pill danger';global.textContent='INTERVENE'}
  else if(levels.includes('warn')){global.className='status-pill warn';global.textContent='REASSESS'}
  else if(!measured){global.className='status-pill neutral';global.textContent='NO DATA'}
  else{global.className='status-pill good';global.textContent='STABLE'}

  const species=$('species').value,weight=currentWeightReady()?currentWeightKg():null;
  $('fluidReference').textContent=weight===null?'Current BW required — mL/kg calculations disabled until Patient & Case Setup is saved':species==='cat'
    ? `Reference: Cat ~3–5 mL/kg/hr ≈ ${(weight*3).toFixed(0)}–${(weight*5).toFixed(0)} mL/hr (normal cardiac/renal function)`
    : `Reference: Dog ~5 mL/kg/hr ≈ ${(weight*5).toFixed(0)} mL/hr (normal cardiac/renal function)`;

  const name=$('patientName').value.trim()||'ยังไม่ได้ระบุชื่อ';
  const breed=$('breed')?.value.trim();
  $('caseStripPatient').textContent=`${name} • ${species==='cat'?'Cat':species==='dog'?'Dog':'—'}${$('sex')?.value?' • '+({male:'M',female:'F'}[$('sex').value]||''):''}${breed?' • '+breed:''}${$('age')?.value?' • '+$('age').value:''} • ${weight||'—'} kg`;
  $('caseStripAsa').textContent=`ASA ${$('asa').value}${$('emergency').checked?'-E':''}`;
  $('caseStripProcedure').textContent=$('procedure').value.trim()||$('patientProcedure')?.value.trim()||'—';
  $('caseStripInterval').textContent=`${$('recordInterval').value} min`;

  renderInterpretation();
  renderRecordPreview();
  drugCalc();
  updatePlanCalc();
  updateBalance();
  renderSmartAlerts();
  renderCaseSummary();renderWeightSafetyState();
  if($('orlive')?.classList.contains('active')) renderOrLive();
  maybeShowCriticalClinicalAlert();
  save();
}
function renderInterpretation(){
  const st=thresholds();
  const species=$('species').value,hr=getVal('hr'),rr=getVal('rr');
  const msg=(key,good,warn,danger)=>st[key]==='neutral'?'No measurement entered':st[key]==='danger'?danger:st[key]==='warn'?warn:good;
  const data=[
    ['HR',st.hr,msg('hr','HR acceptable on screening',hr!==null&&hr<(species==='cat'?100:60)?'Bradycardia — assess perfusion/BP and cause':'Tachycardia — assess pain/depth, hypoxemia, hypercarbia, volume status and drugs','Critical HR alert — verify pulse/ECG, BP, anesthetic depth, temperature and drugs')],
    ['RR',st.rr,msg('rr','RR acceptable on screening; ETCO₂ determines ventilation adequacy',rr!==null&&rr<(species==='cat'?10:8)?'Low RR — check depth, tidal movement and ETCO₂':'High RR — reassess surgical stimulation, depth, pain, ETCO₂ and airway','Very low RR / apnea risk — check chest movement, airway and ETCO₂; support ventilation as indicated')],
    ['MAP',st.map,msg('map','MAP acceptable','MAP borderline — reassess trend and perfusion','Hypotension — verify BP/perfusion, depth, HR, volume/contractility/SVR')],
    ['SpO₂',st.spo2,msg('spo2','Oxygenation acceptable','SpO₂ outside configured range — investigate','Severe hypoxemia — airway/O₂/ventilation immediately')],
    ['ETCO₂',st.etco2,msg('etco2','Ventilation range acceptable','ETCO₂ outside usual range — review waveform','Check ventilation, airway/circuit and perfusion')],
    ['Temp',st.temp,msg('temp','Temperature within configured range','Temperature outside warning range — verify and reassess','Temperature outside critical range — verify reading and reassess')]
  ];
  $('interpretationCards').innerHTML=data.map(([name,level,text])=>`<div class="interpret-card ${level}"><span>${name}</span><b>${escapeHtml(text)}</b></div>`).join('');
}
function renderRecordPreview(){
  const showSapDap=currentSettingsObject().showSapDap!==false;
  const pairs=[['HR','hr'],['RR','rr'],...(showSapDap?[['SAP','sap']]:[]),['MAP','map'],...(showSapDap?[['DAP','dap']]:[]),['SpO₂','spo2'],['ETCO₂','etco2'],['Temp','temp']];
  $('recordPreview').innerHTML=pairs.map(([label,id])=>`<div class="preview-item"><span>${label}</span><b>${escapeHtml($(id).value||'—')}</b></div>`).join('');
}

function addRecord(note=''){
  if(!ensureTimerStarted())return false;
  const snap=currentSnapshot(note),warnings=plausibilityWarnings(snap,'anesthesia');
  if(['hr','rr','sap','map','dap','spo2','etco2','temp'].every(k=>snap[k]===null)){toast('No measurement entered — enter at least one measured vital before recording');return false}
  if(warnings.length&&!confirmPlausibility(warnings,'Anesthesia record'))return false;
  for(const k of WF.metrics)alertObservationRevision[k]=(alertObservationRevision[k]||0)+1;syncAlertEpisodes(snap,{force:true});
  state.records.push(snap);dueReminderToken=null;
  addAudit('ANESTHESIA_RECORD_ADDED',`Record ${snap.clock} • HR ${snap.hr} • MAP ${snap.map} • SpO₂ ${snap.spo2} • ETCO₂ ${snap.etco2}`);
  state.records.sort((a,b)=>a.epoch-b.epoch);
  $('recordNote').value='';
  save();renderRecords();renderTrends();renderProcedureTimeline();renderSmartAlerts();renderOrLive();updateDue();
  toast('Record saved • '+state.records[state.records.length-1].clock);
}
$('recordFromDashboardBtn').addEventListener('click',()=>addRecord(''));
$('recordNowBtn').addEventListener('click',()=>addRecord(''));

function recordAlert(r){
  const sp=$('species').value,num=v=>v===null||v===''||v===undefined?null:Number(v);
  const hr=num(r.hr),rr=num(r.rr),map=num(r.map),spo2=num(r.spo2),et=num(r.etco2),temp=num(r.temp);
  const hrCritical=hr!==null&&(sp==='cat'?(hr<90||hr>225):(hr<40||hr>190));
  const rrCritical=rr!==null&&(sp==='cat'?(rr<7):(rr<6));
  return hrCritical||rrCritical||Object.entries({map,spo2,etco2:et,temp}).some(([k,v])=>WF.classifyAlert(k,v,r.alertProtocol||WF.defaultAlertProtocol())==='danger');
}
function renderRecords(){
  const body=$('recordBody');body.innerHTML='';
  const records=state.records||[];
  $('recordEmpty').style.display=records.length?'none':'block';
  $('recordCountText').textContent=`${records.length} record${records.length===1?'':'s'}`;
  records.forEach((r,i)=>{
    const tr=document.createElement('tr');if(recordAlert(r))tr.classList.add('alert');
    const fields=['hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','fluidRate'];
    tr.innerHTML=`<td>${i+1}</td><td>${formatElapsed(r.elapsedMs)}</td><td>${escapeHtml(r.clock)}</td>`+
      fields.map(f=>`<td class="${['sap','dap'].includes(f)?'sap-dap-helper ':''}${recordCorrectionCount(r.id,f)?'corrected-cell':''}" title="${recordCorrectionCount(r.id,f)?'Corrected value — see history':''}">${f==='temp'?(r[f]==null||r[f]===''?'':tempStoredFToDisplay(r[f])):(r[f]??'')}${recordCorrectionCount(r.id,f)?'<span class="correction-badge">C</span>':''}</td>`).join('')+
      `<td class="note">${escapeHtml(r.note||'')}</td><td><div class="record-actions"><button class="record-correct-btn" data-id="${escapeHtml(r.id)}">Correct</button><button class="delete-btn" data-id="${escapeHtml(r.id)}">✕</button></div></td>`;
    body.appendChild(tr);
  });
  $$('#recordBody .record-correct-btn').forEach(b=>b.addEventListener('click',()=>{if($('correctionRecord'))$('correctionRecord').value=String(b.dataset.id);$('correctionField').focus();toast('เลือก field และ corrected value ด้านล่าง')}));
  $$('#recordBody .delete-btn').forEach(b=>b.addEventListener('click',()=>{
    if(!confirm('Delete record นี้? ถ้าเป็นการกรอกค่าผิด แนะนำใช้ Correction แทน'))return;
    state.records=state.records.filter(r=>String(r.id)!==String(b.dataset.id));
    save();renderRecords();renderCorrections();renderTrends();renderProcedureTimeline();renderSmartAlerts();renderOrLive();updateDue();
  }));
  renderCorrections();
}
function recordCorrectionCount(recordId,field=null){return (state.corrections||[]).filter(c=>String(c.recordId)===String(recordId)&&(!field||c.field===field)).length}
function renderCorrections(){
  const sel=$('correctionRecord');if(sel){const recs=state.records||[];sel.innerHTML=recs.length?recs.map((r,i)=>`<option value="${escapeHtml(r.id)}">#${i+1} • ${escapeHtml(r.clock)} • ${escapeHtml(formatShortElapsed(r.elapsedMs))}</option>`).join(''):'<option value="">— no records —</option>'}
  const arr=state.corrections||[];if($('correctionCount'))$('correctionCount').textContent=`${arr.length} CORRECTION${arr.length===1?'':'S'}`;
  const box=$('correctionHistory');if(!box)return;if(!arr.length){box.className='correction-history empty-state compact';box.textContent='ยังไม่มี correction';return}
  box.className='correction-history';box.innerHTML=arr.slice().reverse().map(c=>{const oldV=c.field==='temp'?tempTextF(c.oldValue):c.oldValue,newV=c.field==='temp'?tempTextF(c.newValue):c.newValue;return `<div class="correction-item"><b>${escapeHtml(c.clock)} • ${escapeHtml(c.field.toUpperCase())}: ${escapeHtml(oldV)} → ${escapeHtml(newV)}</b><span>${escapeHtml(c.reason||'No reason entered')} • record ${escapeHtml(formatShortElapsed(c.recordElapsedMs||0))}</span></div>`}).join('');
}
function applyCorrection(recordId=null){
  const rid=recordId||$('correctionRecord')?.value;if(!rid){toast('เลือก record ก่อน');return}
  const rec=(state.records||[]).find(r=>String(r.id)===String(rid));if(!rec)return;
  if(recordId && $('correctionRecord'))$('correctionRecord').value=String(recordId);
  const field=$('correctionField').value,enteredValue=Number($('correctionValue').value),reason=$('correctionReason').value.trim();
  if(!Number.isFinite(enteredValue)){toast('ใส่ corrected value ก่อน');return}
  const newValue=field==='temp'?tempDisplayToStoredF(enteredValue):enteredValue;
  const oldValue=rec[field];if(String(oldValue)===String(newValue)){toast('ค่าใหม่เท่ากับค่าเดิม');return}
  if(!reason&&!confirm('ยังไม่ได้ระบุ reason — ต้องการบันทึก correction ต่อหรือไม่?'))return;
  const c={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),recordId:rec.id,recordElapsedMs:rec.elapsedMs,field,oldValue,newValue,reason,epoch:Date.now(),clock:formatClock()};
  state.corrections=state.corrections||[];state.corrections.push(c);rec[field]=newValue;
  addAudit('RECORD_CORRECTION',`${field.toUpperCase()} ${oldValue} → ${newValue}${reason?' • '+reason:''}`);
  $('correctionValue').value='';$('correctionReason').value='';save();renderRecords();renderCorrections();renderTrends();renderSmartAlerts();renderOrLive();renderProcedureTimeline();toast(`Corrected ${field.toUpperCase()} ${oldValue} → ${newValue}`);
}
$('applyCorrectionBtn')?.addEventListener('click',()=>applyCorrection());
function latestRecord(){return state.records?.length?state.records[state.records.length-1]:null}
function updateDue(){
  const last=latestRecord(),interval=Number($('recordInterval').value||5)*60000,banner=$('dueBanner');
  if(!last){
    $('latestRecordText').textContent='ยังไม่มี';
    if(!state.caseStartedAt){$('nextDueText').textContent='เริ่มนับเมื่อ Start case';$('dueStatus').textContent='READY';banner.classList.add('hidden');return}
    const remaining=interval-currentElapsed();$('nextDueText').textContent=`Case + ${Math.round(interval/60000)} min`;
    if(remaining<=0){
      $('dueStatus').textContent=`FIRST DUE +${Math.floor(Math.abs(remaining)/60000)}m`;banner.classList.remove('hidden');
      const token=`first-${state.caseId}-${interval}`;if($('reminderOn').checked&&dueReminderToken!==token){dueReminderToken=token;toast('ถึงเวลาบันทึก anesthesia vital signs ชุดแรก');fireDueFeedback('anesthesia')}
    }else{$('dueStatus').textContent=`${Math.floor(remaining/60000)}:${pad(Math.floor((remaining%60000)/1000))}`;banner.classList.add('hidden')}
    return;
  }
  $('latestRecordText').textContent=`${last.clock} • ${formatElapsed(last.elapsedMs)}`;
  const due=last.epoch+interval,delta=due-Date.now();$('nextDueText').textContent=formatClock(due);
  if(delta<=0){$('dueStatus').textContent=`DUE +${Math.floor(Math.abs(delta)/60000)}m`;banner.classList.remove('hidden');if($('reminderOn').checked&&dueReminderToken!==due){dueReminderToken=due;toast('ถึงเวลาบันทึกค่า anesthesia แล้ว');fireDueFeedback('anesthesia')}}
  else{$('dueStatus').textContent=`${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;banner.classList.add('hidden')}
}
setInterval(updateDue,1000);


function markMilestone(btn){
  if(!clinicalWriteAllowed()||!ensureTimerStarted())return;
  const label=btn.dataset.label,cat=btn.dataset.cat;
  if(['emergence','recovery','complete'].includes(state.casePhase) && ['Induction','Surgery start'].includes(label)){
    toast('ไม่สามารถย้อน phase กลับไปช่วงผ่าตัดได้');return;
  }
  if(state.casePhase==='emergency' && ['Induction','Surgery start','Surgery end'].includes(label)){
    toast('EMERGENCY RETURN mode — ใช้ OR LIVE เพื่อ airway/resuscitation แล้วกลับ Recovery');return;
  }
  addEvent({category:cat,name:label,note:'Procedure milestone'});
  if(label==='Induction')setCasePhase('induction',false);
  if(label==='Surgery start')setCasePhase('intraop',false);
  if(label==='Surgery end'){
    state.surgeryEndedAt=Date.now();setCasePhase('emergence',false);
    toast('Surgery ended → EMERGENCE • กด Extubation แล้วจะไป Recovery อัตโนมัติ');
  }
  if(label==='Extubation'){
    state.extubatedAt=Date.now();
    if($('recExtubation')&&!$('recExtubation').value)$('recExtubation').value=formatClock().slice(0,5);
    enterRecoveryAfterExtubation();
  }
  btn.classList.add('done');renderCasePhase();
}
$$('.milestone-btn').forEach(btn=>btn.addEventListener('click',()=>markMilestone(btn)));
function renderProcedureTimeline(){
  const items=[
    ...(state.events||[]).map(e=>({elapsedMs:e.elapsedMs,clock:e.clock,cat:e.category,text:`${e.name}${e.dose?' • '+e.dose:''}${e.route?' • '+e.route:''}${e.note?' • '+e.note:''}`})),
    ...(state.records||[]).filter(r=>r.note).map(r=>({elapsedMs:r.elapsedMs,clock:r.clock,cat:'Record',text:r.note,isRecord:true})),
    ...(state.corrections||[]).map(c=>({elapsedMs:c.recordElapsedMs||0,clock:c.clock,cat:'Correction',text:`${c.field.toUpperCase()} ${c.field==='temp'?tempTextF(c.oldValue):c.oldValue} → ${c.field==='temp'?tempTextF(c.newValue):c.newValue}${c.reason?' • '+c.reason:''}`})),
    ...(state.alertEpisodes||[]).flatMap(a=>[{elapsedMs:a.elapsedMs||0,clock:a.clock,cat:'Alert',text:`${a.label||a.key} started • ${a.trigger||''}${a.acknowledgedAt?' • acknowledged '+formatClock(a.acknowledgedAt):''}`},...(a.resolvedAt?[{elapsedMs:a.resolvedElapsedMs||a.elapsedMs||0,clock:a.resolvedClock||formatClock(a.resolvedAt),cat:'Alert resolved',text:`${a.label||a.key} resolved • duration ${formatShortElapsed(a.resolvedAt-a.startedAt)}`}]:[])]),
    ...(state.alertEpisodes||[]).flatMap(a=>(a.interventions||[]).map(i=>({elapsedMs:i.elapsedMs,clock:i.clock,cat:'Alert intervention',text:`${a.label||a.key} • ${i.note} • ${i.actor||''}`}))),
    ...(state.alertProtocolHistory||[]).map(x=>({elapsedMs:Math.max(0,x.epoch-(state.caseStartedAt||x.epoch)),clock:x.clock,cat:'Alert protocol',text:`${x.action} • ${x.reason} • ${x.actor}`})),
    ...(state.recoveryRecords||[]).map(r=>({elapsedMs:r.caseElapsedMs||0,clock:r.clock,cat:'Recovery Vitals',text:`HR ${r.hr} • RR ${r.rr} • MAP ${r.map??'—'} • SpO₂ ${r.spo2}% • Temp ${r.na?.temp?'N/A':tempTextF(r.temp)}${r.mentation?' • '+r.mentation:''}`}))
  ].sort((a,b)=>a.elapsedMs-b.elapsedMs);
  const el=$('procedureTimeline');
  if(!el)return;
  if(!items.length){el.className='procedure-timeline empty-state';el.textContent='ยังไม่มี Timeline';}
  else{
    el.className='procedure-timeline';
    el.innerHTML=items.map(i=>`<div class="procedure-item ${i.isRecord?'record':''} ${i.cat==='Complication'?'complication':''}">
      <div class="ptime">${formatShortElapsed(i.elapsedMs)}<br><small>${escapeHtml(i.clock||'')}</small></div>
      <div class="pcat">${escapeHtml(i.cat)}</div>
      <div class="ptext">${escapeHtml(i.text)}</div>
    </div>`).join('');
  }
  if($('timelineRecordCount')) $('timelineRecordCount').textContent=(state.records||[]).length;
  if($('timelineEventCount')) $('timelineEventCount').textContent=(state.events||[]).length;
  if($('timelineStartClock')) $('timelineStartClock').textContent=state.caseStartedAt?formatClock(state.caseStartedAt):'—';
  if($('timelineElapsed')) $('timelineElapsed').textContent=formatElapsed(currentElapsed());
}
$('timelineRecordBtn')?.addEventListener('click',()=>addRecord(''));
$('timelineEventBtn')?.addEventListener('click',()=>setTab('events'));


let pendingDrugAdministration=null;
function parseMlNumber(text){
  const m=String(text||'').match(/([0-9]+(?:\.[0-9]+)?)\s*mL/i);return m?Number(m[1]):null;
}
function inferredDrugConcentration(drug){
  const map={Diazepam:'diazepamConc',Propofol:'propofolConc',Tramadol:'tramadolConc',Atropine:'atropineConc','Adrenaline CPR':'adrenalineConc'};
  const id=map[drug],v=id?$(id)?.value:'';return v?`${v} mg/mL`:'';
}
function openDrugAdministration({drug,calculated='',suggestedMl=null,route='',note='',unit='',concentration='',source='Drug Calculator'}){
  const inferredUnit=unit||(String(calculated).includes('mL/hr')?'mL/hr':'mL');
  pendingDrugAdministration={drug,calculated,suggestedMl,route,note,unit:inferredUnit,concentration:concentration||inferredDrugConcentration(drug),source};
  $('drugAdminName').textContent=drug||'Drug';
  $('drugAdminCalculated').textContent=`Calculated: ${calculated||'—'}`;
  $('drugAdminActualMl').value=Number.isFinite(Number(suggestedMl))?fmtVol(Number(suggestedMl)):'';
  $('drugAdminUnit').value=inferredUnit;
  $('drugAdminRoute').value=route||'';
  $('drugAdminBy').value=$('anesthetist')?.value.trim()||'';
  $('drugAdminConcentration').value=pendingDrugAdministration.concentration||'';
  $('drugAdminNote').value=note||'';
  const dlg=$('drugAdminDialog');if(dlg?.showModal)dlg.showModal();else dlg?.setAttribute('open','');
}
function closeDrugAdministration(){
  const dlg=$('drugAdminDialog');if(!dlg)return;
  if(dlg.close)dlg.close();else dlg.removeAttribute('open');
  pendingDrugAdministration=null;
}
function recentSameDrugAdministration(drug,windowMs=120000){
  const now=Date.now();return [...(state.drugAdministrations||[])].reverse().find(x=>!x.voidedAt&&String(x.drug).toLowerCase()===String(drug).toLowerCase()&&now-Number(x.epoch||0)<=windowMs)||null;
}
function recordDrugAdministration({drug,calculated='',actual,unit='mL',route='',administeredBy='',concentration='',note='',source='Manual',calculationBasis=null}){
  if(!clinicalWriteAllowed()||!Number.isFinite(Number(actual))||!(Number(actual)>0)||!drug||!route||!administeredBy)return null;
  if(!ensureTimerStarted())return null;
  state.drugAdministrations=state.drugAdministrations||[];
  const duplicate=recentSameDrugAdministration(drug);
  if(duplicate&&!confirm(`${drug} was also documented recently (${duplicate.clock||'—'}).\n\nConfirm this is a separate administration?`))return null;
  const id=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());
  const entry={id,epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),drug,calculated,actual:Number(actual),unit,route,administeredBy,concentration,note,source,...(calculationBasis?{calculationBasis}:{}),casePhase:state.casePhase||'intraop',voidedAt:null,voidReason:'',voidedBy:''};
  state.drugAdministrations.push(entry);
  const ev=addEvent({category:'Drug',name:drug,dose:`Actual ${fmtDose(entry.actual)} ${unit}`,route,note:[concentration?`Preparation ${concentration}`:'',calculated?`Calculated ${calculated}`:'',note].filter(Boolean).join(' • '),meta:{drugAdministrationId:id}});
  if(ev)entry.eventId=ev.id;
  addAudit('DRUG_ADMINISTERED',`${drug} • ${fmtDose(entry.actual)} ${unit}${route?' • '+route:''}${administeredBy?' • by '+administeredBy:''}`,administeredBy||'');
  save();renderDrugAdministrationAudit();renderEvents();renderProcedureTimeline();renderOrLive();return entry;
}
function voidDrugAdministration(id){
  if(!clinicalWriteAllowed())return;
  const a=(state.drugAdministrations||[]).find(x=>String(x.id)===String(id));if(!a||a.voidedAt)return;
  const reason=prompt(`Void medication administration record\n${a.drug} • ${fmtDose(a.actual)} ${a.unit}\n\nReason (required)`);if(!reason?.trim())return;
  const by=prompt('Voided by',$('anesthetist')?.value.trim()||'');if(!by?.trim())return;
  if(!confirm('Keep original administration entry and mark it VOID?'))return;
  a.voidedAt=Date.now();a.voidReason=reason.trim();a.voidedBy=by.trim();
  addAudit('DRUG_ADMIN_VOIDED',`${a.drug} • ${a.voidReason}`,a.voidedBy);
  addEvent({category:'Drug',name:`${a.drug} administration VOID`,note:`Original administration retained • ${a.voidReason}`,meta:{drugAdministrationId:a.id,drugAdministrationVoid:true}});
  save();renderDrugAdministrationAudit();renderEvents();
}
function renderDrugAdministrationAudit(){
  const arr=state.drugAdministrations||[],box=$('drugAdministrationAudit');if($('drugAuditCount')){$('drugAuditCount').textContent=`${arr.filter(x=>!x.voidedAt).length} ADMIN`;$('drugAuditCount').className=`status-pill ${arr.some(x=>x.voidedAt)?'warn':'good'}`}
  if(!box)return;if(!arr.length){box.className='drug-audit-list empty-state';box.textContent='ยังไม่มีการยืนยัน administration';return}
  box.className='drug-audit-list';box.innerHTML=arr.map(a=>`<div class="drug-audit-row ${a.voidedAt?'voided':''}"><div class="drug-audit-time"><b>${escapeHtml(formatShortElapsed(a.elapsedMs))}</b><small>${escapeHtml(a.clock||'')}</small></div><div class="drug-audit-main"><b>${escapeHtml(a.drug)} • ${escapeHtml(fmtDose(a.actual))} ${escapeHtml(a.unit||'')}</b><span>${escapeHtml([a.route,a.concentration,a.administeredBy?`by ${a.administeredBy}`:'',a.source].filter(Boolean).join(' • '))}</span><small>${escapeHtml(a.calculated?`Calculated ${a.calculated}${a.note?' • '+a.note:''}`:(a.note||''))}</small>${a.voidedAt?`<em>VOID • ${escapeHtml(a.voidReason||'—')} • ${escapeHtml(a.voidedBy||'—')}</em>`:''}</div>${a.voidedAt?'':`<button class="btn danger-outline drug-admin-void" data-id="${escapeHtml(a.id)}" type="button">Void</button>`}</div>`).join('');
  $$('.drug-admin-void').forEach(b=>b.addEventListener('click',()=>voidDrugAdministration(b.dataset.id)));
}
$('drugAdminCloseBtn')?.addEventListener('click',closeDrugAdministration);
$('drugAdminCancelBtn')?.addEventListener('click',closeDrugAdministration);
$('drugAdminConfirmBtn')?.addEventListener('click',()=>{
  if(!pendingDrugAdministration)return;if(!requireCurrentWeight('confirming drug administration'))return;
  const actual=Number($('drugAdminActualMl').value),unit=$('drugAdminUnit').value,route=$('drugAdminRoute').value.trim(),by=$('drugAdminBy').value.trim(),concentration=$('drugAdminConcentration').value.trim(),extra=$('drugAdminNote').value.trim();
  if(!(actual>0)){toast('กรุณาใส่ actual administered amount / rate');return}
  if(!route){toast('กรุณาระบุ route');$('drugAdminRoute').focus();return}
  if(!by){toast('กรุณาระบุผู้ให้ยา');$('drugAdminBy').focus();return}
  const p=pendingDrugAdministration;
  if(!confirm(`Confirm administration\n${p.drug}\nActual ${fmtDose(actual)} ${unit} • ${route}\nBy ${by}`))return;
  const ok=recordDrugAdministration({drug:p.drug,calculated:p.calculated,actual,unit,route,administeredBy:by,concentration,note:extra,source:p.source});
  if(ok)closeDrugAdministration();
});

let pendingComplicationType='';
function snapshotVitalsText(s=currentSnapshot('')){return `HR ${s.hr??'—'} • MAP ${s.map??'—'} • SpO₂ ${s.spo2??'—'} • ETCO₂ ${s.etco2??'—'} • Temp ${s.temp==null?'—':tempTextF(s.temp)}`}
function openComplicationDialog(type=''){
  pendingComplicationType=type||'Hypotension';if($('complicationType'))$('complicationType').value=pendingComplicationType;
  if($('complicationSeverity'))$('complicationSeverity').value='observe';
  ['complicationAssessment','complicationIntervention','complicationNote'].forEach(id=>{if($(id))$(id).value=''});
  if($('complicationDetectedValues'))$('complicationDetectedValues').textContent=`Current monitor values: ${snapshotVitalsText()}`;
  const d=$('complicationDialog');if(d?.showModal)d.showModal();else d?.setAttribute('open','');
}
function closeComplicationDialog(){const d=$('complicationDialog');if(!d)return;if(d.close)d.close();else d.removeAttribute('open');pendingComplicationType=''}
function startComplicationRecord(){
  if(!clinicalWriteAllowed())return;
  if(!ensureTimerStarted())return;
  const type=$('complicationType').value||'Other',severity=$('complicationSeverity').value||'observe',assessment=$('complicationAssessment').value.trim(),intervention=$('complicationIntervention').value.trim(),note=$('complicationNote').value.trim(),snapshot=currentSnapshot('');
  state.complications=state.complications||[];const id=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());
  const c={id,type,severity,status:'active',epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),assessment,intervention,note,onsetSnapshot:snapshot,responses:[],resolvedAt:null,resolvedElapsedMs:null,resolvedClock:'',resolutionNote:''};
  state.complications.push(c);const ev=addEvent({category:'Complication',name:type,note:[`Severity ${severity}`,assessment&&`Assessment: ${assessment}`,intervention&&`Initial intervention: ${intervention}`,note].filter(Boolean).join(' • '),meta:{complicationId:id}});if(ev)c.eventId=ev.id;
  addAudit('COMPLICATION_STARTED',`${type} • ${severity}`);save();closeComplicationDialog();renderComplications();renderEvents();renderOrLive();toast(`${type} complication record started`);
}
function complicationResponse(id,resolve=false){
  if(!clinicalWriteAllowed())return;
  const c=(state.complications||[]).find(x=>String(x.id)===String(id));if(!c||c.status==='resolved')return;
  const promptText=resolve?'Resolution / outcome note (required)':'Response note (optional)';const note=prompt(promptText,'');if(resolve&&!note?.trim()){toast('Resolution note required');return}
  const snap=currentSnapshot(''),r={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),snapshot:snap,note:(note||'').trim()};c.responses=c.responses||[];c.responses.push(r);
  if(resolve){c.status='resolved';c.resolvedAt=r.epoch;c.resolvedElapsedMs=r.elapsedMs;c.resolvedClock=r.clock;c.resolutionNote=r.note;addAudit('COMPLICATION_RESOLVED',`${c.type} • ${r.note}`);addEvent({category:'Complication',name:`${c.type} resolved`,note:`Outcome: ${r.note} • ${snapshotVitalsText(snap)}`,meta:{complicationId:c.id,complicationResolved:true}})}else{addAudit('COMPLICATION_RESPONSE',`${c.type} • ${r.note||snapshotVitalsText(snap)}`);addEvent({category:'Response',name:`${c.type} response`,note:`${snapshotVitalsText(snap)}${r.note?' • '+r.note:''}`,meta:{complicationId:c.id}})}
  save();renderComplications();renderEvents();renderOrLive();
}
function renderComplications(){
  const arr=state.complications||[],active=arr.filter(c=>c.status!=='resolved');if($('orActiveComplicationCount')){$('orActiveComplicationCount').textContent=`${active.length} ACTIVE`;$('orActiveComplicationCount').className=`status-pill ${active.length?'danger':'good'}`}
  const html=(items,compact=false)=>items.length?items.map(c=>{const last=(c.responses||[]).at(-1);return `<div class="complication-card ${c.status==='resolved'?'resolved':c.severity==='emergency'?'emergency':''}"><div class="complication-head"><b>${escapeHtml(c.type)}</b><span>${escapeHtml(c.status==='resolved'?'RESOLVED':String(c.severity||'observe').toUpperCase())}</span></div><div class="complication-meta">${escapeHtml(formatShortElapsed(c.elapsedMs))} • onset ${escapeHtml(snapshotVitalsText(c.onsetSnapshot||{}))}</div>${compact?'':`<div class="complication-detail">${escapeHtml([c.assessment&&`Assessment: ${c.assessment}`,c.intervention&&`Intervention: ${c.intervention}`,c.note].filter(Boolean).join(' • ')||'No additional note')}</div>`}${last?`<small>Latest response: ${escapeHtml(snapshotVitalsText(last.snapshot||{}))}${last.note?' • '+escapeHtml(last.note):''}</small>`:''}${c.status==='resolved'?`<em>Resolved ${escapeHtml(c.resolvedClock||'')} • ${escapeHtml(c.resolutionNote||'—')}</em>`:`<div class="complication-actions"><button class="btn complication-response" data-id="${escapeHtml(c.id)}" type="button">Capture response</button><button class="btn primary complication-resolve" data-id="${escapeHtml(c.id)}" type="button">Resolve</button></div>`}</div>`}).join(''):'';
  const main=$('complicationList');if(main){if(!arr.length){main.className='complication-list empty-state';main.textContent='ยังไม่มี complication'}else{main.className='complication-list';main.innerHTML=html(arr)}}
  const or=$('orActiveComplications');if(or){if(!active.length){or.className='complication-list empty-state compact';or.textContent='No active complications'}else{or.className='complication-list compact';or.innerHTML=html(active,true)}}
  $$('.complication-response').forEach(b=>b.addEventListener('click',()=>complicationResponse(b.dataset.id,false)));$$('.complication-resolve').forEach(b=>b.addEventListener('click',()=>complicationResponse(b.dataset.id,true)));
}
$('complicationCloseBtn')?.addEventListener('click',closeComplicationDialog);$('complicationCancelBtn')?.addEventListener('click',closeComplicationDialog);$('complicationSaveBtn')?.addEventListener('click',startComplicationRecord);$('addComplicationBtn')?.addEventListener('click',()=>openComplicationDialog('Hypotension'));$$('.quick-complication').forEach(btn=>btn.addEventListener('click',()=>openComplicationDialog(btn.dataset.complication||'')));

function addEvent({category,name,dose='',route='',note='',meta={}}){
  if(!ensureTimerStarted())return false;
  const ev={
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),
    epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),
    category,name,dose,route,note,...(meta||{})
  };
  state.events.push(ev);state.events.sort((a,b)=>a.epoch-b.epoch);
  save();renderEvents();renderTrends();renderProcedureTimeline();renderOrLive();renderComplications();renderDrugAdministrationAudit();toast(`${name} • ${ev.clock}`);return ev;
}

$$('.administered-btn').forEach(btn=>btn.addEventListener('click',()=>{
  if(!requireCurrentWeight('administering weight-based medication'))return;
  const inp=$(btn.dataset.input),ml=Number(inp?.value||0);if(!(ml>0)){toast('กรุณาใส่ actual administered volume');return}
  const drug=btn.dataset.drug,concMap={Diazepam:'diazepamConc',Propofol:'propofolConc',Tramadol:'tramadolConc'},concId=concMap[drug],conc=concId?Number($(concId)?.value||0):0,mg=conc>0?ml*conc:null;
  openDrugAdministration({drug,calculated:mg!==null?`${fmtDose(mg)} mg • entered plan volume ${fmtVol(ml)} mL`:`Entered plan volume ${fmtVol(ml)} mL`,suggestedMl:ml,route:'',note:'From Anesthesia plan — confirm actual route/amount',concentration:conc>0?`${conc} mg/mL`:'',source:'Anesthesia plan'});
}));
$('copyPlanToEventsBtn')?.addEventListener('click',()=>{const planned=[];if($('planPremed').value)planned.push(['Premed',$('planPremed').value]);if($('planInduction').value)planned.push(['Induction',$('planInduction').value]);if($('planMaintenance').value)planned.push(['Maintenance',$('planMaintenance').value]);if($('planAnalgesia').value)planned.push(['Analgesia',$('planAnalgesia').value]);planned.forEach(([cat,name])=>addEvent({category:'Plan',name:`${cat}: ${name}`,note:'Planned anesthesia component'}));toast('Planned components added to Events')});
$$('.drug-event-btn').forEach(btn=>btn.addEventListener('click',()=>{
  if(!requireCurrentWeight('using the Drug Calculator'))return;
  const doseEl=btn.dataset.doseid?$(btn.dataset.doseid):null,volEl=btn.dataset.volid?$(btn.dataset.volid):null;
  const calculated=[doseEl?.textContent,volEl?.textContent].filter(Boolean).join(' • ');
  const suggested=parseMlNumber(volEl?.textContent);
  openDrugAdministration({drug:btn.dataset.drug,calculated,suggestedMl:suggested,route:'',note:'From built-in hospital preset',source:'Built-in hospital preset'});
}));
['diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'].forEach(id=>{
  const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{drugCalc();save()});
});

$$('.quick-event').forEach(b=>b.addEventListener('click',()=>addEvent({category:b.dataset.cat,name:b.dataset.label})));
$('addEventBtn').addEventListener('click',()=>{
  const name=$('eventName').value.trim(),category=$('eventCategory').value,dose=$('eventDose').value.trim(),route=$('eventRoute').value.trim(),note=$('eventNote').value.trim();
  if(!name){toast('กรุณาใส่ Name / Event');return}
  if(category==='Drug'){openDrugAdministration({drug:name,calculated:dose||'Manual entry',suggestedMl:parseMlNumber(dose),route,note,source:'Manual event entry'});['eventName','eventDose','eventRoute','eventNote'].forEach(id=>$(id).value='');return}
  addEvent({category,name,dose,route,note});
  ['eventName','eventDose','eventRoute','eventNote'].forEach(id=>$(id).value='');
});
function populateResponseSelect(){const sel=$('responseEventSelect');if(!sel)return;const events=(state.events||[]).filter(e=>['Drug','Fluid','Complication','Ventilation'].includes(e.category));sel.innerHTML=events.length?events.map(e=>`<option value="${escapeHtml(e.id)}">${escapeHtml(formatShortElapsed(e.elapsedMs)+' • '+e.name)}</option>`).join(''):'<option value="">— no intervention event —</option>'}
$('captureResponseBtn')?.addEventListener('click',()=>{const id=$('responseEventSelect').value;if(!id){toast('เลือก intervention ก่อน');return}const ev=(state.events||[]).find(e=>String(e.id)===String(id));if(!ev)return;const now=currentSnapshot(''),resp={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),eventId:id,eventName:ev.name,eventElapsed:ev.elapsedMs,capturedElapsed:now.elapsedMs,map:now.map,hr:now.hr,spo2:now.spo2,etco2:now.etco2,temp:now.temp,note:$('responseNote').value.trim()};state.responses=state.responses||[];state.responses.push(resp);$('responseNote').value='';save();renderResponses();toast('Response captured')});
function renderResponses(){populateResponseSelect();const el=$('responseList'),arr=state.responses||[];if(!el)return;if(!arr.length){el.className='response-list empty-state';el.textContent='ยังไม่มี response tracking';return}el.className='response-list';el.innerHTML=arr.map(r=>`<div class="response-card"><b>${escapeHtml(r.eventName)} → response at +${escapeHtml(formatShortElapsed(r.capturedElapsed-r.eventElapsed))}</b><span>MAP ${r.map??'—'} • HR ${r.hr??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp==null?'—':tempTextF(r.temp)}${r.note?' • '+escapeHtml(r.note):''}</span></div>`).join('')}
function renderEvents(){
  renderResponses();renderComplications();renderDrugAdministrationAudit();
  const events=state.events||[];
  $('eventCountText').textContent=`${events.length} event${events.length===1?'':'s'}`;
  const el=$('eventLog');
  if(!events.length){el.className='event-list empty-state';el.textContent='ยังไม่มี Event';return}
  el.className='event-list';
  el.innerHTML=events.map(e=>`<div class="event-row">
    <div class="event-time">${formatShortElapsed(e.elapsedMs)}</div>
    <div class="event-category">${escapeHtml(e.category)}</div>
    <div class="event-main"><b>${escapeHtml(e.name)}${e.dose?' • '+escapeHtml(e.dose):''}${e.route?' • '+escapeHtml(e.route):''}</b><span>${escapeHtml(e.note||'')}</span></div>
    <button class="delete-btn event-delete" data-id="${escapeHtml(e.id)}">✕</button>
  </div>`).join('');
  $$('.event-delete').forEach(b=>b.addEventListener('click',()=>{
    const target=state.events.find(e=>String(e.id)===String(b.dataset.id));if(target?.drugAdministrationId||target?.complicationId){toast('Linked clinical audit event ลบไม่ได้ — ใช้ structured workflow แทน');return}state.events=state.events.filter(e=>String(e.id)!==String(b.dataset.id));save();renderEvents();renderTrends();renderProcedureTimeline();renderComplications();
  }));
}
$('clearEventsBtn').addEventListener('click',()=>{
  const protectedCount=(state.events||[]).filter(e=>e.drugAdministrationId||e.complicationId).length;
  if(!confirm(protectedCount?`ล้าง Event ที่ไม่เชื่อม structured audit?\n\n${protectedCount} linked events จะถูกเก็บไว้`:'ล้าง Event log ทั้งหมด?'))return;
  state.events=(state.events||[]).filter(e=>e.drugAdministrationId||e.complicationId);save();renderEvents();renderTrends();renderProcedureTimeline();
});

function metricValues(key){return (state.records||[]).map(r=>r[key]).filter(v=>v!==null&&v!==''&&v!==undefined).map(Number).filter(Number.isFinite)}
function renderSummary(){
  const recs=state.records||[];
  $('sumDuration').textContent=formatShortElapsed(currentElapsed());
  $('sumRecords').textContent=recs.length;
  const set=(id,key,mode,suffix='')=>{
    const v=metricValues(key);if(!v.length){$(id).textContent='—';return}
    const n=mode==='min'?Math.min(...v):Math.max(...v);
    $(id).textContent=(key==='temp'?n.toFixed(1):Math.round(n))+suffix;
  };
  set('sumMap','map','min');set('sumSpO2','spo2','min','%');set('sumEtco2','etco2','max');const tv=metricValues('temp');$('sumTemp').textContent=tv.length?tempTextF(Math.min(...tv)):'—';
}
function eventXDomain(records){
  const xs=records.map((r,i)=>Number(r.elapsedMs)||i*Number($('recordInterval').value||5)*60000);
  return xs;
}
function svgChartMulti(svgId,series,opts={}){
  const svg=$(svgId),W=760,H=300,M={l:58,r:18,t:22,b:43};
  svg.innerHTML='';
  const recs=state.records||[];
  if(!recs.length){
    svg.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" fill="#7b8994" font-size="18">ยังไม่มีข้อมูล</text>`;return;
  }
  const xs=eventXDomain(recs),xMin=Math.min(...xs),xMax0=Math.max(...xs),xMax=xMax0===xMin?xMin+60000:xMax0;
  const allVals=[];
  series.forEach(s=>recs.forEach(r=>{const raw=r[s.key];if(raw===null||raw===''||raw===undefined)return;let n=Number(raw);if(Number.isFinite(n)){if(typeof s.transform==='function')n=s.transform(n);allVals.push(n)}}));
  if(!allVals.length)return;
  let yMin=opts.min!==undefined?opts.min:Math.min(...allVals),yMax=opts.max!==undefined?opts.max:Math.max(...allVals);
  if(yMin===yMax){yMin-=1;yMax+=1}
  if(opts.min===undefined){const p=(yMax-yMin)*.1||1;yMin-=p}
  if(opts.max===undefined){const p=(yMax-yMin)*.1||1;yMax+=p}
  const sx=x=>M.l+(x-xMin)/(xMax-xMin)*(W-M.l-M.r);
  const sy=y=>H-M.b-(y-yMin)/(yMax-yMin)*(H-M.t-M.b);
  const NS='http://www.w3.org/2000/svg';
  const add=(tag,attrs={},text)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;svg.appendChild(e);return e};
  add('rect',{x:0,y:0,width:W,height:H,fill:'#fff'});
  for(let i=0;i<=4;i++){
    const y=M.t+i*(H-M.t-M.b)/4,val=yMax-i*(yMax-yMin)/4;
    add('line',{x1:M.l,y1:y,x2:W-M.r,y2:y,stroke:'#e6edef','stroke-width':1});
    add('text',{x:M.l-8,y:y+4,'text-anchor':'end',fill:'#6b7884','font-size':12},opts.decimal?val.toFixed(1):Math.round(val));
  }
  const ticks=Math.min(5,recs.length);
  for(let i=0;i<ticks;i++){
    const t=ticks===1?0:i/(ticks-1),x=M.l+t*(W-M.l-M.r),xv=xMin+t*(xMax-xMin);
    add('text',{x,y:H-14,'text-anchor':'middle',fill:'#6b7884','font-size':12},`${Math.round(xv/60000)}m`);
  }
  (opts.lines||[]).forEach(l=>{
    if(l.value<yMin||l.value>yMax)return;
    const y=sy(l.value);
    add('line',{x1:M.l,y1:y,x2:W-M.r,y2:y,stroke:l.color||'#b46b00','stroke-width':1.3,'stroke-dasharray':'6 5'});
    add('text',{x:W-M.r-3,y:y-4,'text-anchor':'end',fill:l.color||'#8b5700','font-size':11},l.label||String(l.value));
  });

  // Event markers
  (state.events||[]).forEach((e,idx)=>{
    if(e.elapsedMs<xMin||e.elapsedMs>xMax)return;
    const x=sx(e.elapsedMs);
    add('line',{x1:x,y1:M.t,x2:x,y2:H-M.b,stroke:'#9bb8c0','stroke-width':1,'stroke-dasharray':'2 5',opacity:.72});
    if(idx<10) add('text',{x:x+3,y:M.t+11,'text-anchor':'start',fill:'#55727b','font-size':9},String(idx+1));
  });

  const colors=['#0d5265','#16845a','#b52b26'];
  series.forEach((s,si)=>{
    let d='';
    recs.forEach((r,i)=>{
      const raw=r[s.key];if(raw===null||raw===''||raw===undefined)return;let y=Number(raw);if(!Number.isFinite(y))return;if(typeof s.transform==='function')y=s.transform(y);
      d+=(d?' L':'M')+` ${sx(xs[i]).toFixed(1)} ${sy(y).toFixed(1)}`;
    });
    add('path',{d,fill:'none',stroke:colors[si%colors.length],'stroke-width':2.7,'stroke-linecap':'round','stroke-linejoin':'round'});
    recs.forEach((r,i)=>{
      const raw=r[s.key];if(raw===null||raw===''||raw===undefined)return;let y=Number(raw);if(!Number.isFinite(y))return;if(typeof s.transform==='function')y=s.transform(y);
      const c=add('circle',{cx:sx(xs[i]),cy:sy(y),r:4.3,fill:colors[si%colors.length],stroke:'#fff','stroke-width':1.5});
      const title=document.createElementNS(NS,'title');title.textContent=`${s.label} ${y} • ${formatShortElapsed(r.elapsedMs)}${r.note?' • '+r.note:''}`;c.appendChild(title);
    });
  });
  if(series.length>1){
    series.forEach((s,si)=>{
      const x=M.l+si*88;add('line',{x1:x,y1:10,x2:x+18,y2:10,stroke:colors[si%colors.length],'stroke-width':3});
      add('text',{x:x+23,y:14,fill:'#566873','font-size':11},s.label);
    });
  }
}
function renderTrends(){
  renderSummary();
  const showSapDap=currentSettingsObject().showSapDap!==false;
  svgChartMulti('chartBP',showSapDap?[{key:'sap',label:'SAP'},{key:'map',label:'MAP'},{key:'dap',label:'DAP'}]:[{key:'map',label:'MAP'}],{min:30,max:180,lines:[{value:60,label:'MAP 60'}]});
  if($('bpChartSeriesLabel'))$('bpChartSeriesLabel').textContent=showSapDap?'SAP / MAP / DAP':'MAP';
  const sp=$('species').value;
  const hrLines=sp==='cat'
    ? [{value:100,label:'HR 100'},{value:180,label:'HR 180'}]
    : [{value:60,label:'HR 60'},{value:150,label:'HR 150'}];
  const rrLines=sp==='cat'
    ? [{value:7,label:'RR 7'},{value:10,label:'RR 10'},{value:28,label:'RR 28'}]
    : [{value:6,label:'RR 6'},{value:8,label:'RR 8'},{value:20,label:'RR 20'}];
  svgChartMulti('chartHR',[{key:'hr',label:'HR'}],{min:20,max:260,lines:hrLines});
  svgChartMulti('chartSpO2',[{key:'spo2',label:'SpO₂'}],{min:80,max:100,lines:[{value:95,label:'95%'},{value:90,label:'90%'}]});
  svgChartMulti('chartETCO2',[{key:'etco2',label:'ETCO₂'}],{min:20,max:80,lines:[{value:60,label:'60'},{value:40,label:'40'}]});
  svgChartMulti('chartRR',[{key:'rr',label:'RR'}],{min:0,max:60,lines:rrLines});
  {const isC=activeTempDisplayUnit==='C';svgChartMulti('chartTemp',[{key:'temp',label:`Temp ${tempSymbol()}`,transform:v=>tempStoredFToDisplay(v)}],{min:isC?34:93,max:isC?40:104,decimal:true,lines:[{value:isC?Number(fToC(98).toFixed(1)):98.0,label:tempTextF(98)}]});}
  renderTimeline();
}
function renderTimeline(){
  const items=[
    ...(state.events||[]).map(e=>({elapsedMs:e.elapsedMs,clock:e.clock,cat:e.category,text:`${e.name}${e.dose?' • '+e.dose:''}${e.note?' • '+e.note:''}`})),
    ...(state.records||[]).filter(r=>r.note).map(r=>({elapsedMs:r.elapsedMs,clock:r.clock,cat:'Record note',text:r.note}))
  ].sort((a,b)=>a.elapsedMs-b.elapsedMs);
  const el=$('clinicalTimeline');
  if(!items.length){el.className='timeline muted';el.textContent='ยังไม่มี event';return}
  el.className='timeline';
  el.innerHTML=items.map(i=>`<div class="timeline-item"><div class="time">${formatShortElapsed(i.elapsedMs)}</div><div class="cat">${escapeHtml(i.cat)}</div><div>${escapeHtml(i.text)}</div></div>`).join('');
}
$$('.graph-filter').forEach(b=>b.addEventListener('click',()=>{
  $$('.graph-filter').forEach(x=>x.classList.remove('primary'));b.classList.add('primary');
  const v=b.dataset.view;
  $$('.chart-card').forEach(c=>c.style.display='');
  if(v==='hemo')$$('.chart-card:not(.hemo-chart)').forEach(c=>c.style.display='none');
  if(v==='resp')$$('.chart-card:not(.resp-chart)').forEach(c=>c.style.display='none');
  if(v==='temp')$$('.chart-card:not(.temp-chart)').forEach(c=>c.style.display='none');
}));


function activeBuiltInProtocol(){
  const snap=state?.protocolSnapshot?.builtInProtocol;if(snap){const v=k=>snap[k]?.value??snap[k];return{diazepamDose:v('diazepamDose'),propofolDose:v('propofolDose'),tramadolDose:v('tramadolDose'),carprofenDose:v('carprofenDose'),meloxicamDose:v('meloxicamDose'),cefazolinDivisor:v('cefazolinDivisor'),conveniaDivisor:v('conveniaDivisor'),adrenalineDose:v('adrenalineDose'),atropineBradyDose:v('atropineBradyDose'),atropineCprDose:v('atropineCprDose')}}
  const s=currentSettingsObject();return{diazepamDose:s.diazepamDose,propofolDose:s.propofolDose,tramadolDose:s.tramadolDose,carprofenDose:s.carprofenDose,meloxicamDose:s.meloxicamDose,cefazolinDivisor:s.cefazolinDivisor,conveniaDivisor:s.conveniaDivisor,adrenalineDose:s.adrenalineDose,atropineBradyDose:s.atropineBradyDose,atropineCprDose:s.atropineCprDose}
}
function protocolNumber(k,fallback){const n=Number(activeBuiltInProtocol()?.[k]);return Number.isFinite(n)&&n>0?n:fallback}

function updatePlanCalc(){
  const w=currentWeightReady()?currentWeightKg():null,dConc=Number($('diazepamConc')?.value||5),pConc=Number($('propofolConc')?.value||10),tConc=Number($('tramadolConc')?.value||50);
  if(w===null){['planDiazepamCalc','planPropofolCalc','planTramadolCalc'].forEach(id=>{if($(id))$(id).textContent='Current BW required'});return}
  const dd=protocolNumber('diazepamDose',0.25),pd=protocolNumber('propofolDose',4),td=protocolNumber('tramadolDose',4);
  if($('planDiazepamCalc'))$('planDiazepamCalc').textContent=`${fmtDose(w*dd)} mg • ${dConc>0?fmtVol((w*dd)/dConc):'—'} mL`;
  if($('planPropofolCalc'))$('planPropofolCalc').textContent=`${fmtDose(w*pd)} mg • ${pConc>0?fmtVol((w*pd)/pConc):'—'} mL planned`;
  if($('planTramadolCalc'))$('planTramadolCalc').textContent=`${fmtDose(w*td)} mg • ${tConc>0?fmtVol((w*td)/tConc):'—'} mL`;
}
function drugCalc(){
  const w=currentWeightReady()?currentWeightKg():null;
  if($('drugWeight')) $('drugWeight').textContent=w===null?'Current BW required':`${w.toFixed(1)} kg`;
  const setText=(id,text)=>{if($(id))$(id).textContent=text};
  if(w===null){
    ['diazepamMg','diazepamMl','propofolMg','propofolMl','tramadolMg','tramadolMl','rimadylMg','rimadylMl','metacamMg','metacamMl','cefazolinMl','conveniaMl','adrenalineMg','adrenalineMl','atropineMg','atropineMl','dopamineMcgMin','dopamineMlHr'].forEach(id=>setText(id,id.endsWith('Ml')||id.endsWith('MlHr')?'— mL':'—'));
    updateDoseSpotlights();updateCustomDrugCalc('induction',false);updateCustomDrugCalc('pre',false);updateCustomDrugCalc('post',false);renderWeightSafetyState();return;
  }
  const doseCalc=(dose,conc,mgId,mlId)=>{const mg=w*dose,c=Number($(conc)?.value||0);setText(mgId,`${fmtDose(mg)} mg`);setText(mlId,c>0?`${fmtVol(mg/c)} mL`:'— mL')};
  doseCalc(protocolNumber('diazepamDose',0.25),'diazepamConc','diazepamMg','diazepamMl');doseCalc(protocolNumber('propofolDose',4),'propofolConc','propofolMg','propofolMl');doseCalc(protocolNumber('tramadolDose',4),'tramadolConc','tramadolMg','tramadolMl');doseCalc(protocolNumber('carprofenDose',4.4),'rimadylConc','rimadylMg','rimadylMl');doseCalc(protocolNumber('meloxicamDose',0.3),'metacamConc','metacamMg','metacamMl');
  const cefDiv=protocolNumber('cefazolinDivisor',10),convDiv=protocolNumber('conveniaDivisor',10);setText('cefazolinMl',`${fmtVol(w/cefDiv)} mL`);setText('conveniaMl',`${fmtVol(w/convDiv)} mL`);
  const adrMg=w*protocolNumber('adrenalineDose',0.01),adrConc=Number($('adrenalineConc')?.value||1);setText('adrenalineMg',`${fmtDose(adrMg)} mg`);setText('adrenalineMl',adrConc>0?`${fmtVol(adrMg/adrConc)} mL`:'— mL');
  const atropDose=Number($('atropineMode')?.value||protocolNumber('atropineBradyDose',0.02)),atropMg=w*atropDose,atropConc=Number($('atropineConc')?.value||0.6);setText('atropineMg',`${fmtDose(atropMg)} mg`);setText('atropineMl',atropConc>0?`${fmtVol(atropMg/atropConc)} mL`:'— mL');
  const dopDose=Number($('dopamineDose')?.value||5),dopConc=Number($('dopamineConc')?.value||1),mcgMin=dopDose*w;setText('dopamineMcgMin',`${fmtDose(mcgMin)} μg/min`);setText('dopamineMlHr',dopConc>0?`${fmtVol((mcgMin*60)/(1000*dopConc))} mL/hr`:'— mL/hr');
  const sp=$('species')?.value;if($('nsaidDogCard'))$('nsaidDogCard').style.display=sp==='dog'?'flex':'none';if($('nsaidCatCard'))$('nsaidCatCard').style.display=sp==='cat'?'flex':'none';
  updateDoseSpotlights();updateCustomDrugCalc('induction',false);updateCustomDrugCalc('pre',false);updateCustomDrugCalc('post',false);renderWeightSafetyState();
}
function fmtDose(n){
  if(!Number.isFinite(n))return '—';
  if(Math.abs(n)<1)return n.toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
  if(Math.abs(n)<10)return n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
  return n.toFixed(1).replace(/\.0$/,'');
}
function fmtVol(n){
  if(!Number.isFinite(n))return '—';
  if(n<0.1)return n.toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
  if(n<10)return n.toFixed(2).replace(/0+$/,'').replace(/\.$/,'');
  return n.toFixed(1).replace(/\.0$/,'');
}

function renderLegacyBalanceSummary(){
 const w=currentWeightReady()?currentWeightKg():null,cryst=Number($('balanceCrystalloid')?.value||0),bolus=Number($('balanceBolus')?.value||0),bloodIn=Number($('balanceBloodIn')?.value||0),loss=Number($('balanceBloodLoss')?.value||0),urine=Number($('balanceUrine')?.value||0),totalIn=cryst+bolus+bloodIn,net=totalIn-loss-urine,hasData=hasFluidCaseData();
 if($('balanceFluidIn'))$('balanceFluidIn').textContent=hasData?`${fmtVol(totalIn)} mL`:'—';if($('balanceFluidInKg'))$('balanceFluidInKg').textContent=hasData&&w?`${fmtVol(totalIn/w)} mL/kg`:'—';
 if($('balanceLoss'))$('balanceLoss').textContent=hasData?`${fmtVol(loss)} mL`:'—';if($('balanceLossKg'))$('balanceLossKg').textContent=hasData&&w?`${fmtVol(loss/w)} mL/kg`:'—';
 if($('balanceUrineOut'))$('balanceUrineOut').textContent=hasData?`${fmtVol(urine)} mL`:'—';if($('balanceUrineKg'))$('balanceUrineKg').textContent=hasData&&w?`${fmtVol(urine/w)} mL/kg`:'—';if($('balanceNet'))$('balanceNet').textContent=hasData?`${fmtVol(net)} mL`:'—';
}
function updateBalance(){renderLegacyBalanceSummary();renderOrFluidPanel();}
['balanceCrystalloid','balanceBolus','balanceBloodIn','balanceBloodLoss','balanceUrine'].forEach(id=>$(id)?.addEventListener('input',()=>{renderLegacyBalanceSummary();save()}));


function currentFluidRate(){
  const h=state.fluidRateHistory||[];
  if(h.length)return Number(h[h.length-1].rate)||0;
  return Number($('fluidRateInput')?.value||0)||0;
}
function calculatedCrystalloidTotal(){
  const h=(state.fluidRateHistory||[]).slice().sort((a,b)=>a.elapsedMs-b.elapsedMs);
  if(!h.length)return 0;
  const now=currentElapsed();
  let total=0;
  for(let i=0;i<h.length;i++){
    const start=Math.max(0,Number(h[i].elapsedMs)||0);
    const end=i<h.length-1?Math.max(start,Number(h[i+1].elapsedMs)||start):Math.max(start,now);
    total+=(Number(h[i].rate)||0)*(end-start)/3600000;
  }
  return Math.max(0,total);
}
function effectiveCrystalloidTotal(){
  const raw=$('fluidActualTotal')?.value;
  if(raw!==undefined&&raw!==null&&String(raw).trim()!==''){
    const n=Number(raw);if(Number.isFinite(n)&&n>=0)return n;
  }
  return calculatedCrystalloidTotal();
}
function hasFluidCaseData(){
  return !!((state.fluidRateHistory||[]).length || ['fluidActualTotal','balanceCrystalloid','balanceBolus','balanceBloodIn','balanceBloodLoss','balanceUrine','fluidRateInput'].some(id=>{
    const v=$(id)?.value;return v!==undefined&&v!==null&&String(v).trim()!=='';
  }));
}
function getFluidMetrics(){
  const w=currentWeightReady()?currentWeightKg():null;
  const calc=calculatedCrystalloidTotal(),cryst=effectiveCrystalloidTotal();
  const bolus=Number($('balanceBolus')?.value||0)||0;
  const bloodIn=Number($('balanceBloodIn')?.value||0)||0;
  const loss=Number($('balanceBloodLoss')?.value||0)||0;
  const urine=Number($('balanceUrine')?.value||0)||0;
  const totalIn=cryst+bolus+bloodIn,net=totalIn-loss-urine;
  return {w,calc,cryst,bolus,bloodIn,loss,urine,totalIn,net};
}
function syncFluidLegacyFields(){
  const fm=getFluidMetrics(),hasData=hasFluidCaseData();
  if($('balanceCrystalloid')&&document.activeElement!==$('balanceCrystalloid'))$('balanceCrystalloid').value=hasData?fm.cryst.toFixed(1):'';
  if($('fluidTotal')&&document.activeElement!==$('fluidTotal'))$('fluidTotal').value=hasData?fm.totalIn.toFixed(1):'';
}
function logFluidEvent(name,note=''){
  const ev={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),category:'Fluid',name,dose:'',route:'',note};
  state.events.push(ev);state.events.sort((a,b)=>a.epoch-b.epoch);
  save();renderEvents();renderProcedureTimeline();renderOrRecent();renderCaseSummary();
}
function applyFluidRate(rate,log=true){
  rate=Math.max(0,Number(rate)||0);
  state.fluidRateHistory=state.fluidRateHistory||[];
  const elapsed=currentElapsed(),last=state.fluidRateHistory.at(-1);
  if(!last||Number(last.rate)!==rate)state.fluidRateHistory.push({epoch:Date.now(),elapsedMs:elapsed,rate});
  if($('fluidRateInput'))$('fluidRateInput').value=rate;
  if($('orFluidManageRate'))$('orFluidManageRate').value=rate;
  if(log)logFluidEvent('Crystalloid rate changed',`${fmtVol(rate)} mL/hr`);
  save();renderOrFluidPanel();renderCaseSummary();
}
function renderOrFluidPanel(){
  if(!$('orFluidManageRate'))return;
  const fm=getFluidMetrics(),rate=currentFluidRate(),hasData=hasFluidCaseData();
  if(document.activeElement!==$('orFluidManageRate'))$('orFluidManageRate').value=hasData?(rate||''):'';
  $('orFluidRateKg').textContent=hasData&&fm.w?`${fmtVol(rate/fm.w)} mL/kg/hr`:'—';
  $('orCalculatedCrystalloid').textContent=hasData?`${fmtVol(fm.calc)} mL`:'—';
  $('orCalculatedCrystalloidKg').textContent=hasData&&fm.w?`${fmtVol(fm.calc/fm.w)} mL/kg`:'—';
  $('orEffectiveCrystalloid').textContent=hasData?`${fmtVol(fm.cryst)} mL`:'—';
  $('orBolusTotal').textContent=hasData?`${fmtVol(fm.bolus)} mL`:'—';
  $('orBloodLossTotal').textContent=hasData?`${fmtVol(fm.loss)} mL`:'—';
  $('orBloodLossKg').textContent=hasData&&fm.w?`${fmtVol(fm.loss/fm.w)} mL/kg`:'—';
  $('orUrineTotal').textContent=hasData?`${fmtVol(fm.urine)} mL`:'—';
  $('orUrineKg').textContent=hasData&&fm.w?`${fmtVol(fm.urine/fm.w)} mL/kg`:'—';
  if(document.activeElement!==$('orBloodProductInput'))$('orBloodProductInput').value=hasFluidCaseData()?fmtVol(fm.bloodIn):'';
  $('orBloodProductKg').textContent=hasData&&fm.w?`${fmtVol(fm.bloodIn/fm.w)} mL/kg`:'—';
  $('orTotalFluidIn').textContent=hasData?`${fmtVol(fm.totalIn)} mL`:'—';
  $('orTotalFluidInKg').textContent=hasData&&fm.w?`${fmtVol(fm.totalIn/fm.w)} mL/kg`:'—';
  $('orFluidNet').textContent=hasData?`${fmtVol(fm.net)} mL`:'—';
  $('orCurrentRateDisplay').textContent=hasData?`${fmtVol(rate)} mL/hr`:'—';
  const hist=state.fluidRateHistory||[];
  $('fluidRateHistoryView').textContent=hist.length
    ? 'Rate history: '+hist.map(x=>`${formatShortElapsed(x.elapsedMs)} → ${fmtVol(x.rate)} mL/hr`).join(' • ')
    : 'No rate changes recorded yet';
  $('orFluidStatus').textContent=rate>0?'RUNNING':hasData?'READY':'NO DATA';
  $('orFluidStatus').className=`status-pill ${rate>0?'good':'warn'}`;
  syncFluidLegacyFields();
}
$('applyFluidRateBtn')?.addEventListener('click',()=>{
  const rate=Number($('orFluidManageRate').value);
  if(!Number.isFinite(rate)||rate<0){toast('กรุณาใส่ fluid rate ที่ถูกต้อง');return}
  applyFluidRate(rate,true);toast(`Fluid rate ${fmtVol(rate)} mL/hr`);
});
$('fluidActualTotal')?.addEventListener('input',()=>{renderOrFluidPanel();renderCaseSummary();save()});
$('orBloodProductInput')?.addEventListener('input',()=>{
  if($('balanceBloodIn'))$('balanceBloodIn').value=Math.max(0,Number($('orBloodProductInput').value)||0);
  renderOrFluidPanel();renderCaseSummary();save();
});
function incrementFluidMetric(kind,amount){
  amount=Math.max(0,Number(amount)||0);if(!(amount>0))return;
  const map={bolus:['balanceBolus','Fluid bolus'],bloodloss:['balanceBloodLoss','Estimated blood loss'],urine:['balanceUrine','Urine output']};
  const cfg=map[kind];if(!cfg)return;
  const el=$(cfg[0]),next=(Number(el?.value||0)||0)+amount;if(el)el.value=next.toFixed(1);
  logFluidEvent(`${cfg[1]} +${fmtVol(amount)} mL`,`Cumulative ${fmtVol(next)} mL`);
  renderOrFluidPanel();renderCaseSummary();save();
}
$$('[data-fluid-kind]').forEach(btn=>btn.addEventListener('click',()=>incrementFluidMetric(btn.dataset.fluidKind,btn.dataset.amount)));
$$('[data-fluid-custom]').forEach(btn=>btn.addEventListener('click',()=>{
  const v=prompt(`Add ${btn.dataset.fluidCustom} volume (mL)`);if(v===null)return;
  const n=Number(v);if(!(n>0)){toast('กรุณาใส่ volume มากกว่า 0');return}
  incrementFluidMetric(btn.dataset.fluidCustom,n);
}));

function getSmartAlerts(){
  const recs=state.records||[],alerts=[],num=v=>v===null||v===''||v===undefined?null:Number(v);
  if(recs.length>=3){
    const last3=recs.slice(-3),first=last3[0],last=last3[last3.length-1],spanMin=Math.max(1,(last.elapsedMs-first.elapsedMs)/60000);
    const fm=num(first.map),lm=num(last.map);if(fm!==null&&lm!==null){const drop=fm-lm;if(drop>=10)alerts.push({key:'map',level:lm<60?'danger':'warn',title:'Progressive hypotension',text:`MAP decreased ${Math.round(drop)} mmHg over ~${Math.round(spanMin)} min (${fm} → ${lm})`})}
    const fe=num(first.etco2),le=num(last.etco2);if(fe!==null&&le!==null){const rise=le-fe;if(rise>=8)alerts.push({key:'etco2',level:le>60?'danger':'warn',title:'Progressive hypercapnia',text:`ETCO₂ increased ${Math.round(rise)} mmHg (${fe} → ${le})`})}
    const ft=num(first.temp),lt=num(last.temp);if(ft!==null&&lt!==null){const drop=ft-lt;if(drop>=1.0)alerts.push({key:'temp',level:lt<98?'danger':'warn',title:'Progressive heat loss',text:`Temperature decreased ${tempDeltaTextF(drop)} (${tempTextF(ft)} → ${tempTextF(lt)})`})}
    const fs=num(first.spo2),ls=num(last.spo2);if(fs!==null&&ls!==null){const drop=fs-ls;if(drop>=3)alerts.push({key:'spo2',level:ls<90?'danger':'warn',title:'Falling SpO₂',text:`SpO₂ decreased ${Math.round(drop)} points (${fs}% → ${ls}%)`})}
  }
  return alerts;
}
function renderSmartAlerts(){
  const alerts=withAlertAdvice(getSmartAlerts()),box=$('smartAlerts');if(!box)return;
  $('smartAlertCount').textContent=`${alerts.length} ALERT${alerts.length===1?'':'S'}`;
  $('smartAlertCount').className=`status-pill ${alerts.some(a=>a.level==='danger')?'danger':alerts.length?'warn':'good'}`;
  box.innerHTML=alerts.length?alerts.map(a=>`<div class="smart-alert-item ${a.level}"><b>${escapeHtml(a.title)}</b><span>${escapeHtml(a.text)}</span>${a.advice?`<small class="alert-advice">Suggested first checks: ${escapeHtml(a.advice)}</small>`:''}</div>`).join(''):'<div class="empty-state">ยังไม่พบ trend alert</div>';
}
function seedRecoveryVitalsFromCurrent(){
  const pairs={recHR:'hr',recRR:'rr',recMAP:'map',recSpO2:'spo2',recTemp:'temp'};
  Object.entries(pairs).forEach(([r,m])=>{const re=$(r),me=$(m);if(re&&me&&me.value!==''&&me.value!=null)re.value=me.value});
}
function enterRecoveryAfterExtubation(){
  if(state.caseLocked)return;
  seedRecoveryVitalsFromCurrent();
  state.emergencyReturnActive=false;state.casePhase='recovery';
  if(!state.recoveryStartedAt)state.recoveryStartedAt=Date.now();
  if(autoWakeEnabled())requestScreenWakeLock(true);
  state.recoveryCompletedAt=null;
  captureRecoveryHandoff('After extubation');
  addEvent({category:'Recovery',name:'Recovery started after extubation',note:'Automatic transition from OR LIVE'});
  save();renderCasePhase();renderRecovery();renderRecoveryRecords();setTab('recovery',{force:true});
  toast('Extubation recorded → Recovery');
}
function emergencyReturnToOr(){
  if(state.casePhase!=='recovery'||state.recoveryCompletedAt){toast('Emergency return ใช้ได้ระหว่าง active Recovery เท่านั้น');return}
  if(!confirm('Emergency return to OR LIVE?\nใช้เมื่อจำเป็นต้อง re-intubate / ventilate / resuscitate หลัง extubation'))return;
  state.emergencyReturnActive=true;state.casePhase='emergency';
  addEvent({category:'Emergency',name:'Post-extubation emergency return to OR',note:'Recovery interrupted for emergency airway/resuscitation support'});
  save();renderCasePhase();setTab('orlive',{force:true});toast('EMERGENCY RETURN mode');
}
function returnToRecoveryAfterEmergency(){
  if(!state.emergencyReturnActive)return false;
  if(!confirm('Return to Recovery mode?'))return true;
  state.emergencyReturnActive=false;state.casePhase='recovery';
  captureRecoveryHandoff('After emergency return');
  addEvent({category:'Recovery',name:'Returned to recovery after emergency',note:'Emergency OR return ended'});
  save();renderCasePhase();renderRecovery();setTab('recovery',{force:true});return true;
}
$('emergencyReturnOrBtn')?.addEventListener('click',emergencyReturnToOr);

function recoveryAnyNA(){return $$('.recovery-check-na-btn').some(x=>x.classList.contains('active'))||$$('.recovery-observation-na-btn').some(x=>x.classList.contains('active'))}
function recoveryObservationNA(key){const btn=document.querySelector(`.recovery-observation-na-btn[data-key="${key}"]`);return btn?btn.classList.contains('active'):!!state.recoveryObservationNA?.[key]}
function recoveryNAReasonValid(){return !recoveryAnyNA()||!!$('recNaReason')?.value.trim()}
function renderRecovery(){
  const all=$$('.recovery-check'),done=all.filter(x=>x.checked).length,na=$$('.recovery-check-na-btn').filter(x=>x.classList.contains('active')).length,reviewed=done+na,el=$('recoveryStatus');
  el.textContent=`Checklist ${reviewed}/${all.length}${na?` • N/A ${na}`:''}`;
  el.className=`recovery-status ${reviewed===all.length&&recoveryNAReasonValid()?'good':'warn'}`;
  const rr=Number($('recRR')?.value||0),spo=Number($('recSpO2')?.value||0),tempF=tempInputStoredF('recTemp');
  const ment=$('recMentation')?.value||'',ext=$('recExtubation')?.value.trim()||'';
  const spoOk=spo>0||recoveryObservationNA('spo2'),tempOk=(tempF!==null&&tempF>0)||recoveryObservationNA('temp'),extOk=!!ext||recoveryObservationNA('extubation');
  const ready=reviewed===all.length && rr>0 && spoOk && tempOk && !!ment && extOk && recoveryNAReasonValid() && (state.recoveryRecords||[]).length>0 && !state.emergencyReturnActive;
  if($('recoveryReadiness')){
    $('recoveryReadiness').textContent=ready?'READY FOR RECOVERY COMPLETE':'COMPLETE OBSERVATIONS / CHECKLIST';
    $('recoveryReadiness').className=`recovery-readiness ${ready?'good':'warn'}`;
  }
  renderRecoveryState();renderRecoveryScores();renderRecoveryHandoff();renderActiveProblems();
}
$$('.recovery-check').forEach((el,i)=>el.addEventListener('change',()=>{if(el.checked){const b=$$('.recovery-check-na-btn')[i];b?.classList.remove('active');el.disabled=false}renderRecovery();save()}));
$$('.recovery-check-na-btn').forEach((btn,i)=>btn.addEventListener('click',()=>{const active=!btn.classList.contains('active');btn.classList.toggle('active',active);const cb=$$('.recovery-check')[i];if(cb){cb.disabled=active;if(active)cb.checked=false}renderRecovery();save()}));
$$('.recovery-observation-na-btn').forEach(btn=>btn.addEventListener('click',()=>{const active=!btn.classList.contains('active');btn.classList.toggle('active',active);const input=btn.closest('.recovery-field-na')?.querySelector('input');if(input){input.disabled=active;if(active)input.value=''}renderRecovery();save()}));
['recHR','recRR','recMAP','recSpO2','recTemp','recExtubation','recOxygen','recMentation','recPain','recNaReason','recRecordInterval'].forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{save();renderRecovery()})});
function currentRecoveryScore(){
  const ids={airway:'recScoreAirway',oxygenation:'recScoreOxygen',temperature:'recScoreTemp',mentation:'recScoreMentation',comfort:'recScoreComfort'},domains={};let total=0,possible=0,incomplete=false,na=0;
  Object.entries(ids).forEach(([k,id])=>{const v=$(id)?.value||'';domains[k]=v;if(v===''){incomplete=true;return}if(v==='NA'){na++;return}const n=Number(v);if(!Number.isFinite(n)){incomplete=true;return}total+=n;possible+=2});
  return {domains,total,possible,percent:possible?Math.round(total/possible*100):null,incomplete,na,note:$('recScoreNote')?.value.trim()||''};
}
function recoveryScoreText(sc){if(!sc||sc.incomplete||!sc.possible)return 'Incomplete';return `${sc.total}/${sc.possible} (${sc.percent}%)${sc.na?` • N/A ${sc.na}`:''}`}
function saveRecoveryScore(){
  if(state.casePhase!=='recovery'||state.emergencyReturnActive){toast('Recovery score บันทึกได้ใน active Recovery mode');return}
  const sc=currentRecoveryScore();if(sc.incomplete){toast('กรุณาให้คะแนนทุก domain หรือเลือก N/A ที่อนุญาต');return}if(sc.na&&!$('recNaReason')?.value.trim()){toast('กรุณาระบุ N/A reason สำหรับ Recovery');$('recNaReason')?.focus();return}
  state.recoveryScores=state.recoveryScores||[];const entry={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),caseElapsedMs:currentElapsed(),recoveryElapsedMs:recoveryElapsed(),...sc,naReason:sc.na?$('recNaReason').value.trim():'',snapshot:{hr:Number($('recHR')?.value||0)||null,rr:Number($('recRR')?.value||0)||null,map:Number($('recMAP')?.value||0)||null,spo2:recoveryObservationNA('spo2')?null:(Number($('recSpO2')?.value||0)||null),temp:recoveryObservationNA('temp')?null:tempInputStoredF('recTemp'),mentation:$('recMentation')?.value||''}};
  state.recoveryScores.push(entry);addAudit('RECOVERY_SCORE_ADDED',`${entry.total}/${entry.possible} (${entry.percent}%)${entry.naReason?' • N/A: '+entry.naReason:''}`);save();renderRecoveryScores();renderEndCase();toast(`Recovery score saved • ${entry.total}/${entry.possible}`);
}
function renderRecoveryScores(){
  const live=currentRecoveryScore(),arr=state.recoveryScores||[];if($('recoveryScoreCurrent'))$('recoveryScoreCurrent').textContent=recoveryScoreText(live);if($('recoveryScoreCount'))$('recoveryScoreCount').textContent=String(arr.length);if($('recoveryScoreLatest'))$('recoveryScoreLatest').textContent=arr.length?`${arr.at(-1).total}/${arr.at(-1).possible} • ${arr.at(-1).clock}`:'—';
  const box=$('recoveryScoreHistory');if(!box)return;if(!arr.length){box.className='recovery-score-history empty-state';box.textContent='ยังไม่มี Recovery score';return}box.className='recovery-score-history';box.innerHTML=arr.map((r,i)=>`<div class="recovery-score-row"><b>#${i+1} • ${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))} • ${r.total}/${r.possible} (${r.percent}%)</b><span>Airway ${escapeHtml(r.domains.airway)} • O₂ ${escapeHtml(r.domains.oxygenation)} • Temp ${escapeHtml(r.domains.temperature)} • Mentation ${escapeHtml(r.domains.mentation)} • Comfort ${escapeHtml(r.domains.comfort)}</span><small>${escapeHtml([r.note,r.naReason?`N/A: ${r.naReason}`:''].filter(Boolean).join(' • ')||'—')}</small></div>`).join('');
}
$('saveRecoveryScoreBtn')?.addEventListener('click',saveRecoveryScore);['recScoreAirway','recScoreOxygen','recScoreTemp','recScoreMentation','recScoreComfort','recScoreNote'].forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{renderRecoveryScores();save()})});

function addRecoveryRecord(){
  if(!clinicalWriteAllowed())return;
  if(state.casePhase!=='recovery'||state.emergencyReturnActive){toast('Recovery records บันทึกได้ใน active Recovery mode');return}
  const hr=Number($('recHR')?.value||0),rr=Number($('recRR')?.value||0),mapRaw=$('recMAP')?.value,spoNA=recoveryObservationNA('spo2'),tempNA=recoveryObservationNA('temp'),spo2=spoNA?null:Number($('recSpO2')?.value||0),temp=tempNA?null:tempInputStoredF('recTemp');
  if(!(hr>0&&rr>0&&(spoNA||spo2>0)&&(tempNA||(temp!==null&&temp>0)))){toast('กรุณาตรวจ HR, RR และระบุ SpO₂/Temp หรือ mark N/A ก่อนบันทึก');return}
  if(recoveryAnyNA()&&!recoveryNAReasonValid()){toast('กรุณาระบุ N/A reason ก่อนบันทึก Recovery record');$('recNaReason')?.focus();return}
  const rec={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),caseElapsedMs:currentElapsed(),recoveryElapsedMs:recoveryElapsed(),hr,rr,map:mapRaw===''||mapRaw==null?null:Number(mapRaw),spo2,temp,na:{spo2:spoNA,temp:tempNA},naReason:(spoNA||tempNA)?$('recNaReason')?.value.trim()||'':'',oxygen:$('recOxygen')?.value||'',mentation:$('recMentation')?.value||'',note:$('recPain')?.value.trim()||'',recoveryScoreId:(state.recoveryScores||[]).at(-1)?.id||null};
  const warnings=plausibilityWarnings(rec,'recovery');if(warnings.length&&!confirmPlausibility(warnings,'Recovery record'))return;
  for(const k of ['map','spo2','temp'])alertObservationRevision[k]=(alertObservationRevision[k]||0)+1;rec.alertProtocol=WF.clone(activeAlertProtocol());syncAlertEpisodes(rec,{force:true,context:'recovery'});
  state.recoveryRecords=state.recoveryRecords||[];state.recoveryRecords.push(rec);recoveryDueReminderToken=null;
  addAudit('RECOVERY_RECORD_ADDED',`HR ${rec.hr} • RR ${rec.rr} • MAP ${rec.map??'—'} • SpO₂ ${rec.na?.spo2?'N/A':rec.spo2} • Temp ${rec.na?.temp?'N/A':tempTextF(rec.temp)}${rec.naReason?' • N/A: '+rec.naReason:''}`);
  save();renderRecoveryRecords();renderRecovery();renderProcedureTimeline();updateRecoveryDue();toast(`Recovery vitals recorded • ${rec.clock}`);
}
function renderRecoveryRecords(){
  const arr=state.recoveryRecords||[],body=$('recoveryRecordBody');if(!body)return;
  $('recoveryRecordCount').textContent=arr.length;
  $('recoveryRecordElapsed').textContent=formatElapsed(recoveryElapsed());
  $('recoveryLatestTime').textContent=arr.length?`${arr.at(-1).clock} • ${formatShortElapsed(arr.at(-1).recoveryElapsedMs)}`:'—';
  if(!arr.length){body.innerHTML='<tr><td colspan="11" class="empty-state">ยังไม่มี Recovery record</td></tr>';return}
  body.innerHTML=arr.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</td><td>${escapeHtml(r.clock)}</td><td>${r.hr??'—'}</td><td>${r.rr??'—'}</td><td>${r.map??'—'}</td><td>${r.na?.spo2?'N/A':(r.spo2??'—')}</td><td>${r.na?.temp?'N/A':(r.temp==null?'—':tempStoredFToDisplay(r.temp))}</td><td>${escapeHtml(r.oxygen||'—')}</td><td>${escapeHtml(r.mentation||'—')}</td><td>${escapeHtml([r.note,r.naReason?`N/A: ${r.naReason}`:''].filter(Boolean).join(' • ')||'—')}</td></tr>`).join('');
}
function updateRecoveryDue(){
  const badge=$('recoveryDueBadge');if(!badge)return;
  if(state.casePhase!=='recovery'||state.emergencyReturnActive){
    badge.textContent=state.emergencyReturnActive?'PAUSED — EMERGENCY RETURN':'NOT ACTIVE';badge.className='status-pill warn';return;
  }
  const arr=state.recoveryRecords||[],interval=Math.max(1,Number($('recRecordInterval')?.value||5))*60000;
  if(!arr.length){
    badge.textContent='FIRST RECORD DUE';badge.className='status-pill warn';
    const token=`first-${state.recoveryStartedAt||0}`;
    if(state.recoveryStartedAt && Date.now()-state.recoveryStartedAt>=10000 && recoveryDueReminderToken!==token){
      recoveryDueReminderToken=token;toast('ถึงเวลาบันทึก Recovery vital signs ชุดแรก');fireDueFeedback('recovery');
    }
    return;
  }
  const due=arr.at(-1).epoch+interval,delta=due-Date.now();
  if(delta<=0){
    badge.textContent=`DUE +${Math.floor(Math.abs(delta)/60000)}:${pad(Math.floor((Math.abs(delta)%60000)/1000))}`;badge.className='status-pill danger';
    if(recoveryDueReminderToken!==due){
      recoveryDueReminderToken=due;toast('ถึงเวลาบันทึก Recovery vital signs ซ้ำ');fireDueFeedback('recovery');
    }
  }else{
    badge.textContent=`NEXT ${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;badge.className='status-pill good';
  }
}
$('recordRecoveryVitalsBtn')?.addEventListener('click',addRecoveryRecord);

function recoveryElapsed(){return state.recoveryStartedAt?Math.max(0,(state.recoveryCompletedAt||Date.now())-state.recoveryStartedAt):0}
function renderRecoveryState(){
  if($('recoveryPhaseBadge')){
    if(state.recoveryCompletedAt){$('recoveryPhaseBadge').className='status-pill good';$('recoveryPhaseBadge').textContent='COMPLETE'}
    else if(state.casePhase==='recovery'){$('recoveryPhaseBadge').className='status-pill warn';$('recoveryPhaseBadge').textContent='RECOVERY ACTIVE'}
    else{$('recoveryPhaseBadge').className='status-pill';$('recoveryPhaseBadge').textContent='NOT STARTED'}
  }
  if($('recoveryElapsed'))$('recoveryElapsed').textContent=formatElapsed(recoveryElapsed());
  if($('beginRecoveryBtn'))$('beginRecoveryBtn').disabled=state.casePhase==='recovery'||!!state.recoveryCompletedAt;
  if($('completeRecoveryBtn'))$('completeRecoveryBtn').disabled=state.casePhase!=='recovery'||!!state.recoveryCompletedAt;
  if($('orBeginRecoveryBtn'))$('orBeginRecoveryBtn').textContent=state.emergencyReturnActive?'→ Return to Recovery':state.casePhase==='recovery'?'Recovery active':'→ Recovery';
  renderWorkflowLocks();updateRecoveryDue();
}
function beginRecovery(){
  if(!clinicalWriteAllowed()||!state.caseStartedAt){toast('Start a case before Recovery');return}
  if(state.emergencyReturnActive){returnToRecoveryAfterEmergency();return}
  if(state.casePhase==='recovery'){setTab('recovery',{force:true});return}
  if(state.recoveryCompletedAt){toast('Recovery already completed');return}
  if(!confirm('เริ่ม Recovery mode? ระบบจะบันทึกเวลาเริ่ม recovery ใน timeline'))return;
  seedRecoveryVitalsFromCurrent();
  state.emergencyReturnActive=false;state.casePhase='recovery';if(!state.recoveryStartedAt)state.recoveryStartedAt=Date.now();state.recoveryCompletedAt=null;renderCasePhase();
  captureRecoveryHandoff('Recovery started');
  addEvent({category:'Recovery',name:'Recovery started',note:'Post-anesthetic recovery mode'});save();renderRecoveryState();renderOrLive();setTab('recovery',{force:true});
}
function completeRecovery(){
  if(state.casePhase!=='recovery'||state.emergencyReturnActive)return;
  if(recoveryAnyNA()&&!recoveryNAReasonValid()){toast('กรุณาระบุ N/A reason ก่อน mark Recovery complete');$('recNaReason')?.focus();return}
  const checks=$$('.recovery-check'),done=checks.filter(x=>x.checked).length,na=$$('.recovery-check-na-btn').filter(x=>x.classList.contains('active')).length,reviewed=done+na,rc=(state.recoveryRecords||[]).length;
  const rr=Number($('recRR')?.value||0),spo=Number($('recSpO2')?.value||0),temp=tempInputStoredF('recTemp'),ment=$('recMentation')?.value||'',ext=$('recExtubation')?.value.trim()||'';
  const scoreCount=(state.recoveryScores||[]).length;
  const fullyReady=reviewed===checks.length && rc>0 && scoreCount>0 && rr>0 && (spo>0||recoveryObservationNA('spo2')) && ((temp!==null&&temp>0)||recoveryObservationNA('temp')) && !!ment && (!!ext||recoveryObservationNA('extubation')) && recoveryNAReasonValid();
  if(!fullyReady&&!confirm(`Recovery readiness ยังไม่ครบ
Checklist reviewed ${reviewed}/${checks.length} • Recovery records ${rc} • Recovery scores ${scoreCount}
ต้องการ mark complete ต่อหรือไม่?`))return;
  state.recoveryCompletedAt=Date.now();state.casePhase='complete';state.emergencyReturnActive=false;renderCasePhase();
  if(state.timer.running)pauseTimer();
  releaseScreenWakeLock(true);addAudit('RECOVERY_COMPLETE',`Recovery records ${(state.recoveryRecords||[]).length} • Recovery scores ${(state.recoveryScores||[]).length}`);
  addEvent({category:'Recovery',name:'Recovery complete',note:`Recovery duration ${formatShortElapsed(recoveryElapsed())} • ${rc} recovery records • ${(state.recoveryScores||[]).length} scores`});save();renderRecoveryState();renderRecoveryRecords();renderRecoveryScores();toast('Recovery marked complete');
  setTab('endcase');
}
$('beginRecoveryBtn')?.addEventListener('click',beginRecovery);$('completeRecoveryBtn')?.addEventListener('click',completeRecovery);$('orBeginRecoveryBtn')?.addEventListener('click',beginRecovery);$('orRecoveryQuickBtn')?.addEventListener('click',beginRecovery);


function asaDescription(code){
  return {
    I:'Normal healthy patient',
    II:'Mild systemic disease / well-controlled condition',
    III:'Severe systemic disease with reduced physiologic reserve',
    IV:'Severe systemic disease that is a constant threat to life',
    V:'Moribund patient unlikely to survive without intervention'
  }[code]||'—';
}
function reportInfoItem(label,value){
  return `<div class="report-info-item"><span>${escapeHtml(label)}</span><b>${escapeHtml(value??'—')}</b></div>`;
}
function buildPdfReport(){
  renderTrends();
  const species=({cat:'Cat',dog:'Dog'})[$('species').value]||'—';
  const asa=$('asa').value?`ASA ${$('asa').value}${$('emergency').checked?'-E':''}`:'ASA —';
  $('reportDate').innerHTML=`Generated ${escapeHtml(formatDate(Date.now()))}<br>${escapeHtml(formatClock())}`;
  if($('reportVoidNotice')){$('reportVoidNotice').hidden=!state.voidedAt;$('reportVoidNotice').textContent=state.voidedAt?`VOIDED RECORD • ${formatDate(state.voidedAt)} ${formatClock(state.voidedAt)} • ${state.voidedBy||'—'} • ${state.voidReason||'—'}`:''}
  if($('reportIntegrityGrid'))$('reportIntegrityGrid').innerHTML=[reportInfoItem('Record ID',state.humanRecordId||'—'),reportInfoItem('Final checksum',state.finalChecksum||'—'),reportInfoItem('Checksum algorithm',state.checksumAlgorithm||'—'),reportInfoItem('Locked at',state.lockedAt?`${formatDate(state.lockedAt)} ${formatClock(state.lockedAt)}`:'—')].join('');

  $('reportPatientGrid').innerHTML=[
    reportInfoItem('Patient',$('patientName').value||'—'),
    reportInfoItem('HN / Patient ID',$('hospitalId').value||'—'),
    reportInfoItem('Visit / Case ID',$('visitId')?.value||'—'),
    reportInfoItem('Species',species),
    reportInfoItem('Breed',$('breed').value||'—'),
    reportInfoItem('Sex / reproductive status',`${({male:'Male',female:'Female'})[$('sex')?.value]||'Unknown'} / ${({intact:'Intact',neutered:'Neutered',spayed:'Spayed'})[$('reproductiveStatus')?.value]||'Unknown'}`),
    reportInfoItem('Microchip',$('microchip')?.value||'—'),
    reportInfoItem('Age',$('age').value||'—'),
    reportInfoItem($('birthDateEstimated')?.checked?'Estimated birth period':'Date of birth',$('birthDateEstimated')?.checked?($('estimatedBirthPeriod')?.value||'Estimated'):($('birthDate')?.value||'—')),
    reportInfoItem('Age source',$('birthDateEstimated')?.checked?'Owner-reported / estimated age':'Date of birth'),
    reportInfoItem('Body weight',`${$('weight').value||'—'} kg`),
    reportInfoItem('BCS',$('bcs').value?`${$('bcs').value}/9`:'—'),
    reportInfoItem('ASA',`${asa} — ${asaDescription($('asa').value)}`),
    reportInfoItem('Procedure',$('patientProcedure')?.value||$('procedure').value||'—'),
    reportInfoItem('Drug allergy',$('patientAllergies')?.value||'—'),
    reportInfoItem('Underlying disease',$('patientComorbidities')?.value||'—'),
    reportInfoItem('Anesthetic cautions',$('patientPrecautions')?.value||'—')
  ].join('');

  
  const preopLabels={
    consent:'Consent / owner discussion',fasting:'Fasting / aspiration risk reviewed',exam:'Pre-anesthetic physical exam',
    labs:'Lab / imaging reviewed',iv:'IV catheter patent',oxygen:'O₂ source + backup checked',
    machine:'Anesthesia machine leak check',vaporizer:'Vaporizer / agent checked',absorber:'CO₂ absorbent checked',
    airway:'Airway equipment ready',suction:'Suction available',monitor:'Monitor attached / functional',
    warming:'Active warming ready',emergency:'Emergency drugs / crash plan ready'
  };
  $('reportPreop').innerHTML=`<div class="report-preop-grid">${Object.entries(preopLabels).map(([k,label])=>{const mark=(state.preopChecks||{})[k]?'☑':(state.preopNA||{})[k]?'N/A':'☐';return `<div class="report-preop-item"><span class="mark">${mark}</span><span>${escapeHtml(label)}</span></div>`}).join('')}</div>`;

  $('reportPlanGrid').innerHTML=[reportInfoItem('Premedication',$('planPremed').value||'—'),reportInfoItem('Induction',$('planInduction').value||'—'),reportInfoItem('Maintenance',$('planMaintenance').value||'—'),reportInfoItem('Analgesia',$('planAnalgesia').value||'—'),reportInfoItem('Antibiotic',$('planAntibiotic').value||'—'),reportInfoItem('NSAID',$('planNSAID').value||'—'),reportInfoItem('Block',$('planBlock').value||'—'),reportInfoItem('Plan note',$('planNote').value||'—')].join('');const fmReport=getFluidMetrics(),bw=fmReport.w;
  $('reportBalanceGrid').innerHTML=[
    ['Calculated crystalloid',`${fmtVol(fmReport.calc)} mL`],
    ['Effective crystalloid',`${fmtVol(fmReport.cryst)} mL`],
    ['Bolus',`${fmtVol(fmReport.bolus)} mL`],
    ['Blood product',`${fmtVol(fmReport.bloodIn)} mL`],
    ['Total fluid in',`${fmtVol(fmReport.totalIn)} mL`],
    ['Total fluid/kg',`${fmtVol(fmReport.totalIn/bw)} mL/kg`],
    ['Blood loss',`${fmtVol(fmReport.loss)} mL`],
    ['Blood loss/kg',`${fmtVol(fmReport.loss/bw)} mL/kg`],
    ['Urine',`${fmtVol(fmReport.urine)} mL`],
    ['Net estimate',`${fmtVol(fmReport.net)} mL`]
  ].map(([l,v])=>`<div class="report-summary-item"><span>${escapeHtml(l)}</span><b>${escapeHtml(v)}</b></div>`).join('');
  $('reportCaseGrid').innerHTML=[
    reportInfoItem('Procedure',$('procedure').value||'—'),
    reportInfoItem('Surgeon',$('surgeon').value||'—'),
    reportInfoItem('Anesthetist',$('anesthetist').value||'—'),
    reportInfoItem('Surgical assistant',$('surgicalAssistant')?.value||'—'),
    reportInfoItem('Duration',formatElapsed(currentElapsed())),
    reportInfoItem('Ventilation',$('ventilation').value||'—'),
    reportInfoItem('Latest depth',$('depth').value||'—'),
    reportInfoItem('Total fluid',`${fmtVol(getFluidMetrics().totalIn)} mL`),
    reportInfoItem('Record interval',`${$('recordInterval').value} min`),
    reportInfoItem('Case phase',phaseLabel()),
    reportInfoItem('Record status',state.caseLocked?'LOCKED FINAL':'Working record'),
    reportInfoItem('Protocol',state.protocolSnapshot?`${state.protocolSnapshot.name} • ${state.protocolSnapshot.version}`:`${currentSettingsObject().protocolName} • ${currentSettingsObject().protocolVersion||'unversioned'}`),
    reportInfoItem('ETT size',$('airwayEttSize')?.value?`${$('airwayEttSize').value} mm`:'—'),
    reportInfoItem('ETT depth',$('airwayEttDepth')?.value?`${$('airwayEttDepth').value} cm`:'—'),
    reportInfoItem('Intubation',$('airwayDifficulty')?.value||'—'),
    reportInfoItem('Circuit',$('airwayCircuit')?.value||'—'),
    reportInfoItem('Ventilation mode',$('airwayVentMode')?.value||'—')
  ].join('');

  const vals=key=>(state.records||[]).map(r=>r[key]).filter(v=>v!==null&&v!==''&&v!==undefined).map(Number).filter(Number.isFinite);
  const minv=(key,dec=0)=>{const v=vals(key);return v.length?(dec?Math.min(...v).toFixed(dec):Math.round(Math.min(...v))):'—'};
  const maxv=(key,dec=0)=>{const v=vals(key);return v.length?(dec?Math.max(...v).toFixed(dec):Math.round(Math.max(...v))):'—'};
  const summary=[
    ['Duration',formatShortElapsed(currentElapsed())],
    ['Records',(state.records||[]).length],
    ['Lowest MAP',minv('map')],
    ['Lowest SpO₂',minv('spo2')==='—'?'—':minv('spo2')+'%'],
    ['Highest ETCO₂',maxv('etco2')],
    ['Lowest Temp',minv('temp',1)==='—'?'—':tempTextF(Number(minv('temp',1)))]
  ];
  $('reportSummaryGrid').innerHTML=summary.map(([l,v])=>`<div class="report-summary-item"><span>${escapeHtml(l)}</span><b>${escapeHtml(v)}</b></div>`).join('');

  const recs=state.records||[];
  $('reportRecordTable').innerHTML=recs.length?`<table class="report-table">
    <thead><tr><th>#</th><th>Elapsed</th><th>HR</th><th>RR</th><th>SAP</th><th>MAP</th><th>DAP</th><th>SpO₂</th><th>ETCO₂</th><th>Temp ${tempSymbol()}</th><th>Vap%</th><th>Fluid</th><th>Note</th></tr></thead>
    <tbody>${recs.map((r,i)=>`<tr><td>${i+1}</td><td>${formatShortElapsed(r.elapsedMs)}</td><td>${r.hr??''}</td><td>${r.rr??''}</td><td>${r.sap??''}</td><td>${r.map??''}</td><td>${r.dap??''}</td><td>${r.spo2??''}</td><td>${r.etco2??''}</td><td>${r.temp==null||r.temp===''?'':tempStoredFToDisplay(r.temp)}</td><td>${r.vaporizer??''}</td><td>${r.fluidRate??''}</td><td class="note">${escapeHtml(r.note||'')}</td></tr>`).join('')}</tbody>
  </table>`:'<div>ไม่มี Record</div>';

  const charts=[
    ['Blood pressure',$('chartBP')],['Heart rate',$('chartHR')],['SpO₂',$('chartSpO2')],
    ['ETCO₂',$('chartETCO2')],['Respiratory rate',$('chartRR')],['Temperature',$('chartTemp')]
  ];
  $('reportCharts').innerHTML=charts.map(([name,svg])=>`<div class="report-chart"><h3>${escapeHtml(name)}</h3>${svg.outerHTML}</div>`).join('');

  const events=state.events||[];
  $('reportEvents').innerHTML=events.length?events.map(e=>`<div class="report-event">
    <b>${escapeHtml(formatShortElapsed(e.elapsedMs))}</b>
    <span>${escapeHtml(e.category)}</span>
    <div><b>${escapeHtml(e.name)}${e.dose?' • '+escapeHtml(e.dose):''}${e.route?' • '+escapeHtml(e.route):''}</b>${e.note?'<br><span>'+escapeHtml(e.note)+'</span>':''}</div>
  </div>`).join(''):'<div>ไม่มี Event</div>';

  const complications=state.complications||[];if($('reportComplications'))$('reportComplications').innerHTML=complications.length?complications.map(c=>`<div class="report-event"><b>${escapeHtml(formatShortElapsed(c.elapsedMs))}</b><span>${escapeHtml(c.status==='resolved'?'RESOLVED':String(c.severity||'active').toUpperCase())}</span><div><b>${escapeHtml(c.type)}</b><br><span>${escapeHtml([c.assessment&&`Assessment: ${c.assessment}`,c.intervention&&`Initial intervention: ${c.intervention}`,c.note,c.status==='resolved'&&`Outcome: ${c.resolutionNote||'—'}`].filter(Boolean).join(' • '))}</span></div></div>`).join(''):'<div style="font-size:8px">No structured complication records</div>';
  const drugAdmins=state.drugAdministrations||[];if($('reportDrugAdministrations'))$('reportDrugAdministrations').innerHTML=drugAdmins.length?`<table class="report-table"><thead><tr><th>Elapsed</th><th>Drug</th><th>Actual</th><th>Route</th><th>Preparation</th><th>By</th><th>Source / calculated</th><th>Status</th></tr></thead><tbody>${drugAdmins.map(a=>`<tr><td>${escapeHtml(formatShortElapsed(a.elapsedMs))}</td><td>${escapeHtml(a.drug)}</td><td>${escapeHtml(fmtDose(a.actual))} ${escapeHtml(a.unit||'')}</td><td>${escapeHtml(a.route||'—')}</td><td>${escapeHtml(a.concentration||'—')}</td><td>${escapeHtml(a.administeredBy||'—')}</td><td>${escapeHtml([a.source,a.calculated].filter(Boolean).join(' • ')||'—')}</td><td>${a.voidedAt?`VOID • ${escapeHtml(a.voidReason||'—')}`:'Confirmed'}</td></tr>`).join('')}</tbody></table>`:'<div style="font-size:8px">No structured medication administration records</div>';
  const corrections=state.corrections||[];
  $('reportCorrections').innerHTML=corrections.length?corrections.map(c=>{const oldV=c.field==='temp'?tempTextF(c.oldValue):c.oldValue,newV=c.field==='temp'?tempTextF(c.newValue):c.newValue;return `<div class="report-correction"><b>${escapeHtml(c.clock)}</b><span>${escapeHtml(c.field.toUpperCase())}</span><div>${escapeHtml(oldV)} → ${escapeHtml(newV)}${c.reason?' • '+escapeHtml(c.reason):''}</div></div>`}).join(''):'<div style="font-size:8px">No corrections</div>';
  const amendments=state.amendments||[];$('reportAmendments').innerHTML=amendments.length?amendments.map(a=>`<div class="report-amendment"><b>${escapeHtml(formatDate(a.epoch))} ${escapeHtml(a.clock||formatClock(a.epoch))}</b><span>${escapeHtml(a.author||'—')} • ${escapeHtml(a.reason||'—')}</span><div>${escapeHtml(a.text||'')}</div></div>`).join(''):'<div style="font-size:8px">No amendments / addenda</div>';
  const audit=state.auditTrail||[];$('reportAuditTrail').innerHTML=audit.length?audit.map(a=>`<div class="report-audit"><b>${escapeHtml(a.clock||formatClock(a.epoch))}</b><span>${escapeHtml(a.action||'')}</span><div>${escapeHtml(a.detail||'')}${a.actor?' • '+escapeHtml(a.actor):''}</div></div>`).join(''):'<div style="font-size:8px">No audit entries</div>';

  const checks=state.recoveryChecks||[];
  $('reportRecovery').innerHTML=`<div class="report-recovery-grid">
    <div><b>RR</b><br>${escapeHtml($('recRR').value||'—')}</div>
    <div><b>SpO₂</b><br>${recoveryObservationNA('spo2')?'N/A':escapeHtml($('recSpO2').value||'—')+(($('recSpO2').value)?'%':'')}</div>
    <div><b>Temp</b><br>${recoveryObservationNA('temp')?'N/A':escapeHtml($('recTemp').value||'—')+(($('recTemp').value)?tempSymbol():'')}</div>
    <div><b>Checklist</b><br>${checks.filter(Boolean).length + (state.recoveryNA||[]).filter(Boolean).length}/${checks.length}</div>
  </div>
  <div style="margin-top:6px;font-size:8px"><b>Phase:</b> ${escapeHtml(state.recoveryCompletedAt?'Complete':state.casePhase==='recovery'?'Active':'Not started')} • <b>Extubation:</b> ${recoveryObservationNA('extubation')?'N/A':escapeHtml($('recExtubation').value||'—')} • <b>O₂:</b> ${escapeHtml($('recOxygen').value||'—')} • <b>Mentation:</b> ${escapeHtml($('recMentation').value||'—')}</div>
  <div style="margin-top:8px;font-size:9px"><b>Recovery note:</b> ${escapeHtml($('recPain').value||'—')}</div><div style="margin-top:4px;font-size:8px"><b>N/A reason:</b> ${escapeHtml($('recNaReason')?.value||'—')}</div>`;
  const recoveryRows=state.recoveryRecords||[];
  $('reportRecoveryRecords').innerHTML=recoveryRows.length?`<table class="report-recovery-table"><thead><tr><th>#</th><th>Recovery</th><th>Clock</th><th>HR</th><th>RR</th><th>MAP</th><th>SpO₂</th><th>Temp</th><th>O₂</th><th>Mentation</th><th>Note</th></tr></thead><tbody>${recoveryRows.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</td><td>${escapeHtml(r.clock)}</td><td>${r.hr??'—'}</td><td>${r.rr??'—'}</td><td>${r.map??'—'}</td><td>${r.na?.spo2?'N/A':((r.spo2??'—')+(r.spo2==null?'':'%'))}</td><td>${r.na?.temp?'N/A':(r.temp==null?'—':tempTextF(r.temp))}</td><td>${escapeHtml(r.oxygen||'—')}</td><td>${escapeHtml(r.mentation||'—')}</td><td>${escapeHtml([r.note,r.naReason?`N/A: ${r.naReason}`:''].filter(Boolean).join(' • ')||'—')}</td></tr>`).join('')}</tbody></table>`:'<div style="font-size:8px;margin-top:6px">No serial recovery vital records</div>';
  if($('reportRecoveryHandoff'))$('reportRecoveryHandoff').innerHTML='<h3>Recovery Handoff Summary</h3><pre>'+escapeHtml(handoffText(WF.buildHandoff(state)))+'</pre>';
  const recoveryScores=state.recoveryScores||[];if($('reportRecoveryScores'))$('reportRecoveryScores').innerHTML=recoveryScores.length?`<div style="margin-top:6px"><b>Recovery Readiness Score history</b>${recoveryScores.map(r=>`<div class="report-event"><b>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</b><span>${r.total}/${r.possible} (${r.percent}%)</span><div>Airway ${escapeHtml(r.domains.airway)} • O₂ ${escapeHtml(r.domains.oxygenation)} • Temp ${escapeHtml(r.domains.temperature)} • Mentation ${escapeHtml(r.domains.mentation)} • Comfort ${escapeHtml(r.domains.comfort)}${r.note?' • '+escapeHtml(r.note):''}${r.naReason?' • N/A: '+escapeHtml(r.naReason):''}</div></div>`).join('')}</div>`:'<div style="font-size:8px;margin-top:6px">No Recovery Readiness Score saved</div>';
  const smart=$('smartAlerts')?.innerText?.trim()||'No smart alerts',responses=state.responses||[];$('reportResponses').innerHTML=`<div style="font-size:8px;margin-bottom:6px"><b>Smart alerts:</b> ${escapeHtml(smart)}</div>`+(responses.length?responses.map(r=>`<div class="report-event"><b>${escapeHtml(r.eventName)}</b><span>+${escapeHtml(formatShortElapsed(r.capturedElapsed-r.eventElapsed))}</span><div>MAP ${r.map??'—'} • HR ${r.hr??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp==null?'—':tempTextF(r.temp)}${r.note?' • '+escapeHtml(r.note):''}</div></div>`).join(''):'<div style="font-size:8px">No intervention-response records</div>');
  const fs=state.finalSignoff||{};$('reportSignAnesthetist').textContent=fs.anesthetist?`${fs.anesthetist.name} • signed ${formatDate(fs.anesthetist.epoch)} ${formatClock(fs.anesthetist.epoch)}`:($('anesthetist').value||'—');
  $('reportSignSurgeon').textContent=fs.surgeon?`${fs.surgeon.name} • signed ${formatDate(fs.surgeon.epoch)} ${formatClock(fs.surgeon.epoch)}`:($('surgeon').value||'—');
  $('reportCompleted').textContent=`${formatDate(Date.now())} ${formatClock()}`;
}
function exportPdfReport(){
  buildPdfReport();
  const oldTitle=document.title;
  const safeName=($('patientName').value||'Patient').replace(/[^\wก-๙-]+/g,'_');
  document.title=`ANESVET_${safeName}_${formatDate(Date.now())}`;
  document.body.classList.add('report-mode');
  setTimeout(()=>{
    window.print();
    setTimeout(()=>{
      document.body.classList.remove('report-mode');
      document.title=oldTitle;
    },500);
  },120);
}

function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function downloadBlob(content,type,name){
  const blob=new Blob([content],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
function caseBase(){
  const name=($('patientName').value||'case').replace(/[^\wก-๙-]+/g,'_');
  return `ANESVET_${name}_${formatDate(Date.now())}`;
}
function exportRecordsCsv(){
  const head=['No','Elapsed','Clock','HR','RR','SAP','MAP','DAP','SpO2','ETCO2','Temp_F_canonical','Temp_C','Vaporizer_pct','O2_Lmin','FluidRate_mLhr','FluidTotal_mL','Depth','Ventilation','Note'];
  const rows=(state.records||[]).map((r,i)=>[i+1,formatElapsed(r.elapsedMs),r.clock,r.hr,r.rr,r.sap,r.map,r.dap,r.spo2,r.etco2,r.temp,(r.temp===null||r.temp===''||r.temp===undefined?'':Number(fToC(r.temp).toFixed(1))),r.vaporizer,r.o2flow,r.fluidRate,r.fluidTotal,r.depth,r.ventilation,r.note]);
  const csv='\ufeff'+[head,...rows].map(row=>row.map(csvEscape).join(',')).join('\n');
  downloadBlob(csv,'text/csv;charset=utf-8',caseBase()+'_records.csv');
}
function exportEventsCsv(){
  const head=['No','Elapsed','Clock','Category','Name','Dose_Amount','Route','Note','DrugAdministrationId','ComplicationId'];
  const rows=(state.events||[]).map((e,i)=>[i+1,formatElapsed(e.elapsedMs),e.clock,e.category,e.name,e.dose,e.route,e.note,e.drugAdministrationId||'',e.complicationId||'']);
  const csv='\ufeff'+[head,...rows].map(row=>row.map(csvEscape).join(',')).join('\n');
  downloadBlob(csv,'text/csv;charset=utf-8',caseBase()+'_events.csv');
}
$('exportCsvBtn').addEventListener('click',exportRecordsCsv);
$('exportCsvBtn2').addEventListener('click',exportRecordsCsv);
$('exportEventsCsvBtn').addEventListener('click',exportEventsCsv);
$('exportJsonBtn').addEventListener('click',()=>{save();downloadBlob(JSON.stringify(state,null,2),'application/json',caseBase()+'.json')});
function formatBytes(n){if(!Number.isFinite(Number(n)))return '—';n=Number(n);if(n<1024)return `${n} B`;if(n<1024**2)return `${(n/1024).toFixed(1)} KB`;if(n<1024**3)return `${(n/1024**2).toFixed(1)} MB`;return `${(n/1024**3).toFixed(2)} GB`}
async function renderBackupHealth(){
  if($('dbBackendHealth'))$('dbBackendHealth').textContent=archiveBackend;
  if($('archiveCountHealth'))$('archiveCountHealth').textContent=String(getArchive().length);
  const last=getLastBackupEpoch(),age=last?Date.now()-last:null;
  if($('backupLastTime'))$('backupLastTime').textContent=last?`${formatDate(last)} ${formatClock(last)}`:'Never';
  if($('backupAgeStatus')){const days=age==null?null:Math.floor(age/86400000);$('backupAgeStatus').textContent=days==null?'Backup recommended':days>=7?`⚠ ${days} days ago`:days===0?'✓ Today':`✓ ${days} day${days===1?'':'s'} ago`;$('backupAgeStatus').className=days==null||days>=7?'health-warn':'health-good'}
  try{if(navigator.storage?.estimate){const e=await navigator.storage.estimate();if($('storageUsedHealth'))$('storageUsedHealth').textContent=formatBytes(e.usage);if($('storageQuotaHealth'))$('storageQuotaHealth').textContent=e.quota?`of ${formatBytes(e.quota)} browser quota`:'Browser estimate'}}catch(e){}
}
$('backupNowHealthBtn')?.addEventListener('click',()=>backupAllData());

async function verifyBackupPayloadIntegrity(raw){
  const cases=[...(Array.isArray(raw?.archive)?raw.archive:[]),...(raw?.current?.caseLocked?[raw.current]:[])],out={locked:0,verifiable:0,valid:0,mismatch:0,unverifiable:0,details:[]};
  for(const c of cases){if(!c?.caseLocked)continue;out.locked++;if(!c.finalChecksum){out.unverifiable++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: no checksum`);continue}const alg=String(c.checksumAlgorithm||'').toUpperCase();if(alg&&alg!=='SHA-256'&&!String(c.finalChecksum).startsWith('FNV1A-')){out.unverifiable++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: unsupported ${alg}`);continue}if(String(c.finalChecksum).startsWith('FNV1A-')){out.unverifiable++;continue}out.verifiable++;const got=await computeCaseChecksum(c);if(String(got).toUpperCase()===String(c.finalChecksum).toUpperCase())out.valid++;else{out.mismatch++;out.details.push(`${c.humanRecordId||c.caseId||'case'}: checksum mismatch`)}}
  return out;
}

async function backupAllData(){
  save();await initArchiveDb();await initPatientMaster();
  const payload={format:'ANESVET_BACKUP',version:'14.7',exportedAt:Date.now(),current:state,archive:getArchive(),patients:getPatients(),breedAliases:loadBreedAliases(),settings:(()=>{try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')}catch(e){return null}})(),drugLibrary:loadDrugLibraryData(),quickPresets:loadQuickPresets(),protocolAudit:getProtocolAudit()};
  downloadBlob(JSON.stringify(payload,null,2),'application/json',`ANESVET_BACKUP_${formatDate(Date.now())}.json`);
  const backupEpoch=Date.now();localStorage.setItem(LAST_BACKUP_KEY,String(backupEpoch));
  if($('backupStatus'))$('backupStatus').textContent=`Backup created ${formatClock(backupEpoch)} • ${payload.archive.length} cases • ${payload.patients.length} patients`;
  renderBackupHealth();toast('Full backup created');
}
$('backupAllBtn')?.addEventListener('click',backupAllData);
$('restoreBackupBtn')?.addEventListener('click',()=>$('restoreBackupInput')?.click());
$('restoreBackupInput')?.addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    const raw=JSON.parse(await file.text());
    if(raw.format!=='ANESVET_BACKUP'||!raw.current||!Array.isArray(raw.archive))throw new Error('Invalid backup');
    if($('backupStatus'))$('backupStatus').textContent='Validating backup integrity…';
    const integrity=await verifyBackupPayloadIntegrity(raw);
    const integrityText=`Locked final records: ${integrity.locked}\nChecksum verified: ${integrity.valid}/${integrity.verifiable}\nUnverifiable legacy/no checksum: ${integrity.unverifiable}\nMISMATCH: ${integrity.mismatch}`;
    if(integrity.mismatch>0){const code=prompt(`⚠ BACKUP INTEGRITY WARNING\n\n${integrityText}\n\nAt least one locked record does not match its stored checksum. Restore is NOT recommended until the file is checked.\n\nType RESTORE to continue anyway.`,'');if(code!=='RESTORE'){if($('backupStatus'))$('backupStatus').textContent='Restore cancelled — checksum mismatch detected';return}}
    else if(!confirm(`Restore ANESVET backup?\nExported: ${new Date(raw.exportedAt||Date.now()).toLocaleString()}\nCases: ${raw.archive.length}\nPatients: ${Array.isArray(raw.patients)?raw.patients.length:'derive from cases'}\n\n${integrityText}\n\nCurrent browser data will be replaced.`)){if($('backupStatus'))$('backupStatus').textContent='Restore cancelled';return}

    localStorage.setItem(CURRENT_KEY,JSON.stringify(raw.current));
    if(raw.settings)localStorage.setItem(SETTINGS_KEY,JSON.stringify(raw.settings));
    if(Array.isArray(raw.drugLibrary))localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(raw.drugLibrary));
    if(raw.quickPresets)localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(raw.quickPresets));
    if(Array.isArray(raw.protocolAudit))localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(raw.protocolAudit));
    if(Array.isArray(raw.breedAliases))localStorage.setItem(BREED_ALIAS_KEY,JSON.stringify(raw.breedAliases));
    await initArchiveDb();archiveCache=[];
    if(archiveBackend==='IndexedDB'){
      await idbClearCases();
      for(const c0 of raw.archive){const c={...c0};if(!c.caseId)c.caseId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());await idbPutCase(c);archiveCache.push(c)}
      await idbClearPatients();patientCache=[];
      if(Array.isArray(raw.patients)){for(const p0 of raw.patients){const p={...p0};if(!p.patientId)p.patientId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());await idbPutPatient(p);patientCache.push(p)}}
      await idbPutMeta('current',raw.current);
    }else{
      archiveCache=raw.archive.map(c=>({...c,caseId:c.caseId||(crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()))}));localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache));
      patientCache=Array.isArray(raw.patients)?raw.patients:[];saveFallbackPatients();
    }
    archiveCache.sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0));restartAtAppRoot();
  }catch(err){console.error(err);toast('Restore failed: invalid backup file')}
  finally{e.target.value=''}
});
$('printBtn').addEventListener('click',exportPdfReport);
$('printCaseBtn').addEventListener('click',exportPdfReport);

async function archiveSnapshot(){
  save();addAudit('CASE_ARCHIVED',state.caseLocked?'Locked final record archived':'Working copy archived');save();
  const snap=JSON.parse(JSON.stringify(state));if(!snap.humanRecordId)snap.humanRecordId=makeHumanRecordId(snap.createdAt||Date.now());if(snap.caseLocked&&!snap.finalChecksum){snap.finalChecksum=await computeCaseChecksum(snap);snap.checksumAlgorithm='SHA-256';snap.checksumCreatedAt=Date.now()}snap.archivedAt=Date.now();if(snap.caseLocked&&!snap.lockedAt)snap.lockedAt=Date.now();if(!Array.isArray(snap.amendments))snap.amendments=[];if(!Array.isArray(snap.auditTrail))snap.auditTrail=[];
  try{await initArchiveDb();if(archiveBackend==='IndexedDB')await idbPutCase(snap);archiveCache=archiveCache.filter(c=>c.caseId!==snap.caseId);archiveCache.unshift(snap);if(archiveBackend!=='IndexedDB')localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache));renderArchives();renderStorageStatus();toast('Archived current case');return true}catch(e){console.error(e);toast('Archive failed');return false}
}
function getArchive(){return archiveCache.length?archiveCache:getLegacyArchiveSeed()}

function applyCaseToDomForReport(caseObj){
  state=JSON.parse(JSON.stringify(caseObj||{}));
  if(!state.timer)state.timer={running:false,startedEpoch:null,elapsedMs:0};
  state.timer={...state.timer,running:false,startedEpoch:null};
  if(!Array.isArray(state.records))state.records=[];
  if(!Array.isArray(state.events))state.events=[];
  if(!Array.isArray(state.corrections))state.corrections=[];
  if(!Array.isArray(state.complications))state.complications=[];
  if(!Array.isArray(state.drugAdministrations))state.drugAdministrations=[];
  if(!Array.isArray(state.recoveryScores))state.recoveryScores=[];
  if(!Array.isArray(state.recoveryRecords))state.recoveryRecords=[];
  if(!Array.isArray(state.fluidRateHistory))state.fluidRateHistory=[];
  if(!Array.isArray(state.auditTrail))state.auditTrail=[];
  if(!Array.isArray(state.amendments))state.amendments=[];
  dataFields.forEach(id=>{
    const el=$(id);if(!el)return;
    const value=(id in state)?state[id]:'';
    if(el.type==='checkbox')el.checked=!!value;else el.value=value??'';
  });
  $$('.recovery-check').forEach((el,i)=>el.checked=!!(state.recoveryChecks||[])[i]);
  $$('.preop-check').forEach(el=>el.checked=!!(state.preopChecks||{})[el.dataset.key]);
  $$('.preop-na-btn').forEach(btn=>{
    const na=!!(state.preopNA||{})[btn.dataset.key];
    btn.closest('.preop-item')?.classList.toggle('na',na);
    const cb=btn.closest('.preop-item')?.querySelector('.preop-check');if(na&&cb)cb.checked=false;
  });
  syncAsaCards();
  renderAgeUI();
}
function exportArchivedPdf(i){
  const list=getArchive(),archived=list[i];if(!archived){toast('Archived case not found');return}
  save();
  const liveState=JSON.parse(JSON.stringify(state));
  const oldTitle=document.title;
  try{
    applyCaseToDomForReport(archived);
    buildPdfReport();
    const safeName=(archived.patientName||'Patient').replace(/[^\wก-๙-]+/g,'_');
    document.title=`ANESVET_${safeName}_${formatDate(archived.archivedAt||archived.createdAt||Date.now())}`;
    document.body.classList.add('report-mode');
    setTimeout(()=>window.print(),120);
  }catch(e){
    console.error(e);toast('สร้าง PDF จาก archived case ไม่สำเร็จ');
  }finally{
    setTimeout(()=>{
      document.body.classList.remove('report-mode');
      document.title=oldTitle;
      state=liveState;applyCaseToDomForReport(liveState);
      renderPatientRiskBanner();renderCasePhase();renderCaseSummary();renderRecords();renderEvents();renderComplications();renderDrugAdministrationAudit();renderTrends();renderRecovery();renderRecoveryRecords();renderRecoveryScores();renderOrLive();renderArchives();updateDue();
    },800);
  }
}

function archiveFilteredList(){
  let list=getArchive().slice(),q=$('archiveSearch')?.value.trim().toLowerCase()||'',from=$('archiveDateFrom')?.value||'',to=$('archiveDateTo')?.value||'',status=$('archiveStatusFilter')?.value||'all',sort=$('archiveSort')?.value||'newest';
  if(q)list=list.filter(c=>[c.patientName,c.hospitalId,c.visitId,c.microchip,c.humanRecordId,c.procedure,c.patientProcedure,c.surgeon,c.anesthetist].some(v=>String(v||'').toLowerCase().includes(q)));
  if(from)list=list.filter(c=>formatDate(c.archivedAt||c.createdAt||0)>=from);
  if(to)list=list.filter(c=>formatDate(c.archivedAt||c.createdAt||0)<=to);
  if(status==='locked')list=list.filter(c=>c.caseLocked&&!c.voidedAt);if(status==='voided')list=list.filter(c=>!!c.voidedAt);if(status==='working')list=list.filter(c=>!c.caseLocked);
  list.sort((a,b)=>sort==='oldest'?((a.archivedAt||a.createdAt||0)-(b.archivedAt||b.createdAt||0)):sort==='patient'?String(a.patientName||'').localeCompare(String(b.patientName||''),'th'):sort==='hn'?String(a.hospitalId||a.visitId||a.humanRecordId||'').localeCompare(String(b.hospitalId||b.visitId||b.humanRecordId||''),'th'):((b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0)));
  return list;
}
function renderArchives(){
  const source=getArchive(),list=archiveFilteredList(),el=$('archiveList');renderStorageStatus();renderBackupHealth();
  if($('archiveResultCount'))$('archiveResultCount').textContent=`${list.length} / ${source.length} cases`;
  if(!list.length){el.className='archive-list empty-state';el.textContent=source.length?'ไม่พบเคสที่ตรงกับตัวกรอง':'ยังไม่มี archived case';return}
  el.className='archive-list';
  el.innerHTML=list.map(c=>{const i=source.findIndex(x=>x.caseId===c.caseId),name=c.patientName||'Unnamed',asa=`ASA ${c.asa||'—'}${c.emergency?'-E':''}`,records=(c.records||[]).length,events=(c.events||[]).length,recoveryRecords=(c.recoveryRecords||[]).length,drugAdmins=(c.drugAdministrations||[]).filter(x=>!x.voidedAt).length,complications=(c.complications||[]).length,voided=!!c.voidedAt;
    const finalBadge=c.caseLocked?'<span class="archive-final-badge">✓ LOCKED FINAL</span>':'';const voidBadge=voided?'<span class="archive-void-badge">VOIDED</span>':'';const integrity=c.finalChecksum?`<span class="archive-integrity-badge">ID ${escapeHtml(c.humanRecordId||'—')} • ${escapeHtml(shortChecksum(c.finalChecksum))}</span>`:`<span class="archive-integrity-badge">ID ${escapeHtml(c.humanRecordId||'—')}</span>`;
    const protocol=c.protocolSnapshot?.version?`<span>Protocol ${escapeHtml(c.protocolSnapshot.version)}</span>`:'';const amendments=(c.amendments||[]).length;const loadButton=c.caseLocked?'':`<button class="btn load-archive" data-i="${i}">Load working copy</button>`;const amendButton=c.caseLocked&&!voided?`<button class="btn archive-amend" data-i="${i}">＋ Add amendment${amendments?` (${amendments})`:''}</button>`:'';const voidButton=c.caseLocked&&!voided?`<button class="btn archive-void" data-i="${i}">Void record</button>`:'';const deleteButton=!c.caseLocked?`<button class="btn danger-outline delete-archive" data-i="${i}">Delete working copy</button>`:'';
    return `<div class="archive-card ${voided?'archive-voided':''}"><div><h3>${escapeHtml(name)} ${finalBadge} ${voidBadge}</h3><div class="archive-meta"><span>${escapeHtml(formatDate(c.archivedAt||c.createdAt||Date.now()))}</span><span>${escapeHtml(c.hospitalId?`HN ${c.hospitalId}`:'No HN')}</span>${c.visitId?`<span>Visit ${escapeHtml(c.visitId)}</span>`:''}<span>${escapeHtml(asa)}</span><span>${records} anesthesia records</span><span>${recoveryRecords} recovery records</span><span>${events} events</span><span>${drugAdmins} drug administrations</span><span>${complications} complications</span>${protocol}<span>${escapeHtml(c.procedure||c.patientProcedure||'—')}</span></div><div style="margin-top:5px">${integrity}</div>${voided?`<div class="settings-note">Voided ${escapeHtml(formatDate(c.voidedAt))} • ${escapeHtml(c.voidedBy||'—')} • ${escapeHtml(c.voidReason||'—')}</div>`:''}</div><div class="archive-actions"><button class="btn archive-pdf" data-i="${i}">Export PDF</button>${c.finalChecksum?`<button class="btn verify-integrity" data-i="${i}">Verify integrity</button>`:''}${amendButton}${voidButton}${loadButton}${deleteButton}</div></div>`;
  }).join('');
  $$('.archive-pdf').forEach(b=>b.addEventListener('click',()=>exportArchivedPdf(Number(b.dataset.i))));$$('.verify-integrity').forEach(b=>b.addEventListener('click',()=>verifyArchivedIntegrity(Number(b.dataset.i),b)));$$('.archive-amend').forEach(b=>b.addEventListener('click',()=>openAmendmentDialog(Number(b.dataset.i))));$$('.archive-void').forEach(b=>b.addEventListener('click',()=>voidArchive(Number(b.dataset.i))));$$('.load-archive').forEach(b=>b.addEventListener('click',()=>loadArchive(Number(b.dataset.i))));$$('.delete-archive').forEach(b=>b.addEventListener('click',()=>deleteArchive(Number(b.dataset.i))));
}

['archiveSearch','archiveDateFrom','archiveDateTo','archiveStatusFilter','archiveSort'].forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',renderArchives)});
$('clearArchiveFiltersBtn')?.addEventListener('click',()=>{['archiveSearch','archiveDateFrom','archiveDateTo'].forEach(id=>{if($(id))$(id).value=''});if($('archiveStatusFilter'))$('archiveStatusFilter').value='all';if($('archiveSort'))$('archiveSort').value='newest';renderArchives()});
async function verifyArchivedIntegrity(i,button=null){const c=getArchive()[i];if(!c||!c.finalChecksum){toast('No final checksum available');return}const now=await computeCaseChecksum(c),ok=now===c.finalChecksum;if(button){button.textContent=ok?'✓ Integrity OK':'⚠ Integrity mismatch';button.classList.toggle('danger-outline',!ok)}toast(ok?'Record integrity verified':'⚠ Record integrity mismatch — review record')}
async function voidArchive(i){const c=getArchive()[i];if(!c||!c.caseLocked||c.voidedAt)return;const reason=prompt('Reason for VOID\nOriginal record จะยังคงอยู่ใน archive');if(!reason?.trim()){toast('Void cancelled');return}const by=prompt('Voided by', $('anesthetist')?.value.trim()||$('surgeon')?.value.trim()||'');if(!by?.trim()){toast('Void cancelled');return}const code=prompt('พิมพ์ VOID เพื่อยืนยัน');if(code!=='VOID'){toast('Void cancelled');return}c.voidedAt=Date.now();c.voidedBy=by.trim();c.voidReason=reason.trim();c.auditTrail=c.auditTrail||[];c.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),epoch:Date.now(),clock:formatClock(),elapsedMs:c.timer?.elapsedMs||0,action:'RECORD_VOIDED',detail:c.voidReason,actor:c.voidedBy});try{if(archiveBackend==='IndexedDB')await idbPutCase(c);else localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache));renderArchives();toast('Final record marked VOID — original retained')}catch(e){toast('Void failed')}}

function loadArchive(i){const c=getArchive()[i];if(!c)return;if(c.caseLocked){toast('Locked final record แก้ตรง ๆ ไม่ได้ — ใช้ Add amendment');return}if(!confirm(`Load working copy "${c.patientName||'Unnamed'}" แทน current case?`))return;state=JSON.parse(JSON.stringify(c));state.timer={running:false,startedEpoch:null,elapsedMs:state.timer?.elapsedMs||0};localStorage.setItem(CURRENT_KEY,JSON.stringify(state));queueCurrentMirror();restartAtAppRoot()}
async function deleteArchive(i){const c=getArchive()[i];if(!c)return;if(c.caseLocked){toast('Final record ลบไม่ได้ — ใช้ Void record');return}if(!confirm(`Delete working copy "${c.patientName||'Unnamed'}"?`))return;try{await initArchiveDb();if(archiveBackend==='IndexedDB')await idbDeleteCase(c.caseId);archiveCache=archiveCache.filter(x=>x.caseId!==c.caseId);if(archiveBackend!=='IndexedDB')localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache));renderArchives();toast('Working copy deleted')}catch(e){toast('Delete failed')}}
$('archiveCaseBtn').addEventListener('click',()=>archiveSnapshot());

function appRootUrl(){
  // Resolve the current GitHub Pages directory safely whether the app is
  // opened as /ANESVET/, /ANESVET/index.html, or from the installed PWA.
  const here=new URL(window.location.href);
  let path=here.pathname;
  if(!path.endsWith('/')) path=path.replace(/\/[^/]*$/,'/');
  const url=new URL(path, here.origin);
  url.searchParams.set('v','14.7');
  return url.href;
}
function restartAtAppRoot(){
  // Use replace instead of reload so GitHub Pages never tries to reload
  // an accidental nested/404 path.
  window.location.replace(appRootUrl());
}



function defaultQuickPresets(){
  return {
    induction:['builtin_diazepam','builtin_propofol'],
    pre:['builtin_cefazolin','builtin_tramadol'],
    post:['builtin_convenia','builtin_nsaid']
  };
}
function loadQuickPresets(){
  try{
    let x=JSON.parse(localStorage.getItem(QUICK_PRESET_KEY)||'null');
    if(!x){const p142=JSON.parse(localStorage.getItem('anesvet_v14_2_quick_presets')||'null');if(p142){x=p142;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(p142));}}
    if(!x){const p141=JSON.parse(localStorage.getItem('anesvet_v14_1_quick_presets')||'null');if(p141){x=p141;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(p141));}}
    if(!x){const p14=JSON.parse(localStorage.getItem('anesvet_v14_quick_presets')||'null');if(p14){x=p14;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(p14));}}
    if(!x){const p134=JSON.parse(localStorage.getItem('anesvet_v13_4_quick_presets')||'null');if(p134){x=p134;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(p134));}}
    if(!x){const p133=JSON.parse(localStorage.getItem('anesvet_v13_3_quick_presets')||'null');if(p133){x=p133;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(p133));}}
    if(!x){const p132=JSON.parse(localStorage.getItem('anesvet_v13_2_quick_presets')||'null');if(p132){x=p132;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(p132));}}
    if(!x){const prev=JSON.parse(localStorage.getItem('anesvet_v13_1_quick_presets')||'null');if(prev){x=prev;localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(prev));}}
    if(x&&Array.isArray(x.induction)&&Array.isArray(x.pre)&&Array.isArray(x.post))return x;
  }catch(e){}
  const d=defaultQuickPresets();localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(d));return d;
}
let quickPresets=loadQuickPresets();
function builtInPresetCatalog(){
  return [
    {id:'builtin_diazepam',phase:'induction',name:'Diazepam',volId:'diazepamMl'},
    {id:'builtin_propofol',phase:'induction',name:'Propofol',volId:'propofolMl'},
    {id:'builtin_cefazolin',phase:'pre',name:'Cefazolin (ABO)',volId:'cefazolinMl'},
    {id:'builtin_tramadol',phase:'pre',name:'Tramadol',volId:'tramadolMl'},
    {id:'builtin_convenia',phase:'post',name:'Convenia',volId:'conveniaMl'},
    {id:'builtin_nsaid',phase:'post',name:'NSAID',volId:null}
  ];
}
function presetCandidateById(id){
  const b=builtInPresetCatalog().find(x=>x.id===id);if(b)return {...b,type:'builtin'};
  const d=hospitalDrugLibrary.find(x=>String(x.id)===String(id));return d?{...d,type:'library'}:null;
}
function presetCalculated(candidate){
  if(!candidate)return {name:'—',ml:null};
  if(candidate.type==='builtin'){
    if(candidate.id==='builtin_nsaid'){
      const cat=$('species')?.value==='cat';
      return {name:cat?'Meloxicam':'Carprofen',ml:Number((cat?$('metacamMl'):$('rimadylMl'))?.dataset?.rawml||parseFloat((cat?$('metacamMl'):$('rimadylMl'))?.textContent)||null)};
    }
    const el=$(candidate.volId);
    const n=Number(el?.dataset?.rawml||parseFloat(el?.textContent));
    return {name:candidate.name,ml:Number.isFinite(n)?n:null};
  }
  const r=calculateLibraryDrug(candidate,getVal('weight',0)||0,candidate.dose,candidate.conc);
  return {name:candidate.name,ml:r.ml};
}
function phasePresetOptions(phase){
  const built=builtInPresetCatalog().filter(x=>x.phase===phase).map(x=>({id:x.id,name:x.name}));
  const lib=hospitalDrugLibrary.filter(x=>x.active!==false&&x.phase===phase).map(x=>({id:x.id,name:x.name}));
  return [...built,...lib];
}
function renderQuickPresetSettings(){
  quickPresets=loadQuickPresets();
  const defs=[
    ['quickPresetInd1','induction',0],['quickPresetInd2','induction',1],
    ['quickPresetPre1','pre',0],['quickPresetPre2','pre',1],
    ['quickPresetPost1','post',0],['quickPresetPost2','post',1]
  ];
  defs.forEach(([id,phase,idx])=>{
    const sel=$(id);if(!sel)return;
    const opts=phasePresetOptions(phase);
    sel.innerHTML='<option value="">— ไม่แสดง —</option>'+opts.map(o=>`<option value="${escapeHtml(o.id)}">${escapeHtml(o.name)}</option>`).join('');
    sel.value=quickPresets[phase]?.[idx]||'';
  });
}
function saveQuickPresetSettings(){
  quickPresets={
    induction:[$('quickPresetInd1')?.value||'',$('quickPresetInd2')?.value||''],
    pre:[$('quickPresetPre1')?.value||'',$('quickPresetPre2')?.value||''],
    post:[$('quickPresetPost1')?.value||'',$('quickPresetPost2')?.value||'']
  };
  localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(quickPresets));
  renderQuickPresetSummary();toast('Quick presets saved');
}
function renderQuickPresetSummary(){
  quickPresets=loadQuickPresets();
  const slots=[
    ['qpInd1Label','qpInd1Vol','induction',0],['qpInd2Label','qpInd2Vol','induction',1],
    ['qpPre1Label','qpPre1Vol','pre',0],['qpPre2Label','qpPre2Vol','pre',1],
    ['qpPost1Label','qpPost1Vol','post',0],['qpPost2Label','qpPost2Vol','post',1]
  ];
  slots.forEach(([lid,vid,phase,idx])=>{
    const c=presetCandidateById(quickPresets[phase]?.[idx]),r=presetCalculated(c);
    if($(lid))$(lid).textContent=r.name;
    if($(vid))$(vid).textContent=r.ml==null?'—':fmtVol(r.ml);
  });
}
$('saveQuickPresetsBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked — unlock in Settings ก่อนแก้ Quick Presets');return}saveQuickPresetSettings();addProtocolAudit('QUICK_PRESETS_CHANGED',JSON.stringify(loadQuickPresets()))});
$('editQuickPresetsBtn')?.addEventListener('click',()=>{setTab('settings');setTimeout(()=>$('quickPresetInd1')?.scrollIntoView({behavior:'smooth',block:'center'}),50)});

function normalizeDrugLibrary(list){return (Array.isArray(list)?list:[]).map(d=>({...d,concUnit:d.concUnit||(d.mode==='mcgkg'?'μg/mL':'mg/mL')}))}
function defaultHospitalDrugLibrary(){
  return [
    {id:'midazolam',name:'Midazolam',phase:'induction',drugClass:'Induction adjunct',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'IV',active:true},
    {id:'alfaxalone',name:'Alfaxalone',phase:'induction',drugClass:'Induction agent',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'IV',active:true},
    {id:'ketamine',name:'Ketamine',phase:'induction',drugClass:'Induction / analgesic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'IV',active:true},
    {id:'etomidate',name:'Etomidate',phase:'induction',drugClass:'Induction agent',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'IV',active:true},
    {id:'ampicillin_sulbactam',name:'Ampicillin-sulbactam',phase:'pre',drugClass:'Antibiotic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'IV',active:true},
    {id:'clindamycin',name:'Clindamycin',phase:'pre',drugClass:'Antibiotic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true},
    {id:'methadone',name:'Methadone',phase:'pre',drugClass:'Analgesic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true},
    {id:'buprenorphine',name:'Buprenorphine',phase:'pre',drugClass:'Analgesic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true},
    {id:'fentanyl',name:'Fentanyl',phase:'pre',drugClass:'Analgesic',mode:'mcgkg',concUnit:'μg/mL',dose:'',conc:'',route:'IV',active:true},
    {id:'butorphanol',name:'Butorphanol',phase:'pre',drugClass:'Analgesic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true},
    {id:'robenacoxib',name:'Robenacoxib',phase:'post',drugClass:'NSAID',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true},
    {id:'amoxicillin_clavulanate',name:'Amoxicillin-clavulanate',phase:'post',drugClass:'Antibiotic',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true}
  ];
}
function loadDrugLibraryData(){
  try{
    const own=JSON.parse(localStorage.getItem(DRUG_LIBRARY_KEY)||'null');
    if(Array.isArray(own))return normalizeDrugLibrary(own);
    const prev142=JSON.parse(localStorage.getItem('anesvet_v14_2_drug_library')||'null');if(Array.isArray(prev142)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev142));return normalizeDrugLibrary(prev142)}
    const prev141=JSON.parse(localStorage.getItem('anesvet_v14_1_drug_library')||'null');if(Array.isArray(prev141)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev141));return normalizeDrugLibrary(prev141)}
    const prev14=JSON.parse(localStorage.getItem('anesvet_v14_drug_library')||'null');if(Array.isArray(prev14)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev14));return normalizeDrugLibrary(prev14)}
    const prev134=JSON.parse(localStorage.getItem('anesvet_v13_4_drug_library')||'null');if(Array.isArray(prev134)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev134));return normalizeDrugLibrary(prev134)}
    const prev133=JSON.parse(localStorage.getItem('anesvet_v13_3_drug_library')||'null');if(Array.isArray(prev133)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev133));return normalizeDrugLibrary(prev133)}
    const prev132=JSON.parse(localStorage.getItem('anesvet_v13_2_drug_library')||'null');if(Array.isArray(prev132)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev132));return normalizeDrugLibrary(prev132)}
    const prev131=JSON.parse(localStorage.getItem('anesvet_v13_1_drug_library')||'null');if(Array.isArray(prev131)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev131));return normalizeDrugLibrary(prev131)}
    const prev13=JSON.parse(localStorage.getItem('anesvet_v13_drug_library')||'null');if(Array.isArray(prev13)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev13));return normalizeDrugLibrary(prev13)}
    const prev121=JSON.parse(localStorage.getItem('anesvet_v12_1_drug_library')||'null');if(Array.isArray(prev121)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev121));return normalizeDrugLibrary(prev121)}
    const prev12=JSON.parse(localStorage.getItem('anesvet_v12_drug_library')||'null');if(Array.isArray(prev12)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev12));return normalizeDrugLibrary(prev12)}
    const old=JSON.parse(localStorage.getItem('anesvet_v11_drug_library')||'null');
    if(Array.isArray(old)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(old));return normalizeDrugLibrary(old)}
  }catch(e){}
  const d=defaultHospitalDrugLibrary();
  localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(d));
  return normalizeDrugLibrary(d);
}
let hospitalDrugLibrary=loadDrugLibraryData();

function formulaLabel(mode,concUnit=''){
  return ({mgkg:`mg/kg ÷ ${concUnit||'concentration'}`,mcgkg:`μg/kg ÷ ${concUnit||'concentration'}`,mlkg:'mL/kg × BW',bwdiv:'BW ÷ factor',manual:'Manual'})[mode]||mode;
}
function drugPhaseLabel(phase){return ({induction:'Induction',pre:'Pre-anesthetic',post:'Post-anesthetic'})[phase]||phase}

function renderDrugLibrarySettings(){
  const box=$('drugLibraryRows');if(!box)return;
  box.innerHTML=hospitalDrugLibrary.map((d,i)=>`
    <div class="drug-library-row ${(!d.dose&&d.mode!=='manual')?'library-incomplete':''}" data-index="${i}">
      <label>Drug name<input data-field="name" type="text" value="${escapeHtml(d.name||'')}"></label>
      <label>Phase<select data-field="phase">
        <option value="induction" ${d.phase==='induction'?'selected':''}>Induction</option>
        <option value="pre" ${d.phase==='pre'?'selected':''}>Pre-anes</option>
        <option value="post" ${d.phase==='post'?'selected':''}>Post-anes</option>
      </select></label>
      <label>Class<input data-field="drugClass" type="text" value="${escapeHtml(d.drugClass||'')}"></label>
      <label>Formula<select data-field="mode">
        <option value="mgkg" ${d.mode==='mgkg'?'selected':''}>mg/kg</option>
        <option value="mcgkg" ${d.mode==='mcgkg'?'selected':''}>μg/kg</option>
        <option value="mlkg" ${d.mode==='mlkg'?'selected':''}>mL/kg</option>
        <option value="bwdiv" ${d.mode==='bwdiv'?'selected':''}>BW ÷ factor</option>
        <option value="manual" ${d.mode==='manual'?'selected':''}>Manual</option>
      </select></label>
      <label>Dose / factor<input data-field="dose" type="number" min="0" step="0.001" value="${escapeHtml(d.dose??'')}"></label>
      <label>Concentration<input data-field="conc" type="number" min="0" step="0.001" value="${escapeHtml(d.conc??'')}"></label>
      <label>Concentration unit<select data-field="concUnit"><option value="mg/mL" ${d.concUnit==='mg/mL'?'selected':''}>mg/mL</option><option value="μg/mL" ${d.concUnit==='μg/mL'?'selected':''}>μg/mL</option></select></label>
      <label>Route<input data-field="route" type="text" value="${escapeHtml(d.route||'')}"></label>
      <label class="favorite-cell">Favorite <input data-field="favorite" type="checkbox" ${d.favorite?'checked':''}></label>
      <button class="remove-drug-row" type="button" data-remove="${i}" title="Remove">×</button>
    </div>`).join('');
}
function readDrugLibrarySettings(){
  const rows=$$('.drug-library-row');
  hospitalDrugLibrary=rows.map((row,i)=>{
    const f=name=>row.querySelector(`[data-field="${name}"]`);
    return {
      id:hospitalDrugLibrary[i]?.id||(crypto.randomUUID?crypto.randomUUID():String(Date.now()+i)),
      name:f('name')?.value.trim()||`Drug ${i+1}`,
      phase:f('phase')?.value||'pre',
      drugClass:f('drugClass')?.value.trim()||'',
      mode:f('mode')?.value||'mgkg',
      dose:f('dose')?.value||'',
      conc:f('conc')?.value||'',
      concUnit:f('concUnit')?.value||((f('mode')?.value||'mgkg')==='mcgkg'?'μg/mL':'mg/mL'),
      route:f('route')?.value.trim()||'',
      active:true,
      favorite:!!f('favorite')?.checked
    };
  });
}
$('addDrugLibraryRowBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked');return}
  readDrugLibrarySettings();
  hospitalDrugLibrary.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:'New drug',phase:'pre',drugClass:'',mode:'mgkg',concUnit:'mg/mL',dose:'',conc:'',route:'',active:true,favorite:false});
  renderDrugLibrarySettings();
});
$('drugLibraryRows')?.addEventListener('click',e=>{
  const btn=e.target.closest('[data-remove]');if(!btn)return;
  readDrugLibrarySettings();hospitalDrugLibrary.splice(Number(btn.dataset.remove),1);renderDrugLibrarySettings();
});
$('saveDrugLibraryBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked — unlock before saving Drug Library');return}
  readDrugLibrarySettings();
  localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(hospitalDrugLibrary));
  renderPhaseDrugSelectors();renderFavoriteDrugButtons();renderQuickPresetSettings();renderQuickPresetSummary();addProtocolAudit('DRUG_LIBRARY_CHANGED',`${hospitalDrugLibrary.length} drugs`);renderProtocolGovernance();toast('Hospital Drug Library saved');
});
$('openDrugLibraryBtn')?.addEventListener('click',()=>{setTab('settings');setTimeout(()=>$('drugLibraryRows')?.scrollIntoView({behavior:'smooth',block:'start'}),50)});

const customPhaseConfig={
  induction:{select:'customInductionDrug',dose:'customInductionDose',conc:'customInductionConc',concUnit:'customInductionConcUnit',total:'customInductionTotal',ml:'customInductionMl',meta:'customInductionMeta'},
  pre:{select:'customPreDrug',dose:'customPreDose',conc:'customPreConc',concUnit:'customPreConcUnit',total:'customPreTotal',ml:'customPreMl',meta:'customPreMeta'},
  post:{select:'customPostDrug',dose:'customPostDose',conc:'customPostConc',concUnit:'customPostConcUnit',total:'customPostTotal',ml:'customPostMl',meta:'customPostMeta'}
};

function renderFavoriteDrugButtons(){
  const box=$('favoriteDrugButtons');if(!box)return;
  const favs=hospitalDrugLibrary.filter(d=>d.active!==false&&d.favorite);
  box.innerHTML=favs.length?favs.map(d=>`<button type="button" class="favorite-drug-btn" data-favorite-drug="${escapeHtml(d.id)}">⭐ ${escapeHtml(d.name)}</button>`).join(''):'<span class="muted small">ยังไม่มี favorite drugs</span>';
}
$('favoriteDrugButtons')?.addEventListener('click',e=>{
  const btn=e.target.closest('[data-favorite-drug]');if(!btn)return;
  const d=hospitalDrugLibrary.find(x=>String(x.id)===String(btn.dataset.favoriteDrug));if(!d)return;
  const c=customPhaseConfig[d.phase];if(!c)return;
  $(c.select).value=d.id;updateCustomDrugCalc(d.phase,true);
  $(c.select).scrollIntoView({behavior:'smooth',block:'center'});
});

function renderPhaseDrugSelectors(){
  hospitalDrugLibrary=loadDrugLibraryData();
  renderFavoriteDrugButtons();
  Object.entries(customPhaseConfig).forEach(([phase,c])=>{
    const sel=$(c.select);if(!sel)return;
    const list=hospitalDrugLibrary.filter(d=>d.active!==false&&d.phase===phase);
    sel.innerHTML='<option value="">— เลือกยาเพิ่มเติม —</option>'+list.map(d=>`<option value="${escapeHtml(d.id)}">${escapeHtml(d.name)}${d.drugClass?' • '+escapeHtml(d.drugClass):''}</option>`).join('');
    updateCustomDrugCalc(phase,true);
  });
}
function selectedLibraryDrug(phase){
  const c=customPhaseConfig[phase],id=$(c.select)?.value;
  return hospitalDrugLibrary.find(d=>String(d.id)===String(id))||null;
}
function calculateLibraryDrug(d,weight,dose,conc){
  dose=Number(dose);conc=Number(conc);
  if(!d)return {total:'—',ml:null,unit:''};
  if(d.mode!=='manual'&&!(Number(weight)>0))return {total:'Current BW required',ml:null,unit:''};
  if(d.mode==='mgkg'){
    if(!(dose>0&&conc>0))return {total:'Set dose / concentration',ml:null,unit:'mg'};
    const total=weight*dose,cu=d.concUnit||'mg/mL',den=cu==='μg/mL'?conc/1000:conc;return {total:`${fmtDose(total)} mg`,ml:den>0?total/den:null,unit:'mg'};
  }
  if(d.mode==='mcgkg'){
    if(!(dose>0&&conc>0))return {total:'Set dose / concentration',ml:null,unit:'μg'};
    const total=weight*dose,cu=d.concUnit||'μg/mL',den=cu==='mg/mL'?conc*1000:conc;return {total:`${fmtDose(total)} μg`,ml:den>0?total/den:null,unit:'μg'};
  }
  if(d.mode==='mlkg'){
    if(!(dose>0))return {total:'Set mL/kg',ml:null,unit:'mL'};
    return {total:`${fmtVol(dose)} mL/kg`,ml:weight*dose,unit:'mL'};
  }
  if(d.mode==='bwdiv'){
    if(!(dose>0))return {total:'Set divisor',ml:null,unit:'mL'};
    return {total:`BW ÷ ${fmtDose(dose)}`,ml:weight/dose,unit:'mL'};
  }
  return {total:'Manual entry',ml:null,unit:''};
}
function updateCustomDrugCalc(phase,resetFields=false){
  const c=customPhaseConfig[phase],d=selectedLibraryDrug(phase),w=currentWeightReady()?currentWeightKg():0;
  if(resetFields){
    if($(c.dose))$(c.dose).value=d?.dose??'';
    if($(c.conc))$(c.conc).value=d?.conc??'';
  }
  if(!d){
    if($(c.total))$(c.total).textContent='—';
    if($(c.ml))$(c.ml).textContent='— mL';
    if($(c.meta))$(c.meta).textContent='เลือกยาจาก Hospital Drug Library';
    if($(c.concUnit))$(c.concUnit).textContent='unit';
    return;
  }
  const r=calculateLibraryDrug(d,w,$(c.dose)?.value,$(c.conc)?.value);
  if($(c.total))$(c.total).textContent=r.total;
  if($(c.ml))$(c.ml).textContent=r.ml==null?'— mL':`${fmtVol(r.ml)} mL`;
  if($(c.meta))$(c.meta).textContent=`${d.name} • ${d.drugClass||'Unclassified'} • ${formulaLabel(d.mode,d.concUnit)}${d.route?' • '+d.route:''}`;
  if($(c.concUnit))$(c.concUnit).textContent=d.mode==='mgkg'||d.mode==='mcgkg'?`(${d.concUnit||'unit'})`:'(not used)';
}
Object.entries(customPhaseConfig).forEach(([phase,c])=>{
  $(c.select)?.addEventListener('change',()=>updateCustomDrugCalc(phase,true));
  $(c.dose)?.addEventListener('input',()=>updateCustomDrugCalc(phase,false));
  $(c.conc)?.addEventListener('input',()=>updateCustomDrugCalc(phase,false));
});
$$('.custom-drug-event-btn').forEach(btn=>btn.addEventListener('click',()=>{
  if(!requireCurrentWeight('using the Drug Calculator'))return;
  const phase=btn.dataset.phase,c=customPhaseConfig[phase],d=selectedLibraryDrug(phase);
  if(!d){toast('กรุณาเลือกยา');return}
  const r=calculateLibraryDrug(d,currentWeightReady()?currentWeightKg():0,$(c.dose)?.value,$(c.conc)?.value);
  if(r.ml==null){toast('สูตรนี้ยังคำนวณ volume ไม่ได้ — ตรวจ dose/concentration');return}
  openDrugAdministration({drug:d.name,calculated:`${r.total} • ${fmtVol(r.ml)} mL`,suggestedMl:r.ml,route:d.route||'',note:`${drugPhaseLabel(phase)} • Hospital Drug Library`,concentration:$(c.conc)?.value?`${$(c.conc).value} ${d.concUnit||((d.mode==='mcgkg')?'μg/mL':'mg/mL')}`:'',source:'Hospital Drug Library'});
}));


function defaultSettings(){return{interval:'5',temperatureUnit:'C',diazepamConc:'5',propofolConc:'10',tramadolConc:'50',rimadylConc:'50',metacamConc:'5',atropineConc:'0.6',diazepamDose:'0.25',propofolDose:'4',tramadolDose:'4',carprofenDose:'4.4',meloxicamDose:'0.3',cefazolinDivisor:'10',conveniaDivisor:'10',adrenalineDose:'0.01',atropineBradyDose:'0.02',atropineCprDose:'0.04',protocolName:'Hospital anesthesia protocol',protocolVersion:'',protocolVerifiedAt:'',protocolLocked:false,autoWakeLock:true,showSapDap:true,criticalPopupEnabled:true}}
function loadSettings(){
  let s;try{s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||JSON.parse(localStorage.getItem('anesvet_v14_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_4_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_3_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v12_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v12_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v11_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v10_settings')||'null')}catch(e){}
  s={...defaultSettings(),...(s||{})};
  const map={settingInterval:'interval',settingTemperatureUnit:'temperatureUnit',settingDiazepamConc:'diazepamConc',settingPropofolConc:'propofolConc',settingTramadolConc:'tramadolConc',settingRimadylConc:'rimadylConc',settingMetacamConc:'metacamConc',settingAtropineConc:'atropineConc',settingDiazepamDose:'diazepamDose',settingPropofolDose:'propofolDose',settingTramadolDose:'tramadolDose',settingCarprofenDose:'carprofenDose',settingMeloxicamDose:'meloxicamDose',settingCefazolinDivisor:'cefazolinDivisor',settingConveniaDivisor:'conveniaDivisor',settingAdrenalineDose:'adrenalineDose',settingAtropineBradyDose:'atropineBradyDose',settingAtropineCprDose:'atropineCprDose',settingProtocolName:'protocolName',settingProtocolVersion:'protocolVersion',settingProtocolVerifiedAt:'protocolVerifiedAt'};
  Object.entries(map).forEach(([id,key])=>{if($(id))$(id).value=s[key]??''});
  if($('settingAutoWakeLock'))$('settingAutoWakeLock').checked=s.autoWakeLock!==false;
  if($('settingShowSapDap'))$('settingShowSapDap').checked=s.showSapDap!==false;
  if($('settingCriticalPopup'))$('settingCriticalPopup').checked=s.criticalPopupEnabled!==false;
  setTemperatureDisplayUnit(s.temperatureUnit,{convertInputs:true,rerender:false});
  renderSapDapVisibility();
  renderBuiltInProtocolChips(s);
  renderProtocolGovernance();
}
function applyHospitalDefaultsToFreshCaseUi(){
  const cfg=currentSettingsObject();
  const defaults={recordInterval:cfg.interval,recRecordInterval:cfg.interval,diazepamConc:cfg.diazepamConc,propofolConc:cfg.propofolConc,tramadolConc:cfg.tramadolConc,rimadylConc:cfg.rimadylConc,metacamConc:cfg.metacamConc,atropineConc:cfg.atropineConc};
  Object.entries(defaults).forEach(([id,value])=>{
    // Existing/current cases retain their saved case-specific value. A true fresh/reset case
    // inherits only operational hospital defaults, not old patient/clinical data.
    if(!(id in state)&&$(id))$(id).value=value??'';
  });
}
$('saveSettingsBtn')?.addEventListener('click',()=>{
  const old=currentSettingsObject(),locked=!!old.protocolLocked;
  const newTempUnit=normalizeTempUnit($('settingTemperatureUnit')?.value||old.temperatureUnit);setTemperatureDisplayUnit(newTempUnit,{convertInputs:true,rerender:false});
  const s={...old,interval:$('settingInterval').value,temperatureUnit:newTempUnit,autoWakeLock:$('settingAutoWakeLock')?.checked!==false,showSapDap:$('settingShowSapDap')?.checked!==false,criticalPopupEnabled:$('settingCriticalPopup')?.checked!==false};
  if(!locked){
    Object.assign(s,{diazepamConc:$('settingDiazepamConc').value,propofolConc:$('settingPropofolConc').value,tramadolConc:$('settingTramadolConc').value,rimadylConc:$('settingRimadylConc').value,metacamConc:$('settingMetacamConc').value,atropineConc:$('settingAtropineConc').value,diazepamDose:$('settingDiazepamDose').value,propofolDose:$('settingPropofolDose').value,tramadolDose:$('settingTramadolDose').value,carprofenDose:$('settingCarprofenDose').value,meloxicamDose:$('settingMeloxicamDose').value,cefazolinDivisor:$('settingCefazolinDivisor').value,conveniaDivisor:$('settingConveniaDivisor').value,adrenalineDose:$('settingAdrenalineDose').value,atropineBradyDose:$('settingAtropineBradyDose').value,atropineCprDose:$('settingAtropineCprDose').value,protocolName:$('settingProtocolName')?.value.trim()||'Hospital anesthesia protocol',protocolVersion:$('settingProtocolVersion')?.value.trim()||'',protocolVerifiedAt:$('settingProtocolVerifiedAt')?.value||''});
  }
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  if(!state.caseStartedAt){$('recordInterval').value=s.interval;$('diazepamConc').value=s.diazepamConc;$('propofolConc').value=s.propofolConc;$('tramadolConc').value=s.tramadolConc;$('rimadylConc').value=s.rimadylConc;$('metacamConc').value=s.metacamConc;$('atropineConc').value=s.atropineConc;}renderBuiltInProtocolChips(s);
  addProtocolAudit('HOSPITAL_SETTINGS_SAVED',`Protocol ${s.protocolVersion||'unversioned'} • temp=${s.temperatureUnit} • showSapDap=${s.showSapDap!==false} • criticalPopup=${s.criticalPopupEnabled!==false} • locked=${!!s.protocolLocked}`);renderSapDapVisibility();renderRecords();renderRecoveryRecords();renderTrends();renderProcedureTimeline();renderResponses();updateDashboard();renderOrLive();renderProtocolGovernance();toast(locked?'General settings saved • protocol remains locked':'Hospital settings saved');
});
function isProtocolLocked(){return !!currentSettingsObject().protocolLocked}
function renderProtocolGovernance(){
  const s=currentSettingsObject(),panel=document.querySelector('.protocol-governance-panel');panel?.classList.toggle('locked',!!s.protocolLocked);
  if($('protocolLockStatus')){$('protocolLockStatus').textContent=s.protocolLocked?'LOCKED':'UNLOCKED';$('protocolLockStatus').className=`status-pill ${s.protocolLocked?'good':'warn'}`}
  if($('toggleProtocolLockBtn'))$('toggleProtocolLockBtn').textContent=s.protocolLocked?'🔓 Unlock protocol':'🔒 Lock protocol';
  const ids=['settingProtocolName','settingProtocolVersion','settingProtocolVerifiedAt','settingDiazepamConc','settingPropofolConc','settingTramadolConc','settingRimadylConc','settingMetacamConc','settingAtropineConc','settingDiazepamDose','settingPropofolDose','settingTramadolDose','settingCarprofenDose','settingMeloxicamDose','settingCefazolinDivisor','settingConveniaDivisor','settingAdrenalineDose','settingAtropineBradyDose','settingAtropineCprDose','quickPresetInd1','quickPresetInd2','quickPresetPre1','quickPresetPre2','quickPresetPost1','quickPresetPost2','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','atropineConc'];
  ids.forEach(id=>{const el=$(id);if(el){el.disabled=!!s.protocolLocked;el.classList.toggle('protocol-locked-input',!!s.protocolLocked)}});
  ['saveQuickPresetsBtn','addDrugLibraryRowBtn','saveDrugLibraryBtn','saveQuickConcentrationBtn'].forEach(id=>{if($(id))$(id).disabled=!!s.protocolLocked});
  $$('#drugLibraryRows input,#drugLibraryRows select,#drugLibraryRows button').forEach(el=>el.disabled=!!s.protocolLocked);
  if($('protocolGovernanceNote'))$('protocolGovernanceNote').textContent=s.protocolLocked?`🔒 Protocol ${s.protocolVersion||'unversioned'} locked • verified ${s.protocolVerifiedAt||'—'}`:'Protocol unlocked — ตรวจ version / concentration / drug formula ให้เรียบร้อยก่อน Lock';
}
$('toggleProtocolLockBtn')?.addEventListener('click',()=>{
  const s=currentSettingsObject();
  if(s.protocolLocked){
    const code=prompt('Protocol ถูกล็อก\nพิมพ์ UNLOCK เพื่ออนุญาตการแก้ Hospital Drug Settings');if(code!=='UNLOCK'){toast('Protocol remains locked');return}
    s.protocolLocked=false;localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));addProtocolAudit('PROTOCOL_UNLOCKED',`Version ${s.protocolVersion||'unversioned'}`);loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();toast('Protocol unlocked');
  }else{
    const version=$('settingProtocolVersion')?.value.trim();if(!version){toast('กรุณากำหนด Protocol version ก่อน Lock');$('settingProtocolVersion')?.focus();return}
    if(!confirm(`Lock Hospital Protocol version ${version}?`))return;
    s.protocolName=$('settingProtocolName')?.value.trim()||'Hospital anesthesia protocol';s.protocolVersion=version;s.protocolVerifiedAt=$('settingProtocolVerifiedAt')?.value||formatDate(Date.now());
    s.diazepamConc=$('settingDiazepamConc').value;s.propofolConc=$('settingPropofolConc').value;s.tramadolConc=$('settingTramadolConc').value;s.rimadylConc=$('settingRimadylConc').value;s.metacamConc=$('settingMetacamConc').value;s.atropineConc=$('settingAtropineConc').value;s.diazepamDose=$('settingDiazepamDose').value;s.propofolDose=$('settingPropofolDose').value;s.tramadolDose=$('settingTramadolDose').value;s.carprofenDose=$('settingCarprofenDose').value;s.meloxicamDose=$('settingMeloxicamDose').value;s.cefazolinDivisor=$('settingCefazolinDivisor').value;s.conveniaDivisor=$('settingConveniaDivisor').value;s.adrenalineDose=$('settingAdrenalineDose').value;s.atropineBradyDose=$('settingAtropineBradyDose').value;s.atropineCprDose=$('settingAtropineCprDose').value;s.protocolLocked=true;
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));addProtocolAudit('PROTOCOL_LOCKED',`${s.protocolName} • ${s.protocolVersion}`);loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();toast(`Protocol ${version} locked`);
  }
});
function captureProtocolSnapshot(){const s=currentSettingsObject();state.protocolSnapshot={name:s.protocolName||'Hospital anesthesia protocol',version:s.protocolVersion||'unversioned',verifiedAt:s.protocolVerifiedAt||'',locked:!!s.protocolLocked,capturedAt:Date.now(),alertProtocol:WF.normalizeAlertProtocol(s.alertProtocol),concentrations:{adrenaline:{value:$('adrenalineConc')?.value||'1',unit:'mg/mL'},diazepam:{value:s.diazepamConc,unit:'mg/mL'},propofol:{value:s.propofolConc,unit:'mg/mL'},tramadol:{value:s.tramadolConc,unit:'mg/mL'},carprofen:{value:s.rimadylConc,unit:'mg/mL'},meloxicam:{value:s.metacamConc,unit:'mg/mL'},atropine:{value:s.atropineConc,unit:'mg/mL'}},builtInProtocol:{diazepamDose:{value:s.diazepamDose,unit:'mg/kg'},propofolDose:{value:s.propofolDose,unit:'mg/kg'},tramadolDose:{value:s.tramadolDose,unit:'mg/kg'},carprofenDose:{value:s.carprofenDose,unit:'mg/kg'},meloxicamDose:{value:s.meloxicamDose,unit:'mg/kg'},cefazolinDivisor:{value:s.cefazolinDivisor,unit:'BW ÷ factor mL'},conveniaDivisor:{value:s.conveniaDivisor,unit:'BW ÷ factor mL'},adrenalineDose:{value:s.adrenalineDose,unit:'mg/kg'},atropineBradyDose:{value:s.atropineBradyDose,unit:'mg/kg'},atropineCprDose:{value:s.atropineCprDose,unit:'mg/kg'}},quickPresets:JSON.parse(JSON.stringify(loadQuickPresets())),drugLibrary:JSON.parse(JSON.stringify(loadDrugLibraryData()))}}

function freshState(){
  // Reset = a truly blank CURRENT CASE. Persistent Patient Master / Archive /
  // Hospital Settings / Drug Library / Quick Presets remain untouched.
  return {
    caseId:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    humanRecordId:makeHumanRecordId(Date.now()),
    createdAt:Date.now(),
    timer:{running:false,startedEpoch:null,elapsedMs:0},
    records:[],events:[],responses:[],corrections:[],complications:[],drugAdministrations:[],alertEpisodes:[],recoveryScores:[],recoveryRecords:[],fluidRateHistory:[],
    alertProtocolOverride:null,alertProtocolHistory:[],recoveryHandoffs:[],
    recoveryChecks:[false,false,false,false,false,false],recoveryNA:[false,false,false,false,false,false],recoveryObservationNA:{spo2:false,temp:false,extubation:false},preopChecks:{},preopNA:{},
    patientSaved:false,patientMasterId:'',
    patientName:'',hospitalId:'',visitId:'',species:'',sex:'',reproductiveStatus:'',microchip:'',breed:'',
    weight:'',age:'',birthDate:'',birthDateEstimated:false,ageSource:'',estimatedBirthPeriod:'',
    approxAgeYears:'',approxAgeMonths:'',approxAgeWeeks:'',bcs:'',asa:'',emergency:false,
    patientProcedure:'',procedure:'',patientAllergies:'',patientComorbidities:'',patientPrecautions:'',
    surgeon:'',anesthetist:'',surgicalAssistant:'',
    hr:'',rr:'',sap:'',map:'',dap:'',spo2:'',etco2:'',temp:'',vaporizer:'',o2flow:'',
    fluidRateInput:'',fluidTotal:'',depth:'',ventilation:'',
    bradyPoorPerf:false,bloodLoss:false,cardiacRisk:false,respRisk:false,recordNote:'',
    planPremed:'',planInduction:'',planMaintenance:'',planAnalgesia:'',planAntibiotic:'',planNSAID:'',planBlock:'',planNote:'',
    actualDiazepamMl:'',actualPropofolMl:'',actualTramadolMl:'',
    balanceCrystalloid:'',balanceBolus:'',balanceBloodIn:'',balanceBloodLoss:'',balanceUrine:'',fluidActualTotal:'',
    airwayEttSize:'',airwayEttDepth:'',airwayCuff:'',airwayDifficulty:'',airwayCircuit:'',airwayVentMode:'',airwayVt:'',airwayPip:'',airwayPeep:'',airwayVentRr:'',
    recHR:'',recRR:'',recMAP:'',recSpO2:'',recTemp:'',recExtubation:'',recOxygen:'',recMentation:'',recPain:'',recNaReason:'',recScoreAirway:'',recScoreOxygen:'',recScoreTemp:'',recScoreMentation:'',recScoreComfort:'',recScoreNote:'',
    caseStartedAt:null,casePhase:'setup',recoveryStartedAt:null,recoveryCompletedAt:null,emergencyReturnActive:false,
    surgeryEndedAt:null,extubatedAt:null,lastSavedAt:null,caseLocked:false,lockedAt:null,protocolSnapshot:null,
    auditTrail:[],amendments:[],finalSignoff:{anesthetist:null,surgeon:null},finalChecksum:null,checksumAlgorithm:null,checksumCreatedAt:null,
    voidedAt:null,voidedBy:'',voidReason:''
  };
}
function resetCurrent(){
  // Set this BEFORE navigation. Otherwise pagehide/visibilitychange can autosave
  // the old on-screen fields and resurrect the case we just cleared.
  resetInProgress=true;criticalAlertLatch={map:false,spo2:false};
  clearInterval(timerHandle);timerHandle=null;
  dueReminderToken=null;recoveryDueReminderToken=null;
  state=freshState();
  localStorage.setItem(CURRENT_KEY,JSON.stringify(state));
  idbPutMeta('current',state);
  localStorage.setItem(TAB_KEY,'patient');
  releaseScreenWakeLock(true);
  restartAtAppRoot();
}
function hasActiveCaseData(){return !!(state.timer.running||(state.timer.elapsedMs||0)>0||(state.records||[]).length||(state.events||[]).length||(state.complications||[]).length||(state.drugAdministrations||[]).length||(state.alertEpisodes||[]).length||(state.recoveryScores||[]).length||state.patientSaved)}
$('newCaseBtn').addEventListener('click',()=>{
  if(hasActiveCaseData()&&!confirm('Current case มีข้อมูลอยู่\n\nแนะนำ Archive หรือ Backup ก่อนเริ่มเคสใหม่\n\nต้องการเริ่ม New case ต่อหรือไม่?'))return;
  if(state.timer.running&&!confirm('Case timer กำลัง RUNNING — ยืนยันอีกครั้งว่าจะจบ current case และเริ่มใหม่?'))return;resetCurrent();
});
$('resetCurrentBtn').addEventListener('click',()=>{
  if(hasActiveCaseData()){const code=prompt('Danger zone: Reset จะล้างข้อมูล CURRENT CASE และช่องกรอกในทุกหน้าของเคส\n\nจะไม่ลบ Patient Master, Archived cases, Hospital Settings หรือ Drug Library\n\nพิมพ์ RESET เพื่อยืนยัน');if(code!=='RESET'){toast('Reset cancelled');return}}
  resetCurrent();
});
$('clearRecordsBtn').addEventListener('click',()=>{if(!confirm('ล้าง Anesthesia records ทั้งหมด? Correction history ที่ผูกกับ records จะถูกล้างด้วย'))return;state.records=[];state.corrections=[];save();renderRecords();renderCorrections();renderTrends();renderSmartAlerts();renderOrLive();updateDue()});

$('startCaseBtn').addEventListener('click',()=>{
  if(state.timer.running)return;
  if(!validateCaseReadyToStart())return;
  const preopTotal=$$('.preop-check').length,preopDone=$$('.preop-check').filter(x=>x.checked).length,preopNA=$$('.preop-item.na').length,preopReviewed=preopDone+preopNA;
  if(preopReviewed<preopTotal && !confirm(`Pre-op checklist ยังไม่ครบ (${preopDone}/${preopTotal}) — ต้องการเริ่มเคสต่อหรือไม่?`))return;
  const firstStart=(state.timer.elapsedMs||0)===0 && !state.caseStartedAt;
  state.timer.running=true;
  state.timer.startedEpoch=Date.now();
  if(firstStart){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';captureProtocolSnapshot();addAudit('CASE_STARTED','Anesthesia case timer started');}
  startTimerLoop();renderTimerState();renderCasePhase();save();
  if(autoWakeEnabled())requestScreenWakeLock(true);
  if(firstStart) addEvent({category:'Case',name:'Case started',note:'Anesthesia case timer started'});
  setTab('orlive');
  toast(firstStart?'Case timer started':'Case timer resumed');
});
$('pauseCaseBtn').addEventListener('click',()=>{pauseTimer();renderOrLive()});

dataFields.forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',updateDashboard);
});

window.addEventListener('beforeunload',e=>{if(resetInProgress)return;if(sessionMode==='active'&&state.timer.running){save();e.preventDefault();e.returnValue=''}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(!resetInProgress&&sessionMode==='active')save()}else{if(sessionMode==='active')writeSessionLock();if(sessionMode==='active'&&(state.timer.running||state.casePhase==='recovery')&&autoWakeEnabled())requestScreenWakeLock(true)}});
window.addEventListener('pagehide',e=>{if(!resetInProgress&&sessionMode==='active')save();if(!e.persisted)releaseSessionLock()});
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').hidden=false});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true});
window.addEventListener('appinstalled',()=>{$('installBtn').hidden=true});
let pendingServiceWorkerRegistration=null;let reloadingForServiceWorker=false;
function renderPwaUpdateBanner(reg){
  pendingServiceWorkerRegistration=reg||pendingServiceWorkerRegistration;const b=$('updateBanner');if(!b||!pendingServiceWorkerRegistration?.waiting)return;const active=hasActiveCaseData();b.hidden=false;
  if($('updateBannerTitle'))$('updateBannerTitle').textContent=active?'ANESVET update ready — deferred for active case':'ANESVET update ready';
  if($('updateBannerText'))$('updateBannerText').textContent=active?'เพื่อความปลอดภัย ระบบจะไม่เปลี่ยน version ระหว่าง current case. End/Archive หรือ Reset current case ก่อนอัปเดต':'เวอร์ชันใหม่ดาวน์โหลดแล้ว พร้อมติดตั้งโดย reload แอปหนึ่งครั้ง';
  if($('updateNowBtn')){$('updateNowBtn').disabled=active;$('updateNowBtn').textContent=active?'Update after case':'Update now'}
}
async function setupServiceWorkerUpdates(){
  if(!('serviceWorker'in navigator))return;try{const reg=await navigator.serviceWorker.register('./service-worker.js');pendingServiceWorkerRegistration=reg;if(reg.waiting)renderPwaUpdateBanner(reg);reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)renderPwaUpdateBanner(reg)})});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloadingForServiceWorker)return;reloadingForServiceWorker=true;window.location.reload()})}catch(e){}
}
$('updateNowBtn')?.addEventListener('click',()=>{const reg=pendingServiceWorkerRegistration;if(!reg?.waiting)return;if(hasActiveCaseData()){renderPwaUpdateBanner(reg);toast('Finish / archive current case before updating');return}reg.waiting.postMessage({type:'SKIP_WAITING'})});
$('updateLaterBtn')?.addEventListener('click',()=>{if($('updateBanner'))$('updateBanner').hidden=true});
window.addEventListener('load',setupServiceWorkerUpdates);

// V14.7 workflow integration; existing state, storage and event API retained.
const WF=globalThis.AnesvetWorkflow;
const ALERT_KEYS={map:'hypotension',spo2:'hypoxemia',etco2:'ventilation',temp:'hypothermia'};
let alertProtocolEditScope='hospital',pendingProblem=null,orQuickOptions=[],orQuickBasis=null;
const alertObservationRevision={};
function clinicalWriteAllowed(){if(sessionMode!=='active'||state.caseLocked){toast(state.caseLocked?'LOCKED FINAL — clinical changes are disabled':'VIEW ONLY — take control before editing');return false}return true}
function activeAlertProtocol(){return WF.effectiveAlertProtocol(state,currentSettingsObject().alertProtocol)}
function alertProtocolSource(){return state.alertProtocolOverride?'CASE OVERRIDE':state.protocolSnapshot?.alertProtocol?'FROZEN HOSPITAL':state.caseStartedAt?'LEGACY V14.6.4':'HOSPITAL DEFAULT'}
function thresholdSummary(key,p=activeAlertProtocol()){
  const t=p[key],val=n=>key==='temp'?`${n}°F (≈${((n-32)*5/9).toFixed(2)}°C)`:String(n),range=prefix=>[t[prefix+'Low']!==null?`<${val(t[prefix+'Low'])}`:'',t[prefix+'High']!==null?`>${val(t[prefix+'High'])}`:''].filter(Boolean).join(' / ');
  return `Warning ${range('warning')} • Critical ${range('critical')}${['map','etco2'].includes(key)?' mmHg':key==='spo2'?'%':''}`;
}
function alertThresholdHint(key,level){return level==='neutral'?'No measurement entered':`${level==='danger'?'CRITICAL':level==='warn'?'WARNING':'Within configured range'} • ${thresholdSummary(key)}`}
function renderAlertProtocolStatus(){
  const auditRows=rows=>rows.slice().reverse().map(x=>`<details><summary>${escapeHtml(formatClock(x.epoch))} • ${escapeHtml(x.actor||'')} • ${escapeHtml(x.reason||x.action)}</summary><pre>${escapeHtml(JSON.stringify({before:x.before,after:x.after},null,2))}</pre></details>`).join('')||'<p>No changes recorded</p>';
  if($('caseAlertHistory'))$('caseAlertHistory').innerHTML=auditRows(state.alertProtocolHistory||[]);
  if($('hospitalAlertHistory'))$('hospitalAlertHistory').innerHTML=auditRows(getProtocolAudit().filter(x=>x.before&&x.after));
  if($('orAlertProtocolStatus'))$('orAlertProtocolStatus').textContent=`${alertProtocolSource()} • ${state.protocolSnapshot?.version||currentSettingsObject().protocolVersion||'unversioned'}`;
  if($('hospitalAlertSummary'))$('hospitalAlertSummary').textContent=WF.metrics.map(k=>`${WF.labels[k]}: ${thresholdSummary(k,WF.normalizeAlertProtocol(currentSettingsObject().alertProtocol))}`).join('\n');
}
function openAlertProtocolEditor(scope){
  if(!clinicalWriteAllowed())return;
  if(scope==='case'&&!state.caseStartedAt){toast('Start Case to freeze the hospital protocol before applying a case override');return}
  if(scope==='hospital'&&isProtocolLocked()){toast('Unlock Hospital Protocol before editing defaults');return}
  alertProtocolEditScope=scope;const p=scope==='case'?activeAlertProtocol():WF.normalizeAlertProtocol(currentSettingsObject().alertProtocol);
  $('alertProtocolTitle').textContent=scope==='case'?'Case alert override':'Hospital alert defaults';
  $('alertProtocolContext').textContent=scope==='case'?`${state.patientName||'Patient'} • ${alertProtocolSource()} • ใช้เฉพาะเคสนี้`:'ใช้กับเคสใหม่หลัง Start Case; เคสที่เริ่มแล้วคง frozen protocol';
  $('alertThresholdFields').innerHTML=WF.metrics.map(k=>`<fieldset><legend>${WF.labels[k]} (${k==='temp'?'°F canonical':k==='spo2'?'%':'mmHg'})</legend><div class="threshold-grid">${['warningLow','criticalLow','warningHigh','criticalHigh'].map(f=>`<label>${({warningLow:'Warning below',criticalLow:'Critical below',warningHigh:'Warning above',criticalHigh:'Critical above'})[f]}<input id="alert_${k}_${f}" data-metric="${k}" data-bound="${f}" type="number" step="any" min="0" value="${p[k][f]??''}" inputmode="decimal"></label>`).join('')}</div></fieldset>`).join('');
  $('alertProtocolActor').value=$('anesthetist')?.value.trim()||'';$('alertProtocolReason').value='';$('alertProtocolError').textContent='';$('clearCaseAlertOverrideBtn').hidden=scope!=='case'||!state.alertProtocolOverride;$('alertProtocolDialog').showModal();
}
function saveAlertProtocolEdit(clear=false){
  if(!clinicalWriteAllowed())return;if(alertProtocolEditScope==='hospital'&&isProtocolLocked()){toast('Hospital protocol is locked');return}
  const actor=$('alertProtocolActor').value.trim(),reason=$('alertProtocolReason').value.trim();if(!actor||!reason){$('alertProtocolError').textContent='กรุณาระบุผู้เปลี่ยนและเหตุผล';return}
  const input={};$$('#alertThresholdFields input').forEach(el=>{input[el.dataset.metric]??={};input[el.dataset.metric][el.dataset.bound]=el.value});
  const result=WF.validateAlertProtocol(input);if(!clear&&!result.valid){$('alertProtocolError').textContent=result.errors.join(' • ');return}
  const epoch=Date.now(),scope=alertProtocolEditScope,before=scope==='case'?activeAlertProtocol():WF.normalizeAlertProtocol(currentSettingsObject().alertProtocol),after=clear?WF.effectiveAlertProtocol({...state,alertProtocolOverride:null}):result.protocol;
  const audit={id:crypto.randomUUID(),epoch,clock:formatClock(epoch),detail:JSON.stringify({reason,before,after}),action:scope==='case'?(clear?'CASE_ALERT_OVERRIDE_CLEARED':'CASE_ALERT_OVERRIDE_CHANGED'):'HOSPITAL_ALERT_PROTOCOL_CHANGED',actor,reason,before:WF.clone(before),after:WF.clone(after)};
  if(scope==='case'){
    state.alertProtocolOverride=clear?null:{protocol:after,reason,actor,changedAt:epoch};state.alertProtocolHistory??=[];state.alertProtocolHistory.push(audit);addAudit(audit.action,audit.detail,actor);
    for(const ep of state.alertEpisodes||[])if(!ep.resolvedAt)finishAlertEpisode(ep,'Protocol changed — reassess using revised thresholds',actor,'protocol-change');
  }else{
    const oldSettings=localStorage.getItem(SETTINGS_KEY),oldAudit=localStorage.getItem(PROTOCOL_AUDIT_KEY),cfg=currentSettingsObject(),trail=getProtocolAudit();cfg.alertProtocol=after;trail.push(audit);
    try{localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(trail));localStorage.setItem(SETTINGS_KEY,JSON.stringify(cfg))}catch(e){try{oldAudit===null?localStorage.removeItem(PROTOCOL_AUDIT_KEY):localStorage.setItem(PROTOCOL_AUDIT_KEY,oldAudit);oldSettings===null?localStorage.removeItem(SETTINGS_KEY):localStorage.setItem(SETTINGS_KEY,oldSettings)}catch{};$('alertProtocolError').textContent='Save failed — check available browser storage';return}
  }
  $('alertProtocolDialog').close();renderAlertProtocolStatus();updateDashboard();save();toast(scope==='case'?'Case alert protocol saved with audit':'Hospital defaults saved for new cases');
}
function alertMetricForEpisode(ep){return ep.metric||Object.keys(ALERT_KEYS).find(k=>ALERT_KEYS[k]===ep.key)}
function liveAlertValues(){return {map:getVal('map'),spo2:getVal('spo2'),etco2:getVal('etco2'),temp:tempInputStoredF('temp')}}
function newAlertEpisode(metric,value,level){
  const epoch=Date.now(),ep={id:crypto.randomUUID(),key:ALERT_KEYS[metric],metric,label:`${WF.labels[metric]} alert`,epoch,startedAt:epoch,clock:formatClock(epoch),elapsedMs:currentElapsed(),trigger:`${WF.labels[metric]} ${metric==='temp'?tempTextF(value):value} • ${thresholdSummary(metric)}`,value,latestValue:value,level,peakLevel:level,thresholds:WF.clone(activeAlertProtocol()[metric]),protocolSource:alertProtocolSource(),acknowledgedAt:null,acknowledgedBy:'',resolvedAt:null,interventions:[],levelHistory:[{epoch,level,value}],casePhase:state.casePhase};
  state.alertEpisodes??=[];state.alertEpisodes.push(ep);addAudit('CLINICAL_ALERT_STARTED',`${ep.label} • ${level} • ${ep.trigger}`);return ep;
}
function finishAlertEpisode(ep,note,actor,method='measurement'){
  if(!ep||ep.resolvedAt)return;ep.resolvedAt=Date.now();ep.resolvedClock=formatClock(ep.resolvedAt);ep.resolvedElapsedMs=currentElapsed();ep.resolutionNote=note;ep.resolvedBy=actor;ep.resolutionMethod=method;addAudit('CLINICAL_ALERT_RESOLVED',`${ep.label} • ${method} • ${note}`,actor);renderProcedureTimeline();
}
function syncAlertEpisodes(values=liveAlertValues(),{force=false,context='anesthesia'}={}){
  if(sessionMode!=='active'||state.caseLocked||!state.caseStartedAt||state.casePhase==='complete')return;if(context==='anesthesia'&&state.casePhase==='recovery')return;
  const p=activeAlertProtocol(),focus=document.activeElement?.id||'';
  for(const metric of WF.metrics){
    if(!force&&[metric,'or'+({map:'Map',spo2:'Spo2',etco2:'Etco2',temp:'Temp'})[metric]].includes(focus))continue;
    const value=WF.numeric(values[metric]),level=WF.classifyAlert(metric,value,p);let ep=(state.alertEpisodes||[]).slice().reverse().find(a=>a.key===ALERT_KEYS[metric]&&!a.resolvedAt);
    if(level==='neutral')continue;
    if(level==='good'){if(ep)finishAlertEpisode(ep,`Measured ${WF.labels[metric]} ${metric==='temp'?tempTextF(value):value} within configured range`,$('anesthetist')?.value.trim()||'Unspecified');continue}
    if(!ep){const last=(state.alertEpisodes||[]).slice().reverse().find(a=>a.key===ALERT_KEYS[metric]);if(last?.resolutionMethod==='manual'&&last.latestValue===value&&last.observationRevision===(alertObservationRevision[metric]||0))continue;ep=newAlertEpisode(metric,value,level)}else{
      const previous=ep.level||'danger';ep.latestValue=value;ep.metric=metric;if(previous!==level){ep.levelHistory??=[];ep.levelHistory.push({epoch:Date.now(),level,value});ep.level=level;if(level==='danger'){ep.peakLevel='danger';ep.acknowledgedAt=null;ep.acknowledgedBy='';ep.popupShownAt=null;addAudit('CLINICAL_ALERT_ESCALATED',`${ep.label} • ${value}`)}}
    }
    ep.observationRevision=alertObservationRevision[metric]||0;ep.lastObservedAt=Date.now();ep.observationContext=context;
  }renderActiveProblems();
}
function renderActiveProblems(){
  const alerts=(state.alertEpisodes||[]).filter(a=>!a.resolvedAt).sort((a,b)=>(a.level==='warn'?1:0)-(b.level==='warn'?1:0)),problems=(state.complications||[]).filter(c=>c.status!=='resolved');
  const rows=alerts.map(a=>({id:a.id,kind:'alert',title:a.label||a.key,level:a.level||'danger',started:a.clock,ack:a.acknowledgedAt,note:`${a.trigger||''} • Latest: ${alertMetricForEpisode(a)==='temp'?tempTextF(a.latestValue??a.value):(a.latestValue??a.value??'not recorded')}`,latest:(a.interventions||[]).at(-1)?.note})).concat(problems.map(c=>({id:c.id,kind:'problem',title:c.type,level:c.severity==='emergency'?'danger':'warn',started:c.clock,ack:c.acknowledgedAt,note:c.assessment||c.note,latest:(c.responses||[]).at(-1)?.note||c.intervention})));
  for(const id of ['orProblemPanel','recoveryProblemPanel']){const box=$(id);if(!box)continue;box.innerHTML=rows.length?rows.map(r=>`<article class="active-problem ${r.level}" data-problem-id="${escapeHtml(r.id)}"><div><b>${escapeHtml(r.title)}</b> <span>${r.kind==='alert'?(r.level==='danger'?'CRITICAL':'WARNING'):'PROBLEM'} • ${escapeHtml(r.started||'')}</span></div><p>${escapeHtml(r.note||'')}</p>${r.latest?`<p>Latest intervention: ${escapeHtml(r.latest)}</p>`:''}<div class="problem-actions"><button class="btn" data-problem-action="ack" data-kind="${r.kind}" data-id="${escapeHtml(r.id)}" ${r.ack?'disabled':''}>${r.ack?'✓ Acknowledged':'Acknowledge'}</button><button class="btn" data-problem-action="intervention" data-kind="${r.kind}" data-id="${escapeHtml(r.id)}">Intervention</button><button class="btn" data-problem-action="resolve" data-kind="${r.kind}" data-id="${escapeHtml(r.id)}">Resolve / outcome</button></div></article>`).join(''):'<p class="empty-state compact">No unresolved alerts / problems</p>'}
  if($('orProblemCount'))$('orProblemCount').textContent=`${rows.length} OPEN`;
}
function openProblemAction(kind,id,action){
  if(!clinicalWriteAllowed())return;const item=(kind==='alert'?state.alertEpisodes:state.complications)?.find(x=>x.id===id);if(!item||item.resolvedAt||item.status==='resolved')return;
  pendingProblem={kind,id,action};$('problemActionTitle').textContent=`${action==='ack'?'Acknowledge':action==='resolve'?'Resolve / outcome':'Intervention'} • ${item.label||item.type||item.key}`;$('problemActionActor').value=$('anesthetist')?.value.trim()||'';$('problemActionNote').value='';$('problemActionError').textContent='';$('problemActionDialog').showModal();
}
function saveProblemAction(){
  if(!clinicalWriteAllowed()||!pendingProblem)return;const {kind,id,action}=pendingProblem,actor=$('problemActionActor').value.trim(),note=$('problemActionNote').value.trim();
  if(!actor||(action!=='ack'&&!note)){$('problemActionError').textContent='ระบุผู้บันทึก และเหตุผล/ผลลัพธ์สำหรับ intervention หรือ resolve';return}
  const item=(kind==='alert'?state.alertEpisodes:state.complications)?.find(x=>x.id===id);if(!item||item.resolvedAt||item.status==='resolved'){toast('Item already resolved');$('problemActionDialog').close();return}
  if(action==='ack'){if(kind==='alert')acknowledgeAlertEpisode(id,actor);else{item.acknowledgedAt=Date.now();item.acknowledgedBy=actor;addAudit('COMPLICATION_ACKNOWLEDGED',item.type,actor)}}else if(kind==='alert'&&action==='resolve'){
    const level=WF.classifyAlert(alertMetricForEpisode(item),item.latestValue??item.value,activeAlertProtocol());if(['danger','warn'].includes(level)&&!confirm('ค่าล่าสุดยังเกิน threshold — ยืนยันการปิด episode พร้อมเหตุผล/ผลลัพธ์? ระบบจะตรวจใหม่เมื่อกรอกหรือ Record ค่าครั้งถัดไป'))return;finishAlertEpisode(item,note,actor,'manual');
  }else{
    const response={id:crypto.randomUUID(),epoch:Date.now(),clock:formatClock(),elapsedMs:currentElapsed(),actor,note,snapshot:state.casePhase==='recovery'?{map:getVal('recMAP'),spo2:getVal('recSpO2'),temp:tempInputStoredF('recTemp')}:currentSnapshot('')},field=kind==='alert'?'interventions':'responses';item[field]??=[];item[field].push(response);
    if(kind==='problem'&&action==='resolve'){item.status='resolved';item.resolvedAt=response.epoch;item.resolvedElapsedMs=response.elapsedMs;item.resolvedClock=response.clock;item.resolutionNote=note;item.resolvedBy=actor}
    addAudit(kind==='alert'?'CLINICAL_ALERT_INTERVENTION':action==='resolve'?'COMPLICATION_RESOLVED':'COMPLICATION_RESPONSE',`${item.label||item.type} • ${note}`,actor);
  }
  $('problemActionDialog').close();pendingProblem=null;save();renderActiveProblems();renderComplications();renderProcedureTimeline();renderRecoveryHandoff();
}
function frozenQuickDrugs(){
  const snap=state.protocolSnapshot;if(!snap)return [];
  const defs=[['diazepam','Diazepam','diazepamDose','IV'],['propofol','Propofol','propofolDose','IV'],['tramadol','Tramadol','tramadolDose',''],['carprofen','Carprofen','carprofenDose',''],['meloxicam','Meloxicam','meloxicamDose',''],['adrenaline','Adrenaline CPR','adrenalineDose','IV/IO'],['atropine','Atropine — bradycardia','atropineBradyDose','IV'],['atropine','Atropine — CPR','atropineCprDose','IV']];
  const list=defs.filter(([k])=>k!=='carprofen'||state.species==='dog').filter(([k])=>k!=='meloxicam'||state.species==='cat').map(([k,name,doseKey,route])=>({id:doseKey,name,mode:'mgkg',dose:snap.builtInProtocol?.[doseKey]?.value??snap.builtInProtocol?.[doseKey],conc:snap.concentrations?.[k]?.value,concUnit:snap.concentrations?.[k]?.unit||'mg/mL',route}));
  for(const [name,key]of [['Cefazolin','cefazolinDivisor'],['Convenia','conveniaDivisor']])list.push({id:key,name,mode:'bwdiv',dose:snap.builtInProtocol?.[key]?.value??snap.builtInProtocol?.[key],conc:'',concUnit:'',route:'',note:'Legacy volume preset: verify the preparation / concentration before recording'});
  return list.concat((snap.drugLibrary||[]).filter(d=>d.mode!=='manual').map(d=>({...d,id:'library:'+d.id})));
}
function openOrQuickDrug(){
  if(!clinicalWriteAllowed()||!requireCurrentWeight('using OR Quick Drug'))return;if(orLiveLockedByRecovery()){toast('OR Quick Drug is available in OR LIVE / Emergency return');return}if(!state.caseStartedAt||!state.protocolSnapshot){toast('Start Case to freeze the protocol before using OR Quick Drug');return}
  orQuickOptions=frozenQuickDrugs();$('orQuickDrugSelect').innerHTML=orQuickOptions.map((d,i)=>`<option value="${i}">${escapeHtml(d.name)}</option>`).join('');$('orQuickDrugBy').value=$('anesthetist')?.value.trim()||'';$('orQuickDrugNote').value='';renderOrQuickDrug();$('orQuickDrugDialog').showModal();
}
function renderOrQuickDrug(){
  const d=orQuickOptions[Number($('orQuickDrugSelect').value)],w=currentWeightReady()?currentWeightKg():null;if(!d)return;const r=calculateLibraryDrug(d,w,d.dose,d.conc),valid=w!==null&&Number.isFinite(r.ml)&&r.ml>0;
  orQuickBasis={caseId:state.caseId,weightKg:w,protocolCapturedAt:state.protocolSnapshot?.capturedAt,protocolVersion:state.protocolSnapshot?.version,drug:WF.clone(d),calculatedMl:valid?r.ml:null};
  $('orQuickDrugBasis').textContent=`Current BW ${w??'—'} kg • Frozen protocol ${state.protocolSnapshot?.version||'unversioned'} • ${state.protocolSnapshot?.capturedAt?new Date(state.protocolSnapshot.capturedAt).toLocaleString():'legacy snapshot'}`;
  $('orQuickDrugCalculation').textContent=valid?`${r.total} • ${fmtDose(r.ml)} mL${d.note?' • '+d.note:''}`:'ไม่พบ dose/concentration ที่ใช้คำนวณได้ใน frozen protocol';$('orQuickDrugActual').value='';$('orQuickDrugRoute').value=d.route||'';$('orQuickDrugConcentration').value=d.conc?`${d.conc} ${d.concUnit}`:'';$('orQuickDrugConcentration').readOnly=!!d.conc;$('orQuickDrugError').textContent='';$('orQuickDrugSaveBtn').disabled=!valid;
}
function saveOrQuickDrug(){
  if(!clinicalWriteAllowed()||!requireCurrentWeight('recording OR Quick Drug')||!orQuickBasis)return;if(orLiveLockedByRecovery()){toast('OR LIVE is closed during recovery');return}const b=orQuickBasis;
  if(b.caseId!==state.caseId||b.weightKg!==currentWeightKg()||b.protocolCapturedAt!==state.protocolSnapshot?.capturedAt){renderOrQuickDrug();$('orQuickDrugError').textContent='BW/protocol changed — calculation refreshed; review actual amount again';return}
  const actual=WF.numeric($('orQuickDrugActual').value),route=$('orQuickDrugRoute').value.trim(),by=$('orQuickDrugBy').value.trim(),concentration=$('orQuickDrugConcentration').value.trim(),note=$('orQuickDrugNote').value.trim();if(!(actual>0)||!route||!by||!concentration){$('orQuickDrugError').textContent='กรอก actual mL (>0), route, ผู้ให้ยา และ concentration';return}if(!Number.isFinite(b.calculatedMl)||b.calculatedMl<=0)return;
  if(!confirm(`Confirm actual administration\n${b.drug.name}: ${actual} mL • ${route}\n${concentration} • By ${by}\nCalculated amount is a reference, not an administration record.`))return;
  const entry=recordDrugAdministration({drug:b.drug.name,calculated:`${fmtDose(b.calculatedMl)} mL • BW ${b.weightKg} kg • frozen ${b.protocolVersion||'unversioned'}`,actual,unit:'mL',route,administeredBy:by,concentration,note,source:'OR Quick Drug',calculationBasis:WF.clone(b)});if(entry){$('orQuickDrugDialog').close();orQuickBasis=null;toast('Actual administration saved • OR LIVE')}
}
function captureRecoveryHandoff(reason){if(sessionMode!=='active'||state.caseLocked)return;save();const h=WF.buildHandoff(state);h.reason=reason;state.recoveryHandoffs??=[];state.recoveryHandoffs.push(h);addAudit('RECOVERY_HANDOFF_CREATED',`${reason} • ${h.administrations.length} administered drugs • ${h.alerts.length+h.complications.length} unresolved items`);save();renderRecoveryHandoff()}
function handoffText(h){
  const v=x=>x===null||x===undefined||x===''?'ไม่ได้บันทึก':x,clock=x=>x?`${formatDate(x)} ${formatClock(x)}`:'ไม่ได้บันทึก';
  const vital=r=>r?`${clock(r.epoch)} • HR ${v(r.hr)} • RR ${v(r.rr)} • MAP ${v(r.map)} • SpO₂ ${v(r.spo2)} • ETCO₂ ${v(r.etco2)} • Temp ${r.temp==null?'ไม่ได้บันทึก':tempTextF(r.temp)}`:'ยังไม่มีค่าที่กด Record';
  const fluids=Object.entries(h.fluids).filter(([,n])=>n!==null).map(([k,n])=>`${({actualTotal:'Actual total',crystalloid:'Crystalloid',bolus:'Bolus',blood:'Blood in',bloodLoss:'Blood loss',urine:'Urine',rate:'Current rate'})[k]} ${n} ${k==='rate'?'mL/hr':'mL'}`);
  return [
    `${h.patientName||'Unnamed'} • HN ${v(h.hospitalId)} • Visit ${v(h.visitId)} • ${v(h.species)} • BW ${v(h.weight)} kg • ASA ${v(h.asa)}`,
    `Procedure: ${v(h.procedure)} • Anesthetist: ${v(h.anesthetist)}`,
    `Allergies: ${v(h.allergies)}\nComorbidities: ${v(h.comorbidities)}\nPrecautions: ${v(h.precautions)}`,
    `Start: ${clock(h.caseStartedAt)} • Surgery end: ${clock(h.surgeryEndedAt)}\nExtubation: ${clock(h.extubatedAt)} • Recovery: ${clock(h.recoveryStartedAt)}`,
    `Airway: ETT ${v(h.airway.ett)} mm • depth ${v(h.airway.depth)} cm • difficulty ${v(h.airway.difficulty)} • cuff ${v(h.airway.cuff)} • circuit ${v(h.airway.circuit)} • ventilation ${v(h.airway.ventilation)}`,
    `Last recorded anesthesia vitals: ${vital(h.latestAnesthesia)}\nLast recorded recovery vitals: ${vital(h.latestRecovery)}`,
    `Recorded extrema: ${WF.metrics.map(k=>`${WF.labels[k]} ${h.extrema[k]?(k==='temp'?tempTextF(h.extrema[k].min)+' – '+tempTextF(h.extrema[k].max):h.extrema[k].min+' – '+h.extrema[k].max):'ไม่ได้บันทึก'}`).join(' • ')}`,
    `Documented fluids: ${fluids.join(' • ')||'ไม่ได้บันทึก'} (individual entries; do not add Actual total twice)`,
    `Actual medications (${h.administrations.length}; excludes VOID):\n${h.administrations.map(d=>`${d.clock||clock(d.epoch)} • ${d.drug}: ${d.actual} ${d.unit} • ${d.route} • ${d.concentration||'preparation not recorded'} • ${d.administeredBy||'by not recorded'}${d.note?' • '+d.note:''}`).join('\n')||'ไม่มีบันทึกการให้ยา'}`,
    `Unresolved alerts / problems:\n${[...h.alerts.map(a=>`${a.label||a.key} • ${a.level||'critical'} • ${a.acknowledgedAt?'acknowledged':'unacknowledged'} • ${a.trigger||''}${a.interventions?.length?' • latest intervention: '+a.interventions.at(-1).note:''}`),...h.complications.map(c=>`${c.type} • ${c.assessment||''} • ${c.responses?.at(-1)?.note||c.intervention||'no intervention recorded'}`)].join('\n')||'ไม่มีรายการค้าง'}`,
    `Recovery O₂: ${v(h.oxygen)} • Mentation: ${v(h.mentation)} • Pain: ${v(h.pain)}\nAnalgesia plan: ${v(h.plan)} • Emergency returns: ${h.emergencyReturns}`,
    `Frozen protocol: ${h.protocol.name||'legacy'} • ${h.protocol.version||'unversioned'}\n${h.protocol.override?'Case override: '+h.protocol.override.reason+' • '+h.protocol.override.actor:'No case alert override'}`
  ].join('\n\n');
}
function renderRecoveryHandoff(){if($('recoveryHandoffText'))$('recoveryHandoffText').textContent=handoffText(WF.buildHandoff(state));const arr=state.recoveryHandoffs||[];if($('recoveryHandoffHistory'))$('recoveryHandoffHistory').innerHTML=arr.length?arr.map((h,i)=>`<details><summary>Handoff ${i+1} • ${escapeHtml(formatClock(h.generatedAt))} • ${escapeHtml(h.reason)}</summary><pre>${escapeHtml(handoffText(h))}</pre></details>`).join(''):'<p>Snapshot จะถูกสร้างอัตโนมัติเมื่อเริ่ม Recovery</p>'}
document.addEventListener('input',e=>{const key=OR_SYNC[e.target.id]||e.target.id;if(WF.metrics.includes(key))alertObservationRevision[key]=(alertObservationRevision[key]||0)+1},true);
$('editHospitalAlertBtn')?.addEventListener('click',()=>openAlertProtocolEditor('hospital'));
$('editCaseAlertBtn')?.addEventListener('click',()=>openAlertProtocolEditor('case'));
$('saveAlertProtocolBtn')?.addEventListener('click',()=>saveAlertProtocolEdit());
$('clearCaseAlertOverrideBtn')?.addEventListener('click',()=>saveAlertProtocolEdit(true));
$('saveProblemActionBtn')?.addEventListener('click',saveProblemAction);
$('orQuickDrugSelect')?.addEventListener('change',renderOrQuickDrug);
$('orQuickDrugSaveBtn')?.addEventListener('click',saveOrQuickDrug);
$$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.closeDialog)?.close()));
for(const id of ['orProblemPanel','recoveryProblemPanel'])$(id)?.addEventListener('click',e=>{const b=e.target.closest('[data-problem-action]');if(b)openProblemAction(b.dataset.kind,b.dataset.id,b.dataset.problemAction)});
for(const id of ['map','spo2','etco2','temp','orMap','orSpo2','orEtco2','orTemp'])$(id)?.addEventListener('blur',()=>setTimeout(()=>{maybeShowCriticalClinicalAlert();save()},0));
$('orStickyRecordBtn')?.addEventListener('click',()=>$('orRecordNowBtn')?.click());

initSessionCoordination();
load();
for(const key of WF.metrics)alertObservationRevision[key]=Math.max(0,...(state.alertEpisodes||[]).filter(a=>alertMetricForEpisode(a)===key).map(a=>a.observationRevision||0));
const restoredFromMirror=await reconcileCurrentFromMirror();if(restoredFromMirror){restartAtAppRoot();return}
migrateLegacyAgeUi();
archiveCache=getLegacyArchiveSeed();
syncPatientProcedureToCase();
breedAliases=loadBreedAliases();renderBreedAliasSettings();
loadSettings();applyHospitalDefaultsToFreshCaseUi();hospitalDrugLibrary=loadDrugLibraryData();renderDrugLibrarySettings();renderPhaseDrugSelectors();setTimeout(renderProtocolGovernance,0);
syncAsaCards();updatePatientSaveStatus();
let storedTab=localStorage.getItem(TAB_KEY)||'casesummary';
// dashboard remains a supported legacy route under Advanced.
const initialTab=state.patientSaved?(state.casePhase==='complete'?'endcase':state.casePhase==='recovery'?'recovery':((state.timer.running||(state.timer.elapsedMs||0)>0)?'orlive':storedTab)):'patient';
setTab(initialTab);
if(sessionMode==='active')writeSessionLock();renderPatientRiskBanner();renderSessionMode();renderAirwayPanel();renderFavoriteDrugButtons();renderQuickPresetSettings();renderQuickPresetSummary();renderOrFluidPanel();renderCaseSummary();renderCasePhase();renderOrPhaseTracker();renderRecoveryRecords();renderWorkflowLocks();renderAlertFeedbackState();renderProtocolGovernance();renderStorageStatus();renderFinalSignoff();renderBackupHealth();renderLinkedPatient();renderPatientMaster();
updateDashboard();renderPreop();renderRecords();renderCorrections();renderEvents();renderComplications();renderDrugAdministrationAudit();renderTrends();renderProcedureTimeline();renderRecovery();renderRecoveryState();renderRecoveryScores();renderArchives();updateDue();renderTimerState();updateDoseSpotlights();renderEndCase();renderOrLive();renderSaveState();
if(state.timer.running && state.timer.startedEpoch && sessionMode==='active') startTimerLoop();
})();
