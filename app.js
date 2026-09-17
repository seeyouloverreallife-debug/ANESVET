(() => {
'use strict';
const $ = id => document.getElementById(id);
const $$ = sel => [...document.querySelectorAll(sel)];
const STORAGE = 'vam_v2_state';
const TIMER_STORAGE = 'vam_v2_timer';
const tabs = $$('.tab'), pages = $$('.tabpage');

function toast(msg){
  const el=$('toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(toast._t); toast._t=setTimeout(()=>el.classList.remove('show'),2200);
}
function setTab(id){
  tabs.forEach(b=>b.classList.toggle('active',b.dataset.tab===id));
  pages.forEach(p=>p.classList.toggle('active',p.id===id));
  localStorage.setItem('vam_v2_tab',id);
  if(id==='graphs') renderCharts();
}
tabs.forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
$('goGraphsBtn').addEventListener('click',()=>setTab('graphs'));

const fields = [
  'patientName','species','weight','asa','emergency','map','spo2','etco2','temp','hr','rr',
  'bradyPoorPerf','bloodLoss','cardiacRisk','respRisk','fluidTotal',
  'recordInterval','reminderOn','autoLog','recordNote','recRR','recSpO2','recTemp','recPain'
];
let records=[], timerEvents=[];
let anesthesiaStartEpoch=null, anesthesiaElapsedMs=0, timerRunning=false, timerTick=null;
let lastAutoLogAt=0, reminderShownFor=0;

const clamp=(v,min,max,fallback)=>{const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback};
const pad=n=>String(n).padStart(2,'0');
const fmtClock = d => `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
const fmtElapsed = ms => {
  const s=Math.max(0,Math.floor(ms/1000)), h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
};
function currentElapsedMs(){return timerRunning&&anesthesiaStartEpoch ? anesthesiaElapsedMs+(Date.now()-anesthesiaStartEpoch) : anesthesiaElapsedMs}

function saveState(){
  const data={records,timerEvents};
  fields.forEach(id=>{const el=$(id); if(!el)return; data[id]=el.type==='checkbox'?el.checked:el.value});
  data.recovery=$$('.recovery-check').map(x=>x.checked);
  localStorage.setItem(STORAGE,JSON.stringify(data));
  localStorage.setItem(TIMER_STORAGE,JSON.stringify({anesthesiaStartEpoch,timerRunning,anesthesiaElapsedMs}));
}
function loadState(){
  try{
    const data=JSON.parse(localStorage.getItem(STORAGE)||'{}');
    fields.forEach(id=>{if(!(id in data))return;const el=$(id);if(!el)return;el.type==='checkbox'?el.checked=!!data[id]:el.value=data[id]});
    records=Array.isArray(data.records)?data.records:[];
    timerEvents=Array.isArray(data.timerEvents)?data.timerEvents:[];
    if(Array.isArray(data.recovery)) $$('.recovery-check').forEach((el,i)=>el.checked=!!data.recovery[i]);
  }catch(e){}
  try{
    const t=JSON.parse(localStorage.getItem(TIMER_STORAGE)||'{}');
    anesthesiaStartEpoch=t.anesthesiaStartEpoch||null;
    timerRunning=!!t.timerRunning;
    anesthesiaElapsedMs=Number(t.anesthesiaElapsedMs)||0;
    if(timerRunning && anesthesiaStartEpoch){
      // keep running across refresh
      startTimerInterval();
    }
  }catch(e){}
}

function setFlag(id,level,text){const el=$(id);el.className='mini '+level;el.textContent=text}
function updatePreview(){
  $('pvHR').textContent=$('hr').value||'—';
  $('pvRR').textContent=$('rr').value||'—';
  $('pvMAP').textContent=$('map').value||'—';
  $('pvSpO2').textContent=$('spo2').value||'—';
  $('pvETCO2').textContent=$('etco2').value||'—';
  $('pvTemp').textContent=$('temp').value||'—';
}
function evaluate(){
  const map=clamp($('map').value,0,250,0),spo2=clamp($('spo2').value,0,100,0),et=clamp($('etco2').value,0,150,0),temp=clamp($('temp').value,25,45,37),weight=clamp($('weight').value,.1,150,1);
  let levels=[];
  if(map<60){setFlag('mapFlag','red','ACTION');$('mapMsg').textContent='MAP <60: verify BP + perfusion และแก้ตามกลไก';levels.push(2)}
  else if(map<70){setFlag('mapFlag','amber','RECHECK');$('mapMsg').textContent='MAP 60–69: ดู trend, depth และ perfusion';levels.push(1)}
  else{setFlag('mapFlag','green','OK');$('mapMsg').textContent='MAP ≥70 โดยทั่วไปถือว่ายอมรับได้';levels.push(0)}
  if(spo2<90){setFlag('spo2Flag','red','ACTION');$('spo2Msg').textContent='SpO₂ <90%: severe hypoxemia — ตรวจ airway/O₂/ventilation';levels.push(2)}
  else if(spo2<95){setFlag('spo2Flag','amber','RECHECK');$('spo2Msg').textContent='SpO₂ <95%: investigate cause';levels.push(1)}
  else{setFlag('spo2Flag','green','OK');$('spo2Msg').textContent='SpO₂ ≥95% โดยทั่วไปถือว่ายอมรับได้';levels.push(0)}
  if(et>60){setFlag('etco2Flag','red','PPV?');$('etco2Msg').textContent='ETCO₂ >60: ตรวจ depth/airway/circuit และพิจารณา PPV';levels.push(2)}
  else if(et<30){setFlag('etco2Flag','red','ACTION');$('etco2Msg').textContent='ETCO₂ <30: hyperventilation / low flow / leak?';levels.push(2)}
  else if(et>55||et<40){setFlag('etco2Flag','amber','RECHECK');$('etco2Msg').textContent='ETCO₂ นอกช่วงทั่วไป 40–50: ดู trend + waveform';levels.push(1)}
  else{setFlag('etco2Flag','green','OK');$('etco2Msg').textContent='เป้าหมายทั่วไป 40–50 mmHg';levels.push(0)}
  if(temp<36.7){setFlag('tempFlag','red','WARM');$('tempMsg').textContent='Hypothermia: active warming + ลด heat loss';levels.push(2)}
  else if(temp<37.2){setFlag('tempFlag','amber','WATCH');$('tempMsg').textContent='อุณหภูมิกำลังต่ำ: เริ่ม/เพิ่ม warming';levels.push(1)}
  else{setFlag('tempFlag','green','OK');$('tempMsg').textContent='เริ่ม warming ก่อนอุณหภูมิลดมาก';levels.push(0)}
  if($('bradyPoorPerf').checked)levels.push(2);
  if($('species').value==='cat'){
    $('fluidRate').textContent=`${(weight*3).toFixed(0)}–${(weight*5).toFixed(0)} mL/hr`;
    $('fluidNote').textContent='Cat ~3–5 mL/kg/hr สำหรับผู้ป่วย cardiac/renal function ปกติ';
  }else{
    $('fluidRate').textContent=`${(weight*5).toFixed(0)} mL/hr`;
    $('fluidNote').textContent='Dog ~5 mL/kg/hr สำหรับผู้ป่วย cardiac/renal function ปกติ';
  }
  const total=clamp($('fluidTotal').value,0,99999,0),pk=total/weight;
  if(pk>=20){$('fluidTotalMsg').className='callout warn';$('fluidTotalMsg').textContent=`ได้รับรวม ~${pk.toFixed(1)} mL/kg — reassess volume requirement`;levels.push(1)}
  else{$('fluidTotalMsg').className='callout info';$('fluidTotalMsg').textContent=`ได้รับรวม ~${pk.toFixed(1)} mL/kg`}
  const worst=Math.max(...levels),badge=$('overallBadge');
  if(worst===2){badge.className='badge red';badge.textContent='INTERVENE';$('overallText').textContent='มีค่าหรือ clinical modifier ที่ต้องประเมินและแก้ทันที'}
  else if(worst===1){badge.className='badge amber';badge.textContent='REASSESS';$('overallText').textContent='มีค่าที่ควรประเมินซ้ำและดู trend ใกล้ชิด'}
  else{badge.className='badge green';badge.textContent='STABLE';$('overallText').textContent='ค่าหลักอยู่ในช่วงที่ยอมรับได้ — ติดตาม trend ต่อเนื่อง'}
  updatePreview(); saveState();
}

function makeRecord(noteOverride){
  const now=new Date();
  const rec={
    id: Date.now()+Math.random(),
    epoch: now.getTime(),
    clock: fmtClock(now),
    elapsedMs: currentElapsedMs(),
    hr: clamp($('hr').value,0,400,null),
    rr: clamp($('rr').value,0,200,null),
    map: clamp($('map').value,0,250,null),
    spo2: clamp($('spo2').value,0,100,null),
    etco2: clamp($('etco2').value,0,150,null),
    temp: clamp($('temp').value,25,45,null),
    note: (noteOverride!==undefined?noteOverride:$('recordNote').value).trim()
  };
  records.push(rec);
  records.sort((a,b)=>a.epoch-b.epoch);
  $('recordNote').value='';
  saveState(); renderRecords(); renderCharts(); updateDue();
  toast(`บันทึกแล้ว • ${rec.clock}`);
}
$('quickRecordBtn').addEventListener('click',()=>makeRecord(''));
$('recordNowBtn').addEventListener('click',()=>makeRecord());
function deleteRecord(id){records=records.filter(r=>r.id!==id);saveState();renderRecords();renderCharts();updateDue()}
window.__vamDeleteRecord=deleteRecord;

function isAlert(r){return (r.map<60)||(r.spo2<90)||(r.etco2>60)||(r.etco2<30)||(r.temp<36.7)}
function renderRecords(){
  const body=$('recordBody'); body.innerHTML='';
  $('emptyRecord').style.display=records.length?'none':'block';
  records.forEach((r,i)=>{
    const tr=document.createElement('tr');if(isAlert(r))tr.classList.add('alert-row');
    tr.innerHTML=`<td>${i+1}</td><td>${fmtElapsed(r.elapsedMs)}</td><td>${r.clock}</td><td>${r.hr??''}</td><td>${r.rr??''}</td><td>${r.map??''}</td><td>${r.spo2??''}</td><td>${r.etco2??''}</td><td>${r.temp??''}</td><td class="note-cell">${escapeHtml(r.note||'')}</td><td><button class="icon-btn" aria-label="ลบ record" data-id="${r.id}">✕</button></td>`;
    body.appendChild(tr);
  });
  $$('#recordBody .icon-btn').forEach(b=>b.addEventListener('click',()=>deleteRecord(Number(b.dataset.id))));
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

function latestRecord(){return records.length?records[records.length-1]:null}
function updateDue(){
  const last=latestRecord(),interval=Number($('recordInterval').value||5)*60*1000;
  if(!last){
    $('lastRecordText').textContent='ยังไม่มี';
    $('nextDueText').textContent='หลังบันทึกครั้งแรก';
    $('dueStatus').textContent='พร้อม';$('dueStatus').className='status-ok';return;
  }
  $('lastRecordText').textContent=`${last.clock} (${fmtElapsed(last.elapsedMs)})`;
  const dueEpoch=last.epoch+interval,delta=dueEpoch-Date.now();
  $('nextDueText').textContent=fmtClock(new Date(dueEpoch));
  if(delta<=0){
    $('dueStatus').textContent=`ถึงเวลา +${Math.floor(Math.abs(delta)/60000)} นาที`;
    $('dueStatus').className='status-due';
    if($('reminderOn').checked && reminderShownFor!==dueEpoch){
      reminderShownFor=dueEpoch; toast('ถึงเวลาบันทึกค่า anesthesia แล้ว');
    }
    if($('autoLog').checked && Date.now()-lastAutoLogAt>30000){
      lastAutoLogAt=Date.now(); makeRecord('AUTO');
    }
  }else{
    const m=Math.floor(delta/60000),s=Math.floor((delta%60000)/1000);
    $('dueStatus').textContent=`อีก ${m}:${pad(s)} นาที`;
    $('dueStatus').className='status-ok';
  }
}
$('recordInterval').addEventListener('change',()=>{updateDue();saveState()});
$('reminderOn').addEventListener('change',saveState);
$('autoLog').addEventListener('change',()=>{saveState();toast($('autoLog').checked?'เปิด Auto-log แล้ว':'ปิด Auto-log แล้ว')});
setInterval(updateDue,1000);

function chartSVG(svgId,key,opts={}){
  const svg=$(svgId), W=700,H=270, M={l:54,r:18,t:20,b:40};
  svg.innerHTML='';
  if(records.length<1){
    svg.innerHTML=`<text x="${W/2}" y="${H/2}" text-anchor="middle" fill="#7a8795" font-size="18">ยังไม่มีข้อมูล</text>`;return;
  }
  const vals=records.map(r=>Number(r[key])).filter(Number.isFinite);
  if(!vals.length)return;
  let yMin=opts.min!==undefined?opts.min:Math.min(...vals),yMax=opts.max!==undefined?opts.max:Math.max(...vals);
  if(yMin===yMax){yMin-=1;yMax+=1}
  const padY=(yMax-yMin)*.12||1;yMin-=opts.min===undefined?padY:0;yMax+=opts.max===undefined?padY:0;
  const xs=records.map((r,i)=>r.elapsedMs>0?r.elapsedMs:i*Number($('recordInterval').value||5)*60000);
  let xMin=Math.min(...xs),xMax=Math.max(...xs);if(xMin===xMax)xMax=xMin+60000;
  const sx=x=>M.l+(x-xMin)/(xMax-xMin)*(W-M.l-M.r), sy=y=>H-M.b-(y-yMin)/(yMax-yMin)*(H-M.t-M.b);
  const NS='http://www.w3.org/2000/svg';
  const add=(tag,attrs,text)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs||{}).forEach(([k,v])=>e.setAttribute(k,v));if(text!==undefined)e.textContent=text;svg.appendChild(e);return e};

  add('rect',{x:0,y:0,width:W,height:H,fill:'#fff'});
  for(let i=0;i<=4;i++){
    const y=M.t+i*(H-M.t-M.b)/4,val=yMax-i*(yMax-yMin)/4;
    add('line',{x1:M.l,y1:y,x2:W-M.r,y2:y,stroke:'#e7edf0','stroke-width':1});
    add('text',{x:M.l-8,y:y+4,'text-anchor':'end',fill:'#6c7886','font-size':12},formatVal(val,opts.decimals));
  }
  const tickCount=Math.min(5,records.length);
  for(let i=0;i<tickCount;i++){
    const t=tickCount===1?0:i/(tickCount-1),x=M.l+t*(W-M.l-M.r),xVal=xMin+t*(xMax-xMin);
    add('text',{x,y:H-12,'text-anchor':'middle',fill:'#6c7886','font-size':12},elapsedMinLabel(xVal));
  }
  if(opts.bands){
    opts.bands.forEach(b=>{
      const y1=sy(Math.min(yMax,b.to)), y2=sy(Math.max(yMin,b.from));
      add('rect',{x:M.l,y:Math.min(y1,y2),width:W-M.l-M.r,height:Math.abs(y2-y1),fill:b.fill,opacity:.12});
    });
  }
  if(opts.lines){
    opts.lines.forEach(l=>{
      if(l.value<yMin||l.value>yMax)return;
      const y=sy(l.value);add('line',{x1:M.l,y1:y,x2:W-M.r,y2:y,stroke:l.stroke||'#c2813b','stroke-width':1.5,'stroke-dasharray':'6 5'});
      add('text',{x:W-M.r-3,y:y-4,'text-anchor':'end',fill:l.stroke||'#8b5b2b','font-size':11},l.label||String(l.value));
    });
  }
  let d='';
  records.forEach((r,i)=>{
    const y=Number(r[key]);if(!Number.isFinite(y))return;
    const x=sx(xs[i]);d+=(d?' L':'M')+` ${x.toFixed(1)} ${sy(y).toFixed(1)}`;
  });
  add('path',{d,fill:'none',stroke:'#1f7a8c','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'});
  records.forEach((r,i)=>{
    const y=Number(r[key]);if(!Number.isFinite(y))return;const x=sx(xs[i]),cy=sy(y);
    const alert=(key==='map'&&y<60)||(key==='spo2'&&y<95)||(key==='etco2'&&(y>60||y<30))||(key==='temp'&&y<36.7);
    add('circle',{cx:x,cy,r:5,fill:alert?'#b3261e':'#0f4c5c',stroke:'#fff','stroke-width':2});
    const title=document.createElementNS(NS,'title');title.textContent=`${elapsedMinLabel(xs[i])}: ${y}${r.note?' • '+r.note:''}`;svg.lastChild.appendChild(title);
  });
}
function formatVal(v,dec){return dec===1?v.toFixed(1):Math.round(v)}
function elapsedMinLabel(ms){const min=Math.round(ms/60000);return `${min}m`}
function renderCharts(){
  chartSVG('chartMAP','map',{min:40,max:110,lines:[{value:60,label:'MAP 60'}]});
  chartSVG('chartHR','hr',{min:20,max:220});
  chartSVG('chartSpO2','spo2',{min:80,max:100,lines:[{value:95,label:'95%'},{value:90,label:'90%'}]});
  chartSVG('chartETCO2','etco2',{min:20,max:80,lines:[{value:60,label:'60'},{value:40,label:'40'}]});
  chartSVG('chartRR','rr',{min:0,max:60});
  chartSVG('chartTemp','temp',{min:34,max:40,decimals:1,lines:[{value:36.7,label:'36.7°C'}]});
  renderGraphSummary();renderTimeline();
}
function renderGraphSummary(){
  const el=$('graphSummary');
  if(!records.length){el.innerHTML='<span class="muted">ยังไม่มีข้อมูล</span>';return}
  const metric=(key)=>records.map(r=>Number(r[key])).filter(Number.isFinite);
  const chip=(name,vals,suffix='')=>{
    const min=Math.min(...vals),max=Math.max(...vals),last=vals[vals.length-1];
    return `<span class="summary-chip"><b>${name}</b> ${last}${suffix} • min ${min}${suffix} • max ${max}${suffix}</span>`;
  };
  el.innerHTML=chip('MAP',metric('map'))+chip('SpO₂',metric('spo2'),'%')+chip('ETCO₂',metric('etco2'))+chip('Temp',metric('temp'),'°C');
}
function renderTimeline(){
  const notes=records.filter(r=>r.note);
  $('eventTimeline').className=notes.length?'timeline':'timeline muted';
  $('eventTimeline').innerHTML=notes.length?notes.map(r=>`<div class="timeline-item"><b>${fmtElapsed(r.elapsedMs)}</b>${escapeHtml(r.note)}</div>`).join(''):'ยังไม่มี note/event';
}
$$('.graph-filter').forEach(b=>b.addEventListener('click',()=>{
  $$('.graph-filter').forEach(x=>x.classList.remove('primary'));b.classList.add('primary');
  const v=b.dataset.view;
  $$('.chart-card').forEach(c=>c.style.display='');
  if(v==='hemo')$$('.chart-card:not(.hemo-chart)').forEach(c=>c.style.display='none');
  if(v==='resp')$$('.chart-card:not(.resp-chart)').forEach(c=>c.style.display='none');
  if(v==='temp')$$('.chart-card:not(.temp-chart)').forEach(c=>c.style.display='none');
}));

function startTimerInterval(){
  clearInterval(timerTick);
  timerTick=setInterval(()=>{$('timerDisplay').textContent=fmtElapsed(currentElapsedMs());saveState()},250);
}
$('timerStart').addEventListener('click',()=>{
  if(timerRunning)return;timerRunning=true;anesthesiaStartEpoch=Date.now();startTimerInterval();saveState();
});
$('timerPause').addEventListener('click',()=>{
  if(!timerRunning)return;anesthesiaElapsedMs=currentElapsedMs();timerRunning=false;anesthesiaStartEpoch=null;clearInterval(timerTick);timerTick=null;$('timerDisplay').textContent=fmtElapsed(anesthesiaElapsedMs);saveState();
});
$('timerReset').addEventListener('click',()=>{
  if(!confirm('Reset anesthesia timer?'))return;timerRunning=false;anesthesiaStartEpoch=null;anesthesiaElapsedMs=0;clearInterval(timerTick);$('timerDisplay').textContent='00:00:00';saveState();
});
$$('.lap').forEach(btn=>btn.addEventListener('click',()=>{
  const ev={label:btn.dataset.label,time:fmtElapsed(currentElapsedMs()),epoch:Date.now()};
  timerEvents.push(ev);renderTimerEvents();saveState();toast(ev.label+' • '+ev.time);
}));
$('clearLog').addEventListener('click',()=>{timerEvents=[];renderTimerEvents();saveState()});
function renderTimerEvents(){
  $('timerEventLog').className=timerEvents.length?'event-log':'event-log muted';
  $('timerEventLog').innerHTML=timerEvents.length?timerEvents.map(e=>`<div class="event-row"><span>${escapeHtml(e.label)}</span><b>${e.time}</b></div>`).join(''):'ยังไม่มี event';
}

function csvEscape(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
$('exportCsvBtn').addEventListener('click',()=>{
  const head=['No','Elapsed','Clock','HR','RR','MAP','SpO2','ETCO2','Temp_C','Note'];
  const rows=records.map((r,i)=>[i+1,fmtElapsed(r.elapsedMs),r.clock,r.hr,r.rr,r.map,r.spo2,r.etco2,r.temp,r.note]);
  const csv='\ufeff'+[head,...rows].map(row=>row.map(csvEscape).join(',')).join('\n');
  downloadBlob(csv,'text/csv;charset=utf-8',fileBase()+'.csv');
});
$('exportJsonBtn').addEventListener('click',()=>{
  saveState();downloadBlob(localStorage.getItem(STORAGE)||'{}','application/json',fileBase()+'.json');
});
function fileBase(){return `anesthesia_${($('patientName').value||'case').replace(/[^\wก-๙-]+/g,'_')}_${new Date().toISOString().slice(0,10)}`}
function downloadBlob(content,type,name){
  const blob=new Blob([content],{type}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000)
}
$('printBtn').addEventListener('click',()=>window.print());
$('clearRecordsBtn').addEventListener('click',()=>{
  if(!confirm('ล้าง Anesthesia Record และกราฟทั้งหมด?'))return;records=[];saveState();renderRecords();renderCharts();updateDue();toast('ล้าง Record แล้ว')
});

$$('.recovery-check').forEach(el=>el.addEventListener('change',()=>{
  const all=$$('.recovery-check'),done=all.filter(x=>x.checked).length,status=$('recoveryStatus');
  if(done===all.length){status.className='callout info';status.textContent='Checklist ครบ — ยังต้องใช้ clinical judgment ก่อนย้ายผู้ป่วย'}
  else{status.className='callout warn';status.textContent=`Checklist ${done}/${all.length} รายการ`}
  saveState();
}));

fields.forEach(id=>{const el=$(id);if(!el)return;el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',evaluate)});

$('resetAllBtn').addEventListener('click',()=>{
  if(!confirm('ล้างข้อมูลผู้ป่วย Record กราฟ และค่าทั้งหมดในแอป?'))return;
  localStorage.removeItem(STORAGE);localStorage.removeItem(TIMER_STORAGE);localStorage.removeItem('vam_v2_tab');location.reload();
});

let deferredPrompt=null;const installBtn=$('installBtn');
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;installBtn.hidden=false});
installBtn.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;installBtn.hidden=true});
window.addEventListener('appinstalled',()=>installBtn.hidden=true);
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));

loadState();
setTab(localStorage.getItem('vam_v2_tab')||'monitor');
evaluate();renderRecords();renderCharts();renderTimerEvents();updateDue();
$('timerDisplay').textContent=fmtElapsed(currentElapsedMs());
$$('.recovery-check')[0]?.dispatchEvent(new Event('change'));
})();
