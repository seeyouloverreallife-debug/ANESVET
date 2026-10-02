(async() => {
'use strict';
const BOOT=window.ANESVET_BOOT_DIAGNOSTIC||null;
BOOT?.mark?.('app-enter');

const APP_SHELL=window.ANESVET_APP_SHELL;
if(!APP_SHELL)throw new Error('ANESVET app-shell.js failed to load');
const {$,$$,escapeHtml,clamp,pad,formatClock,formatDate,formatElapsed,formatShortElapsed}=APP_SHELL;
const toast=APP_SHELL.createToast('toast');
const CURRENT_KEY = 'anesvet_v14_3_current';
const ARCHIVE_KEY = 'anesvet_v14_3_archive_legacy';
const TAB_KEY = 'anesvet_v14_3_tab';
const SETTINGS_KEY='anesvet_v14_3_settings';
const DRUG_LIBRARY_KEY='anesvet_v14_3_drug_library';
const QUICK_PRESET_KEY='anesvet_v14_3_quick_presets';
const ALERT_PREF_KEY='anesvet_due_alert_feedback';
const PROTOCOL_AUDIT_KEY='anesvet_v14_3_protocol_audit';
const PROTOCOL_GOVERNANCE_KEY='anesvet_v16_20_protocol_registry';
const LAST_BACKUP_KEY='anesvet_v14_3_last_backup';
const BACKUP_RECEIPT_KEY='anesvet_v16_7_last_backup_receipt';
const LAST_RESTORE_KEY='anesvet_v16_7_last_restore_receipt';
// R19: a Restore journal is a fail-closed sentinel across interrupted app restarts.
const RESTORE_JOURNAL_KEY='anesvet_restore_journal_r19';
function restoreJournalNeedsReview(){
  if(window.ANESVET_RESTORE_RECOVERY_BLOCKED===true)return true;
  try{
    const raw=localStorage.getItem(RESTORE_JOURNAL_KEY);
    if(!raw)return false;
    const record=JSON.parse(raw);
    return !['completed','rolled-back','reviewed'].includes(record?.state);
  }catch(_){return true}
}

const BREED_ALIAS_KEY='anesvet_v14_3_breed_aliases';
const PATIENT_FALLBACK_KEY='anesvet_v14_3_patients_fallback';
const SESSION_LOCK_KEY='anesvet_v14_3_active_session';
const SESSION_TAB_KEY='anesvet_session_tab_id';
const SESSION_TTL_MS=30000;
const SESSION_HEARTBEAT_MS=5000;
const DB_NAME='ANESVET_DB';
const DB_VERSION=2;
const APP_VERSION='17.5.4';
const SECURITY=window.ANESVET_SECURITY_BASELINE||null;
const SYNC_FOUNDATION=window.ANESVET_SYNC_FOUNDATION||null;
const DOSE_REF=window.ANESVET_DOSE_REFERENCE||null;
const PROTOCOL_REVIEW=window.ANESVET_PROTOCOL_REVIEW||null;
const PROTOCOL_GOVERNANCE=window.ANESVET_HOSPITAL_PROTOCOL_GOVERNANCE||null;
const AUTOSAVE_DELAY_MS=450;
const ACTIVE_CHECKPOINT_MS=15000;
const SAFETY_CHECKPOINT_KEY='anesvet_v15_active_safety_checkpoint';
const SAFETY_CHECKPOINT_FORMAT='ANESVET_ACTIVE_SAFETY_CHECKPOINT_V1';
const PILOT_FEEDBACK_KEY='anesvet_v15_pilot_feedback_queue';
const PILOT_FEEDBACK_FORMAT='ANESVET_PILOT_FEEDBACK_V1';
const PILOT_FEEDBACK_MAX=250; // legacy queue retained for backup compatibility only
const RUNTIME_ERROR_KEY='anesvet_v15_runtime_error_log';
const RUNTIME_ERROR_MAX=25;
const CASE_RUNTIME=window.ANESVET_CASE_RUNTIME;
if(!CASE_RUNTIME)throw new Error('ANESVET case-runtime.js failed to load');
const {makeHumanRecordId,stableSortObject,originalClinicalPayload,sha256Text,computeCaseChecksum,shortChecksum,caseActivityEpoch}=CASE_RUNTIME;
const CASE_LIFECYCLE=window.ANESVET_CASE_LIFECYCLE;
if(!CASE_LIFECYCLE)throw new Error('ANESVET case-lifecycle.js failed to load');
const PATIENT_DOMAIN=window.ANESVET_PATIENT_DOMAIN;
const OR_DOMAIN=window.ANESVET_OR_DOMAIN;
const RECOVERY_DOMAIN=window.ANESVET_RECOVERY_DOMAIN;
const PATIENT_MASTER_ORCH=window.ANESVET_PATIENT_MASTER_ORCHESTRATION;
const OR_RECORD_ORCH=window.ANESVET_OR_RECORD_ORCHESTRATION;
const RECOVERY_ORCH=window.ANESVET_RECOVERY_ORCHESTRATION;
const PROCEDURE_TEMPLATES=window.ANESVET_PROCEDURE_TEMPLATES;
const ACTIVE_CASE_RESCUE=window.ANESVET_ACTIVE_CASE_RESCUE;
if(!ACTIVE_CASE_RESCUE)throw new Error('ANESVET active-case-rescue.js failed to load');
const PREOP_RISK_FLAGS=window.ANESVET_PREOP_CONTROLLER?.riskFlags||[];
if(!PATIENT_DOMAIN||!OR_DOMAIN||!RECOVERY_DOMAIN||!PATIENT_MASTER_ORCH||!OR_RECORD_ORCH||!RECOVERY_ORCH)throw new Error('ANESVET domain/orchestration modules failed to load');
if(!PROCEDURE_TEMPLATES)throw new Error('ANESVET procedure-templates.js failed to load');
BOOT?.mark?.('core-modules-validated');


const numericFields = ['weight','preopHR','preopRR','preopTemp','hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal','recHR','recRR','recMAP','recSpO2','recTemp'];
const dataFields = [
  'patientName','hospitalId','visitId','patientMasterId','species','sex','reproductiveStatus','microchip','breed','weight','age','birthDate','birthDateEstimated','ageSource','estimatedBirthPeriod','approxAgeYears','approxAgeMonths','approxAgeWeeks','bcs','asa','emergency','patientProcedure','patientAllergies','patientComorbidities','patientPrecautions','procedureTemplateId','caseWorkflowProfile','procedure','surgeon','anesthetist','surgicalAssistant','preopMentation','preopHR','preopPulse','preopHeart','preopRR','preopRespEffort','preopLungs','preopTemp','preopMM','preopCRT','preopHydration','preopPain','preopExamNotes','preopExaminer','preopRiskNone','riskBrachycephalic','riskBOAS','riskDifficultAirway','riskUpperAirway','riskAspiration','riskCardiacDisease','riskArrhythmia','riskRespiratoryDisease','riskHypovolemia','riskAnemiaBleeding','riskRenal','riskHepatic','riskMetabolicElectrolyte','riskHypoglycemia','riskPediatric','riskGeriatric','riskObesity','riskPregnancy','riskPreviousAnesthetic','riskEmergency','riskMajorHemorrhage','riskBOASStertor','riskBOASStridor','riskBOASExerciseHeat','riskBOASSleep','riskBOASRegurg','riskBOASAirwaySurgery','riskBOASPreviousDifficultIntubation','riskBOASNotes','riskOther','preopRiskAssessor',
  'hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal',
  'depth','ventilation','bradyPoorPerf','bloodLoss','cardiacRisk','respRisk','recordInterval','reminderOn',
  'recordNote','recHR','recRR','recMAP','recSpO2','recTemp','recExtubation','recOxygen','recMentation','recPain','recPainScale','recPainScore','recDysphoria','recNausea','recAmbulation','recDestination','recHandoffTo','recTransferNote','recHandoffNote','recNaReason','recRecordInterval','recScoreAirway','recScoreOxygen','recScoreTemp','recScoreMentation','recScoreComfort','recScoreNote','planPremed','planInduction','planMaintenance','planAnalgesia','planAntibiotic','planNSAID','planBlock','planNote','actualDiazepamMl','actualPropofolMl','actualTramadolMl','balanceCrystalloid','balanceBolus','balanceBloodIn','balanceBloodLoss','balanceUrine','fluidActualTotal','airwayEttSize','airwayEttDepth','airwayCuff','airwayDifficulty','airwayCircuit','airwayVentMode','airwayVt','airwayPip','airwayPeep','airwayVentRr','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'
];

// R13: the session lock confirms *who* may write, but not *which revision* of
// the current case that tab has loaded. A resumed tab must never blindly save
// its stale in-memory copy after another tab made newer clinical entries.
let freshnessReloadInProgress=false;
// R14: startup must never write a recovered clinical case from a VIEW ONLY tab,
// overwrite an unreadable primary case, or replace a revision that changed
// since hydration began. An uncommitted recovery is read-only until reviewed.
let startupPrimaryRaw=null;
let startupPrimaryUnreadable=false;
let startupRecoveredOnlyInMemory=false;
function guardedStartupCurrentWrite(payload,source='startup'){
  if(restoreJournalNeedsReview() || startupPrimaryUnreadable || !sessionActive() || !SESSION_CONTROLLER.verifyOwnership()){
    BOOT?.mark?.('startup-current-write-blocked',source+':permission-or-corrupt');return false;
  }
  try{
    if(localStorage.getItem(CURRENT_KEY)!==startupPrimaryRaw){
      BOOT?.mark?.('startup-current-write-blocked',source+':revision-changed');return false;
    }
    localStorage.setItem(CURRENT_KEY,payload);
    if(localStorage.getItem(CURRENT_KEY)!==payload)throw new Error('Startup recovery write verification failed');
    startupPrimaryRaw=payload;
    return true;
  }catch(_){BOOT?.mark?.('startup-current-write-blocked',source+':storage-error');return false}
}

const CASE_FRESHNESS=window.ANESVET_ACTIVE_CASE_FRESHNESS?.create?.({
  read:()=>localStorage.getItem(CURRENT_KEY),
  onBlocked:(reason)=>{
    cancelPendingPersistence();
    const banner=$('caseFreshnessBanner');if(banner)banner.hidden=false;
    const label=$('caseFreshnessText');
    if(label)label.textContent=reason==='storage-unavailable'
      ? 'Cannot read saved case. Do not reload or continue recording on this tab; preserve a backup and check browser storage.'
      : reason==='startup-primary-unreadable'
        ? 'Saved Current Case is unreadable or storage access failed. The original was preserved. Do not start saving a new case in this tab; export and verify a backup before repairing browser storage.'
        : reason==='startup-recovery-unpersisted'
        ? 'Recovered case is in memory only; the stored original was not replaced (VIEW ONLY, corrupt original, or concurrent change). Clinical saves are blocked. Export/verify a backup and resolve the original case before continuing.'
        : 'Another tab or workflow changed the saved current case. This screen is out of date. Clinical saves are blocked. Reload the latest locally saved case before continuing.';
    const reload=$('caseFreshnessReloadBtn');if(reload)reload.disabled=reason==='storage-unavailable'||reason==='startup-primary-unreadable'||reason==='startup-recovery-unpersisted';
    try{BOOT?.mark?.('current-case-stale-blocked',reason)}catch(_){ }
  }
});
if(!CASE_FRESHNESS)throw new Error('ANESVET active-case-freshness.js failed to load');
let state = CASE_RUNTIME.createState();
let timerHandle = null;
let dueReminderToken = null;
// Prevent unload/visibility autosave from writing stale DOM values back over a fresh reset.
let resetInProgress = false;
let versionUpdateReloadInProgress = false;
const SAFE_UPDATE_KEY='anesvet_safe_update_resume_v1';

const DOSE_REFERENCE_CONTROLLER=window.ANESVET_DOSE_REFERENCE_CONTROLLER?.create?.({
  doseReference:DOSE_REF,
  getSpecies:()=> $('species')?.value||state.species||state.caseIdentitySnapshot?.species||''
});
if(!DOSE_REFERENCE_CONTROLLER)throw new Error('ANESVET dose-reference-controller.js failed to load');
DOSE_REFERENCE_CONTROLLER.bind();
const currentDoseReferenceSpecies=()=>DOSE_REFERENCE_CONTROLLER.currentSpecies();
const doseReferenceBrief=(drug,species=currentDoseReferenceSpecies())=>DOSE_REFERENCE_CONTROLLER.brief(drug,species);
const doseReferenceButtonHtml=(drug,species=currentDoseReferenceSpecies(),prefix='Dose ref')=>DOSE_REFERENCE_CONTROLLER.buttonHtml(drug,species,prefix);
const renderDoseReferenceInline=(targetId,drug)=>DOSE_REFERENCE_CONTROLLER.renderInline(targetId,drug);
const openDoseReferenceDialog=(drug)=>DOSE_REFERENCE_CONTROLLER.openDialog(drug);
const renderDoseReferenceChips=()=>DOSE_REFERENCE_CONTROLLER.renderChips();

const SESSION_CONTROLLER=window.ANESVET_SESSION_CONTROLLER?.create?.({
  lockKey:SESSION_LOCK_KEY,tabKey:SESSION_TAB_KEY,ttlMs:SESSION_TTL_MS,heartbeatMs:SESSION_HEARTBEAT_MS,channelName:'anesvet-session-v14',appVersion:APP_VERSION,
  getCaseInfo:()=>({caseId:state?.caseId||'',patientName:state?.patientName||''}),
  toast,
  onMode:(mode,reason)=>{
    if(mode==='active'){if(CASE_FRESHNESS.isEstablished())CASE_FRESHNESS.verify()} 
    else{clearInterval(timerHandle);timerHandle=null;if(state?.timer?.running)renderTimerState()}
  }
});
if(!SESSION_CONTROLLER)throw new Error('ANESVET session-controller.js failed to load');
// V17.2.5: establish session ownership BEFORE installing the global interaction guard.
// Previously bind() ran while mode was still `initializing`; any startup exception before the late init call
// could leave every button/select trapped behind the capture handler while text fields appeared editable.
SESSION_CONTROLLER.init();
BOOT?.mark?.('session-initialized',SESSION_CONTROLLER.getMode?.()||'');
SESSION_CONTROLLER.bind();
BOOT?.mark?.('session-bound');
const sessionActive=()=>SESSION_CONTROLLER.isActive();
const readSessionLock=()=>SESSION_CONTROLLER.readLock();
const sessionLockIsFresh=(lock)=>SESSION_CONTROLLER.isFresh(lock);
const writeSessionLock=()=>SESSION_CONTROLLER.writeLock();
const releaseSessionLock=()=>SESSION_CONTROLLER.release();
const renderSessionMode=()=>SESSION_CONTROLLER.render();
const setSessionMode=(mode,reason='')=>SESSION_CONTROLLER.setMode(mode,reason);
const takeSessionControl=()=>SESSION_CONTROLLER.takeControl();
const showSessionConflict=(lock)=>SESSION_CONTROLLER.showConflict(lock);
const refreshSessionStatus=()=>SESSION_CONTROLLER.refresh();
const initSessionCoordination=()=>SESSION_CONTROLLER.init();

let alertAudioContext=null;
let alertAudioReady=false;
function safeStartupPreference(key){try{return localStorage.getItem(key)}catch(_){BOOT?.mark?.('startup-storage-preference-unavailable',key);return null}}
let alertFeedbackEnabled=safeStartupPreference(ALERT_PREF_KEY)!=='off';
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

const SESSION_MODEL=window.ANESVET_SESSION_MODEL;
if(!SESSION_MODEL)throw new Error('ANESVET session lifecycle model failed to load');
function currentElapsed(){return SESSION_MODEL.elapsed(state.timer)}

const CASE_PHASE_MODEL=window.ANESVET_CASE_LIFECYCLE_MODEL;
if(!CASE_PHASE_MODEL)throw new Error('ANESVET case lifecycle model failed to load');
function phaseLabel(){return CASE_PHASE_MODEL.metadata(state.casePhase,{locked:state.caseLocked}).label}
function phaseClass(){return CASE_PHASE_MODEL.metadata(state.casePhase,{locked:state.caseLocked}).className}

function renderOrPhaseTracker(){
  const tracker=CASE_PHASE_MODEL.trackerState(state.casePhase,{locked:state.caseLocked}),current=tracker.current,pair=tracker.meta;
  if($('orPhaseCurrentText'))$('orPhaseCurrentText').textContent=pair.title;
  if($('orPhaseCurrentHelp'))$('orPhaseCurrentHelp').textContent=pair.help;
  document.querySelectorAll('[data-phase-step]').forEach(el=>{
    el.classList.remove('active','done','emergency-active');
    const cls=tracker.stepState(el.dataset.phaseStep);if(cls)el.classList.add(cls);
  });
  if($('orPhaseActionHint'))$('orPhaseActionHint').textContent=pair.hint||'';
}

function renderCasePhase(){
  const label=phaseLabel(),cls=phaseClass();
  ['casePhaseBadge','orCasePhaseBadge'].forEach(id=>{
    const el=$(id);if(!el)return;
    el.textContent=label;el.className=`status-pill phase ${cls}`;
  });
  renderWorkflowLocks();
  renderOrPhaseTracker();
  renderOrPrimaryFlow();
}
function setCasePhase(phase,log=true){
  if(state.caseLocked)return;
  if(state.casePhase===phase){renderCasePhase();return}
  state.casePhase=phase;
  addAudit('CASE_PHASE_CHANGE',`Phase → ${phase}`);
  if(phase==='recovery'){if(!state.recoveryStartedAt)state.recoveryStartedAt=Date.now();captureRecoveryHandoff('Recovery phase transition')}
  if(log){const name=CASE_PHASE_MODEL.eventName(phase);if(name)addEvent({category:'Phase',name,note:`Case phase → ${phase}`})}
  save();renderCasePhase();renderRecoveryState();renderCaseSummary();
}

function renderTimerState(){
  const badge=$('timerStateBadge'),startBtn=$('startCaseBtn'),pauseBtn=$('pauseCaseBtn');
  if(!badge||!startBtn||!pauseBtn)return;
  const view=SESSION_MODEL.timerView(state.timer);
  badge.className=view.badgeClass;badge.textContent=view.badgeText;
  startBtn.textContent=view.startText;startBtn.disabled=view.startDisabled;
  pauseBtn.disabled=view.pauseDisabled;pauseBtn.textContent=view.pauseText;
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
function confirmCaseDrugPlanBeforeStart(){ensureCaseDrugPlanInitialized();if(!(state.caseDrugPlan||[]).length)return confirm('Case Drug Plan ว่าง — ต้องการเริ่มเคสโดยไม่มี planned medications หรือ emergency standby list หรือไม่?');if(state.caseDrugPlanReviewedAt)return true;return confirm(`Case Drug Plan ยังไม่ได้ Save / Review (${state.caseDrugPlan.length} medication(s))\n\nเริ่มเคสและ freeze แผนปัจจุบันต่อหรือไม่?`)}
const PRE_OR_REQUIRED_CHECK_KEYS=['consent','fasting','exam','risk','labs','iv','oxygen','machine','vaporizer','absorber','airway','suction','monitor','warming','emergency'];
function preOrReadinessStatus(){
  const hard=[],required=[],recommended=[];
  const name=$('patientName')?.value.trim()||state.patientName||'';
  const species=$('species')?.value||state.species||'';
  const weight=(currentWeightKg()??Number(state.weight))||null;
  const procedure=$('patientProcedure')?.value.trim()||state.patientProcedure||state.procedure||'';
  const asa=$('asa')?.value||state.asa||'';
  if(!name)hard.push({key:'patient-name',label:'Patient name',tab:'patient',target:'patientName'});
  if(!species)hard.push({key:'species',label:'Species',tab:'patient',target:'species'});
  if(!(Number.isFinite(Number(weight))&&Number(weight)>0))hard.push({key:'weight',label:'Current body weight',tab:'patient',target:'weight'});
  if(!state.patientSaved)hard.push({key:'patient-save',label:'Save Patient & Case Setup',tab:'patient',target:'savePatientBtn'});
  if(!procedure)required.push({key:'procedure',label:'Procedure',tab:'patient',target:'patientProcedure'});
  if(!asa)required.push({key:'asa',label:'ASA Physical Status',tab:'patient',target:'asaGrid'});
  if(!state.preopExamRecordedAt)required.push({key:'physical-exam',label:'Recorded pre-anesthetic physical exam',tab:'preop',target:'preopExamHeading'});
  if(!state.preopRiskRecordedAt)required.push({key:'risk-review',label:'Recorded anesthetic risk review',tab:'preop',target:'preopRiskStatus'});
  const checks=state.preopChecks||{},na=state.preopNA||{};
  const missingChecks=PRE_OR_REQUIRED_CHECK_KEYS.filter(k=>!checks[k]&&!na[k]);
  if(missingChecks.length)required.push({key:'preop-checklist',label:`Pre-op checklist reviewed (${PRE_OR_REQUIRED_CHECK_KEYS.length-missingChecks.length}/${PRE_OR_REQUIRED_CHECK_KEYS.length})`,tab:'preop',target:'preopProgress'});
  if(!state.caseDrugPlanReviewedAt)recommended.push({key:'drug-plan',label:'Case Drug Plan not reviewed',tab:'drugs',target:'caseDrugPlanStatus'});
  if(!String($('anesthetist')?.value||state.anesthetist||'').trim())recommended.push({key:'anesthetist',label:'Anesthetist not entered',tab:'patient',target:'anesthetist'});
  if(!String($('surgeon')?.value||state.surgeon||'').trim())recommended.push({key:'surgeon',label:'Surgeon not entered',tab:'patient',target:'surgeon'});
  const blockerKeys=[...hard,...required].map(x=>x.key).sort();
  return {hard,required,recommended,blockerKeys,ready:hard.length===0&&required.length===0};
}
function readinessOverrideValid(status=preOrReadinessStatus()){
  const o=state.preOrReadinessOverride;if(!o||!Array.isArray(o.blockerKeys)||status.hard.length)return false;
  return JSON.stringify([...o.blockerKeys].sort())===JSON.stringify(status.blockerKeys);
}
let pendingPreOrTarget='orlive';
function renderPreOrReadinessDialog(target='orlive'){
  const d=$('preOrReadinessDialog');if(!d)return;pendingPreOrTarget=target;
  const st=preOrReadinessStatus(),req=$('preOrRequiredList'),rec=$('preOrRecommendedList');
  const item=x=>`<li><span>•</span><b>${escapeHtml(x.label)}</b></li>`;
  if(req)req.innerHTML=[...st.hard,...st.required].length?[...st.hard,...st.required].map(item).join(''):'<li class="ready">✓ Required items complete</li>';
  if(rec)rec.innerHTML=st.recommended.length?st.recommended.map(item).join(''):'<li class="ready">✓ No additional warnings</li>';
  if($('preOrReadinessTitle'))$('preOrReadinessTitle').textContent=st.ready?'Ready for OR LIVE':'Complete required items before OR LIVE';
  if($('preOrReadinessStatus')){$('preOrReadinessStatus').className=`readiness-status ${st.ready?'good':'warn'}`;$('preOrReadinessStatus').textContent=st.ready?'READY':`${st.hard.length+st.required.length} REQUIRED ITEM(S) MISSING`}
  const first=[...st.hard,...st.required][0];
  if($('preOrGoFixBtn')){$('preOrGoFixBtn').hidden=!first;$('preOrGoFixBtn').textContent=first?`Review: ${first.label}`:'Review setup';$('preOrGoFixBtn').dataset.tab=first?.tab||'preop';$('preOrGoFixBtn').dataset.target=first?.target||''}
  const overrideBox=$('preOrOverrideBox');if(overrideBox)overrideBox.hidden=st.hard.length>0||st.required.length===0;
  if($('preOrOverrideReason'))$('preOrOverrideReason').value='';
  if($('preOrOverrideBy'))$('preOrOverrideBy').value=$('anesthetist')?.value.trim()||state.anesthetist||'';
  if(typeof d.showModal==='function'&&!d.open)d.showModal();
}
function requestOrLiveAccess(opts={}){
  if(SESSION_MODEL.sessionStatus(state).orLiveByStartedCase)return true;
  const st=preOrReadinessStatus();
  if(!(st.ready||readinessOverrideValid(st))){if(!opts.silent)renderPreOrReadinessDialog('orlive');return false;}
  if(opts.skipBriefing)return true;
  return requestPreOrBriefing();
}
function invalidatePreOrOverride(){if(state.caseStartedAt)return;if(state.preOrReadinessOverride){state.preOrReadinessOverride=null;save()}renderWorkflowLocks()}
function preOrBriefingSignature(){
  const riskIds=PREOP_RISK_FLAGS.map(r=>r.id);
  const payload={
    patientName:$('patientName')?.value.trim()||state.patientName||'',species:$('species')?.value||state.species||'',breed:$('breed')?.value||state.breed||'',weight:(currentWeightKg()??Number(state.weight))||null,
    asa:$('asa')?.value||state.asa||'',procedure:$('patientProcedure')?.value.trim()||state.patientProcedure||state.procedure||'',workflow:$('caseWorkflowProfile')?.value||state.caseWorkflowProfile||'routine',
    bcs:$('bcs')?.value||state.bcs||'',allergies:$('patientAllergies')?.value.trim()||state.patientAllergies||'',comorbidities:$('patientComorbidities')?.value.trim()||state.patientComorbidities||'',precautions:$('patientPrecautions')?.value.trim()||state.patientPrecautions||'',
    exam:{mentation:state.preopMentation||'',hr:state.preopHR||'',rr:state.preopRR||'',temp:state.preopTemp||'',mm:state.preopMM||'',crt:state.preopCRT||'',hydration:state.preopHydration||'',heart:state.preopHeart||'',lungs:state.preopLungs||'',notes:state.preopExamNotes||''},
    risks:Object.fromEntries(riskIds.map(id=>[id,!!state[id]])),riskOther:state.riskOther||'',boasNote:state.riskBOASNotes||'',drugPlan:(state.caseDrugPlan||[]).map(d=>[d.id||d.name,d.name,d.phase,d.role,d.route,d.dose,d.conc,d.concUnit,d.manualOnly])
  };
  return JSON.stringify(payload);
}
function preOrBriefingReviewValid(){return !!(state.preOrBriefingReview&&state.preOrBriefingReview.signature===preOrBriefingSignature())}
const fmt1=window.ANESVET_APP_UTILS.fmt1;
const BRACHY_DOG_BREEDS=['pug','french bulldog','english bulldog','boston terrier','shih tzu','pekingese','boxer'];
const BRACHY_CAT_BREEDS=['persian','exotic shorthair'];
function normalizedBreedForAirway(){return String($('breed')?.value||state.breed||'').trim().toLowerCase()}
function brachyBreedDetected(species,breed=''){
  const b=String(breed||'').trim().toLowerCase();if(!b)return false;
  const list=String(species).toLowerCase()==='cat'?BRACHY_CAT_BREEDS:BRACHY_DOG_BREEDS;
  return list.some(x=>b===x||b.includes(x));
}
function formatEttPrep(lo,hi){
  const a=Math.max(2,Number(lo)),b=Math.max(a,Number(hi));
  const f=n=>Number(n).toFixed(1);
  return `${f(a)}–${f(b)} mm ID`;
}
function dogNormalAnatomyEtt(weightKg){
  const w=Number(weightKg);
  // Fundamental Principles of Veterinary Anesthesia Table 12.3 (lean weight; normal anatomy)
  if(w<=1)return {range:'3.5–4.0 mm ID',min:3.5,max:4.0};
  if(w<=2)return {range:'4.0–5.0 mm ID',min:4.0,max:5.0};
  if(w<=3.5)return {range:'5.0–5.5 mm ID',min:5.0,max:5.5};
  if(w<=4.5)return {range:'5.5–6.0 mm ID',min:5.5,max:6.0};
  if(w<=6)return {range:'6.0–6.5 mm ID',min:6.0,max:6.5};
  if(w<=8)return {range:'6.5–7.0 mm ID',min:6.5,max:7.0};
  if(w<=10)return {range:'7.0–8.0 mm ID',min:7.0,max:8.0};
  if(w<=12)return {range:'8.0–8.5 mm ID',min:8.0,max:8.5};
  if(w<=14)return {range:'8.5–9.0 mm ID',min:8.5,max:9.0};
  if(w<=16)return {range:'9.0–9.5 mm ID',min:9.0,max:9.5};
  if(w<=20)return {range:'9.5–10.0 mm ID',min:9.5,max:10.0};
  if(w<=25)return {range:'10.0–11.0 mm ID',min:10.0,max:11.0};
  if(w<=30)return {range:'11.0–12.0 mm ID',min:11.0,max:12.0};
  if(w<=35)return {range:'12.0–14.0 mm ID',min:12.0,max:14.0};
  return {range:'14–16 mm ID',min:14.0,max:16.0};
}
function catNormalAnatomyEtt(weightKg){
  const w=Number(weightKg);
  // AAFP: most adult cats 3.5–5.0 mm ID; keep 2.0–5.5 mm available. Weight bands here are preparation estimates only.
  if(w<=1)return {range:'2.5–3.0 mm ID',min:2.5,max:3.0};
  if(w<=2)return {range:'3.0–3.5 mm ID',min:3.0,max:3.5};
  if(w<=3.5)return {range:'3.5–4.0 mm ID',min:3.5,max:4.0};
  if(w<=4.5)return {range:'4.0–4.5 mm ID',min:4.0,max:4.5};
  if(w<=6)return {range:'4.5–5.0 mm ID',min:4.5,max:5.0};
  return {range:'4.5–5.0 mm ID',min:4.5,max:5.0};
}
function roughEttReference(species,weightKg){
  const w=Number(weightKg),sp=String(species).toLowerCase(),breed=normalizedBreedForAirway();
  if(!Number.isFinite(w)||w<=0)return {range:'—',note:'ยืนยันขนาดจาก anatomy จริง',basis:'No valid BW'};
  const brachyByBreed=brachyBreedDetected(sp,breed),brachyRisk=!!(state.riskBrachycephalic||state.riskBOAS||state.riskDifficultAirway||state.riskUpperAirway||brachyByBreed);
  const base=sp==='cat'?catNormalAnatomyEtt(w):dogNormalAnatomyEtt(w);
  let prep='';
  if(sp==='cat'){
    prep=brachyRisk?`${formatEttPrep(base.min-1.0,base.max+0.5)} • มี 2.0–5.5 mm พร้อม`:`${formatEttPrep(base.min-0.5,base.max+0.5)} • มี 2.0–5.5 mm พร้อม`;
  }else{
    prep=brachyRisk?`${formatEttPrep(base.min-1.0,base.max+0.5)} (รวม 1–2 size เล็กกว่า weight estimate)`:`${formatEttPrep(base.min-0.5,base.max+0.5)}`;
  }
  const anatomyRule='เลือก final size เป็น ETT ที่ใหญ่ที่สุดซึ่งผ่าน arytenoid ได้ง่ายโดยไม่เกิด trauma';
  if(brachyRisk){
    return {range:`Weight estimate ${base.range}`,prepare:prep,basis:brachyByBreed?`Breed alert: ${breed}`:'Airway-risk flag',note:`brachycephalic/airway-risk: weight chart ทำนายได้ไม่แม่นพอสำหรับเลือก final size • เตรียมหลายขนาด • ${anatomyRule}`};
  }
  return {range:base.range,prepare:prep,basis:sp==='cat'?'AAFP adult-cat range + BW prep estimate':'Lean-BW normal-anatomy table',note:`เตรียม ${prep} • ${anatomyRule}`};
}
function preOrSupportReference(){
  const species=($('species')?.value||state.species||'').toLowerCase(),w=(currentWeightKg()??Number(state.weight))||0;
  const ett=roughEttReference(species,w),airwayRisk=!!(state.riskBrachycephalic||state.riskBOAS||state.riskDifficultAirway||state.riskUpperAirway||brachyBreedDetected(species,normalizedBreedForAirway())),obese=!!state.riskObesity,respRisk=!!state.riskRespiratoryDisease;
  let circuit='Rebreathing (circle)',o2='';
  if(w<3){circuit='Non-rebreathing commonly preferred';o2=`~${fmt1(w*0.2)}–${fmt1(w*0.4)} L/min`;}
  else if(w<=5){circuit='NRC or pediatric rebreathing';o2=`NRC ~${fmt1(w*0.2)}–${fmt1(w*0.4)} L/min • RC ≥0.5 L/min`;}
  else{const lo=Math.max(.5,w*.02),hi=Math.max(.5,w*.04);o2=`RC maintenance ~${fmt1(lo)}–${fmt1(hi)} L/min`;}
  const vtLo=w*8,vtHi=w*10;
  const fluidRisk=!!(state.riskCardiacDisease||state.riskRenal||state.riskHypovolemia||state.riskEmergency||state.riskMajorHemorrhage||state.riskAnemiaBleeding);
  let fluid='';
  if(species==='cat')fluid=fluidRisk?`Individualize • healthy baseline ${fmt1(w*3)}–${fmt1(w*5)} mL/h`:`3–5 mL/kg/h ≈ ${fmt1(w*3)}–${fmt1(w*5)} mL/h`;
  else fluid=fluidRisk?`Individualize • healthy baseline ${fmt1(w*5)} mL/h`:`5 mL/kg/h ≈ ${fmt1(w*5)} mL/h`;
  const bagLiters=[0.5,1,2,3,5].find(x=>x*1000>=w*10*5)||5;
  return {
    ett:{value:ett.range,note:`${ett.note}${ett.prepare?` • Tray: ${ett.prepare}`:''}${obese?' • obesity: ใช้ lean/ideal BW + anatomy มากกว่าน้ำหนักจริง':''}`},
    circuit:{value:circuit,note:'เลือกตามอุปกรณ์จริง, resistance/dead space และผู้ป่วย'},
    oxygen:{value:o2,note:w>5?'เมื่อจำเป็นต้องเปลี่ยน depth เร็ว RC มักใช้ flow สูงชั่วคราว; ติดตาม inspired CO₂/ETCO₂':'ปรับ flow ให้ไม่มี clinically relevant rebreathing; ห้ามใช้ O₂ flush กับ NRC'},
    vt:{value:`8–10 mL/kg ≈ ${fmt1(vtLo)}–${fmt1(vtHi)} mL`,note:`ถ้าต้อง controlled ventilation • ${obese?'ควรคำนวณจาก lean/ideal BW มากกว่าน้ำหนักจริง • ':''}${respRisk?'respiratory disease: เริ่มแบบ lung-protective/conservative และปรับตาม compliance • ':''}titrate ตาม ETCO₂/chest excursion`},
    pip:{value:'~10–15 cmH₂O start',note:'ใช้แรงดันต่ำที่สุดที่ได้ ventilation เพียงพอ; ประเมิน BP หลังเริ่ม PPV'},
    rr:{value:'~10–15 /min start',note:'ปรับตาม capnogram/ETCO₂; surgical-plane ETCO₂ โดยทั่วไป ~40–50 (ถึง ~55) mmHg'},
    peep:{value:'Individualize',note:'ไม่ auto-set • พิจารณา oxygenation, lung mechanics และ hemodynamics'},
    fluid:{value:fluid,note:fluidRisk?'มี risk ที่ทำให้ routine elective rate อาจไม่เหมาะ — แก้ hypovolemia/ongoing losses และหลีกเลี่ยง fluid overload ตามบริบท':'balanced crystalloid starting reference; ปรับตาม perfusion/ongoing losses'},
    bag:{value:`≈ ${bagLiters} L reservoir bag`,note:'rough prep: bag capacity ≈ ≥5× expected VT; เลือกอุปกรณ์ที่เหมาะกับ circuit จริง'},
    preoxygen:{value:'100% O₂ ~3 min',note:airwayRisk||respRisk||state.riskPregnancy?'PRIORITY: airway/respiratory risk หรือ expected difficult intubation':'พิจารณาเป็นส่วนหนึ่งของ induction sequence'}
  };
}
function preOrRiskBriefItems(){
  const out=[],push=(icon,title,note)=>out.push({icon,title,note});
  const asa=String($('asa')?.value||state.asa||'').toUpperCase();
  if(asa&&/III|IV|V/.test(asa))push('⚑',`ASA ${asa.replace(/^ASA\s*/,'')}`,'Higher ASA status — ใช้ข้อมูลโรค/physiologic reserve และ procedure เพื่อกำหนด monitoring/support plan ให้เข้มขึ้น');
  const allergy=String($('patientAllergies')?.value||state.patientAllergies||'').trim();if(allergy)push('⚠','Documented allergy / adverse reaction',allergy);
  const comorb=String($('patientComorbidities')?.value||state.patientComorbidities||'').trim();if(comorb)push('＋','Comorbidity',comorb);
  const precaution=String($('patientPrecautions')?.value||state.patientPrecautions||'').trim();if(precaution)push('!', 'Case-specific precaution',precaution);
  const examAlerts=[];
  if(state.preopMentation&&!String(state.preopMentation).startsWith('BAR'))examAlerts.push(`Mentation: ${state.preopMentation}`);
  if(state.preopHeart&&!['No obvious abnormality','Not assessed'].includes(state.preopHeart))examAlerts.push(`Heart: ${state.preopHeart}`);
  if(state.preopRespEffort&&state.preopRespEffort!=='Normal / unlabored')examAlerts.push(`Resp: ${state.preopRespEffort}`);
  if(state.preopLungs&&!['Clear / no obvious abnormality','Not assessed'].includes(state.preopLungs))examAlerts.push(`Lungs: ${state.preopLungs}`);
  if(state.preopMM&&state.preopMM!=='Pink')examAlerts.push(`MM: ${state.preopMM}`);
  if(state.preopCRT&&state.preopCRT!=='< 2 sec'&&state.preopCRT!=='Not assessed')examAlerts.push(`CRT: ${state.preopCRT}`);
  if(state.preopHydration&&!['Adequate / no obvious dehydration','Not assessed'].includes(state.preopHydration))examAlerts.push(`Hydration: ${state.preopHydration}`);
  if(String(state.preopExamNotes||'').trim())examAlerts.push(`Exam note: ${String(state.preopExamNotes).trim()}`);
  if(examAlerts.length)push('🩺','Physical-exam findings to carry into OR',examAlerts.join(' • '));
  const breedAirway=brachyBreedDetected($('species')?.value||state.species||'',normalizedBreedForAirway());
  if(state.riskBrachycephalic||state.riskBOAS||state.riskDifficultAirway||state.riskUpperAirway||breedAirway)push('🫁','Airway risk',`${breedAirway&&!state.riskBrachycephalic?'Brachycephalic breed pattern detected from breed field • ':''}เตรียม ETT หลายขนาด, laryngoscope, suction และแผน difficult-airway/re-intubation; recovery airway observation ต้องเข้มขึ้น`);
  if(state.riskAspiration||state.riskBOASRegurg)push('⚠','Aspiration / regurgitation risk','เตรียม suction และ airway protection; ลดช่วงเวลาที่ airway ไม่ถูกป้องกันเท่าที่ทำได้');
  if(state.riskRespiratoryDisease)push('🫁','Reduced respiratory reserve','ให้ความสำคัญกับ preoxygenation, capnography, SpO₂ และ ventilatory support ที่ปรับตาม lung mechanics');
  if(state.riskCardiacDisease||state.riskArrhythmia)push('♥','Cardiovascular risk','ECG/BP trend ต้องเด่น; หลีกเลี่ยงการใช้ routine fluid/PPV แบบไม่ประเมิน preload และ hemodynamics');
  if(state.riskHypovolemia)push('💧','Hypovolemia / poor perfusion','ควรแก้ volume deficit ก่อน anesthesia เมื่อทำได้; PPV อาจลด venous return เพิ่ม');
  if(state.riskAnemiaBleeding||state.riskMajorHemorrhage)push('🩸','Anemia / bleeding risk','ประเมิน blood availability, IV access, suction และแผนประเมิน blood loss/transfusion ตามความเหมาะสม');
  if(state.riskRenal)push('🧪','Renal risk','รักษา perfusion แต่หลีกเลี่ยง fluid overload; ติดตาม BP/urine output ตามบริบท');
  if(state.riskHepatic)push('🧪','Hepatic risk','ทบทวน drug plan และ recovery expectation ตาม hepatic function ของผู้ป่วย');
  if(state.riskMetabolicElectrolyte)push('🧪','Metabolic / electrolyte risk','ยืนยันความผิดปกติที่สำคัญได้รับการประเมิน/แก้ไขก่อน induction และเตรียม recheck ถ้าจำเป็น');
  if(state.riskHypoglycemia||state.riskPediatric)push('🍬','Glucose / pediatric risk','เตรียม glucose monitoring และ active warming; ลด dead space และใช้อุปกรณ์ขนาดเหมาะสม');
  if(state.riskGeriatric)push('⏱','Reduced physiologic reserve','titrate drugs to effect และเตรียมรับ hypotension/hypothermia/recovery ที่ช้ากว่าปกติ');
  if(state.riskObesity)push('⚖','Obesity','ETT/VT reference ควรอิง lean/ideal BW และ anatomy ไม่ใช่ total BW อย่างเดียว');
  if(state.riskPregnancy)push('🐾','Pregnancy / peripartum','เตรียม aspiration/ventilation support และ neonatal team หากเป็น C-section');
  if(state.riskPreviousAnesthetic)push('↻','Previous anesthetic event','ทบทวน event เดิมและเตรียม mitigation plan ก่อน induction');
  if(state.riskEmergency||state.emergency)push('🚨','Emergency / unstable context','stabilization และ perfusion/oxygenation priority; ค่า reference routine อาจใช้ไม่ได้ตรง ๆ');
  if(state.riskOther)push('⚠','Other documented risk',String(state.riskOther));
  if(!out.length)push('✓','No additional structured risk flags','ยังต้องใช้ ASA, physical exam, procedure และ clinical judgment ประกอบ');
  return out;
}
function preOrPrepItems(){
  const out=[],push=(icon,title,note)=>out.push({icon,title,note});const ref=preOrSupportReference();
  push('🫁',`ETT working range: ${ref.ett.value}`,ref.ett.note);
  push('⭕',`Breathing circuit: ${ref.circuit.value}`,ref.circuit.note);
  push('💨',`O₂ flow reference: ${ref.oxygen.value}`,ref.oxygen.note);
  if(state.riskBrachycephalic||state.riskBOAS||state.riskDifficultAirway||state.riskUpperAirway||state.riskAspiration)push('🧰','Airway rescue setup','Suction + alternative ETT sizes + airway tools ให้หยิบได้ทันที');
  if(state.riskHypoglycemia||state.riskPediatric)push('🌡','Warming + glucose plan','เตรียม active warming และวิธีตรวจ glucose ก่อน induction');
  if(state.riskMajorHemorrhage||state.riskAnemiaBleeding)push('🩸','Hemorrhage preparation','ประเมิน blood product availability / large-bore access ตามความเหมาะสมของเคส');
  if((state.caseDrugPlan||[]).some(d=>String(d.role||'').toLowerCase().includes('emergency')||String(d.phase||'').toLowerCase().includes('emergency')))push('💉','Emergency drugs in Case Drug Plan','ตรวจ concentration / route / access ก่อนเริ่มเคส');
  return out;
}
function renderPreOrBriefing(){
  const d=$('preOrBriefingDialog');if(!d)return;const species=$('species')?.value||state.species||'—',breed=$('breed')?.value||state.breed||'',w=(currentWeightKg()??Number(state.weight))||null,asa=$('asa')?.value||state.asa||'—',procedure=$('patientProcedure')?.value.trim()||state.patientProcedure||state.procedure||'—';
  $('preOrBriefCase').textContent=`${$('patientName')?.value.trim()||state.patientName||'Unnamed'} • ${species}${breed?` / ${breed}`:''} • ${w?`${w} kg`:'— kg'} • ASA ${asa} • ${procedure}`;
  const renderList=(id,items)=>{const el=$(id);if(el)el.innerHTML=items.map(x=>`<div class="preor-brief-item"><span>${x.icon||'•'}</span><div><b>${escapeHtml(x.title)}</b><small>${escapeHtml(x.note||'')}</small></div></div>`).join('')};
  renderList('preOrBriefRisks',preOrRiskBriefItems());renderList('preOrBriefPrep',preOrPrepItems());
  const ref=preOrSupportReference(),cells=[['Preoxygenation',ref.preoxygen],['VT if PPV',ref.vt],['PIP if PPV',ref.pip],['RR if PPV',ref.rr],['PEEP',ref.peep],['Fluid reference',ref.fluid],['O₂ / FGF',ref.oxygen],['Reservoir bag',ref.bag]];
  if($('preOrBriefSupport'))$('preOrBriefSupport').innerHTML=cells.map(([label,v])=>`<div class="preor-support-cell"><span>${escapeHtml(label)}</span><b>${escapeHtml(v.value)}</b><small>${escapeHtml(v.note)}</small></div>`).join('');
  const meds=(state.caseDrugPlan||[]),planned=meds.filter(m=>String(m.role||'').toLowerCase()!=='emergency'&&!String(m.phase||'').toLowerCase().includes('emergency')),emergency=meds.filter(m=>String(m.role||'').toLowerCase()==='emergency'||String(m.phase||'').toLowerCase().includes('emergency'));
  const medItems=[];if(planned.length)medItems.push({icon:'💉',title:`Planned medications (${planned.length})`,note:planned.slice(0,8).map(x=>x.name||x.id||'Medication').join(' • ')+(planned.length>8?' …':'')});else medItems.push({icon:'—',title:'No reviewed planned medications',note:'ทบทวน Case Drug Plan หากต้องการให้ยาในแผนขึ้นเป็น quick access ใน OR LIVE'});if(emergency.length)medItems.push({icon:'🚨',title:`Emergency / standby (${emergency.length})`,note:emergency.slice(0,8).map(x=>x.name||x.id||'Medication').join(' • ')});renderList('preOrBriefMeds',medItems);
  if($('preOrBriefingBy'))$('preOrBriefingBy').value=$('anesthetist')?.value.trim()||state.anesthetist||state.preopRiskRecordedBy||state.preopExamRecordedBy||'';
  if(typeof d.showModal==='function'&&!d.open)d.showModal();
}
function requestPreOrBriefing(){if(state.caseStartedAt||preOrBriefingReviewValid())return true;renderPreOrBriefing();return false}
function recoveryAccessAllowed(){return SESSION_MODEL.sessionStatus(state).recoveryAccess;}
function validateCaseReadyToStart(){
  if(!$('patientName')?.value.trim()){toast('กรุณากรอกชื่อผู้ป่วยก่อนเริ่มเคส');setTab('patient');$('patientName')?.focus();return false}
  if(!$('species')?.value){toast('กรุณาเลือก Species ก่อนเริ่มเคส');setTab('patient');$('species')?.focus();return false}
  if(!state.patientSaved){toast('Patient & Case Setup changed or not saved — Save setup before Start case');setTab('patient');$('savePatientBtn')?.focus();return false}
  if(currentWeightKg()===null){toast('Current BW required — enter today’s measured weight before Start case');setTab('patient');$('weight')?.focus();return false}
  if(!state.caseStartedAt&&PROTOCOL_GOVERNANCE?.startGate){
    const gate=PROTOCOL_GOVERNANCE.startGate(captureHospitalProtocolPayload());
    if(gate&&!gate.ok){toast(gate.reason||'Hospital Protocol Governance blocks new case start');setTab('settings');PROTOCOL_GOVERNANCE.render?.();return false}
  }
  const readiness=preOrReadinessStatus();
  if(!readiness.ready&&!readinessOverrideValid(readiness)){renderPreOrReadinessDialog('orlive');return false}
  if(readiness.ready&&!preOrBriefingReviewValid()){renderPreOrBriefing();return false}
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
  if(!state.caseStartedAt&&!confirmCaseDrugPlanBeforeStart())return false;
  state.timer.running=true;
  state.timer.startedEpoch=Date.now();
  if(!state.caseStartedAt){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';state.caseIdentitySnapshot={patientMasterId:state.patientMasterId||$('patientMasterId')?.value||'',patientName:$('patientName')?.value.trim()||state.patientName||'',hospitalId:$('hospitalId')?.value.trim()||state.hospitalId||'',visitId:$('visitId')?.value.trim()||state.visitId||'',species:$('species')?.value||state.species||'',microchip:$('microchip')?.value.trim()||state.microchip||'',weight:Number($('weight')?.value||state.weight)||null,capturedAt:state.timer.startedEpoch};captureProtocolSnapshot();captureHospitalBrandingSnapshot();addAudit('CASE_STARTED',`Anesthesia case timer started • patient ${state.caseIdentitySnapshot.patientName||'Unnamed'} • BW ${state.caseIdentitySnapshot.weight??'—'} kg`)}
  startTimerLoop();renderTimerState();renderCasePhase();save();
  return true;
}
function startTimerLoop(){
  clearInterval(timerHandle);
  timerHandle=setInterval(()=>{
    $('caseClock').textContent=formatElapsed(currentElapsed());
    renderTimerState();
    if($('orlive')?.classList.contains('active')) renderOrLive();
    if(state.casePhase==='recovery'){renderRecoveryState();renderRecoveryRecords();updateRecoveryDue();renderOrUndoControls();}
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
function renderSaveState(mode=null){
  const el=$('saveState');if(!el)return;if(mode)saveUiMode=mode;mode=mode||saveUiMode;
  if(mode==='error'){el.className='save-state error';el.textContent='⚠ SAVE FAILED';return}
  if(mode==='saving'){el.className='save-state saving';el.textContent='Saving…';return}
  if(mode==='dirty'){el.className='save-state dirty';el.textContent='● Unsaved changes';return}
  const t=state.lastSavedAt?formatClock(state.lastSavedAt):'—';
  el.className='save-state saved';el.textContent=`✓ Saved locally ${t}`;
}
function renderConnectivityState(){
  const el=$('connectivityState');if(!el)return;const online=navigator.onLine!==false;
  el.className=`connectivity-state ${online?'local':'offline'}`;
  el.textContent=online?'● Local-first':'● Offline • local save';
  el.title=online?'Clinical data saves locally first; internet is not required for OR documentation.':'Offline mode: current case continues saving on this device.';
}
let autosaveReason='input';
function scheduleAutosave(reason='input'){
  if(resetInProgress||!sessionActive()||state.caseLocked)return;
  autosaveReason=reason||'input';
  renderSaveState('dirty');
  clearTimeout(autosaveTimer);
  autosaveTimer=setTimeout(()=>{autosaveTimer=null;save({reason:`autosave:${autosaveReason}`})},AUTOSAVE_DELAY_MS);
}
function flushPendingSave(reason='flush'){
  if(resetInProgress||!sessionActive()||state.caseLocked)return false;
  return save({reason});
}
function cancelPendingPersistence(){
  if(autosaveTimer){clearTimeout(autosaveTimer);autosaveTimer=null}
  if(currentMirrorTimer){clearTimeout(currentMirrorTimer);currentMirrorTimer=null}
  autosaveReason='input';
}
function startActiveCheckpoint(){
  clearInterval(activeCheckpointTimer);activeCheckpointTimer=setInterval(()=>{
    if(resetInProgress||!sessionActive()||state.caseLocked)return;
    if(state.timer.running||state.casePhase==='recovery'||hasActiveCaseData())save();
  },ACTIVE_CHECKPOINT_MS);
}

let archiveCache=[];
let archiveBackend='initializing';
let patientCache=[];
let patientBackend='initializing';
let currentMirrorTimer=null;
let autosaveTimer=null;
let activeCheckpointTimer=null;
let saveUiMode='saved';
let startupRecoveryNotice=null;

const CORE_STORAGE=window.ANESVET_CORE_STORAGE?.create?.({
  dbName:DB_NAME,dbVersion:DB_VERSION,
  onBlocked:()=>{
    archiveBackend='blocked';patientBackend='blocked';
    const msg='ANESVET database upgrade is blocked by another open tab. Close other ANESVET tabs/windows, then reload this page.';
    if($('storageStatus'))$('storageStatus').textContent='Storage: BLOCKED — close other ANESVET tabs and reload';
    try{alert(msg)}catch(e){}
  }
});
if(!CORE_STORAGE)throw new Error('ANESVET core-storage.js failed to load');
const openAnesvetDb=()=>CORE_STORAGE.openDb();
const idbGetAllCases=()=>CORE_STORAGE.getAllCases();
const idbPutCase=c=>CORE_STORAGE.putCase(c);
const idbDeleteCase=id=>CORE_STORAGE.deleteCase(id);
const idbClearCases=()=>CORE_STORAGE.clearCases();
const idbGetAllPatients=()=>CORE_STORAGE.getAllPatients();
const idbPutPatient=p=>CORE_STORAGE.putPatient(p);
const idbClearPatients=()=>CORE_STORAGE.clearPatients();
const idbPutMeta=(key,value)=>CORE_STORAGE.putMeta(key,value);
const idbGetMeta=key=>CORE_STORAGE.getMeta(key);

const BACKUP_RESTORE_CONTROLLER=window.ANESVET_BACKUP_RESTORE_CONTROLLER?.create?.({
  $,$$,toast,formatClock,formatDate,appVersion:APP_VERSION,getState:()=>state,save,downloadBlob,computeCaseChecksum,sha256Text,
  initArchiveDb,initPatientMaster,getArchive:()=>getArchive(),getPatients:()=>getPatients(),
  getArchiveBackend:()=>archiveBackend,getPatientBackend:()=>patientBackend,getArchiveCache:()=>archiveCache,setArchiveCache:(rows)=>{archiveCache=rows||[]},getPatientCache:()=>patientCache,setPatientCache:(rows)=>{patientCache=rows||[]},
  loadBreedAliases,loadDrugLibraryData,loadQuickPresets,procedureTemplates:PROCEDURE_TEMPLATES,getProtocolAudit,getPilotFeedbackQueue,setPilotFeedbackQueue,
  patientFromCase,patientIdentityKey,coreStorage:CORE_STORAGE,idbPutMeta,idbGetMeta,readSafetyCheckpoint,caseActivityEpoch,saveFallbackPatients,
  keys:{current:CURRENT_KEY,archive:ARCHIVE_KEY,settings:SETTINGS_KEY,drugLibrary:DRUG_LIBRARY_KEY,quickPreset:QUICK_PRESET_KEY,protocolAudit:PROTOCOL_AUDIT_KEY,protocolGovernance:PROTOCOL_GOVERNANCE_KEY,lastBackup:LAST_BACKUP_KEY,backupReceipt:BACKUP_RECEIPT_KEY,lastRestore:LAST_RESTORE_KEY,breedAlias:BREED_ALIAS_KEY,patientFallback:PATIENT_FALLBACK_KEY,pilotFeedback:PILOT_FEEDBACK_KEY},
  authorizeAction:(action,opts)=>SECURITY?.authorizeAction?.(action,opts)||Promise.resolve({ok:true,identity:null}),
  canWriteCurrent:()=>!restoreJournalNeedsReview()&&!startupPrimaryUnreadable&&sessionActive()&&SESSION_CONTROLLER.verifyOwnership()&&CASE_FRESHNESS.verify(),
  canRestoreWrite:()=>!startupPrimaryUnreadable&&sessionActive()&&SESSION_CONTROLLER.verifyOwnership(),
  restartAtAppRoot,renderArchives:()=>renderArchives(),hasMutableActiveCase:()=>versionReloadUnsafe(),getLegacyArchiveSeed,runClinicalValidation:(announce=false)=>runClinicalValidation({announce})
});
if(!BACKUP_RESTORE_CONTROLLER)throw new Error('ANESVET backup-restore-controller.js failed to load');
BACKUP_RESTORE_CONTROLLER.bind();
BOOT?.mark?.('backup-restore-bound');
BACKUP_RESTORE_CONTROLLER.installBridge();
function renderBackupHealth(){return BACKUP_RESTORE_CONTROLLER.renderBackupHealth()}
function backupAllData(options){return BACKUP_RESTORE_CONTROLLER.backupAllData(options)}
function getLastBackupEpoch(){return BACKUP_RESTORE_CONTROLLER.getLastBackupEpoch()}
function verifyBackupPayloadIntegrity(raw){return BACKUP_RESTORE_CONTROLLER.verifyBackupPayloadIntegrity(raw)}
function buildBackupPayload(){return BACKUP_RESTORE_CONTROLLER.buildBackupPayload()}
function downloadBackupPayload(payload){return BACKUP_RESTORE_CONTROLLER.downloadBackupPayload(payload)}
function applyRestorePayload(raw,options){return BACKUP_RESTORE_CONTROLLER.applyRestorePayload(raw,options)}
function rollbackLastRestore(){return BACKUP_RESTORE_CONTROLLER.rollbackLastRestore()}
function getPreRestoreSnapshot(){return BACKUP_RESTORE_CONTROLLER.getPreRestoreSnapshot()}
function clearPreRestoreSnapshot(){return BACKUP_RESTORE_CONTROLLER.clearPreRestoreSnapshot()}
function verifyAllArchiveIntegrity(progress){return BACKUP_RESTORE_CONTROLLER.verifyAllArchiveIntegrity(progress)}
function recoveryCopyStatus(){return BACKUP_RESTORE_CONTROLLER.recoveryCopyStatus()}

const FINALIZATION_ARCHIVE_CONTROLLER=window.ANESVET_FINALIZATION_ARCHIVE_CONTROLLER?.create?.({
  $,$$,escapeHtml,formatClock,formatDate,formatElapsed,fmtVol,toast,getState:()=>state,
  currentElapsed,getFluidMetrics,currentSettingsObject,clinicalWriteAllowed,setTab,pauseTimer,renderCasePhase,releaseScreenWakeLock,resetCurrent,
  save,addAudit,computeCaseChecksum,originalClinicalPayload,shortChecksum,makeHumanRecordId,clearSafetyCheckpoint,
  initArchiveDb,idbPutCase,idbDeleteCase,getArchiveBackend:()=>archiveBackend,getArchiveCache:()=>archiveCache,setArchiveCache:(rows)=>{archiveCache=rows||[]},
  getLegacyArchiveSeed,persistArchiveFallback:(rows)=>localStorage.setItem(ARCHIVE_KEY,JSON.stringify(rows||archiveCache)),renderStorageStatus,renderBackupHealth,
  backupAllData,exportPdfReport,exportPdfSummary,exportArchivedPdfSummary,exportArchivedPdf,
  replaceState:(next)=>{state=next},persistCurrentState:(next)=>{if(!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||!CASE_FRESHNESS.verify())return false;try{const payload=JSON.stringify(next);localStorage.setItem(CURRENT_KEY,payload);if(localStorage.getItem(CURRENT_KEY)!==payload)return false;CASE_FRESHNESS.committed(payload);queueCurrentMirror(payload);return true}catch(_){return false}},queueCurrentMirror,restartAtAppRoot,
  confirm:(msg)=>confirm(msg),prompt:(msg,def='')=>prompt(msg,def),
  securityEnabled:()=>!!SECURITY?.enabled?.(),authenticateForAction:(action,opts)=>SECURITY?.authenticateForAction?.(action,opts)
});
if(!FINALIZATION_ARCHIVE_CONTROLLER)throw new Error('ANESVET finalization-archive-controller.js failed to load');
FINALIZATION_ARCHIVE_CONTROLLER.bind();
BOOT?.mark?.('finalization-archive-bound');
function renderFinalSignoff(){return FINALIZATION_ARCHIVE_CONTROLLER.renderFinalSignoff()}
function renderEndCase(){return FINALIZATION_ARCHIVE_CONTROLLER.renderEndCase()}
// R20: bridge the controller-owned preference renderer used by startup loadSettings().
function renderDefaultReportPreference(){return FINALIZATION_ARCHIVE_CONTROLLER.renderDefaultReportPreference()}
function focusMedicationReconciliation(){return FINALIZATION_ARCHIVE_CONTROLLER.focusMedicationReconciliation()}
function archiveSnapshot(){return FINALIZATION_ARCHIVE_CONTROLLER.archiveSnapshot()}
function getArchive(){return FINALIZATION_ARCHIVE_CONTROLLER.getArchive()}
function verifyFinalArchive(caseObj=state){return FINALIZATION_ARCHIVE_CONTROLLER.verifyFinalArchive(caseObj)}
function retryFinalArchive(){return FINALIZATION_ARCHIVE_CONTROLLER.retryFinalArchive()}
function renderArchives(){const out=FINALIZATION_ARCHIVE_CONTROLLER.renderArchives();try{setTimeout(()=>document.dispatchEvent(new CustomEvent('anesvet:archive-changed',{detail:{count:getArchive().length}})),0)}catch(e){}return out}

function clearSafetyCheckpoint(){try{localStorage.removeItem(SAFETY_CHECKPOINT_KEY)}catch(e){}}
function readSafetyCheckpoint(){try{const cp=JSON.parse(localStorage.getItem(SAFETY_CHECKPOINT_KEY)||'null');if(!cp||cp.format!==SAFETY_CHECKPOINT_FORMAT||!cp.caseId||!cp.state||cp.state.caseId!==cp.caseId)return null;return cp}catch(e){return null}}
function writeSafetyCheckpoint(payload){if(state.caseLocked||!hasActiveCaseData()){clearSafetyCheckpoint();return true}try{const copy=JSON.parse(payload||JSON.stringify(state)),cp={format:SAFETY_CHECKPOINT_FORMAT,version:APP_VERSION,caseId:copy.caseId,lastSavedAt:Number(copy.lastSavedAt)||Date.now(),verifiedAt:Date.now(),patientName:copy.patientName||'',state:copy};localStorage.setItem(SAFETY_CHECKPOINT_KEY,JSON.stringify(cp));const verify=JSON.parse(localStorage.getItem(SAFETY_CHECKPOINT_KEY)||'null');if(!verify||verify.format!==SAFETY_CHECKPOINT_FORMAT||verify.caseId!==copy.caseId||Number(verify.lastSavedAt)!==Number(cp.lastSavedAt))throw new Error('Safety checkpoint verification failed');return true}catch(e){console.error('ANESVET safety checkpoint failed',e);return false}}
function recoverFromSafetyCheckpoint(raw,currentCorrupt=false){const cp=readSafetyCheckpoint();if(!cp)return raw;const c=cp.state;if(c.caseLocked||c.casePhase==='complete'||(!c.patientSaved&&!c.caseStartedAt&&!((c.records||[]).length||(c.events||[]).length||(c.drugAdministrations||[]).length)))return raw;const ct=caseActivityEpoch(c),rt=caseActivityEpoch(raw),same=!raw||raw.caseId===c.caseId;if(!(currentCorrupt||!raw||(same&&ct>rt+250)))return raw;const reason=currentCorrupt?'Current save was unreadable':'Safety checkpoint was newer than current save';startupRecoveryNotice={patientName:c.patientName||'Unnamed',savedAt:c.lastSavedAt||cp.verifiedAt,reason};const restored=JSON.parse(JSON.stringify(c));restored.auditTrail=Array.isArray(restored.auditTrail)?restored.auditTrail:[];restored.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),elapsedMs:restored.timer?.elapsedMs||0,action:'SAFETY_CHECKPOINT_RECOVERED',detail:reason,actor:'System'});const persisted=guardedStartupCurrentWrite(JSON.stringify(restored),'safety-checkpoint');if(!persisted){startupRecoveredOnlyInMemory=true;startupRecoveryNotice.reason+=' • Loaded in memory only; primary data preserved. Backup and review before saving.'}return restored}
function renderStartupRecoveryNotice(){const box=$('safetyRecoveryBanner');if(!box)return;if(!startupRecoveryNotice){box.hidden=true;return}box.hidden=false;if($('safetyRecoveryText'))$('safetyRecoveryText').textContent=`${startupRecoveryNotice.patientName} • ${startupRecoveryNotice.reason} • ${startupRecoveryNotice.savedAt?new Date(startupRecoveryNotice.savedAt).toLocaleString():''}`}

function loadFallbackPatients(){try{const p=JSON.parse(localStorage.getItem(PATIENT_FALLBACK_KEY)||'[]');return Array.isArray(p)?p:[]}catch(e){return[]}}
function saveFallbackPatients(){localStorage.setItem(PATIENT_FALLBACK_KEY,JSON.stringify(patientCache))}
function normalizePatientKey(v){return PATIENT_DOMAIN.normalizeKey(v)}
function patientFromCase(c){return PATIENT_DOMAIN.patientFromCase(c)}
function patientIdentityKey(p){return PATIENT_DOMAIN.patientIdentityKey(p)}
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

async function reconcileCurrentFromMirror(){
  // Only the active writer tab may reconcile shared current-case state.
  if(!sessionActive()||startupPrimaryUnreadable)return false;
  const rec=await idbGetMeta('current'),mirror=rec?.value;if(!mirror||typeof mirror!=='object')return false;
  let local=null;try{local=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null')}catch(e){}
  const mt=caseActivityEpoch(mirror),lt=caseActivityEpoch(local);
  const mirrorHasData=!!(mirror.patientSaved||mirror.timer?.running||(mirror.timer?.elapsedMs||0)>0||(mirror.records||[]).length||(mirror.events||[]).length||(mirror.complications||[]).length||(mirror.drugAdministrations||[]).length);
  if(!mirrorHasData)return false;
  const shouldOffer=!local||(mt>lt+250);if(!shouldOffer)return false;
  const stamp=mirror.lastSavedAt||mt||rec.updatedAt;
  const ok=confirm(`ANESVET found a newer current-case mirror in IndexedDB.\n\nPatient: ${mirror.patientName||'Unnamed'}\nLast saved: ${stamp?new Date(stamp).toLocaleString():'unknown'}\n\nRestore this newer clinical state?`);
  if(!ok)return false;
  // R15: an unreadable primary is forensic evidence. Never overwrite it with a
  // mirror, even after the operator accepts the restore prompt.
  if(startupPrimaryUnreadable||!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||!CASE_FRESHNESS.verify())return false;
  const payload=JSON.stringify(mirror);
  if(!guardedStartupCurrentWrite(payload,'indexeddb-mirror')){
    CASE_FRESHNESS.verify();
    BOOT?.mark?.('current-mirror-restore-write-failed');
    startupRecoveryNotice={patientName:mirror.patientName||'Unnamed',savedAt:stamp,reason:'IndexedDB restore could not be verified. The original saved case was preserved; check session ownership and storage before editing.'};
    return false;
  }
  CASE_FRESHNESS.committed(payload);
  return true;
}
function queueCurrentMirror(verifiedPayload){
  // R15: a mirror is a copy of the *verified local save*, never a snapshot of
  // still-uncommitted form edits in the in-memory state object.
  if(resetInProgress||typeof verifiedPayload!=='string')return false;
  let copy;try{copy=JSON.parse(verifiedPayload)}catch(_){return false}
  if(!copy||typeof copy!=='object'||!copy.caseId)return false;
  clearTimeout(currentMirrorTimer);
  currentMirrorTimer=setTimeout(()=>{currentMirrorTimer=null;
    if(resetInProgress||!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||!CASE_FRESHNESS.verify())return;
    // A newer local save (or a concurrent tab) invalidates this queued mirror.
    try{if(localStorage.getItem(CURRENT_KEY)!==verifiedPayload){CASE_FRESHNESS.verify();return}}catch(_){CASE_FRESHNESS.block('storage-unavailable');return}
    try{Promise.resolve(idbPutMeta('current',copy)).then(ok=>{if(ok===false)BOOT?.mark?.('current-mirror-write-failed')}).catch(_=>BOOT?.mark?.('current-mirror-write-failed'))}catch(_){BOOT?.mark?.('current-mirror-write-failed')}
  },180);
  return true;
}
function getLegacyArchiveSeed(){
  const keys=[ARCHIVE_KEY,'anesvet_v14_2_archive_legacy','anesvet_v14_1_archive_legacy','anesvet_v14_archive_legacy','anesvet_v13_4_archive','anesvet_v13_3_archive','anesvet_v13_2_archive','anesvet_v13_1_archive','anesvet_v13_archive','anesvet_v12_1_archive','anesvet_v12_archive','anesvet_v11_archive','anesvet_v10_archive','anesvet_v9_archive','anesvet_v8_archive','anesvet_v7_archive','anesvet_v6_1_archive','anesvet_v6_archive','anesvet_v5_archive','anesvet_v4_archive','anesvet_v3_archive'];
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

function syncCaptureAfterLocalSave(reason='manual'){
  try{return SYNC_FOUNDATION?.captureCaseSave?.(state,{reason})||null}catch(e){console.warn('ANESVET sync foundation capture skipped',e);return null}
}
function save({persistLocked=false,reason='manual'}={}){
  if(resetInProgress){cancelPendingPersistence();return false}
  if(restoreJournalNeedsReview()){renderSaveState('error');toast('Restore interruption must be reviewed before saving clinical data');return false}
  if(autosaveTimer){clearTimeout(autosaveTimer);autosaveTimer=null}
  if(!sessionActive()){renderSaveState('saved');return false}
  // R12: check ownership immediately before persisting, not just on heartbeat.
  if(!SESSION_CONTROLLER.verifyOwnership()){renderSessionMode();return false}
  if(!CASE_FRESHNESS.verify()){renderSaveState('error');return false}
  // Only the final-lock transaction may persist the sealed payload; never resample UI fields.
  if(state.caseLocked){
    if(!persistLocked){renderSaveState('saved');return false}
    try{const payload=JSON.stringify(state);localStorage.setItem(CURRENT_KEY,payload);if(localStorage.getItem(CURRENT_KEY)!==payload)throw new Error('Final save read-back failed');CASE_FRESHNESS.committed(payload);queueCurrentMirror(payload);renderSaveState('saved');syncCaptureAfterLocalSave(reason==='manual'?'final-lock':reason);return true}catch(e){renderSaveState('error');return false}
  }
  renderSaveState('saving');
  try{
    dataFields.forEach(id=>{
      const el=$(id);if(!el)return;
      if(id==='temp'||id==='recTemp'||id==='preopTemp') state[id]=el.value===''?'':(tempDisplayToStoredF(el.value)??'');
      else state[id]=el.type==='checkbox'?el.checked:el.value;
    });
    state.recoveryChecks=$$('.recovery-check').map(x=>x.checked);
    state.recoveryNA=$$('.recovery-check-na-btn').map(x=>x.classList.contains('active'));
    state.recoveryObservationNA={};$$('.recovery-observation-na-btn').forEach(x=>state.recoveryObservationNA[x.dataset.key]=x.classList.contains('active'));
    state.preopChecks={};$$('.preop-check').forEach(x=>state.preopChecks[x.dataset.key]=x.checked);
    state.preopNA={};$$('.preop-na-btn').forEach(x=>state.preopNA[x.dataset.key]=x.closest('.preop-item')?.classList.contains('na')||false);
    state.lastSavedAt=Date.now();
    const payload=JSON.stringify(state);
    localStorage.setItem(CURRENT_KEY,payload);
    const verify=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null');
    if(!verify||verify.caseId!==state.caseId||Number(verify.lastSavedAt)!==Number(state.lastSavedAt))throw new Error('Local save verification failed');
    CASE_FRESHNESS.committed(payload);
    queueCurrentMirror(payload);
    if(!writeSafetyCheckpoint(payload))throw new Error('Verified safety checkpoint failed');
    renderSaveState('saved');
    // Synchronization is strictly secondary: enqueue only after the verified local save/checkpoint succeeded.
    syncCaptureAfterLocalSave(reason);
    return true;
  }catch(e){console.error('ANESVET save failed',e);renderSaveState('error');return false}
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
  const ids=['temp','orTemp','recTemp','preopTemp'];
  if(convertInputs&&next!==prev){ids.forEach(id=>{const el=$(id);if(!el||el.value==='')return;const n=Number(el.value);if(!Number.isFinite(n))return;const storedF=prev==='C'?cToF(n):n;el.value=next==='C'?fToC(storedF).toFixed(1):Number(storedF).toFixed(1)});}
  activeTempDisplayUnit=next;
  ids.forEach(id=>{const el=$(id);if(!el)return;el.min=next==='C'?'25':'77';el.max=next==='C'?'45':'113';el.step='0.1'});
  if($('orTempUnit'))$('orTempUnit').textContent=tempSymbol();
  if($('tempUnitLabel'))$('tempUnitLabel').textContent=tempSymbol();
  if($('recTempUnitLabel'))$('recTempUnitLabel').textContent=tempSymbol();
  if($('preopTempUnitLabel'))$('preopTempUnitLabel').textContent=tempSymbol();
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
// R11: isolate each legacy key: one malformed JSON/denied read must not hide later snapshots.
// This function does not write, remove or overwrite any browser data.
function readLegacyCurrentCase(storage,migrateV3){
  const versions=[
    'anesvet_v14_2_current','anesvet_v14_1_current','anesvet_v14_current',
    'anesvet_v13_4_current','anesvet_v13_3_current','anesvet_v13_2_current',
    'anesvet_v13_1_current','anesvet_v13_current','anesvet_v12_1_current',
    'anesvet_v12_current','anesvet_v11_current','anesvet_v10_current',
    'anesvet_v9_current','anesvet_v8_current','anesvet_v7_current',
    'anesvet_v6_1_current','anesvet_v6_current','anesvet_v5_current',
    'anesvet_v4_current','anesvet_v3_current'
  ];
  for(const key of versions){
    let raw=null;
    try{raw=JSON.parse(storage.getItem(key)||'null')}catch(_){continue}
    if(!raw||typeof raw!=='object'||Array.isArray(raw))continue;
    let next;
    try{
      next=JSON.parse(JSON.stringify(raw));
      if(key==='anesvet_v3_current')next=migrateV3(next);
      else if(key==='anesvet_v9_current'){
        if(!Array.isArray(next.responses))next.responses=[];
        if(!Array.isArray(next.corrections))next.corrections=[];
        if(!next.casePhase)next.casePhase='intraop';
      }else if(key==='anesvet_v8_current'||key==='anesvet_v7_current'){
        if(!Array.isArray(next.responses))next.responses=[];
      }else if(key==='anesvet_v6_1_current'){
        if(!next.preopChecks)next.preopChecks={};
        if(!('caseStartedAt' in next))next.caseStartedAt=null;
      }else if(key==='anesvet_v5_current'||key==='anesvet_v4_current'){
        if(!('breed' in next))next.breed='';
        if(!('bcs' in next))next.bcs='5';
        next.patientSaved=!!next.patientName;
      }
      if(!next||typeof next!=='object'||Array.isArray(next))continue;
      return {caseData:next,sourceKey:key};
    }catch(_){continue}
  }
  return null;
}
function load(){
  try{
    let raw=null,currentCorrupt=false;
    try{startupPrimaryRaw=localStorage.getItem(CURRENT_KEY);raw=JSON.parse(startupPrimaryRaw||'null')}
    catch(e){currentCorrupt=true;startupPrimaryUnreadable=true;raw=null;startupRecoveryNotice={patientName:'Unknown',savedAt:0,reason:'Saved Current Case is unreadable or browser storage is unavailable. Original data was not overwritten. Verify/export a backup before attempting repair.'};BOOT?.mark?.('startup-current-unreadable')}
    raw=recoverFromSafetyCheckpoint(raw,currentCorrupt);
    if(!raw){
      const legacy=readLegacyCurrentCase(localStorage,migrateV3Case);
      if(legacy){
        raw=legacy.caseData;
        let persisted=false;
        // Preserve an unreadable primary case for forensic recovery and manual backup.
        // Never overwrite it automatically with a potentially older legacy record.
        if(!currentCorrupt)persisted=guardedStartupCurrentWrite(JSON.stringify(raw),'legacy-restore');
        if(currentCorrupt||!persisted){
          startupRecoveredOnlyInMemory=true;
          startupRecoveryNotice={patientName:raw.patientName||'Unnamed',savedAt:raw.lastSavedAt||0,
            reason:currentCorrupt?'Current save unreadable; previous-version case loaded in memory only. Backup and review before saving.':'Previous-version case loaded in memory only (VIEW ONLY, newer revision, or storage error). Export/verify a backup and reload with write control before continuing.'};
          BOOT?.mark?.('legacy-current-restore-not-persisted',currentCorrupt?'primary-corrupt':'storage-write-failed');
        }else{
          BOOT?.mark?.('legacy-current-restored',legacy.sourceKey);
        }
      }
    }
    if(raw && typeof raw==='object') state=raw.caseLocked?raw:{...state,...raw};if(!Array.isArray(state.fluidRateHistory))state.fluidRateHistory=[];
    if(!Array.isArray(state.corrections))state.corrections=[];
    if(!Array.isArray(state.complications))state.complications=[];
    if(!Array.isArray(state.drugAdministrations))state.drugAdministrations=[];
    if(!Array.isArray(state.alertEpisodes))state.alertEpisodes=[];
    if(!Array.isArray(state.recoveryScores))state.recoveryScores=[];
    if(!Array.isArray(state.recoveryTransfers))state.recoveryTransfers=[];
    if(!state.casePhase){
      if(state.caseLocked)state.casePhase='complete';
      else if(state.recoveryCompletedAt)state.casePhase='complete';
      else if(state.recoveryStartedAt)state.casePhase='recovery';
      else if(state.caseStartedAt)state.casePhase='intraop';
      else state.casePhase='setup';
    }
    // V17.2.3: repair contradictory active-case runtime metadata carried across PWA updates.
    // Example: caseStartedAt exists but casePhase remained 'setup'. Do not mark setup saved.
    const activeCaseRepair=ACTIVE_CASE_RESCUE.normalizeState(state,{mutate:true});
    if(activeCaseRepair.changed){
      if(!Array.isArray(state.auditTrail))state.auditTrail=[];
      state.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),elapsedMs:Number(state.timer?.elapsedMs)||0,action:'ACTIVE_CASE_RUNTIME_STATE_REPAIRED',detail:activeCaseRepair.changes.join(' • '),actor:'System'});
      if(!guardedStartupCurrentWrite(JSON.stringify(state),'runtime-metadata-repair')){
        startupRecoveredOnlyInMemory=true;
        if(!startupRecoveryNotice)startupRecoveryNotice={patientName:state.patientName||'Unnamed',savedAt:state.lastSavedAt||0,reason:'Runtime metadata repaired in memory only; original saved data preserved. Review before saving.'};
      }
    }
    if(!('caseLocked' in state))state.caseLocked=false;
    if(!('simulationMode' in state))state.simulationMode=false;
    if(!('simulationScenario' in state))state.simulationScenario='';
    if(!('simulationLabel' in state))state.simulationLabel='';
    if(!('simulationStartedAt' in state))state.simulationStartedAt=null;
    if(!('simulationVersion' in state))state.simulationVersion='';
    if(!Array.isArray(state.recoveryRecords))state.recoveryRecords=[];
    if(!Array.isArray(state.recoveryNA))state.recoveryNA=[false,false,false,false,false,false];
    if(!state.recoveryObservationNA||typeof state.recoveryObservationNA!=='object')state.recoveryObservationNA={spo2:false,temp:false,extubation:false};
    if(!('emergencyReturnActive' in state))state.emergencyReturnActive=false;
    if(!('surgeryEndedAt' in state))state.surgeryEndedAt=null;
    if(!('recoveryCompletionOverride' in state))state.recoveryCompletionOverride=null;
    if(!('extubatedAt' in state))state.extubatedAt=null;
    if(!Array.isArray(state.auditTrail))state.auditTrail=[];
    if(!Array.isArray(state.amendments))state.amendments=[];
    if(!state.humanRecordId)state.humanRecordId=makeHumanRecordId(state.createdAt||Date.now());
    if(!state.finalSignoff)state.finalSignoff={anesthetist:null,surgeon:null};
    if(!('finalChecksum' in state))state.finalChecksum=null;
    if(!('voidedAt' in state))state.voidedAt=null;
    if(!('protocolSnapshot' in state))state.protocolSnapshot=null;
    if(!Array.isArray(state.caseDrugPlan))state.caseDrugPlan=[];
    if(!('caseDrugPlanInitialized' in state))state.caseDrugPlanInitialized=state.caseDrugPlan.length>0;
    if(!('caseDrugPlanReviewedAt' in state))state.caseDrugPlanReviewedAt=null;
    if(!('caseDrugPlanReviewedBy' in state))state.caseDrugPlanReviewedBy='';
    if(!(state.caseLocked&&state.finalChecksum)&&(!state.medicationReconciliation||typeof state.medicationReconciliation!=='object'))state.medicationReconciliation={version:1,decisions:{}};
    if(!('preOrReadinessOverride' in state))state.preOrReadinessOverride=null;
    if(!('preOrBriefingReview' in state))state.preOrBriefingReview=null;
    if(!('visitId' in state))state.visitId='';
    if(!('caseIdentitySnapshot' in state))state.caseIdentitySnapshot=null;
    if(state.caseStartedAt&&!state.caseIdentitySnapshot)state.caseIdentitySnapshot={patientMasterId:state.patientMasterId||'',patientName:state.patientName||'',hospitalId:state.hospitalId||'',visitId:state.visitId||'',species:state.species||'',microchip:state.microchip||'',weight:Number(state.weight)||null,capturedAt:state.caseStartedAt,legacyBootstrap:true};
    if(!state.caseWorkflowProfile)state.caseWorkflowProfile='routine';
    if(!state.procedureTemplateId){
      const inferredTemplate=PROCEDURE_TEMPLATES.resolve('',state.patientProcedure||state.procedure||'',state.caseWorkflowProfile);
      state.procedureTemplateId=inferredTemplate.id||'custom';
    }
    if(!('procedureTemplateSnapshot' in state))state.procedureTemplateSnapshot=null;
    if(!('preopExamRecordedAt' in state))state.preopExamRecordedAt=null;
    if(!('preopExamRecordedBy' in state))state.preopExamRecordedBy='';
    if(!('preopRiskRecordedAt' in state))state.preopRiskRecordedAt=null;
    if(!('preopRiskRecordedBy' in state))state.preopRiskRecordedBy='';
    if(!state.caseStartedAt && !(state.timer?.elapsedMs>0) && !state.recoveryStartedAt && !state.recoveryCompletedAt && !state.caseLocked)state.casePhase='setup';
  }catch(e){}
  dataFields.forEach(id=>{
    const el=$(id);if(!el || !(id in state)) return;
    if(el.type==='checkbox') el.checked=!!state[id]; else el.value=state[id] ?? '';
  });
  renderProcedureTemplatePicker();
  $$('.recovery-check').forEach((el,i)=>el.checked=!!(state.recoveryChecks||[])[i]);
  $$('.recovery-check-na-btn').forEach((btn,i)=>{const na=!!(state.recoveryNA||[])[i];btn.classList.toggle('active',na);const cb=$$('.recovery-check')[i];if(cb){cb.disabled=na;if(na)cb.checked=false}});
  $$('.recovery-observation-na-btn').forEach(btn=>{const na=!!(state.recoveryObservationNA||{})[btn.dataset.key];btn.classList.toggle('active',na);const input=btn.closest('.recovery-field-na')?.querySelector('input');if(input){input.disabled=na;if(na)input.value=''}});
  $$('.preop-check').forEach(el=>el.checked=!!(state.preopChecks||{})[el.dataset.key]);
  $$('.preop-na-btn').forEach(btn=>{const na=!!(state.preopNA||{})[btn.dataset.key];btn.closest('.preop-item')?.classList.toggle('na',na);if(na){const cb=btn.closest('.preop-item')?.querySelector('.preop-check');if(cb)cb.checked=false;}});
  if(state.timer.running && state.timer.startedEpoch && sessionActive()) startTimerLoop();
initArchiveDb();
if(sessionActive()&&(state.timer.running||state.casePhase==='recovery')&&autoWakeEnabled())requestScreenWakeLock(true);
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
  renderBreedSuggestions();state.patientSaved=false;updatePatientSaveStatus();updateDashboard({persist:false});renderDoseReferenceChips();renderDrugLibrarySettings();for(const phase of ['induction','pre','post'])updateCustomDrugCalc(phase,false);
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


const PATIENT_MASTER_CONTROLLER=window.ANESVET_PATIENT_MASTER_CONTROLLER?.create?.({
  $,$$,escapeHtml,formatDate,toast,
  patientDomain:PATIENT_DOMAIN,
  patientOrchestration:PATIENT_MASTER_ORCH,
  getState:()=>state,
  getPatientCache:()=>patientCache,
  setPatientCache:(rows)=>{patientCache=Array.isArray(rows)?rows:[]},
  getPatientBackend:()=>patientBackend,
  setPatientBackend:(value)=>{patientBackend=value},
  idbPutPatient:(patient)=>idbPutPatient(patient),
  saveFallbackPatients:()=>saveFallbackPatients(),
  getArchive:()=>getArchive(),
  setTab:(id)=>setTab(id),
  renderArchives:()=>renderArchives(),
  dateFromIso:(value)=>dateFromIso(value),
  agePartsFromDob:(value)=>agePartsFromDob(value),
  formatAgeThai:(parts,estimated)=>formatAgeThai(parts,estimated),
  renderAgeUI:()=>renderAgeUI(),
  updateDashboard:(options)=>updateDashboard(options),
  invalidatePreOrOverride:()=>invalidatePreOrOverride(),
  loadSettings:()=>loadSettings(),
  fmtDose:(value)=>fmtDose(value),
  tempTextF:(value)=>tempTextF(value),
  preopRiskSummaryLabels:(options)=>preopRiskSummaryLabels(options)
});
if(!PATIENT_MASTER_CONTROLLER)throw new Error('ANESVET patient-master-controller.js failed to load');
PATIENT_MASTER_CONTROLLER.bind();
BOOT?.mark?.('patient-master-bound');
const renderLinkedPatient=()=>PATIENT_MASTER_CONTROLLER.renderLinkedPatient();
const renderPatientMaster=()=>PATIENT_MASTER_CONTROLLER.renderPatientMaster();
const upsertPatientMasterFromCurrent=()=>PATIENT_MASTER_CONTROLLER.upsertPatientMasterFromCurrent();
const syncAsaCards=()=>PATIENT_MASTER_CONTROLLER.syncAsaCards();
const updatePatientSaveStatus=()=>PATIENT_MASTER_CONTROLLER.updatePatientSaveStatus();
const renderPatientRiskBanner=()=>PATIENT_MASTER_CONTROLLER.renderPatientRiskBanner();

function procedureTemplateProcedureText(){return $('patientProcedure')?.value?.trim()||state.patientProcedure||state.procedure||''}
function activeProcedureTemplate(){
  if(state.caseStartedAt&&state.procedureTemplateSnapshot?.id){
    const base=PROCEDURE_TEMPLATES.get(state.procedureTemplateSnapshot.id);
    return {...base,...state.procedureTemplateSnapshot,milestones:[...(state.procedureTemplateSnapshot.milestones||base.milestones||[])],extraMilestones:[...(state.procedureTemplateSnapshot.extraMilestones||base.extraMilestones||[])],quickEvents:WF.clone(state.procedureTemplateSnapshot.quickEvents||base.quickEvents||[]),quickDrugRefs:WF.clone(state.procedureTemplateSnapshot.quickDrugRefs||base.quickDrugRefs||[])};
  }
  return PROCEDURE_TEMPLATES.resolve(state.procedureTemplateId||$('procedureTemplateId')?.value||'custom',procedureTemplateProcedureText(),state.caseWorkflowProfile||$('caseWorkflowProfile')?.value||'routine');
}
function procedureTemplatePathText(t){
  const core=(t?.milestones||[]).filter(Boolean),extra=(t?.extraMilestones||[]).filter(Boolean),items=[...core,...extra];
  return items.length?items.join(' → '):'Induction → Intubation → Surgery start → Surgery end → Extubation → Recovery';
}
function procedureTemplateButtonHtml(x){return `<button type="button" class="procedure-template-btn ${x.source==='hospital'?'hospital':''}" data-procedure-template="${escapeHtml(x.id)}"><span>${escapeHtml(x.label)}</span>${x.source==='hospital'?'<small class="procedure-template-source">HOSPITAL</small>':''}</button>`}
function renderProcedureTemplatePicker(){
  const grid=$('procedureTemplateGrid');if(!grid)return;
  const frozen=!!(state.caseStartedAt||state.caseLocked),t=activeProcedureTemplate(),selected=t?.id||'custom',all=PROCEDURE_TEMPLATES.list(),built=all.filter(x=>x.source!=='hospital'),hospital=all.filter(x=>x.source==='hospital');
  grid.innerHTML=`<div class="procedure-template-group-label">Built-in</div>${built.map(procedureTemplateButtonHtml).join('')}${hospital.length?`<div class="procedure-template-group-label">Hospital</div>${hospital.map(procedureTemplateButtonHtml).join('')}`:''}`;
  grid.querySelectorAll('[data-procedure-template]').forEach(b=>{b.addEventListener('click',()=>applyProcedureTemplate(b.dataset.procedureTemplate));b.classList.toggle('selected',b.dataset.procedureTemplate===selected);b.disabled=frozen;b.setAttribute('aria-pressed',String(b.dataset.procedureTemplate===selected));});
  if(!frozen&&state.procedureTemplateId!==selected){state.procedureTemplateId=selected}
  const hidden=$('procedureTemplateId');if(hidden&&!frozen)hidden.value=state.procedureTemplateId||selected;
  if($('procedureTemplateLock'))$('procedureTemplateLock').hidden=!frozen;
  if($('procedureTemplateName'))$('procedureTemplateName').textContent=t?.label||'Custom / other';
  if($('procedureTemplateFocus'))$('procedureTemplateFocus').textContent=t?.focus||'Clinician-defined procedure';
  if($('procedureTemplateMilestones'))$('procedureTemplateMilestones').textContent=procedureTemplatePathText(t);
  if($('procedureTemplateNote')){
    const bits=[t?.note||'Template changes documentation layout only.'];
    if(t?.chartingIntervalMin)bits.push(`Charting reminder ${t.chartingIntervalMin} min`);
    if((t?.quickEvents||[]).length)bits.push(`${t.quickEvents.length} quick event${t.quickEvents.length===1?'':'s'}`);
    if((t?.quickDrugRefs||[]).length)bits.push(`${t.quickDrugRefs.length} medication shortcut${t.quickDrugRefs.length===1?'':'s'}`);
    $('procedureTemplateNote').textContent=bits.join(' • ');
  }
  const profile=$('caseWorkflowProfile'),recommended=t?.recommendedWorkflowProfile||t?.workflowProfile||'custom',actual=(frozen&&state.procedureTemplateSnapshot?.workflowProfile)||profile?.value||state.caseWorkflowProfile||'routine',override=actual!==recommended;
  if(profile){profile.disabled=frozen;profile.classList.toggle('template-override',override);}
  if($('caseWorkflowProfileHint'))$('caseWorkflowProfileHint').textContent=frozen?`Frozen with active case • ${t?.label||'Template'} • Workflow ${actual}`:override?`Workflow override: ${actual} • template แนะนำ ${recommended} • ไม่มีผลต่อ dose/threshold`:`Template ตั้ง workflow เป็น ${recommended} • เปลี่ยนเองได้ก่อนเริ่ม induction • ไม่มีผลต่อ dose/threshold`;
}
function applyProcedureTemplate(id){
  if(state.caseStartedAt||state.caseLocked){toast('Procedure template ถูก freeze แล้วหลังเริ่มเคส');renderProcedureTemplatePicker();return false}
  const t=PROCEDURE_TEMPLATES.get(id);state.procedureTemplateId=t.id;
  if($('procedureTemplateId'))$('procedureTemplateId').value=t.id;
  if(t.defaultProcedure&&t.id!=='custom'){$('patientProcedure').value=t.defaultProcedure;syncPatientProcedureToCase();}
  if($('caseWorkflowProfile'))$('caseWorkflowProfile').value=t.workflowProfile||'custom';state.caseWorkflowProfile=t.workflowProfile||'custom';
  if(t.chartingIntervalMin&&$('recordInterval')){$('recordInterval').value=String(t.chartingIntervalMin);state.recordInterval=String(t.chartingIntervalMin)}
  state.patientSaved=false;invalidatePreOrOverride();updatePatientSaveStatus();renderProcedureTemplatePicker();updateDashboard({persist:false});save({reason:'procedure-template'});renderWorkflowContext();renderOrPrimaryFlow();renderCaseSummary();renderTemplateQuickActions();
  toast(`${t.label} template selected${t.chartingIntervalMin?` • charting reminder ${t.chartingIntervalMin} min`:''}`);return true;
}
function procedureTemplateEditorFill(t,{newCopy=false}={}){
  const hospital=t?.source==='hospital'&&!newCopy;
  $('procedureTemplateEditId').value=hospital?t.id:'';
  $('procedureTemplateEditLabel').value=newCopy?`${t?.label||'New template'} — Hospital`:(hospital?t.label:'');
  $('procedureTemplateEditBadge').value=t?.badge||'';
  $('procedureTemplateEditProcedure').value=t?.defaultProcedure||'';
  $('procedureTemplateEditWorkflow').value=t?.workflowProfile||'routine';
  $('procedureTemplateEditInterval').value=t?.chartingIntervalMin?String(t.chartingIntervalMin):'';
  $('procedureTemplateEditFocus').value=t?.focus||'';
  $('procedureTemplateEditMilestones').value=(t?.extraMilestones||[]).join('\n');
  $('procedureTemplateEditEvents').value=(t?.quickEvents||[]).map(x=>`${x.category||'Procedure'} | ${x.label||''}`).join('\n');
  $('procedureTemplateEditDrugs').value=(t?.quickDrugRefs||[]).map(x=>x.name||x.id||'').filter(Boolean).join('\n');
  $('procedureTemplateEditFluidNote').value=t?.fluidSetupNote||'';
  $('procedureTemplateEditProcedureNote').value=t?.procedureNote||'';
  $('procedureTemplateEditNote').value=t?.note||'';
  $('procedureTemplateDeleteBtn').disabled=!hospital;
  $('procedureTemplateManagerError').textContent='';
  $('procedureTemplateManagerStatus').textContent=hospital?`Editing hospital template • ${t.label}`:newCopy?`New hospital copy based on ${t?.label||'current template'} • built-in source remains unchanged`:'New hospital template';
}
function renderProcedureTemplateManagerSelect(selected=''){
  const sel=$('procedureTemplateManagerSelect');if(!sel)return;const rows=PROCEDURE_TEMPLATES.listHospital();sel.innerHTML='<option value="">— New hospital template —</option>'+rows.map(t=>`<option value="${escapeHtml(t.id)}">${escapeHtml(t.label)}</option>`).join('');sel.value=rows.some(x=>x.id===selected)?selected:'';
}
function openProcedureTemplateManager({newTemplate=false}={}){
  const dlg=$('procedureTemplateManagerDialog');if(!dlg)return;
  const current=activeProcedureTemplate();renderProcedureTemplateManagerSelect(current?.source==='hospital'&&!newTemplate?current.id:'');
  if(newTemplate)procedureTemplateEditorFill(PROCEDURE_TEMPLATES.get('custom'),{newCopy:false});
  else if(current?.source==='hospital')procedureTemplateEditorFill(current);
  else procedureTemplateEditorFill(current||PROCEDURE_TEMPLATES.get('custom'),{newCopy:true});
  try{if(!dlg.open)dlg.showModal()}catch(e){dlg.setAttribute('open','')}
}
function closeProcedureTemplateManager(){const d=$('procedureTemplateManagerDialog');if(d?.open){try{d.close()}catch(e){d.removeAttribute('open')}}}
function procedureTemplateEditorPayload(){
  const events=$('procedureTemplateEditEvents').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean).map(line=>{const p=line.split('|');return p.length>1?{category:p.shift().trim()||'Procedure',label:p.join('|').trim()}:{category:'Procedure',label:line}});
  return {id:$('procedureTemplateEditId').value||'',label:$('procedureTemplateEditLabel').value.trim(),badge:$('procedureTemplateEditBadge').value.trim(),defaultProcedure:$('procedureTemplateEditProcedure').value.trim(),workflowProfile:$('procedureTemplateEditWorkflow').value,chartingIntervalMin:$('procedureTemplateEditInterval').value||null,focus:$('procedureTemplateEditFocus').value.trim(),extraMilestones:$('procedureTemplateEditMilestones').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean),quickEvents:events,quickDrugRefs:$('procedureTemplateEditDrugs').value.split(/\r?\n|,/).map(x=>x.trim()).filter(Boolean).map(name=>({name})),fluidSetupNote:$('procedureTemplateEditFluidNote').value.trim(),procedureNote:$('procedureTemplateEditProcedureNote').value.trim(),note:$('procedureTemplateEditNote').value.trim(),source:'hospital'};
}
function saveHospitalProcedureTemplate(){
  try{const saved=PROCEDURE_TEMPLATES.saveHospital(procedureTemplateEditorPayload());renderProcedureTemplateManagerSelect(saved.id);procedureTemplateEditorFill(saved);renderProcedureTemplatePicker();if(!(state.caseStartedAt||state.caseLocked))applyProcedureTemplate(saved.id);$('procedureTemplateManagerStatus').textContent=`Saved locally • ${saved.label} • included in Full Backup`;toast('Hospital procedure template saved');return saved}catch(e){$('procedureTemplateManagerError').textContent=e?.message||'Unable to save template';return null}
}
function deleteHospitalProcedureTemplate(){
  const id=$('procedureTemplateEditId').value;if(!id)return;if(!confirm('Delete this hospital procedure template? Existing active/archived case snapshots are not changed.'))return;
  if(PROCEDURE_TEMPLATES.deleteHospital(id)){if(!state.caseStartedAt&&state.procedureTemplateId===id){state.procedureTemplateId='custom';$('procedureTemplateId').value='custom'}renderProcedureTemplateManagerSelect();procedureTemplateEditorFill(PROCEDURE_TEMPLATES.get('custom'));renderProcedureTemplatePicker();save({reason:'procedure-template-library-delete'});toast('Hospital procedure template deleted')}
}
$('manageProcedureTemplatesBtn')?.addEventListener('click',()=>openProcedureTemplateManager());
$('newHospitalProcedureTemplateBtn')?.addEventListener('click',()=>openProcedureTemplateManager({newTemplate:true}));
$('procedureTemplateManagerCloseTop')?.addEventListener('click',closeProcedureTemplateManager);
$('procedureTemplateManagerDialog')?.addEventListener('click',e=>{if(e.target===$('procedureTemplateManagerDialog'))closeProcedureTemplateManager()});
$('procedureTemplateManagerSelect')?.addEventListener('change',e=>{const id=e.target.value;procedureTemplateEditorFill(id?PROCEDURE_TEMPLATES.get(id):PROCEDURE_TEMPLATES.get('custom'))});
$('procedureTemplateManagerNewBtn')?.addEventListener('click',()=>{renderProcedureTemplateManagerSelect();procedureTemplateEditorFill(PROCEDURE_TEMPLATES.get('custom'))});
$('procedureTemplateManagerDuplicateBtn')?.addEventListener('click',()=>procedureTemplateEditorFill(activeProcedureTemplate()||PROCEDURE_TEMPLATES.get('custom'),{newCopy:true}));
$('procedureTemplateSaveBtn')?.addEventListener('click',saveHospitalProcedureTemplate);
$('procedureTemplateDeleteBtn')?.addEventListener('click',deleteHospitalProcedureTemplate);
$('procedureTemplateExportBtn')?.addEventListener('click',()=>{const payload=PROCEDURE_TEMPLATES.exportHospital();downloadBlob(JSON.stringify(payload,null,2),'application/json',`ANESVET_PROCEDURE_TEMPLATES_${formatDate(Date.now())}.json`);toast(`Exported ${payload.templates.length} hospital template${payload.templates.length===1?'':'s'}`)});
$('procedureTemplateImportBtn')?.addEventListener('click',()=>$('procedureTemplateImportInput')?.click());
$('procedureTemplateImportInput')?.addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const raw=JSON.parse(await file.text()),result=PROCEDURE_TEMPLATES.importHospital(raw,{merge:true});renderProcedureTemplateManagerSelect();renderProcedureTemplatePicker();$('procedureTemplateManagerStatus').textContent=`Imported ${result.imported} • library now ${result.total} template${result.total===1?'':'s'}`;toast('Procedure template library imported')}catch(err){$('procedureTemplateManagerError').textContent=err?.message||'Import failed'}finally{e.target.value=''}});

function syncPatientProcedureToCase(){
  const v=$('patientProcedure')?.value??'';
  if($('procedure') && $('procedure').value!==v) $('procedure').value=v;
}
function syncCaseProcedureToPatient(){
  const v=$('procedure')?.value??'';
  if($('patientProcedure') && $('patientProcedure').value!==v) $('patientProcedure').value=v;
}
$('patientProcedure')?.addEventListener('input',()=>{syncPatientProcedureToCase();state.patientSaved=false;updatePatientSaveStatus();renderProcedureTemplatePicker();updateDashboard({persist:false})});
// R09: the secondary Procedure editor updates Patient Setup too. An unsaved
// procedure change must invalidate the prior Patient Save and any pre-OR override.
$('procedure')?.addEventListener('input',()=>{
  syncCaseProcedureToPatient();
  state.patientSaved=false;
  invalidatePreOrOverride();
  updatePatientSaveStatus();
  updateDashboard({persist:false});
});

function currentCaseIdentityFromForm(){return {patientMasterId:$('patientMasterId')?.value||state.patientMasterId||'',patientName:$('patientName')?.value.trim()||'',hospitalId:$('hospitalId')?.value.trim()||'',visitId:$('visitId')?.value.trim()||'',species:$('species')?.value||'',microchip:$('microchip')?.value.trim()||'',weight:Number($('weight')?.value)||null}}
function caseIdentityChanges(next){const base=state.caseIdentitySnapshot;if(!state.caseStartedAt||!base)return [];const labels={patientMasterId:'Patient link',patientName:'Patient name',hospitalId:'HN',visitId:'Visit ID',species:'Species',microchip:'Microchip',weight:'Current BW'};return Object.keys(labels).flatMap(k=>{const a=k==='weight'?Number(base[k]):String(base[k]??''),b=k==='weight'?Number(next[k]):String(next[k]??'');const same=k==='weight'?(Number.isFinite(a)&&Number.isFinite(b)?Math.abs(a-b)<1e-9:a===b):a===b;return same?[]:[`${labels[k]}: ${base[k]??'—'} → ${next[k]??'—'}`]})}
$('savePatientBtn').addEventListener('click',async()=>{
  renderAgeUI();
  const name=$('patientName').value.trim(),species=$('species')?.value||'',weight=Number($('weight').value);
  if(!name){toast('กรุณาใส่ชื่อสัตว์');$('patientName').focus();return}
  if(!species){toast('กรุณาเลือก Species');$('species')?.focus();return}
  if(!Number.isFinite(weight)||weight<=0){toast('กรุณาใส่น้ำหนักที่ถูกต้อง');$('weight').focus();return}
  const identityNext=currentCaseIdentityFromForm(),identityDiff=caseIdentityChanges(identityNext);let identityCorrection=null;
  if(identityDiff.length){const reason=prompt(`⚠ Active case identity / BW change\n\n${identityDiff.join('\n')}\n\nReason for correction (required):`,'');if(!reason?.trim()){toast('Identity/BW correction cancelled');return}const actor=prompt('Corrected by',$('anesthetist')?.value.trim()||'');if(!actor?.trim())return;if(!confirm(`Apply correction to active case?\n\n${identityDiff.join('\n')}\n\nReason: ${reason.trim()}\nBy: ${actor.trim()}`))return;identityCorrection={reason:reason.trim(),actor:actor.trim(),changes:identityDiff}}
  syncPatientProcedureToCase();state.procedureTemplateId=$('procedureTemplateId')?.value||state.procedureTemplateId||'custom';state.caseWorkflowProfile=$('caseWorkflowProfile')?.value||state.caseWorkflowProfile||'routine';
  if(!state.simulationMode){const master=await upsertPatientMasterFromCurrent();if(master===false)return}else{state.patientMasterId='';if($('patientMasterId'))$('patientMasterId').value=''}
  state.patientSaved=true;
  if(identityCorrection){state.caseIdentitySnapshot={...identityNext,capturedAt:Date.now()};addAudit('CASE_IDENTITY_BW_CORRECTED',`${identityCorrection.changes.join(' • ')} • Reason: ${identityCorrection.reason}`,identityCorrection.actor)}
  save();syncAsaCards();updatePatientSaveStatus();
  // V14.6.4: current-weight dependent UI was calculated while patientSaved=false during typing.
  // Recalculate immediately after Save so a NEW patient's confirmed BW propagates to Drug/Fluid/Plan views
  // without requiring a reload, another field edit, or re-selecting the patient.
  updateDashboard();
  toast(state.simulationMode?'Simulation: บันทึก Demo Case Setup แล้ว • ไม่สร้าง Patient Master':'บันทึก Patient Master + Case Setup แล้ว');renderWorkflowLocks();setTab('preop');
});
$('editPatientBtn').addEventListener('click',()=>setTab('patient'));
['patientName','hospitalId','visitId','species','sex','reproductiveStatus','microchip','breed','birthDate','approxAgeYears','approxAgeMonths','approxAgeWeeks','weight','bcs','emergency','patientProcedure','patientAllergies','patientComorbidities','patientPrecautions','caseWorkflowProfile','surgeon','anesthetist','surgicalAssistant'].forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',()=>{
    state.patientSaved=false;invalidatePreOrOverride();updatePatientSaveStatus();
  });
});

$('caseWorkflowProfile')?.addEventListener('change',()=>{
  if(state.caseStartedAt||state.caseLocked){const frozen=state.procedureTemplateSnapshot?.workflowProfile||state.caseWorkflowProfile||'routine';$('caseWorkflowProfile').value=frozen;toast('Workflow profile ถูก freeze แล้วหลังเริ่มเคส');renderProcedureTemplatePicker();return}
  state.caseWorkflowProfile=$('caseWorkflowProfile').value||'routine';
  state.patientSaved=false;updatePatientSaveStatus();save();renderProcedureTemplatePicker();renderWorkflowContext();renderOrPrimaryFlow();renderCaseSummary();
});

const PREOP_CONTROLLER=window.ANESVET_PREOP_CONTROLLER?.create?.({
  $,$$,escapeHtml,formatDate,formatClock,toast,
  getState:()=>state,
  clinicalWriteAllowed:()=>clinicalWriteAllowed(),
  invalidatePreOrOverride:()=>invalidatePreOrOverride(),
  save:(options)=>save(options),
  addAudit:(action,detail,actor)=>addAudit(action,detail,actor),
  tempTextF:(value)=>tempTextF(value),
  renderCaseSummary:()=>renderCaseSummary(),
  renderOrLive:()=>renderOrLive(),
  renderPatientRiskBanner:()=>renderPatientRiskBanner(),
  renderWorkflowLocks:()=>renderWorkflowLocks(),
  setTab:(id)=>setTab(id)
});
if(!PREOP_CONTROLLER)throw new Error('ANESVET preop-controller.js failed to load');
PREOP_CONTROLLER.bind();
BOOT?.mark?.('preop-bound');
const renderPreopExam=()=>PREOP_CONTROLLER.renderPreopExam();
const preopExamReportHtml=()=>PREOP_CONTROLLER.preopExamReportHtml();
const preopRiskSummaryLabels=(options)=>PREOP_CONTROLLER.preopRiskSummaryLabels(options);
const renderPreopRisk=()=>PREOP_CONTROLLER.renderPreopRisk();
const riskAssessmentReportHtml=()=>PREOP_CONTROLLER.riskAssessmentReportHtml();
const renderPreop=()=>PREOP_CONTROLLER.renderPreop();

const OR_SYNC={orHr:'hr',orRr:'rr',orSap:'sap',orMap:'map',orDap:'dap',orSpo2:'spo2',orEtco2:'etco2',orTemp:'temp',orVaporizer:'vaporizer',orO2:'o2flow',orFluidRate:'fluidRateInput',orDepth:'depth',orVentilation:'ventilation'};
let MEDICATION_WORKSPACE_CONTROLLER=null;
let wakeLock=null;
const OR_LIVE_CONTROLLER=window.ANESVET_OR_LIVE_CONTROLLER?.create?.({
  $,$$,escapeHtml,formatClock,formatElapsed,formatShortElapsed,pad,toast,getState:()=>state,
  orSync:OR_SYNC,workflow:globalThis.AnesvetWorkflow,procedureTemplates:PROCEDURE_TEMPLATES,getTempDisplayUnit:()=>activeTempDisplayUnit,tempStoredFToDisplay,tempTextF,
  currentElapsed,clinicalWriteAllowed,save,scheduleAutosave,addAudit,addEvent,addRecord,setTab,maybeShowCriticalClinicalAlert,
  activeProcedureTemplate,frozenQuickDrugs,openOrQuickDrug,caseDrugPlanPhaseLabel,fmtDose,renderProcedureTimeline,renderProcedureTemplatePicker,renderEvents,
  renderOrPhaseTracker,thresholds,getVal,phaseLabel,phaseClass,preopRiskSummaryLabels,latestRecord,vitalRecordSummary,renderOrVitalChangeState,renderOrQuickMedStrip,
  alertThresholdHint,withAlertAdvice,getSmartAlerts,renderOrFluidPanel,renderSaveState,renderRecoveryState,renderComplications,renderAlertProtocolStatus,renderActiveProblems,
  validateCaseReadyToStart,confirmCaseDrugPlanBeforeStart,captureProtocolSnapshot,startTimerLoop,clearTimerLoop:()=>clearInterval(timerHandle),renderTimerState,renderCasePhase,
  autoWakeEnabled,requestScreenWakeLock,pauseTimer,currentSettingsObject,fillBlankVitalsFromLast,markMilestone,openComplicationDialog,renderRecovery,beginRecovery,
  confirm:(msg)=>confirm(msg)
});
if(!OR_LIVE_CONTROLLER)throw new Error('ANESVET or-live-controller.js failed to load');
OR_LIVE_CONTROLLER.bind();
BOOT?.mark?.('or-live-bound');
function syncOrFromMain(){return OR_LIVE_CONTROLLER.syncOrFromMain()}
function workflowProfileInfo(){return OR_LIVE_CONTROLLER.workflowProfileInfo()}
function activeWorkflowProfile(){return OR_LIVE_CONTROLLER.activeWorkflowProfile()}
function procedureMilestoneEvent(label){return OR_LIVE_CONTROLLER.procedureMilestoneEvent(label)}
function templateQuickDrugCandidates(){return OR_LIVE_CONTROLLER.templateQuickDrugCandidates()}
function renderTemplateQuickActions(){return OR_LIVE_CONTROLLER.renderTemplateQuickActions()}
function renderWorkflowContext(){return OR_LIVE_CONTROLLER.renderWorkflowContext()}
function inductionMedicationRecords(){return OR_LIVE_CONTROLLER.inductionMedicationRecords()}
function normalizeMedicationIdentity(value){return OR_LIVE_CONTROLLER.normalizeMedicationIdentity(value)}
function plannedRoutineMedicationRows(){return OR_LIVE_CONTROLLER.plannedRoutineMedicationRows()}
function reviewNowPlannedMedicationRows(){return OR_LIVE_CONTROLLER.reviewNowPlannedMedicationRows()}
function laterPlannedMedicationRows(){return OR_LIVE_CONTROLLER.laterPlannedMedicationRows()}
function renderOrMedicationQueue(){return OR_LIVE_CONTROLLER.renderOrMedicationQueue()}
function inductionMedicationComplete(){return OR_LIVE_CONTROLLER.inductionMedicationComplete()}
function renderOrPrimaryFlow(){return OR_LIVE_CONTROLLER.renderOrPrimaryFlow()}
function renderOrUndoControls(){return OR_LIVE_CONTROLLER.renderOrUndoControls()}
function handleOrWorkflowAction(action,options={}){return OR_LIVE_CONTROLLER.handleOrWorkflowAction(action,options)}
function renderAirwayPanel(){return OR_LIVE_CONTROLLER.renderAirwayPanel()}
function renderOrLive(){return OR_LIVE_CONTROLLER.renderOrLive()}
// R21: OR dialog operations are owned by the OR controller; do not call private symbols.
function closeOrMoreDialog(){return OR_LIVE_CONTROLLER.closeOrMoreDialog()}
function renderOrWorkspacePreferences(){return OR_LIVE_CONTROLLER.renderOrWorkspacePreferences()}
function renderOrRecent(){return OR_LIVE_CONTROLLER.renderOrRecent()}
MEDICATION_WORKSPACE_CONTROLLER=window.ANESVET_MEDICATION_WORKSPACE_CONTROLLER?.create?.({
  $,$$,escapeHtml,formatClock,formatShortElapsed,fmtDose,fmtVol,toast,workflow:globalThis.AnesvetWorkflow,getState:()=>state,
  currentWeightKg,currentWeightReady,requireCurrentWeight,clinicalWriteAllowed,ensureTimerStarted,currentElapsed,save,addEvent,addAudit,
  permissionAllowed:(action)=>SECURITY?.enabled?.()?!!SECURITY?.can?.(action):true,identityContext:()=>clinicalActorContext(),
  renderEvents,renderProcedureTimeline,renderOrLive,renderOrMedicationQueue,renderOrPrimaryFlow,renderDoseReferenceInline,safeMedicationCalculation,
  procedureMilestoneEvent,inductionMedicationRecords,normalizeMedicationIdentity,plannedRoutineMedicationRows,pendingPlannedMedicationRows:()=>OR_LIVE_CONTROLLER.medicationQueueSummary().rows.filter(r=>r.status==='pending'),templateQuickDrugCandidates,currentSettingsObject,
  caseDrugPlanPhaseLabel,orLiveLockedByRecovery,confirm:(msg)=>confirm(msg),prompt:(msg,def='')=>prompt(msg,def)
});
if(!MEDICATION_WORKSPACE_CONTROLLER)throw new Error('ANESVET medication-workspace-controller.js failed to load');
MEDICATION_WORKSPACE_CONTROLLER.bind();
BOOT?.mark?.('medication-workspace-bound');
function renderBuiltInProtocolChips(cfg=currentSettingsObject()){
  const source=state?.protocolSnapshot?.builtInProtocol?activeBuiltInProtocol():cfg;
  const n=(k,f)=>Number(source?.[k]??f);
  if($('diazepamProtocolChip'))$('diazepamProtocolChip').textContent=`${fmtDose(n('diazepamDose',0.25))} mg/kg`;
  if($('propofolProtocolChip'))$('propofolProtocolChip').textContent=`${fmtDose(n('propofolDose',4))} mg/kg planned`;
  if($('tramadolProtocolChip'))$('tramadolProtocolChip').textContent=`${fmtDose(n('tramadolDose',4))} mg/kg`;
  if($('carprofenProtocolChip'))$('carprofenProtocolChip').textContent=`DOG • ${fmtDose(n('carprofenDose',4.4))} mg/kg`;
  if($('meloxicamProtocolChip'))$('meloxicamProtocolChip').textContent=`CAT • ${fmtDose(n('meloxicamDose',0.3))} mg/kg`;
  if($('cefazolinProtocolChip'))$('cefazolinProtocolChip').textContent=`Geno V • 250 mg/mL • BW ÷ ${fmtDose(n('cefazolinDivisor',10))} mL`;
  if($('conveniaProtocolChip'))$('conveniaProtocolChip').textContent=`Geno V • 80 mg/mL • BW ÷ ${fmtDose(n('conveniaDivisor',10))} mL`;
  if($('adrenalineProtocolChip'))$('adrenalineProtocolChip').textContent=`CPR ${fmtDose(n('adrenalineDose',0.01))} mg/kg IV/IO`;
  if($('atropineProtocolChip'))$('atropineProtocolChip').textContent=`Bradycardia ${fmtDose(n('atropineBradyDose',0.02))} mg/kg IV`;
  const mode=$('atropineMode');if(mode){const prev=mode.value,br=n('atropineBradyDose',0.02),cpr=n('atropineCprDose',0.04);mode.innerHTML=`<option value="${br}">Intra-op bradycardia • ${fmtDose(br)} mg/kg</option><option value="${cpr}">CPR / severe vagal bradycardia • ${fmtDose(cpr)} mg/kg</option>`;mode.value=[String(br),String(cpr)].includes(String(prev))?String(prev):String(br)}
}

function currentSettingsObject(){try{const x=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||JSON.parse(localStorage.getItem('anesvet_v14_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_4_settings')||'null');const s={...defaultSettings(),...(x||{})};delete s.pilotFeedbackEndpoint;return s}catch(e){return defaultSettings()}}
let lastProtocolDoseReview=null;
function protocolFormValue(id,fallback=''){const el=$(id);return el?el.value:fallback}
function protocolReviewBuiltIns(){
  const s=currentSettingsObject(),v=(id,key)=>protocolFormValue(id,s[key]??'');
  return [
    {id:'diazepamDose',name:'Diazepam',origin:'Built-in',phase:'induction',mode:'mgkg',dose:v('settingDiazepamDose','diazepamDose'),route:'IV',species:['dog','cat']},
    {id:'propofolDose',name:'Propofol',origin:'Built-in',phase:'induction',mode:'mgkg',dose:v('settingPropofolDose','propofolDose'),route:'IV',species:['dog','cat']},
    {id:'tramadolDose',name:'Tramadol',origin:'Built-in',phase:'pre',mode:'mgkg',dose:v('settingTramadolDose','tramadolDose'),route:'',species:['dog','cat']},
    {id:'carprofenDose',name:'Carprofen',origin:'Built-in',phase:'post',mode:'mgkg',dose:v('settingCarprofenDose','carprofenDose'),route:'',species:['dog']},
    {id:'meloxicamDose',name:'Meloxicam',origin:'Built-in',phase:'post',mode:'mgkg',dose:v('settingMeloxicamDose','meloxicamDose'),route:'',species:['cat']},
    {id:'cefazolinDivisor',name:'Cefazolin',origin:'Built-in legacy',phase:'pre',mode:'bwdiv',dose:v('settingCefazolinDivisor','cefazolinDivisor'),route:'',species:['dog','cat']},
    {id:'conveniaDivisor',name:'Convenia',origin:'Built-in legacy',phase:'post',mode:'bwdiv',dose:v('settingConveniaDivisor','conveniaDivisor'),route:'',species:['dog','cat']},
    {id:'adrenalineDose',name:'Adrenaline CPR',origin:'Built-in emergency',phase:'emergency',mode:'mgkg',dose:v('settingAdrenalineDose','adrenalineDose'),route:'IV/IO',species:['dog','cat']},
    {id:'atropineBradyDose',name:'Atropine — bradycardia',origin:'Built-in emergency',phase:'emergency',mode:'mgkg',dose:v('settingAtropineBradyDose','atropineBradyDose'),route:'IV',species:['dog','cat']},
    {id:'atropineCprDose',name:'Atropine — CPR',origin:'Built-in emergency',phase:'emergency',mode:'mgkg',dose:v('settingAtropineCprDose','atropineCprDose'),route:'IV',species:['dog','cat']}
  ];
}
function protocolReviewLibraryForm(){
  const rows=$$('.drug-library-row');
  if(!rows.length)return (hospitalDrugLibrary||loadDrugLibraryData()).filter(d=>d.active!==false).map(d=>({...d,origin:'Drug Library'}));
  return rows.map((row,i)=>{const f=n=>row.querySelector(`[data-field="${n}"]`);return{id:hospitalDrugLibrary[i]?.id||`row-${i}`,name:f('name')?.value.trim()||`Drug ${i+1}`,origin:'Drug Library',phase:f('phase')?.value||'pre',drugClass:f('drugClass')?.value.trim()||'',mode:f('mode')?.value||'mgkg',dose:f('dose')?.value||'',route:f('route')?.value.trim()||'',active:true}});
}
function protocolReviewPayload(){
  const builtIns=protocolReviewBuiltIns(),library=protocolReviewLibraryForm().filter(d=>d.active!==false&&String(d.dose??'').trim()!=='').map(d=>({id:d.id,name:d.name,phase:d.phase,mode:d.mode,dose:d.dose,route:d.route,drugClass:d.drugClass||''}));
  return{referenceVersion:DOSE_REF?.version||'',reviewEngineVersion:PROTOCOL_REVIEW?.version||'',builtIns:builtIns.map(d=>({id:d.id,name:d.name,mode:d.mode,dose:d.dose,route:d.route,species:d.species})),library};
}
function protocolReviewSavedPayload(){
  const s=currentSettingsObject();
  const builtIns=[
    {id:'diazepamDose',name:'Diazepam',mode:'mgkg',dose:s.diazepamDose,route:'IV',species:['dog','cat']},
    {id:'propofolDose',name:'Propofol',mode:'mgkg',dose:s.propofolDose,route:'IV',species:['dog','cat']},
    {id:'tramadolDose',name:'Tramadol',mode:'mgkg',dose:s.tramadolDose,route:'',species:['dog','cat']},
    {id:'carprofenDose',name:'Carprofen',mode:'mgkg',dose:s.carprofenDose,route:'',species:['dog']},
    {id:'meloxicamDose',name:'Meloxicam',mode:'mgkg',dose:s.meloxicamDose,route:'',species:['cat']},
    {id:'cefazolinDivisor',name:'Cefazolin',mode:'bwdiv',dose:s.cefazolinDivisor,route:'',species:['dog','cat']},
    {id:'conveniaDivisor',name:'Convenia',mode:'bwdiv',dose:s.conveniaDivisor,route:'',species:['dog','cat']},
    {id:'adrenalineDose',name:'Adrenaline CPR',mode:'mgkg',dose:s.adrenalineDose,route:'IV/IO',species:['dog','cat']},
    {id:'atropineBradyDose',name:'Atropine — bradycardia',mode:'mgkg',dose:s.atropineBradyDose,route:'IV',species:['dog','cat']},
    {id:'atropineCprDose',name:'Atropine — CPR',mode:'mgkg',dose:s.atropineCprDose,route:'IV',species:['dog','cat']}
  ];
  const library=loadDrugLibraryData().filter(d=>d.active!==false&&String(d.dose??'').trim()!=='').map(d=>({id:d.id,name:d.name,phase:d.phase,mode:d.mode,dose:d.dose,route:d.route,drugClass:d.drugClass||''}));
  return{referenceVersion:DOSE_REF?.version||'',reviewEngineVersion:PROTOCOL_REVIEW?.version||'',builtIns,library};
}
function runProtocolDoseReview(){
  if(!PROTOCOL_REVIEW)return{rows:[],summary:{total:0,warnings:0,notes:0,good:0,info:0},fingerprint:'',payload:protocolReviewPayload()};
  const items=protocolReviewBuiltIns().concat(protocolReviewLibraryForm().filter(d=>d.active!==false&&String(d.dose??'').trim()!==''));
  const rows=items.map(item=>{
    let species=Array.isArray(item.species)&&item.species.length?item.species:PROTOCOL_REVIEW.referenceSpecies(item.name);
    if(!species.length)species=[''];
    const speciesResults=species.map(sp=>PROTOCOL_REVIEW.evaluate(item,{species:sp}));
    return{...item,speciesResults};
  });
  const payload=protocolReviewPayload(),result={rows,summary:PROTOCOL_REVIEW.summarize(rows),fingerprint:PROTOCOL_REVIEW.fingerprint(payload),payload};lastProtocolDoseReview=result;return result;
}
function protocolReviewRowSeverity(row){const sev=row.speciesResults.map(x=>x.severity);return sev.includes('warn')?'warn':sev.includes('note')?'note':sev.every(x=>x.severity==='good')?'good':'info'}
function protocolDoseLabel(item){const unit=({mgkg:'mg/kg',mcgkg:'μg/kg',mlkg:'mL/kg',bwdiv:'BW ÷ factor',manual:'manual'})[item.mode]||item.mode||'';return item.mode==='bwdiv'?`BW ÷ ${item.dose||'—'}`:`${item.dose||'—'} ${unit}`.trim()}
function protocolReviewRowHtml(row){
  const sev=protocolReviewRowSeverity(row),speciesLines=row.speciesResults.map(r=>`<div class="protocol-review-species-line"><span class="species-label">${escapeHtml((r.species||'ALL').toUpperCase())}</span><span class="protocol-review-status ${escapeHtml(r.severity)}">${escapeHtml(r.label)}</span><span class="protocol-review-detail">${escapeHtml(r.detail)}</span></div>`).join('');
  const hasRef=!!DOSE_REF?.get?.(row.name,'');
  return `<article class="protocol-review-row review-${sev}"><div class="protocol-review-head"><div class="protocol-review-drug"><b>${escapeHtml(row.name)}</b><small>${escapeHtml(row.origin||'')} • ${escapeHtml(drugPhaseLabel(row.phase||''))} • Protocol ${escapeHtml(protocolDoseLabel(row))}${row.route?' • '+escapeHtml(row.route):' • route not specified'}</small></div></div><div class="protocol-review-species">${speciesLines}</div>${hasRef?`<div class="protocol-review-reference"><button type="button" class="dose-reference-chip" data-dose-reference="${escapeHtml(row.name)}"><span>Loaded reference</span><b>View dose contexts and sources</b></button></div>`:''}</article>`;
}
function renderProtocolDoseReview(){
  const box=$('protocolReviewResults'),summaryEl=$('protocolReviewSummary'),status=$('protocolReviewStatus'),meta=$('protocolReviewMeta');if(!box||!summaryEl||!status)return;
  if(!PROTOCOL_REVIEW){status.textContent='UNAVAILABLE';status.className='status-pill warn';box.innerHTML='<div class="protocol-review-empty">Protocol review engine is not loaded.</div>';summaryEl.innerHTML='';return}
  const r=runProtocolDoseReview(),saved=currentSettingsObject().protocolDoseReview,current=!!saved&&saved.fingerprint===r.fingerprint;
  if(current){status.textContent=r.summary.warnings?`REVIEWED • ${r.summary.warnings} WARN`:'REVIEWED';status.className='status-pill good'}else if(saved){status.textContent='CHANGED SINCE REVIEW';status.className='status-pill warn'}else{status.textContent='NOT REVIEWED';status.className='status-pill warn'}
  summaryEl.innerHTML=`<div class="review-metric"><b>${r.summary.warnings}</b><small>warning</small></div><div class="review-metric"><b>${r.summary.notes}</b><small>check context</small></div><div class="review-metric"><b>${r.summary.good}</b><small>primary match</small></div><div class="review-metric"><b>${r.summary.info}</b><small>not auto-compared</small></div>`;
  const attention=r.rows.filter(x=>protocolReviewRowSeverity(x)!=='good'),good=r.rows.filter(x=>protocolReviewRowSeverity(x)==='good');
  box.innerHTML=(attention.length?attention.map(protocolReviewRowHtml).join(''):'<div class="protocol-review-empty">No attention items in the current loaded reference comparison.</div>')+(good.length?`<details class="protocol-review-good-details"><summary>✓ Show ${good.length} item${good.length===1?'':'s'} within primary reference</summary><div class="protocol-review-results">${good.map(protocolReviewRowHtml).join('')}</div></details>`:'');
  if($('protocolReviewReviewer')&&current)$('protocolReviewReviewer').value=saved.reviewer||'';
  if($('protocolReviewNote')&&current)$('protocolReviewNote').value=saved.note||'';
  if(meta){const reviewed=current?` • Reviewed ${formatDate(saved.reviewedAt)} ${formatClock(saved.reviewedAt)} by ${saved.reviewer}`:'';meta.textContent=`Reference ${DOSE_REF?.version||'—'} • Engine ${PROTOCOL_REVIEW.version||'—'}${reviewed} • No dose, route or concentration is changed automatically.`}
}
function acknowledgeProtocolDoseReview(){
  const r=runProtocolDoseReview(),reviewer=$('protocolReviewReviewer')?.value.trim()||'',note=$('protocolReviewNote')?.value.trim()||'';
  const persistedFingerprint=PROTOCOL_REVIEW?.fingerprint?.(protocolReviewSavedPayload())||'';
  if(r.fingerprint!==persistedFingerprint){toast('Save Hospital Settings / Drug Library ก่อน Mark reviewed');return}
  if(!reviewer){toast('ระบุผู้ทบทวน protocol');$('protocolReviewReviewer')?.focus();return}
  if((r.summary.warnings>0||r.summary.notes>0)&&!note){toast('มี warning / check context — กรุณาระบุ review note');$('protocolReviewNote')?.focus();return}
  const s=currentSettingsObject();s.protocolDoseReview={fingerprint:r.fingerprint,reviewedAt:Date.now(),reviewer,note,summary:r.summary,referenceVersion:DOSE_REF?.version||'',reviewEngineVersion:PROTOCOL_REVIEW?.version||'',protocolVersion:protocolFormValue('settingProtocolVersion',s.protocolVersion||'')};localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));addProtocolAudit('PROTOCOL_DOSE_REVIEWED',`${reviewer} • warnings=${r.summary.warnings} • context=${r.summary.notes} • notCompared=${r.summary.info}${note?' • '+note:''}`);renderProtocolDoseReview();renderProtocolGovernance();toast('Current medication protocol configuration marked reviewed');
}
function protocolReviewLockWarning(){
  const r=runProtocolDoseReview(),saved=currentSettingsObject().protocolDoseReview,current=!!saved&&saved.fingerprint===r.fingerprint;
  return{...r,currentReview:current,message:`Medication protocol review is not current for this exact configuration.

Warnings: ${r.summary.warnings}
Check context: ${r.summary.notes}
Not auto-compared: ${r.summary.info}

Lock anyway?`};
}
$('runProtocolReviewBtn')?.addEventListener('click',()=>{renderProtocolDoseReview();toast('Protocol dose review refreshed')});
$('protocolReviewAcknowledgeBtn')?.addEventListener('click',acknowledgeProtocolDoseReview);
const protocolReviewInputIds=['settingDiazepamDose','settingPropofolDose','settingTramadolDose','settingCarprofenDose','settingMeloxicamDose','settingCefazolinDivisor','settingConveniaDivisor','settingAdrenalineDose','settingAtropineBradyDose','settingAtropineCprDose'];
protocolReviewInputIds.forEach(id=>$(id)?.addEventListener('input',()=>renderProtocolDoseReview()));
$('drugLibraryRows')?.addEventListener('input',()=>renderProtocolDoseReview());$('drugLibraryRows')?.addEventListener('change',()=>renderProtocolDoseReview());

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
$('mobileWorkflowMenuBtn')?.addEventListener('click',openMobileWorkflowDialog);
$('mobileQuickTopBtn')?.addEventListener('click',()=>scrollAppTop());
$('mobileQuickReportBtn')?.addEventListener('click',openPilotFeedbackDialog);
$('mobileWorkflowCloseBtn')?.addEventListener('click',closeMobileWorkflowDialog);
$('mobileWorkflowDialog')?.addEventListener('click',e=>{if(e.target===$('mobileWorkflowDialog'))closeMobileWorkflowDialog()});
$$('[data-mobile-tab]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.mobileTab;closeMobileWorkflowDialog();setTab(id)}));

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
// Finalization / sign-off / amendment UI is owned by finalization-archive-controller.js
function renderCaseSummary(){
  if(!$('casesummary'))return;
  const species=({cat:'Cat',dog:'Dog'})[$('species')?.value]||'—';
  $('summaryPatient').textContent=`${$('patientName')?.value.trim()||'Unnamed'} • ${species} • ${$('weight')?.value||'—'} kg`;
  $('summaryAsa').textContent=`ASA ${$('asa')?.value||'—'}${$('emergency')?.checked?'-E':''}`;
  $('summaryProcedure').textContent=$('procedure')?.value.trim()||$('patientProcedure')?.value.trim()||'—';
  if($('summaryProcedureTemplate'))$('summaryProcedureTemplate').textContent=activeProcedureTemplate()?.label||'Custom / other';
  $('summarySurgeon').textContent=$('surgeon')?.value.trim()||'—';
  $('summaryAnesthetist').textContent=$('anesthetist')?.value.trim()||'—';
  $('summaryAssistant').textContent=$('surgicalAssistant')?.value.trim()||'—';
  if($('summaryWorkflow'))$('summaryWorkflow').textContent=workflowProfileInfo().label;
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
  const structuredRisks=preopRiskSummaryLabels({compact:true});if(structuredRisks.length)risks.push(`RISK FLAGS: ${structuredRisks.join(', ')}`);
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
  const orTab=document.querySelector('.or-live-tab'),recoveryTab=document.querySelector('.tab[data-tab="recovery"]');
  if(orTab){
    const recoveryLock=orLiveLockedByRecovery(),readinessLock=!state.caseStartedAt&&!preOrReadinessStatus().ready&&!readinessOverrideValid(preOrReadinessStatus());
    const locked=recoveryLock||readinessLock;orTab.classList.toggle('locked-step',locked);orTab.setAttribute('aria-disabled',locked?'true':'false');
    orTab.title=recoveryLock?'Recovery active — ใช้ Emergency return to OR LIVE เมื่อจำเป็น':readinessLock?'Complete required pre-anesthetic items before OR LIVE':'';
  }
  if(recoveryTab){const locked=!recoveryAccessAllowed();recoveryTab.classList.toggle('locked-step',locked);recoveryTab.setAttribute('aria-disabled',locked?'true':'false');recoveryTab.title=locked?'Recovery opens after Extubation / Begin Recovery':''}
  if($('emergencyReturnOrBtn'))$('emergencyReturnOrBtn').disabled=state.casePhase!=='recovery'||!!state.recoveryCompletedAt;
}
function exitOrFullscreenForNavigation(id){
  if(id==='orlive')return Promise.resolve();
  if(document.body.classList.contains('or-fullscreen'))document.body.classList.remove('or-fullscreen');
  if($('orFullscreenBtn'))$('orFullscreenBtn').textContent='⛶ Full screen';
  if(!document.fullscreenElement||!document.exitFullscreen)return Promise.resolve();
  try{
    const p=document.exitFullscreen();
    if(!p?.then)return Promise.resolve();
    // Android/PWA fullscreen exit can lag behind the workflow mutation. Never
    // block clinical navigation indefinitely, but give the viewport a brief
    // chance to settle before the Recovery page is painted/scrolled.
    return Promise.race([p.catch(()=>{}),new Promise(resolve=>setTimeout(resolve,450))]);
  }catch(e){return Promise.resolve()}
}
function settlePostNavigationViewport(id){
  if(!['recovery','endcase'].includes(id))return;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{
    document.body.classList.remove('or-fullscreen');
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(e){window.scrollTo(0,0)}
    document.documentElement.scrollTop=0;document.body.scrollTop=0;
    document.dispatchEvent(new CustomEvent('anesvet:viewportchange',{detail:{source:'workflow-navigation'}}));
  }));
}
const MOBILE_STEP_LABELS={patient:'ประวัติผู้ป่วย',preop:'Pre-check',drugs:'Medications',orlive:'ช่วงวางยา',recovery:'Recovery',endcase:'End Case',casesummary:'Case Summary',cases:'Cases / Archive',settings:'Settings',plan:'Anesthesia Plan',record:'Full Record',events:'Events & Drugs',trends:'Trends',timeline:'Timeline',dashboard:'Advanced'};
function syncMobileWorkflowLocks(){
  $$('[data-mobile-tab]').forEach(btn=>{
    const id=btn.dataset.mobileTab,src=document.querySelector(`.workflow-tabs .tab[data-tab="${id}"]`);
    btn.classList.toggle('active',document.getElementById(id)?.classList.contains('active'));
    btn.classList.toggle('locked-step',!!src?.classList.contains('locked-step'));
    if(src?.title)btn.title=src.title;else btn.removeAttribute('title');
  });
}
function renderMobileQuickBar(id){
  const bar=$('mobileQuickBar'),label=$('mobileQuickStepLabel');if(!bar)return;
  const focus=['orlive','recovery'].includes(id),visible=!focus;
  bar.hidden=!visible;document.body.classList.toggle('mobile-quick-active',visible);
  if(label)label.textContent=MOBILE_STEP_LABELS[id]||'ANESVET';
  syncMobileWorkflowLocks();
}
// R08: repeated mobile-menu taps must not call showModal() on an already open dialog.
function openMobileWorkflowDialog(){
  const d=$('mobileWorkflowDialog');if(!d)return;
  syncMobileWorkflowLocks();
  if(d.open)return; // Avoid InvalidStateError / accidental non-modal fallback.
  try{if(typeof d.showModal==='function')d.showModal();else d.setAttribute('open','')}
  catch(e){BOOT?.mark?.('mobile-workflow-open-failed',e?.message||String(e));if(!d.open)d.setAttribute('open','')}
}
function closeMobileWorkflowDialog(){return safeCloseOpenDialog($('mobileWorkflowDialog'))}

// V17.2.2 interaction recovery: a modal left in the browser top-layer can make the
// underlying clinical page look normal while swallowing every tap. Always close
// navigation-only dialogs before a real page transition, and recover only dialogs
// that are open but no longer render a usable surface.
const TRANSIENT_NAV_DIALOG_IDS=['mobileWorkflowDialog','orMoreDialog','orStepConfirmDialog','recoveryMoreDialog','helpCenterDialog','onboardingDialog','preOrReadinessDialog','preOrBriefingDialog'];
function safeCloseOpenDialog(d){
  if(!d?.open)return false;
  try{if(typeof d.close==='function')d.close();else d.removeAttribute('open')}catch(e){try{d.removeAttribute('open')}catch(_){}}
  return !d.open;
}
function closeTransientNavigationDialogs(){
  TRANSIENT_NAV_DIALOG_IDS.forEach(id=>safeCloseOpenDialog($(id)));
}
function recoverInvisibleModalBlockers(){
  document.querySelectorAll('dialog[open]').forEach(d=>{
    if(d.id?.startsWith('security'))return;
    let invisible=false;
    try{const cs=getComputedStyle(d),r=d.getBoundingClientRect();invisible=cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0||r.width<2||r.height<2}catch(e){}
    if(invisible)safeCloseOpenDialog(d);
  });
}
window.addEventListener('pageshow',()=>setTimeout(recoverInvisibleModalBlockers,0));
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')setTimeout(recoverInvisibleModalBlockers,0)});

function setTab(id,opts={}){
  // R05: a bad route is not a page; do not hide every real tab by activating it.
  const target=document.getElementById(id);
  if(!id || !target?.classList?.contains('tabpage')){BOOT?.nav?.('invalid-target',id);return;}
  if(id==='orlive' && orLiveLockedByRecovery() && !opts.force){
    BOOT?.nav?.('blocked-recovery',id);
    toast('Recovery active — OR LIVE ถูกล็อก หากฉุกเฉินให้กด Emergency return to OR LIVE');
    renderWorkflowLocks();scrollAppTop();return;
  }
  if(id==='orlive'&&!opts.force&&!requestOrLiveAccess(opts)){
    BOOT?.nav?.('blocked-readiness',id,'OR access / briefing gate');
    renderWorkflowLocks();scrollAppTop();return;
  }
  if(id==='recovery'&&!opts.force&&!recoveryAccessAllowed()){
    BOOT?.nav?.('blocked-recovery',id);
    const msg=!state.caseStartedAt?'Recovery ยังไม่เปิด — เริ่มเคสและดำเนิน workflow ก่อน':'Recovery จะเปิดหลัง Extubation / Begin Recovery';
    toast(msg);renderWorkflowLocks();scrollAppTop();return;
  }
  try{
    closeTransientNavigationDialogs();
    recoverInvisibleModalBlockers();
    const fullscreenExit=exitOrFullscreenForNavigation(id);
    closeMoreMenu();closeRecoveryMoreDialog();
    $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
    $$('.tabpage').forEach(p=>p.classList.toggle('active',p.id===id));
    document.body.classList.toggle('or-mobile-active',id==='orlive'&&currentSettingsObject().orFocusMode!==false);
    document.body.classList.toggle('recovery-mobile-active',id==='recovery');
    // Tab location is a UI preference, not clinical storage. A write failure
    // must not interrupt the actual page transition or remaining UI updates.
    try{localStorage.setItem(TAB_KEY,id)}catch(e){BOOT?.mark?.('navigation-tab-preference-unavailable')}
    if(id==='trends') renderTrends();
    if(id==='timeline') renderProcedureTimeline();
    if(id==='record')renderRecordPreview();
    if(id==='dashboard')renderInterpretation();
    if(id==='cases'){renderArchives();renderBackupHealth();}
    if(id==='casesummary') renderCaseSummary();
    if(id==='orlive'){renderOrLive();renderAirwayPanel();}
    if(id==='drugs'){updateDoseSpotlights();syncQuickConcentrations();renderCaseDrugPlan();}
    if(id==='recovery'){renderRecovery();renderRecoveryRecords();updateRecoveryDue();}
    if(id==='endcase') renderEndCase();
    if(id==='settings'){renderAlertProtocolStatus();renderDrugLibrarySettings();renderQuickPresetSettings();renderBreedAliasSettings();setTimeout(()=>{renderProtocolGovernance();renderProtocolDoseReview()},0);}
    renderWorkflowLocks();
    renderMobileQuickBar(id);
    // Explicit navigation may occur while Android still owns an IME focus.
    // Release editable focus before resetting page position so visualViewport
    // collapse cannot pull the new tab/header back under the keyboard.
    const activeEditor=document.activeElement;
    if(activeEditor?.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]),textarea,select,[contenteditable="true"]'))try{activeEditor.blur()}catch(_){}
    if(['recovery','endcase'].includes(id)){
      Promise.resolve(fullscreenExit).finally(()=>settlePostNavigationViewport(id));
    }else requestAnimationFrame(scrollAppTop);
    BOOT?.nav?.('rendered',id);
  }catch(e){
    BOOT?.nav?.('render-error',id,e?.message||String(e));
    throw e; // Never suppress a failed clinical screen render.
  }
}
$$('.tab[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('preOrReadinessCloseBtn')?.addEventListener('click',()=>{try{$('preOrReadinessDialog')?.close()}catch(e){}});
$('preOrReadinessCancelBtn')?.addEventListener('click',()=>{try{$('preOrReadinessDialog')?.close()}catch(e){}});
$('preOrGoFixBtn')?.addEventListener('click',()=>{const b=$('preOrGoFixBtn'),tab=b?.dataset.tab||'preop',target=b?.dataset.target||'';try{$('preOrReadinessDialog')?.close()}catch(e){}setTab(tab,{force:true});setTimeout(()=>{const el=$(target)||document.getElementById(target);el?.scrollIntoView?.({behavior:'smooth',block:'center'});el?.focus?.()},100)});
$('preOrOverrideBtn')?.addEventListener('click',()=>{const st=preOrReadinessStatus();if(st.hard.length){toast('Patient identity / saved setup / current BW cannot be overridden');return}const reason=$('preOrOverrideReason')?.value.trim()||'',by=$('preOrOverrideBy')?.value.trim()||'';if(!reason){toast('กรุณาระบุเหตุผลที่ต้องเข้า OR ก่อน checklist ครบ');$('preOrOverrideReason')?.focus();return}if(!by){toast('กรุณาระบุผู้รับผิดชอบ');$('preOrOverrideBy')?.focus();return}state.preOrReadinessOverride={at:Date.now(),by,reason,blockerKeys:st.blockerKeys,missing:st.required.map(x=>x.label)};addAudit('PRE_OR_READINESS_OVERRIDE',`${st.required.map(x=>x.label).join(' • ')} • Reason: ${reason}`,by);save();try{$('preOrReadinessDialog')?.close()}catch(e){}toast('⚠ OR readiness override documented');setTab(pendingPreOrTarget,{force:true})});
$('preOrBriefingCloseBtn')?.addEventListener('click',()=>{try{$('preOrBriefingDialog')?.close()}catch(e){}});
$('preOrBriefingBackBtn')?.addEventListener('click',()=>{try{$('preOrBriefingDialog')?.close()}catch(e){}setTab('casesummary',{force:true})});
function closeDialogSafe(id){
  const d=$(id);if(!d)return;
  try{if(d.open&&typeof d.close==='function')d.close();else d.removeAttribute('open')}catch(e){try{d.removeAttribute('open')}catch(_){}}
}
function recoverInteractionSurfaceForClinicalResume(){
  const securityLocked=!!(SECURITY?.enabled?.()&&SECURITY?.locked?.());
  // If Identity is not actually locked, stale inert attributes must never strand an active case.
  if(!securityLocked){
    for(const el of [...document.body.children]){if(el.id!=='securityLockOverlay')el.removeAttribute('inert')}
    document.body.classList.remove('security-locked');
  }
  // A restored native dialog can remain in the browser top layer and swallow taps even when its UI is not visible.
  document.querySelectorAll('dialog[open]').forEach(d=>{
    if(securityLocked&&d.id?.startsWith('security'))return;
    safeCloseOpenDialog(d);
  });
}
function forceActivateClinicalUI(id){
  const page=$(id);if(!page)return false;
  recoverInteractionSurfaceForClinicalResume();closeMoreMenu();closeRecoveryMoreDialog();exitOrFullscreenForNavigation(id);
  $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  $$('.tabpage').forEach(p=>p.classList.toggle('active',p.id===id));
  document.body.classList.toggle('or-mobile-active',id==='orlive'&&currentSettingsObject().orFocusMode!==false);
  document.body.classList.toggle('recovery-mobile-active',id==='recovery');
  try{localStorage.setItem(TAB_KEY,id)}catch(e){}
  if(id==='orlive'){renderOrLive();renderAirwayPanel()}
  else if(id==='recovery'){renderRecovery();renderRecoveryRecords();updateRecoveryDue()}
  else if(id==='endcase')renderEndCase();
  renderWorkflowLocks();renderMobileQuickBar(id);scrollAppTop();
  return page.classList.contains('active');
}
function forceActivateOrLiveUI(){return forceActivateClinicalUI('orlive')}
function persistRuntimeRepair(repair,source='resume'){
  if(!repair?.changed)return true;
  if(!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||!CASE_FRESHNESS.verify())return false;
  if(!Array.isArray(state.auditTrail))state.auditTrail=[];
  state.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),elapsedMs:currentElapsed(),action:'ACTIVE_CASE_RUNTIME_STATE_REPAIRED',detail:`${source} • ${repair.changes.join(' • ')}`,actor:'System'});
  try{const payload=JSON.stringify(state);localStorage.setItem(CURRENT_KEY,payload);CASE_FRESHNESS.committed(localStorage.getItem(CURRENT_KEY));writeSafetyCheckpoint(payload);return true}catch(_){return false}
}
function resumeActiveClinicalWorkspace(options={}){
  const source=options.source||'manual-resume';
  const repair=ACTIVE_CASE_RESCUE.normalizeState(state,{mutate:true});
  persistRuntimeRepair(repair,source);
  const target=ACTIVE_CASE_RESCUE.targetForState(state);
  if(!target){toast('ยังไม่พบ active anesthesia case สำหรับกลับไปทำต่อ');return false}
  if(SECURITY?.enabled?.()&&SECURITY?.locked?.()){toast('กรุณา Unlock Identity ก่อนกลับเข้าสู่เคส');return false}
  recoverInteractionSurfaceForClinicalResume();
  setTab(target,{force:true});
  let opened=!!$(target)?.classList.contains('active');
  if(!opened)opened=forceActivateClinicalUI(target);
  // Android/PWA fallback: verify again on the next frame after any restored top-layer state settles.
  requestAnimationFrame(()=>{if(!$(target)?.classList.contains('active'))forceActivateClinicalUI(target)});
  if(opened&&target==='orlive')toast('กลับเข้าสู่ OR LIVE แล้ว');
  return opened;
}
function openOrLiveAfterBriefingReview(){
  const by=$('preOrBriefingBy')?.value.trim()||'';
  if(!by){toast('กรุณาระบุผู้ที่ทบทวน Pre-OR briefing');$('preOrBriefingBy')?.focus();return false}
  if(orLiveLockedByRecovery()){toast('Recovery active — OR LIVE เปิดได้ผ่าน Emergency return เท่านั้น');return false}
  const readiness=preOrReadinessStatus();
  if(!state.caseStartedAt&&!(readiness.ready||readinessOverrideValid(readiness))){
    closeDialogSafe('preOrBriefingDialog');renderPreOrReadinessDialog('orlive');toast('ยังมีข้อมูลสำคัญที่ต้องทบทวนก่อนเข้า OR LIVE');return false;
  }
  const snapshot=preOrSupportReference();
  state.preOrBriefingReview={at:Date.now(),by,signature:preOrBriefingSignature(),reference:snapshot};
  addAudit('PRE_OR_BRIEFING_REVIEWED',`ETT ${snapshot.ett.value} • ${snapshot.circuit.value} • Fluid ${snapshot.fluid.value}`,by);
  if(!save()){toast('⚠ บันทึก Pre-OR briefing ไม่สำเร็จ — ยังไม่เปิด OR LIVE');return false}
  // save() re-samples UI fields. Re-sign the exact persisted case state if anything changed during that save.
  const persistedSignature=preOrBriefingSignature();
  if(state.preOrBriefingReview.signature!==persistedSignature){
    state.preOrBriefingReview.signature=persistedSignature;
    if(!save()){toast('⚠ ยืนยัน Pre-OR briefing ไม่สำเร็จ — ยังไม่เปิด OR LIVE');return false}
  }
  closeDialogSafe('preOrBriefingDialog');
  // All pre-OR safety checks have passed above, so bypass the briefing gate exactly once.
  setTab('orlive',{force:true});
  let opened=!!$('orlive')?.classList.contains('active');
  if(!opened)opened=forceActivateOrLiveUI();
  if(!opened){console.error('ANESVET: failed to activate OR LIVE after briefing review');toast('⚠ เปิด OR LIVE ไม่สำเร็จ — กรุณาออกจากหน้าปัจจุบันแล้วลองใหม่');return false}
  toast('✓ Pre-OR briefing reviewed • OR LIVE opened');
  return true;
}
$('preOrBriefingOpenBtn')?.addEventListener('click',openOrLiveAfterBriefingReview);

$('orLeaveFocusBtn')?.addEventListener('click',()=>setTab('casesummary',{force:true}));
$('recoveryLeaveFocusBtn')?.addEventListener('click',()=>setTab('casesummary',{force:true}));

function getVal(id, fallback=null){
  const el=$(id); if(!el) return fallback;
  if(numericFields.includes(id)) return clamp(el.value,-99999,99999,fallback);
  return el.value;
}

function addAudit(action,detail='',actor=''){state.auditTrail=state.auditTrail||[];const identity=SECURITY?.activeIdentity?.()||null,auth=SECURITY?.auditContext?.(actor)||null;state.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),elapsedMs:currentElapsed(),action,detail,actor:actor||identity?.displayName||$('anesthetist')?.value.trim()||'Unspecified',...(auth?{actorId:auth.actorId,actorRole:auth.actorRole,staffCode:auth.staffCode||'',sessionId:auth.sessionId||'',deviceId:auth.deviceId||'',authMethod:auth.authMethod,authenticatedAt:auth.authenticatedAt,...(auth.reauthenticated?{reauthenticated:true}:{})}: {})})}
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
function addProtocolAudit(action,detail='',actor=''){const a=getProtocolAudit(),identity=SECURITY?.activeIdentity?.()||null,auth=SECURITY?.auditContext?.(actor)||null;a.push({epoch:Date.now(),clock:formatClock(),action,detail,actor:String(actor||identity?.displayName||''),...(auth?{actorId:auth.actorId,actorRole:auth.actorRole,staffCode:auth.staffCode||'',sessionId:auth.sessionId||'',deviceId:auth.deviceId||'',authMethod:auth.authMethod,authenticatedAt:auth.authenticatedAt,...(auth.reauthenticated?{reauthenticated:true}:{})}: {})});localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(a.slice(-500)))}

function clinicalActorContext(){const a=SECURITY?.auditContext?.()||null;return a?{actorId:a.actorId,actorName:a.actorName||SECURITY?.activeIdentity?.()?.displayName||'',actorRole:a.actorRole,staffCode:a.staffCode||'',sessionId:a.sessionId||'',deviceId:a.deviceId||'',authMethod:a.authMethod||'local-pin'}:null}
function currentSnapshot(note=''){
  const documentedBy=clinicalActorContext();
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
    ...(documentedBy?{documentedBy}:{}),
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
function ensureAlertEpisode(key){const metric=Object.keys(ALERT_KEYS).find(k=>ALERT_KEYS[k]===key);if(!metric)return null;const ep=(state.alertEpisodes||[]).slice().reverse().find(x=>x.key===key&&!x.resolvedAt);if(ep)return ep;if(!sessionActive()||state.caseLocked)return null;const value=liveAlertValues()[metric],level=WF.classifyAlert(metric,value,activeAlertProtocol());return ['warn','danger'].includes(level)?newAlertEpisode(metric,value,level):null;}
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
  const d=$('clinicalGuideDialog');
  // Read-only knowledge routing reuses the existing configured direction; no alert mutation.
  if(d)d.dataset.ckGuideTopic=(metric?knowledgeTopicForAlertEpisode({metric,value:liveAlertValues()[metric]}):({hypotension:'hypotension',hypoxemia:'hypoxemia',bradycardia:'bradycardia',hypothermia:'hypothermia'}[key]||''));
  try{if(d&&!d.open)d.showModal()}catch(e){d?.setAttribute('open','')}
  if(auto){playDueTone('test');vibrateDue('anesthesia')}
}
function closeClinicalGuide(){try{$('clinicalGuideDialog')?.close()}catch(e){$('clinicalGuideDialog')?.removeAttribute('open')}}
window.openClinicalGuide=openClinicalGuide;window.openComplicationDialog=openComplicationDialog;
function maybeShowCriticalClinicalAlert(){syncAlertEpisodes();if(!sessionActive()||state.caseLocked||!state.caseStartedAt||['recovery','complete'].includes(state.casePhase))return;if(currentSettingsObject().criticalPopupEnabled===false||document.querySelector('dialog[open]'))return;const ep=(state.alertEpisodes||[]).find(a=>!a.resolvedAt&&!a.acknowledgedAt&&!a.popupShownAt&&(a.level||'danger')==='danger');if(!ep)return;ep.popupShownAt=Date.now();openClinicalGuide(ep.key,{auto:true});save();}
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
function updateDashboard(options={}){
  const fastVitalInput=['hr','rr','sap','map','dap','spo2','etco2','temp'].includes(options.inputId);
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

  // Keep immediate thresholds/alerts; unrelated reference panels do not
  // depend on measured vitals and need not rebuild on each entered digit.
  if(!fastVitalInput){
    renderInterpretation();renderRecordPreview();drugCalc();updatePlanCalc();updateBalance();
    renderProcedureTemplatePicker();renderCaseSummary();renderWeightSafetyState();
  }else{
    if($('dashboard')?.classList.contains('active'))renderInterpretation();
    if($('record')?.classList.contains('active'))renderRecordPreview();
  }
  renderSmartAlerts();
  if($('orlive')?.classList.contains('active')) renderOrLive();
  maybeShowCriticalClinicalAlert();
  // V15.28: callers handling continuous typing can suppress the synchronous full-state write.
  // Critical actions still call save() directly; draft input is flushed by debounced autosave
  // and immediately on visibility/pagehide.
  if(options.persist!==false)save({reason:'dashboard'});
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

function showOrVitalSavedFeedback(record){
  const box=$('orVitalSaveFeedback'),btn=$('orVitalsFocusSaveBtn');if(!record)return;const msg=`✓ SAVED ${record.clock}`;
  if(box){box.textContent=`${msg} • ${vitalRecordSummary(record)}`;box.hidden=false;box.classList.remove('flash');void box.offsetWidth;box.classList.add('flash');clearTimeout(showOrVitalSavedFeedback._t);showOrVitalSavedFeedback._t=setTimeout(()=>{box.hidden=true;box.classList.remove('flash')},2400)}
  if(btn){const old=btn.textContent;btn.textContent=msg;btn.classList.add('saved-flash');clearTimeout(showOrVitalSavedFeedback._b);showOrVitalSavedFeedback._b=setTimeout(()=>{btn.classList.remove('saved-flash');updateOrVitalWorkspace?.()},1600)}
}
function updateOrVitalWorkspace(){renderOrLive()}

const OR_VITAL_DUPLICATE_GUARD_MS=12000;
function vitalSnapshotSignature(r){return OR_DOMAIN.vitalSnapshotSignature(r)}
function recentExactVitalDuplicate(snap){return OR_DOMAIN.recentExactVitalDuplicate(state.records,snap,OR_VITAL_DUPLICATE_GUARD_MS)}

function addRecord(note=''){
  if(!ensureTimerStarted())return false;
  const snap=currentSnapshot(note),warnings=plausibilityWarnings(snap,'anesthesia');
  if(['hr','rr','sap','map','dap','spo2','etco2','temp'].every(k=>snap[k]===null)){toast('No measurement entered — enter at least one measured vital before recording');return false}
  const commit=OR_RECORD_ORCH.commitVital(state.records,snap,{guardMs:OR_VITAL_DUPLICATE_GUARD_MS,findDuplicate:OR_DOMAIN.recentExactVitalDuplicate});
  if(!commit.ok){const duplicate=commit.duplicate;toast(`Already saved this exact vital set ${Math.max(1,Math.round(duplicate.delta/1000))}s ago • duplicate prevented`);showOrVitalSavedFeedback(duplicate.record);return false}
  if(warnings.length&&!confirmPlausibility(warnings,'Anesthesia record'))return false;
  for(const k of WF.metrics)alertObservationRevision[k]=(alertObservationRevision[k]||0)+1;syncAlertEpisodes(snap,{force:true});
  state.records=commit.records;dueReminderToken=null;
  addAudit('ANESTHESIA_RECORD_ADDED',`Record ${snap.clock} • HR ${snap.hr} • MAP ${snap.map} • SpO₂ ${snap.spo2} • ETCO₂ ${snap.etco2}`);
  $('recordNote').value='';
  save();renderRecords();renderTrends();renderProcedureTimeline();renderSmartAlerts();renderOrLive();updateDue();
  const savedRecord=state.records[state.records.length-1];showOrVitalSavedFeedback(savedRecord);toast('✓ Vitals saved • '+savedRecord.clock);
}
$('recordFromDashboardBtn').addEventListener('click',()=>addRecord(''));
$('recordNowBtn').addEventListener('click',()=>addRecord(''));

function recordAlert(r){return OR_DOMAIN.recordAlert(r,{species:$('species').value,classifyAlert:WF.classifyAlert,defaultAlertProtocol:WF.defaultAlertProtocol})}
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
    state.records=OR_RECORD_ORCH.deleteVital(state.records,b.dataset.id);
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
  const result=OR_RECORD_ORCH.applyCorrection(state.records,state.corrections,{recordId:rec.id,field,newValue,reason,epoch:Date.now(),clock:formatClock(),id:crypto.randomUUID?crypto.randomUUID():String(Date.now())});
  if(!result.ok)return;state.records=result.records;state.corrections=result.corrections;
  addAudit('RECORD_CORRECTION',`${field.toUpperCase()} ${result.oldValue} → ${result.newValue}${reason?' • '+reason:''}`);
  $('correctionValue').value='';$('correctionReason').value='';save();renderRecords();renderCorrections();renderTrends();renderSmartAlerts();renderOrLive();renderProcedureTimeline();toast(`Corrected ${field.toUpperCase()} ${result.oldValue} → ${result.newValue}`);
}
$('applyCorrectionBtn')?.addEventListener('click',()=>applyCorrection());
function latestRecord(){return state.records?.length?state.records[state.records.length-1]:null}
function vitalRecordSummary(r){return OR_DOMAIN.vitalRecordSummary(r,{formatTemp:tempTextF})}

const OR_FAST_VITALS=[
  {key:'hr',label:'HR',mainId:'hr',orId:'orHr',deltaId:'orHrDelta'},
  {key:'map',label:'MAP',mainId:'map',orId:'orMap',deltaId:'orMapDelta'},
  {key:'spo2',label:'SpO₂',mainId:'spo2',orId:'orSpo2',deltaId:'orSpo2Delta'},
  {key:'etco2',label:'ETCO₂',mainId:'etco2',orId:'orEtco2',deltaId:'orEtco2Delta'},
  {key:'rr',label:'RR',mainId:'rr',orId:'orRr',deltaId:'orRrDelta'},
  {key:'temp',label:'Temp',mainId:'temp',orId:'orTemp',deltaId:'orTempDelta',temp:true}
];
function orFastVitalCurrent(row){
  if(row.temp)return tempInputStoredF('temp');
  return getVal(row.mainId);
}
function orFastVitalText(row,value){
  if(value===null||value===''||value===undefined||!Number.isFinite(Number(value)))return '—';
  if(row.temp)return `${tempStoredFToDisplay(Number(value))}${tempSymbol()}`;
  return String(Number(value));
}
function orFastVitalDeltaText(row,current,last){
  if(current===null||current===''||current===undefined)return `Last ${orFastVitalText(row,last)} • blank`;
  if(last===null||last===''||last===undefined)return 'New measurement';
  const a=Number(current),b=Number(last);if(!Number.isFinite(a)||!Number.isFinite(b))return 'Review value';
  const raw=a-b,delta=row.temp&&activeTempDisplayUnit==='C'?raw*5/9:raw;
  if(Math.abs(delta)<0.0001)return `Last ${orFastVitalText(row,last)} • same`;
  const dec=row.temp?1:(Math.abs(delta)<1?1:0),sign=delta>0?'+':'';
  return `Last ${orFastVitalText(row,last)} • Δ ${sign}${delta.toFixed(dec)}`;
}
function orVitalChangeState(){
  const last=latestRecord();
  if(!last)return {last:null,changed:0,blank:OR_FAST_VITALS.filter(r=>orFastVitalCurrent(r)==null).length,same:0};
  let changed=0,blank=0,same=0;
  for(const row of OR_FAST_VITALS){
    const cur=orFastVitalCurrent(row),prev=last[row.key];
    if(cur===null||cur===''||cur===undefined){blank++;continue}
    const a=Number(cur),b=Number(prev);
    if(prev===null||prev===''||prev===undefined||!Number.isFinite(a)||!Number.isFinite(b)||Math.abs(a-b)>0.0001)changed++;else same++;
  }
  return {last,changed,blank,same};
}
function renderOrVitalChangeState(){
  const info=orVitalChangeState(),last=info.last;
  for(const row of OR_FAST_VITALS){
    const card=document.querySelector(`.or-vital-card[data-vital="${row.key}"]`),delta=$(row.deltaId),cur=orFastVitalCurrent(row),prev=last?.[row.key];
    const isBlank=cur===null||cur===''||cur===undefined;
    const isChanged=!!last&&!isBlank&&(prev===null||prev===''||prev===undefined||!Number.isFinite(Number(prev))||Math.abs(Number(cur)-Number(prev))>0.0001);
    card?.classList.toggle('changed-from-last',isChanged);card?.classList.toggle('blank-from-last',!!last&&isBlank&&prev!==null&&prev!==''&&prev!==undefined);
    if(delta)delta.textContent=last?orFastVitalDeltaText(row,cur,prev):'First set';
  }
  const summary=$('orVitalChangeSummary');
  if(summary){
    if(!last)summary.textContent='FIRST SET • enter measured values';
    else if(info.blank)summary.textContent=`${info.changed} changed • ${info.blank} blank • last ${last.clock}`;
    else if(info.changed)summary.textContent=`${info.changed} changed • ${info.same} unchanged • last ${last.clock}`;
    else summary.textContent=`UNCHANGED FROM LAST • ${last.clock}`;
    summary.classList.toggle('has-changes',info.changed>0);summary.classList.toggle('has-blanks',info.blank>0);
  }
  return info;
}
function fillBlankVitalsFromLast(){
  const last=latestRecord();if(!last){toast('ยังไม่มี vital record ก่อนหน้า');return false}
  let filled=0;
  for(const row of OR_FAST_VITALS){
    const main=$(row.mainId);if(!main||String(main.value??'').trim()!=='')continue;
    const value=last[row.key];if(value===null||value===''||value===undefined)continue;
    main.value=row.temp?tempStoredFToDisplay(value):value;
    const orInput=$(row.orId);if(orInput)orInput.value=main.value;
    main.dispatchEvent(new Event(main.tagName==='SELECT'?'change':'input',{bubbles:true}));filled++;
  }
  syncOrFromMain();renderRecordPreview();renderOrLive();
  toast(filled?`Filled ${filled} blank vital${filled===1?'':'s'} from last record`:'No blank vital fields to fill');return filled>0;
}

OR_FAST_VITALS.forEach((row,index)=>$(row.orId)?.addEventListener('keydown',e=>{
  if(e.key!=='Enter'&&e.key!=='NumpadEnter')return;
  e.preventDefault();
  const next=OR_FAST_VITALS[index+1];
  if(next){$(next.orId)?.focus();return}
  $('orVitalsFocusSaveBtn')?.focus();
}));
function copyLastVitalsToCurrent(){
  const last=latestRecord();if(!last){toast('ยังไม่มี vital record ก่อนหน้าให้ Copy');return false}
  const values={hr:last.hr,rr:last.rr,sap:last.sap,map:last.map,dap:last.dap,spo2:last.spo2,etco2:last.etco2,vaporizer:last.vaporizer,o2flow:last.o2flow,fluidRateInput:last.fluidRate,depth:last.depth,ventilation:last.ventilation};
  for(const [id,val] of Object.entries(values)){const el=$(id);if(!el||val===null||val===undefined)continue;el.value=val;el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}))}
  if(last.temp!==null&&last.temp!==undefined&&$('temp')){$('temp').value=tempStoredFToDisplay(last.temp);$('temp').dispatchEvent(new Event('input',{bubbles:true}))}
  syncOrFromMain();renderRecordPreview();renderOrLive();toast(`Copied last vitals • ${last.clock}`);return true;
}
function intraopFavoriteQuickDrugs(){return MEDICATION_WORKSPACE_CONTROLLER.intraopFavoriteQuickDrugs()}
function renderOrQuickMedStrip(){return MEDICATION_WORKSPACE_CONTROLLER.renderOrQuickMedStrip()}
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
let unifiedTimelineMode='focus';
function unifiedVitalSeverity(r){
  const sp=state.species||$('species')?.value||state.caseIdentitySnapshot?.species||'',num=v=>v===null||v===''||v===undefined?null:Number(v);
  const values={hr:num(r?.hr),rr:num(r?.rr),map:num(r?.map),spo2:num(r?.spo2),etco2:num(r?.etco2),temp:num(r?.temp)};
  const levels=[];
  if(values.hr!==null){if(sp==='cat')levels.push(values.hr<90||values.hr>225?'danger':values.hr<100||values.hr>180?'warn':'good');else levels.push(values.hr<40||values.hr>190?'danger':values.hr<60||values.hr>150?'warn':'good')}
  if(values.rr!==null){if(sp==='cat')levels.push(values.rr<7?'danger':values.rr<10||values.rr>28?'warn':'good');else levels.push(values.rr<6?'danger':values.rr<8||values.rr>20?'warn':'good')}
  const protocol=r?.alertProtocol||state.protocolSnapshot?.alertProtocol||WF.defaultAlertProtocol();
  for(const key of ['map','spo2','etco2','temp'])if(values[key]!==null)levels.push(WF.classifyAlert(key,values[key],protocol));
  return levels.includes('danger')?'danger':levels.includes('warn')?'warn':'good';
}
function unifiedVitalText(r){return `HR ${r.hr??'—'} • MAP ${r.map??'—'} • SpO₂ ${r.spo2??'—'}${r.spo2==null?'':'%'} • ETCO₂ ${r.etco2??'—'} • RR ${r.rr??'—'} • Temp ${r.temp==null?'—':tempTextF(r.temp)}${r.note?' • '+r.note:''}`}
function unifiedTimelineItems(){
  const items=[],drugEventIds=new Set((state.drugAdministrations||[]).map(x=>x.eventId).filter(Boolean)),compEventIds=new Set((state.complications||[]).map(x=>x.eventId).filter(Boolean));
  (state.events||[]).forEach(e=>{
    if(drugEventIds.has(e.id)||compEventIds.has(e.id))return;
    const milestone=['Premedication','Induction','Intubation','Surgery start','Incision','Surgery end','Extubation','Recovery complete'].includes(e.name);
    const severity=e.drugAdministrationVoid?'warn':e.category==='Emergency'?'danger':'neutral';
    items.push({id:e.id||`event-${e.epoch}`,epoch:e.epoch||0,elapsedMs:e.elapsedMs||0,clock:e.clock||'',kind:milestone?'milestone':'event',cat:milestone?'Workflow':e.category||'Event',severity,focus:true,text:`${e.name}${e.dose?' • '+e.dose:''}${e.route?' • '+e.route:''}${e.note?' • '+e.note:''}`});
  });
  const records=state.records||[];
  records.forEach((r,i)=>{const severity=unifiedVitalSeverity(r),first=i===0,last=i===records.length-1;items.push({id:r.id||`vital-${i}`,epoch:r.epoch||((state.caseStartedAt||0)+(r.elapsedMs||0)),elapsedMs:r.elapsedMs||0,clock:r.clock||'',kind:'vital',cat:severity==='danger'?'Vitals • Critical':severity==='warn'?'Vitals • Reassess':'Vitals',severity,focus:first||last||severity!=='good'||!!r.note,text:unifiedVitalText(r),recordIndex:i});});
  (state.drugAdministrations||[]).forEach(a=>{items.push({id:a.id||`drug-${a.epoch}`,epoch:a.epoch||0,elapsedMs:a.elapsedMs||0,clock:a.clock||'',kind:'medication',cat:a.voidedAt?'Medication • VOID':'Medication',severity:a.voidedAt?'warn':'neutral',focus:true,text:`${a.drug} • ${fmtDose(Number(a.actual))} ${a.unit||''}${a.route?' • '+a.route:''}${a.administeredBy?' • by '+a.administeredBy:''}${a.voidedAt?' • VOID: '+(a.voidReason||'') : ''}`});});
  (state.complications||[]).forEach(c=>{items.push({id:c.id||`comp-${c.epoch}`,epoch:c.epoch||0,elapsedMs:c.elapsedMs||0,clock:c.clock||'',kind:'complication',cat:'Complication',severity:c.severity==='emergency'?'danger':'warn',focus:true,text:`${c.type}${c.assessment?' • '+c.assessment:''}${c.intervention?' • '+c.intervention:''}`});if(c.resolvedAt)items.push({id:`${c.id}-resolved`,epoch:c.resolvedAt,elapsedMs:c.resolvedElapsedMs||c.elapsedMs||0,clock:c.resolvedClock||formatClock(c.resolvedAt),kind:'resolution',cat:'Complication resolved',severity:'good',focus:true,text:`${c.type} resolved${c.resolutionNote?' • '+c.resolutionNote:''}`});});
  (state.alertEpisodes||[]).forEach(a=>{items.push({id:a.id||`alert-${a.startedAt}`,epoch:a.startedAt||a.epoch||0,elapsedMs:a.elapsedMs||0,clock:a.clock||'',kind:'alert',cat:'Alert',severity:a.peakLevel||a.level||'warn',focus:true,text:`${a.label||a.key} started${a.trigger?' • '+a.trigger:''}${a.acknowledgedAt?' • acknowledged '+formatClock(a.acknowledgedAt):''}`});(a.interventions||[]).forEach((x,idx)=>items.push({id:`${a.id}-int-${idx}`,epoch:x.epoch||((state.caseStartedAt||0)+(x.elapsedMs||0)),elapsedMs:x.elapsedMs||0,clock:x.clock||'',kind:'intervention',cat:'Intervention',severity:'warn',focus:true,text:`${a.label||a.key} • ${x.note}${x.actor?' • '+x.actor:''}`}));if(a.resolvedAt)items.push({id:`${a.id}-resolved`,epoch:a.resolvedAt,elapsedMs:a.resolvedElapsedMs||a.elapsedMs||0,clock:a.resolvedClock||formatClock(a.resolvedAt),kind:'resolution',cat:'Alert resolved',severity:'good',focus:true,text:`${a.label||a.key} resolved • ${formatShortElapsed(a.resolvedAt-(a.startedAt||a.epoch||a.resolvedAt))}`});});
  (state.recoveryRecords||[]).forEach((r,i,arr)=>{const first=i===0,last=i===arr.length-1,p=r.alertProtocol||state.protocolSnapshot?.alertProtocol||WF.defaultAlertProtocol(),levels=[WF.classifyAlert('map',r.map,p),WF.classifyAlert('spo2',r.na?.spo2?null:r.spo2,p),WF.classifyAlert('temp',r.na?.temp?null:r.temp,p)],sev=levels.includes('danger')?'danger':levels.includes('warn')?'warn':'good';items.push({id:r.id||`recovery-${i}`,epoch:r.epoch||((state.recoveryStartedAt||state.caseStartedAt||0)+(r.recoveryElapsedMs||0)),elapsedMs:r.caseElapsedMs||Math.max(0,(r.epoch||0)-(state.caseStartedAt||r.epoch||0)),clock:r.clock||'',kind:'recovery',cat:sev==='danger'?'Recovery • Critical':sev==='warn'?'Recovery • Reassess':'Recovery',severity:sev,focus:first||last||sev!=='good'||!!r.note,text:`HR ${r.hr??'—'} • RR ${r.rr??'—'} • MAP ${r.map??'—'} • SpO₂ ${r.na?.spo2?'N/A':(r.spo2??'—')+(r.spo2==null?'':'%')} • Temp ${r.na?.temp?'N/A':r.temp==null?'—':tempTextF(r.temp)}${r.mentation?' • '+r.mentation:''}${r.note?' • '+r.note:''}`});});
  (state.auditTrail||[]).filter(a=>['CASE_PHASE_CHANGE','WORKFLOW_STEP_CONFIRMED','WORKFLOW_STEP_UNDONE'].includes(a.action)).forEach(a=>items.push({id:a.id||`audit-${a.epoch}`,epoch:a.epoch||0,elapsedMs:a.elapsedMs||0,clock:a.clock||'',kind:'workflow',cat:'Workflow',severity:a.action==='WORKFLOW_STEP_UNDONE'?'warn':'neutral',focus:true,text:a.detail||a.action}));
  return items.sort((a,b)=>(a.epoch||0)-(b.epoch||0)||(a.elapsedMs||0)-(b.elapsedMs||0));
}
function timelineRangeText(records,key,{percent=false,temp=false}={}){const vals=(records||[]).map(r=>Number(r?.[key])).filter(Number.isFinite);if(!vals.length)return '—';const min=Math.min(...vals),max=Math.max(...vals),last=vals.at(-1),fmt=v=>temp?tempTextF(v):`${fmtDose(v)}${percent?'%':''}`;return `${fmt(min)}–${fmt(max)} • last ${fmt(last)}`}
function renderTimelineSpark(svgId,key){const svg=$(svgId);if(!svg)return;const pts=(state.records||[]).map(r=>({x:Number(r.elapsedMs)||0,y:Number(r[key])})).filter(p=>Number.isFinite(p.y));while(svg.firstChild)svg.removeChild(svg.firstChild);if(!pts.length){svg.innerHTML='<text x="110" y="36" text-anchor="middle" class="spark-empty">No data</text>';return}const ns='http://www.w3.org/2000/svg',w=220,h=64,pad=7,minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y)),dx=Math.max(1,maxX-minX),dy=Math.max(1,maxY-minY);const line=document.createElementNS(ns,'polyline');line.setAttribute('class','record-spark-line');line.setAttribute('fill','none');line.setAttribute('points',pts.map(p=>`${pad+(p.x-minX)/dx*(w-pad*2)},${h-pad-(p.y-minY)/dy*(h-pad*2)}`).join(' '));svg.appendChild(line);pts.forEach((p,i)=>{if(i!==0&&i!==pts.length-1)return;const c=document.createElementNS(ns,'circle');c.setAttribute('class','record-spark-point');c.setAttribute('cx',String(pad+(p.x-minX)/dx*(w-pad*2)));c.setAttribute('cy',String(h-pad-(p.y-minY)/dy*(h-pad*2)));c.setAttribute('r','2.6');svg.appendChild(c)});}
function renderUnifiedRecordOverview(){
  const recs=state.records||[],drugs=(state.drugAdministrations||[]).filter(x=>!x.voidedAt),activeProblems=(state.complications||[]).filter(x=>x.status!=='resolved').length+(state.alertEpisodes||[]).filter(x=>!x.resolvedAt).length;
  if($('timelineCaseIdentity'))$('timelineCaseIdentity').innerHTML=`<div><b>${escapeHtml(state.patientName||$('patientName')?.value||'Unnamed patient')}</b><span>${escapeHtml((state.species||$('species')?.value||'—').toUpperCase())} • ${escapeHtml(state.breed||$('breed')?.value||'—')} • BW ${escapeHtml(String(state.weight||$('weight')?.value||'—'))} kg • ASA ${escapeHtml(String(state.asa||$('asa')?.value||'—'))}${state.emergency||$('emergency')?.checked?'-E':''}</span></div><div><b>${escapeHtml(state.procedure||state.patientProcedure||$('procedure')?.value||$('patientProcedure')?.value||'Procedure not specified')}</b><span>HN ${escapeHtml(state.hospitalId||$('hospitalId')?.value||'—')} • Record ${escapeHtml(state.humanRecordId||'—')}</span></div>`;
  if($('timelineCaseStatus'))$('timelineCaseStatus').textContent=state.caseLocked?'LOCKED FINAL':state.recoveryCompletedAt?'Recovery complete':phaseLabel();
  if($('timelineProtocol'))$('timelineProtocol').textContent=state.protocolSnapshot?.version||currentSettingsObject().protocolVersion||'unversioned';
  if($('timelineVitalSummary'))$('timelineVitalSummary').textContent=`${recs.length} • ${recs.length?recs.at(-1).clock:'—'}`;
  if($('timelineMedicationSummary'))$('timelineMedicationSummary').textContent=String(drugs.length);
  if($('timelineProblemSummary')){$('timelineProblemSummary').textContent=activeProblems?`${activeProblems} active`:'0 active';$('timelineProblemSummary').classList.toggle('record-warning',activeProblems>0)}
  if($('timelineRecoverySummary'))$('timelineRecoverySummary').textContent=state.recoveryCompletedAt?'Complete':state.casePhase==='recovery'?'Active':'Not complete';
  const ranges={timelineHrRange:timelineRangeText(recs,'hr'),timelineMapRange:timelineRangeText(recs,'map'),timelineSpo2Range:timelineRangeText(recs,'spo2',{percent:true}),timelineEtco2Range:timelineRangeText(recs,'etco2'),timelineTempRange:timelineRangeText(recs,'temp',{temp:true})};Object.entries(ranges).forEach(([id,v])=>{if($(id))$(id).textContent=v});
  renderTimelineSpark('timelineSparkHr','hr');renderTimelineSpark('timelineSparkMap','map');renderTimelineSpark('timelineSparkSpo2','spo2');renderTimelineSpark('timelineSparkEtco2','etco2');renderTimelineSpark('timelineSparkTemp','temp');
  if($('timelineIntegrityGrid'))$('timelineIntegrityGrid').innerHTML=[['Record ID',state.humanRecordId||'—'],['Case ID',state.caseId||'—'],['Status',state.caseLocked?'LOCKED FINAL':'Working record'],['Final checksum',state.finalChecksum||'Not final locked'],['Last saved',state.lastSavedAt?`${formatDate(state.lastSavedAt)} ${formatClock(state.lastSavedAt)}`:'—'],['Protocol frozen',state.protocolSnapshot?`${state.protocolSnapshot.name||'Protocol'} • ${state.protocolSnapshot.version||'unversioned'}`:'Not frozen']].map(([k,v])=>`<div><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b></div>`).join('');
}
function focusedUnifiedTimelineItems(items){return items.filter(x=>x.focus!==false)}
function renderProcedureTimeline(){
  const all=unifiedTimelineItems(),items=unifiedTimelineMode==='full'?all:focusedUnifiedTimelineItems(all),hidden=Math.max(0,all.length-items.length),el=$('procedureTimeline');
  if(!el)return;
  if(!items.length){el.className='procedure-timeline unified-timeline empty-state';el.textContent='ยังไม่มี Timeline';}
  else{el.className='procedure-timeline unified-timeline';el.innerHTML=items.map(i=>`<div class="procedure-item unified-item ${escapeHtml(i.kind)} ${escapeHtml(i.severity||'neutral')}"><div class="ptime">${escapeHtml(formatShortElapsed(i.elapsedMs||0))}<br><small>${escapeHtml(i.clock||'')}</small></div><div class="pcat">${escapeHtml(i.cat||'Event')}</div><div class="ptext">${escapeHtml(i.text||'')}</div></div>`).join('');}
  if($('timelineRecordCount'))$('timelineRecordCount').textContent=(state.records||[]).length;if($('timelineEventCount'))$('timelineEventCount').textContent=all.filter(x=>x.kind!=='vital'&&x.kind!=='recovery').length;if($('timelineStartClock'))$('timelineStartClock').textContent=state.caseStartedAt?formatClock(state.caseStartedAt):'—';if($('timelineElapsed'))$('timelineElapsed').textContent=formatElapsed(currentElapsed());
  if($('timelineFocusNote'))$('timelineFocusNote').textContent=unifiedTimelineMode==='focus'?(hidden?`Focus view • ${hidden} routine timeline item${hidden===1?'':'s'} hidden • use Full timeline to review every vital record`:'Focus view • all current items are clinically relevant'):`Full timeline • showing ${items.length} item${items.length===1?'':'s'}`;
  $('timelineFocusBtn')?.classList.toggle('primary',unifiedTimelineMode==='focus');$('timelineFullBtn')?.classList.toggle('primary',unifiedTimelineMode==='full');renderUnifiedRecordOverview();window.ANESVET_PROBLEM_RESPONSE_REVIEW?.refresh?.();
}
function reportUnifiedTimelineHtml(){const rows=focusedUnifiedTimelineItems(unifiedTimelineItems()).slice(0,120);return rows.length?`<div class="report-unified-timeline">${rows.map(i=>`<div class="report-event"><b>${escapeHtml(formatShortElapsed(i.elapsedMs||0))}</b><span>${escapeHtml(i.cat||'Event')}</span><div>${escapeHtml(i.text||'')}</div></div>`).join('')}</div>`:'<div style="font-size:8px">No timeline items</div>'}
$('timelineRecordBtn')?.addEventListener('click',()=>addRecord(''));
$('timelineEventBtn')?.addEventListener('click',()=>setTab('events'));
$('timelineFocusBtn')?.addEventListener('click',()=>{unifiedTimelineMode='focus';renderProcedureTimeline()});$('timelineFullBtn')?.addEventListener('click',()=>{unifiedTimelineMode='full';renderProcedureTimeline()});$('timelineOpenTrendsBtn')?.addEventListener('click',()=>setTab('trends'));$('timelineSummaryPdfBtn')?.addEventListener('click',()=>exportPdfSummary());$('timelineFullPdfBtn')?.addEventListener('click',()=>exportPdfReport());


function parseMlNumber(text){return MEDICATION_WORKSPACE_CONTROLLER.parseMlNumber(text)}
function inferredDrugConcentration(drug){return MEDICATION_WORKSPACE_CONTROLLER.inferredDrugConcentration(drug)}
function openDrugAdministration(options){return MEDICATION_WORKSPACE_CONTROLLER.openDrugAdministration(options)}
function closeDrugAdministration(){return MEDICATION_WORKSPACE_CONTROLLER.closeDrugAdministration()}
function recentSameDrugAdministration(drug,windowMs=120000,referenceEpoch=Date.now()){return MEDICATION_WORKSPACE_CONTROLLER.recentSameDrugAdministration(drug,windowMs,referenceEpoch)}
function recordDrugAdministration(options){return MEDICATION_WORKSPACE_CONTROLLER.recordDrugAdministration(options)}
function voidDrugAdministration(id){return MEDICATION_WORKSPACE_CONTROLLER.voidDrugAdministration(id)}
function renderDrugAdministrationAudit(){return MEDICATION_WORKSPACE_CONTROLLER.renderDrugAdministrationAudit()}

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
  addAudit('COMPLICATION_STARTED',`${type} • ${severity}`);save();closeComplicationDialog();renderComplications();renderEvents();renderOrLive();renderProcedureTimeline();document.dispatchEvent(new CustomEvent('anesvet:problem-response-changed'));toast(`${type} complication record started`);
}
function complicationResponse(id,resolve=false){
  if(!clinicalWriteAllowed())return;
  const c=(state.complications||[]).find(x=>String(x.id)===String(id));if(!c||c.status==='resolved')return;
  const promptText=resolve?'Resolution / outcome note (required)':'Response note (optional)';const note=prompt(promptText,'');if(resolve&&!note?.trim()){toast('Resolution note required');return}
  const snap=currentSnapshot(''),r={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),snapshot:snap,note:(note||'').trim()};c.responses=c.responses||[];c.responses.push(r);
  if(resolve){c.status='resolved';c.resolvedAt=r.epoch;c.resolvedElapsedMs=r.elapsedMs;c.resolvedClock=r.clock;c.resolutionNote=r.note;addAudit('COMPLICATION_RESOLVED',`${c.type} • ${r.note}`);addEvent({category:'Complication',name:`${c.type} resolved`,note:`Outcome: ${r.note} • ${snapshotVitalsText(snap)}`,meta:{complicationId:c.id,complicationResolved:true}})}else{addAudit('COMPLICATION_RESPONSE',`${c.type} • ${r.note||snapshotVitalsText(snap)}`);addEvent({category:'Response',name:`${c.type} response`,note:`${snapshotVitalsText(snap)}${r.note?' • '+r.note:''}`,meta:{complicationId:c.id}})}
  save();renderComplications();renderEvents();renderOrLive();renderProcedureTimeline();document.dispatchEvent(new CustomEvent('anesvet:problem-response-changed'));
}
function renderComplications(){
  const arr=state.complications||[],active=arr.filter(c=>c.status!=='resolved');if($('orActiveComplicationCount')){$('orActiveComplicationCount').textContent=`${active.length} ACTIVE`;$('orActiveComplicationCount').className=`status-pill ${active.length?'danger':'good'}`}
  const html=(items,compact=false)=>items.length?items.map(c=>{const last=(c.responses||[]).at(-1);return `<div class="complication-card ${c.status==='resolved'?'resolved':c.severity==='emergency'?'emergency':''}"><div class="complication-head"><b>${escapeHtml(c.type)}</b><span>${escapeHtml(c.status==='resolved'?'RESOLVED':String(c.severity||'observe').toUpperCase())}</span></div><div class="complication-meta">${escapeHtml(formatShortElapsed(c.elapsedMs))} • onset ${escapeHtml(snapshotVitalsText(c.onsetSnapshot||{}))}</div>${compact?'':`<div class="complication-detail">${escapeHtml([c.assessment&&`Assessment: ${c.assessment}`,c.intervention&&`Intervention: ${c.intervention}`,c.note].filter(Boolean).join(' • ')||'No additional note')}</div>`}${last?`<small>Latest response: ${escapeHtml(snapshotVitalsText(last.snapshot||{}))}${last.note?' • '+escapeHtml(last.note):''}</small>`:''}${c.status==='resolved'?`<em>Resolved ${escapeHtml(c.resolvedClock||'')} • ${escapeHtml(c.resolutionNote||'—')}</em>`:`<div class="complication-actions"><button class="btn complication-response" data-id="${escapeHtml(c.id)}" type="button">Capture response</button><button class="btn primary complication-resolve" data-id="${escapeHtml(c.id)}" type="button">Resolve</button></div>`}</div>`}).join(''):'';
  const main=$('complicationList');if(main){if(!arr.length){main.className='complication-list empty-state';main.textContent='ยังไม่มี complication'}else{main.className='complication-list';main.innerHTML=html(arr)}}
  const or=$('orActiveComplications');if(or){if(!active.length){or.className='complication-list empty-state compact';or.textContent='No active complications'}else{or.className='complication-list compact';or.innerHTML=html(active,true)}}
  $$('.complication-response').forEach(b=>b.addEventListener('click',()=>complicationResponse(b.dataset.id,false)));$$('.complication-resolve').forEach(b=>b.addEventListener('click',()=>complicationResponse(b.dataset.id,true)));
}
$('complicationCloseBtn')?.addEventListener('click',closeComplicationDialog);$('complicationCancelBtn')?.addEventListener('click',closeComplicationDialog);$('complicationSaveBtn')?.addEventListener('click',startComplicationRecord);$('addComplicationBtn')?.addEventListener('click',()=>openComplicationDialog('Hypotension'));$$('.quick-complication').forEach(btn=>btn.addEventListener('click',()=>openComplicationDialog(btn.dataset.complication||'')));

function addEvent({category,name,dose='',route='',note='',meta={},epoch=null,elapsedMs=null,clock=null}){
  if(!ensureTimerStarted())return false;
  const eventEpoch=Number.isFinite(Number(epoch))?Number(epoch):Date.now(),eventElapsed=Number.isFinite(Number(elapsedMs))?Number(elapsedMs):currentElapsed(),eventClock=clock||formatClock(eventEpoch);
  const documentedBy=clinicalActorContext();
  const ev={
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),
    epoch:eventEpoch,elapsedMs:eventElapsed,clock:eventClock,
    category,name,dose,route,note,...(meta||{}),...(documentedBy?{documentedBy}:{})
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
  if(!requireCurrentWeight('using Medications'))return;
  const doseEl=btn.dataset.doseid?$(btn.dataset.doseid):null,volEl=btn.dataset.volid?$(btn.dataset.volid):null,drug=btn.dataset.drug||'';
  const legacyPrep=/^(Cefazolin|Convenia)$/i.test(drug);
  const calculated=legacyPrep?`${drug} • legacy BW ÷ factor reference • automatic mL withheld until preparation is configured`:[doseEl?.textContent,volEl?.textContent].filter(Boolean).join(' • ');
  const suggested=legacyPrep?null:parseMlNumber(volEl?.textContent);
  openDrugAdministration({drug,calculated,suggestedMl:suggested,route:'',note:legacyPrep?'Preparation/concentration must be entered manually before saving':'From built-in hospital preset',source:'Built-in hospital preset'});
}));
['diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'].forEach(id=>{
  const el=$(id);if(el){const eventName=el.tagName==='SELECT'?'change':'input';el.addEventListener(eventName,()=>{drugCalc();if(eventName==='change')save({reason:`drug-calc:${id}`});else scheduleAutosave(`drug-calc:${id}`)})}
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
  const cefDiv=protocolNumber('cefazolinDivisor',10),convDiv=protocolNumber('conveniaDivisor',10),cefRaw=w/cefDiv,convRaw=w/convDiv;setText('cefazolinMl',`${fmtVol(cefRaw)} mL`);setText('conveniaMl',`${fmtVol(convRaw)} mL`);if($('cefazolinMl')){$('cefazolinMl').dataset.legacyRawml=String(cefRaw);$('cefazolinMl').dataset.rawml=String(cefRaw)}if($('conveniaMl')){$('conveniaMl').dataset.legacyRawml=String(convRaw);$('conveniaMl').dataset.rawml=String(convRaw)}
  const adrMg=w*protocolNumber('adrenalineDose',0.01),adrConc=Number($('adrenalineConc')?.value||1);setText('adrenalineMg',`${fmtDose(adrMg)} mg`);setText('adrenalineMl',adrConc>0?`${fmtVol(adrMg/adrConc)} mL`:'— mL');
  const atropDose=Number($('atropineMode')?.value||protocolNumber('atropineBradyDose',0.02)),atropMg=w*atropDose,atropConc=Number($('atropineConc')?.value||0.6);setText('atropineMg',`${fmtDose(atropMg)} mg`);setText('atropineMl',atropConc>0?`${fmtVol(atropMg/atropConc)} mL`:'— mL');
  const dopDose=Number($('dopamineDose')?.value||5),dopConc=Number($('dopamineConc')?.value||1),mcgMin=dopDose*w;setText('dopamineMcgMin',`${fmtDose(mcgMin)} μg/min`);setText('dopamineMlHr',dopConc>0?`${fmtVol((mcgMin*60)/(1000*dopConc))} mL/hr`:'— mL/hr');
  const sp=$('species')?.value;if($('nsaidDogCard'))$('nsaidDogCard').style.display=sp==='dog'?'flex':'none';if($('nsaidCatCard'))$('nsaidCatCard').style.display=sp==='cat'?'flex':'none';
  updateDoseSpotlights();updateCustomDrugCalc('induction',false);updateCustomDrugCalc('pre',false);updateCustomDrugCalc('post',false);renderWeightSafetyState();if(state.caseDrugPlanInitialized)renderCaseDrugPlan();
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
['balanceCrystalloid','balanceBolus','balanceBloodIn','balanceBloodLoss','balanceUrine'].forEach(id=>$(id)?.addEventListener('input',()=>{renderLegacyBalanceSummary();scheduleAutosave(`balance:${id}`)}));


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
  if($('orFluidSummary'))$('orFluidSummary').textContent=hasData?`${fmtVol(rate)} mL/hr • ${fmtVol(fm.totalIn)} mL in`:'Not set';
  syncFluidLegacyFields();
}
$('applyFluidRateBtn')?.addEventListener('click',()=>{
  const rate=Number($('orFluidManageRate').value);
  if(!Number.isFinite(rate)||rate<0){toast('กรุณาใส่ fluid rate ที่ถูกต้อง');return}
  applyFluidRate(rate,true);toast(`Fluid rate ${fmtVol(rate)} mL/hr`);
});
$('fluidActualTotal')?.addEventListener('input',()=>{renderOrFluidPanel();renderCaseSummary();scheduleAutosave('fluid:actual-total')});
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
const RECOVERY_CONTROLLER=window.ANESVET_RECOVERY_CONTROLLER?.create?.({
  $,$$,escapeHtml,formatClock,formatElapsed,formatShortElapsed,pad,toast,
  recoveryDomain:RECOVERY_DOMAIN,recoveryOrchestration:RECOVERY_ORCH,getState:()=>state,
  currentElapsed,clinicalWriteAllowed,save,scheduleAutosave,addAudit,addEvent,setTab,renderCasePhase,renderOrLive,renderWorkflowLocks,renderProcedureTimeline,renderEndCase,renderActiveProblems,renderOrUndoControls,
  captureRecoveryHandoff:(reason)=>captureRecoveryHandoff(reason),renderRecoveryHandoff:()=>renderRecoveryHandoff(),focusMedicationReconciliation,
  autoWakeEnabled,requestScreenWakeLock,releaseScreenWakeLock,pauseTimer,fireDueFeedback,handleOrWorkflowAction,
  tempInputStoredF,tempStoredFToDisplay,tempSymbol,tempTextF,getTempDisplayUnit:()=>activeTempDisplayUnit,
  plausibilityWarnings,confirmPlausibility,activeAlertProtocol:()=>activeAlertProtocol(),syncAlertEpisodes:(values,opts)=>syncAlertEpisodes(values,opts),
  bumpAlertObservationRevision:(keys)=>{for(const k of keys||[])alertObservationRevision[k]=(alertObservationRevision[k]||0)+1},
  clone:(v)=>globalThis.AnesvetWorkflow?.clone?.(v)??JSON.parse(JSON.stringify(v)),identityContext:()=>clinicalActorContext(),
  confirm:(msg)=>confirm(msg),prompt:(msg,def='')=>prompt(msg,def),
  securityEnabled:()=>!!SECURITY?.enabled?.(),authenticateForAction:(action,opts)=>SECURITY?.authenticateForAction?.(action,opts)
});
if(!RECOVERY_CONTROLLER)throw new Error('ANESVET recovery-controller.js failed to load');
RECOVERY_CONTROLLER.bind();
BOOT?.mark?.('recovery-bound');
function seedRecoveryVitalsFromCurrent(){return RECOVERY_CONTROLLER.seedVitalsFromCurrent()}
function enterRecoveryAfterExtubation(){return RECOVERY_CONTROLLER.enterAfterExtubation()}
function emergencyReturnToOr(){return RECOVERY_CONTROLLER.emergencyReturnToOr()}
function returnToRecoveryAfterEmergency(){return RECOVERY_CONTROLLER.returnAfterEmergency()}
function recoveryAnyNA(){return RECOVERY_CONTROLLER.anyNA()}
function recoveryObservationNA(key){return RECOVERY_CONTROLLER.observationNA(key)}
function recoveryNAReasonValid(){return RECOVERY_CONTROLLER.naReasonValid()}
function recoveryReadinessSnapshot(){return RECOVERY_CONTROLLER.readinessSnapshot()}
function renderRecoveryFocus(snapshot){return RECOVERY_CONTROLLER.renderFocus(snapshot)}
function copyLastRecoveryVitalsToCurrent(){return RECOVERY_CONTROLLER.copyLastVitals()}
function renderRecovery2Trends(){return RECOVERY_CONTROLLER.renderTrends()}
function renderRecoveryPostopMedication(){return RECOVERY_CONTROLLER.renderPostopMedication()}
function renderRecoveryTransfer(){return RECOVERY_CONTROLLER.renderTransfer()}
// R21: explicitly bridge controller-owned Recovery operations referenced by startup/navigation.
function closeRecoveryMoreDialog(){return RECOVERY_CONTROLLER.closeMoreDialog()}
function recoveryTransferLatest(){return RECOVERY_CONTROLLER.transferLatest()}
function captureRecoveryTransfer(){return RECOVERY_CONTROLLER.captureTransfer()}
function renderRecovery2(){return RECOVERY_CONTROLLER.renderRecovery2()}
function renderRecovery(){return RECOVERY_CONTROLLER.render()}
function currentRecoveryScore(){return RECOVERY_CONTROLLER.currentScore()}
function recoveryScoreText(sc){return RECOVERY_CONTROLLER.scoreText(sc)}
function saveRecoveryScore(){return RECOVERY_CONTROLLER.saveScore()}
function renderRecoveryScores(){return RECOVERY_CONTROLLER.renderScores()}
function addRecoveryRecord(){return RECOVERY_CONTROLLER.addRecord()}
function renderRecoveryRecords(){return RECOVERY_CONTROLLER.renderRecords()}
function updateRecoveryDue(){return RECOVERY_CONTROLLER.updateDue()}
function recoveryElapsed(){return RECOVERY_CONTROLLER.elapsed()}
function renderRecoveryState(){return RECOVERY_CONTROLLER.renderState()}
function beginRecovery(options={}){return RECOVERY_CONTROLLER.begin(options)}
function completeRecovery(){return RECOVERY_CONTROLLER.complete()}



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
  window.AnesvetBranding?.applyReportBranding?.(state);
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
    consent:'Consent / owner discussion',fasting:'Fasting / aspiration risk reviewed',exam:'Pre-anesthetic physical exam',risk:'Anesthetic risk flags reviewed',
    labs:'Lab / imaging reviewed',iv:'IV catheter patent',oxygen:'O₂ source + backup checked',
    machine:'Anesthesia machine leak check',vaporizer:'Vaporizer / agent checked',absorber:'CO₂ absorbent checked',
    airway:'Airway equipment ready',suction:'Suction available',monitor:'Monitor attached / functional',
    warming:'Active warming ready',emergency:'Emergency drugs / crash plan ready'
  };
  $('reportPreop').innerHTML=preopExamReportHtml()+riskAssessmentReportHtml()+`<div class="report-preop-grid">${Object.entries(preopLabels).map(([k,label])=>{const mark=(state.preopChecks||{})[k]?'☑':(state.preopNA||{})[k]?'N/A':'☐';return `<div class="report-preop-item"><span class="mark">${mark}</span><span>${escapeHtml(label)}</span></div>`}).join('')}</div>`;

  const casePlanForReport=(state.protocolSnapshot?.caseDrugPlan||state.caseDrugPlan||[]).map(d=>`${d.name}${d.plannedMl?` ${fmtVol(d.plannedMl)} mL`:''}${d.standby?' [standby]':''}`).join(' • ');$('reportPlanGrid').innerHTML=[reportInfoItem('Premedication',$('planPremed').value||'—'),reportInfoItem('Induction',$('planInduction').value||'—'),reportInfoItem('Maintenance',$('planMaintenance').value||'—'),reportInfoItem('Analgesia',$('planAnalgesia').value||'—'),reportInfoItem('Antibiotic',$('planAntibiotic').value||'—'),reportInfoItem('NSAID',$('planNSAID').value||'—'),reportInfoItem('Block',$('planBlock').value||'—'),reportInfoItem('Case Drug Plan',casePlanForReport||'—'),reportInfoItem('Plan note',$('planNote').value||'—')].join('');const fmReport=getFluidMetrics(),bw=fmReport.w;
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
  if($('reportUnifiedTimeline'))$('reportUnifiedTimeline').innerHTML=reportUnifiedTimelineHtml();
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
  if($('reportProblemResponseReview'))$('reportProblemResponseReview').innerHTML=window.ANESVET_PROBLEM_RESPONSE_REVIEW?.reportHtml?.(state)||'<div style="font-size:8px">Problem-response review unavailable</div>';
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
  <div style="margin-top:6px;font-size:8px"><b>Pain:</b> ${escapeHtml([$('recPainScale')?.value,$('recPainScore')?.value].filter(Boolean).join(' ')||'Not assessed')} • <b>Dysphoria/agitation:</b> ${escapeHtml($('recDysphoria')?.value||'Not assessed')} • <b>Nausea/vomiting:</b> ${escapeHtml($('recNausea')?.value||'Not assessed')} • <b>Mobility:</b> ${escapeHtml($('recAmbulation')?.value||'Not assessed')}</div>
  <div style="margin-top:8px;font-size:9px"><b>Recovery note:</b> ${escapeHtml($('recPain').value||'—')}</div><div style="margin-top:4px;font-size:8px"><b>N/A reason:</b> ${escapeHtml($('recNaReason')?.value||'—')}</div>`;
  const recoveryRows=state.recoveryRecords||[];
  $('reportRecoveryRecords').innerHTML=recoveryRows.length?`<table class="report-recovery-table"><thead><tr><th>#</th><th>Recovery</th><th>Clock</th><th>HR</th><th>RR</th><th>MAP</th><th>SpO₂</th><th>Temp</th><th>O₂</th><th>Mentation</th><th>Pain</th><th>Dysphoria</th><th>N/V</th><th>Mobility</th><th>Note</th></tr></thead><tbody>${recoveryRows.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</td><td>${escapeHtml(r.clock)}</td><td>${r.hr??'—'}</td><td>${r.rr??'—'}</td><td>${r.map??'—'}</td><td>${r.na?.spo2?'N/A':((r.spo2??'—')+(r.spo2==null?'':'%'))}</td><td>${r.na?.temp?'N/A':(r.temp==null?'—':tempTextF(r.temp))}</td><td>${escapeHtml(r.oxygen||'—')}</td><td>${escapeHtml(r.mentation||'—')}</td><td>${escapeHtml([r.painScale,r.painScore].filter(Boolean).join(' ')||'—')}</td><td>${escapeHtml(r.dysphoria||'—')}</td><td>${escapeHtml(r.nausea||'—')}</td><td>${escapeHtml(r.ambulation||'—')}</td><td>${escapeHtml([r.note,r.naReason?`N/A: ${r.naReason}`:''].filter(Boolean).join(' • ')||'—')}</td></tr>`).join('')}</tbody></table>`:'<div style="font-size:8px;margin-top:6px">No serial recovery vital records</div>';
  if($('reportRecoveryHandoff'))$('reportRecoveryHandoff').innerHTML='<h3>Recovery Handoff Summary</h3><pre>'+escapeHtml(handoffText(buildRecoveryHandoffViewModel()))+'</pre>';
  const recoveryScores=state.recoveryScores||[];if($('reportRecoveryScores'))$('reportRecoveryScores').innerHTML=recoveryScores.length?`<div style="margin-top:6px"><b>Recovery Readiness Score history</b>${recoveryScores.map(r=>`<div class="report-event"><b>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</b><span>${r.total}/${r.possible} (${r.percent}%)</span><div>Airway ${escapeHtml(r.domains.airway)} • O₂ ${escapeHtml(r.domains.oxygenation)} • Temp ${escapeHtml(r.domains.temperature)} • Mentation ${escapeHtml(r.domains.mentation)} • Comfort ${escapeHtml(r.domains.comfort)}${r.note?' • '+escapeHtml(r.note):''}${r.naReason?' • N/A: '+escapeHtml(r.naReason):''}</div></div>`).join('')}</div>`:'<div style="font-size:8px;margin-top:6px">No Recovery Readiness Score saved</div>';
  const smart=$('smartAlerts')?.innerText?.trim()||'No smart alerts',responses=state.responses||[];$('reportResponses').innerHTML=`<div style="font-size:8px;margin-bottom:6px"><b>Smart alerts:</b> ${escapeHtml(smart)}</div>`+(responses.length?responses.map(r=>`<div class="report-event"><b>${escapeHtml(r.eventName)}</b><span>+${escapeHtml(formatShortElapsed(r.capturedElapsed-r.eventElapsed))}</span><div>MAP ${r.map??'—'} • HR ${r.hr??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp==null?'—':tempTextF(r.temp)}${r.note?' • '+escapeHtml(r.note):''}</div></div>`).join(''):'<div style="font-size:8px">No intervention-response records</div>');
  const fs=state.finalSignoff||{};$('reportSignAnesthetist').textContent=fs.anesthetist?`${fs.anesthetist.name} • signed ${formatDate(fs.anesthetist.epoch)} ${formatClock(fs.anesthetist.epoch)}`:($('anesthetist').value||'—');
  $('reportSignSurgeon').textContent=fs.surgeon?`${fs.surgeon.name} • signed ${formatDate(fs.surgeon.epoch)} ${formatClock(fs.surgeon.epoch)}`:($('surgeon').value||'—');
  $('reportCompleted').textContent=`${formatDate(Date.now())} ${formatClock()}`;
}
function compactRange(records,key,{temp=false,percent=false}={}){const vals=(records||[]).map(r=>Number(r?.[key])).filter(Number.isFinite);if(!vals.length)return '—';const min=Math.min(...vals),max=Math.max(...vals),last=vals.at(-1),fmt=v=>temp?tempTextF(v):`${fmtDose(v)}${percent?'%':''}`;return `${fmt(min)}–${fmt(max)} • last ${fmt(last)}`}
function milestoneClock(label){const e=(state.events||[]).find(x=>x.category==='Milestone'&&x.name===label)||(state.events||[]).find(x=>x.name===label);return e?.clock||'—'}
function buildCompactPdfReport(){
  window.AnesvetBranding?.applyReportBranding?.(state);
  const recs=state.records||[],drugs=(state.drugAdministrations||[]).filter(x=>!x.voidedAt),fm=getFluidMetrics(),lastRec=recs.at(-1),lastRecovery=(state.recoveryRecords||[]).at(-1),score=(state.recoveryScores||[]).at(-1),risks=(typeof preopRiskSummaryLabels==='function'?preopRiskSummaryLabels({compact:true}):[]),problems=(state.complications||[]),alerts=(state.alertEpisodes||[]),open=[...problems.filter(x=>x.status!=='resolved'),...alerts.filter(x=>!x.resolvedAt)];
  $('summaryReportDate').textContent=`Generated ${formatDate(Date.now())} ${formatClock()}`;const voided=!!state.voidedAt;$('summaryVoidNotice').hidden=!voided;if(voided)$('summaryVoidNotice').textContent=`VOIDED • ${state.voidedBy||'—'} • ${state.voidReason||'—'}`;
  $('summaryPatientBlock').innerHTML=`<div class="compact-summary-name">${escapeHtml(state.patientName||$('patientName')?.value||'Unnamed')}</div><div>${escapeHtml((state.species||$('species')?.value||'—').toUpperCase())} • ${escapeHtml(state.breed||$('breed')?.value||'—')} • BW ${escapeHtml(String(state.weight||$('weight')?.value||'—'))} kg • ASA ${escapeHtml(String(state.asa||$('asa')?.value||'—'))}${state.emergency||$('emergency')?.checked?'-E':''}</div><small>HN ${escapeHtml(state.hospitalId||$('hospitalId')?.value||'—')} • Visit ${escapeHtml(state.visitId||$('visitId')?.value||'—')} • Record ${escapeHtml(state.humanRecordId||'—')}</small>`;
  const summaryPlan=(state.protocolSnapshot?.caseDrugPlan||state.caseDrugPlan||[]).filter(d=>!d.standby).map(d=>d.name).slice(0,5);$('summaryCaseBlock').innerHTML=`<b>${escapeHtml(state.procedure||state.patientProcedure||$('procedure')?.value||$('patientProcedure')?.value||'Procedure not specified')}</b><div>Anesthetist: ${escapeHtml(state.anesthetist||$('anesthetist')?.value||'—')} • Surgeon: ${escapeHtml(state.surgeon||$('surgeon')?.value||'—')}</div><small>Protocol ${escapeHtml(state.protocolSnapshot?.name||currentSettingsObject().protocolName||'—')} • ${escapeHtml(state.protocolSnapshot?.version||currentSettingsObject().protocolVersion||'—')}${summaryPlan.length?` • Plan: ${escapeHtml(summaryPlan.join(', '))}`:''}</small>`;
  $('summaryMilestones').innerHTML=[['Induction',milestoneClock('Induction')],['Surgery start',milestoneClock('Surgery start')],['Surgery end',milestoneClock('Surgery end')],['Extubation',state.extubatedAt?formatClock(state.extubatedAt):milestoneClock('Extubation')],['Recovery complete',state.recoveryCompletedAt?formatClock(state.recoveryCompletedAt):'—'],['Case duration',formatElapsed(state.timer?.elapsedMs||currentElapsed())]].map(([k,v])=>`<div class="compact-kv"><span>${k}</span><b>${escapeHtml(v)}</b></div>`).join('');
  $('summaryVitals').innerHTML=`<div class="compact-kv"><span>HR</span><b>${escapeHtml(compactRange(recs,'hr'))}</b></div><div class="compact-kv"><span>MAP</span><b>${escapeHtml(compactRange(recs,'map'))}</b></div><div class="compact-kv"><span>SpO₂</span><b>${escapeHtml(compactRange(recs,'spo2',{percent:true}))}</b></div><div class="compact-kv"><span>ETCO₂</span><b>${escapeHtml(compactRange(recs,'etco2'))}</b></div><div class="compact-kv"><span>Temp</span><b>${escapeHtml(compactRange(recs,'temp',{temp:true}))}</b></div><small>${recs.length} anesthesia vital record(s)${lastRec?` • last ${escapeHtml(lastRec.clock)}`:''}</small>`;
  const summaryDrugRows=drugs.slice(0,10),extraDrugCount=Math.max(0,drugs.length-summaryDrugRows.length);$('summaryMedications').innerHTML=drugs.length?`<table class="compact-med-table"><thead><tr><th>Time</th><th>Medication</th><th>Actual</th><th>Route</th><th>By</th></tr></thead><tbody>${summaryDrugRows.map(d=>`<tr><td>${escapeHtml(d.clock||formatClock(d.epoch))}</td><td>${escapeHtml(d.drug)}</td><td>${escapeHtml(fmtDose(d.actual))} ${escapeHtml(d.unit||'')}</td><td>${escapeHtml(d.route||'—')}</td><td>${escapeHtml(d.administeredBy||'—')}</td></tr>`).join('')}</tbody></table>${extraDrugCount?`<small>+${extraDrugCount} additional administration(s) — see Full PDF</small>`:''}`:'No confirmed medication administrations';
  $('summaryFluids').innerHTML=`<div class="compact-kv"><span>Crystalloid</span><b>${fmtVol(fm.cryst)} mL</b></div><div class="compact-kv"><span>Bolus</span><b>${fmtVol(fm.bolus)} mL</b></div><div class="compact-kv"><span>Blood in</span><b>${fmtVol(fm.bloodIn)} mL</b></div><div class="compact-kv"><span>Blood loss</span><b>${fmtVol(fm.loss)} mL</b></div><div class="compact-kv"><span>Urine</span><b>${fmtVol(fm.urine)} mL</b></div><div class="compact-kv"><span>Net</span><b>${fmtVol(fm.net)} mL</b></div>`;
  $('summaryRisks').innerHTML=`<b>${risks.length?escapeHtml(risks.slice(0,6).join(' • ')):'No structured risk flags documented'}</b><div>${problems.length} complication(s) • ${alerts.length} alert episode(s) • ${open.length} unresolved at report time</div>${open.length?`<small>Open: ${escapeHtml(open.slice(0,4).map(x=>x.type||x.label||x.key).join(' • '))}</small>`:''}`;
  const transfer=recoveryTransferLatest();$('summaryRecovery').innerHTML=`<div class="compact-recovery-row"><b>${state.recoveryCompletedAt?'✓ Recovery complete':state.casePhase==='recovery'?'Recovery active':'Recovery not completed'}</b><span>${score?`Readiness ${score.total}/${score.possible} (${score.percent}%)`:'No readiness score'}</span></div><div>${lastRecovery?`Latest: HR ${lastRecovery.hr??'—'} • RR ${lastRecovery.rr??'—'} • MAP ${lastRecovery.map??'—'} • SpO₂ ${lastRecovery.na?.spo2?'N/A':lastRecovery.spo2??'—'} • Temp ${lastRecovery.na?.temp?'N/A':lastRecovery.temp==null?'—':tempTextF(lastRecovery.temp)} • ${escapeHtml(lastRecovery.mentation||'')} • Pain ${escapeHtml([lastRecovery.painScale,lastRecovery.painScore].filter(Boolean).join(' ')||'—')} • ${escapeHtml(lastRecovery.ambulation||'mobility not assessed')}`:'No serial recovery vital record'}</div><small>${escapeHtml([transfer?`Transfer ${transfer.destination||'—'} → ${transfer.handoffTo||'—'}`:'',state.recoveryCompletionOverride?`Completion override: ${state.recoveryCompletionOverride.reason||'documented'}`:''].filter(Boolean).join(' • '))}</small>`;
  const fs=state.finalSignoff||{};$('summarySignoff').innerHTML=`<div><span>Anesthetist</span><b>${escapeHtml(fs.anesthetist?.name||state.anesthetist||$('anesthetist')?.value||'—')}</b></div><div><span>Surgeon</span><b>${escapeHtml(fs.surgeon?.name||state.surgeon||$('surgeon')?.value||'—')}</b></div><div><span>Status</span><b>${state.caseLocked?'LOCKED FINAL':state.recoveryCompletedAt?'Recovery complete':'Working record'}</b></div>`;
}
function exportPdfSummary(){buildCompactPdfReport();const oldTitle=document.title,safeName=($('patientName')?.value||state.patientName||'Patient').replace(/[^\wก-๙-]+/g,'_');document.title=`ANESVET_SUMMARY_${safeName}_${formatDate(Date.now())}`;document.body.classList.add('summary-report-mode');setTimeout(()=>{window.print();setTimeout(()=>{document.body.classList.remove('summary-report-mode');document.title=oldTitle},500)},120)}

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
// Backup / restore / rollback / archive-integrity UI and Data Resilience bridge are owned by backup-restore-controller.js

$('printSummaryBtn')?.addEventListener('click',exportPdfSummary);$('printBtn').addEventListener('click',exportPdfReport);
$('printCaseSummaryBtn')?.addEventListener('click',exportPdfSummary);$('printCaseBtn').addEventListener('click',exportPdfReport);

// Final archive write / verification is owned by finalization-archive-controller.js
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
function exportArchivedPdfSummary(i){
  const list=getArchive(),archived=list[i];if(!archived){toast('Archived case not found');return}save();const liveState=JSON.parse(JSON.stringify(state)),oldTitle=document.title;
  try{applyCaseToDomForReport(archived);buildCompactPdfReport();const safeName=(archived.patientName||'Patient').replace(/[^\wก-๙-]+/g,'_');document.title=`ANESVET_SUMMARY_${safeName}_${formatDate(archived.archivedAt||archived.createdAt||Date.now())}`;document.body.classList.add('summary-report-mode');setTimeout(()=>window.print(),120)}catch(e){console.error(e);toast('สร้าง Summary PDF จาก archived case ไม่สำเร็จ')}finally{setTimeout(()=>{document.body.classList.remove('summary-report-mode');document.title=oldTitle;state=liveState;applyCaseToDomForReport(liveState);renderPatientRiskBanner();renderCasePhase();renderCaseSummary();renderRecords();renderEvents();renderComplications();renderDrugAdministrationAudit();renderTrends();renderRecovery();renderRecoveryRecords();renderRecoveryScores();renderOrLive();renderArchives();updateDue()},800)}
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

// Archive list / amendment / VOID / working-copy actions are owned by finalization-archive-controller.js

function appRootUrl(){
  // Resolve the current GitHub Pages directory safely whether the app is
  // opened as /ANESVET/, /ANESVET/index.html, or from the installed PWA.
  const here=new URL(window.location.href);
  let path=here.pathname;
  if(!path.endsWith('/')) path=path.replace(/\/[^/]*$/,'/');
  const url=new URL(path, here.origin);
  url.searchParams.set('v',APP_VERSION);
  return url.href;
}
function restartAtAppRoot(){
  // Use replace instead of reload so GitHub Pages never tries to reload
  // an accidental nested/404 path.
  window.location.replace(appRootUrl());
}



const GENOV_HOSPITAL_PREPARATIONS=Object.freeze({
  cefazolin:Object.freeze({hospital:'Geno V Pet Care',vialMg:1000,diluent:'Sterile water',diluentMl:4,workingConc:250,concUnit:'mg/mL',volumeRule:'BW ÷ 10 mL',route:'IV'}),
  convenia:Object.freeze({hospital:'Geno V Pet Care',workingConc:80,concUnit:'mg/mL',volumeRule:'BW ÷ 10 mL',route:'SC'})
});
function genoVPreparation(key){return GENOV_HOSPITAL_PREPARATIONS[key]||null}
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
function medicationSafetyProfile(d,dose=d?.dose,conc=d?.conc){
  const CV=window.AnesvetClinicalValidation;
  if(CV?.medicationReferenceSafety)return CV.medicationReferenceSafety(d,{dose,conc,concUnit:d?.concUnit});
  const mode=String(d?.mode||'').toLowerCase(),dn=Number(dose),cn=Number(conc);
  if(mode==='manual')return {actionable:false,code:'manual',label:'Manual preparation',reason:'Manual medication'};
  if(!(dn>0))return {actionable:false,code:'dose-missing',label:'Dose/factor required',reason:'Set dose/factor'};
  if(!(cn>0)||!String(d?.concUnit||'').trim())return {actionable:false,code:'preparation-missing',label:'Preparation required',reason:'Configure concentration/preparation'};
  return {actionable:true,code:'ready',label:'Calculation ready',reason:'Preparation configured'};
}
function safeMedicationCalculation(d,w,dose=d?.dose,conc=d?.conc){
  const r=calculateLibraryDrug(d,w,dose,conc),s=medicationSafetyProfile(d,dose,conc),rawMl=Number(r?.ml);
  return {...r,rawMl:Number.isFinite(rawMl)?rawMl:null,actionableMl:s.actionable&&Number.isFinite(rawMl)&&rawMl>0?rawMl:null,safety:s};
}
function builtInPresetSafety(candidate){
  if(!candidate||candidate.type!=='builtin')return null;
  let mode='mgkg',dose=1,conc=0,concUnit='mg/mL';
  if(candidate.id==='builtin_cefazolin'||candidate.id==='builtin_convenia'){
    const key=candidate.id==='builtin_cefazolin'?'cefazolin':'convenia',prep=genoVPreparation(key);
    mode='bwdiv';dose=protocolNumber(key==='cefazolin'?'cefazolinDivisor':'conveniaDivisor',10);conc=prep?.workingConc||0;concUnit=prep?.concUnit||'';
  }else if(candidate.id==='builtin_diazepam'){dose=protocolNumber('diazepamDose',0.25);conc=Number($('diazepamConc')?.value||0)}
  else if(candidate.id==='builtin_propofol'){dose=protocolNumber('propofolDose',4);conc=Number($('propofolConc')?.value||0)}
  else if(candidate.id==='builtin_tramadol'){dose=protocolNumber('tramadolDose',4);conc=Number($('tramadolConc')?.value||0)}
  else if(candidate.id==='builtin_nsaid'){
    const cat=$('species')?.value==='cat';dose=protocolNumber(cat?'meloxicamDose':'carprofenDose',cat?0.3:4.4);conc=Number($(cat?'metacamConc':'rimadylConc')?.value||0);
  }
  return medicationSafetyProfile({mode,dose,conc,concUnit},dose,conc);
}

function builtInPresetCatalog(){
  return [
    {id:'builtin_diazepam',phase:'induction',name:'Diazepam',volId:'diazepamMl'},
    {id:'builtin_propofol',phase:'induction',name:'Propofol',volId:'propofolMl'},
    {id:'builtin_cefazolin',phase:'pre',name:'Cefazolin • Geno V',volId:'cefazolinMl'},
    {id:'builtin_tramadol',phase:'pre',name:'Tramadol',volId:'tramadolMl'},
    {id:'builtin_convenia',phase:'post',name:'Convenia • Geno V',volId:'conveniaMl'},
    {id:'builtin_nsaid',phase:'post',name:'NSAID',volId:null}
  ];
}
function presetCandidateById(id){
  const b=builtInPresetCatalog().find(x=>x.id===id);if(b)return {...b,type:'builtin'};
  const d=hospitalDrugLibrary.find(x=>String(x.id)===String(id));return d?{...d,type:'library'}:null;
}
function presetConcentrationLabel(candidate){
  if(!candidate)return 'Conc —';
  if(candidate.type==='builtin'){
    let concId='';
    if(candidate.id==='builtin_diazepam')concId='diazepamConc';
    else if(candidate.id==='builtin_propofol')concId='propofolConc';
    else if(candidate.id==='builtin_tramadol')concId='tramadolConc';
    else if(candidate.id==='builtin_nsaid')concId=$('species')?.value==='cat'?'metacamConc':'rimadylConc';
    if(concId){
      const n=Number($(concId)?.value);
      return n>0?`Conc ${fmtDose(n)} mg/mL`:'Conc not set';
    }
    if(candidate.id==='builtin_cefazolin'||candidate.id==='builtin_convenia'){const p=genoVPreparation(candidate.id==='builtin_cefazolin'?'cefazolin':'convenia');return p?`Geno V • ${fmtDose(p.workingConc)} ${p.concUnit}`:'Conc not configured'};
    return 'Conc —';
  }
  const n=Number(candidate.conc);
  if(n>0&&candidate.concUnit)return `Conc ${fmtDose(n)} ${candidate.concUnit}`;
  if(candidate.mode==='mlkg'&&Number(candidate.dose)>0)return `${fmtDose(candidate.dose)} mL/kg`;
  if(candidate.mode==='bwdiv'&&Number(candidate.dose)>0)return `BW ÷ ${fmtDose(candidate.dose)}`;
  if(candidate.mode==='manual')return 'Manual preparation';
  return 'Conc not set';
}
function presetCalculated(candidate){
  if(!candidate)return {name:'—',ml:null,rawMl:null,concLabel:'Conc —',safety:{actionable:false,code:'missing-drug',label:'Not selected',reason:''}};
  if(candidate.type==='builtin'){
    let name=candidate.name,raw=null;
    if(candidate.id==='builtin_nsaid'){
      const cat=$('species')?.value==='cat';name=cat?'Meloxicam':'Carprofen';
      raw=Number((cat?$('metacamMl'):$('rimadylMl'))?.dataset?.rawml||parseFloat((cat?$('metacamMl'):$('rimadylMl'))?.textContent));
    }else{
      const el=$(candidate.volId);raw=Number(el?.dataset?.rawml||parseFloat(el?.textContent));
    }
    const safety=builtInPresetSafety(candidate)||{actionable:false,code:'unknown',label:'Verify preparation',reason:''};
    const rawMl=Number.isFinite(raw)?raw:null;
    const concLabel=presetConcentrationLabel(candidate);
    return {name,ml:safety.actionable?rawMl:null,rawMl,concLabel,safety};
  }
  const r=safeMedicationCalculation(candidate,getVal('weight',0)||0,candidate.dose,candidate.conc);
  return {name:candidate.name,ml:r.actionableMl,rawMl:r.rawMl,concLabel:presetConcentrationLabel(candidate),safety:r.safety};
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
  if($('quickPresetWeight'))$('quickPresetWeight').textContent=currentWeightReady()?`${fmtDose(currentWeightKg())} kg`:'BW required';
  const slots=[
    ['qpInd1Label','qpInd1Vol','qpInd1Conc','qpInd1Row','induction',0],['qpInd2Label','qpInd2Vol','qpInd2Conc','qpInd2Row','induction',1],
    ['qpPre1Label','qpPre1Vol','qpPre1Conc','qpPre1Row','pre',0],['qpPre2Label','qpPre2Vol','qpPre2Conc','qpPre2Row','pre',1],
    ['qpPost1Label','qpPost1Vol','qpPost1Conc','qpPost1Row','post',0],['qpPost2Label','qpPost2Vol','qpPost2Conc','qpPost2Row','post',0+1]
  ];
  slots.forEach(([lid,vid,cid,rid,phase,idx])=>{
    const c=presetCandidateById(quickPresets[phase]?.[idx]),r=presetCalculated(c),blocked=!!c&&!r.safety?.actionable;
    if($(lid))$(lid).textContent=r.name;
    if($(vid))$(vid).textContent=!c?'—':blocked?'SET PREP':r.ml==null?'—':fmtVol(r.ml);
    if($(cid)){
      $(cid).textContent=r.concLabel||'Conc —';
      $(cid).classList.toggle('quick-preset-conc-missing',blocked||/not set|not configured|required/i.test(r.concLabel||''));
    }
    if($(rid)){
      $(rid).classList.toggle('quick-preset-empty',!c);
      $(rid).classList.toggle('quick-preset-safety-blocked',blocked);
      $(rid).setAttribute('aria-disabled',String(!c));
      $(rid).title=blocked?(r.safety?.reason||'Configure preparation/concentration before using an automatic volume'):'';
      let note=$(rid).querySelector('.quick-preset-safety-note');
      if(!note){note=document.createElement('small');note.className='quick-preset-safety-note';$(rid).appendChild(note)}
      note.textContent=!c?'':blocked?(r.safety?.reason||'Preparation required'):'Calculation tied to configured preparation';
    }
  });
}
$('saveQuickPresetsBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked — unlock in Settings ก่อนแก้ Quick Presets');return}saveQuickPresetSettings();addProtocolAudit('QUICK_PRESETS_CHANGED',JSON.stringify(loadQuickPresets()))});
$('editQuickPresetsBtn')?.addEventListener('click',()=>{setTab('settings');setTimeout(()=>{const el=$('quickPresetInd1');window.ANESVETProgressiveDisclosure?.openForElement?.(el);el?.scrollIntoView({behavior:'smooth',block:'center'});},80)});
$('quickPresetToPlanBtn')?.addEventListener('click',()=>{$('.case-drug-plan-panel')?.scrollIntoView({behavior:'smooth',block:'start'})});

function currentProtocolDrugDefinitions(){
  const s=currentSettingsObject(),conc=(key,fallback='')=>s[key]??fallback;
  const defs=[
    {id:'diazepamDose',name:'Diazepam',phase:'induction',role:'adjunct',mode:'mgkg',dose:s.diazepamDose,conc:conc('diazepamConc'),concUnit:'mg/mL',route:'IV'},
    {id:'propofolDose',name:'Propofol',phase:'induction',role:'agent',mode:'mgkg',dose:s.propofolDose,conc:conc('propofolConc'),concUnit:'mg/mL',route:'IV'},
    {id:'tramadolDose',name:'Tramadol',phase:'pre',mode:'mgkg',dose:s.tramadolDose,conc:conc('tramadolConc'),concUnit:'mg/mL',route:''},
    {id:'carprofenDose',name:'Carprofen',phase:'post',mode:'mgkg',dose:s.carprofenDose,conc:conc('rimadylConc'),concUnit:'mg/mL',route:''},
    {id:'meloxicamDose',name:'Meloxicam',phase:'post',mode:'mgkg',dose:s.meloxicamDose,conc:conc('metacamConc'),concUnit:'mg/mL',route:''},
    {id:'cefazolinDivisor',name:'Cefazolin',phase:'pre',mode:'bwdiv',dose:s.cefazolinDivisor,conc:250,concUnit:'mg/mL',route:'IV',note:'Geno V Pet Care hospital preparation • 1000 mg vial + sterile water 4 mL → 250 mg/mL • volume BW ÷ 10 mL',hospitalProtocol:'Geno V Pet Care',preparation:{vialMg:1000,diluent:'Sterile water',diluentMl:4,workingConc:250,concUnit:'mg/mL'}},
    {id:'conveniaDivisor',name:'Convenia',phase:'post',mode:'bwdiv',dose:s.conveniaDivisor,conc:80,concUnit:'mg/mL',route:'SC',note:'Geno V Pet Care hospital preparation • 80 mg/mL • volume BW ÷ 10 mL',hospitalProtocol:'Geno V Pet Care',preparation:{workingConc:80,concUnit:'mg/mL'}},
    {id:'adrenalineDose',name:'Adrenaline CPR',phase:'emergency',standby:true,mode:'mgkg',dose:s.adrenalineDose,conc:conc('adrenalineConc',1),concUnit:'mg/mL',route:'IV/IO'},
    {id:'atropineBradyDose',name:'Atropine — bradycardia',phase:'emergency',standby:true,mode:'mgkg',dose:s.atropineBradyDose,conc:conc('atropineConc'),concUnit:'mg/mL',route:'IV'},
    {id:'atropineCprDose',name:'Atropine — CPR',phase:'emergency',standby:true,mode:'mgkg',dose:s.atropineCprDose,conc:conc('atropineConc'),concUnit:'mg/mL',route:'IV'}
  ];
  const species=$('species')?.value||state.species||'';
  const built=defs.filter(d=>d.id!=='carprofenDose'||species!=='cat').filter(d=>d.id!=='meloxicamDose'||species!=='dog');
  return built.concat((hospitalDrugLibrary||[]).filter(d=>d.active!==false).map(d=>({...d,id:'library:'+d.id,standby:d.phase==='emergency'||!!d.standby})));
}
function cloneCasePlanDrug(d){return {id:String(d.id||crypto.randomUUID()),name:d.name||'Medication',phase:d.phase||'pre',role:d.role||'',drugClass:d.drugClass||'',mode:d.mode||'mgkg',dose:d.dose??'',conc:d.conc??'',concUnit:d.concUnit||'',route:d.route||'',note:d.note||'',hospitalProtocol:d.hospitalProtocol||'',preparation:d.preparation?JSON.parse(JSON.stringify(d.preparation)):null,standby:!!d.standby,favorite:!!d.favorite}}
function defaultCaseDrugPlanItems(){
  const all=currentProtocolDrugDefinitions(),byId=new Map(all.map(d=>[String(d.id),d])),qp=loadQuickPresets(),map={builtin_diazepam:'diazepamDose',builtin_propofol:'propofolDose',builtin_cefazolin:'cefazolinDivisor',builtin_tramadol:'tramadolDose',builtin_convenia:'conveniaDivisor'};
  const ids=[];for(const phase of ['induction','pre','post'])for(const raw of qp?.[phase]||[]){const id=map[raw]||('library:'+raw);if(byId.has(id)&&!ids.includes(id))ids.push(id)}
  for(const id of ['adrenalineDose','atropineBradyDose','atropineCprDose'])if(byId.has(id)&&!ids.includes(id))ids.push(id);
  return ids.map(id=>cloneCasePlanDrug(byId.get(id)));
}
function ensureCaseDrugPlanInitialized(){if(state.caseDrugPlanInitialized)return;state.caseDrugPlan=defaultCaseDrugPlanItems();state.caseDrugPlanInitialized=true;save()}
function caseDrugPlanLocked(){return !!state.caseStartedAt||!!state.protocolSnapshot}
function casePlanCalc(d,w=currentWeightReady()?currentWeightKg():null){return calculateLibraryDrug(d,w,d.dose,d.conc)}
function caseDrugPlanPhaseLabel(p){return ({induction:'INDUCTION',pre:'PRE-ANES',post:'POST-ANES',emergency:'EMERGENCY / STANDBY'})[p]||String(p||'OTHER').toUpperCase()}
function renderCaseDrugPlan(){
  const listEl=$('caseDrugPlanList');if(!listEl)return;ensureCaseDrugPlanInitialized();const locked=caseDrugPlanLocked(),all=currentProtocolDrugDefinitions(),selected=new Set((state.caseDrugPlan||[]).map(d=>String(d.id)));
  if($('caseDrugPlanAddSelect'))$('caseDrugPlanAddSelect').innerHTML='<option value="">— Select hospital drug —</option>'+all.filter(d=>!selected.has(String(d.id))).map(d=>`<option value="${escapeHtml(String(d.id))}">${escapeHtml(d.name)} • ${escapeHtml(caseDrugPlanPhaseLabel(d.phase))}</option>`).join('');
  ['autoCaseDrugPlanBtn','caseDrugPlanAddBtn','caseDrugPlanClearBtn'].forEach(id=>{if($(id))$(id).disabled=locked});if($('reviewCaseDrugPlanBtn'))$('reviewCaseDrugPlanBtn').disabled=locked;
  const status=$('caseDrugPlanStatus');if(status){status.className='case-drug-plan-status '+(locked?'frozen':state.caseDrugPlanReviewedAt?'reviewed':'warn');status.textContent=locked?`FROZEN WITH CASE • ${(state.protocolSnapshot?.caseDrugPlan||state.caseDrugPlan||[]).length} medication(s)`:state.caseDrugPlanReviewedAt?`✓ Reviewed ${new Date(state.caseDrugPlanReviewedAt).toLocaleString()} • ${state.caseDrugPlanReviewedBy||'Unspecified'}`:'⚠ Plan not reviewed — edit then Save / Review plan'}
  const items=locked&&Array.isArray(state.protocolSnapshot?.caseDrugPlan)?state.protocolSnapshot.caseDrugPlan:(state.caseDrugPlan||[]);if(!items.length){listEl.innerHTML='<div class="empty-state compact">No medications selected for this case. Add drugs or rebuild from hospital protocol.</div>';return}
  const w=currentWeightReady()?currentWeightKg():state.caseIdentitySnapshot?.weight||null;
  listEl.innerHTML=items.map((d,i)=>{const r=safeMedicationCalculation(d,w,d.dose,d.conc),blocked=!r.safety.actionable,vol=r.actionableMl!==null?`${fmtVol(r.actionableMl)} mL`:blocked?'Preparation required':'Dose/concentration incomplete',meta=blocked?(r.safety.reason||'No automatic volume'):(d.standby?'STANDBY':'planned reference');return `<article class="case-drug-plan-item ${d.standby?'standby':''} ${blocked?'reference-blocked':''}"><div class="case-drug-plan-main"><span class="case-drug-phase">${escapeHtml(caseDrugPlanPhaseLabel(d.phase))}</span><b>${escapeHtml(d.name)}</b><small>${escapeHtml([d.dose?`${d.dose} ${d.mode==='mcgkg'?'μg/kg':d.mode==='mgkg'?'mg/kg':d.mode==='mlkg'?'mL/kg':d.mode==='bwdiv'?'BW ÷ factor':''}`:'',d.conc?`${d.conc} ${d.concUnit||''}`:'',d.route].filter(Boolean).join(' • ')||'Manual / verify preparation')}</small>${doseReferenceBrief(d.name)?doseReferenceButtonHtml(d.name,currentDoseReferenceSpecies(),'Reference'):''}</div><div class="case-drug-plan-volume"><b>${escapeHtml(vol)}</b><small>${escapeHtml(meta)}</small></div>${locked?'':`<button type="button" class="case-drug-plan-remove" data-plan-index="${i}" aria-label="Remove ${escapeHtml(d.name)}">×</button>`}</article>`}).join('');
  $$('.case-drug-plan-remove').forEach(b=>b.addEventListener('click',()=>{if(caseDrugPlanLocked())return;state.caseDrugPlan.splice(Number(b.dataset.planIndex),1);state.caseDrugPlanReviewedAt=null;state.caseDrugPlanReviewedBy='';save();renderCaseDrugPlan()}));
}
function autoBuildCaseDrugPlan(){if(caseDrugPlanLocked()){toast('Case already started — drug plan is frozen');return}state.caseDrugPlan=defaultCaseDrugPlanItems();state.caseDrugPlanInitialized=true;state.caseDrugPlanReviewedAt=null;state.caseDrugPlanReviewedBy='';save();renderCaseDrugPlan();toast('Case Drug Plan rebuilt from hospital protocol')}
function addCaseDrugPlanItem(){if(caseDrugPlanLocked())return;const id=$('caseDrugPlanAddSelect')?.value;if(!id)return;const d=currentProtocolDrugDefinitions().find(x=>String(x.id)===String(id));if(!d)return;state.caseDrugPlan??=[];if(!state.caseDrugPlan.some(x=>String(x.id)===String(id)))state.caseDrugPlan.push(cloneCasePlanDrug(d));state.caseDrugPlanInitialized=true;state.caseDrugPlanReviewedAt=null;state.caseDrugPlanReviewedBy='';save();renderCaseDrugPlan();toast(`${d.name} added to Case Drug Plan`)}
function reviewCaseDrugPlan(){if(caseDrugPlanLocked())return;const by=$('anesthetist')?.value.trim()||prompt('Reviewed by','')||'';if(!by.trim()){toast('ระบุผู้ทบทวนแผนยา');return}const w=currentWeightReady()?currentWeightKg():Number(state.weight)||null,blocked=(state.caseDrugPlan||[]).filter(d=>!medicationSafetyProfile(d,d.dose,d.conc).actionable&&d.mode!=='manual');if(blocked.length&&!confirm(`มี ${blocked.length} รายการที่ยังไม่มี preparation/concentration พร้อมสำหรับ auto-fill:
${blocked.map(d=>'• '+d.name).join('\n')}

บันทึกแผนต่อได้ แต่ ANESVET จะไม่แสดง/เติม mL อัตโนมัติสำหรับรายการเหล่านี้ จนกว่าจะกำหนด preparation ให้ครบ.

Continue review?`))return;state.caseDrugPlanReviewedAt=Date.now();state.caseDrugPlanReviewedBy=by.trim();addAudit('CASE_DRUG_PLAN_REVIEWED',`${(state.caseDrugPlan||[]).length} planned medication(s) • ${blocked.length} preparation-blocked`,by.trim());save();renderCaseDrugPlan();toast(blocked.length?'✓ Plan reviewed • some medication volumes remain manual':'✓ Case Drug Plan saved / reviewed')}
$('autoCaseDrugPlanBtn')?.addEventListener('click',autoBuildCaseDrugPlan);$('caseDrugPlanAddBtn')?.addEventListener('click',addCaseDrugPlanItem);$('caseDrugPlanClearBtn')?.addEventListener('click',()=>{if(caseDrugPlanLocked())return;if(!confirm('Clear all medications from this Case Drug Plan?'))return;state.caseDrugPlan=[];state.caseDrugPlanInitialized=true;state.caseDrugPlanReviewedAt=null;state.caseDrugPlanReviewedBy='';save();renderCaseDrugPlan()});$('reviewCaseDrugPlanBtn')?.addEventListener('click',reviewCaseDrugPlan);

const normalizeDrugLibrary=window.ANESVET_APP_UTILS.normalizeDrugLibrary;
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

const formulaLabel=window.ANESVET_APP_UTILS.formulaLabel;

const drugPhaseLabel=window.ANESVET_APP_UTILS.drugPhaseLabel;

function renderDrugLibrarySettings(){
  const box=$('drugLibraryRows');if(!box)return;
  box.innerHTML=hospitalDrugLibrary.map((d,i)=>`
    <div class="drug-library-row ${(!medicationSafetyProfile(d,d.dose,d.conc).actionable&&d.mode!=='manual')?'library-incomplete':''}" data-index="${i}">
      <label>Drug name<input data-field="name" type="text" value="${escapeHtml(d.name||'')}"></label>
      <label>Phase<select data-field="phase">
        <option value="induction" ${d.phase==='induction'?'selected':''}>Induction</option>
        <option value="pre" ${d.phase==='pre'?'selected':''}>Pre-anes</option>
        <option value="post" ${d.phase==='post'?'selected':''}>Post-anes</option>
        <option value="emergency" ${d.phase==='emergency'?'selected':''}>Emergency / standby</option>
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
      <div class="drug-library-reference"><button class="ck-drug-link session-safe" type="button" data-ck-drug="${escapeHtml(d.name)}">Drug knowledge ↗</button>${doseReferenceBrief(d.name)?doseReferenceButtonHtml(d.name,currentDoseReferenceSpecies(),'Reference range'):'<span>No loaded reference — verify source / hospital protocol</span>'}</div>
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
  renderDrugLibrarySettings();renderProtocolDoseReview();
});
$('drugLibraryRows')?.addEventListener('click',e=>{
  const btn=e.target.closest('[data-remove]');if(!btn)return;
  readDrugLibrarySettings();hospitalDrugLibrary.splice(Number(btn.dataset.remove),1);renderDrugLibrarySettings();renderProtocolDoseReview();
});
$('saveDrugLibraryBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked — unlock before saving Drug Library');return}
  readDrugLibrarySettings();
  localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(hospitalDrugLibrary));
  renderPhaseDrugSelectors();renderFavoriteDrugButtons();renderQuickPresetSettings();renderQuickPresetSummary();addProtocolAudit('DRUG_LIBRARY_CHANGED',`${hospitalDrugLibrary.length} drugs`);renderProtocolGovernance();renderProtocolDoseReview();toast('Hospital Drug Library saved');
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
  const r=safeMedicationCalculation(d,w,$(c.dose)?.value,$(c.conc)?.value);
  if($(c.total))$(c.total).textContent=r.total;
  if($(c.ml))$(c.ml).textContent=r.actionableMl==null?(r.safety?.code==='preparation-missing'?'PREP REQUIRED':'— mL'):`${fmtVol(r.actionableMl)} mL`;
  if($(c.meta)){$(c.meta).textContent=`${d.name} • ${d.drugClass||'Unclassified'} • ${formulaLabel(d.mode,d.concUnit)}${d.route?' • '+d.route:''}${r.safety?.actionable?'':' • '+(r.safety?.label||'Verify preparation')}${doseReferenceBrief(d.name)?' • REF '+doseReferenceBrief(d.name):''}`;$(c.meta).classList.toggle('has-dose-reference',!!doseReferenceBrief(d.name));}
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
  const r=safeMedicationCalculation(d,currentWeightReady()?currentWeightKg():0,$(c.dose)?.value,$(c.conc)?.value);
  if(r.actionableMl==null){toast(r.safety?.reason||'ยังไม่พร้อมคำนวณ mL — ตรวจ dose และ preparation/concentration');return}
  openDrugAdministration({drug:d.name,calculated:`${r.total} • ${fmtVol(r.actionableMl)} mL`,suggestedMl:r.actionableMl,route:d.route||'',note:`${drugPhaseLabel(phase)} • Hospital Drug Library`,concentration:$(c.conc)?.value?`${$(c.conc).value} ${d.concUnit||((d.mode==='mcgkg')?'μg/mL':'mg/mL')}`:'',source:'Hospital Drug Library'});
}));


function defaultSettings(){return{interval:'5',recoveryInterval:'5',temperatureUnit:'C',orMoreProfile:'minimal',orQuickMedCount:'4',orFocusMode:true,showMiniTrends:true,showRecentActivity:true,defaultReport:'summary',diazepamConc:'5',propofolConc:'10',tramadolConc:'50',rimadylConc:'50',metacamConc:'5',atropineConc:'0.6',diazepamDose:'0.25',propofolDose:'4',tramadolDose:'4',carprofenDose:'4.4',meloxicamDose:'0.3',cefazolinDivisor:'10',conveniaDivisor:'10',adrenalineDose:'0.01',atropineBradyDose:'0.02',atropineCprDose:'0.04',protocolName:'Hospital anesthesia protocol',protocolVersion:'',protocolVerifiedAt:'',protocolLocked:false,autoWakeLock:true,showSapDap:true,criticalPopupEnabled:true,pilotSiteName:'',pilotReporter:'',pilotIncludeContext:true}}
function loadSettings(){
  let s;try{s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||JSON.parse(localStorage.getItem('anesvet_v14_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v14_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_4_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_3_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v12_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v12_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v11_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v10_settings')||'null')}catch(e){}
  s={...defaultSettings(),...(s||{})};delete s.pilotFeedbackEndpoint;
  try{const stored=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null');if(stored&&Object.prototype.hasOwnProperty.call(stored,'pilotFeedbackEndpoint')){delete stored.pilotFeedbackEndpoint;localStorage.setItem(SETTINGS_KEY,JSON.stringify(stored))}}catch(e){}
  const map={settingInterval:'interval',settingRecoveryInterval:'recoveryInterval',settingOrMoreProfile:'orMoreProfile',settingQuickMedCount:'orQuickMedCount',settingDefaultReport:'defaultReport',settingTemperatureUnit:'temperatureUnit',settingDiazepamConc:'diazepamConc',settingPropofolConc:'propofolConc',settingTramadolConc:'tramadolConc',settingRimadylConc:'rimadylConc',settingMetacamConc:'metacamConc',settingAtropineConc:'atropineConc',settingDiazepamDose:'diazepamDose',settingPropofolDose:'propofolDose',settingTramadolDose:'tramadolDose',settingCarprofenDose:'carprofenDose',settingMeloxicamDose:'meloxicamDose',settingCefazolinDivisor:'cefazolinDivisor',settingConveniaDivisor:'conveniaDivisor',settingAdrenalineDose:'adrenalineDose',settingAtropineBradyDose:'atropineBradyDose',settingAtropineCprDose:'atropineCprDose',settingProtocolName:'protocolName',settingProtocolVersion:'protocolVersion',settingProtocolVerifiedAt:'protocolVerifiedAt'};
  Object.entries(map).forEach(([id,key])=>{if($(id))$(id).value=s[key]??''});
  if($('settingAutoWakeLock'))$('settingAutoWakeLock').checked=s.autoWakeLock!==false;
  if($('settingShowSapDap'))$('settingShowSapDap').checked=s.showSapDap!==false;
  if($('settingCriticalPopup'))$('settingCriticalPopup').checked=s.criticalPopupEnabled!==false;
  if($('settingOrFocusMode'))$('settingOrFocusMode').checked=s.orFocusMode!==false;
  if($('settingShowMiniTrends'))$('settingShowMiniTrends').checked=s.showMiniTrends!==false;
  if($('settingShowRecentActivity'))$('settingShowRecentActivity').checked=s.showRecentActivity!==false;
  if($('settingPilotSiteName'))$('settingPilotSiteName').value=s.pilotSiteName||'';if($('settingPilotReporter'))$('settingPilotReporter').value=s.pilotReporter||'';if($('settingPilotIncludeContext'))$('settingPilotIncludeContext').checked=s.pilotIncludeContext!==false;renderPilotFeedbackStatus();
  setTemperatureDisplayUnit(s.temperatureUnit,{convertInputs:true,rerender:false});
  renderSapDapVisibility();
  renderBuiltInProtocolChips(s);
  renderProtocolGovernance();renderProtocolDoseReview();renderOrWorkspacePreferences();renderDefaultReportPreference();window.AnesvetBranding?.loadForm?.();window.AnesvetBranding?.renderAppHeader?.();
}
function applyHospitalDefaultsToFreshCaseUi(){
  const cfg=currentSettingsObject();
  const defaults={recordInterval:cfg.interval,recRecordInterval:cfg.recoveryInterval||cfg.interval,diazepamConc:cfg.diazepamConc,propofolConc:cfg.propofolConc,tramadolConc:cfg.tramadolConc,rimadylConc:cfg.rimadylConc,metacamConc:cfg.metacamConc,atropineConc:cfg.atropineConc};
  Object.entries(defaults).forEach(([id,value])=>{
    // Existing/current cases retain their saved case-specific value. A true fresh/reset case
    // inherits only operational hospital defaults, not old patient/clinical data.
    if(!(id in state)&&$(id))$(id).value=value??'';
  });
}
$('saveSettingsBtn')?.addEventListener('click',()=>{
  const old=currentSettingsObject(),locked=!!old.protocolLocked;
  const newTempUnit=normalizeTempUnit($('settingTemperatureUnit')?.value||old.temperatureUnit);setTemperatureDisplayUnit(newTempUnit,{convertInputs:true,rerender:false});
  const s={...old,interval:$('settingInterval').value,recoveryInterval:$('settingRecoveryInterval')?.value||old.recoveryInterval||old.interval,orMoreProfile:$('settingOrMoreProfile')?.value||'minimal',orQuickMedCount:$('settingQuickMedCount')?.value||'4',defaultReport:$('settingDefaultReport')?.value||'summary',orFocusMode:$('settingOrFocusMode')?.checked!==false,showMiniTrends:$('settingShowMiniTrends')?.checked!==false,showRecentActivity:$('settingShowRecentActivity')?.checked!==false,pilotSiteName:$('settingPilotSiteName')?.value.trim()||old.pilotSiteName||'',pilotReporter:$('settingPilotReporter')?.value.trim()||old.pilotReporter||'',pilotIncludeContext:$('settingPilotIncludeContext')?.checked!==false,temperatureUnit:newTempUnit,autoWakeLock:$('settingAutoWakeLock')?.checked!==false,showSapDap:$('settingShowSapDap')?.checked!==false,criticalPopupEnabled:$('settingCriticalPopup')?.checked!==false};
  if(!locked){
    Object.assign(s,{diazepamConc:$('settingDiazepamConc').value,propofolConc:$('settingPropofolConc').value,tramadolConc:$('settingTramadolConc').value,rimadylConc:$('settingRimadylConc').value,metacamConc:$('settingMetacamConc').value,atropineConc:$('settingAtropineConc').value,diazepamDose:$('settingDiazepamDose').value,propofolDose:$('settingPropofolDose').value,tramadolDose:$('settingTramadolDose').value,carprofenDose:$('settingCarprofenDose').value,meloxicamDose:$('settingMeloxicamDose').value,cefazolinDivisor:$('settingCefazolinDivisor').value,conveniaDivisor:$('settingConveniaDivisor').value,adrenalineDose:$('settingAdrenalineDose').value,atropineBradyDose:$('settingAtropineBradyDose').value,atropineCprDose:$('settingAtropineCprDose').value,protocolName:$('settingProtocolName')?.value.trim()||'Hospital anesthesia protocol',protocolVersion:$('settingProtocolVersion')?.value.trim()||'',protocolVerifiedAt:$('settingProtocolVerifiedAt')?.value||''});
  }
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  if($('orlive')?.classList.contains('active'))document.body.classList.toggle('or-mobile-active',s.orFocusMode!==false);
  if(!state.caseStartedAt){$('recordInterval').value=s.interval;if($('recRecordInterval'))$('recRecordInterval').value=s.recoveryInterval||s.interval;$('diazepamConc').value=s.diazepamConc;$('propofolConc').value=s.propofolConc;$('tramadolConc').value=s.tramadolConc;$('rimadylConc').value=s.rimadylConc;$('metacamConc').value=s.metacamConc;$('atropineConc').value=s.atropineConc;}renderBuiltInProtocolChips(s);
  addProtocolAudit('HOSPITAL_SETTINGS_SAVED',`Protocol ${s.protocolVersion||'unversioned'} • temp=${s.temperatureUnit} • showSapDap=${s.showSapDap!==false} • criticalPopup=${s.criticalPopupEnabled!==false} • locked=${!!s.protocolLocked}`);renderSapDapVisibility();renderRecords();renderRecoveryRecords();renderTrends();renderProcedureTimeline();renderResponses();updateDashboard();renderOrLive();renderProtocolGovernance();renderProtocolDoseReview();renderDefaultReportPreference();toast(locked?'General settings saved • protocol remains locked':'Hospital settings saved');
});

function getPilotFeedbackQueue(){try{const q=JSON.parse(localStorage.getItem(PILOT_FEEDBACK_KEY)||'[]');return Array.isArray(q)?q:[]}catch(e){return[]}}
function setPilotFeedbackQueue(q){try{localStorage.setItem(PILOT_FEEDBACK_KEY,JSON.stringify((q||[]).slice(-PILOT_FEEDBACK_MAX)));return true}catch(e){console.error(e);return false}}
function pilotFeedbackId(){const d=new Date(),pad=n=>String(n).padStart(2,'0'),r=Math.random().toString(36).slice(2,7).toUpperCase();return `FB-${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}-${r}`}
function activeTabId(){return document.querySelector('.tabpage.active')?.id||localStorage.getItem(TAB_KEY)||'unknown'}
function anonymizedCaseContext(){const elapsed=Math.round(currentElapsed()/1000);return{tab:activeTabId(),casePhase:state.casePhase||'preop',workflowProfile:state.caseWorkflowProfile||$('caseWorkflowProfile')?.value||'routine',species:state.species||$('species')?.value||'',asa:state.asa||$('asa')?.value||'',emergency:!!(state.emergency||$('emergency')?.checked),caseElapsedSec:Number.isFinite(elapsed)?elapsed:0,anesthesiaRecordCount:(state.records||[]).length,recoveryRecordCount:(state.recoveryRecords||[]).length,eventCount:(state.events||[]).length,drugAdministrationCount:(state.drugAdministrations||[]).length,complicationCount:(state.complications||[]).length,activeAlertCount:(state.alertEpisodes||[]).filter(x=>!x.resolvedAt).length}}
function pilotDeviceContext(){let standalone=false;try{standalone=window.matchMedia?.('(display-mode: standalone)')?.matches||navigator.standalone===true}catch(e){}return{userAgent:navigator.userAgent||'',platform:navigator.userAgentData?.platform||navigator.platform||'',language:navigator.language||'',viewport:`${window.innerWidth}x${window.innerHeight}`,screen:`${screen.width}x${screen.height}`,pixelRatio:window.devicePixelRatio||1,online:navigator.onLine!==false,standalone,touchPoints:navigator.maxTouchPoints||0,timezone:Intl.DateTimeFormat().resolvedOptions().timeZone||''}}
function pilotDiagnostics(){const cfg=currentSettingsObject();return{orMenuProfile:cfg.orMoreProfile||'minimal',orFocusMode:cfg.orFocusMode!==false,defaultReport:cfg.defaultReport||'summary',saveState:$('saveState')?.textContent||'',connectivityState:$('connectivityState')?.textContent||'',visibility:document.visibilityState||'',fullscreen:!!document.fullscreenElement}}
function getRuntimeErrorLog(){try{const x=JSON.parse(localStorage.getItem(RUNTIME_ERROR_KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return[]}}
function recordRuntimeError(message,source='',line=0,column=0,stack=''){try{const arr=getRuntimeErrorLog();arr.push({epoch:Date.now(),message:String(message||'Unknown error').slice(0,1000),source:String(source||'').slice(0,300),line:Number(line)||0,column:Number(column)||0,stack:String(stack||'').slice(0,2000)});localStorage.setItem(RUNTIME_ERROR_KEY,JSON.stringify(arr.slice(-RUNTIME_ERROR_MAX)))}catch(e){}try{BOOT?.issue?.('runtime',String(message||'Unknown error'),`${source||'unknown source'}:${line||0}:${column||0} • ${String(stack||'').slice(0,1000)}`)}catch(_){/* Never block clinical entry for diagnostics. */}}
window.addEventListener('error',e=>recordRuntimeError(e.message,e.filename,e.lineno,e.colno,e.error?.stack||''));
window.addEventListener('unhandledrejection',e=>recordRuntimeError(e.reason?.message||String(e.reason||'Unhandled promise rejection'),'promise',0,0,e.reason?.stack||''));
function renderPilotFeedbackStatus(){
  if($('pilotSupportEmailLabel'))$('pilotSupportEmailLabel').textContent=window.AnesvetSupport?.SUPPORT_EMAIL||'anesvetth@gmail.com';
  if($('pilotSupportFacebookLabel'))$('pilotSupportFacebookLabel').textContent='Facebook Page: Anesvet';
}
function openPilotFeedbackDialog(){const d=$('pilotFeedbackDialog'),cfg=currentSettingsObject();if(!d)return;if($('pilotFeedbackReporter'))$('pilotFeedbackReporter').value=cfg.pilotReporter||'';if($('pilotFeedbackIncludeContext'))$('pilotFeedbackIncludeContext').checked=cfg.pilotIncludeContext!==false;if($('pilotFeedbackAutoContext'))$('pilotFeedbackAutoContext').textContent=`V${APP_VERSION} • ${activeTabId()} • ${state.casePhase||'preop'} • ${window.innerWidth}×${window.innerHeight} • ${navigator.onLine===false?'offline':'online'}`;if($('pilotFeedbackError'))$('pilotFeedbackError').textContent='';setPilotFeedbackSubmitState('', '');try{if(!d.open)d.showModal()}catch(e){d.setAttribute('open','')}}
function setPilotFeedbackSubmitState(message='',kind=''){const el=$('pilotFeedbackSubmitState');if(!el)return;el.textContent=message||'';el.className='pilot-feedback-submit-state'+(kind?` ${kind}`:'');el.hidden=!message}
function showFeedbackDeliveryBanner(message,kind='success'){const el=$('feedbackDeliveryBanner');if(!el){toast(message);return}el.textContent=message;el.className=`feedback-delivery-banner ${kind}`;el.hidden=false;clearTimeout(showFeedbackDeliveryBanner._t);showFeedbackDeliveryBanner._t=setTimeout(()=>{el.hidden=true},4800)}
function closePilotFeedbackDialog(){const d=$('pilotFeedbackDialog');if(d?.open){try{d.close()}catch(e){d.removeAttribute('open')}}}
function makeSupportReport(){
  const summary=$('pilotFeedbackSummary')?.value.trim()||'',description=$('pilotFeedbackDescription')?.value.trim()||'';
  if(!summary||!description){if($('pilotFeedbackError'))$('pilotFeedbackError').textContent='กรุณากรอก Short summary และ What happened';return null}
  const cfg=currentSettingsObject(),include=$('pilotFeedbackIncludeContext')?.checked!==false,now=Date.now();
  return{reportId:pilotFeedbackId(),appVersion:APP_VERSION,createdAt:now,createdAtIso:new Date(now).toISOString(),site:cfg.pilotSiteName||'',reporter:$('pilotFeedbackReporter')?.value.trim()||cfg.pilotReporter||'',category:$('pilotFeedbackCategory')?.value||'bug',severity:$('pilotFeedbackSeverity')?.value||'medium',reproducible:$('pilotFeedbackRepro')?.value||'unknown',summary,description,expected:$('pilotFeedbackExpected')?.value.trim()||'',caseContext:include?anonymizedCaseContext():null,device:pilotDeviceContext(),diagnostics:pilotDiagnostics(),runtimeErrors:getRuntimeErrorLog().slice(-3)}
}
async function copyTextCompat(text){try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);return true}}catch(e){}try{const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();const ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}}
function rememberSupportReporter(){const old=currentSettingsObject(),s={...old,pilotSiteName:$('settingPilotSiteName')?.value.trim()||old.pilotSiteName||'',pilotReporter:$('pilotFeedbackReporter')?.value.trim()||old.pilotReporter||'',pilotIncludeContext:$('pilotFeedbackIncludeContext')?.checked!==false};delete s.pilotFeedbackEndpoint;try{localStorage.setItem(SETTINGS_KEY,JSON.stringify(s))}catch(e){}}
function openSupportEmail(){
  if($('pilotFeedbackError'))$('pilotFeedbackError').textContent='';const report=makeSupportReport();if(!report)return;
  if(!window.AnesvetSupport){setPilotFeedbackSubmitState('Support composer unavailable — reload the app.','error');return}
  rememberSupportReporter();const body=window.AnesvetSupport.buildReportText(report);copyTextCompat(body).catch(()=>{});
  setPilotFeedbackSubmitState(`Opening email to ${window.AnesvetSupport.SUPPORT_EMAIL} • ${report.reportId}`,'success');
  showFeedbackDeliveryBanner(`Email report prepared • ${report.reportId}`,'success');
  window.location.href=window.AnesvetSupport.emailUrl(report);
}
async function copySupportReport(){if($('pilotFeedbackError'))$('pilotFeedbackError').textContent='';const report=makeSupportReport();if(!report)return;if(!window.AnesvetSupport){setPilotFeedbackSubmitState('Support composer unavailable — reload the app.','error');return}const ok=await copyTextCompat(window.AnesvetSupport.buildReportText(report));setPilotFeedbackSubmitState(ok?`✓ Report text copied • ${report.reportId}`:`Unable to copy automatically • ${report.reportId}`,ok?'success':'error');if(ok)showFeedbackDeliveryBanner('✓ Report text copied','success')}
function openSupportFacebook(){
  if($('pilotFeedbackError'))$('pilotFeedbackError').textContent='';const report=makeSupportReport();if(!report)return;if(!window.AnesvetSupport){setPilotFeedbackSubmitState('Support composer unavailable — reload the app.','error');return}
  rememberSupportReporter();const text=window.AnesvetSupport.buildReportText(report);copyTextCompat(text).then(ok=>{setPilotFeedbackSubmitState(ok?'Report text copied — paste it in a message to Facebook Page “Anesvet”.':'Facebook opened — copy the report text manually if needed.','success')});
  const url=window.AnesvetSupport.FACEBOOK_SEARCH;const w=window.open(url,'_blank','noopener');if(!w)window.location.href=url;
}
function resetPilotFeedbackForm(){for(const id of ['pilotFeedbackSummary','pilotFeedbackDescription','pilotFeedbackExpected'])if($(id))$(id).value='';if($('pilotFeedbackCategory'))$('pilotFeedbackCategory').value='bug';if($('pilotFeedbackSeverity'))$('pilotFeedbackSeverity').value='medium';if($('pilotFeedbackRepro'))$('pilotFeedbackRepro').value='unknown'}
function renderClinicalValidation(result){
  const box=$('clinicalValidationResults'),badge=$('clinicalValidationBadge');if(!box||!badge)return;
  const checks=result?.checks||[];box.innerHTML=checks.map(x=>`<div class="clinical-validation-check ${x.ok?'pass':'fail'}"><b>${x.ok?'✓':'⚠'} ${escapeHtml(x.label)}</b><span>${escapeHtml(x.detail||'')}</span></div>`).join('');
  badge.textContent=result?.ok?`PASS ${result.passed}/${result.total}`:`CHECK ${result?.passed||0}/${result?.total||0}`;badge.className=`status-pill ${result?.ok?'good':'warn'}`;
}
function runClinicalValidation({announce=false}={}){
  const CV=window.AnesvetClinicalValidation;if(!CV){const r={ok:false,passed:0,total:1,checks:[{ok:false,label:'Clinical validation module',detail:'clinical-validation.js not loaded'}]};renderClinicalValidation(r);return r}
  const checks=[...CV.runMedicationMatrix(calculateLibraryDrug),...CV.runEttMatrix(dogNormalAnatomyEtt,catNormalAnatomyEtt)];
  const result=CV.summarize(checks);result.version=APP_VERSION;result.epoch=Date.now();renderClinicalValidation(result);if(announce)toast(result.ok?`Clinical validation passed ${result.passed}/${result.total}`:`Clinical validation: ${result.passed}/${result.total} passed`);return result;
}
$('runClinicalValidationBtn')?.addEventListener('click',()=>runClinicalValidation({announce:true}));

function runReliabilitySelfCheck({announce=false}={}){
  const R=window.AnesvetReliability,checks=[];
  try{const arch=window.ANESVET_ARCHITECTURE_REGISTRY?.summarize?.();if(arch)checks.push({ok:arch.ok,label:'Architecture module registry',detail:`${arch.passed}/${arch.total} required modules loaded`});else checks.push({ok:false,label:'Architecture module registry',detail:'architecture-registry.js not loaded'})}catch(e){checks.push({ok:false,label:'Architecture module registry',detail:e.message||String(e)})}
  if(R){checks.push(R.checkDom(document),R.checkLocalStorage(localStorage),R.checkIndexedDb(window.indexedDB),R.checkServiceWorker(navigator),R.checkWorkflow(WF))}
  else checks.push({ok:false,label:'Reliability module',detail:'reliability.js not loaded'});
  try{JSON.stringify(state);checks.push({ok:true,label:'Current case serialization',detail:'Current clinical state serializes successfully'})}catch(e){checks.push({ok:false,label:'Current case serialization',detail:e.message||String(e)})}
  try{preOrBriefingSignature();checks.push({ok:true,label:'Pre-OR briefing engine',detail:'Briefing signature generated without JavaScript error'})}catch(e){checks.push({ok:false,label:'Pre-OR briefing engine',detail:e.message||String(e)})}
  try{const d=dogNormalAnatomyEtt(10),c=catNormalAnatomyEtt(4);checks.push({ok:d.min===7&&d.max===8&&c.min===4&&c.max===4.5,label:'ETT preparation references',detail:`10 kg dog ${d.range} • 4 kg cat ${c.range}`})}catch(e){checks.push({ok:false,label:'ETT preparation references',detail:e.message||String(e)})}
  try{const cv=runClinicalValidation();checks.push({ok:cv.ok,label:'Clinical validation matrix',detail:`${cv.passed}/${cv.total} medication + ETT checks passed`})}catch(e){checks.push({ok:false,label:'Clinical validation matrix',detail:e.message||String(e)})}
  try{const activeProbe={patientSaved:true,timer:{running:false,elapsedMs:0},records:[],events:[],complications:[],drugAdministrations:[],alertEpisodes:[],recoveryScores:[],caseLocked:false,finalChecksum:null,lockedAt:null},sealedProbe={...activeProbe,caseLocked:true,finalChecksum:'TEST-CHECKSUM',lockedAt:Date.now()};checks.push({ok:versionReloadUnsafe(activeProbe)&&!versionReloadUnsafe(sealedProbe),label:'Version reload guard',detail:'Mutable current case blocks reload; sealed Final Lock permits safe version reload'})}catch(e){checks.push({ok:false,label:'Version reload guard',detail:e.message||String(e)})}
  try{const ids=getArchive().map(c=>c?.caseId).filter(Boolean),unique=new Set(ids);checks.push({ok:ids.length===unique.size,label:'Archive case identity',detail:ids.length===unique.size?`${ids.length} archived case ID(s) unique`:`Duplicate caseId detected: ${ids.length-unique.size}`})}catch(e){checks.push({ok:false,label:'Archive case identity',detail:e.message||String(e)})}
  try{const patients=getPatients(),ids=patients.map(x=>x?.patientId).filter(Boolean),unique=new Set(ids);checks.push({ok:ids.length===unique.size,label:'Patient Master identity',detail:ids.length===unique.size?`${ids.length} patient ID(s) unique`:`Duplicate patientId detected: ${ids.length-unique.size}`})}catch(e){checks.push({ok:false,label:'Patient Master identity',detail:e.message||String(e)})}
  try{const overflow=Math.max(0,document.documentElement.scrollWidth-window.innerWidth);checks.push({ok:overflow<=1,label:'Viewport horizontal integrity',detail:overflow<=1?'No page-level horizontal overflow':`${overflow}px horizontal overflow detected`})}catch(e){checks.push({ok:false,label:'Viewport horizontal integrity',detail:e.message||String(e)})}
  try{checks.push({ok:!state.caseLocked||!!state.finalChecksum,label:'Final Lock checksum',detail:!state.caseLocked?'Current case is not Final Locked':state.finalChecksum?'Locked current case has checksum':'Locked current case is missing checksum'})}catch(e){checks.push({ok:false,label:'Final Lock checksum',detail:e.message||String(e)})}
  const result=R?R.summarize(checks):{ok:checks.every(x=>x.ok),passed:checks.filter(x=>x.ok).length,total:checks.length,checks};result.epoch=Date.now();result.version=APP_VERSION;
  const box=$('reliabilityCheckResults');if(box)box.innerHTML=checks.map(x=>`<div class="reliability-check ${x.ok?'pass':'fail'}"><b>${x.ok?'✓':'⚠'} ${escapeHtml(x.label)}</b><span>${escapeHtml(x.detail)}</span></div>`).join('');
  const badge=$('reliabilityCheckBadge');if(badge){badge.textContent=result.ok?`PASS ${result.passed}/${result.total}`:`CHECK ${result.passed}/${result.total}`;badge.className=`status-pill ${result.ok?'good':'warn'}`}
  const meta=$('reliabilityCheckMeta');if(meta)meta.textContent=`V${APP_VERSION} • ${formatDate(result.epoch)} ${formatClock(result.epoch)} • recent runtime errors ${getRuntimeErrorLog().length}`;
  try{sessionStorage.setItem('anesvet_v15_last_self_check',JSON.stringify(result))}catch(e){}
  if(announce)toast(result.ok?`Reliability self-check passed ${result.passed}/${result.total}`:`Reliability self-check: ${result.passed}/${result.total} passed`);
  return result;
}
function exportReliabilityDiagnostics(){const r=runReliabilitySelfCheck(),payload={format:'ANESVET_DIAGNOSTICS_V1',version:APP_VERSION,exportedAt:new Date().toISOString(),selfCheck:r,device:pilotDeviceContext(),diagnostics:pilotDiagnostics(),runtimeErrors:getRuntimeErrorLog(),productionPilot:window.ANESVET_PRODUCTION_PILOT?.snapshot?.()||null,productionValidation:window.ANESVET_VALIDATION_CENTER?.snapshot?.()||null,security:SECURITY?.snapshot?.()||null};const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ANESVET_Diagnostics_V${APP_VERSION}_${formatDate(Date.now())}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)}
$('pilotFeedbackBtn')?.addEventListener('click',openPilotFeedbackDialog);$('openPilotFeedbackBtn')?.addEventListener('click',openPilotFeedbackDialog);$('orMoreReportIssueBtn')?.addEventListener('click',()=>{closeOrMoreDialog();openPilotFeedbackDialog()});$('recoveryMoreReportIssueBtn')?.addEventListener('click',()=>{closeRecoveryMoreDialog();openPilotFeedbackDialog()});$('pilotFeedbackCloseBtn')?.addEventListener('click',closePilotFeedbackDialog);$('pilotFeedbackDialog')?.addEventListener('click',e=>{if(e.target===$('pilotFeedbackDialog'))closePilotFeedbackDialog()});$('pilotFeedbackSubmitBtn')?.addEventListener('click',openSupportEmail);$('pilotFeedbackFacebookBtn')?.addEventListener('click',openSupportFacebook);$('pilotFeedbackCopyBtn')?.addEventListener('click',copySupportReport);
$('savePilotFeedbackSettingsBtn')?.addEventListener('click',()=>{const old=currentSettingsObject(),s={...old,pilotSiteName:$('settingPilotSiteName')?.value.trim()||'',pilotReporter:$('settingPilotReporter')?.value.trim()||'',pilotIncludeContext:$('settingPilotIncludeContext')?.checked!==false};delete s.pilotFeedbackEndpoint;localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));renderPilotFeedbackStatus();toast('Support/report settings saved')});
$('runReliabilityCheckBtn')?.addEventListener('click',()=>runReliabilitySelfCheck({announce:true}));$('exportReliabilityDiagnosticsBtn')?.addEventListener('click',exportReliabilityDiagnostics);$('clearRuntimeErrorsBtn')?.addEventListener('click',()=>{try{localStorage.removeItem(RUNTIME_ERROR_KEY)}catch(e){};runReliabilitySelfCheck();toast('Local runtime error log cleared')});

function captureHospitalProtocolPayload(){
  const s=currentSettingsObject();
  return {
    schema:1,
    name:s.protocolName||'Hospital anesthesia protocol',
    version:s.protocolVersion||'',
    alertProtocol:WF.normalizeAlertProtocol(s.alertProtocol),
    concentrations:{diazepam:s.diazepamConc,propofol:s.propofolConc,tramadol:s.tramadolConc,carprofen:s.rimadylConc,meloxicam:s.metacamConc,atropine:s.atropineConc},
    builtInProtocol:{diazepamDose:s.diazepamDose,propofolDose:s.propofolDose,tramadolDose:s.tramadolDose,carprofenDose:s.carprofenDose,meloxicamDose:s.meloxicamDose,cefazolinDivisor:s.cefazolinDivisor,conveniaDivisor:s.conveniaDivisor,adrenalineDose:s.adrenalineDose,atropineBradyDose:s.atropineBradyDose,atropineCprDose:s.atropineCprDose},
    quickPresets:JSON.parse(JSON.stringify(loadQuickPresets())),
    drugLibrary:JSON.parse(JSON.stringify(loadDrugLibraryData()))
  };
}
function applyHospitalProtocolPayload(payload,record=null,{lock=true}={}){
  if(!payload)return false;const s=currentSettingsObject(),c=payload.concentrations||{},b=payload.builtInProtocol||{};
  Object.assign(s,{protocolName:payload.name||s.protocolName||'Hospital anesthesia protocol',protocolVersion:payload.version||s.protocolVersion||'',protocolVerifiedAt:lock?formatDate(record?.publishedAt||Date.now()):(s.protocolVerifiedAt||''),protocolLocked:!!lock,alertProtocol:WF.normalizeAlertProtocol(payload.alertProtocol||s.alertProtocol),diazepamConc:c.diazepam??s.diazepamConc,propofolConc:c.propofol??s.propofolConc,tramadolConc:c.tramadol??s.tramadolConc,rimadylConc:c.carprofen??s.rimadylConc,metacamConc:c.meloxicam??s.metacamConc,atropineConc:c.atropine??s.atropineConc,diazepamDose:b.diazepamDose??s.diazepamDose,propofolDose:b.propofolDose??s.propofolDose,tramadolDose:b.tramadolDose??s.tramadolDose,carprofenDose:b.carprofenDose??s.carprofenDose,meloxicamDose:b.meloxicamDose??s.meloxicamDose,cefazolinDivisor:b.cefazolinDivisor??s.cefazolinDivisor,conveniaDivisor:b.conveniaDivisor??s.conveniaDivisor,adrenalineDose:b.adrenalineDose??s.adrenalineDose,atropineBradyDose:b.atropineBradyDose??s.atropineBradyDose,atropineCprDose:b.atropineCprDose??s.atropineCprDose});
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  if(Array.isArray(payload.drugLibrary))localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(payload.drugLibrary));
  if(payload.quickPresets)localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(payload.quickPresets));
  hospitalDrugLibrary=loadDrugLibraryData();quickPresets=loadQuickPresets();loadSettings();renderDrugLibrarySettings();renderPhaseDrugSelectors();renderQuickPresetSettings();renderQuickPresetSummary();renderProtocolDoseReview();renderProtocolGovernance();return true;
}
function unlockProtocolForGovernanceDraft(){const s=currentSettingsObject();s.protocolLocked=false;localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();renderProtocolGovernance()}
function lockProtocolWithoutPublishedChange(){const s=currentSettingsObject();s.protocolLocked=true;localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();renderProtocolGovernance()}
function protocolGovernanceReviewStatus(){const r=protocolReviewLockWarning();return{currentReview:!!r.currentReview,fingerprint:r.fingerprint||'',summary:r.summary||{},doseReview:currentSettingsObject().protocolDoseReview||null,referenceVersion:DOSE_REF?.version||'',reviewEngineVersion:PROTOCOL_REVIEW?.version||''}}
function hasMutableCaseForProtocolGovernance(){return hasActiveCaseData()&&!state.caseLocked}
function initHospitalProtocolGovernance(){
  if(!PROTOCOL_GOVERNANCE)return;
  PROTOCOL_GOVERNANCE.init?.({
    settings:()=>currentSettingsObject(),capturePayload:()=>captureHospitalProtocolPayload(),reviewStatus:()=>protocolGovernanceReviewStatus(),hasMutableCase:()=>hasMutableCaseForProtocolGovernance(),
    beginDraftFromPublished:(payload)=>applyHospitalProtocolPayload(payload,null,{lock:false}),unlockProtocolForDraft:()=>unlockProtocolForGovernanceDraft(),applyPublished:(payload,record)=>applyHospitalProtocolPayload(payload,record,{lock:true}),lockProtocolWithoutPublish:()=>lockProtocolWithoutPublishedChange(),
    audit:(action,detail,actor='')=>addProtocolAudit(action,detail,actor),toast:(message)=>toast(message),download:(data,type,name)=>downloadBlob(data,type,name),
    securityEnabled:()=>!!SECURITY?.enabled?.(),authenticate:(action,opts)=>SECURITY?.authenticateForAction?.(action,opts)
  });
}

function isProtocolLocked(){return !!currentSettingsObject().protocolLocked}
function renderProtocolGovernance(){
  const s=currentSettingsObject(),panel=document.querySelector('.protocol-governance-panel');panel?.classList.toggle('locked',!!s.protocolLocked);
  if($('protocolLockStatus')){$('protocolLockStatus').textContent=s.protocolLocked?'LOCKED':'UNLOCKED';$('protocolLockStatus').className=`status-pill ${s.protocolLocked?'good':'warn'}`}
  if($('toggleProtocolLockBtn'))$('toggleProtocolLockBtn').textContent=s.protocolLocked?'🔓 Unlock protocol':'🔒 Lock protocol';
  const ids=['settingProtocolName','settingProtocolVersion','settingProtocolVerifiedAt','settingDiazepamConc','settingPropofolConc','settingTramadolConc','settingRimadylConc','settingMetacamConc','settingAtropineConc','settingDiazepamDose','settingPropofolDose','settingTramadolDose','settingCarprofenDose','settingMeloxicamDose','settingCefazolinDivisor','settingConveniaDivisor','settingAdrenalineDose','settingAtropineBradyDose','settingAtropineCprDose','quickPresetInd1','quickPresetInd2','quickPresetPre1','quickPresetPre2','quickPresetPost1','quickPresetPost2','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','atropineConc'];
  ids.forEach(id=>{const el=$(id);if(el){el.disabled=!!s.protocolLocked;el.classList.toggle('protocol-locked-input',!!s.protocolLocked)}});
  ['saveQuickPresetsBtn','addDrugLibraryRowBtn','saveDrugLibraryBtn','saveQuickConcentrationBtn'].forEach(id=>{if($(id))$(id).disabled=!!s.protocolLocked});
  $$('#drugLibraryRows input,#drugLibraryRows select,#drugLibraryRows button').forEach(el=>el.disabled=!!s.protocolLocked);
  if($('protocolGovernanceNote')){const rr=PROTOCOL_REVIEW?runProtocolDoseReview():null,reviewed=!!(rr&&s.protocolDoseReview?.fingerprint===rr.fingerprint),reviewText=rr?` • Dose review ${reviewed?'current':'not current'}${rr.summary.warnings?` • ${rr.summary.warnings} warning(s)`:''}`:'';$('protocolGovernanceNote').textContent=(s.protocolLocked?`🔒 Protocol ${s.protocolVersion||'unversioned'} locked • verified ${s.protocolVerifiedAt||'—'}`:'Protocol unlocked — ตรวจ version / concentration / drug formula ให้เรียบร้อยก่อน Lock')+reviewText;}
  PROTOCOL_GOVERNANCE?.render?.();
}
$('toggleProtocolLockBtn')?.addEventListener('click',()=>{
  if(PROTOCOL_GOVERNANCE?.hasGovernance?.()){toast('Protocol Governance is active — use Draft → Review → Publish instead of manual lock/unlock');PROTOCOL_GOVERNANCE.render?.();return}
  const s=currentSettingsObject();
  if(s.protocolLocked){
    const code=prompt('Protocol ถูกล็อก\nพิมพ์ UNLOCK เพื่ออนุญาตการแก้ Hospital Drug Settings');if(code!=='UNLOCK'){toast('Protocol remains locked');return}
    s.protocolLocked=false;localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));addProtocolAudit('PROTOCOL_UNLOCKED',`Version ${s.protocolVersion||'unversioned'}`);loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();toast('Protocol unlocked');
  }else{
    const version=$('settingProtocolVersion')?.value.trim();if(!version){toast('กรุณากำหนด Protocol version ก่อน Lock');$('settingProtocolVersion')?.focus();return}
    const reviewCheck=protocolReviewLockWarning();if(!reviewCheck.currentReview&&!confirm(reviewCheck.message))return;if(!reviewCheck.currentReview)addProtocolAudit('PROTOCOL_LOCK_WITH_UNREVIEWED_DOSE_CHECK',`warnings=${reviewCheck.summary.warnings} • context=${reviewCheck.summary.notes} • notCompared=${reviewCheck.summary.info}`);
    if(!confirm(`Lock Hospital Protocol version ${version}?`))return;
    s.protocolName=$('settingProtocolName')?.value.trim()||'Hospital anesthesia protocol';s.protocolVersion=version;s.protocolVerifiedAt=$('settingProtocolVerifiedAt')?.value||formatDate(Date.now());
    s.diazepamConc=$('settingDiazepamConc').value;s.propofolConc=$('settingPropofolConc').value;s.tramadolConc=$('settingTramadolConc').value;s.rimadylConc=$('settingRimadylConc').value;s.metacamConc=$('settingMetacamConc').value;s.atropineConc=$('settingAtropineConc').value;s.diazepamDose=$('settingDiazepamDose').value;s.propofolDose=$('settingPropofolDose').value;s.tramadolDose=$('settingTramadolDose').value;s.carprofenDose=$('settingCarprofenDose').value;s.meloxicamDose=$('settingMeloxicamDose').value;s.cefazolinDivisor=$('settingCefazolinDivisor').value;s.conveniaDivisor=$('settingConveniaDivisor').value;s.adrenalineDose=$('settingAdrenalineDose').value;s.atropineBradyDose=$('settingAtropineBradyDose').value;s.atropineCprDose=$('settingAtropineCprDose').value;s.protocolLocked=true;
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));addProtocolAudit('PROTOCOL_LOCKED',`${s.protocolName} • ${s.protocolVersion}`);loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();toast(`Protocol ${version} locked`);
  }
});
function captureHospitalBrandingSnapshot(){
  try{
    if(window.AnesvetBranding?.snapshot)state.hospitalBrandingSnapshot=window.AnesvetBranding.snapshot();
  }catch(e){console.warn('Hospital branding snapshot failed',e)}
}
function captureProtocolSnapshot(){const s=currentSettingsObject(),governance=PROTOCOL_GOVERNANCE?.caseMetadata?.()||null;state.protocolSnapshot={name:s.protocolName||'Hospital anesthesia protocol',version:s.protocolVersion||'unversioned',verifiedAt:s.protocolVerifiedAt||'',locked:!!s.protocolLocked,capturedAt:Date.now(),governance,alertProtocol:WF.normalizeAlertProtocol(s.alertProtocol),concentrations:{adrenaline:{value:$('adrenalineConc')?.value||'1',unit:'mg/mL'},diazepam:{value:s.diazepamConc,unit:'mg/mL'},propofol:{value:s.propofolConc,unit:'mg/mL'},tramadol:{value:s.tramadolConc,unit:'mg/mL'},carprofen:{value:s.rimadylConc,unit:'mg/mL'},meloxicam:{value:s.metacamConc,unit:'mg/mL'},atropine:{value:s.atropineConc,unit:'mg/mL'},cefazolin:{value:250,unit:'mg/mL',hospital:'Geno V Pet Care',preparation:'1000 mg vial + sterile water 4 mL'},convenia:{value:80,unit:'mg/mL',hospital:'Geno V Pet Care'}},hospitalPreparations:JSON.parse(JSON.stringify(GENOV_HOSPITAL_PREPARATIONS)),builtInProtocol:{diazepamDose:{value:s.diazepamDose,unit:'mg/kg'},propofolDose:{value:s.propofolDose,unit:'mg/kg'},tramadolDose:{value:s.tramadolDose,unit:'mg/kg'},carprofenDose:{value:s.carprofenDose,unit:'mg/kg'},meloxicamDose:{value:s.meloxicamDose,unit:'mg/kg'},cefazolinDivisor:{value:s.cefazolinDivisor,unit:'BW ÷ factor mL'},conveniaDivisor:{value:s.conveniaDivisor,unit:'BW ÷ factor mL'},adrenalineDose:{value:s.adrenalineDose,unit:'mg/kg'},atropineBradyDose:{value:s.atropineBradyDose,unit:'mg/kg'},atropineCprDose:{value:s.atropineCprDose,unit:'mg/kg'}},quickPresets:JSON.parse(JSON.stringify(loadQuickPresets())),drugLibrary:JSON.parse(JSON.stringify(loadDrugLibraryData())),caseDrugPlan:(state.caseDrugPlan||[]).map(d=>{const r=safeMedicationCalculation(d,currentWeightReady()?currentWeightKg():Number(state.weight)||null,d.dose,d.conc);return {...JSON.parse(JSON.stringify(d)),hospitalProtocol:d.hospitalProtocol||'',preparation:d.preparation?JSON.parse(JSON.stringify(d.preparation)):null,plannedMl:r.actionableMl,legacyReferenceMl:r.safety.code==='preparation-missing'&&Number.isFinite(r.rawMl)?r.rawMl:null,plannedTotal:r.total||'',calculationSafety:r.safety,weightKg:currentWeightReady()?currentWeightKg():Number(state.weight)||null}}),caseDrugPlanReviewedAt:state.caseDrugPlanReviewedAt||null,caseDrugPlanReviewedBy:state.caseDrugPlanReviewedBy||''}}

function freshState(){
  // Reset = a truly blank CURRENT CASE. Persistent Patient Master / Archive /
  // Hospital Settings / Drug Library / Quick Presets remain untouched.
  return {
    caseId:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    humanRecordId:makeHumanRecordId(Date.now()),
    createdAt:Date.now(),
    simulationMode:false,simulationScenario:'',simulationLabel:'',simulationStartedAt:null,simulationVersion:'',
    timer:{running:false,startedEpoch:null,elapsedMs:0},
    records:[],events:[],responses:[],corrections:[],complications:[],drugAdministrations:[],alertEpisodes:[],recoveryScores:[],recoveryRecords:[],recoveryTransfers:[],fluidRateHistory:[],
    alertProtocolOverride:null,alertProtocolHistory:[],recoveryHandoffs:[],inductionDocumentationMode:'',inductionMedicationReviewCompletedAt:null,
    recoveryChecks:[false,false,false,false,false,false],recoveryNA:[false,false,false,false,false,false],recoveryObservationNA:{spo2:false,temp:false,extubation:false},
  recHandoffNote:'',preopChecks:{},preopNA:{},preopExamRecordedAt:null,preopExamRecordedBy:'',preopRiskRecordedAt:null,preopRiskRecordedBy:'',
    patientSaved:false,patientMasterId:'',procedureTemplateId:'custom',procedureTemplateSnapshot:null,caseWorkflowProfile:'routine',
    patientName:'',hospitalId:'',visitId:'',species:'',sex:'',reproductiveStatus:'',microchip:'',breed:'',
    weight:'',age:'',birthDate:'',birthDateEstimated:false,ageSource:'',estimatedBirthPeriod:'',
    approxAgeYears:'',approxAgeMonths:'',approxAgeWeeks:'',bcs:'',asa:'',emergency:false,
    patientProcedure:'',procedure:'',patientAllergies:'',patientComorbidities:'',patientPrecautions:'',
    surgeon:'',anesthetist:'',surgicalAssistant:'',
    preopMentation:'',preopHR:'',preopPulse:'',preopHeart:'',preopRR:'',preopRespEffort:'',preopLungs:'',preopTemp:'',preopMM:'',preopCRT:'',preopHydration:'',preopPain:'',preopExamNotes:'',preopExaminer:'',preopRiskNone:false,riskBrachycephalic:false,riskBOAS:false,riskDifficultAirway:false,riskUpperAirway:false,riskAspiration:false,riskCardiacDisease:false,riskArrhythmia:false,riskRespiratoryDisease:false,riskHypovolemia:false,riskAnemiaBleeding:false,riskRenal:false,riskHepatic:false,riskMetabolicElectrolyte:false,riskHypoglycemia:false,riskPediatric:false,riskGeriatric:false,riskObesity:false,riskPregnancy:false,riskPreviousAnesthetic:false,riskEmergency:false,riskMajorHemorrhage:false,riskBOASStertor:false,riskBOASStridor:false,riskBOASExerciseHeat:false,riskBOASSleep:false,riskBOASRegurg:false,riskBOASAirwaySurgery:false,riskBOASPreviousDifficultIntubation:false,riskBOASNotes:'',riskOther:'',preopRiskAssessor:'',
    hr:'',rr:'',sap:'',map:'',dap:'',spo2:'',etco2:'',temp:'',vaporizer:'',o2flow:'',
    fluidRateInput:'',fluidTotal:'',depth:'',ventilation:'',
    bradyPoorPerf:false,bloodLoss:false,cardiacRisk:false,respRisk:false,recordNote:'',
    planPremed:'',planInduction:'',planMaintenance:'',planAnalgesia:'',planAntibiotic:'',planNSAID:'',planBlock:'',planNote:'',
    actualDiazepamMl:'',actualPropofolMl:'',actualTramadolMl:'',
    balanceCrystalloid:'',balanceBolus:'',balanceBloodIn:'',balanceBloodLoss:'',balanceUrine:'',fluidActualTotal:'',
    airwayEttSize:'',airwayEttDepth:'',airwayCuff:'',airwayDifficulty:'',airwayCircuit:'',airwayVentMode:'',airwayVt:'',airwayPip:'',airwayPeep:'',airwayVentRr:'',
    recHR:'',recRR:'',recMAP:'',recSpO2:'',recTemp:'',recExtubation:'',recOxygen:'',recMentation:'',recPain:'',recPainScale:'',recPainScore:'',recDysphoria:'',recNausea:'',recAmbulation:'',recDestination:'',recHandoffTo:'',recTransferNote:'',recNaReason:'',recScoreAirway:'',recScoreOxygen:'',recScoreTemp:'',recScoreMentation:'',recScoreComfort:'',recScoreNote:'',
    caseStartedAt:null,caseIdentitySnapshot:null,casePhase:'setup',recoveryStartedAt:null,recoveryCompletedAt:null,recoveryCompletionOverride:null,emergencyReturnActive:false,
    surgeryEndedAt:null,extubatedAt:null,lastSavedAt:null,caseLocked:false,lockedAt:null,protocolSnapshot:null,caseDrugPlan:[],caseDrugPlanInitialized:false,caseDrugPlanReviewedAt:null,caseDrugPlanReviewedBy:'',medicationReconciliation:{version:1,decisions:{}},preOrReadinessOverride:null,preOrBriefingReview:null,orLastTransition:null,
    auditTrail:[],amendments:[],finalSignoff:{anesthetist:null,surgeon:null},finalChecksum:null,checksumAlgorithm:null,checksumCreatedAt:null,
    voidedAt:null,voidedBy:'',voidReason:''
  };
}
function resetCurrent(){
  if(!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||!CASE_FRESHNESS.verify()){toast('Case changed elsewhere — reload latest case before starting a new case');return}
  // Set this BEFORE navigation. Otherwise pagehide/visibilitychange can autosave
  // the old on-screen fields and resurrect the case we just cleared.
  resetInProgress=true;criticalAlertLatch={map:false,spo2:false};
  cancelPendingPersistence();
  clearInterval(timerHandle);timerHandle=null;
  dueReminderToken=null;RECOVERY_CONTROLLER.resetDueReminder();
  state=freshState();
  clearSafetyCheckpoint();
  localStorage.setItem(CURRENT_KEY,JSON.stringify(state));
  CASE_FRESHNESS.committed(localStorage.getItem(CURRENT_KEY));
  idbPutMeta('current',state);
  localStorage.setItem(TAB_KEY,'patient');
  releaseScreenWakeLock(true);
  try{sessionStorage.setItem('anesvet_ui_next_page','patient')}catch(_){}
  restartAtAppRoot();
}
const hasActiveCaseData=()=>CASE_LIFECYCLE.hasActiveCaseData(state);
const finalCaseIsSealed=(caseObj=state)=>CASE_LIFECYCLE.finalCaseIsSealed(caseObj);
const versionReloadUnsafe=(caseObj=state)=>CASE_LIFECYCLE.versionReloadUnsafe(caseObj);
function startSimulationCase({id='routine_dog',label='Simulation',seed={},replace=false}={}){
  if(hasActiveCaseData()&&!state.simulationMode)return {ok:false,reason:'active-real-case'};
  if(state.simulationMode&&hasActiveCaseData()&&!replace)return {ok:false,reason:'simulation-active'};
  resetInProgress=true;criticalAlertLatch={map:false,spo2:false};cancelPendingPersistence();clearInterval(timerHandle);timerHandle=null;dueReminderToken=null;RECOVERY_CONTROLLER.resetDueReminder();
  const next=freshState();Object.assign(next,JSON.parse(JSON.stringify(seed||{})));
  next.simulationMode=true;next.simulationScenario=String(id||'routine_dog');next.simulationLabel=String(label||'Simulation');next.simulationStartedAt=Date.now();next.simulationVersion=APP_VERSION;next.patientMasterId='';next.patientSaved=false;next.casePhase='setup';
  next.auditTrail=[{id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),elapsedMs:0,action:'SIMULATION_STARTED',detail:`${next.simulationLabel} • sandbox only • no Patient Master / real Archive`,actor:'System'}];
  state=next;clearSafetyCheckpoint();const payload=JSON.stringify(state);localStorage.setItem(CURRENT_KEY,payload);CASE_FRESHNESS.committed(payload);idbPutMeta('current',state);localStorage.setItem(TAB_KEY,'patient');releaseScreenWakeLock(true);restartAtAppRoot();return {ok:true};
}
function exitSimulationCase(){if(!state.simulationMode)return {ok:false,reason:'not-simulation'};resetCurrent();return {ok:true}}
$('newCaseBtn').addEventListener('click',async()=>{
  if(state.caseLocked&&!state.simulationMode){const assurance=await verifyFinalArchive(state);try{document.dispatchEvent(new CustomEvent('anesvet:final-archive-status',{detail:assurance}))}catch(e){}if(!assurance.ok){toast('Final record is locked but archive verification has not passed — retry archive before starting a new case');setTab('endcase',{force:true});return;}}
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
  const firstStart=(state.timer.elapsedMs||0)===0 && !state.caseStartedAt;
  state.timer.running=true;
  state.timer.startedEpoch=Date.now();
  if(firstStart){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';state.caseIdentitySnapshot={patientMasterId:state.patientMasterId||$('patientMasterId')?.value||'',patientName:$('patientName')?.value.trim()||state.patientName||'',hospitalId:$('hospitalId')?.value.trim()||state.hospitalId||'',visitId:$('visitId')?.value.trim()||state.visitId||'',species:$('species')?.value||state.species||'',microchip:$('microchip')?.value.trim()||state.microchip||'',weight:Number($('weight')?.value||state.weight)||null,capturedAt:state.timer.startedEpoch};state.procedureTemplateId=$('procedureTemplateId')?.value||state.procedureTemplateId||'custom';state.procedureTemplateSnapshot=PROCEDURE_TEMPLATES.snapshot({id:state.procedureTemplateId,procedure:$('patientProcedure')?.value.trim()||state.patientProcedure||state.procedure||'',workflowProfile:state.caseWorkflowProfile||$('caseWorkflowProfile')?.value||'routine',capturedAt:state.timer.startedEpoch});captureProtocolSnapshot();addAudit('PROCEDURE_TEMPLATE_FROZEN',`${state.procedureTemplateSnapshot.label} • Workflow ${state.procedureTemplateSnapshot.workflowProfile} • documentation-only`);addAudit('CASE_STARTED',`Anesthesia case timer started • patient ${state.caseIdentitySnapshot.patientName||'Unnamed'} • BW ${state.caseIdentitySnapshot.weight??'—'} kg`);renderProcedureTemplatePicker();}
  startTimerLoop();renderTimerState();renderCasePhase();save();
  if(autoWakeEnabled())requestScreenWakeLock(true);
  if(firstStart) addEvent({category:'Case',name:'Case started',note:'Anesthesia case timer started'});
  setTab('orlive');
  toast(firstStart?'Case timer started':'Case timer resumed');
});
$('pauseCaseBtn').addEventListener('click',()=>{pauseTimer();renderOrLive()});

// Pre-op structured assessment bindings are owned by PREOP_CONTROLLER (V16.18.1).

dataFields.forEach(id=>{
  const el=$(id);if(!el)return;const discrete=el.type==='checkbox'||el.tagName==='SELECT',eventName=discrete?'change':'input';
  el.addEventListener(eventName,()=>{if(id==='weight'&&!state.caseStartedAt&&state.caseDrugPlanReviewedAt){state.caseDrugPlanReviewedAt=null;state.caseDrugPlanReviewedBy='';if(state.caseDrugPlanInitialized)renderCaseDrugPlan()}updateDashboard({persist:false,inputId:id});if(discrete)save({reason:`field:${id}`});else scheduleAutosave(`field:${id}`)});
});

async function prepareForVersionUpdate(){
  const active=versionReloadUnsafe();
  if(!active)return {ok:true,active:false};
  const preferredTab=state.casePhase==='recovery'?'recovery':(state.caseStartedAt||state.timer?.running||(state.timer?.elapsedMs||0)>0)?'orlive':(document.querySelector('.tabpage.active')?.id||localStorage.getItem(TAB_KEY)||'patient');
  if(sessionActive()){
    if(!save({reason:'version-update'}))return {ok:false,reason:'Current case could not be saved locally'};
  }
  let persisted=null;try{persisted=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null')}catch(_){ }
  if(!persisted||persisted.caseId!==state.caseId)return {ok:false,reason:'Verified current-case copy is unavailable'};
  const payload=JSON.stringify(persisted);
  if(!writeSafetyCheckpoint(payload))return {ok:false,reason:'Safety checkpoint verification failed'};
  try{await idbPutMeta('current',persisted)}catch(_){ }
  try{
    localStorage.setItem(TAB_KEY,preferredTab);
    localStorage.setItem(SAFE_UPDATE_KEY,JSON.stringify({caseId:persisted.caseId,resumeTab:preferredTab,preparedAt:Date.now(),fromVersion:APP_VERSION}));
  }catch(_){ }
  return {ok:true,active:true,resumeTab:preferredTab};
}
window.addEventListener('beforeunload',e=>{
  if(resetInProgress||freshnessReloadInProgress)return;
  if(versionUpdateReloadInProgress){if(sessionActive())flushPendingSave('version-update-unload');return;}
  if(sessionActive()&&state.timer.running){flushPendingSave('beforeunload');e.preventDefault();e.returnValue=''}
});
window.addEventListener('storage',e=>{if(e.key===CURRENT_KEY&&CASE_FRESHNESS.isEstablished())CASE_FRESHNESS.verify()});
$('caseFreshnessReloadBtn')?.addEventListener('click',()=>{if(!CASE_FRESHNESS.isBlocked()||CASE_FRESHNESS.reason()==='storage-unavailable')return;freshnessReloadInProgress=true;cancelPendingPersistence();restartAtAppRoot()});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'){if(!resetInProgress&&sessionActive())flushPendingSave('visibility-hidden')}else{if(sessionActive())writeSessionLock();if(sessionActive()&&(state.timer.running||state.casePhase==='recovery')&&autoWakeEnabled())requestScreenWakeLock(true)}});
window.addEventListener('pagehide',e=>{if(!resetInProgress&&!freshnessReloadInProgress&&sessionActive())flushPendingSave(versionUpdateReloadInProgress?'version-update-pagehide':'pagehide');if(!e.persisted)releaseSessionLock()});
window.addEventListener('online',renderConnectivityState);window.addEventListener('offline',renderConnectivityState);
renderConnectivityState();startActiveCheckpoint();
const PWA_CONTROLLER=window.ANESVET_PWA_CONTROLLER?.create?.({
  isReloadUnsafe:()=>versionReloadUnsafe(),
  prepareForUpdate:()=>prepareForVersionUpdate(),
  onReloadStarting:()=>{versionUpdateReloadInProgress=true},
  toast,
  serviceWorkerUrl:`./service-worker.js?v=${APP_VERSION}`
});
if(!PWA_CONTROLLER)throw new Error('ANESVET pwa-controller.js failed to load');
PWA_CONTROLLER.bind();
BOOT?.mark?.('pwa-bound');

// V15.2.0 OR LIVE phase confirmation / undo / intraoperative vitals priority on top of V15.1.0 navigation focus.
const WF=globalThis.AnesvetWorkflow;
const ALERT_KEYS={map:'hypotension',spo2:'hypoxemia',etco2:'ventilation',temp:'hypothermia'};
let alertProtocolEditScope='hospital',pendingProblem=null,orQuickOptions=[],orQuickBasis=null,orQuickContext=null;
const alertObservationRevision={};
function clinicalWriteAllowed(){if(restoreJournalNeedsReview()){toast('Interrupted Restore: review data before editing');return false}if(!CASE_FRESHNESS.verify()){toast('Saved case changed elsewhere — reload latest case before editing');return false}if(SECURITY?.enabled?.()&&SECURITY?.locked?.()){toast('SECURITY LOCKED — unlock with staff PIN before editing');return false}if(SECURITY?.enabled?.()&&!SECURITY?.can?.('clinical-write')){toast('Current staff role cannot document clinical changes');return false}if(!sessionActive()||!SESSION_CONTROLLER.verifyOwnership()||state.caseLocked){toast(state.caseLocked?'LOCKED FINAL — clinical changes are disabled':'VIEW ONLY — take control before editing');return false}return true}
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
  if(!sessionActive()||state.caseLocked||!state.caseStartedAt||state.casePhase==='complete')return;if(context==='anesthesia'&&state.casePhase==='recovery')return;
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
function knowledgeTopicForAlertEpisode(a){
  const metric=alertMetricForEpisode(a),value=WF.numeric(a?.latestValue??a?.value),p=activeAlertProtocol();
  if(!metric||value===null||!p?.[metric])return '';
  const t=p[metric],isHigh=(t.criticalHigh!==null&&value>t.criticalHigh)||(t.warningHigh!==null&&value>t.warningHigh),isLow=(t.criticalLow!==null&&value<t.criticalLow)||(t.warningLow!==null&&value<t.warningLow);
  if(metric==='map')return isHigh?'hypertension':isLow?'hypotension':'';
  if(metric==='spo2')return isLow?'hypoxemia':'';
  if(metric==='etco2')return isHigh?'hypercapnia':isLow?'lowetco2':'';
  if(metric==='temp')return isLow?'hypothermia':'';
  return '';
}
function renderActiveProblems(){
  const alerts=(state.alertEpisodes||[]).filter(a=>!a.resolvedAt).sort((a,b)=>(a.level==='warn'?1:0)-(b.level==='warn'?1:0)),problems=(state.complications||[]).filter(c=>c.status!=='resolved');
  const rows=alerts.map(a=>({id:a.id,kind:'alert',title:a.label||a.key,level:a.level||'danger',started:a.clock,ack:a.acknowledgedAt,note:`${a.trigger||''} • Latest: ${alertMetricForEpisode(a)==='temp'?tempTextF(a.latestValue??a.value):(a.latestValue??a.value??'not recorded')}`,latest:(a.interventions||[]).at(-1)?.note,knowledgeTopic:knowledgeTopicForAlertEpisode(a)})).concat(problems.map(c=>({id:c.id,kind:'problem',title:c.type,level:c.severity==='emergency'?'danger':'warn',started:c.clock,ack:c.acknowledgedAt,note:c.assessment||c.note,latest:(c.responses||[]).at(-1)?.note||c.intervention,knowledgeTopic:''})));
  for(const id of ['orProblemPanel','recoveryProblemPanel']){const box=$(id);if(!box)continue;box.innerHTML=rows.length?rows.map(r=>`<article class="active-problem ${r.level}" data-problem-id="${escapeHtml(r.id)}"><div class="active-problem-heading"><div><b>${escapeHtml(r.title)}</b> <span>${r.kind==='alert'?(r.level==='danger'?'CRITICAL':'WARNING'):'PROBLEM'} • ${escapeHtml(r.started||'')}</span></div>${r.knowledgeTopic?`<button class="alert-knowledge-link" type="button" data-knowledge-topic="${escapeHtml(r.knowledgeTopic)}" aria-label="Open related OR knowledge" title="Why? What should I check?">?</button>`:''}</div><p>${escapeHtml(r.note||'')}</p>${r.latest?`<p>Latest intervention: ${escapeHtml(r.latest)}</p>`:''}<div class="problem-actions"><button class="btn" data-problem-action="ack" data-kind="${r.kind}" data-id="${escapeHtml(r.id)}" ${r.ack?'disabled':''}>${r.ack?'✓ Acknowledged':'Acknowledge'}</button><button class="btn" data-problem-action="intervention" data-kind="${r.kind}" data-id="${escapeHtml(r.id)}">Intervention</button><button class="btn" data-problem-action="resolve" data-kind="${r.kind}" data-id="${escapeHtml(r.id)}">Resolve / outcome</button></div></article>`).join(''):'<p class="empty-state compact">No unresolved alerts / problems</p>'}
  if($('orProblemCount'))$('orProblemCount').textContent=`${rows.length} OPEN`;window.ANESVET_PROBLEM_RESPONSE_REVIEW?.refresh?.();
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
  $('problemActionDialog').close();pendingProblem=null;save();renderActiveProblems();renderComplications();renderProcedureTimeline();renderRecoveryHandoff();document.dispatchEvent(new CustomEvent('anesvet:problem-response-changed'));
}
function frozenQuickDrugs(){return MEDICATION_WORKSPACE_CONTROLLER.frozenQuickDrugs()}
function preferredQuickDrugIndex(options,phase=''){return MEDICATION_WORKSPACE_CONTROLLER.preferredQuickDrugIndex(options,phase)}
function inductionQuickDrugIndexes(options){return MEDICATION_WORKSPACE_CONTROLLER.inductionQuickDrugIndexes(options)}
function nextInductionQuickDrugIndex(options){return MEDICATION_WORKSPACE_CONTROLLER.nextInductionQuickDrugIndex(options)}
function openOrQuickDrug(options={}){return MEDICATION_WORKSPACE_CONTROLLER.openOrQuickDrug(options)}
function renderOrQuickDrug(){return MEDICATION_WORKSPACE_CONTROLLER.renderOrQuickDrug()}
function finishInductionMedicationReview(noInjectable=false){return MEDICATION_WORKSPACE_CONTROLLER.finishInductionMedicationReview(noInjectable)}
function closeOrQuickDrugWorkspace(){return MEDICATION_WORKSPACE_CONTROLLER.closeOrQuickDrugWorkspace()}
function recordInductionWithoutDrug(){return MEDICATION_WORKSPACE_CONTROLLER.recordInductionWithoutDrug()}
function saveOrQuickDrug(){return MEDICATION_WORKSPACE_CONTROLLER.saveOrQuickDrug()}

const RECOVERY_HANDOFF_VM=window.ANESVET_RECOVERY_HANDOFF_VM;
if(!RECOVERY_HANDOFF_VM)throw new Error('ANESVET recovery handoff view-model module failed to load');
function handoffMedicationGroups(admins=[]){const plan=state.protocolSnapshot?.caseDrugPlan||state.caseDrugPlan||[];return RECOVERY_HANDOFF_VM.medicationGroups(admins,plan)}
function handoffMedicationLine(arr=[]){if(!arr.length)return 'None recorded';return arr.map(d=>`${d.drug||'Medication'}${d.actual!==null&&d.actual!==undefined&&d.actual!==''?` ${d.actual} ${d.unit||''}`:''} • ${d.clock||formatClock(d.epoch)}${d.route?` • ${d.route}`:''}`).join(' | ')}
function buildRecoveryHandoffViewModel(epoch=Date.now()){const handoffNote=String($('recHandoffNote')?.value||state.recHandoffNote||'').trim();return RECOVERY_HANDOFF_VM.derive(WF.buildHandoff(state,epoch),state,{protocol:activeAlertProtocol(),labels:WF.labels,classifyAlert:WF.classifyAlert,tempTextF,handoffNote,painScale:$('recPainScale')?.value||'',painScore:$('recPainScore')?.value||'',dysphoria:$('recDysphoria')?.value||'',nausea:$('recNausea')?.value||'',ambulation:$('recAmbulation')?.value||'',trendSummary:RECOVERY_DOMAIN.trendSummary,transfer:recoveryTransferLatest(),clone:WF.clone,readiness:recoveryReadinessSnapshot()})}
function captureRecoveryHandoff(reason){if(!sessionActive()||state.caseLocked)return;save();const h=buildRecoveryHandoffViewModel();h.reason=reason;state.recoveryHandoffs??=[];state.recoveryHandoffs.push(h);addAudit('RECOVERY_HANDOFF_CREATED',`${reason} • ${h.administrations.length} administered drugs • ${h.alerts.length+h.complications.length} unresolved items • ${h.watchItems.length} watch item(s)`);save();renderRecoveryHandoff()}
function handoffText(h){
  const v=x=>x===null||x===undefined||x===''?'ไม่ได้บันทึก':x,clock=x=>x?`${formatDate(x)} ${formatClock(x)}`:'ไม่ได้บันทึก';
  const vital=r=>r?`${clock(r.epoch)} • HR ${v(r.hr)} • RR ${v(r.rr)} • MAP ${v(r.map)} • SpO₂ ${v(r.spo2)} • ETCO₂ ${v(r.etco2)} • Temp ${r.temp==null?'ไม่ได้บันทึก':tempTextF(r.temp)}`:'ยังไม่มีค่าที่กด Record';
  const fluids=Object.entries(h.fluids||{}).filter(([,n])=>n!==null).map(([k,n])=>`${({actualTotal:'Actual total',crystalloid:'Crystalloid',bolus:'Bolus',blood:'Blood in',bloodLoss:'Blood loss',urine:'Urine',rate:'Current rate'})[k]} ${n} ${k==='rate'?'mL/hr':'mL'}`);
  const groups=h.medicationGroups||handoffMedicationGroups(h.administrations||[]),watch=h.watchItems||[];
  return [
    `${h.patientName||'Unnamed'} • HN ${v(h.hospitalId)} • Visit ${v(h.visitId)} • ${v(h.species)} • BW ${v(h.weight)} kg • ASA ${v(h.asa)}`,
    `Procedure: ${v(h.procedure)} • Anesthetist: ${v(h.anesthetist)}`,
    `Start: ${clock(h.caseStartedAt)} • Surgery end: ${clock(h.surgeryEndedAt)}\nExtubation: ${clock(h.extubatedAt)} • Recovery: ${clock(h.recoveryStartedAt)}`,
    `Latest vitals: ${vital(h.latestRecovery||h.latestAnesthesia)}`,
    `Recovery assessment: Pain ${v([h.recovery2?.painScale,h.recovery2?.painScore].filter(Boolean).join(' '))} • Dysphoria/agitation ${v(h.recovery2?.dysphoria)} • Nausea/vomiting ${v(h.recovery2?.nausea)} • Mobility ${v(h.recovery2?.ambulation)}`,
    `Transfer: ${h.transfer?`${v(h.transfer.destination)} • to ${v(h.transfer.handoffTo)} • ${clock(h.transfer.epoch)}${h.transfer.note?' • '+h.transfer.note:''}`:'ไม่ได้บันทึก transfer snapshot'}`,
    `Airway: ETT ${v(h.airway?.ett)} mm • difficulty ${v(h.airway?.difficulty)} • ventilation ${v(h.airway?.ventilation)}`,
    `Fluids / loss: ${fluids.join(' • ')||'ไม่ได้บันทึก'}`,
    `Analgesia: ${handoffMedicationLine(groups.analgesia)}\nAntibiotic: ${handoffMedicationLine(groups.antibiotic)}\nNSAID: ${handoffMedicationLine(groups.nsaid)}`,
    `WATCH / HANDOFF:\n${watch.map(x=>`${x.label}: ${x.text}`).join('\n')||'No unresolved alerts / complications identified by ANESVET'}`,
    `Timeline: ${(h.timeline||[]).map(x=>`${formatClock(x.epoch)} ${x.label}`).join(' → ')||'—'}`,
    `Allergies: ${v(h.allergies)}\nComorbidities: ${v(h.comorbidities)}\nPrecautions: ${v(h.precautions)}`,
    `All actual medications (${(h.administrations||[]).length}; excludes VOID):\n${(h.administrations||[]).map(d=>`${d.clock||clock(d.epoch)} • ${d.drug}: ${d.actual} ${d.unit} • ${d.route} • ${d.concentration||'preparation not recorded'} • ${d.administeredBy||'by not recorded'}${d.note?' • '+d.note:''}`).join('\n')||'ไม่มีบันทึกการให้ยา'}`,
    `Frozen protocol: ${h.protocol?.name||'legacy'} • ${h.protocol?.version||'unversioned'}`
  ].join('\n\n');
}
function renderRecoveryHandoffCompact(h){
  const box=$('recoveryHandoffCompact');if(!box)return;
  const vit=h.latestRecovery||h.latestAnesthesia,open=(h.alerts?.length||0)+(h.complications?.length||0),medCount=(h.administrations||[]).length;
  const airway=h.extubatedAt?`Extubated ${formatClock(h.extubatedAt)}`:recoveryObservationNA('extubation')?'Extubation N/A':'Extubation pending';
  const latest=vit?`HR ${vit.hr??'—'} • RR ${vit.rr??'—'} • SpO₂ ${vit.spo2??'—'}${vit.spo2==null?'':'%'} • ${vit.mentation||h.mentation||'—'}`:'No recovery vitals yet';
  const problem=open?`${open} open problem${open===1?'':'s'}`:'No unresolved problem',transfer=h.transfer?`${h.transfer.destination||'Transfer'} → ${h.transfer.handoffTo||'recipient'}`:'';
  const rows=[
    ['Airway',airway,h.oxygen||'','airway'],
    ['Latest',latest,vit?.clock||'','latest'],
    ['Transfer',problem,[transfer,`${medCount} medication record${medCount===1?'':'s'}`].filter(Boolean).join(' • '),open?'danger':'good']
  ];
  box.innerHTML=rows.map(([label,value,small,tone])=>`<div class="recovery-handoff-quick ${tone}"><span>${escapeHtml(label)}</span><b>${escapeHtml(value)}</b>${small?`<small>${escapeHtml(small)}</small>`:''}</div>`).join('');
}
function renderRecoveryHandoffSummary(h){
  const box=$('recoveryHandoffSummary');if(!box)return;const vit=h.latestRecovery||h.latestAnesthesia,open=(h.alerts?.length||0)+(h.complications?.length||0),duration=h.caseStartedAt?Math.max(0,(h.recoveryStartedAt||Date.now())-h.caseStartedAt):null;
  const airway=[h.extubatedAt?`Extubated ${formatClock(h.extubatedAt)}`:'Extubation not recorded',h.airway?.difficulty&&!/^(none|easy|normal|no)$/i.test(h.airway.difficulty)?h.airway.difficulty:''].filter(Boolean).join(' • ');
  const vitalText=vit?`HR ${vit.hr??'—'} • RR ${vit.rr??'—'} • MAP ${vit.map??'—'} • SpO₂ ${vit.spo2??'—'}% • Temp ${vit.temp==null?'—':tempTextF(vit.temp)}`:'No recorded vitals';
  const fluidText=[h.fluids?.actualTotal!=null?`Total ${h.fluids.actualTotal} mL`:h.fluids?.crystalloid!=null?`Crystalloid ${h.fluids.crystalloid} mL`:'',h.fluids?.bolus!=null?`Bolus ${h.fluids.bolus} mL`:'',h.fluids?.bloodLoss!=null?`Loss ${h.fluids.bloodLoss} mL`:''].filter(Boolean).join(' • ')||'—';
  const cards=[
    ['Procedure',h.procedure||'—',duration!=null?`Anesthesia ${formatElapsed(duration)}`:'Duration —',''],
    ['Latest vitals',vitalText,vit?.clock||'',''],
    ['Airway / extubation',airway||'—',h.airway?.ett?`ETT ${h.airway.ett} mm`:'' ,h.watchItems?.some(x=>x.label==='Airway'||x.label==='Airway risk')?'warn':''],
    ['Fluids / loss',fluidText,'',''],
    ['Recovery',h.mentation||'—',[h.oxygen||'',h.recovery2?.painScale&&h.recovery2?.painScore?`${h.recovery2.painScale} ${h.recovery2.painScore}`:h.pain||'',h.recovery2?.ambulation||''].filter(Boolean).join(' • '),''],
    ['Open problems',String(open),open?'Review WATCH items before transfer':'No unresolved alert / complication',open?'danger':'']
  ];
  box.innerHTML=cards.map(([label,value,small,cls])=>`<div class="handoff-summary-card ${cls}"><span>${escapeHtml(label)}</span><b>${escapeHtml(String(value))}</b>${small?`<small>${escapeHtml(small)}</small>`:''}</div>`).join('');
  if($('recoveryHandoffProblemBadge')){$('recoveryHandoffProblemBadge').textContent=open?`${open} OPEN`:'CLEAR';$('recoveryHandoffProblemBadge').className=`status-pill ${open?'warn':'good'}`}
}
function renderRecoveryHandoffV2(h){
  const watch=h.watchItems||[],attention=$('recoveryHandoffAttention');
  if(attention){attention.hidden=!watch.length;attention.innerHTML=watch.length?`<div class="handoff-attention-title">WATCH / HANDOFF FIRST</div>${watch.slice(0,5).map(x=>`<div class="handoff-watch-item ${escapeHtml(x.level||'warn')}"><b>${escapeHtml(x.label)}</b><span>${escapeHtml(x.text)}</span></div>`).join('')}`:''}
  const groups=h.medicationGroups||handoffMedicationGroups(h.administrations||[]),med=$('recoveryHandoffMedicationRows');if(med)med.innerHTML=[['Analgesia',groups.analgesia],['Antibiotic',groups.antibiotic],['NSAID',groups.nsaid]].map(([label,arr])=>`<div class="handoff-med-row ${arr.length?'':'empty'}"><span>${label}</span><b>${escapeHtml(handoffMedicationLine(arr))}</b></div>`).join('');
  const tl=$('recoveryHandoffTimeline');if(tl)tl.innerHTML=(h.timeline||[]).length?(h.timeline||[]).map(x=>`<div class="handoff-timeline-item ${x.kind==='med'?'med':''}"><time>${escapeHtml(formatClock(x.epoch))}</time><span>${escapeHtml(x.label)}</span></div>`).join(''):'<div class="empty-state compact">No key timeline events yet</div>';
  const ready=$('recoveryHandoffReady');if(ready){const r=h.readiness||{},checks=[['Vitals',Number(r.records)>0],['Checklist',Number(r.reviewed)>=Number(r.required)&&Number(r.required)>0],['Score',Number(r.scores)>0],['Extubation',!!h.extubatedAt||recoveryObservationNA('extubation')],['Problems',!(h.alerts?.length||h.complications?.length)]];ready.innerHTML=checks.map(([label,ok])=>`<span class="handoff-ready-chip ${ok?'ok':'pending'}">${ok?'✓':'•'} ${label}</span>`).join('')}
}
function renderRecoveryHandoff(){const h=buildRecoveryHandoffViewModel();renderRecoveryHandoffCompact(h);renderRecoveryHandoffSummary(h);renderRecoveryHandoffV2(h);if($('recoveryHandoffText'))$('recoveryHandoffText').textContent=handoffText(h);const arr=state.recoveryHandoffs||[];if($('recoveryHandoffHistory'))$('recoveryHandoffHistory').innerHTML=arr.length?arr.slice().reverse().map((x,ri)=>{const i=arr.length-ri;return `<details><summary>Handoff ${i} • ${escapeHtml(formatClock(x.generatedAt))} • ${escapeHtml(x.reason)}</summary><pre>${escapeHtml(handoffText(x))}</pre></details>`}).join(''):'<p>Snapshot จะถูกสร้างอัตโนมัติเมื่อเริ่ม Recovery และเมื่อ Recovery complete</p>'}
document.addEventListener('input',e=>{const key=OR_SYNC[e.target.id]||e.target.id;if(WF.metrics.includes(key))alertObservationRevision[key]=(alertObservationRevision[key]||0)+1},true);
$('editHospitalAlertBtn')?.addEventListener('click',()=>openAlertProtocolEditor('hospital'));
$('editCaseAlertBtn')?.addEventListener('click',()=>openAlertProtocolEditor('case'));
$('saveAlertProtocolBtn')?.addEventListener('click',()=>saveAlertProtocolEdit());
$('clearCaseAlertOverrideBtn')?.addEventListener('click',()=>saveAlertProtocolEdit(true));
$('saveProblemActionBtn')?.addEventListener('click',saveProblemAction);
// Medication workspace event bindings are owned by medication-workspace-controller.js

// R08: Medication uses its controller-owned close path to clear transient drug
// selection/batch context. Generic dialogs use the guarded close helper.
$$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>{
  const id=b.dataset.closeDialog;
  if(id==='orQuickDrugDialog')closeOrQuickDrugWorkspace();
  else closeDialogSafe(id);
}));
for(const id of ['orProblemPanel','recoveryProblemPanel'])$(id)?.addEventListener('click',e=>{const b=e.target.closest('[data-problem-action]');if(b)openProblemAction(b.dataset.kind,b.dataset.id,b.dataset.problemAction)});
for(const id of ['map','spo2','etco2','temp','orMap','orSpo2','orEtco2','orTemp'])$(id)?.addEventListener('blur',()=>setTimeout(()=>{maybeShowCriticalClinicalAlert();save()},0));
$('orStickyRecordBtn')?.addEventListener('click',()=>$('orRecordNowBtn')?.click());
$('dismissSafetyRecoveryBtn')?.addEventListener('click',()=>{startupRecoveryNotice=null;renderStartupRecoveryNotice()});

BOOT?.mark?.('public-api-publishing');
window.AnesvetApp=Object.freeze({
  getState:()=>state,
  startupStatus:()=>({primaryUnreadable:startupPrimaryUnreadable,recoveredOnlyInMemory:startupRecoveredOnlyInMemory,restoreReview:restoreJournalNeedsReview(),freshnessBlocked:CASE_FRESHNESS.isBlocked(),freshnessReason:CASE_FRESHNESS.reason(),sessionActive:sessionActive()}),
  save:(options)=>save(options),
  audit:(action,detail,actor='')=>addAudit(action,detail,actor),
  escapeHtml:(value)=>escapeHtml(value),
  setTab:(id,options)=>setTab(id,options),
  resumeActiveCase:(options={})=>resumeActiveClinicalWorkspace(options),
  resetCurrent:()=>resetCurrent(),
  exportPdfReport:()=>exportPdfReport(),
  exportPdfSummary:()=>exportPdfSummary(),
  settings:()=>currentSettingsObject(),
  toast:(message)=>toast(message),
  renderEndCase:()=>renderEndCase(),
  clinicalWriteAllowed:()=>clinicalWriteAllowed(),
  medicationQueue:()=>plannedRoutineMedicationRows().map(r=>({planIndex:r.planIndex,item:WF.clone(r.item),status:r.status,actual:r.actual?WF.clone(r.actual):null})),
  openMedication:(options={})=>openOrQuickDrug(options),
  releaseCandidate:Object.freeze({isFinalSealed:(caseObj)=>finalCaseIsSealed(caseObj),versionReloadUnsafe:(caseObj)=>versionReloadUnsafe(caseObj)}),
  finalArchive:Object.freeze({verify:(caseObj)=>verifyFinalArchive(caseObj||state),retry:()=>retryFinalArchive(),backend:()=>archiveBackend,shortChecksum:(value)=>shortChecksum(value),archiveCase:()=>getArchive().find(c=>c?.caseId===state?.caseId)||null}),
  productionPilot:Object.freeze({snapshot:()=>window.ANESVET_PRODUCTION_PILOT?.snapshot?.()||null,run:()=>window.ANESVET_PRODUCTION_PILOT?.runReadiness?.({announce:true})}),
  productionValidation:Object.freeze({snapshot:()=>window.ANESVET_VALIDATION_CENTER?.snapshot?.()||null,summary:()=>window.ANESVET_VALIDATION_CENTER?.historySummary?.()||null}),
  protocolGovernance:Object.freeze({summary:()=>PROTOCOL_GOVERNANCE?.summary?.()||null,startGate:()=>PROTOCOL_GOVERNANCE?.startGate?.(captureHospitalProtocolPayload())||{ok:true,mode:'legacy'}}),
  security:Object.freeze({enabled:()=>!!SECURITY?.enabled?.(),locked:()=>!!SECURITY?.locked?.(),identity:()=>SECURITY?.activeIdentity?.()||null,session:()=>SECURITY?.sessionSnapshot?.()||null,device:()=>SECURITY?.deviceIdentity?.()||null,can:(action)=>SECURITY?.can?.(action)!==false,snapshot:()=>SECURITY?.snapshot?.()||null,lock:()=>SECURITY?.lock?.('manual')}),
  caseReview:Object.freeze({archives:()=>JSON.parse(JSON.stringify(getArchive()||[])),current:()=>JSON.parse(JSON.stringify(state||{}))}),
  architecture:Object.freeze({health:()=>window.ANESVET_ARCHITECTURE_REGISTRY?.summarize?.()||null}),
  syncFoundation:Object.freeze({snapshot:()=>SYNC_FOUNDATION?.snapshot?.()||null,inspect:()=>SYNC_FOUNDATION?.inspect?.()||null,syncNow:()=>SYNC_FOUNDATION?.syncNow?.()||Promise.resolve(null),probe:()=>SYNC_FOUNDATION?.probeAdapter?.()||Promise.resolve(null),previewRemote:(caseId,options)=>SYNC_FOUNDATION?.previewRemoteChanges?.(caseId,options)||Promise.resolve(null),reviewConflict:(id,options)=>SYNC_FOUNDATION?.reviewConflict?.(id,options)||null,exportConflictEvidence:(id)=>SYNC_FOUNDATION?.exportConflictEvidence?.(id)||null}),
  caseLifecycle:Object.freeze({hasActive:()=>hasActiveCaseData(),isFinalSealed:(caseObj)=>finalCaseIsSealed(caseObj),reloadUnsafe:(caseObj)=>versionReloadUnsafe(caseObj)}),
  simulation:Object.freeze({active:()=>!!state.simulationMode,start:(options)=>startSimulationCase(options),exit:()=>exitSimulationCase()})
});

BOOT?.mark?.('public-api-published');
try{
  SECURITY?.init?.({
    toast:(message)=>toast(message),
    openSettings:()=>setTab('settings',{force:true}),
    onIdentityChanged:(identity)=>{try{if(identity?.displayName&&!$('anesthetist')?.value&&state.casePhase==='setup')$('anesthetist').value=identity.displayName}catch(e){} }
  });
}catch(e){recordRuntimeError(e?.message||String(e),'security-baseline-init',0,0,e?.stack||'')}
try{
  SYNC_FOUNDATION?.init?.({
    coreStorage:CORE_STORAGE,
    getOnline:()=>navigator.onLine!==false,
    getContext:()=>{
      const identity=SECURITY?.activeIdentity?.()||null,session=SECURITY?.sessionSnapshot?.()||null,device=SECURITY?.deviceIdentity?.()||session?.device||null;
      return{actorId:identity?.id||'',sessionId:session?.sessionId||'',deviceId:device?.deviceId||''};
    }
  });
  BOOT?.mark?.('sync-hydrate-start');
  await SYNC_FOUNDATION?.hydrateMirror?.();
  BOOT?.mark?.('sync-hydrate-complete');
}catch(e){recordRuntimeError(e?.message||String(e),'sync-foundation-init',0,0,e?.stack||'')}
initSessionCoordination();
BOOT?.mark?.('session-reconciled',SESSION_CONTROLLER.getMode?.()||'');
load();
CASE_FRESHNESS.establish();
// Fail closed even if no valid safety checkpoint / legacy case exists.
if(startupPrimaryUnreadable)CASE_FRESHNESS.block('startup-primary-unreadable');
if(startupRecoveredOnlyInMemory)CASE_FRESHNESS.block('startup-recovery-unpersisted');
if(restoreJournalNeedsReview())CASE_FRESHNESS.block('interrupted-restore-requires-review');
BOOT?.mark?.('current-case-loaded');
for(const key of WF.metrics)alertObservationRevision[key]=Math.max(0,...(state.alertEpisodes||[]).filter(a=>alertMetricForEpisode(a)===key).map(a=>a.observationRevision||0));
const restoredFromMirror=await reconcileCurrentFromMirror();if(restoredFromMirror){restartAtAppRoot();return}
migrateLegacyAgeUi();
archiveCache=getLegacyArchiveSeed();
syncPatientProcedureToCase();
breedAliases=loadBreedAliases();renderBreedAliasSettings();
loadSettings();applyHospitalDefaultsToFreshCaseUi();hospitalDrugLibrary=loadDrugLibraryData();renderDrugLibrarySettings();renderPhaseDrugSelectors();initHospitalProtocolGovernance();setTimeout(()=>{renderProtocolGovernance();renderProtocolDoseReview();PROTOCOL_GOVERNANCE?.render?.()},0);
syncAsaCards();updatePatientSaveStatus();
let storedTab=safeStartupPreference(TAB_KEY)||'casesummary';
// dashboard remains a supported legacy route under Advanced.
let safeUpdateResume=null;try{safeUpdateResume=JSON.parse(localStorage.getItem(SAFE_UPDATE_KEY)||'null')}catch(_){ }
if(safeUpdateResume?.caseId===state.caseId&&safeUpdateResume?.resumeTab)storedTab=safeUpdateResume.resumeTab;
const activeCaseTarget=ACTIVE_CASE_RESCUE.targetForState(state);
// V17.2.3: an already-started case must resume its clinical workspace even if Patient Setup later became NOT SAVED.
// NOT SAVED remains visible and must still be reviewed; it no longer traps a progressed anesthesia case on Patient.
const coldLaunchHome=!!$('start')&&performance.getEntriesByType('navigation')[0]?.type!=='reload'&&!safeUpdateResume;
const initialTab=coldLaunchHome?'start':activeCaseTarget||(state.patientSaved?storedTab:'patient');
const resumeClinicalTab=['orlive','recovery','endcase'].includes(initialTab)&&!!activeCaseTarget;
setTab(initialTab,{force:resumeClinicalTab});
// A valid progressed case must still display OR LIVE/Recovery after a PWA reload;
// the fallback runs only if normal navigation failed to activate the expected page.
if(resumeClinicalTab&&!$(initialTab)?.classList.contains('active')){
  BOOT?.mark?.('startup-active-route-repair',initialTab);
  forceActivateClinicalUI(initialTab);
}
BOOT?.mark?.('initial-tab-rendered',initialTab);
if(safeUpdateResume?.caseId===state.caseId){try{localStorage.removeItem(SAFE_UPDATE_KEY)}catch(_){ }}
if(sessionActive())writeSessionLock();renderPatientRiskBanner();renderPreopRisk();renderSessionMode();renderAirwayPanel();renderFavoriteDrugButtons();renderQuickPresetSettings();renderQuickPresetSummary();renderOrFluidPanel();renderCaseSummary();renderCasePhase();renderOrPhaseTracker();renderRecoveryRecords();renderWorkflowLocks();renderAlertFeedbackState();renderProtocolGovernance();renderStorageStatus();renderFinalSignoff();renderBackupHealth();renderLinkedPatient();renderPatientMaster();
updateDashboard();renderDoseReferenceChips();renderStartupRecoveryNotice();renderPreop();renderPreopExam();renderRecords();renderCorrections();renderEvents();renderComplications();renderDrugAdministrationAudit();renderTrends();renderProcedureTimeline();renderRecovery();renderRecoveryState();renderRecoveryScores();renderArchives();updateDue();renderTimerState();updateDoseSpotlights();renderEndCase();renderOrLive();renderSaveState();
setTimeout(()=>{try{renderPilotFeedbackStatus();runReliabilitySelfCheck()}catch(e){recordRuntimeError(e?.message||String(e),'startup-self-check',0,0,e?.stack||'')}},1200);
try{
  window.ANESVET_PRODUCTION_PILOT?.init?.({
    getState:()=>state,
    getRuntimeErrors:()=>getRuntimeErrorLog(),
    recoveryCopies:()=>recoveryCopyStatus(),
    verifyFinalArchive:()=>verifyFinalArchive(state),
    toast:(message)=>toast(message)
  });
}catch(e){recordRuntimeError(e?.message||String(e),'production-pilot-init',0,0,e?.stack||'')}
try{
  window.ANESVET_VALIDATION_CENTER?.init?.({
    getState:()=>state,
    getRuntimeErrors:()=>getRuntimeErrorLog(),
    verifyFinalArchive:()=>verifyFinalArchive(state),
    dataSafety:()=>window.AnesvetDataBridge?.dataSafetySnapshot?.()||null,
    toast:(message)=>toast(message)
  });
}catch(e){recordRuntimeError(e?.message||String(e),'validation-center-init',0,0,e?.stack||'')}
if(state.timer.running && state.timer.startedEpoch && sessionActive()) startTimerLoop();
BOOT?.ready?.('startup-complete');
})().catch(err=>{
  try{window.ANESVET_BOOT_DIAGNOSTIC?.fail?.(err,{stage:'app-unhandled',source:'app.js',reason:'app startup failed'})}catch(_){ }
  try{console.error('ANESVET boot failed',err)}catch(_){ }
});
