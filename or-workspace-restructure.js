/* ANESVET V17.11.3 — OR LIVE workspace restructure.
 * Presentation/navigation only. Existing clinical fields remain authoritative.
 * Moves existing DOM controls into four task-based workspaces without cloning state. */
(function(root){
'use strict';
const VERSION='17.11.3';
const $=id=>document.getElementById(id);
const q=(sel,scope=document)=>scope?.querySelector?.(sel)||null;
const qa=(sel,scope=document)=>[...(scope?.querySelectorAll?.(sel)||[])];
let current='monitor';

function make(tag,attrs={},html=''){
  const el=document.createElement(tag);
  Object.entries(attrs).forEach(([k,v])=>{
    if(k==='class')el.className=v;
    else if(k==='text')el.textContent=v;
    else if(k.startsWith('data-'))el.setAttribute(k,v);
    else el.setAttribute(k,v);
  });
  if(html)el.innerHTML=html;
  return el;
}
function labelFor(id){return $(id)?.closest?.('label')||null}
function dispatchInput(el){
  if(!el)return;
  el.dispatchEvent(new Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}));
}
function safeNumber(v,fallback=0){const n=Number(v);return Number.isFinite(n)?n:fallback}
function clamp(v,min,max){return Math.min(max,Math.max(min,v))}

function renderHardware(){
  const vap=$('orVaporizer'),o2=$('orO2'),vr=$('orMonitorVaporizerRange'),fr=$('orMonitorO2Range');
  const vv=safeNumber(vap?.value,0),ov=safeNumber(o2?.value,0);
  if(vr)vr.value=String(clamp(vv,0,5));
  if(fr)fr.value=String(clamp(ov,0,10));
  const read=$('orMonitorVaporizerReadout');if(read)read.textContent=vv<=0?'OFF':`${vv.toFixed(1)}%`;
  const knob=$('orMonitorVaporizerKnob');if(knob)knob.style.setProperty('--or-vap-angle',`${-135+(clamp(vv,0,5)/5)*270}deg`);
  const flow=$('orMonitorO2Float');if(flow)flow.style.setProperty('--or-o2-level',`${(clamp(ov,0,10)/10)*100}%`);
  const flowRead=$('orMonitorO2Readout');if(flowRead)flowRead.textContent=`${ov.toFixed(1)} L/min`;
}
function bindHardware(){
  const vap=$('orVaporizer'),o2=$('orO2'),vr=$('orMonitorVaporizerRange'),fr=$('orMonitorO2Range');
  vr?.addEventListener('input',()=>{if(!vap)return;vap.value=Number(vr.value).toFixed(1);dispatchInput(vap);renderHardware()});
  fr?.addEventListener('input',()=>{if(!o2)return;o2.value=Number(fr.value).toFixed(1);dispatchInput(o2);renderHardware()});
  vap?.addEventListener('input',renderHardware);
  o2?.addEventListener('input',renderHardware);
  renderHardware();
}
function setStep(kind,delta){
  const el=$(kind==='vap'?'orVaporizer':'orO2');if(!el)return;
  const max=kind==='vap'?10:20;
  const next=clamp(safeNumber(el.value,0)+delta,0,max);
  el.value=next.toFixed(1);dispatchInput(el);renderHardware();
}

function updateBadges(){
  const airway=$('orWorkspaceAirwayBadge');
  if(airway){
    const ett=String($('airwayEttSize')?.value||'').trim();
    const status=String($('airwayStatus')?.textContent||'').trim();
    airway.textContent=ett?`ETT ${ett}`:(status==='RECORDED'?'TIME SAVED':'PENDING');
    airway.classList.toggle('done',!!ett);
  }
  const support=$('orWorkspaceSupportBadge');
  if(support){
    const mode=String($('airwayVentMode')?.value||'').trim();
    const fluid=String($('orFluidSummary')?.textContent||'').trim();
    support.textContent=mode||((fluid&&fluid!=='Not set')?'FLUID SET':'');
    support.hidden=!support.textContent;
  }
  const meds=$('orWorkspaceMedsBadge');
  if(meds){
    const note=String($('orPrimaryDocumentationNote')?.textContent||'');
    const m=note.match(/(\d+)\s+planned medication/i);
    const n=m?Number(m[1]):0;
    meds.textContent=n?`${n} REVIEW`:'';
    meds.hidden=!n;
  }
}

function setView(view,{scroll=false}={}){
  if(!['monitor','support','airway','meds'].includes(view))view='monitor';
  current=view;
  const host=$('orWorkspaceHost');if(!host)return false;
  host.dataset.view=view;
  qa('[data-or-workspace-panel]',host).forEach(p=>{p.hidden=p.dataset.orWorkspacePanel!==view});
  qa('[data-or-workspace]', $('orWorkspaceNav')).forEach(b=>{
    const active=b.dataset.orWorkspace===view;
    b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;
  });
  if(view==='support'){
    const f=$('orFluidPanelDetails');if(f)f.open=true;
  }
  if(view==='airway'){
    const a=$('orAirwayPanelDetails');if(a)a.open=true;
  }
  updateBadges();
  if(scroll){
    requestAnimationFrame(()=>{
      if(root.ANESVET_MOBILE_OR_OWNER?.editing?.())return;
      try{$('orWorkspaceNav')?.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){}
    });
  }
  return true;
}
function buildMonitorControls(){
  const card=make('section',{id:'orMonitorAnesthesiaControls',class:'or-monitor-anesthesia-controls'});
  card.innerHTML=`<div class="or-workspace-section-head"><div><span>RUNNING CONTROLS</span><h3>Anesthesia controls</h3><small>ค่าที่ปรับระหว่าง monitoring • บันทึกลง field เดิมของเคสทันที</small></div></div>
  <div class="or-monitor-control-grid">
    <article class="or-depth-control"><div class="or-control-title"><b>Depth</b><small>anesthetic depth</small></div><div id="orDepthSlot"></div></article>
    <article class="or-vaporizer-control"><div class="or-control-title"><b>Vaporizer</b><small>หมุน/เลื่อนเพื่อปรับ</small></div><div class="or-vap-dial-wrap"><input id="orMonitorVaporizerRange" type="range" min="0" max="5" step="0.1" value="0" aria-label="Vaporizer percent"><div id="orMonitorVaporizerKnob" class="or-vap-knob" aria-hidden="true"><span>ISO</span><strong id="orMonitorVaporizerReadout">OFF</strong></div></div><div class="or-control-stepper"><button type="button" id="orVapMinus" aria-label="Decrease vaporizer">−</button><div id="orVaporizerSlot"></div><button type="button" id="orVapPlus" aria-label="Increase vaporizer">+</button></div></article>
    <article class="or-o2-control"><div class="or-control-title"><b>O₂ Flow</b><small id="orMonitorO2Readout">0.0 L/min</small></div><div class="or-flowmeter"><input id="orMonitorO2Range" type="range" min="0" max="10" step="0.1" value="0" aria-label="Oxygen flow liters per minute"><div class="or-flow-tube"><div id="orMonitorO2Float" class="or-flow-float"></div></div><div class="or-flow-scale"><span>10</span><span>5</span><span>0</span></div></div><div class="or-control-stepper"><button type="button" id="orO2Minus" aria-label="Decrease oxygen flow">−</button><div id="orO2Slot"></div><button type="button" id="orO2Plus" aria-label="Increase oxygen flow">+</button></div></article>
  </div><details id="orMonitorAdvancedBp" class="or-monitor-advanced"><summary>Optional BP values • SAP / DAP</summary><div id="orAdvancedBpSlot" class="or-monitor-bp-grid"></div></details>`;
  const depth=labelFor('orDepth'),vap=labelFor('orVaporizer'),o2=labelFor('orO2'),sap=labelFor('orSap'),dap=labelFor('orDap');
  if(depth){depth.classList.add('or-authoritative-control');q('#orDepthSlot',card).appendChild(depth)}
  if(vap){vap.classList.add('or-authoritative-control');q('#orVaporizerSlot',card).appendChild(vap)}
  if(o2){o2.classList.add('or-authoritative-control');q('#orO2Slot',card).appendChild(o2)}
  if(sap)q('#orAdvancedBpSlot',card).appendChild(sap);
  if(dap)q('#orAdvancedBpSlot',card).appendChild(dap);
  const legacyVent=labelFor('orVentilation');if(legacyVent){legacyVent.hidden=true;legacyVent.classList.add('or-compat-control')}
  card.querySelector('#orVapMinus')?.addEventListener('click',()=>setStep('vap',-.1));
  card.querySelector('#orVapPlus')?.addEventListener('click',()=>setStep('vap',.1));
  card.querySelector('#orO2Minus')?.addEventListener('click',()=>setStep('o2',-.1));
  card.querySelector('#orO2Plus')?.addEventListener('click',()=>setStep('o2',.1));
  return card;
}
function buildSupport(){
  const panel=make('section',{'data-or-workspace-panel':'support',class:'or-workspace-panel or-support-workspace'});
  panel.innerHTML=`<div class="or-workspace-section-head"><div><span>SUPPORT</span><h2>Fluids & ventilation</h2><small>ตั้งค่าระหว่างเคสเมื่อผู้ป่วย stable • ไม่ผูกกับ Intubation timestamp</small></div></div>
  <section class="panel or-ventilator-workspace"><div class="section-heading"><div><h2>Ventilator / PPV</h2><p>เลือก mode ก่อน แล้วบันทึก setting ที่ใช้จริง</p></div></div><div id="orVentModeSlot" class="or-support-mode"></div><div id="orVentSettingsSlot"></div></section>
  <div id="orFluidWorkspaceSlot"></div>`;
  const mode=labelFor('airwayVentMode'),settings=$('ventilatorFields'),fluid=$('orFluidPanelDetails');
  if(mode)q('#orVentModeSlot',panel).appendChild(mode);
  if(settings)q('#orVentSettingsSlot',panel).appendChild(settings);
  if(fluid){fluid.open=true;q('#orFluidWorkspaceSlot',panel).appendChild(fluid)}
  return panel;
}
function buildAirway(){
  const panel=make('section',{'data-or-workspace-panel':'airway',class:'or-workspace-panel or-airway-workspace'});
  panel.innerHTML=`<div class="or-workspace-section-head"><div><span>AIRWAY DETAILS</span><h2>ET tube & intubation details</h2><small>Intubation time ถูกบันทึกจาก quick action แยกต่างหาก • หน้านี้ไว้ลงรายละเอียดภายหลัง</small></div></div><div id="orAirwayWorkspaceSlot"></div>`;
  const airway=$('orAirwayPanelDetails');
  if(airway){
    airway.open=true;
    const title=q('.or-collapsible-summary b',airway);if(title)title.textContent='🫁 ET tube / Airway details';
    const desc=q('.section-heading p',airway);if(desc)desc.textContent='บันทึก ETT size / depth / cuff / difficulty / circuit หลังผู้ป่วย stable';
    q('#orAirwayWorkspaceSlot',panel).appendChild(airway);
  }
  return panel;
}
function buildMeds(){
  const panel=make('section',{'data-or-workspace-panel':'meds',class:'or-workspace-panel or-meds-workspace'});
  panel.innerHTML=`<div class="or-workspace-section-head"><div><span>MEDICATIONS</span><h2>Medication documentation</h2><small>ลง actual dose / review planned medications เมื่อมีเวลา • ไม่บล็อก milestone ถัดไป</small></div></div><div id="orQuickMedSlot"></div><div id="orMedicationQueueSlot"></div><div id="orGuardianSlot"></div>`;
  const quick=q('.or-quick-med-strip'),queue=$('orMedicationQueue'),guardian=$('orDocumentationGuardian');
  if(quick)q('#orQuickMedSlot',panel).appendChild(quick);
  if(queue){queue.hidden=false;q('#orMedicationQueueSlot',panel).appendChild(queue)}
  if(guardian)q('#orGuardianSlot',panel).appendChild(guardian);
  return panel;
}
function buildMonitor(){
  const panel=make('section',{'data-or-workspace-panel':'monitor',class:'or-workspace-panel or-monitor-workspace'});
  panel.innerHTML=`<div class="or-workspace-section-head or-monitor-heading"><div><span>MONITOR</span><h2>Vitals & anesthesia level</h2><small>หน้าหลักระหว่าง OR • บันทึก vitals และปรับยาสลบจากจุดเดียว</small></div></div>`;
  const vf=$('orVitalsFocus'),vitals=q('#orlive .or-vital-grid');
  if(vf){vf.hidden=false;panel.appendChild(vf)}
  if(vitals)panel.appendChild(vitals);
  panel.appendChild(buildMonitorControls());
  return panel;
}

function buildInductionQuickStrip(){
  const section=make('section',{id:'orInductionQuickStrip',class:'or-induction-quick-strip','aria-label':'Induction timestamp and prepared medications'});
  section.innerHTML=`<div class="or-induction-quick-head">
    <div><span>INDUCTION</span><b>Induction = prepared induction drugs given</b><small>กด Induction แล้วถือว่ายา Induction ที่เตรียมไว้ให้พร้อมกัน ณ เวลานี้ • แตะชื่อยาทีหลังเพื่อทบทวน actual / route / เวลา</small></div>
    <button id="orQuickInductionTimestampBtn" class="or-induction-timestamp-btn" type="button">▶ Induction</button>
  </div>
  <div id="orPreparedInductionMeds" class="or-prepared-induction-meds"></div>
  <div class="or-induction-quick-foot"><span id="orInductionQuickHint">Prepared induction drugs only</span><button id="orInductionOpenMedsBtn" class="btn" type="button">Meds details</button></div>`;
  section.querySelector('#orQuickInductionTimestampBtn')?.addEventListener('click',()=>{
    const api=root.ANESVET_MEDICATION_WORKSPACE,status=api?.inductionQuickStatus?.();
    if(status?.started)return;
    const owner=root.ANESVET_OR_LIVE_INSTANCE;
    if(owner?.handleOrWorkflowAction)owner.handleOrWorkflowAction('start-induction');
    else{
      const primary=$('orPrimaryActionBtn');
      if(primary?.dataset.action==='start-induction')primary.click();
    }
  });
  section.querySelector('#orPreparedInductionMeds')?.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-induction-drug-id]');if(!b||b.disabled)return;
    const api=root.ANESVET_MEDICATION_WORKSPACE;
    if(!api?.recordPreparedInductionNow)return;
    b.disabled=true;b.classList.add('saving');
    try{api.recordPreparedInductionNow(b.dataset.inductionDrugId)}
    finally{setTimeout(renderInductionQuickStrip,0)}
  });
  section.querySelector('#orInductionOpenMedsBtn')?.addEventListener('click',()=>setView('meds',{scroll:true}));
  return section;
}
function renderInductionQuickStrip(){
  const section=$('orInductionQuickStrip');if(!section)return;
  const api=root.ANESVET_MEDICATION_WORKSPACE,status=api?.inductionQuickStatus?.();
  const btn=$('orQuickInductionTimestampBtn'),list=$('orPreparedInductionMeds'),hint=$('orInductionQuickHint');
  if(!status){
    if(list)list.innerHTML='<small>Medication workspace is still initializing…</small>';
    return;
  }
  const action=$('orPrimaryActionBtn')?.dataset.action||'',rows=status.rows||[],pending=rows.filter(r=>!r.given);
  const activePhase=['start-induction','airway','surgery-start'].includes(action);
  section.hidden=!activePhase;
  q('#orlive .or-primary-flow')?.classList.toggle('or-induction-owned',action==='start-induction'&&!status.started);
  if(btn){
    btn.disabled=!!status.started;
    btn.classList.toggle('done',!!status.started);
    btn.textContent=status.started?`✓ Induction ${status.clock||''}`:'▶ Induction';
  }
  if(hint)hint.textContent=status.started?(pending.length?`${pending.length} medication detail${pending.length===1?'':'s'} pending • default time = Induction`:'Induction medication details complete'):'กด Induction = ถือว่ายาที่เตรียมไว้ในหมวด Induction ให้แล้วพร้อมกัน';
  if(!list)return;
  list.replaceChildren();
  if(!rows.length){
    const empty=make('div',{class:'or-induction-empty',text:'ไม่มี prepared medication ในหมวด Induction ของ frozen case plan'});
    list.appendChild(empty);return;
  }
  rows.forEach(row=>{
    const b=make('button',{type:'button',class:`or-prepared-induction-drug ${row.given?'given':''}`,'data-induction-drug-id':String(row.id)});
    b.disabled=!status.started||!!row.given;
    b.classList.toggle('pending-details',!!row.provisional&&!row.given);
    const name=make('b',{text:row.name});
    const detail=row.given?`✓ Details saved ${row.given.clock||''}`:row.provisional?`Given ${row.provisional.clock||status.clock||''} • tap to review details`:(Number.isFinite(row.calculatedMl)?`${Number(row.calculatedMl.toFixed(3))} mL • will be marked given at Induction`:'Prepared • will be marked given at Induction');
    const small=make('small',{text:detail});
    b.append(name,small);
    if(!status.started)b.title='กด Induction ก่อน';
    list.appendChild(b);
  });
}

function init(){
  const page=$('orlive');if(!page||$('orWorkspaceHost'))return;
  const sticky=$('orStickyMini'),vitals=$('orVitalsFocus');
  const anchor=sticky?.nextSibling||vitals||page.firstChild;
  const nav=make('nav',{id:'orWorkspaceNav',class:'or-workspace-nav','aria-label':'OR LIVE workspace'});
  nav.innerHTML=`<button type="button" data-or-workspace="monitor" class="active" aria-selected="true"><span>Monitor</span><small>Vitals + gas</small></button>
  <button type="button" data-or-workspace="support" aria-selected="false"><span>Support</span><small>Fluid + vent</small><b id="orWorkspaceSupportBadge" class="or-workspace-badge" hidden></b></button>
  <button type="button" data-or-workspace="airway" aria-selected="false"><span>Airway</span><small>ET tube</small><b id="orWorkspaceAirwayBadge" class="or-workspace-badge">PENDING</b></button>
  <button type="button" data-or-workspace="meds" aria-selected="false"><span>Meds</span><small>Actual dose</small><b id="orWorkspaceMedsBadge" class="or-workspace-badge" hidden></b></button>`;
  page.insertBefore(nav,anchor);

  const primary=q('#orlive .or-primary-flow'),safety=$('orCoreSafety'),phase=$('orCorePhaseStrip');
  if(primary)nav.after(primary);
  const inductionQuick=buildInductionQuickStrip();
  if(primary)primary.after(inductionQuick);else nav.after(inductionQuick);
  if(safety)inductionQuick.after(safety);
  if(phase)phase.classList.add('or-phase-strip-secondary');

  const host=make('div',{id:'orWorkspaceHost',class:'or-workspace-host'});
  (safety||inductionQuick||primary||nav).after(host);
  host.appendChild(buildMonitor());
  host.appendChild(buildSupport());
  host.appendChild(buildAirway());
  host.appendChild(buildMeds());

  // Old combined status row is redundant with Monitor's due/last state.
  q('#orlive .or-status-row')?.classList.add('or-redundant-status');
  // Legacy all-in-one airway setup is intentionally retired from the active workflow.
  const oldSetup=$('orAirwaySetupDialog');if(oldSetup){oldSetup.hidden=true;oldSetup.classList.remove('is-open')}

  nav.addEventListener('click',e=>{const b=e.target.closest?.('[data-or-workspace]');if(b)setView(b.dataset.orWorkspace,{scroll:false})});
  nav.addEventListener('keydown',e=>{
    const buttons=qa('[data-or-workspace]',nav),i=buttons.indexOf(document.activeElement);
    if(i<0||!['ArrowLeft','ArrowRight'].includes(e.key))return;
    e.preventDefault();const next=(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();setView(buttons[next].dataset.orWorkspace);
  });

  bindHardware();
  ['airwayStatus','orAirwaySummary','orFluidSummary','orPrimaryDocumentationNote'].forEach(id=>{
    const el=$(id);if(el)new MutationObserver(updateBadges).observe(el,{childList:true,subtree:true,characterData:true,attributes:true});
  });
  ['airwayEttSize','airwayVentMode'].forEach(id=>$(id)?.addEventListener(id==='airwayVentMode'?'change':'input',updateBadges));
  const primaryBtn=$('orPrimaryActionBtn');
  if(primaryBtn)new MutationObserver(()=>{renderInductionQuickStrip();updateBadges()}).observe(primaryBtn,{childList:true,subtree:true,attributes:true,attributeFilter:['data-action','disabled']});
  document.addEventListener('anesvet:drug-administration-changed',()=>{renderInductionQuickStrip();updateBadges()});
  document.addEventListener('anesvet:induction-provisional-changed',()=>{renderInductionQuickStrip();updateBadges()});
  updateBadges();renderInductionQuickStrip();
  setView('monitor');
}
const api=Object.freeze({version:VERSION,init,setView,getView:()=>current,updateBadges,renderInductionQuickStrip});
root.ANESVET_OR_WORKSPACE=api;
if(root.ANESVET_LIFECYCLE_COORDINATOR?.ready)root.ANESVET_LIFECYCLE_COORDINATOR.ready(init);
else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})(window);
