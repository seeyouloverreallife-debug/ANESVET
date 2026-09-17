(() => {
'use strict';

const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const CURRENT_KEY = 'anesvet_v7_current';
const ARCHIVE_KEY = 'anesvet_v7_archive';
const TAB_KEY = 'anesvet_v7_tab';

const numericFields = ['weight','hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal','recRR','recSpO2','recTemp'];
const dataFields = [
  'patientName','hospitalId','species','breed','weight','age','bcs','asa','emergency','procedure','surgeon','anesthetist',
  'hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRateInput','fluidTotal',
  'depth','ventilation','bradyPoorPerf','bloodLoss','cardiacRisk','respRisk','recordInterval','reminderOn',
  'recordNote','recRR','recSpO2','recTemp','recPain','diazepamConc','propofolConc','tramadolConc','rimadylConc','metacamConc','adrenalineConc','atropineConc','atropineMode','dopamineDose','dopamineConc'
];

let state = {
  caseId: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  createdAt: Date.now(),
  timer: {running:false, startedEpoch:null, elapsedMs:0},
  records: [],
  events: [],
  recoveryChecks: [false,false,false,false,false,false],
  patientSaved:false,
  preopChecks:{},
  caseStartedAt:null
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
function formatShortElapsed(ms){
  const s=Math.max(0,Math.floor((ms||0)/1000)),m=Math.floor(s/60),sec=s%60;
  return m>=60?formatElapsed(ms):`${m}:${pad(sec)}`;
}
function toast(msg){
  const t=$('toast');t.textContent=msg;t.classList.add('show');
  clearTimeout(toast._t);toast._t=setTimeout(()=>t.classList.remove('show'),2200);
}
function currentElapsed(){
  if(state.timer.running && state.timer.startedEpoch){
    return state.timer.elapsedMs + (Date.now()-state.timer.startedEpoch);
  }

function renderTimerState(){
  const badge=$('timerStateBadge'),startBtn=$('startCaseBtn'),pauseBtn=$('pauseCaseBtn');
  if(!badge||!startBtn||!pauseBtn)return;
  if(state.timer.running){
    badge.className='timer-state running';badge.textContent='● RUNNING';
    startBtn.textContent='Running';startBtn.disabled=true;
    pauseBtn.disabled=false;pauseBtn.textContent='Pause case';
  }else if((state.timer.elapsedMs||0)>0){
    badge.className='timer-state paused';badge.textContent='PAUSED';
    startBtn.textContent='▶ Resume case';startBtn.disabled=false;
    pauseBtn.disabled=true;pauseBtn.textContent='Paused';
  }else{
    badge.className='timer-state ready';badge.textContent='READY';
    startBtn.textContent='▶ Start case';startBtn.disabled=false;
    pauseBtn.disabled=true;pauseBtn.textContent='Pause';
  }
  if($('timelineElapsed')) $('timelineElapsed').textContent=formatElapsed(currentElapsed());
  if($('timelineStartClock')) $('timelineStartClock').textContent=state.caseStartedAt?formatClock(state.caseStartedAt):'—';
}
  return state.timer.elapsedMs || 0;
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
function save(){
  $('emergency').addEventListener('change',()=>{syncAsaCards();state.patientSaved=false;updatePatientSaveStatus();save()});

dataFields.forEach(id=>{
    const el=$(id);if(!el)return;
    state[id]=el.type==='checkbox'?el.checked:el.value;
  });
  state.recoveryChecks=$$('.recovery-check').map(x=>x.checked);
  state.preopChecks={};$$('.preop-check').forEach(x=>state.preopChecks[x.dataset.key]=x.checked);
  localStorage.setItem(CURRENT_KEY, JSON.stringify(state));
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
    if(!raw){
      const v61=JSON.parse(localStorage.getItem('anesvet_v6_1_current')||'null');
      const v6=JSON.parse(localStorage.getItem('anesvet_v6_current')||'null');
      const v5=JSON.parse(localStorage.getItem('anesvet_v5_current')||'null');
      const v4=JSON.parse(localStorage.getItem('anesvet_v4_current')||'null');
      if(v61){
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
    if(raw && typeof raw==='object') state={...state,...raw};
  }catch(e){}
  dataFields.forEach(id=>{
    const el=$(id);if(!el || !(id in state)) return;
    if(el.type==='checkbox') el.checked=!!state[id]; else el.value=state[id] ?? '';
  });
  $$('.recovery-check').forEach((el,i)=>el.checked=!!(state.recoveryChecks||[])[i]);
  $$('.preop-check').forEach(el=>el.checked=!!(state.preopChecks||{})[el.dataset.key]);
  if(state.timer.running && state.timer.startedEpoch) startTimerLoop();
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
  syncAsaCards();updatePatientSaveStatus();updateDashboard();
}));
$('savePatientBtn').addEventListener('click',()=>{
  const name=$('patientName').value.trim(),weight=Number($('weight').value);
  if(!name){toast('กรุณาใส่ชื่อสัตว์');$('patientName').focus();return}
  if(!Number.isFinite(weight)||weight<=0){toast('กรุณาใส่น้ำหนักที่ถูกต้อง');$('weight').focus();return}
  state.patientSaved=true;save();syncAsaCards();updatePatientSaveStatus();
  toast('บันทึกข้อมูลผู้ป่วยแล้ว');
  setTab('preop');
});
$('editPatientBtn').addEventListener('click',()=>setTab('patient'));
['patientName','hospitalId','species','breed','age','weight','bcs','emergency'].forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',()=>{
    state.patientSaved=false;updatePatientSaveStatus();
  });
});


function renderPreop(){
  const checks=$$('.preop-check'),done=checks.filter(x=>x.checked).length,total=checks.length;
  if($('preopProgress')){
    $('preopProgress').textContent=`${done}/${total} COMPLETE`;
    $('preopProgress').className=`status-pill ${done===total?'good':'warn'}`;
  }
  if($('preopWarning')){
    $('preopWarning').textContent=done===total?'Pre-anesthetic checklist complete':'Checklist ยังไม่ครบ — ทบทวนรายการที่ยังไม่ได้ยืนยัน';
    $('preopWarning').className=done===total?'info-line':'info-line';
  }
  save();
}
$$('.preop-check').forEach(el=>el.addEventListener('change',renderPreop));
$('goDashboardBtn')?.addEventListener('click',()=>setTab('dashboard'));
$('openPreopBtn')?.addEventListener('click',()=>setTab('preop'));

function setTab(id){
  $$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  $$('.tabpage').forEach(p=>p.classList.toggle('active',p.id===id));
  localStorage.setItem(TAB_KEY,id);
  if(id==='trends') renderTrends();
  if(id==='cases') renderArchives();
}
$$('.tab').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));

function getVal(id, fallback=null){
  const el=$(id); if(!el) return fallback;
  if(numericFields.includes(id)) return clamp(el.value,-99999,99999,fallback);
  return el.value;
}
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
  $('caseStripProcedure').textContent=$('procedure').value.trim()||'—';
  $('caseStripInterval').textContent=`${$('recordInterval').value} min`;

  renderInterpretation();
  renderRecordPreview();
  drugCalc();
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
  state.records.push(currentSnapshot(note));
  state.records.sort((a,b)=>a.epoch-b.epoch);
  $('recordNote').value='';
  save();renderRecords();renderTrends();renderProcedureTimeline();updateDue();
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
    const vals=[r.hr,r.rr,r.sap,r.map,r.dap,r.spo2,r.etco2,r.temp,r.vaporizer,r.fluidRate];
    tr.innerHTML=`<td>${i+1}</td><td>${formatElapsed(r.elapsedMs)}</td><td>${escapeHtml(r.clock)}</td>`+
      vals.map(v=>`<td>${v??''}</td>`).join('')+
      `<td class="note">${escapeHtml(r.note||'')}</td><td><button class="delete-btn" data-id="${escapeHtml(r.id)}">✕</button></td>`;
    body.appendChild(tr);
  });
  $$('#recordBody .delete-btn').forEach(b=>b.addEventListener('click',()=>{
    state.records=state.records.filter(r=>String(r.id)!==String(b.dataset.id));
    save();renderRecords();renderTrends();renderProcedureTimeline();updateDue();
  }));
}
function latestRecord(){return state.records?.length?state.records[state.records.length-1]:null}
function updateDue(){
  const last=latestRecord(),interval=Number($('recordInterval').value||5)*60000;
  const banner=$('dueBanner');
  if(!last){
    $('latestRecordText').textContent='ยังไม่มี';
    $('nextDueText').textContent='หลัง Record ครั้งแรก';
    $('dueStatus').textContent='READY';
    banner.classList.add('hidden');
    return;
  }
  $('latestRecordText').textContent=`${last.clock} • ${formatElapsed(last.elapsedMs)}`;
  const due=last.epoch+interval,delta=due-Date.now();
  $('nextDueText').textContent=formatClock(due);
  if(delta<=0){
    $('dueStatus').textContent=`DUE +${Math.floor(Math.abs(delta)/60000)}m`;
    banner.classList.remove('hidden');
    if($('reminderOn').checked && dueReminderToken!==due){
      dueReminderToken=due;toast('ถึงเวลาบันทึกค่า anesthesia แล้ว');
    }
  }else{
    $('dueStatus').textContent=`${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;
    banner.classList.add('hidden');
  }
}
setInterval(updateDue,1000);


function markMilestone(btn){
  const label=btn.dataset.label,cat=btn.dataset.cat;
  addEvent({category:cat,name:label,note:'Procedure milestone'});
  btn.classList.add('done');
}
$$('.milestone-btn').forEach(btn=>btn.addEventListener('click',()=>markMilestone(btn)));
function renderProcedureTimeline(){
  const items=[
    ...(state.events||[]).map(e=>({elapsedMs:e.elapsedMs,clock:e.clock,cat:e.category,text:`${e.name}${e.dose?' • '+e.dose:''}${e.route?' • '+e.route:''}${e.note?' • '+e.note:''}`})),
    ...(state.records||[]).filter(r=>r.note).map(r=>({elapsedMs:r.elapsedMs,clock:r.clock,cat:'Record',text:r.note,isRecord:true}))
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

function addEvent({category,name,dose='',route='',note=''}){
  ensureTimerStarted();
  const ev={
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),
    epoch:Date.now(),elapsedMs:currentElapsed(),clock:formatClock(),
    category,name,dose,route,note
  };
  state.events.push(ev);state.events.sort((a,b)=>a.epoch-b.epoch);
  save();renderEvents();renderTrends();renderProcedureTimeline();renderProcedureTimeline();toast(`${name} • ${ev.clock}`);
}

$$('.drug-event-btn').forEach(btn=>btn.addEventListener('click',()=>{
  const parts=[];
  const doseEl=btn.dataset.doseid?$(btn.dataset.doseid):null;
  const volEl=btn.dataset.volid?$(btn.dataset.volid):null;
  if(doseEl) parts.push(doseEl.textContent);
  if(volEl) parts.push(volEl.textContent);
  addEvent({category:'Drug',name:btn.dataset.drug,dose:parts.join(' • '),route:'',note:'Calculated in Drug Calculator'});
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
function renderEvents(){
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

function renderRecovery(){
  const all=$$('.recovery-check'),done=all.filter(x=>x.checked).length,el=$('recoveryStatus');
  el.textContent=`Checklist ${done}/${all.length}`;
  el.className=`recovery-status ${done===all.length?'good':'warn'}`;
}
$$('.recovery-check').forEach(el=>el.addEventListener('change',()=>{renderRecovery();save()}));


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

  $('reportPatientGrid').innerHTML=[
    reportInfoItem('Patient',$('patientName').value||'—'),
    reportInfoItem('HN / Case ID',$('hospitalId').value||'—'),
    reportInfoItem('Species',species),
    reportInfoItem('Breed',$('breed').value||'—'),
    reportInfoItem('Age',$('age').value||'—'),
    reportInfoItem('Body weight',`${$('weight').value||'—'} kg`),
    reportInfoItem('BCS',$('bcs').value?`${$('bcs').value}/9`:'—'),
    reportInfoItem('ASA',`${asa} — ${asaDescription($('asa').value)}`)
  ].join('');

  
  const preopLabels={
    consent:'Consent / owner discussion',fasting:'Fasting / aspiration risk reviewed',exam:'Pre-anesthetic physical exam',
    labs:'Lab / imaging reviewed',iv:'IV catheter patent',oxygen:'O₂ source + backup checked',
    machine:'Anesthesia machine leak check',vaporizer:'Vaporizer / agent checked',absorber:'CO₂ absorbent checked',
    airway:'Airway equipment ready',suction:'Suction available',monitor:'Monitor attached / functional',
    warming:'Active warming ready',emergency:'Emergency drugs / crash plan ready'
  };
  $('reportPreop').innerHTML=`<div class="report-preop-grid">${Object.entries(preopLabels).map(([k,label])=>`<div class="report-preop-item"><span class="mark">${(state.preopChecks||{})[k]?'☑':'☐'}</span><span>${escapeHtml(label)}</span></div>`).join('')}</div>`;

  $('reportCaseGrid').innerHTML=[
    reportInfoItem('Procedure',$('procedure').value||'—'),
    reportInfoItem('Surgeon',$('surgeon').value||'—'),
    reportInfoItem('Anesthetist',$('anesthetist').value||'—'),
    reportInfoItem('Duration',formatElapsed(currentElapsed())),
    reportInfoItem('Ventilation',$('ventilation').value||'—'),
    reportInfoItem('Latest depth',$('depth').value||'—'),
    reportInfoItem('Total fluid',`${$('fluidTotal').value||0} mL`),
    reportInfoItem('Record interval',`${$('recordInterval').value} min`)
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

  const checks=state.recoveryChecks||[];
  $('reportRecovery').innerHTML=`<div class="report-recovery-grid">
    <div><b>RR</b><br>${escapeHtml($('recRR').value||'—')}</div>
    <div><b>SpO₂</b><br>${escapeHtml($('recSpO2').value||'—')}%</div>
    <div><b>Temp</b><br>${escapeHtml($('recTemp').value||'—')}°F</div>
    <div><b>Checklist</b><br>${checks.filter(Boolean).length}/${checks.length}</div>
  </div>
  <div style="margin-top:8px;font-size:9px"><b>Recovery note:</b> ${escapeHtml($('recPain').value||'—')}</div>`;
  $('reportSignAnesthetist').textContent=$('anesthetist').value||'—';
  $('reportSignSurgeon').textContent=$('surgeon').value||'—';
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
$('printBtn').addEventListener('click',exportPdfReport);
$('printCaseBtn').addEventListener('click',exportPdfReport);

function archiveSnapshot(){
  save();
  const archive=getArchive();
  const snap=JSON.parse(JSON.stringify(state));
  snap.archivedAt=Date.now();
  archive.unshift(snap);
  localStorage.setItem(ARCHIVE_KEY,JSON.stringify(archive.slice(0,50)));
  renderArchives();toast('Archived current case');
}
function getArchive(){
  try{
    let a=JSON.parse(localStorage.getItem(ARCHIVE_KEY)||'null');
    if(!Array.isArray(a)){
      const v61=JSON.parse(localStorage.getItem('anesvet_v6_1_archive')||'null');
      const v6=JSON.parse(localStorage.getItem('anesvet_v6_archive')||'null');
      const v5=JSON.parse(localStorage.getItem('anesvet_v5_archive')||'null');
      const v4=JSON.parse(localStorage.getItem('anesvet_v4_archive')||'null');
      if(Array.isArray(v61)){
        a=v61;
      }else if(Array.isArray(v6)){
        a=v6;
      }else if(Array.isArray(v5)){
        a=v5;
      }else if(Array.isArray(v4)){
        a=v4;
      }else{
        const old=JSON.parse(localStorage.getItem('anesvet_v3_archive')||'[]');
        a=Array.isArray(old)?old.map(migrateV3Case):[];
      }
      if(a.length) localStorage.setItem(ARCHIVE_KEY,JSON.stringify(a));
    }
    return Array.isArray(a)?a:[];
  }catch{return[]}
}
function renderArchives(){
  const list=getArchive(),el=$('archiveList');
  if(!list.length){el.className='archive-list empty-state';el.textContent='ยังไม่มี archived case';return}
  el.className='archive-list';
  el.innerHTML=list.map((c,i)=>{
    const name=(c.patientName||'Unnamed'),asa=`ASA ${c.asa||'—'}${c.emergency?'-E':''}`,records=(c.records||[]).length,events=(c.events||[]).length;
    return `<div class="archive-card">
      <div><h3>${escapeHtml(name)}</h3><div class="archive-meta"><span>${escapeHtml(formatDate(c.createdAt||c.archivedAt||Date.now()))}</span><span>${escapeHtml(asa)}</span><span>${records} records</span><span>${events} events</span><span>${escapeHtml(c.procedure||'—')}</span></div></div>
      <div class="archive-actions"><button class="btn load-archive" data-i="${i}">Load</button><button class="btn danger-outline delete-archive" data-i="${i}">Delete</button></div>
    </div>`;
  }).join('');
  $$('.load-archive').forEach(b=>b.addEventListener('click',()=>loadArchive(Number(b.dataset.i))));
  $$('.delete-archive').forEach(b=>b.addEventListener('click',()=>deleteArchive(Number(b.dataset.i))));
}
function loadArchive(i){
  const list=getArchive(),c=list[i];if(!c)return;
  if(!confirm(`Load case "${c.patientName||'Unnamed'}" แทน current case?`))return;
  state=JSON.parse(JSON.stringify(c));
  state.timer={running:false,startedEpoch:null,elapsedMs:state.timer?.elapsedMs||0};
  localStorage.setItem(CURRENT_KEY,JSON.stringify(state));
  restartAtAppRoot();
}
function deleteArchive(i){
  const list=getArchive();if(!confirm('Delete archived case นี้?'))return;
  list.splice(i,1);localStorage.setItem(ARCHIVE_KEY,JSON.stringify(list));renderArchives();
}
$('archiveCaseBtn').addEventListener('click',archiveSnapshot);

function appRootUrl(){
  // Resolve the current GitHub Pages directory safely whether the app is
  // opened as /ANESVET/, /ANESVET/index.html, or from the installed PWA.
  const here=new URL(window.location.href);
  let path=here.pathname;
  if(!path.endsWith('/')) path=path.replace(/\/[^/]*$/,'/');
  const url=new URL(path, here.origin);
  url.searchParams.set('v','7');
  return url.href;
}
function restartAtAppRoot(){
  // Use replace instead of reload so GitHub Pages never tries to reload
  // an accidental nested/404 path.
  window.location.replace(appRootUrl());
}

function freshState(){
  return {
    caseId:crypto.randomUUID?crypto.randomUUID():String(Date.now()),
    createdAt:Date.now(),timer:{running:false,startedEpoch:null,elapsedMs:0},
    records:[],events:[],recoveryChecks:[false,false,false,false,false,false],
    patientSaved:false,
  preopChecks:{},
  caseStartedAt:null,bcs:'5',breed:''
  };
}
function resetCurrent(){
  state=freshState();localStorage.setItem(CURRENT_KEY,JSON.stringify(state));localStorage.setItem(TAB_KEY,'patient');restartAtAppRoot();
}
$('newCaseBtn').addEventListener('click',()=>{if(confirm('เริ่มเคสใหม่? Current case ที่ยังไม่ได้ Archive จะถูกล้าง'))resetCurrent()});
$('resetCurrentBtn').addEventListener('click',()=>{if(confirm('ล้าง current case ทั้งหมด?'))resetCurrent()});
$('clearRecordsBtn').addEventListener('click',()=>{if(!confirm('ล้าง Anesthesia records ทั้งหมด?'))return;state.records=[];save();renderRecords();renderTrends();updateDue()});

$('startCaseBtn').addEventListener('click',()=>{
  if(state.timer.running)return;
  const preopTotal=$$('.preop-check').length,preopDone=$$('.preop-check').filter(x=>x.checked).length;
  if(preopDone<preopTotal && !confirm(`Pre-op checklist ยังไม่ครบ (${preopDone}/${preopTotal}) — ต้องการเริ่มเคสต่อหรือไม่?`))return;
  const firstStart=(state.timer.elapsedMs||0)===0 && !state.caseStartedAt;
  state.timer.running=true;
  state.timer.startedEpoch=Date.now();
  if(firstStart) state.caseStartedAt=state.timer.startedEpoch;
  startTimerLoop();renderTimerState();save();
  if(firstStart) addEvent({category:'Case',name:'Case started',note:'Anesthesia case timer started'});
  toast(firstStart?'Case timer started':'Case timer resumed');
});
$('pauseCaseBtn').addEventListener('click',pauseTimer);

dataFields.forEach(id=>{
  const el=$(id);if(!el)return;
  el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',updateDashboard);
});

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('installBtn').hidden=false});
$('installBtn').addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true});
window.addEventListener('appinstalled',()=>{$('installBtn').hidden=true});
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));

load();
syncAsaCards();updatePatientSaveStatus();
const initialTab=state.patientSaved?(localStorage.getItem(TAB_KEY)||'dashboard'):'patient';
setTab(initialTab);
updateDashboard();renderPreop();renderRecords();renderEvents();renderTrends();renderProcedureTimeline();renderRecovery();renderArchives();updateDue();renderTimerState();
if(state.timer.running && state.timer.startedEpoch) startTimerLoop();
})();
