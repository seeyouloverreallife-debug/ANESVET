/* ANESVET V17.14.9 — Simulation Mode
 * UX sandbox for practicing the full anesthesia workflow without creating
 * Patient Master or real Archive records. Simulation may start only when there
 * is no mutable real case. Clinical calculations and alert rules remain native.
 */
(() => {
  'use strict';
  const FALLBACK_VERSION='17.14.9';
  const runtimeVersion=()=>window.AnesvetApp?.version||FALLBACK_VERSION;
  const $=id=>document.getElementById(id);
  const api=()=>window.AnesvetApp||null;
  const state=()=>api()?.getState?.()||null;
  const active=()=>!!state()?.simulationMode;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

  const scenarios={
    routine_dog:{
      id:'routine_dog', icon:'🐶', title:'Routine dog', subtitle:'เคส routine สำหรับลอง workflow ตั้งแต่ Patient → End Case',
      seed:{patientName:'Mochi • DEMO',hospitalId:'SIM-DOG-001',visitId:'SIM-ROUTINE',species:'dog',sex:'male',reproductiveStatus:'intact',breed:'Pomeranian / ปอมเมอเรเนียน',weight:'6.8',bcs:'5',asa:'II',patientProcedure:'Castration',procedure:'Castration',procedureTemplateId:'castration',caseWorkflowProfile:'routine',surgeon:'Demo Surgeon',anesthetist:'Demo Anesthetist',preopMentation:'BAR',preopHR:'110',preopRR:'24',preopTemp:'101.3',preopMM:'pink',preopCRT:'<2 sec',preopHydration:'normal'}
    },
    cat_spay:{
      id:'cat_spay', icon:'🐱', title:'Cat spay', subtitle:'แมวทำหมัน ใช้ลองฟอร์มบนจอมือถือและ Recovery',
      seed:{patientName:'Luna • DEMO',hospitalId:'SIM-CAT-001',visitId:'SIM-SPAY',species:'cat',sex:'female',reproductiveStatus:'intact',breed:'Domestic Shorthair / แมวบ้านขนสั้น',weight:'4.2',bcs:'5',asa:'II',patientProcedure:'OVH / OHE',procedure:'OVH / OHE',procedureTemplateId:'ovh',caseWorkflowProfile:'routine',surgeon:'Demo Surgeon',anesthetist:'Demo Anesthetist',preopMentation:'BAR',preopHR:'180',preopRR:'28',preopTemp:'101.7',preopMM:'pink',preopCRT:'<2 sec',preopHydration:'normal'}
    },
    brachy_dog:{
      id:'brachy_dog', icon:'🐾', title:'Brachycephalic dog', subtitle:'ใช้ลอง risk flags, airway workflow และ alerts โดยไม่แตะข้อมูลจริง',
      seed:{patientName:'Bruno • DEMO',hospitalId:'SIM-BOAS-001',visitId:'SIM-BRACHY',species:'dog',sex:'male',reproductiveStatus:'intact',breed:'French Bulldog / เฟรนช์ บูลด็อก',weight:'11.5',bcs:'6',asa:'III',patientProcedure:'Airway / soft-tissue procedure',procedure:'Airway / soft-tissue procedure',procedureTemplateId:'custom',caseWorkflowProfile:'routine',surgeon:'Demo Surgeon',anesthetist:'Demo Anesthetist',preopMentation:'BAR',preopHR:'120',preopRR:'32',preopTemp:'101.5',preopMM:'pink',preopCRT:'<2 sec',preopHydration:'normal',riskBrachycephalic:true,riskBOAS:true,riskDifficultAirway:true,riskUpperAirway:true}
    }
  };

  function toast(m){api()?.toast?.(m)}
  function currentScenario(){const id=state()?.simulationScenario;return scenarios[id]||scenarios.routine_dog}

  function buildDialog(){
    if($('simulationDialog'))return;
    const d=document.createElement('dialog');d.id='simulationDialog';d.className='simulation-dialog';d.setAttribute('aria-labelledby','simulationDialogTitle');
    d.innerHTML=`<div class="simulation-sheet">
      <div class="simulation-sheet-head"><div><small>V${runtimeVersion()} • PRACTICE SANDBOX</small><h2 id="simulationDialogTitle">🧪 Simulation Mode</h2><p>ทดลอง workflow ได้เต็มที่โดยไม่สร้าง Patient Master หรือ Archive จริง</p></div><button id="simulationDialogClose" class="btn light" type="button">✕</button></div>
      <div class="simulation-safety-note"><b>ข้อมูล Demo แยกจากเคสจริง</b><span>เริ่มได้เฉพาะเมื่อไม่มี current case ที่กำลังทำอยู่ • ยา/alert ใช้ engine จริงของ ANESVET เพื่อทดสอบ UX</span></div>
      <div class="simulation-scenarios">${Object.values(scenarios).map(x=>`<button class="simulation-scenario" type="button" data-sim-scenario="${x.id}"><span class="simulation-scenario-icon">${x.icon}</span><span><b>${esc(x.title)}</b><small>${esc(x.subtitle)}</small></span><span>→</span></button>`).join('')}</div>
      <button id="simulationCancel" class="btn" type="button">ยกเลิก</button>
    </div>`;
    document.body.appendChild(d);
    const close=()=>{try{d.close()}catch(_){d.removeAttribute('open')}};
    $('simulationDialogClose')?.addEventListener('click',close);$('simulationCancel')?.addEventListener('click',close);
    d.addEventListener('click',e=>{if(e.target===d)close();const b=e.target.closest?.('[data-sim-scenario]');if(!b)return;startScenario(b.dataset.simScenario);});
  }

  function openDialog(){buildDialog();const d=$('simulationDialog');if(!d)return;try{if(!d.open)d.showModal()}catch(_){d.setAttribute('open','')}}

  function buildEntrypoints(){
    const more=$('moreMenu');if(more&&!$('openSimulationBtn')){
      const b=document.createElement('button');b.id='openSimulationBtn';b.type='button';b.className='simulation-menu-btn';b.innerHTML='🧪 Simulation / ทดลองใช้';
      const advanced=more.querySelector('.advanced-menu');more.insertBefore(b,advanced||null);b.addEventListener('click',openDialog);
    }
    const page=$('patient');if(page&&!$('simulationWelcomeCard')){
      const card=document.createElement('section');card.id='simulationWelcomeCard';card.className='panel simulation-welcome-card';
      card.innerHTML='<div><span class="simulation-kicker">TRY WITHOUT A REAL CASE</span><b>อยากกดเล่นก่อนใช้งานจริง?</b><small>เปิด Demo patient แล้วลอง OR LIVE → Recovery → End Case ได้ โดยไม่เพิ่มผู้ป่วยหรือเคสเข้า Archive</small></div><button id="simulationWelcomeBtn" class="btn" type="button">🧪 ทดลองเคส</button>';
      page.insertBefore(card,page.firstElementChild?.nextSibling||page.firstElementChild||null);$('simulationWelcomeBtn')?.addEventListener('click',openDialog);
    }
  }

  function buildActiveBanner(){
    if($('simulationActiveBanner'))return;
    const anchor=document.querySelector('.case-strip');if(!anchor)return;
    const box=document.createElement('section');box.id='simulationActiveBanner';box.className='simulation-active-banner';box.hidden=true;
    box.innerHTML=`<div class="simulation-active-main"><span class="simulation-live-dot"></span><div><b id="simulationActiveTitle">SIMULATION</b><small>Demo only • ไม่บันทึกเข้า Patient Master / Cases Archive</small></div></div>
      <div class="simulation-quick-actions">
        <button id="simulationStableVitals" type="button">✓ Stable vitals</button>
        <button id="simulationLowMap" type="button">⚠ MAP 45</button>
        <button id="simulationJumpRecovery" type="button">→ Recovery</button>
        <button id="simulationJumpEndCase" type="button">→ End Case</button>
        <button id="simulationResetBtn" type="button">↻ Reset demo</button>
        <button id="simulationExitBtn" type="button">Exit</button>
      </div>`;
    anchor.insertAdjacentElement('afterend',box);
    $('simulationStableVitals')?.addEventListener('click',()=>fillVitals('stable'));
    $('simulationLowMap')?.addEventListener('click',()=>fillVitals('low-map'));
    $('simulationJumpRecovery')?.addEventListener('click',jumpRecovery);
    $('simulationJumpEndCase')?.addEventListener('click',jumpEndCase);
    $('simulationResetBtn')?.addEventListener('click',resetDemo);
    $('simulationExitBtn')?.addEventListener('click',exitDemo);
  }

  function setField(id,value,{blur=false}={}){
    const el=$(id);if(!el)return false;el.value=String(value);el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));if(blur){try{el.dispatchEvent(new FocusEvent('blur',{bubbles:true}))}catch(_){el.dispatchEvent(new Event('blur',{bubbles:true}))}}return true;
  }
  function fillVitals(mode){
    if(!active()){toast('Simulation Mode ยังไม่ได้เปิด');return}
    const s=state(),isCat=s?.species==='cat';
    const v=mode==='low-map'?{hr:isCat?170:105,rr:isCat?24:18,map:45,spo2:98,etco2:38,temp:100.5}:{hr:isCat?170:95,rr:isCat?24:16,map:75,spo2:99,etco2:38,temp:101.0};
    const map={hr:['hr','orHr'],rr:['rr','orRr'],map:['map','orMap'],spo2:['spo2','orSpo2'],etco2:['etco2','orEtco2'],temp:['temp','orTemp']};
    Object.entries(v).forEach(([k,val])=>map[k].forEach(id=>setField(id,val,{blur:k==='map'||k==='spo2'||k==='etco2'||k==='temp'})));
    api()?.save?.({reason:`simulation-vitals:${mode}`});toast(mode==='low-map'?'Simulation: ใส่ MAP 45 เพื่อทดลอง alert แล้ว':'Simulation: ใส่ stable vitals แล้ว');
  }

  function ensureDemoStarted(){
    const s=state();if(!s?.simulationMode)return false;const now=Date.now();
    s.patientSaved=true;s.caseStartedAt=s.caseStartedAt||now-20*60*1000;s.casePhase=s.casePhase==='setup'?'intraop':s.casePhase;
    s.caseIdentitySnapshot=s.caseIdentitySnapshot||{patientMasterId:'',patientName:s.patientName||'DEMO',hospitalId:s.hospitalId||'',visitId:s.visitId||'',species:s.species||'',microchip:'',weight:Number(s.weight)||null,capturedAt:s.caseStartedAt,simulation:true};
    s.timer=s.timer||{running:false,startedEpoch:null,elapsedMs:0};s.timer.running=false;s.timer.startedEpoch=null;s.timer.elapsedMs=Math.max(Number(s.timer.elapsedMs)||0,20*60*1000);return true;
  }
  function jumpRecovery(){if(!ensureDemoStarted())return;const s=state(),now=Date.now();s.casePhase='recovery';s.extubatedAt=s.extubatedAt||now-2*60*1000;s.recoveryStartedAt=s.recoveryStartedAt||now-2*60*1000;s.recoveryCompletedAt=null;api()?.audit?.('SIMULATION_JUMP','Jumped to Recovery for UX testing','System');api()?.save?.({reason:'simulation-jump-recovery'});api()?.setTab?.('recovery',{force:true});toast('Simulation: เปิด Recovery สำหรับทดลอง UX');}
  function jumpEndCase(){if(!ensureDemoStarted())return;const s=state(),now=Date.now();s.casePhase='recovery';s.extubatedAt=s.extubatedAt||now-7*60*1000;s.recoveryStartedAt=s.recoveryStartedAt||now-7*60*1000;s.recoveryCompletedAt=now;s.recoveryChecks=[true,true,true,true,true,true];api()?.audit?.('SIMULATION_JUMP','Jumped to End Case review for UX testing','System');api()?.save?.({reason:'simulation-jump-endcase'});api()?.setTab?.('endcase',{force:true});toast('Simulation: เปิด End Case review • checklist/sign-off ยังให้ลองเอง');}

  function startScenario(id){
    const app=api(),scenario=scenarios[id]||scenarios.routine_dog;if(!app?.simulation?.start){toast('Simulation engine unavailable');return}
    const r=app.simulation.start({id:scenario.id,label:scenario.title,seed:scenario.seed});
    if(!r?.ok){toast(r?.reason==='active-real-case'?'มี Current case อยู่ — จบ/สำรองเคสจริงก่อนเปิด Simulation':'เริ่ม Simulation ไม่สำเร็จ');return}
  }
  function resetDemo(){const app=api(),sc=currentScenario();if(!active()||!app?.simulation?.start)return;if(!confirm(`Reset ${sc.title} demo และเริ่มใหม่ตั้งแต่ Patient Setup?`))return;app.simulation.start({id:sc.id,label:sc.title,seed:sc.seed,replace:true});}
  function exitDemo(){if(!active())return;if(!confirm('ออกจาก Simulation และล้างข้อมูล Demo current case?\nPatient Master / Archive จริงจะไม่ถูกแตะ'))return;api()?.simulation?.exit?.();}

  function repaint(){
    const s=state(),on=!!s?.simulationMode,sc=currentScenario();document.body.classList.toggle('simulation-mode-active',on);
    const banner=$('simulationActiveBanner');if(banner)banner.hidden=!on;
    if($('simulationActiveTitle'))$('simulationActiveTitle').textContent=on?`SIMULATION • ${sc.title}`:'SIMULATION';
    const card=$('simulationWelcomeCard');if(card)card.hidden=on;
    const patientMaster=document.querySelector('.patient-master-panel');if(patientMaster){patientMaster.classList.toggle('simulation-disabled-panel',on);patientMaster.querySelectorAll('input,button,select').forEach(el=>{if(on){if(!el.dataset.simWasDisabled)el.dataset.simWasDisabled=el.disabled?'1':'0';el.disabled=true}else if('simWasDisabled' in el.dataset){el.disabled=el.dataset.simWasDisabled==='1';delete el.dataset.simWasDisabled}})}
    if(on){const status=$('patientSaveStatus');if(status&&!s.patientSaved){status.textContent='DEMO • NOT SAVED';status.className='status-pill warn'}}
    if(on&&s.caseLocked){
      const panel=$('finalArchiveAssurancePanel');if(panel)panel.hidden=true;
      const row=$('r26NextCase');if(row){const b=$('r26NextCaseButton');if(b){b.textContent='↻ เริ่ม Demo ใหม่';b.setAttribute('aria-label','Reset simulation demo')}}
    }
  }

  function patchFinalizedDialog(){const s=state();if(!s?.simulationMode)return;const d=$('caseFinalizedDialog');if(!d)return;const h=d.querySelector('h2');if(h)h.textContent='✓ Simulation complete';if($('caseFinalizedSummary'))$('caseFinalizedSummary').textContent='Demo case จบแล้ว • ไม่มีข้อมูลถูกบันทึกเข้า Cases / Archive';const note=d.querySelector('.finalization-success-note');if(note)note.textContent='Simulation Mode ไม่สร้าง Final Archive จริง • กดเริ่ม Demo ใหม่หรือ Exit เพื่อกลับสู่เคสจริง';if($('finalizedArchiveAssurance'))$('finalizedArchiveAssurance').hidden=true;if($('finalizedViewArchiveBtn'))$('finalizedViewArchiveBtn').hidden=true;if($('finalizedRetryArchiveBtn'))$('finalizedRetryArchiveBtn').hidden=true;const n=$('finalizedNewCaseBtn');if(n){n.disabled=false;n.textContent='↻ Start demo again';}}

  function boot(){buildDialog();buildEntrypoints();buildActiveBanner();repaint();patchFinalizedDialog();
    document.addEventListener('anesvet:simulation-complete',()=>{setTimeout(()=>{repaint();patchFinalizedDialog()},0)});
    document.addEventListener('click',e=>{if(e.target.closest?.('.workflow-tabs,[data-mobile-tab],#endcase,#patient'))setTimeout(repaint,25)},true);
    const onPageShow=()=>{repaint();patchFinalizedDialog()};window.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',onPageShow);
    const simButton=$('finalizedNewCaseBtn');simButton?.addEventListener('click',e=>{if(!active())return;e.stopImmediatePropagation();e.preventDefault();const sc=currentScenario();api()?.simulation?.start?.({id:sc.id,label:sc.title,seed:sc.seed,replace:true});},true);
    const next=$('r26NextCaseButton');next?.addEventListener('click',e=>{if(!active())return;e.stopImmediatePropagation();e.preventDefault();resetDemo();},true);
    window.AnesvetSimulation=Object.freeze({get version(){return runtimeVersion()},active,open:openDialog,start:startScenario,reset:resetDemo,exit:exitDemo,scenarios:()=>JSON.parse(JSON.stringify(scenarios))});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
