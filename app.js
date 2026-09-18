(() => {
'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const CURRENT_KEY = 'anesvet_v14_1_current';
const ARCHIVE_KEY = 'anesvet_v14_1_archive_legacy';
const TAB_KEY = 'anesvet_v14_1_tab';
const SETTINGS_KEY='anesvet_v14_1_settings';
const DRUG_LIBRARY_KEY='anesvet_v14_1_drug_library';
const QUICK_PRESET_KEY='anesvet_v14_1_quick_presets';
const ALERT_PREF_KEY='anesvet_due_alert_feedback';
const PROTOCOL_AUDIT_KEY='anesvet_v14_1_protocol_audit';
const LAST_BACKUP_KEY='anesvet_v14_1_last_backup';
const DB_NAME='ANESVET_DB';
const DB_VERSION=1;

const numericFields = ['weight','hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal','recHR','recRR','recMAP','recSpO2','recTemp'];
const dataFields = [
  'patientName','hospitalId','species','breed','weight','age','bcs','asa','emergency','patientProcedure','patientAllergies','patientComorbidities','patientPrecautions','procedure','surgeon','anesthetist','surgicalAssistant',
  'hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal',
  'depth','ventilation','bradyPoorPerf','bloodLoss','cardiacRisk','respRisk','recordInterval','reminderOn',
  'recordNote','recHR','recRR','recMAP','recSpO2','recTemp','recExtubation','recOxygen','recMentation','recPain','recRecordInterval','planPremed','planInduction','planMaintenance','planAnalgesia','planAntibiotic','planNSAID','planBlock','planNote','actualDiazepamMl','actualPropofolMl','actualTramadolMl','balanceCrystalloid','balanceBolus','balanceBloodIn','balanceBloodLoss','balanceUrine','fluidActualTotal','airwayEttSize','airwayEttDepth','airwayCuff','airwayDifficulty','airwayCircuit','airwayVentMode','airwayVt','airwayPip','airwayPeep','airwayVentRr','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'
];

let state = {
  caseId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  humanRecordId: makeHumanRecordId(Date.now()),
  createdAt: Date.now(),
  timer: {running:false, startedEpoch:null, elapsedMs:0},
  records: [],
  events: [],
  recoveryChecks: [false,false,false,false,false,false],
  patientSaved:false,
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

let alertAudioContext=null;
let alertAudioReady=false;
let alertFeedbackEnabled=localStorage.getItem(ALERT_PREF_KEY)!=='off';
let recoveryDueReminderToken=null;

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
  if(phase==='recovery'&&!state.recoveryStartedAt)state.recoveryStartedAt=Date.now();
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
function ensureTimerStarted(){
  if(state.timer.running || state.timer.elapsedMs>0) return;
  state.timer.running=true;
  state.timer.startedEpoch=Date.now();
  if(!state.caseStartedAt) state.caseStartedAt=state.timer.startedEpoch;
  startTimerLoop();renderTimerState();
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
    req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains('cases')){const s=db.createObjectStore('cases',{keyPath:'caseId'});s.createIndex('archivedAt','archivedAt',{unique:false})}if(!db.objectStoreNames.contains('meta'))db.createObjectStore('meta',{keyPath:'key'})};
    req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error||new Error('IndexedDB failed'));
  });
  return archiveDbPromise;
}
async function idbGetAllCases(){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readonly').objectStore('cases').getAll();r.onsuccess=()=>resolve((r.result||[]).sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0)));r.onerror=()=>reject(r.error)})}
async function idbPutCase(c){const db=await openAnesvetDb(),copy=JSON.parse(JSON.stringify(c));if(!copy.caseId)copy.caseId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readwrite').objectStore('cases').put(copy);r.onsuccess=()=>resolve(copy);r.onerror=()=>reject(r.error)})}
async function idbDeleteCase(id){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readwrite').objectStore('cases').delete(id);r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function idbClearCases(){const db=await openAnesvetDb();return await new Promise((resolve,reject)=>{const r=db.transaction('cases','readwrite').objectStore('cases').clear();r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}
async function idbPutMeta(key,value){try{const db=await openAnesvetDb();await new Promise((resolve,reject)=>{const r=db.transaction('meta','readwrite').objectStore('meta').put({key,value,updatedAt:Date.now()});r.onsuccess=()=>resolve();r.onerror=()=>reject(r.error)})}catch(e){}}
function queueCurrentMirror(){clearTimeout(currentMirrorTimer);const copy=JSON.parse(JSON.stringify(state));currentMirrorTimer=setTimeout(()=>idbPutMeta('current',copy),180)}
function getLegacyArchiveSeed(){
  const keys=['anesvet_v14_archive_legacy','anesvet_v13_4_archive','anesvet_v13_3_archive','anesvet_v13_2_archive','anesvet_v13_1_archive','anesvet_v13_archive','anesvet_v12_1_archive','anesvet_v12_archive','anesvet_v11_archive','anesvet_v10_archive','anesvet_v9_archive','anesvet_v8_archive','anesvet_v7_archive','anesvet_v6_1_archive','anesvet_v6_archive','anesvet_v5_archive','anesvet_v4_archive','anesvet_v3_archive'];
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
      if(!c.finalSignoff){c.finalSignoff={anesthetist:null,surgeon:null};changed=true}
      if(!('voidedAt' in c)){c.voidedAt=null;changed=true}
      if(c.caseLocked&&!c.finalChecksum){c.finalChecksum=await computeCaseChecksum(c);c.checksumAlgorithm='SHA-256';c.checksumCreatedAt=Date.now();changed=true}
      if(changed)await idbPutCase(c);
    }
    archiveCache=dbCases;archiveBackend='IndexedDB';
  }catch(e){archiveCache=getLegacyArchiveSeed();archiveBackend='localStorage fallback'}
  renderStorageStatus();renderArchives();queueCurrentMirror();return archiveCache;
}
function renderStorageStatus(){const el=$('storageStatus');if(el)el.textContent=`Storage: ${archiveBackend} • ${archiveCache.length} archived case${archiveCache.length===1?'':'s'} • no 50-case cap`}

function save(){
  renderSaveState('saving');
  try{
    dataFields.forEach(id=>{
      const el=$(id);if(!el)return;
      state[id]=el.type==='checkbox'?el.checked:el.value;
    });
    state.recoveryChecks=$$('.recovery-check').map(x=>x.checked);
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
function migrateV3Case(raw){
  if(!raw || typeof raw!=='object') return raw;
  const x=JSON.parse(JSON.stringify(raw));
  if(Number(x.temp)<60) x.temp=Number(cToF(x.temp).toFixed(1));
  if(Number(x.recTemp)<60) x.recTemp=Number(cToF(x.recTemp).toFixed(1));
  if(Array.isArray(x.records)) x.records=x.records.map(r=>({...r,temp:Number(r.temp)<60?Number(cToF(r.temp).toFixed(1)):r.temp}));
  x.migratedFromV3=true;
  return x;
}
function load(){
  try{
    let raw=JSON.parse(localStorage.getItem(CURRENT_KEY)||'null');
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
    if(raw && typeof raw==='object') state={...state,...raw};if(!Array.isArray(state.fluidRateHistory))state.fluidRateHistory=[];
    if(!Array.isArray(state.corrections))state.corrections=[];
    if(!state.casePhase){
      if(state.caseLocked)state.casePhase='complete';
      else if(state.recoveryCompletedAt)state.casePhase='complete';
      else if(state.recoveryStartedAt)state.casePhase='recovery';
      else if(state.caseStartedAt)state.casePhase='intraop';
      else state.casePhase='setup';
    }
    if(!('caseLocked' in state))state.caseLocked=false;
    if(!Array.isArray(state.recoveryRecords))state.recoveryRecords=[];
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
    if(!state.caseStartedAt && !(state.timer?.elapsedMs>0) && !state.recoveryStartedAt && !state.recoveryCompletedAt && !state.caseLocked)state.casePhase='setup';
  }catch(e){}
  dataFields.forEach(id=>{
    const el=$(id);if(!el || !(id in state)) return;
    if(el.type==='checkbox') el.checked=!!state[id]; else el.value=state[id] ?? '';
  });
  $$('.recovery-check').forEach((el,i)=>el.checked=!!(state.recoveryChecks||[])[i]);
  $$('.preop-check').forEach(el=>el.checked=!!(state.preopChecks||{})[el.dataset.key]);
  $$('.preop-na-btn').forEach(btn=>{const na=!!(state.preopNA||{})[btn.dataset.key];btn.closest('.preop-item')?.classList.toggle('na',na);if(na){const cb=btn.closest('.preop-item')?.querySelector('.preop-check');if(cb)cb.checked=false;}});
  if(state.timer.running && state.timer.startedEpoch) startTimerLoop();
initArchiveDb();
if((state.timer.running||state.casePhase==='recovery')&&autoWakeEnabled())requestScreenWakeLock(true);
  $('caseClock').textContent=formatElapsed(currentElapsed());
}

function syncAsaCards(){
  const selected=$('asa').value||'II';
  $$('.asa-card').forEach(c=>c.classList.toggle('selected',c.dataset.asa===selected));
  if($('selectedAsaBadge')) $('selectedAsaBadge').textContent=`ASA ${selected}${$('emergency').checked?'-E':''}`;
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

$('savePatientBtn').addEventListener('click',()=>{
  const name=$('patientName').value.trim(),weight=Number($('weight').value);
  if(!name){toast('กรุณาใส่ชื่อสัตว์');$('patientName').focus();return}
  if(!Number.isFinite(weight)||weight<=0){toast('กรุณาใส่น้ำหนักที่ถูกต้อง');$('weight').focus();return}
  syncPatientProcedureToCase();state.patientSaved=true;save();syncAsaCards();updatePatientSaveStatus();
  toast('บันทึกข้อมูลผู้ป่วยแล้ว');
  setTab('preop');
});
$('editPatientBtn').addEventListener('click',()=>setTab('patient'));
['patientName','hospitalId','species','breed','age','weight','bcs','emergency','patientProcedure','patientAllergies','patientComorbidities','patientPrecautions','surgeon','anesthetist','surgicalAssistant'].forEach(id=>{
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
function orStatusText(level,good,warn,danger){return level==='danger'?danger:level==='warn'?warn:good}
function sparkSvg(values,minHint=null,maxHint=null){const vals=values.map(Number).filter(Number.isFinite);if(vals.length<2)return '<div class="or-spark-empty">Need ≥2 records</div>';let min=Math.min(...vals),max=Math.max(...vals);if(Number.isFinite(minHint))min=Math.min(min,minHint);if(Number.isFinite(maxHint))max=Math.max(max,maxHint);if(max===min){max+=1;min-=1}const w=220,h=70,p=7;const coords=vals.map((v,i)=>{const x=p+(i/(vals.length-1))*(w-p*2),y=h-p-((v-min)/(max-min))*(h-p*2);return [x.toFixed(1),y.toFixed(1)]});const pts=coords.map(x=>x.join(',')).join(' '),last=coords[coords.length-1],lastVal=vals[vals.length-1];return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#14758c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3.5" fill="#0d5265"/><text x="${w-p}" y="${p+7}" text-anchor="end" font-size="10" fill="#54656f">${escapeHtml(lastVal)}</text></svg>`}
function renderOrMiniTrends(){const r=(state.records||[]).slice(-6),m={orSparkMap:['map',55,80],orSparkSpo2:['spo2',90,100],orSparkEtco2:['etco2',30,60],orSparkTemp:['temp',98,100]};Object.entries(m).forEach(([id,[key,min,max]])=>{if($(id))$(id).innerHTML=sparkSvg(r.map(x=>x[key]),min,max)})}
function renderOrRecent(){const items=[...(state.records||[]).slice(-5).map(r=>({epoch:r.epoch,elapsedMs:r.elapsedMs,kind:'Record',desc:`HR ${r.hr} • MAP ${r.map} • SpO₂ ${r.spo2} • ETCO₂ ${r.etco2} • Temp ${r.temp}°F`})),...(state.events||[]).slice(-5).map(e=>({epoch:e.epoch,elapsedMs:e.elapsedMs,kind:e.category,desc:`${e.name}${e.dose?' • '+e.dose:''}`}))].sort((a,b)=>b.epoch-a.epoch).slice(0,7);const box=$('orRecentActivity');if(!box)return;if(!items.length){box.className='or-recent-list empty-state compact';box.textContent='ยังไม่มีข้อมูล';return}box.className='or-recent-list';box.innerHTML=items.map(i=>`<div class="or-recent-item"><span class="t">${escapeHtml(formatShortElapsed(i.elapsedMs))}</span><span class="kind">${escapeHtml(i.kind)}</span><span class="desc">${escapeHtml(i.desc)}</span></div>`).join('')}
function renderOrTimerState(){if(!$('orTimerState'))return;if(state.timer.running){$('orTimerState').className='timer-state running';$('orTimerState').textContent='● RUNNING';$('orStartBtn').textContent='Running';$('orStartBtn').disabled=true;$('orPauseBtn').disabled=false;$('orPauseBtn').textContent='Pause case'}else if((state.timer.elapsedMs||0)>0){$('orTimerState').className='timer-state paused';$('orTimerState').textContent='PAUSED';$('orStartBtn').textContent='▶ Resume';$('orStartBtn').disabled=false;$('orPauseBtn').disabled=true;$('orPauseBtn').textContent='Paused'}else{$('orTimerState').className='timer-state ready';$('orTimerState').textContent='READY';$('orStartBtn').textContent='▶ Start case';$('orStartBtn').disabled=false;$('orPauseBtn').disabled=true;$('orPauseBtn').textContent='Pause'}$('orCaseClock').textContent=formatElapsed(currentElapsed())}

function renderAirwayPanel(){
  const mode=$('airwayVentMode')?.value||'Spontaneous';
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
  $('orPatientName').textContent=name;$('orPatientMeta').textContent=`${species==='cat'?'Cat':'Dog'}${breed?' • '+breed:''} • ${weight||'—'} kg`;
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
  const overall=$('globalStatus').textContent;$('orGlobalStatus').textContent=overall;$('orGlobalStatus').className=overall==='INTERVENE'?'or-status-danger':overall==='REASSESS'?'or-status-warn':'or-status-good';
  const latest=latestRecord();$('orLastRecord').textContent=latest?`${latest.clock} • ${formatShortElapsed(latest.elapsedMs)}`:'—';
  if(latest){
    const due=latest.epoch+Number($('recordInterval').value||5)*60000,delta=due-Date.now();
    $('orNextDue').textContent=delta<=0?`DUE +${Math.floor(Math.abs(delta)/60000)}:${pad(Math.floor((Math.abs(delta)%60000)/1000))}`:`in ${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;
    $('orNextDueClock').textContent=`clock ${formatClock(due)}`;
    $('orRecordNowBtn').classList.toggle('due',delta<=0);
$('orStickyRecordBtn')?.addEventListener('click',()=>$('orRecordNowBtn')?.click());
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
  const hints={hr:orStatusText(st.hr,species==='cat'?'100–180 screening':'60–150 screening','Reassess HR','Critical HR alert'),rr:orStatusText(st.rr,species==='cat'?'10–28 screening':'8–20 screening','Reassess RR','Critical RR / apnea risk'),map:orStatusText(st.map,'MAP acceptable','MAP 60–69','MAP <60'),spo2:orStatusText(st.spo2,'≥95%','SpO₂ <95%','SpO₂ <90%'),etco2:orStatusText(st.etco2,'40–55','Outside usual range','Critical ETCO₂ range'),temp:orStatusText(st.temp,'Temp acceptable','Warming indicated','<98°F')};
  const cap={hr:'Hr',rr:'Rr',map:'Map',spo2:'Spo2',etco2:'Etco2',temp:'Temp'};
  ['hr','rr','map','spo2','etco2','temp'].forEach(k=>{const card=document.querySelector(`.or-vital-card[data-vital="${k}"]`);if(card){card.classList.remove('good','warn','danger');card.classList.add(st[k])}const h=$('or'+cap[k]+'Hint');if(h)h.textContent=hints[k]});
  const immediate=[];
  if(st.hr!=='good')immediate.push({level:st.hr,title:'HR alert',text:hints.hr});if(st.rr!=='good')immediate.push({level:st.rr,title:'RR alert',text:hints.rr});if(st.map!=='good')immediate.push({level:st.map,title:'Blood pressure',text:hints.map});if(st.spo2!=='good')immediate.push({level:st.spo2,title:'Oxygenation',text:hints.spo2});if(st.etco2!=='good')immediate.push({level:st.etco2,title:'Ventilation',text:hints.etco2});if(st.temp!=='good')immediate.push({level:st.temp,title:'Temperature',text:hints.temp});
  immediate.sort((a,b)=>(a.level==='danger'?0:1)-(b.level==='danger'?0:1));
  const trends=getSmartAlerts();
  const total=immediate.length+trends.length;$('orAlertCount').textContent=`${total} ALERT${total===1?'':'S'}`;$('orAlertCount').className=`status-pill ${immediate.some(a=>a.level==='danger')||trends.some(a=>a.level==='danger')?'danger':total?'warn':'good'}`;
  const group=(title,kind,arr)=>arr.length?`<div class="or-alert-group ${kind}"><div class="or-alert-group-title">${title}</div>${arr.map(a=>`<div class="or-alert-item ${a.level}"><b>${escapeHtml(a.title)}</b><span>${escapeHtml(a.text)}</span></div>`).join('')}</div>`:'';
  $('orAlertList').innerHTML=total?group('Immediate','immediate',immediate)+group('Trend','trend',trends):'<div class="empty-state compact">No active alerts</div>';
  renderOrFluidPanel();renderOrMiniTrends();renderOrRecent();renderOrTimerState();renderSaveState();renderRecoveryState();
}
function startCaseFromOr(){if(state.timer.running)return true;const preopTotal=$$('.preop-check').length,preopDone=$$('.preop-check').filter(x=>x.checked).length,preopNA=$$('.preop-item.na').length,preopReviewed=preopDone+preopNA;if(preopReviewed<preopTotal&&!confirm(`Pre-op checklist ยัง review ไม่ครบ (${preopReviewed}/${preopTotal}) — ต้องการเริ่มเคสต่อหรือไม่?`))return false;const firstStart=(state.timer.elapsedMs||0)===0&&!state.caseStartedAt;state.timer.running=true;state.timer.startedEpoch=Date.now();if(firstStart){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';captureProtocolSnapshot();addAudit('CASE_STARTED','Anesthesia case timer started');}startTimerLoop();renderTimerState();renderOrTimerState();renderCasePhase();save();if(autoWakeEnabled())requestScreenWakeLock(true);if(firstStart)addEvent({category:'Case',name:'Case started',note:'Anesthesia case timer started'});toast(firstStart?'Case timer started':'Case timer resumed');return true}
$('orStartBtn')?.addEventListener('click',startCaseFromOr);$('orPauseBtn')?.addEventListener('click',()=>{pauseTimer();renderOrLive()});$('orRecordNowBtn')?.addEventListener('click',()=>{if(!state.timer.running&&(state.timer.elapsedMs||0)===0){if(!startCaseFromOr())return}addRecord('');renderOrLive()});$('openOrLiveBtn')?.addEventListener('click',()=>setTab('orlive'));$('orOpenDrugBtn')?.addEventListener('click',()=>setTab('drugs'));$('orOpenTrendsBtn')?.addEventListener('click',()=>setTab('trends'));$('orOpenTimelineBtn')?.addEventListener('click',()=>setTab('timeline'));
$$('.or-milestone').forEach(btn=>btn.addEventListener('click',()=>{markMilestone(btn);renderOrLive()}));$$('.or-event').forEach(btn=>btn.addEventListener('click',()=>{addEvent({category:btn.dataset.cat,name:btn.dataset.label});renderOrLive()}));
$('orFullscreenBtn')?.addEventListener('click',async()=>{try{if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();document.body.classList.add('or-fullscreen');$('orFullscreenBtn').textContent='Exit full screen'}else{if(document.exitFullscreen)await document.exitFullscreen();document.body.classList.remove('or-fullscreen');$('orFullscreenBtn').textContent='⛶ Full screen'}}catch(e){document.body.classList.toggle('or-fullscreen')}});document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('or-fullscreen');if($('orFullscreenBtn'))$('orFullscreenBtn').textContent='⛶ Full screen'}});
function currentSettingsObject(){try{const x=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||JSON.parse(localStorage.getItem('anesvet_v14_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_4_settings')||'null');return {...defaultSettings(),...(x||{})}}catch(e){return defaultSettings()}}
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
  $('endPatient').textContent=`${$('patientName')?.value.trim()||'Unnamed'} • ${$('species')?.value==='cat'?'Cat':'Dog'} • ${$('weight')?.value||'—'} kg`;
  $('endProcedure').textContent=$('procedure')?.value.trim()||'—';
  $('endDuration').textContent=formatElapsed(currentElapsed());
  $('endRecordCount').textContent=(state.records||[]).length;
  $('endEventCount').textContent=(state.events||[]).length;
  $('endRecoveryStatus').textContent=state.recoveryCompletedAt?'Complete':'Review recovery';
  const endFm=getFluidMetrics();
  if($('endFluidTotal'))$('endFluidTotal').textContent=`${fmtVol(endFm.totalIn)} mL`;
  if($('endBloodLoss'))$('endBloodLoss').textContent=`${fmtVol(endFm.loss)} mL`;
  if($('endUrine'))$('endUrine').textContent=`${fmtVol(endFm.urine)} mL`;
  const signoffReady=renderFinalSignoff();
  const ready=signoffReady&&['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].every(id=>!!$(id)?.checked);
  $('endCaseReadiness').textContent=ready?'READY TO END':'REVIEW';
  $('endCaseReadiness').className=`status-pill ${ready?'good':'warn'}`;
}
['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].forEach(id=>$(id)?.addEventListener('change',renderEndCase));
$('endBackupBtn')?.addEventListener('click',backupAllData);
$('endExportPdfBtn')?.addEventListener('click',()=>exportPdfReport());
$('endSaveArchiveBtn')?.addEventListener('click',async()=>{const ready=renderFinalSignoff()&&['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].every(id=>!!$(id)?.checked);if(!ready){toast('กรุณาตรวจ checklist และ Final Sign-off ก่อน End Case');return}if(!confirm('End, LOCK & Archive this anesthesia case? หลัง archive เคสนี้จะถือเป็น final record'))return;if(state.timer.running)pauseTimer();state.casePhase='complete';state.caseLocked=true;state.lockedAt=Date.now();addAudit('CASE_LOCKED','Final clinical record locked');state.finalChecksum=await computeCaseChecksum(state);state.checksumAlgorithm='SHA-256';state.checksumCreatedAt=Date.now();renderCasePhase();save();await releaseScreenWakeLock(true);const ok=await archiveSnapshot();if(ok)setTimeout(()=>resetCurrent(),350)});


let amendmentArchiveIndex=null;
function openAmendmentDialog(i){const c=getArchive()[i];if(!c||!c.caseLocked){toast('Amendment ใช้กับ locked final record');return}amendmentArchiveIndex=i;$('amendmentCaseName').textContent=`${c.patientName||'Unnamed'} • ${c.procedure||c.patientProcedure||'—'}`;$('amendmentAuthor').value=$('anesthetist')?.value.trim()||'';$('amendmentReason').value='';$('amendmentText').value='';const d=$('amendmentDialog');if(d?.showModal)d.showModal();else d?.setAttribute('open','')}
function closeAmendmentDialog(){const d=$('amendmentDialog');if(!d)return;if(d.close)d.close();else d.removeAttribute('open');amendmentArchiveIndex=null}
$('amendmentCloseBtn')?.addEventListener('click',closeAmendmentDialog);$('amendmentCancelBtn')?.addEventListener('click',closeAmendmentDialog);
$('amendmentSaveBtn')?.addEventListener('click',async()=>{const i=amendmentArchiveIndex,c=getArchive()[i];if(!c)return;const author=$('amendmentAuthor').value.trim(),reason=$('amendmentReason').value.trim(),text=$('amendmentText').value.trim();if(!author||!reason||!text){toast('กรุณากรอก Author, Reason และ Amendment');return}if(!confirm('Add amendment to LOCKED FINAL record?\\nOriginal clinical data จะไม่ถูกแก้'))return;c.amendments=c.amendments||[];const a={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),epoch:Date.now(),clock:formatClock(),author,reason,text};c.amendments.push(a);c.auditTrail=c.auditTrail||[];c.auditTrail.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+1),epoch:Date.now(),clock:formatClock(),elapsedMs:c.timer?.elapsedMs||0,action:'AMENDMENT_ADDED',detail:`${reason} • ${text}`,actor:author});try{if(archiveBackend==='IndexedDB')await idbPutCase(c);else localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache));closeAmendmentDialog();renderArchives();toast('Amendment added')}catch(e){toast('Amendment save failed')}});
function renderCaseSummary(){
  if(!$('casesummary'))return;
  const species=$('species')?.value==='cat'?'Cat':'Dog';
  $('summaryPatient').textContent=`${$('patientName')?.value.trim()||'Unnamed'} • ${species} • ${$('weight')?.value||'—'} kg`;
  $('summaryAsa').textContent=`ASA ${$('asa')?.value||'—'}${$('emergency')?.checked?'-E':''}`;
  $('summaryProcedure').textContent=$('procedure')?.value.trim()||$('patientProcedure')?.value.trim()||'—';
  $('summarySurgeon').textContent=$('surgeon')?.value.trim()||'—';
  $('summaryAnesthetist').textContent=$('anesthetist')?.value.trim()||'—';
  $('summaryAssistant').textContent=$('surgicalAssistant')?.value.trim()||'—';
  $('summaryRecordCount').textContent=(state.records||[]).length;
  $('summaryEventCount').textContent=(state.events||[]).length;
  $('summaryFluidRate').textContent=`${fmtVol(currentFluidRate())} mL/hr`;
  const fm=getFluidMetrics();
  $('summaryFluidTotal').textContent=`${fmtVol(fm.totalIn)} mL`;
  $('summaryBloodLoss').textContent=`${fmtVol(fm.loss)} mL`;
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
  if(id==='settings'){renderDrugLibrarySettings();renderQuickPresetSettings();setTimeout(renderProtocolGovernance,0);}
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
function getProtocolAudit(){try{const a=JSON.parse(localStorage.getItem(PROTOCOL_AUDIT_KEY)||localStorage.getItem('anesvet_v14_protocol_audit')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function addProtocolAudit(action,detail=''){const a=getProtocolAudit();a.push({epoch:Date.now(),clock:formatClock(),action,detail});localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(a.slice(-500)))}

function currentSnapshot(note=''){
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()),
    epoch: Date.now(),
    elapsedMs: currentElapsed(),
    clock: formatClock(),
    hr:getVal('hr'), rr:getVal('rr'), sap:getVal('sap'), map:getVal('map'), dap:getVal('dap'),
    spo2:getVal('spo2'), etco2:getVal('etco2'), temp:getVal('temp'),
    vaporizer:getVal('vaporizer'), o2flow:getVal('o2flow'),
    fluidRate:getVal('fluidRateInput'), fluidTotal:getVal('fluidTotal'),
    depth:getVal('depth',''), ventilation:getVal('ventilation',''),
    note:(note || $('recordNote').value || '').trim()
  };
}


function plausibilityWarnings(v,context='anesthesia'){
  const w=[],num=x=>x===null||x===''||x===undefined?null:Number(x);
  const hr=num(v.hr),rr=num(v.rr),sap=num(v.sap),map=num(v.map),dap=num(v.dap),spo2=num(v.spo2),et=num(v.etco2),temp=num(v.temp);
  if(hr!==null&&(hr<20||hr>350))w.push(`HR ${hr} bpm ดูผิดปกติมาก`);
  if(rr!==null&&(rr<0||rr>120))w.push(`RR ${rr}/min ดูผิดปกติมาก`);
  if(spo2!==null&&(spo2<50||spo2>100))w.push(`SpO₂ ${spo2}% ตรวจหน่วย/การพิมพ์`);
  if(et!==null&&(et<5||et>100))w.push(`ETCO₂ ${et} mmHg ตรวจ waveform/การพิมพ์`);
  if(temp!==null&&(temp<90||temp>106))w.push(`Temp ${temp}°F ตรวจหน่วยหรือ decimal`);
  [sap,map,dap].forEach((x,i)=>{if(x!==null&&(x<0||x>300))w.push(`${['SAP','MAP','DAP'][i]} ${x} mmHg ตรวจการพิมพ์`)});
  if(sap!==null&&map!==null&&dap!==null&&!(sap>=map&&map>=dap))w.push(`BP relation ไม่สอดคล้อง: SAP ${sap} / MAP ${map} / DAP ${dap}`);
  if(context==='recovery'&&rr===0)w.push('Recovery RR = 0 ต้องยืนยันว่าเป็น apnea จริง');
  return [...new Set(w)];
}
function confirmPlausibility(warnings,title){return confirm(`${title}: พบค่าที่ควรตรวจซ้ำ\n\n• ${warnings.join('\n• ')}\n\nกด OK เพื่อยืนยันว่าค่านี้เป็นค่าจริงและบันทึกต่อ`)}

function thresholds(){
  const species=$('species').value;
  const hr=getVal('hr',0), rr=getVal('rr',0), map=getVal('map',0), spo2=getVal('spo2',0), et=getVal('etco2',0), temp=getVal('temp',99);
  const status={hr:'good',rr:'good',map:'good',spo2:'good',etco2:'good',temp:'good'};

  // HR alert logic: anesthesia screening ranges, not stand-alone treatment triggers.
  if(species==='cat'){
    if(hr<90 || hr>225) status.hr='danger';
    else if(hr<100 || hr>180) status.hr='warn';
  }else{
    if(hr<40 || hr>190) status.hr='danger';
    else if(hr<60 || hr>150) status.hr='warn';
  }

  // RR alert logic: respiratory rate is only a screening signal; ETCO2 is used to assess ventilation adequacy.
  if(species==='cat'){
    if(rr<7) status.rr='danger';
    else if(rr<10 || rr>28) status.rr='warn';
  }else{
    if(rr<6) status.rr='danger';
    else if(rr<8 || rr>20) status.rr='warn';
  }

  if(map<60)status.map='danger';else if(map<70)status.map='warn';
  if(spo2<90)status.spo2='danger';else if(spo2<95)status.spo2='warn';
  if(et>60||et<30)status.etco2='danger';else if(et>55||et<40)status.etco2='warn';
  if(temp<98.0)status.temp='danger';else if(temp<99.0)status.temp='warn';
  return status;
}
function setHint(id,level,text){
  const el=$(id);el.className=`vital-foot ${level}`;el.textContent=text;
}
function updateDashboard(){
  const st=thresholds();
  const speciesForAlert=$('species').value;
  const hrNow=getVal('hr',0), rrNow=getVal('rr',0);

  if(speciesForAlert==='cat'){
    setHint('hrHint',st.hr,
      st.hr==='danger' ? (hrNow<90?'Critical bradycardia alert (<90)':'Marked tachycardia alert (>225)') :
      st.hr==='warn' ? (hrNow<100?'Bradycardia alert (<100)':'Tachycardia alert (>180)') :
      'Cat HR acceptable screening range 100–180');
    setHint('rrHint',st.rr,
      st.rr==='danger' ? (rrNow===0?'Apnea / no spontaneous breaths':'Critical low RR (<7)') :
      st.rr==='warn' ? (rrNow<10?'Low RR (<10)':'High RR (>28): reassess depth/pain') :
      'Cat RR screening range 10–28');
  }else{
    setHint('hrHint',st.hr,
      st.hr==='danger' ? (hrNow<40?'Critical bradycardia alert (<40)':'Marked tachycardia alert (>190)') :
      st.hr==='warn' ? (hrNow<60?'Bradycardia alert (<60)':'Tachycardia alert (>150)') :
      'Dog HR acceptable screening range 60–150');
    setHint('rrHint',st.rr,
      st.rr==='danger' ? (rrNow===0?'Apnea / no spontaneous breaths':'Critical low RR (<6)') :
      st.rr==='warn' ? (rrNow<8?'Low RR (<8)':'High RR (>20): reassess depth/pain') :
      'Dog RR screening range 8–20');
  }
  setHint('mapHint',st.map,st.map==='danger'?'MAP <60: intervene':st.map==='warn'?'MAP 60–69: reassess':'≥70 โดยทั่วไป');
  setHint('spo2Hint',st.spo2,st.spo2==='danger'?'SpO₂ <90% severe':st.spo2==='warn'?'SpO₂ <95%: investigate':'≥95%');
  setHint('etco2Hint',st.etco2,st.etco2==='danger'?'ETCO₂ critical range':st.etco2==='warn'?'outside typical range':'40–50 โดยทั่วไป');
  setHint('tempHint',st.temp,st.temp==='danger'?'<98°F: hypothermia':st.temp==='warn'?'falling: warm early':'warming early');

  const levels=Object.values(st);
  if($('bradyPoorPerf').checked) levels.push('danger');
  const global=$('globalStatus');
  if(levels.includes('danger')){global.className='status-pill danger';global.textContent='INTERVENE'}
  else if(levels.includes('warn')){global.className='status-pill warn';global.textContent='REASSESS'}
  else{global.className='status-pill good';global.textContent='STABLE'}

  const species=$('species').value,weight=getVal('weight',1);
  $('fluidReference').textContent=species==='cat'
    ? `Reference: Cat ~3–5 mL/kg/hr ≈ ${(weight*3).toFixed(0)}–${(weight*5).toFixed(0)} mL/hr (normal cardiac/renal function)`
    : `Reference: Dog ~5 mL/kg/hr ≈ ${(weight*5).toFixed(0)} mL/hr (normal cardiac/renal function)`;

  const name=$('patientName').value.trim()||'ยังไม่ได้ระบุชื่อ';
  const breed=$('breed')?.value.trim();
  $('caseStripPatient').textContent=`${name} • ${species==='cat'?'Cat':'Dog'}${breed?' • '+breed:''} • ${weight||'—'} kg`;
  $('caseStripAsa').textContent=`ASA ${$('asa').value}${$('emergency').checked?'-E':''}`;
  $('caseStripProcedure').textContent=$('procedure').value.trim()||$('patientProcedure')?.value.trim()||'—';
  $('caseStripInterval').textContent=`${$('recordInterval').value} min`;

  renderInterpretation();
  renderRecordPreview();
  drugCalc();
  updatePlanCalc();
  updateBalance();
  renderSmartAlerts();
  renderCaseSummary();
  if($('orlive')?.classList.contains('active')) renderOrLive();
  save();
}
function renderInterpretation(){
  const st=thresholds();
  const species=$('species').value,hr=getVal('hr',0),rr=getVal('rr',0);
  const data=[
    ['HR',st.hr,
      st.hr==='danger'?'Critical HR alert — verify pulse/ECG, BP, anesthetic depth, temperature and drugs':
      st.hr==='warn'?(hr<(species==='cat'?100:60)?'Bradycardia — assess perfusion/BP and cause':'Tachycardia — assess pain/depth, hypoxemia, hypercarbia, volume status and drugs'):
      'HR acceptable on screening'],
    ['RR',st.rr,
      st.rr==='danger'?'Very low RR / apnea risk — check chest movement, airway and ETCO₂; support ventilation as indicated':
      st.rr==='warn'?(rr<(species==='cat'?10:8)?'Low RR — check depth, tidal movement and ETCO₂':'High RR — reassess surgical stimulation, depth, pain, ETCO₂ and airway'):
      'RR acceptable on screening; ETCO₂ determines ventilation adequacy'],
    ['MAP',st.map,st.map==='danger'?'Hypotension — verify BP/perfusion, depth, HR, volume/contractility/SVR':st.map==='warn'?'MAP borderline — reassess trend and perfusion':'MAP acceptable'],
    ['SpO₂',st.spo2,st.spo2==='danger'?'Severe hypoxemia — airway/O₂/ventilation immediately':st.spo2==='warn'?'SpO₂ below 95% — investigate':'Oxygenation acceptable'],
    ['ETCO₂',st.etco2,st.etco2==='danger'?'Check ventilation, airway/circuit and perfusion':st.etco2==='warn'?'ETCO₂ outside usual range — review waveform':'Ventilation range acceptable'],
    ['Temp',st.temp,st.temp==='danger'?'Clinically important hypothermia (<98°F) — active warming':st.temp==='warn'?'Temperature falling — warm now':'Temperature acceptable']
  ];
  $('interpretationCards').innerHTML=data.map(([name,level,msg])=>`<div class="interpret-card ${level}"><span>${name}</span><b>${escapeHtml(msg)}</b></div>`).join('');
}
function renderRecordPreview(){
  const pairs=[['HR','hr'],['RR','rr'],['SAP','sap'],['MAP','map'],['DAP','dap'],['SpO₂','spo2'],['ETCO₂','etco2'],['Temp','temp']];
  $('recordPreview').innerHTML=pairs.map(([label,id])=>`<div class="preview-item"><span>${label}</span><b>${escapeHtml($(id).value||'—')}</b></div>`).join('');
}

function addRecord(note=''){
  ensureTimerStarted();
  const snap=currentSnapshot(note),warnings=plausibilityWarnings(snap,'anesthesia');
  if(warnings.length&&!confirmPlausibility(warnings,'Anesthesia record'))return;
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
  const sp=$('species').value;
  const hr=Number(r.hr),rr=Number(r.rr);
  const hrCritical=sp==='cat'?(hr<90||hr>225):(hr<40||hr>190);
  const rrCritical=sp==='cat'?(rr<7):(rr<6);
  return hrCritical||rrCritical||(Number(r.map)<60)||(Number(r.spo2)<90)||(Number(r.etco2)>60)||(Number(r.etco2)<30)||(Number(r.temp)<98.0);
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
      fields.map(f=>`<td class="${recordCorrectionCount(r.id,f)?'corrected-cell':''}" title="${recordCorrectionCount(r.id,f)?'Corrected value — see history':''}">${r[f]??''}${recordCorrectionCount(r.id,f)?'<span class="correction-badge">C</span>':''}</td>`).join('')+
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
  box.className='correction-history';box.innerHTML=arr.slice().reverse().map(c=>`<div class="correction-item"><b>${escapeHtml(c.clock)} • ${escapeHtml(c.field.toUpperCase())}: ${escapeHtml(c.oldValue)} → ${escapeHtml(c.newValue)}</b><span>${escapeHtml(c.reason||'No reason entered')} • record ${escapeHtml(formatShortElapsed(c.recordElapsedMs||0))}</span></div>`).join('');
}
function applyCorrection(recordId=null){
  const rid=recordId||$('correctionRecord')?.value;if(!rid){toast('เลือก record ก่อน');return}
  const rec=(state.records||[]).find(r=>String(r.id)===String(rid));if(!rec)return;
  if(recordId && $('correctionRecord'))$('correctionRecord').value=String(recordId);
  const field=$('correctionField').value,newValue=Number($('correctionValue').value),reason=$('correctionReason').value.trim();
  if(!Number.isFinite(newValue)){toast('ใส่ corrected value ก่อน');return}
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
    ...(state.corrections||[]).map(c=>({elapsedMs:c.recordElapsedMs||0,clock:c.clock,cat:'Correction',text:`${c.field.toUpperCase()} ${c.oldValue} → ${c.newValue}${c.reason?' • '+c.reason:''}`})),
    ...(state.recoveryRecords||[]).map(r=>({elapsedMs:r.caseElapsedMs||0,clock:r.clock,cat:'Recovery Vitals',text:`HR ${r.hr} • RR ${r.rr} • MAP ${r.map??'—'} • SpO₂ ${r.spo2}% • Temp ${r.temp}°F${r.mentation?' • '+r.mentation:''}`}))
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
function openDrugAdministration({drug,calculated='',suggestedMl=null,route='',note=''}){
  pendingDrugAdministration={drug,calculated,suggestedMl,route,note};
  $('drugAdminName').textContent=drug||'Drug';
  $('drugAdminCalculated').textContent=`Calculated: ${calculated||'—'}`;
  $('drugAdminActualMl').value=Number.isFinite(Number(suggestedMl))?fmtVol(Number(suggestedMl)):'';
  $('drugAdminRoute').value=route||'';
  $('drugAdminNote').value=note||'';
  const dlg=$('drugAdminDialog');if(dlg?.showModal)dlg.showModal();else dlg?.setAttribute('open','');
}
function closeDrugAdministration(){
  const dlg=$('drugAdminDialog');if(!dlg)return;
  if(dlg.close)dlg.close();else dlg.removeAttribute('open');
  pendingDrugAdministration=null;
}
$('drugAdminCloseBtn')?.addEventListener('click',closeDrugAdministration);
$('drugAdminCancelBtn')?.addEventListener('click',closeDrugAdministration);
$('drugAdminConfirmBtn')?.addEventListener('click',()=>{
  if(!pendingDrugAdministration)return;
  const ml=Number($('drugAdminActualMl').value),route=$('drugAdminRoute').value.trim(),extra=$('drugAdminNote').value.trim();
  if(!(ml>0)){toast('กรุณาใส่ actual administered volume');return}
  const p=pendingDrugAdministration;
  if(!confirm(`Confirm administration\n${p.drug}\nActual ${fmtVol(ml)} mL${route?` • ${route}`:''}`))return;
  addAudit('DRUG_ADMINISTERED',`${p.drug} • ${fmtVol(ml)} mL${route?' • '+route:''}`);
  addEvent({category:'Drug',name:p.drug,dose:`Actual ${fmtVol(ml)} mL`,route,note:[`Calculated ${p.calculated||'—'}`,extra].filter(Boolean).join(' • ')});
  closeDrugAdministration();
});

function addEvent({category,name,dose='',route='',note=''}){
  ensureTimerStarted();
  const ev={
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),
    epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),
    category,name,dose,route,note
  };
  state.events.push(ev);state.events.sort((a,b)=>a.epoch-b.epoch);
  save();renderEvents();renderTrends();renderProcedureTimeline();renderProcedureTimeline();renderOrLive();toast(`${name} • ${ev.clock}`);
}

$$('.administered-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const inp=$(btn.dataset.input),ml=Number(inp?.value||0);if(!(ml>0)){toast('กรุณาใส่ actual administered volume');return}
  const drug=btn.dataset.drug,concMap={Diazepam:'diazepamConc',Propofol:'propofolConc',Tramadol:'tramadolConc'},concId=concMap[drug],conc=concId?Number($(concId)?.value||0):0,mg=conc>0?ml*conc:null;
  const details=`${fmtVol(ml)} mL${mg!==null?` • ${fmtDose(mg)} mg`:''}`;
  if(!confirm(`Confirm administration\n${drug}\n${details}\n\nบันทึกเป็นยาที่ให้จริงตอนนี้?`))return;
  addEvent({category:'Drug',name:drug,dose:`Administered ${details}`,route:'',note:'Confirmed actual administration'});btn.textContent='✓ Administered';setTimeout(()=>btn.textContent='Mark administered',1400);
}));
$('copyPlanToEventsBtn')?.addEventListener('click',()=>{const planned=[];if($('planPremed').value)planned.push(['Premed',$('planPremed').value]);if($('planInduction').value)planned.push(['Induction',$('planInduction').value]);if($('planMaintenance').value)planned.push(['Maintenance',$('planMaintenance').value]);if($('planAnalgesia').value)planned.push(['Analgesia',$('planAnalgesia').value]);planned.forEach(([cat,name])=>addEvent({category:'Plan',name:`${cat}: ${name}`,note:'Planned anesthesia component'}));toast('Planned components added to Events')});
$$('.drug-event-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const doseEl=btn.dataset.doseid?$(btn.dataset.doseid):null,volEl=btn.dataset.volid?$(btn.dataset.volid):null;
  const calculated=[doseEl?.textContent,volEl?.textContent].filter(Boolean).join(' • ');
  const suggested=parseMlNumber(volEl?.textContent);
  openDrugAdministration({drug:btn.dataset.drug,calculated,suggestedMl:suggested,route:'',note:'From built-in hospital preset'});
}));
['diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'].forEach(id=>{
  const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{drugCalc();save()});
});

$$('.quick-event').forEach(b=>b.addEventListener('click',()=>addEvent({category:b.dataset.cat,name:b.dataset.label})));
$('addEventBtn').addEventListener('click',()=>{
  const name=$('eventName').value.trim();
  if(!name){toast('กรุณาใส่ Name / Event');return}
  addEvent({category:$('eventCategory').value,name,dose:$('eventDose').value.trim(),route:$('eventRoute').value.trim(),note:$('eventNote').value.trim()});
  ['eventName','eventDose','eventRoute','eventNote'].forEach(id=>$(id).value='');
});
function populateResponseSelect(){const sel=$('responseEventSelect');if(!sel)return;const events=(state.events||[]).filter(e=>['Drug','Fluid','Complication','Ventilation'].includes(e.category));sel.innerHTML=events.length?events.map(e=>`<option value="${escapeHtml(e.id)}">${escapeHtml(formatShortElapsed(e.elapsedMs)+' • '+e.name)}</option>`).join(''):'<option value="">— no intervention event —</option>'}
$('captureResponseBtn')?.addEventListener('click',()=>{const id=$('responseEventSelect').value;if(!id){toast('เลือก intervention ก่อน');return}const ev=(state.events||[]).find(e=>String(e.id)===String(id));if(!ev)return;const now=currentSnapshot(''),resp={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),eventId:id,eventName:ev.name,eventElapsed:ev.elapsedMs,capturedElapsed:now.elapsedMs,map:now.map,hr:now.hr,spo2:now.spo2,etco2:now.etco2,temp:now.temp,note:$('responseNote').value.trim()};state.responses=state.responses||[];state.responses.push(resp);$('responseNote').value='';save();renderResponses();toast('Response captured')});
function renderResponses(){populateResponseSelect();const el=$('responseList'),arr=state.responses||[];if(!el)return;if(!arr.length){el.className='response-list empty-state';el.textContent='ยังไม่มี response tracking';return}el.className='response-list';el.innerHTML=arr.map(r=>`<div class="response-card"><b>${escapeHtml(r.eventName)} → response at +${escapeHtml(formatShortElapsed(r.capturedElapsed-r.eventElapsed))}</b><span>MAP ${r.map??'—'} • HR ${r.hr??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp??'—'}°F${r.note?' • '+escapeHtml(r.note):''}</span></div>`).join('')}
function renderEvents(){
  renderResponses();
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
    state.events=state.events.filter(e=>String(e.id)!==String(b.dataset.id));save();renderEvents();renderTrends();renderProcedureTimeline();
  }));
}
$('clearEventsBtn').addEventListener('click',()=>{
  if(!confirm('ล้าง Event log ทั้งหมด?'))return;state.events=[];save();renderEvents();renderTrends();renderProcedureTimeline();
});

function metricValues(key){return (state.records||[]).map(r=>Number(r[key])).filter(Number.isFinite)}
function renderSummary(){
  const recs=state.records||[];
  $('sumDuration').textContent=formatShortElapsed(currentElapsed());
  $('sumRecords').textContent=recs.length;
  const set=(id,key,mode,suffix='')=>{
    const v=metricValues(key);if(!v.length){$(id).textContent='—';return}
    const n=mode==='min'?Math.min(...v):Math.max(...v);
    $(id).textContent=(key==='temp'?n.toFixed(1):Math.round(n))+suffix;
  };
  set('sumMap','map','min');set('sumSpO2','spo2','min','%');set('sumEtco2','etco2','max');set('sumTemp','temp','min','°F');
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
  series.forEach(s=>recs.forEach(r=>{const n=Number(r[s.key]);if(Number.isFinite(n))allVals.push(n)}));
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
      const y=Number(r[s.key]);if(!Number.isFinite(y))return;
      d+=(d?' L':'M')+` ${sx(xs[i]).toFixed(1)} ${sy(y).toFixed(1)}`;
    });
    add('path',{d,fill:'none',stroke:colors[si%colors.length],'stroke-width':2.7,'stroke-linecap':'round','stroke-linejoin':'round'});
    recs.forEach((r,i)=>{
      const y=Number(r[s.key]);if(!Number.isFinite(y))return;
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
  svgChartMulti('chartBP',[{key:'sap',label:'SAP'},{key:'map',label:'MAP'},{key:'dap',label:'DAP'}],{min:30,max:180,lines:[{value:60,label:'MAP 60'}]});
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
  svgChartMulti('chartTemp',[{key:'temp',label:'Temp'}],{min:93,max:104,decimal:true,lines:[{value:98.0,label:'98°F'}]});
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


function updatePlanCalc(){
  const w=getVal('weight',0)||0,dConc=Number($('diazepamConc')?.value||5),pConc=Number($('propofolConc')?.value||10),tConc=Number($('tramadolConc')?.value||50);
  if($('planDiazepamCalc'))$('planDiazepamCalc').textContent=`${fmtDose(w*0.25)} mg • ${dConc>0?fmtVol((w*0.25)/dConc):'—'} mL`;
  if($('planPropofolCalc'))$('planPropofolCalc').textContent=`${fmtDose(w*4)} mg • ${pConc>0?fmtVol((w*4)/pConc):'—'} mL planned`;
  if($('planTramadolCalc'))$('planTramadolCalc').textContent=`${fmtDose(w*4)} mg • ${tConc>0?fmtVol((w*4)/tConc):'—'} mL`;
}
function drugCalc(){
  const w=getVal('weight',0)||0;
  if($('drugWeight')) $('drugWeight').textContent=`${w.toFixed(1)} kg`;

  const doseCalc=(dose,conc,mgId,mlId)=>{
    const mg=w*dose, c=Number($(conc)?.value||0);
    if($(mgId)) $(mgId).textContent=`${fmtDose(mg)} mg`;
    if($(mlId)) $(mlId).textContent=c>0?`${fmtVol(mg/c)} mL`:'— mL';
  };
  doseCalc(0.25,'diazepamConc','diazepamMg','diazepamMl');
  doseCalc(4,'propofolConc','propofolMg','propofolMl');
  doseCalc(4,'tramadolConc','tramadolMg','tramadolMl');
  doseCalc(4.4,'rimadylConc','rimadylMg','rimadylMl');
  doseCalc(0.3,'metacamConc','metacamMg','metacamMl');

  if($('cefazolinMl')) $('cefazolinMl').textContent=`${fmtVol(w/10)} mL`;
  if($('conveniaMl')) $('conveniaMl').textContent=`${fmtVol(w/10)} mL`;

  const adrMg=w*0.01, adrConc=Number($('adrenalineConc')?.value||1);
  if($('adrenalineMg')) $('adrenalineMg').textContent=`${fmtDose(adrMg)} mg`;
  if($('adrenalineMl')) $('adrenalineMl').textContent=adrConc>0?`${fmtVol(adrMg/adrConc)} mL`:'— mL';

  const atropDose=Number($('atropineMode')?.value||0.02), atropMg=w*atropDose, atropConc=Number($('atropineConc')?.value||0.6);
  if($('atropineMg')) $('atropineMg').textContent=`${fmtDose(atropMg)} mg`;
  if($('atropineMl')) $('atropineMl').textContent=atropConc>0?`${fmtVol(atropMg/atropConc)} mL`:'— mL';

  const dopDose=Number($('dopamineDose')?.value||5), dopConc=Number($('dopamineConc')?.value||1);
  const mcgMin=dopDose*w;
  if($('dopamineMcgMin')) $('dopamineMcgMin').textContent=`${fmtDose(mcgMin)} μg/min`;
  if($('dopamineMlHr')) $('dopamineMlHr').textContent=dopConc>0?`${fmtVol((mcgMin*60)/(1000*dopConc))} mL/hr`:'— mL/hr';

  const sp=$('species')?.value;
  if($('nsaidDogCard')) $('nsaidDogCard').style.display=sp==='dog'?'flex':'none';
  if($('nsaidCatCard')) $('nsaidCatCard').style.display=sp==='cat'?'flex':'none';
  updateDoseSpotlights();
  updateCustomDrugCalc('induction',false);updateCustomDrugCalc('pre',false);updateCustomDrugCalc('post',false);
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
 const w=getVal('weight',1)||1,cryst=Number($('balanceCrystalloid')?.value||0),bolus=Number($('balanceBolus')?.value||0),bloodIn=Number($('balanceBloodIn')?.value||0),loss=Number($('balanceBloodLoss')?.value||0),urine=Number($('balanceUrine')?.value||0),totalIn=cryst+bolus+bloodIn,net=totalIn-loss-urine;
 if($('balanceFluidIn'))$('balanceFluidIn').textContent=`${fmtVol(totalIn)} mL`;
 if($('balanceFluidInKg'))$('balanceFluidInKg').textContent=`${fmtVol(totalIn/w)} mL/kg`;
 if($('balanceLoss'))$('balanceLoss').textContent=`${fmtVol(loss)} mL`;
 if($('balanceLossKg'))$('balanceLossKg').textContent=`${fmtVol(loss/w)} mL/kg`;
 if($('balanceUrineOut'))$('balanceUrineOut').textContent=`${fmtVol(urine)} mL`;
 if($('balanceUrineKg'))$('balanceUrineKg').textContent=`${fmtVol(urine/w)} mL/kg`;
 if($('balanceNet'))$('balanceNet').textContent=`${fmtVol(net)} mL`;
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
function getFluidMetrics(){
  const w=Math.max(0.01,Number($('weight')?.value||1));
  const calc=calculatedCrystalloidTotal(),cryst=effectiveCrystalloidTotal();
  const bolus=Number($('balanceBolus')?.value||0)||0;
  const bloodIn=Number($('balanceBloodIn')?.value||0)||0;
  const loss=Number($('balanceBloodLoss')?.value||0)||0;
  const urine=Number($('balanceUrine')?.value||0)||0;
  const totalIn=cryst+bolus+bloodIn,net=totalIn-loss-urine;
  return {w,calc,cryst,bolus,bloodIn,loss,urine,totalIn,net};
}
function syncFluidLegacyFields(){
  const fm=getFluidMetrics();
  if($('balanceCrystalloid'))$('balanceCrystalloid').value=fm.cryst.toFixed(1);
  if($('fluidTotal'))$('fluidTotal').value=fm.totalIn.toFixed(1);
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
  const fm=getFluidMetrics(),rate=currentFluidRate();
  if(document.activeElement!==$('orFluidManageRate'))$('orFluidManageRate').value=rate||'';
  $('orFluidRateKg').textContent=`${fmtVol(rate/fm.w)} mL/kg/hr`;
  $('orCalculatedCrystalloid').textContent=`${fmtVol(fm.calc)} mL`;
  $('orCalculatedCrystalloidKg').textContent=`${fmtVol(fm.calc/fm.w)} mL/kg`;
  $('orEffectiveCrystalloid').textContent=`${fmtVol(fm.cryst)} mL`;
  $('orBolusTotal').textContent=`${fmtVol(fm.bolus)} mL`;
  $('orBloodLossTotal').textContent=`${fmtVol(fm.loss)} mL`;
  $('orBloodLossKg').textContent=`${fmtVol(fm.loss/fm.w)} mL/kg`;
  $('orUrineTotal').textContent=`${fmtVol(fm.urine)} mL`;
  $('orUrineKg').textContent=`${fmtVol(fm.urine/fm.w)} mL/kg`;
  if(document.activeElement!==$('orBloodProductInput'))$('orBloodProductInput').value=fmtVol(fm.bloodIn);
  $('orBloodProductKg').textContent=`${fmtVol(fm.bloodIn/fm.w)} mL/kg`;
  $('orTotalFluidIn').textContent=`${fmtVol(fm.totalIn)} mL`;
  $('orTotalFluidInKg').textContent=`${fmtVol(fm.totalIn/fm.w)} mL/kg`;
  $('orFluidNet').textContent=`${fmtVol(fm.net)} mL`;
  $('orCurrentRateDisplay').textContent=`${fmtVol(rate)} mL/hr`;
  const hist=state.fluidRateHistory||[];
  $('fluidRateHistoryView').textContent=hist.length
    ? 'Rate history: '+hist.map(x=>`${formatShortElapsed(x.elapsedMs)} → ${fmtVol(x.rate)} mL/hr`).join(' • ')
    : 'No rate changes recorded yet';
  $('orFluidStatus').textContent=rate>0?'RUNNING':'READY';
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
  const recs=state.records||[],alerts=[];
  if(recs.length>=3){
    const last3=recs.slice(-3),first=last3[0],last=last3[last3.length-1],spanMin=Math.max(1,(last.elapsedMs-first.elapsedMs)/60000);
    const mapDrop=Number(first.map)-Number(last.map);if(Number.isFinite(mapDrop)&&mapDrop>=10)alerts.push({level:Number(last.map)<60?'danger':'warn',title:'Progressive hypotension',text:`MAP decreased ${Math.round(mapDrop)} mmHg over ~${Math.round(spanMin)} min (${first.map} → ${last.map})`});
    const etRise=Number(last.etco2)-Number(first.etco2);if(Number.isFinite(etRise)&&etRise>=8)alerts.push({level:Number(last.etco2)>60?'danger':'warn',title:'Progressive hypercapnia',text:`ETCO₂ increased ${Math.round(etRise)} mmHg (${first.etco2} → ${last.etco2})`});
    const tempDrop=Number(first.temp)-Number(last.temp);if(Number.isFinite(tempDrop)&&tempDrop>=1.0)alerts.push({level:Number(last.temp)<98?'danger':'warn',title:'Progressive heat loss',text:`Temperature decreased ${tempDrop.toFixed(1)}°F (${first.temp} → ${last.temp})`});
    const spoDrop=Number(first.spo2)-Number(last.spo2);if(Number.isFinite(spoDrop)&&spoDrop>=3)alerts.push({level:Number(last.spo2)<90?'danger':'warn',title:'Falling SpO₂',text:`SpO₂ decreased ${Math.round(spoDrop)} points (${first.spo2}% → ${last.spo2}%)`});
  }
  return alerts;
}
function renderSmartAlerts(){
  const alerts=getSmartAlerts(),box=$('smartAlerts');if(!box)return;
  $('smartAlertCount').textContent=`${alerts.length} ALERT${alerts.length===1?'':'S'}`;
  $('smartAlertCount').className=`status-pill ${alerts.some(a=>a.level==='danger')?'danger':alerts.length?'warn':'good'}`;
  box.innerHTML=alerts.length?alerts.map(a=>`<div class="smart-alert-item ${a.level}"><b>${escapeHtml(a.title)}</b><span>${escapeHtml(a.text)}</span></div>`).join(''):'<div class="empty-state">ยังไม่พบ trend alert</div>';
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
  addEvent({category:'Recovery',name:'Returned to recovery after emergency',note:'Emergency OR return ended'});
  save();renderCasePhase();renderRecovery();setTab('recovery',{force:true});return true;
}
$('emergencyReturnOrBtn')?.addEventListener('click',emergencyReturnToOr);

function renderRecovery(){
  const all=$$('.recovery-check'),done=all.filter(x=>x.checked).length,el=$('recoveryStatus');
  el.textContent=`Checklist ${done}/${all.length}`;
  el.className=`recovery-status ${done===all.length?'good':'warn'}`;
  const rr=Number($('recRR')?.value||0),spo=Number($('recSpO2')?.value||0),temp=Number($('recTemp')?.value||0);
  const ment=$('recMentation')?.value||'',ext=$('recExtubation')?.value.trim()||'';
  const ready=done===all.length && rr>0 && spo>0 && temp>0 && !!ment && !!ext && (state.recoveryRecords||[]).length>0 && !state.emergencyReturnActive;
  if($('recoveryReadiness')){
    $('recoveryReadiness').textContent=ready?'READY FOR RECOVERY COMPLETE':'COMPLETE OBSERVATIONS / CHECKLIST';
    $('recoveryReadiness').className=`recovery-readiness ${ready?'good':'warn'}`;
  }
  renderRecoveryState();
}
$$('.recovery-check').forEach(el=>el.addEventListener('change',()=>{renderRecovery();save()}));
['recHR','recRR','recMAP','recSpO2','recTemp','recExtubation','recOxygen','recMentation','recPain','recRecordInterval'].forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>{renderRecovery();save()})});
function addRecoveryRecord(){
  if(state.casePhase!=='recovery'||state.emergencyReturnActive){toast('Recovery records บันทึกได้ใน active Recovery mode');return}
  const hr=Number($('recHR')?.value||0),rr=Number($('recRR')?.value||0),mapRaw=$('recMAP')?.value,spo2=Number($('recSpO2')?.value||0),temp=Number($('recTemp')?.value||0);
  if(!(hr>0&&rr>0&&spo2>0&&temp>0)){toast('กรุณาตรวจ HR, RR, SpO₂ และ Temp ก่อนบันทึก');return}
  const rec={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),epoch:Date.now(),clock:formatClock(),caseElapsedMs:currentElapsed(),recoveryElapsedMs:recoveryElapsed(),hr,rr,map:mapRaw===''||mapRaw==null?null:Number(mapRaw),spo2,temp,oxygen:$('recOxygen')?.value||'',mentation:$('recMentation')?.value||'',note:$('recPain')?.value.trim()||''};
  const warnings=plausibilityWarnings(rec,'recovery');if(warnings.length&&!confirmPlausibility(warnings,'Recovery record'))return;
  state.recoveryRecords=state.recoveryRecords||[];state.recoveryRecords.push(rec);recoveryDueReminderToken=null;
  addAudit('RECOVERY_RECORD_ADDED',`HR ${rec.hr} • RR ${rec.rr} • MAP ${rec.map??'—'} • SpO₂ ${rec.spo2} • Temp ${rec.temp}`);
  save();renderRecoveryRecords();renderRecovery();renderProcedureTimeline();updateRecoveryDue();toast(`Recovery vitals recorded • ${rec.clock}`);
}
function renderRecoveryRecords(){
  const arr=state.recoveryRecords||[],body=$('recoveryRecordBody');if(!body)return;
  $('recoveryRecordCount').textContent=arr.length;
  $('recoveryRecordElapsed').textContent=formatElapsed(recoveryElapsed());
  $('recoveryLatestTime').textContent=arr.length?`${arr.at(-1).clock} • ${formatShortElapsed(arr.at(-1).recoveryElapsedMs)}`:'—';
  if(!arr.length){body.innerHTML='<tr><td colspan="11" class="empty-state">ยังไม่มี Recovery record</td></tr>';return}
  body.innerHTML=arr.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</td><td>${escapeHtml(r.clock)}</td><td>${r.hr??'—'}</td><td>${r.rr??'—'}</td><td>${r.map??'—'}</td><td>${r.spo2??'—'}</td><td>${r.temp??'—'}</td><td>${escapeHtml(r.oxygen||'—')}</td><td>${escapeHtml(r.mentation||'—')}</td><td>${escapeHtml(r.note||'—')}</td></tr>`).join('');
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
  if(state.emergencyReturnActive){returnToRecoveryAfterEmergency();return}
  if(state.casePhase==='recovery'){setTab('recovery',{force:true});return}
  if(state.recoveryCompletedAt){toast('Recovery already completed');return}
  if(!confirm('เริ่ม Recovery mode? ระบบจะบันทึกเวลาเริ่ม recovery ใน timeline'))return;
  seedRecoveryVitalsFromCurrent();
  state.emergencyReturnActive=false;state.casePhase='recovery';if(!state.recoveryStartedAt)state.recoveryStartedAt=Date.now();state.recoveryCompletedAt=null;renderCasePhase();
  addEvent({category:'Recovery',name:'Recovery started',note:'Post-anesthetic recovery mode'});save();renderRecoveryState();renderOrLive();setTab('recovery',{force:true});
}
function completeRecovery(){
  if(state.casePhase!=='recovery'||state.emergencyReturnActive)return;
  const checks=$$('.recovery-check'),done=checks.filter(x=>x.checked).length,rc=(state.recoveryRecords||[]).length;
  const rr=Number($('recRR')?.value||0),spo=Number($('recSpO2')?.value||0),temp=Number($('recTemp')?.value||0),ment=$('recMentation')?.value||'',ext=$('recExtubation')?.value.trim()||'';
  const fullyReady=done===checks.length && rc>0 && rr>0 && spo>0 && temp>0 && !!ment && !!ext;
  if(!fullyReady&&!confirm(`Recovery readiness ยังไม่ครบ
Checklist ${done}/${checks.length} • Recovery records ${rc}
ต้องการ mark complete ต่อหรือไม่?`))return;
  state.recoveryCompletedAt=Date.now();state.casePhase='complete';state.emergencyReturnActive=false;renderCasePhase();
  if(state.timer.running)pauseTimer();
  releaseScreenWakeLock(true);addAudit('RECOVERY_COMPLETE',`Recovery records ${(state.recoveryRecords||[]).length}`);
  addEvent({category:'Recovery',name:'Recovery complete',note:`Recovery duration ${formatShortElapsed(recoveryElapsed())} • ${rc} recovery records`});save();renderRecoveryState();renderRecoveryRecords();toast('Recovery marked complete');
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
  const species=$('species').value==='cat'?'Cat':'Dog';
  const asa=`ASA ${$('asa').value}${$('emergency').checked?'-E':''}`;
  $('reportDate').innerHTML=`Generated ${escapeHtml(formatDate(Date.now()))}<br>${escapeHtml(formatClock())}`;
  if($('reportVoidNotice')){$('reportVoidNotice').hidden=!state.voidedAt;$('reportVoidNotice').textContent=state.voidedAt?`VOIDED RECORD • ${formatDate(state.voidedAt)} ${formatClock(state.voidedAt)} • ${state.voidedBy||'—'} • ${state.voidReason||'—'}`:''}
  if($('reportIntegrityGrid'))$('reportIntegrityGrid').innerHTML=[reportInfoItem('Record ID',state.humanRecordId||'—'),reportInfoItem('Final checksum',state.finalChecksum||'—'),reportInfoItem('Checksum algorithm',state.checksumAlgorithm||'—'),reportInfoItem('Locked at',state.lockedAt?`${formatDate(state.lockedAt)} ${formatClock(state.lockedAt)}`:'—')].join('');

  $('reportPatientGrid').innerHTML=[
    reportInfoItem('Patient',$('patientName').value||'—'),
    reportInfoItem('HN / Case ID',$('hospitalId').value||'—'),
    reportInfoItem('Species',species),
    reportInfoItem('Breed',$('breed').value||'—'),
    reportInfoItem('Age',$('age').value||'—'),
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

  const vals=key=>(state.records||[]).map(r=>Number(r[key])).filter(Number.isFinite);
  const minv=(key,dec=0)=>{const v=vals(key);return v.length?(dec?Math.min(...v).toFixed(dec):Math.round(Math.min(...v))):'—'};
  const maxv=(key,dec=0)=>{const v=vals(key);return v.length?(dec?Math.max(...v).toFixed(dec):Math.round(Math.max(...v))):'—'};
  const summary=[
    ['Duration',formatShortElapsed(currentElapsed())],
    ['Records',(state.records||[]).length],
    ['Lowest MAP',minv('map')],
    ['Lowest SpO₂',minv('spo2')==='—'?'—':minv('spo2')+'%'],
    ['Highest ETCO₂',maxv('etco2')],
    ['Lowest Temp',minv('temp',1)==='—'?'—':minv('temp',1)+'°F']
  ];
  $('reportSummaryGrid').innerHTML=summary.map(([l,v])=>`<div class="report-summary-item"><span>${escapeHtml(l)}</span><b>${escapeHtml(v)}</b></div>`).join('');

  const recs=state.records||[];
  $('reportRecordTable').innerHTML=recs.length?`<table class="report-table">
    <thead><tr><th>#</th><th>Elapsed</th><th>HR</th><th>RR</th><th>SAP</th><th>MAP</th><th>DAP</th><th>SpO₂</th><th>ETCO₂</th><th>Temp °F</th><th>Vap%</th><th>Fluid</th><th>Note</th></tr></thead>
    <tbody>${recs.map((r,i)=>`<tr><td>${i+1}</td><td>${formatShortElapsed(r.elapsedMs)}</td><td>${r.hr??''}</td><td>${r.rr??''}</td><td>${r.sap??''}</td><td>${r.map??''}</td><td>${r.dap??''}</td><td>${r.spo2??''}</td><td>${r.etco2??''}</td><td>${r.temp??''}</td><td>${r.vaporizer??''}</td><td>${r.fluidRate??''}</td><td class="note">${escapeHtml(r.note||'')}</td></tr>`).join('')}</tbody>
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

  const corrections=state.corrections||[];
  $('reportCorrections').innerHTML=corrections.length?corrections.map(c=>`<div class="report-correction"><b>${escapeHtml(c.clock)}</b><span>${escapeHtml(c.field.toUpperCase())}</span><div>${escapeHtml(c.oldValue)} → ${escapeHtml(c.newValue)}${c.reason?' • '+escapeHtml(c.reason):''}</div></div>`).join(''):'<div style="font-size:8px">No corrections</div>';
  const amendments=state.amendments||[];$('reportAmendments').innerHTML=amendments.length?amendments.map(a=>`<div class="report-amendment"><b>${escapeHtml(formatDate(a.epoch))} ${escapeHtml(a.clock||formatClock(a.epoch))}</b><span>${escapeHtml(a.author||'—')} • ${escapeHtml(a.reason||'—')}</span><div>${escapeHtml(a.text||'')}</div></div>`).join(''):'<div style="font-size:8px">No amendments / addenda</div>';
  const audit=state.auditTrail||[];$('reportAuditTrail').innerHTML=audit.length?audit.map(a=>`<div class="report-audit"><b>${escapeHtml(a.clock||formatClock(a.epoch))}</b><span>${escapeHtml(a.action||'')}</span><div>${escapeHtml(a.detail||'')}${a.actor?' • '+escapeHtml(a.actor):''}</div></div>`).join(''):'<div style="font-size:8px">No audit entries</div>';

  const checks=state.recoveryChecks||[];
  $('reportRecovery').innerHTML=`<div class="report-recovery-grid">
    <div><b>RR</b><br>${escapeHtml($('recRR').value||'—')}</div>
    <div><b>SpO₂</b><br>${escapeHtml($('recSpO2').value||'—')}%</div>
    <div><b>Temp</b><br>${escapeHtml($('recTemp').value||'—')}°F</div>
    <div><b>Checklist</b><br>${checks.filter(Boolean).length}/${checks.length}</div>
  </div>
  <div style="margin-top:6px;font-size:8px"><b>Phase:</b> ${escapeHtml(state.recoveryCompletedAt?'Complete':state.casePhase==='recovery'?'Active':'Not started')} • <b>Extubation:</b> ${escapeHtml($('recExtubation').value||'—')} • <b>O₂:</b> ${escapeHtml($('recOxygen').value||'—')} • <b>Mentation:</b> ${escapeHtml($('recMentation').value||'—')}</div>
  <div style="margin-top:8px;font-size:9px"><b>Recovery note:</b> ${escapeHtml($('recPain').value||'—')}</div>`;
  const recoveryRows=state.recoveryRecords||[];
  $('reportRecoveryRecords').innerHTML=recoveryRows.length?`<table class="report-recovery-table"><thead><tr><th>#</th><th>Recovery</th><th>Clock</th><th>HR</th><th>RR</th><th>MAP</th><th>SpO₂</th><th>Temp</th><th>O₂</th><th>Mentation</th><th>Note</th></tr></thead><tbody>${recoveryRows.map((r,i)=>`<tr><td>${i+1}</td><td>${escapeHtml(formatShortElapsed(r.recoveryElapsedMs))}</td><td>${escapeHtml(r.clock)}</td><td>${r.hr??'—'}</td><td>${r.rr??'—'}</td><td>${r.map??'—'}</td><td>${r.spo2??'—'}%</td><td>${r.temp??'—'}°F</td><td>${escapeHtml(r.oxygen||'—')}</td><td>${escapeHtml(r.mentation||'—')}</td><td>${escapeHtml(r.note||'—')}</td></tr>`).join('')}</tbody></table>`:'<div style="font-size:8px;margin-top:6px">No serial recovery vital records</div>';
  const smart=$('smartAlerts')?.innerText?.trim()||'No smart alerts',responses=state.responses||[];$('reportResponses').innerHTML=`<div style="font-size:8px;margin-bottom:6px"><b>Smart alerts:</b> ${escapeHtml(smart)}</div>`+(responses.length?responses.map(r=>`<div class="report-event"><b>${escapeHtml(r.eventName)}</b><span>+${escapeHtml(formatShortElapsed(r.capturedElapsed-r.eventElapsed))}</span><div>MAP ${r.map??'—'} • HR ${r.hr??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp??'—'}°F${r.note?' • '+escapeHtml(r.note):''}</div></div>`).join(''):'<div style="font-size:8px">No intervention-response records</div>');
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
  const head=['No','Elapsed','Clock','HR','RR','SAP','MAP','DAP','SpO2','ETCO2','Temp_F','Vaporizer_pct','O2_Lmin','FluidRate_mLhr','FluidTotal_mL','Depth','Ventilation','Note'];
  const rows=(state.records||[]).map((r,i)=>[i+1,formatElapsed(r.elapsedMs),r.clock,r.hr,r.rr,r.sap,r.map,r.dap,r.spo2,r.etco2,r.temp,r.vaporizer,r.o2flow,r.fluidRate,r.fluidTotal,r.depth,r.ventilation,r.note]);
  const csv='\ufeff'+[head,...rows].map(row=>row.map(csvEscape).join(',')).join('\n');
  downloadBlob(csv,'text/csv;charset=utf-8',caseBase()+'_records.csv');
}
function exportEventsCsv(){
  const head=['No','Elapsed','Clock','Category','Name','Dose_Amount','Route','Note'];
  const rows=(state.events||[]).map((e,i)=>[i+1,formatElapsed(e.elapsedMs),e.clock,e.category,e.name,e.dose,e.route,e.note]);
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
  const last=Number(localStorage.getItem(LAST_BACKUP_KEY)||0),age=last?Date.now()-last:null;
  if($('backupLastTime'))$('backupLastTime').textContent=last?`${formatDate(last)} ${formatClock(last)}`:'Never';
  if($('backupAgeStatus')){const days=age==null?null:Math.floor(age/86400000);$('backupAgeStatus').textContent=days==null?'Backup recommended':days>=7?`⚠ ${days} days ago`:days===0?'✓ Today':`✓ ${days} day${days===1?'':'s'} ago`;$('backupAgeStatus').className=days==null||days>=7?'health-warn':'health-good'}
  try{if(navigator.storage?.estimate){const e=await navigator.storage.estimate();if($('storageUsedHealth'))$('storageUsedHealth').textContent=formatBytes(e.usage);if($('storageQuotaHealth'))$('storageQuotaHealth').textContent=e.quota?`of ${formatBytes(e.quota)} browser quota`:'Browser estimate'}}catch(e){}
}
$('backupNowHealthBtn')?.addEventListener('click',()=>backupAllData());

async function backupAllData(){save();await initArchiveDb();const payload={format:'ANESVET_BACKUP',version:14.1,exportedAt:Date.now(),current:state,archive:getArchive(),settings:(()=>{try{return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')}catch(e){return null}})(),drugLibrary:loadDrugLibraryData(),quickPresets:loadQuickPresets(),protocolAudit:getProtocolAudit()};downloadBlob(JSON.stringify(payload,null,2),'application/json',`ANESVET_BACKUP_${formatDate(Date.now())}.json`);const backupEpoch=Date.now();localStorage.setItem(LAST_BACKUP_KEY,String(backupEpoch));if($('backupStatus'))$('backupStatus').textContent=`Backup created ${formatClock(backupEpoch)} • ${payload.archive.length} archived cases`;renderBackupHealth();toast('Full backup created')}
$('backupAllBtn')?.addEventListener('click',backupAllData);
$('restoreBackupBtn')?.addEventListener('click',()=>$('restoreBackupInput')?.click());
$('restoreBackupInput')?.addEventListener('change',async e=>{const file=e.target.files?.[0];if(!file)return;try{const raw=JSON.parse(await file.text());if(raw.format!=='ANESVET_BACKUP'||!raw.current||!Array.isArray(raw.archive))throw new Error('Invalid backup');if(!confirm(`Restore ANESVET backup?\nExported: ${new Date(raw.exportedAt||Date.now()).toLocaleString()}\nArchived cases: ${raw.archive.length}\n\nCurrent browser data will be replaced.`))return;localStorage.setItem(CURRENT_KEY,JSON.stringify(raw.current));if(raw.settings)localStorage.setItem(SETTINGS_KEY,JSON.stringify(raw.settings));if(Array.isArray(raw.drugLibrary))localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(raw.drugLibrary));if(raw.quickPresets)localStorage.setItem(QUICK_PRESET_KEY,JSON.stringify(raw.quickPresets));if(Array.isArray(raw.protocolAudit))localStorage.setItem(PROTOCOL_AUDIT_KEY,JSON.stringify(raw.protocolAudit));await initArchiveDb();archiveCache=[];if(archiveBackend==='IndexedDB'){await idbClearCases();for(const c0 of raw.archive){const c={...c0};if(!c.caseId)c.caseId=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());await idbPutCase(c);archiveCache.push(c)}await idbPutMeta('current',raw.current)}else{archiveCache=raw.archive.map(c=>({...c,caseId:c.caseId||(crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()))}));localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archiveCache))}archiveCache.sort((a,b)=>(b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0));restartAtAppRoot()}catch(err){console.error(err);toast('Restore failed: invalid backup file')}finally{e.target.value=''}});
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
      renderPatientRiskBanner();renderCasePhase();renderCaseSummary();renderRecords();renderEvents();renderTrends();renderRecovery();renderRecoveryRecords();renderOrLive();renderArchives();updateDue();
    },800);
  }
}

function archiveFilteredList(){
  let list=getArchive().slice(),q=$('archiveSearch')?.value.trim().toLowerCase()||'',from=$('archiveDateFrom')?.value||'',to=$('archiveDateTo')?.value||'',status=$('archiveStatusFilter')?.value||'all',sort=$('archiveSort')?.value||'newest';
  if(q)list=list.filter(c=>[c.patientName,c.hospitalId,c.humanRecordId,c.procedure,c.patientProcedure,c.surgeon,c.anesthetist].some(v=>String(v||'').toLowerCase().includes(q)));
  if(from)list=list.filter(c=>formatDate(c.archivedAt||c.createdAt||0)>=from);
  if(to)list=list.filter(c=>formatDate(c.archivedAt||c.createdAt||0)<=to);
  if(status==='locked')list=list.filter(c=>c.caseLocked&&!c.voidedAt);if(status==='voided')list=list.filter(c=>!!c.voidedAt);if(status==='working')list=list.filter(c=>!c.caseLocked);
  list.sort((a,b)=>sort==='oldest'?((a.archivedAt||a.createdAt||0)-(b.archivedAt||b.createdAt||0)):sort==='patient'?String(a.patientName||'').localeCompare(String(b.patientName||''),'th'):sort==='hn'?String(a.hospitalId||a.humanRecordId||'').localeCompare(String(b.hospitalId||b.humanRecordId||''),'th'):((b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0)));
  return list;
}
function renderArchives(){
  const source=getArchive(),list=archiveFilteredList(),el=$('archiveList');renderStorageStatus();renderBackupHealth();
  if($('archiveResultCount'))$('archiveResultCount').textContent=`${list.length} / ${source.length} cases`;
  if(!list.length){el.className='archive-list empty-state';el.textContent=source.length?'ไม่พบเคสที่ตรงกับตัวกรอง':'ยังไม่มี archived case';return}
  el.className='archive-list';
  el.innerHTML=list.map(c=>{const i=source.findIndex(x=>x.caseId===c.caseId),name=c.patientName||'Unnamed',asa=`ASA ${c.asa||'—'}${c.emergency?'-E':''}`,records=(c.records||[]).length,events=(c.events||[]).length,recoveryRecords=(c.recoveryRecords||[]).length,voided=!!c.voidedAt;
    const finalBadge=c.caseLocked?'<span class="archive-final-badge">✓ LOCKED FINAL</span>':'';const voidBadge=voided?'<span class="archive-void-badge">VOIDED</span>':'';const integrity=c.finalChecksum?`<span class="archive-integrity-badge">ID ${escapeHtml(c.humanRecordId||'—')} • ${escapeHtml(shortChecksum(c.finalChecksum))}</span>`:`<span class="archive-integrity-badge">ID ${escapeHtml(c.humanRecordId||'—')}</span>`;
    const protocol=c.protocolSnapshot?.version?`<span>Protocol ${escapeHtml(c.protocolSnapshot.version)}</span>`:'';const amendments=(c.amendments||[]).length;const loadButton=c.caseLocked?'':`<button class="btn load-archive" data-i="${i}">Load working copy</button>`;const amendButton=c.caseLocked&&!voided?`<button class="btn archive-amend" data-i="${i}">＋ Add amendment${amendments?` (${amendments})`:''}</button>`:'';const voidButton=c.caseLocked&&!voided?`<button class="btn archive-void" data-i="${i}">Void record</button>`:'';const deleteButton=!c.caseLocked?`<button class="btn danger-outline delete-archive" data-i="${i}">Delete working copy</button>`:'';
    return `<div class="archive-card ${voided?'archive-voided':''}"><div><h3>${escapeHtml(name)} ${finalBadge} ${voidBadge}</h3><div class="archive-meta"><span>${escapeHtml(formatDate(c.archivedAt||c.createdAt||Date.now()))}</span><span>${escapeHtml(c.hospitalId||'No HN')}</span><span>${escapeHtml(asa)}</span><span>${records} anesthesia records</span><span>${recoveryRecords} recovery records</span><span>${events} events</span>${protocol}<span>${escapeHtml(c.procedure||c.patientProcedure||'—')}</span></div><div style="margin-top:5px">${integrity}</div>${voided?`<div class="settings-note">Voided ${escapeHtml(formatDate(c.voidedAt))} • ${escapeHtml(c.voidedBy||'—')} • ${escapeHtml(c.voidReason||'—')}</div>`:''}</div><div class="archive-actions"><button class="btn archive-pdf" data-i="${i}">Export PDF</button>${c.finalChecksum?`<button class="btn verify-integrity" data-i="${i}">Verify integrity</button>`:''}${amendButton}${voidButton}${loadButton}${deleteButton}</div></div>`;
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
  url.searchParams.set('v','14.1');
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

function defaultHospitalDrugLibrary(){
  return [
    {id:'midazolam',name:'Midazolam',phase:'induction',drugClass:'Induction adjunct',mode:'mgkg',dose:'',conc:'',route:'IV',active:true},
    {id:'alfaxalone',name:'Alfaxalone',phase:'induction',drugClass:'Induction agent',mode:'mgkg',dose:'',conc:'',route:'IV',active:true},
    {id:'ketamine',name:'Ketamine',phase:'induction',drugClass:'Induction / analgesic',mode:'mgkg',dose:'',conc:'',route:'IV',active:true},
    {id:'etomidate',name:'Etomidate',phase:'induction',drugClass:'Induction agent',mode:'mgkg',dose:'',conc:'',route:'IV',active:true},
    {id:'ampicillin_sulbactam',name:'Ampicillin-sulbactam',phase:'pre',drugClass:'Antibiotic',mode:'mgkg',dose:'',conc:'',route:'IV',active:true},
    {id:'clindamycin',name:'Clindamycin',phase:'pre',drugClass:'Antibiotic',mode:'mgkg',dose:'',conc:'',route:'',active:true},
    {id:'methadone',name:'Methadone',phase:'pre',drugClass:'Analgesic',mode:'mgkg',dose:'',conc:'',route:'',active:true},
    {id:'buprenorphine',name:'Buprenorphine',phase:'pre',drugClass:'Analgesic',mode:'mgkg',dose:'',conc:'',route:'',active:true},
    {id:'fentanyl',name:'Fentanyl',phase:'pre',drugClass:'Analgesic',mode:'mcgkg',dose:'',conc:'',route:'IV',active:true},
    {id:'butorphanol',name:'Butorphanol',phase:'pre',drugClass:'Analgesic',mode:'mgkg',dose:'',conc:'',route:'',active:true},
    {id:'robenacoxib',name:'Robenacoxib',phase:'post',drugClass:'NSAID',mode:'mgkg',dose:'',conc:'',route:'',active:true},
    {id:'amoxicillin_clavulanate',name:'Amoxicillin-clavulanate',phase:'post',drugClass:'Antibiotic',mode:'mgkg',dose:'',conc:'',route:'',active:true}
  ];
}
function loadDrugLibraryData(){
  try{
    const own=JSON.parse(localStorage.getItem(DRUG_LIBRARY_KEY)||'null');
    if(Array.isArray(own))return own;
    const prev14=JSON.parse(localStorage.getItem('anesvet_v14_drug_library')||'null');if(Array.isArray(prev14)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev14));return prev14}
    const prev134=JSON.parse(localStorage.getItem('anesvet_v13_4_drug_library')||'null');if(Array.isArray(prev134)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev134));return prev134}
    const prev133=JSON.parse(localStorage.getItem('anesvet_v13_3_drug_library')||'null');if(Array.isArray(prev133)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev133));return prev133}
    const prev132=JSON.parse(localStorage.getItem('anesvet_v13_2_drug_library')||'null');if(Array.isArray(prev132)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev132));return prev132}
    const prev131=JSON.parse(localStorage.getItem('anesvet_v13_1_drug_library')||'null');if(Array.isArray(prev131)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev131));return prev131}
    const prev13=JSON.parse(localStorage.getItem('anesvet_v13_drug_library')||'null');if(Array.isArray(prev13)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev13));return prev13}
    const prev121=JSON.parse(localStorage.getItem('anesvet_v12_1_drug_library')||'null');if(Array.isArray(prev121)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev121));return prev121}
    const prev12=JSON.parse(localStorage.getItem('anesvet_v12_drug_library')||'null');if(Array.isArray(prev12)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(prev12));return prev12}
    const old=JSON.parse(localStorage.getItem('anesvet_v11_drug_library')||'null');
    if(Array.isArray(old)){localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(old));return old}
  }catch(e){}
  const d=defaultHospitalDrugLibrary();
  localStorage.setItem(DRUG_LIBRARY_KEY,JSON.stringify(d));
  return d;
}
let hospitalDrugLibrary=loadDrugLibraryData();

function formulaLabel(mode){
  return ({mgkg:'mg/kg ÷ mg/mL',mcgkg:'μg/kg ÷ μg/mL',mlkg:'mL/kg × BW',bwdiv:'BW ÷ factor',manual:'Manual'})[mode]||mode;
}
function phaseLabel(phase){return ({induction:'Induction',pre:'Pre-anesthetic',post:'Post-anesthetic'})[phase]||phase}

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
      route:f('route')?.value.trim()||'',
      active:true,
      favorite:!!f('favorite')?.checked
    };
  });
}
$('addDrugLibraryRowBtn')?.addEventListener('click',()=>{if(isProtocolLocked()){toast('Protocol locked');return}
  readDrugLibrarySettings();
  hospitalDrugLibrary.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:'New drug',phase:'pre',drugClass:'',mode:'mgkg',dose:'',conc:'',route:'',active:true,favorite:false});
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
  induction:{select:'customInductionDrug',dose:'customInductionDose',conc:'customInductionConc',total:'customInductionTotal',ml:'customInductionMl',meta:'customInductionMeta'},
  pre:{select:'customPreDrug',dose:'customPreDose',conc:'customPreConc',total:'customPreTotal',ml:'customPreMl',meta:'customPreMeta'},
  post:{select:'customPostDrug',dose:'customPostDose',conc:'customPostConc',total:'customPostTotal',ml:'customPostMl',meta:'customPostMeta'}
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
  if(d.mode==='mgkg'){
    if(!(dose>0&&conc>0))return {total:'Set dose / concentration',ml:null,unit:'mg'};
    const total=weight*dose;return {total:`${fmtDose(total)} mg`,ml:total/conc,unit:'mg'};
  }
  if(d.mode==='mcgkg'){
    if(!(dose>0&&conc>0))return {total:'Set dose / concentration',ml:null,unit:'μg'};
    const total=weight*dose;return {total:`${fmtDose(total)} μg`,ml:total/conc,unit:'μg'};
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
  const c=customPhaseConfig[phase],d=selectedLibraryDrug(phase),w=getVal('weight',0)||0;
  if(resetFields){
    if($(c.dose))$(c.dose).value=d?.dose??'';
    if($(c.conc))$(c.conc).value=d?.conc??'';
  }
  if(!d){
    if($(c.total))$(c.total).textContent='—';
    if($(c.ml))$(c.ml).textContent='— mL';
    if($(c.meta))$(c.meta).textContent='เลือกยาจาก Hospital Drug Library';
    return;
  }
  const r=calculateLibraryDrug(d,w,$(c.dose)?.value,$(c.conc)?.value);
  if($(c.total))$(c.total).textContent=r.total;
  if($(c.ml))$(c.ml).textContent=r.ml==null?'— mL':`${fmtVol(r.ml)} mL`;
  if($(c.meta))$(c.meta).textContent=`${d.name} • ${d.drugClass||'Unclassified'} • ${formulaLabel(d.mode)}${d.route?' • '+d.route:''}`;
}
Object.entries(customPhaseConfig).forEach(([phase,c])=>{
  $(c.select)?.addEventListener('change',()=>updateCustomDrugCalc(phase,true));
  $(c.dose)?.addEventListener('input',()=>updateCustomDrugCalc(phase,false));
  $(c.conc)?.addEventListener('input',()=>updateCustomDrugCalc(phase,false));
});
$$('.custom-drug-event-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const phase=btn.dataset.phase,c=customPhaseConfig[phase],d=selectedLibraryDrug(phase);
  if(!d){toast('กรุณาเลือกยา');return}
  const r=calculateLibraryDrug(d,getVal('weight',0)||0,$(c.dose)?.value,$(c.conc)?.value);
  if(r.ml==null){toast('สูตรนี้ยังคำนวณ volume ไม่ได้ — ตรวจ dose/concentration');return}
  openDrugAdministration({drug:d.name,calculated:`${r.total} • ${fmtVol(r.ml)} mL`,suggestedMl:r.ml,route:d.route||'',note:`${phaseLabel(phase)} • Hospital Drug Library`});
}));


function defaultSettings(){return{interval:'5',diazepamConc:'5',propofolConc:'10',tramadolConc:'50',rimadylConc:'50',metacamConc:'5',atropineConc:'0.6',protocolName:'Hospital anesthesia protocol',protocolVersion:'',protocolVerifiedAt:'',protocolLocked:false,autoWakeLock:true}}
function loadSettings(){
  let s;try{s=JSON.parse(localStorage.getItem(SETTINGS_KEY)||'null')||JSON.parse(localStorage.getItem('anesvet_v14_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_4_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_3_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_2_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v13_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v12_1_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v12_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v11_settings')||'null')||JSON.parse(localStorage.getItem('anesvet_v10_settings')||'null')}catch(e){}
  s={...defaultSettings(),...(s||{})};
  const map={settingInterval:'interval',settingDiazepamConc:'diazepamConc',settingPropofolConc:'propofolConc',settingTramadolConc:'tramadolConc',settingRimadylConc:'rimadylConc',settingMetacamConc:'metacamConc',settingAtropineConc:'atropineConc',settingProtocolName:'protocolName',settingProtocolVersion:'protocolVersion',settingProtocolVerifiedAt:'protocolVerifiedAt'};
  Object.entries(map).forEach(([id,key])=>{if($(id))$(id).value=s[key]??''});
  if($('settingAutoWakeLock'))$('settingAutoWakeLock').checked=s.autoWakeLock!==false;
  renderProtocolGovernance();
}
$('saveSettingsBtn')?.addEventListener('click',()=>{
  const old=currentSettingsObject(),locked=!!old.protocolLocked;
  const s={...old,interval:$('settingInterval').value,autoWakeLock:$('settingAutoWakeLock')?.checked!==false};
  if(!locked){
    Object.assign(s,{diazepamConc:$('settingDiazepamConc').value,propofolConc:$('settingPropofolConc').value,tramadolConc:$('settingTramadolConc').value,rimadylConc:$('settingRimadylConc').value,metacamConc:$('settingMetacamConc').value,atropineConc:$('settingAtropineConc').value,protocolName:$('settingProtocolName')?.value.trim()||'Hospital anesthesia protocol',protocolVersion:$('settingProtocolVersion')?.value.trim()||'',protocolVerifiedAt:$('settingProtocolVerifiedAt')?.value||''});
  }
  localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));
  $('recordInterval').value=s.interval;$('diazepamConc').value=s.diazepamConc;$('propofolConc').value=s.propofolConc;$('tramadolConc').value=s.tramadolConc;$('rimadylConc').value=s.rimadylConc;$('metacamConc').value=s.metacamConc;$('atropineConc').value=s.atropineConc;
  addProtocolAudit('HOSPITAL_SETTINGS_SAVED',`Protocol ${s.protocolVersion||'unversioned'} • locked=${!!s.protocolLocked}`);updateDashboard();renderProtocolGovernance();toast(locked?'General settings saved • protocol remains locked':'Hospital settings saved');
});
function isProtocolLocked(){return !!currentSettingsObject().protocolLocked}
function renderProtocolGovernance(){
  const s=currentSettingsObject(),panel=document.querySelector('.protocol-governance-panel');panel?.classList.toggle('locked',!!s.protocolLocked);
  if($('protocolLockStatus')){$('protocolLockStatus').textContent=s.protocolLocked?'LOCKED':'UNLOCKED';$('protocolLockStatus').className=`status-pill ${s.protocolLocked?'good':'warn'}`}
  if($('toggleProtocolLockBtn'))$('toggleProtocolLockBtn').textContent=s.protocolLocked?'🔓 Unlock protocol':'🔒 Lock protocol';
  const ids=['settingProtocolName','settingProtocolVersion','settingProtocolVerifiedAt','settingDiazepamConc','settingPropofolConc','settingTramadolConc','settingRimadylConc','settingMetacamConc','settingAtropineConc','quickPresetInd1','quickPresetInd2','quickPresetPre1','quickPresetPre2','quickPresetPost1','quickPresetPost2','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','atropineConc'];
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
    s.diazepamConc=$('settingDiazepamConc').value;s.propofolConc=$('settingPropofolConc').value;s.tramadolConc=$('settingTramadolConc').value;s.rimadylConc=$('settingRimadylConc').value;s.metacamConc=$('settingMetacamConc').value;s.atropineConc=$('settingAtropineConc').value;s.protocolLocked=true;
    localStorage.setItem(SETTINGS_KEY,JSON.stringify(s));addProtocolAudit('PROTOCOL_LOCKED',`${s.protocolName} • ${s.protocolVersion}`);loadSettings();renderDrugLibrarySettings();renderQuickPresetSettings();toast(`Protocol ${version} locked`);
  }
});
function captureProtocolSnapshot(){const s=currentSettingsObject();state.protocolSnapshot={name:s.protocolName||'Hospital anesthesia protocol',version:s.protocolVersion||'unversioned',verifiedAt:s.protocolVerifiedAt||'',locked:!!s.protocolLocked,capturedAt:Date.now(),concentrations:{diazepam:s.diazepamConc,propofol:s.propofolConc,tramadol:s.tramadolConc,carprofen:s.rimadylConc,meloxicam:s.metacamConc,atropine:s.atropineConc},quickPresets:JSON.parse(JSON.stringify(loadQuickPresets())),drugLibrary:JSON.parse(JSON.stringify(loadDrugLibraryData()))}}

function freshState(){
  return {
    caseId:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    humanRecordId:makeHumanRecordId(Date.now()),
    createdAt:Date.now(),timer:{running:false,startedEpoch:null,elapsedMs:0},
    records:[],events:[],recoveryChecks:[false,false,false,false,false,false],
    patientSaved:false,
  preopChecks:{},preopNA:{},
  caseStartedAt:null,responses:[],corrections:[],casePhase:'setup',recoveryStartedAt:null,recoveryCompletedAt:null,recoveryRecords:[],emergencyReturnActive:false,surgeryEndedAt:null,extubatedAt:null,lastSavedAt:null,fluidRateHistory:[],caseLocked:false,lockedAt:null,protocolSnapshot:null,auditTrail:[],amendments:[],finalSignoff:{anesthetist:null,surgeon:null},finalChecksum:null,checksumAlgorithm:null,checksumCreatedAt:null,voidedAt:null,voidedBy:'',voidReason:'',bcs:'5',breed:''
  };
}
function resetCurrent(){state=freshState();localStorage.setItem(CURRENT_KEY,JSON.stringify(state));idbPutMeta('current',state);localStorage.setItem(TAB_KEY,'patient');releaseScreenWakeLock(true);restartAtAppRoot()}
function hasActiveCaseData(){return !!(state.timer.running||(state.timer.elapsedMs||0)>0||(state.records||[]).length||(state.events||[]).length||state.patientSaved)}
$('newCaseBtn').addEventListener('click',()=>{
  if(hasActiveCaseData()&&!confirm('Current case มีข้อมูลอยู่\n\nแนะนำ Archive หรือ Backup ก่อนเริ่มเคสใหม่\n\nต้องการเริ่ม New case ต่อหรือไม่?'))return;
  if(state.timer.running&&!confirm('Case timer กำลัง RUNNING — ยืนยันอีกครั้งว่าจะจบ current case และเริ่มใหม่?'))return;resetCurrent();
});
$('resetCurrentBtn').addEventListener('click',()=>{
  if(hasActiveCaseData()){const code=prompt('Danger zone: การ Reset จะล้าง current case\nพิมพ์ RESET เพื่อยืนยัน');if(code!=='RESET'){toast('Reset cancelled');return}}
  resetCurrent();
});
$('clearRecordsBtn').addEventListener('click',()=>{if(!confirm('ล้าง Anesthesia records ทั้งหมด? Correction history ที่ผูกกับ records จะถูกล้างด้วย'))return;state.records=[];state.corrections=[];save();renderRecords();renderCorrections();renderTrends();renderSmartAlerts();renderOrLive();updateDue()});

$('startCaseBtn').addEventListener('click',()=>{
  if(state.timer.running)return;
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

window.addEventListener('beforeunload',e=>{if(state.timer.running){save();e.preventDefault();e.returnValue=''}});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')save();else if((state.timer.running||state.casePhase==='recovery')&&autoWakeEnabled())requestScreenWakeLock(true)});
window.addEventListener('pagehide',()=>save());
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').hidden=false});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true});
window.addEventListener('appinstalled',()=>{$('installBtn').hidden=true});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));

load();
archiveCache=getLegacyArchiveSeed();
syncPatientProcedureToCase();
loadSettings();hospitalDrugLibrary=loadDrugLibraryData();renderDrugLibrarySettings();renderPhaseDrugSelectors();setTimeout(renderProtocolGovernance,0);
syncAsaCards();updatePatientSaveStatus();
let storedTab=localStorage.getItem(TAB_KEY)||'casesummary';
if(storedTab==='dashboard')storedTab='casesummary';
const initialTab=state.patientSaved?((state.timer.running||(state.timer.elapsedMs||0)>0)?'orlive':storedTab):'patient';
setTab(initialTab);
renderPatientRiskBanner();renderAirwayPanel();renderFavoriteDrugButtons();renderQuickPresetSettings();renderQuickPresetSummary();renderOrFluidPanel();renderCaseSummary();renderCasePhase();renderOrPhaseTracker();renderRecoveryRecords();renderWorkflowLocks();renderAlertFeedbackState();renderProtocolGovernance();renderStorageStatus();renderFinalSignoff();renderBackupHealth();
updateDashboard();renderPreop();renderRecords();renderCorrections();renderEvents();renderTrends();renderProcedureTimeline();renderRecovery();renderRecoveryState();renderArchives();updateDue();renderTimerState();updateDoseSpotlights();renderEndCase();renderOrLive();renderSaveState();
if(state.timer.running && state.timer.startedEpoch) startTimerLoop();
})();
