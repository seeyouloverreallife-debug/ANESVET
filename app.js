(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const tabs = document.querySelectorAll('.tab');
  const pages = document.querySelectorAll('.tabpage');

  function setTab(id) {
    tabs.forEach(b => b.classList.toggle('active', b.dataset.tab === id));
    pages.forEach(p => p.classList.toggle('active', p.id === id));
    localStorage.setItem('vam_tab', id);
  }
  tabs.forEach(b => b.addEventListener('click', () => setTab(b.dataset.tab)));
  setTab(localStorage.getItem('vam_tab') || 'monitor');

  const fieldsToSave = [
    'patientName','species','weight','asa','emergency','map','spo2','etco2','temp','hr','rr',
    'bradyPoorPerf','bloodLoss','cardiacRisk','respRisk','fluidTotal','recRR','recSpO2','recTemp','recPain'
  ];

  function saveState() {
    const data = {};
    fieldsToSave.forEach(id => {
      const el = $(id);
      data[id] = el.type === 'checkbox' ? el.checked : el.value;
    });
    data.events = events;
    data.recovery = [...document.querySelectorAll('.recovery-check')].map(x => x.checked);
    localStorage.setItem('vam_state', JSON.stringify(data));
  }

  let events = [];
  function loadState() {
    try {
      const data = JSON.parse(localStorage.getItem('vam_state') || '{}');
      fieldsToSave.forEach(id => {
        if (!(id in data)) return;
        const el = $(id);
        if (el.type === 'checkbox') el.checked = !!data[id];
        else el.value = data[id];
      });
      events = Array.isArray(data.events) ? data.events : [];
      if (Array.isArray(data.recovery)) {
        [...document.querySelectorAll('.recovery-check')].forEach((el,i) => el.checked = !!data.recovery[i]);
      }
    } catch (_) {}
  }

  const clamp = (v,min,max,fallback) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(min, Math.min(max,n)) : fallback;
  };

  function setFlag(id, level, text) {
    const el = $(id);
    el.className = 'mini ' + level;
    el.textContent = text;
  }

  function evaluate() {
    const map = clamp($('map').value,0,250,0);
    const spo2 = clamp($('spo2').value,0,100,0);
    const et = clamp($('etco2').value,0,150,0);
    const temp = clamp($('temp').value,25,45,37);
    const weight = clamp($('weight').value,0.1,150,1);

    let levels = [];

    if (map < 60) { setFlag('mapFlag','red','ACTION'); $('mapMsg').textContent = 'MAP <60: verify BP + perfusion และแก้ตามกลไก'; levels.push(2); }
    else if (map < 70) { setFlag('mapFlag','amber','RECHECK'); $('mapMsg').textContent = 'MAP 60–69: ดู trend, depth และ perfusion'; levels.push(1); }
    else { setFlag('mapFlag','green','OK'); $('mapMsg').textContent = 'MAP ≥70 โดยทั่วไปถือว่ายอมรับได้'; levels.push(0); }

    if (spo2 < 90) { setFlag('spo2Flag','red','ACTION'); $('spo2Msg').textContent = 'SpO₂ <90%: severe hypoxemia — ตรวจ airway/O₂/ventilation ทันที'; levels.push(2); }
    else if (spo2 < 95) { setFlag('spo2Flag','amber','RECHECK'); $('spo2Msg').textContent = 'SpO₂ <95%: investigate cause'; levels.push(1); }
    else { setFlag('spo2Flag','green','OK'); $('spo2Msg').textContent = 'SpO₂ ≥95% โดยทั่วไปถือว่ายอมรับได้'; levels.push(0); }

    if (et > 60) { setFlag('etco2Flag','red','PPV?'); $('etco2Msg').textContent = 'ETCO₂ >60: ตรวจ depth/airway/circuit และเริ่ม PPV ตามบริบท'; levels.push(2); }
    else if (et < 30) { setFlag('etco2Flag','red','ACTION'); $('etco2Msg').textContent = 'ETCO₂ <30: คิดถึง hyperventilation, low pulmonary blood flow หรือ leak'; levels.push(2); }
    else if (et > 55 || et < 40) { setFlag('etco2Flag','amber','RECHECK'); $('etco2Msg').textContent = 'ETCO₂ นอกช่วงทั่วไป 40–50: ดู trend และ waveform'; levels.push(1); }
    else { setFlag('etco2Flag','green','OK'); $('etco2Msg').textContent = 'เป้าหมายทั่วไป 40–50 mmHg'; levels.push(0); }

    if (temp < 36.7) { setFlag('tempFlag','red','WARM'); $('tempMsg').textContent = 'Hypothermia: active warming + ลด heat loss'; levels.push(2); }
    else if (temp < 37.2) { setFlag('tempFlag','amber','WATCH'); $('tempMsg').textContent = 'อุณหภูมิกำลังต่ำ: เริ่ม/เพิ่ม warming'; levels.push(1); }
    else { setFlag('tempFlag','green','OK'); $('tempMsg').textContent = 'เริ่ม warming ก่อนอุณหภูมิลดมาก'; levels.push(0); }

    if ($('bradyPoorPerf').checked) levels.push(2);

    const species = $('species').value;
    if (species === 'cat') {
      const low = weight*3, high = weight*5;
      $('fluidRate').textContent = `${low.toFixed(0)}–${high.toFixed(0)} mL/hr`;
      $('fluidNote').textContent = 'Cat ~3–5 mL/kg/hr สำหรับผู้ป่วย cardiac/renal function ปกติ';
    } else {
      const rate = weight*5;
      $('fluidRate').textContent = `${rate.toFixed(0)} mL/hr`;
      $('fluidNote').textContent = 'Dog ~5 mL/kg/hr สำหรับผู้ป่วย cardiac/renal function ปกติ';
    }

    const total = clamp($('fluidTotal').value,0,99999,0);
    const totalPerKg = total / weight;
    const totalMsg = $('fluidTotalMsg');
    if (totalPerKg >= 20) {
      totalMsg.className = 'callout warn';
      totalMsg.textContent = `ได้รับรวม ~${totalPerKg.toFixed(1)} mL/kg — ควร reassess volume requirement/hemodynamics`;
      levels.push(1);
    } else {
      totalMsg.className = 'callout info';
      totalMsg.textContent = `ได้รับรวม ~${totalPerKg.toFixed(1)} mL/kg`;
    }

    const worst = Math.max(...levels);
    const badge = $('overallBadge');
    if (worst === 2) {
      badge.className = 'badge red'; badge.textContent = 'INTERVENE';
      $('overallText').textContent = 'มีค่าหรือ clinical modifier ที่ต้องประเมินและแก้ทันที';
    } else if (worst === 1) {
      badge.className = 'badge amber'; badge.textContent = 'REASSESS';
      $('overallText').textContent = 'มีค่าที่ควรประเมินซ้ำและดู trend ใกล้ชิด';
    } else {
      badge.className = 'badge green'; badge.textContent = 'STABLE';
      $('overallText').textContent = 'ค่าหลักอยู่ในช่วงที่ยอมรับได้ — ติดตาม trend ต่อเนื่อง';
    }
    saveState();
  }

  fieldsToSave.forEach(id => {
    const el = $(id);
    if (!el) return;
    el.addEventListener(el.type === 'checkbox' || el.tagName === 'SELECT' ? 'change' : 'input', evaluate);
  });

  document.querySelectorAll('.recovery-check').forEach(el => el.addEventListener('change', () => {
    const all = [...document.querySelectorAll('.recovery-check')];
    const done = all.filter(x => x.checked).length;
    const status = $('recoveryStatus');
    if (done === all.length) {
      status.className = 'callout info';
      status.textContent = 'Checklist ครบ — ยังต้องใช้ clinical judgment ก่อนย้ายผู้ป่วยออกจาก recovery';
    } else {
      status.className = 'callout warn';
      status.textContent = `Checklist ${done}/${all.length} รายการ`;
    }
    saveState();
  }));

  let startAt = null, elapsed = 0, ticking = null;
  const formatMs = ms => {
    const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60), sec = s%60;
    return [h,m,sec].map(n => String(n).padStart(2,'0')).join(':');
  };
  function currentElapsed(){ return startAt ? elapsed + (Date.now()-startAt) : elapsed; }
  function renderTimer(){ $('timerDisplay').textContent = formatMs(currentElapsed()); }
  $('timerStart').addEventListener('click', () => {
    if (startAt) return;
    startAt = Date.now();
    ticking = setInterval(renderTimer, 250);
  });
  $('timerPause').addEventListener('click', () => {
    if (!startAt) return;
    elapsed += Date.now()-startAt; startAt = null;
    clearInterval(ticking); ticking = null; renderTimer();
  });
  $('timerReset').addEventListener('click', () => {
    startAt = null; elapsed = 0; clearInterval(ticking); ticking = null; renderTimer();
  });

  function renderEvents() {
    const log = $('eventLog');
    if (!events.length) { log.className='event-log muted'; log.textContent='ยังไม่มี event'; return; }
    log.className='event-log';
    log.innerHTML = events.map(e => `<div class="event-row"><span>${e.label}</span><b>${e.time}</b></div>`).join('');
  }
  document.querySelectorAll('.lap').forEach(btn => btn.addEventListener('click', () => {
    events.push({label:btn.dataset.label,time:formatMs(currentElapsed())});
    renderEvents(); saveState();
  }));
  $('clearLog').addEventListener('click', () => { events=[]; renderEvents(); saveState(); });

  $('printBtn').addEventListener('click', () => window.print());

  $('exportBtn').addEventListener('click', () => {
    saveState();
    const raw = localStorage.getItem('vam_state') || '{}';
    const blob = new Blob([raw], {type:'application/json'});
    const a = document.createElement('a');
    const safeName = ($('patientName').value || 'case').replace(/[^\wก-๙-]+/g,'_');
    a.href = URL.createObjectURL(blob);
    a.download = `anesthesia_${safeName}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });

  $('resetAllBtn').addEventListener('click', () => {
    if (!confirm('ล้างข้อมูลผู้ป่วยและค่าทั้งหมดในแอป?')) return;
    localStorage.removeItem('vam_state');
    location.reload();
  });

  let deferredPrompt = null;
  const installBtn = $('installBtn');
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault(); deferredPrompt = e; installBtn.hidden = false;
  });
  installBtn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null; installBtn.hidden = true;
  });
  window.addEventListener('appinstalled', () => { installBtn.hidden = true; });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(()=>{}));
  }

  loadState();
  renderEvents();
  document.querySelectorAll('.recovery-check')[0]?.dispatchEvent(new Event('change'));
  evaluate();
  renderTimer();
})();