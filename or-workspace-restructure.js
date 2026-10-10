/* ANESVET V17.14.13 — OR LIVE workspaces and machine setting documentation.
 * Native clinical fields remain authoritative; saves are handled by the app owner.
 * Moves existing DOM controls into four task-based workspaces without cloning state. */
(function(root){
'use strict';
const VERSION='17.14.13';
const $=id=>document.getElementById(id);
const q=(sel,scope=document)=>scope?.querySelector?.(sel)||null;
root.ANESVET_PRESENTATION_OWNERSHIP?.claim?.('orlive.layout','or-workspace-v17130');
const qa=(sel,scope=document)=>[...(scope?.querySelectorAll?.(sel)||[])];
let current='monitor',lastSecondary='fluid';

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

function choiceStrip(values,kind){
  return values.map(v=>`<button type="button" class="or-choice-chip" data-${kind}-value="${v}">${v===0?(kind==='vap'?'0 • OFF':'0'):(Number.isInteger(v)?String(v):v.toFixed(1))}</button>`).join('');
}
function setControlValue(kind,value){
  const el=$(kind==='vap'?'orVaporizer':'orO2');if(!el)return;
  const max=kind==='vap'?5:10;
  const next=clamp(safeNumber(value,0),0,max);
  el.value=next.toFixed(1);dispatchInput(el);renderHardware();
}
function renderHardware(){
  const vap=$('orVaporizer'),o2=$('orO2');
  const vv=vap?.value.trim()===''?null:Number(vap?.value),ov=o2?.value.trim()===''?null:Number(o2?.value);
  const read=$('orMonitorVaporizerReadout');if(read)read.textContent=vv===null||!Number.isFinite(vv)?'ยังไม่ระบุ':vv===0?'0.0% • OFF':root.ANESVET_OR_DOMAIN.gasValueText('vaporizer',vv);
  const flowRead=$('orMonitorO2Readout');if(flowRead)flowRead.textContent=ov===null||!Number.isFinite(ov)?'ยังไม่ระบุ':root.ANESVET_OR_DOMAIN.gasValueText('o2flow',ov);
  for(const [kind,value]of[['vap',vv],['o2',ov]])qa(`[data-${kind}-value]`).forEach(b=>{const active=value!==null&&Number.isFinite(value)&&Math.abs(Number(b.dataset[kind+'Value'])-value)<0.00001;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
  root.AnesvetApp?.gasSettings?.render?.();
}
function bindHardware(){
  const vap=$('orVaporizer'),o2=$('orO2');
  qa('[data-vap-value]').forEach(b=>b.addEventListener('click',()=>setControlValue('vap',b.dataset.vapValue)));
  qa('[data-o2-value]').forEach(b=>b.addEventListener('click',()=>setControlValue('o2',b.dataset.o2Value)));
  vap?.addEventListener('input',renderHardware);
  o2?.addEventListener('input',renderHardware);
  $('orGasSaveBtn')?.addEventListener('click',()=>root.AnesvetApp?.gasSettings?.record?.());
  renderHardware();
}
function setStep(kind,delta){
  const el=$(kind==='vap'?'orVaporizer':'orO2');if(!el)return;
  const max=kind==='vap'?5:10;
  const next=clamp(safeNumber(el.value,0)+delta,0,max);
  setControlValue(kind,next);
}
function buildCompactSummary(){
  if($('orCompactSummaryRow'))return $('orCompactSummaryRow');
  const row=make('div',{id:'orCompactSummaryRow',class:'or-compact-summary-row',role:'status','aria-live':'polite'});
  row.innerHTML=`<span id="orCompactWeight" class="or-compact-chip">BW — kg</span>
  <span id="orCompactAsa" class="or-compact-chip">ASA —</span>
  <span id="orCompactProcedure" class="or-compact-chip wide">Procedure —</span>
  <span id="orCompactAllergy" class="or-compact-chip wide" hidden>Allergy —</span>
  <span id="orCompactRisk" class="or-compact-chip wide warn" hidden>Risk —</span>`;
  return row;
}
function syncCompactSummary(){
  const block=q('#orlive .or-patient-block');
  if(block&&!$('orCompactSummaryRow')) block.appendChild(buildCompactSummary());
  const weightRaw=String($('weight')?.value||'').trim();
  const weight=weightRaw?`${Number(weightRaw).toFixed(1).replace(/\.0$/,'')} kg`:'— kg';
  const asa=String($('orAsaBadge')?.textContent||$('asa')?.value||'—').trim()||'—';
  const procedure=String($('procedure')?.value||$('patientProcedure')?.value||$('orProcedureLine')?.textContent||'').trim().replace(/^Procedure:\s*/i,'')||'—';
  const allergy=String($('patientAllergies')?.value||'').trim();
  const riskLine=$('orRiskLine');
  const risk=(!riskLine?.hidden?String(riskLine?.textContent||'').trim().replace(/^⚠\s*/,''):'')||'';
  if($('orCompactWeight')) $('orCompactWeight').textContent=`BW ${weight}`;
  if($('orCompactAsa')) $('orCompactAsa').textContent=asa.startsWith('ASA')?asa:`ASA ${asa}`;
  if($('orCompactProcedure')) $('orCompactProcedure').textContent=`Procedure ${procedure}`;
  if($('orCompactAllergy')){ $('orCompactAllergy').hidden=!allergy; $('orCompactAllergy').textContent=`Allergy ${allergy||'—'}`; }
  if($('orCompactRisk')){ $('orCompactRisk').hidden=!risk; $('orCompactRisk').textContent=`Risk ${risk||'—'}`; }
}


function syncSafetyCompact(){
  const box=$('orCoreSafety');if(!box)return;
  const title=String($('orCoreSafetyTitle')?.textContent||'').trim().toLowerCase();
  const summary=String($('orCoreSafetySummary')?.textContent||'').trim().toLowerCase();
  const alerts=String($('orAlertCount')?.textContent||'').trim();
  const clear=(title.includes('no active')||title.includes('no problem'))&&(summary.includes('no active')||summary.includes('no alert')||summary==='')&&!/\b[1-9]\d*\s*alert/i.test(alerts);
  box.classList.toggle('or-safety-clear',clear);
  box.classList.toggle('or-safety-active',!clear);
}
function bindVentModeButtons(panel){
  // The authoritative select is already inside this still-detached panel.
  // Document lookup cannot see it until host.appendChild(buildVent()) completes.
  const select=q('#airwayVentMode',panel);if(!select||!panel)return;
  const strip=q('#orVentModeButtons',panel);if(!strip)return;
  const buttons=qa('[data-vent-mode]',strip);
  const render=()=>{buttons.forEach(b=>{const active=b.dataset.ventMode===select.value;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active?'true':'false')});const status=q('#orVentModeFeedback',panel);if(status){status.textContent=select.value?`Selected • ${select.value}`:'Choose ventilation mode';status.classList.toggle('selected',!!select.value)}};
  const apply=mode=>{
    if(!mode)return;
    const owner=root.ANESVET_OR_LIVE_INSTANCE;
    if(typeof owner?.setVentilationMode==='function')owner.setVentilationMode(mode);
    else{
      select.value=mode;
      const mirror=$('orVentilation');if(mirror)mirror.value=mode;
      const master=$('ventilation');if(master)master.value=mode;
      if($('ventilatorFields'))$('ventilatorFields').hidden=!['Manual PPV','Mechanical ventilation'].includes(mode);
      select.dispatchEvent(new Event('change',{bubbles:true}));
    }
    render();
    updateBadges();
    if(['Manual PPV','Mechanical ventilation'].includes(mode)){
      setView('vent');
      requestAnimationFrame(()=>{
        q('#orVentSettingsSlot',panel)?.scrollIntoView?.({block:'nearest',behavior:'smooth'});
        q('#airwayVentRr',panel)?.focus?.({preventScroll:true});
      });
    }
  };
  buttons.forEach(b=>b.setAttribute('aria-pressed','false'));
  strip.addEventListener('click',e=>{const b=e.target.closest?.('[data-vent-mode]');if(!b)return;e.preventDefault();e.stopPropagation();apply(b.dataset.ventMode)});
  select.addEventListener('change',render);
  document.addEventListener('anesvet:ventilation-mode-changed',render);
  render();
}
function secondaryHeader(kicker,title,help){
  return `<div class="or-workspace-section-head compact"><div><span>${kicker}</span><h2>${title}</h2><small>${help}</small></div><button type="button" class="or-workspace-back" data-or-back-monitor>← Monitor</button></div>`;
}
function updateBadges(){
  const airway=$('orWorkspaceAirwayBadge');
  if(airway){
    const ett=String($('airwayEttSize')?.value||'').trim();
    const milestone=root.ANESVET_OR_LIVE_INSTANCE?.procedureMilestoneEvent?.('Intubation');
    airway.textContent=ett?`ETT ${ett}`:(milestone?.clock?milestone.clock:'PENDING');
    airway.classList.toggle('done',!!ett||!!milestone);
    if($('orAirwayTimestamp'))$('orAirwayTimestamp').textContent=milestone?.clock?`Intubation ${milestone.clock}`:'Intubation time not recorded';
  }
  const fluidBadge=$('orWorkspaceFluidBadge');
  if(fluidBadge){
    const fluid=String($('orFluidSummary')?.textContent||'').trim();
    fluidBadge.textContent=(fluid&&fluid!=='Not set')?'SET':'';
    fluidBadge.hidden=!fluidBadge.textContent;
  }
  const ventBadge=$('orWorkspaceVentBadge');
  if(ventBadge){
    const mode=String($('airwayVentMode')?.value||'').trim();
    ventBadge.textContent=mode?mode.replace('Mechanical ventilation','MECH').replace('Manual PPV','PPV').replace('Spontaneous','SPONT'):'';
    ventBadge.hidden=!ventBadge.textContent;
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
  if(!['monitor','fluid','vent','airway','meds'].includes(view))view='monitor';
  const host=$('orWorkspaceHost');if(!host)return false;
  const restoreNav=view==='monitor'&&host.contains(document.activeElement);
  current=view;if(view!=='monitor')lastSecondary=view;
  host.dataset.view=view;
  host.hidden=view==='monitor';
  qa('[data-or-workspace-panel]',host).forEach(p=>{p.hidden=p.dataset.orWorkspacePanel!==view});
  qa('[data-or-workspace]', $('orWorkspaceNav')).forEach(b=>{
    const active=b.dataset.orWorkspace===view;
    b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));b.tabIndex=b.dataset.orWorkspace===lastSecondary?0:-1;
  });
  if(restoreNav)q(`[data-or-workspace="${lastSecondary}"]`,$('orWorkspaceNav'))?.focus({preventScroll:true});
  if(view==='fluid'){$('orFluidPanelDetails')?.setAttribute('open','')}
  if(view==='airway'){$('orAirwayPanelDetails')?.setAttribute('open','')}
  updateBadges();
  if(scroll){
    requestAnimationFrame(()=>{
      if(root.ANESVET_MOBILE_OR_OWNER?.editing?.())return;
      const target=view==='monitor'?($('orVitalsFocus')||q('#orlive .or-vital-grid')):$('orWorkspaceNav');
      try{target?.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){}
    });
  }
  return true;
}
function buildMonitorControls(){
  const card=make('section',{id:'orMonitorAnesthesiaControls',class:'or-monitor-anesthesia-controls or-monitor-inline'});
  card.innerHTML=`<div class="or-monitor-inline-head"><b>Anesthesia</b><small>Depth • Vaporizer • O₂</small></div>
  <div class="or-monitor-control-grid compact">
    <article class="or-depth-control"><div class="or-control-title"><b>Depth</b><small>anesthetic depth</small></div><div id="orDepthSlot"></div></article>
    <article class="or-vaporizer-control"><div class="or-control-title"><b>Vaporizer</b><small id="orMonitorVaporizerReadout">OFF</small></div><div class="or-choice-strip" id="orVaporizerChoices">${choiceStrip([5,4.5,4,3.5,3,2.5,2,1.5,1,0.5,0],'vap')}</div><details class="or-setting-exact"><summary>กรอกค่าเอง (%)</summary><div id="orVaporizerSlot"></div></details></article>
    <article class="or-o2-control"><div class="or-control-title"><b>O₂ flow</b><small id="orMonitorO2Readout">Off</small></div><div class="or-choice-strip" id="orO2Choices">${choiceStrip([3,2.5,2,1.5,1,0.5,0],'o2')}</div><details class="or-setting-exact"><summary>กรอกค่าเอง (L/min)</summary><div id="orO2Slot"></div></details></article>
  </div><div class="or-gas-documentation"><p id="orGasPending" role="status" aria-live="polite"></p><details class="or-setting-note"><summary>หมายเหตุ (ถ้ามี)</summary><label>หมายเหตุการปรับค่า<input id="orGasNote" type="text" maxlength="500" placeholder="เหตุผล / รายละเอียด"></label></details><button id="orGasSaveBtn" type="button" disabled>บันทึกการปรับยาสลบ / O₂</button><small>บันทึกค่าเครื่องแยกจาก Vitals • ค่าที่เลือกต้องตรงกับเครื่องจริง</small><details id="orGasHistoryDetails"><summary>ประวัติการปรับค่าเครื่อง (<span id="orGasHistoryCount">0</span>)</summary><div id="orGasHistory"></div></details></div><details id="orMonitorAdvancedBp" class="or-monitor-advanced"><summary>SAP / DAP (optional)</summary><div id="orAdvancedBpSlot" class="or-monitor-bp-grid"></div></details>`;
  const depth=labelFor('orDepth'),vap=labelFor('orVaporizer'),o2=labelFor('orO2'),sap=labelFor('orSap'),dap=labelFor('orDap');
  if(depth){depth.classList.add('or-authoritative-control');q('#orDepthSlot',card).appendChild(depth)}
  if(vap){vap.classList.add('or-authoritative-control');$('orVaporizer').min='0';$('orVaporizer').max='5';$('orVaporizer').step='any';q('#orVaporizerSlot',card).appendChild(vap)}
  if(o2){o2.classList.add('or-authoritative-control');$('orO2').min='0';$('orO2').max='10';$('orO2').step='any';q('#orO2Slot',card).appendChild(o2)}
  if(sap)q('#orAdvancedBpSlot',card).appendChild(sap);
  if(dap)q('#orAdvancedBpSlot',card).appendChild(dap);
  const legacyVent=labelFor('orVentilation');if(legacyVent){legacyVent.hidden=true;legacyVent.classList.add('or-compat-control')}
  return card;
}
function buildFluid(){
  const panel=make('section',{'data-or-workspace-panel':'fluid',class:'or-workspace-panel or-fluid-workspace'});
  panel.innerHTML=`${secondaryHeader('FLUID','Fluids','Rate / bolus / total in first')}<div id="orFluidWorkspaceSlot"></div>`;
  const fluid=$('orFluidPanelDetails');
  if(fluid){
    fluid.open=true;fluid.classList.add('or-fluid-simplified');q('#orFluidWorkspaceSlot',panel).appendChild(fluid);
    const summary=q('.or-collapsible-summary',fluid);if(summary)summary.hidden=true;
    const body=q('.or-collapsible-body',fluid);if(body){
      q('.section-heading',body)?.classList.add('or-fluid-legacy-heading');
      const hero=q('.fluid-rate-hero',body),quick=q('.fluid-quick-grid',body),running=q('.fluid-running-summary',body),history=$('fluidRateHistoryView');
      if(hero&&!q('.or-fluid-main',body)){
        const main=make('div',{class:'or-fluid-main'}),more=make('details',{class:'or-fluid-secondary'}),sum=make('summary',{text:'More • actual correction / blood loss / urine / blood / balance / history'}),inner=make('div',{class:'or-fluid-secondary-body'});
        body.insertBefore(main,hero);main.appendChild(hero);
        const heroCards=qa(':scope > *',hero),actual=heroCards.find(x=>x.classList?.contains('actual'));
        if(actual)inner.appendChild(actual);
        if(quick){const cards=qa(':scope > article',quick);if(cards[0])main.appendChild(cards[0]);cards.slice(1).forEach(card=>inner.appendChild(card));quick.remove()}
        if(running){
          const items=qa(':scope > div',running),glance=make('div',{class:'or-fluid-glance'});
          // Total fluid in + Current rate stay visible. Effective/net move to More.
          if(items[1])glance.appendChild(items[1]);if(items[3])glance.appendChild(items[3]);
          if(glance.children.length)main.appendChild(glance);
          [items[0],items[2]].filter(Boolean).forEach(x=>inner.appendChild(x));
          running.remove();
        }
        if(history)inner.appendChild(history);
        more.append(sum,inner);main.after(more);
      }
    }
  }
  return panel;
}
function buildVent(){
  const panel=make('section',{'data-or-workspace-panel':'vent',class:'or-workspace-panel or-vent-workspace'});
  panel.innerHTML=`${secondaryHeader('VENT','Ventilator / PPV','Choose mode, then RR / PIP / PEEP / VT')}<section class="panel or-ventilator-workspace"><div id="orVentModeButtons" class="or-vent-mode-buttons"><button type="button" data-vent-mode="Spontaneous">Spontaneous</button><button type="button" data-vent-mode="Manual PPV">Manual PPV</button><button type="button" data-vent-mode="Mechanical ventilation">Mechanical</button></div><div id="orVentModeFeedback" class="or-vent-mode-feedback" role="status" aria-live="polite">Choose ventilation mode</div><div id="orVentModeSlot" class="or-support-mode or-authoritative-mode"></div><div id="orVentSettingsSlot"></div></section>`;
  const mode=labelFor('airwayVentMode'),settings=$('ventilatorFields');
  if(mode)q('#orVentModeSlot',panel).appendChild(mode);
  if(settings)q('#orVentSettingsSlot',panel).appendChild(settings);
  bindVentModeButtons(panel);
  return panel;
}
function buildAirway(){
  const panel=make('section',{'data-or-workspace-panel':'airway',class:'or-workspace-panel or-airway-workspace'});
  panel.innerHTML=`${secondaryHeader('AIRWAY','ET tube details','Fill after patient is stable')}<div id="orAirwayTimestamp" class="or-airway-timestamp">Intubation time not recorded</div><div id="orAirwayWorkspaceSlot"></div>`;
  const airway=$('orAirwayPanelDetails');
  if(airway){
    airway.open=true;airway.classList.add('or-airway-simplified');
    const title=q('.or-collapsible-summary b',airway);if(title)title.textContent='ET tube / Airway details';
    const desc=q('.section-heading p',airway);if(desc)desc.textContent='ETT size / depth / cuff / difficulty / attempts / circuit / note';
    q('#orAirwayWorkspaceSlot',panel).appendChild(airway);
  }
  return panel;
}
function buildMeds(){
  const panel=make('section',{'data-or-workspace-panel':'meds',class:'or-workspace-panel or-meds-workspace'});
  panel.innerHTML=`${secondaryHeader('MEDS','Medication review','Actual dose / time / route when stable')}<div id="orMedicationQueueSlot"></div><div id="orQuickMedSlot"></div><div id="orGuardianSlot"></div>`;
  const quick=q('.or-quick-med-strip'),queue=$('orMedicationQueue'),guardian=$('orDocumentationGuardian');
  if(quick)q('#orQuickMedSlot',panel).appendChild(quick);
  if(queue){queue.hidden=false;q('#orMedicationQueueSlot',panel).appendChild(queue)}
  if(guardian)q('#orGuardianSlot',panel).appendChild(guardian);
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
  page.dataset.presentationOwner='or-workspace-v17130';page.dataset.layoutContract='monitor-first-v17130';
  const command=q('#orlive .or-command-bar'),vitals=$('orVitalsFocus'),vitalGrid=q('#orlive .or-vital-grid'),primary=q('#orlive .or-primary-flow'),safety=$('orCoreSafety'),phase=$('orCorePhaseStrip');
  syncCompactSummary();

  // V17.12: OR LIVE is a working monitor first. These nodes are always above workflow/navigation.
  if(vitals&&command){vitals.hidden=false;command.after(vitals)}
  if(vitalGrid&&vitals)vitals.after(vitalGrid);
  const monitorControls=buildMonitorControls();
  (vitalGrid||vitals||command).after(monitorControls);

  // Workflow remains authoritative but visually secondary to monitoring.
  if(primary)monitorControls.after(primary);
  const undo=$('orUndoStepBtn'),workflowButtons=q('.or-primary-buttons',primary);if(undo&&workflowButtons)workflowButtons.appendChild(undo);
  const inductionQuick=buildInductionQuickStrip();
  if(primary)primary.after(inductionQuick);else monitorControls.after(inductionQuick);
  if(safety)inductionQuick.after(safety);
  if(phase)phase.classList.add('or-phase-strip-secondary');

  const nav=make('nav',{id:'orWorkspaceNav',class:'or-workspace-nav or-secondary-workspace-nav',role:'toolbar','aria-label':'OR LIVE secondary workspace'});
  nav.innerHTML=`<button type="button" data-or-workspace="fluid" aria-pressed="false"><span>Fluid</span><small>Rate + bolus</small><b id="orWorkspaceFluidBadge" class="or-workspace-badge" hidden></b></button>
  <button type="button" data-or-workspace="vent" aria-pressed="false"><span>Vent</span><small>RR + PIP</small><b id="orWorkspaceVentBadge" class="or-workspace-badge" hidden></b></button>
  <button type="button" data-or-workspace="airway" aria-pressed="false"><span>Airway</span><small>ET tube</small><b id="orWorkspaceAirwayBadge" class="or-workspace-badge">PENDING</b></button>
  <button type="button" data-or-workspace="meds" aria-pressed="false"><span>Meds</span><small>Review</small><b id="orWorkspaceMedsBadge" class="or-workspace-badge" hidden></b></button>`;
  (safety||inductionQuick||primary||monitorControls).after(nav);

  const host=make('div',{id:'orWorkspaceHost',class:'or-workspace-host'});nav.after(host);
  host.appendChild(buildFluid());
  host.appendChild(buildVent());
  host.appendChild(buildAirway());
  host.appendChild(buildMeds());
  qa('[data-or-workspace]',nav).forEach(b=>{
    const view=b.dataset.orWorkspace,panel=q(`[data-or-workspace-panel="${view}"]`,host);
    b.id=`orWorkspaceTab-${view}`;b.setAttribute('aria-controls',`orWorkspacePanel-${view}`);
    if(panel){panel.id=`orWorkspacePanel-${view}`;panel.setAttribute('role','region');panel.setAttribute('aria-labelledby',b.id)}
  });

  // Old combined status row is redundant with the top Save/Next Due strip.
  q('#orlive .or-status-row')?.classList.add('or-redundant-status');
  // Legacy all-in-one airway setup is retired from the active workflow.
  const oldSetup=$('orAirwaySetupDialog');if(oldSetup){oldSetup.hidden=true;oldSetup.classList.remove('is-open')}

  nav.addEventListener('click',e=>{const b=e.target.closest?.('[data-or-workspace]');if(b)setView(b.dataset.orWorkspace,{scroll:true})});
  host.addEventListener('click',e=>{if(e.target.closest?.('[data-or-back-monitor]'))setView('monitor',{scroll:true})});
  nav.addEventListener('keydown',e=>{
    const buttons=qa('[data-or-workspace]',nav),i=buttons.indexOf(document.activeElement);
    if(i<0||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].focus();setView(buttons[next].dataset.orWorkspace,{scroll:false});
  });

  bindHardware();syncCompactSummary();syncSafetyCompact();
  ['airwayStatus','orAirwaySummary','orFluidSummary','orPrimaryDocumentationNote','orPatientName','orPatientMeta','orAsaBadge','orProcedureLine','orRiskLine'].forEach(id=>{
    const el=$(id);if(el)new MutationObserver(()=>{updateBadges();syncCompactSummary()}).observe(el,{childList:true,subtree:true,characterData:true,attributes:true});
  });
  ['airwayEttSize','airwayVentMode','weight','patientAllergies','procedure','asa'].forEach(id=>$(id)?.addEventListener(id==='airwayVentMode'?'change':'input',()=>{updateBadges();syncCompactSummary()}));
  const primaryBtn=$('orPrimaryActionBtn');
  if(primaryBtn)new MutationObserver(()=>{renderInductionQuickStrip();updateBadges()}).observe(primaryBtn,{childList:true,subtree:true,attributes:true,attributeFilter:['data-action','disabled']});
  ['orCoreSafetyTitle','orCoreSafetySummary','orAlertCount'].forEach(id=>{const el=$(id);if(el)new MutationObserver(syncSafetyCompact).observe(el,{childList:true,subtree:true,characterData:true,attributes:true})});
  document.addEventListener('anesvet:drug-administration-changed',()=>{renderInductionQuickStrip();updateBadges()});
  document.addEventListener('anesvet:induction-provisional-changed',()=>{renderInductionQuickStrip();updateBadges()});
  updateBadges();syncCompactSummary();syncSafetyCompact();renderInductionQuickStrip();
  setView('monitor');
}
const api=Object.freeze({version:VERSION,init,setView,renderHardware,getView:()=>current,updateBadges,renderInductionQuickStrip,syncSafetyCompact});
root.ANESVET_OR_WORKSPACE=api;
if(root.ANESVET_LIFECYCLE_COORDINATOR?.ready)root.ANESVET_LIFECYCLE_COORDINATOR.ready(init);
else if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
else init();
})(window);
