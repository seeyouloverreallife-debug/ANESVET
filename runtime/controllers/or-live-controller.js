/* ANESVET V16.18.3 — OR LIVE Controller
   Incremental OR LIVE UI/controller extraction. Existing OR domain/orchestration and clinical semantics remain injected and unchanged. */
(function(root){
'use strict';
const VERSION='17.14.13';
function create(ctx={}){
  const $=ctx.$,$$=ctx.$$;
  if(!$||!$$||typeof ctx.getState!=='function')return null;
  const state=new Proxy({}, {get(_t,p){return ctx.getState()?.[p]},set(_t,p,v){const s=ctx.getState();if(s)s[p]=v;return true}});
  const escapeHtml=ctx.escapeHtml||((v)=>String(v??''));
  const formatClock=ctx.formatClock||(()=>''),formatElapsed=ctx.formatElapsed||(()=>''),formatShortElapsed=ctx.formatShortElapsed||(()=> '');
  const pad=ctx.pad||((n)=>String(n).padStart(2,'0')),toast=ctx.toast||(()=>{});
  const OR_SYNC=ctx.orSync||{};
  const WF=ctx.workflow,PROCEDURE_TEMPLATES=ctx.procedureTemplates;
  if(!WF||!PROCEDURE_TEMPLATES)return null;
  const getTempDisplayUnit=ctx.getTempDisplayUnit||(()=> 'F');
  const tempStoredFToDisplay=ctx.tempStoredFToDisplay||((v)=>v),tempTextF=ctx.tempTextF||((v)=>String(v??'—'));
  const currentElapsed=ctx.currentElapsed||(()=>0),clinicalWriteAllowed=ctx.clinicalWriteAllowed||(()=>true),save=ctx.save||(()=>{}),scheduleAutosave=ctx.scheduleAutosave||(()=>{});
  const addAudit=ctx.addAudit||(()=>{}),addEvent=ctx.addEvent||(()=>{}),addRecord=ctx.addRecord||(()=>{}),setTab=ctx.setTab||(()=>{});
  const maybeShowCriticalClinicalAlert=ctx.maybeShowCriticalClinicalAlert||(()=>{});
  const activeProcedureTemplate=ctx.activeProcedureTemplate||(()=>({})),frozenQuickDrugs=ctx.frozenQuickDrugs||(()=>[]),openOrQuickDrug=ctx.openOrQuickDrug||(()=>{});
  const caseDrugPlanPhaseLabel=ctx.caseDrugPlanPhaseLabel||((v)=>String(v||'')),fmtDose=ctx.fmtDose||((v)=>String(v??''));
  const renderProcedureTimeline=ctx.renderProcedureTimeline||(()=>{}),renderProcedureTemplatePicker=ctx.renderProcedureTemplatePicker||(()=>{}),renderEvents=ctx.renderEvents||(()=>{});
  const renderOrPhaseTracker=ctx.renderOrPhaseTracker||(()=>{}),thresholds=ctx.thresholds||(()=>({})),getVal=ctx.getVal||(()=>null),phaseLabel=ctx.phaseLabel||(()=>''),phaseClass=ctx.phaseClass||(()=>''),preopRiskSummaryLabels=ctx.preopRiskSummaryLabels||(()=>[]);
  const latestRecord=ctx.latestRecord||(()=>null),vitalRecordSummary=ctx.vitalRecordSummary||(()=>''),renderOrVitalChangeState=ctx.renderOrVitalChangeState||(()=>({changed:0,blank:0})),renderOrQuickMedStrip=ctx.renderOrQuickMedStrip||(()=>{});
  const alertThresholdHint=ctx.alertThresholdHint||(()=>''),withAlertAdvice=ctx.withAlertAdvice||((x)=>x||[]),getSmartAlerts=ctx.getSmartAlerts||(()=>[]);
  const renderOrFluidPanel=ctx.renderOrFluidPanel||(()=>{}),renderSaveState=ctx.renderSaveState||(()=>{}),renderRecoveryState=ctx.renderRecoveryState||(()=>{}),renderComplications=ctx.renderComplications||(()=>{}),renderAlertProtocolStatus=ctx.renderAlertProtocolStatus||(()=>{}),renderActiveProblems=ctx.renderActiveProblems||(()=>{});
  const validateCaseReadyToStart=ctx.validateCaseReadyToStart||(()=>true),confirmCaseDrugPlanBeforeStart=ctx.confirmCaseDrugPlanBeforeStart||(()=>true),captureProtocolSnapshot=ctx.captureProtocolSnapshot||(()=>{});
  const startTimerLoop=ctx.startTimerLoop||(()=>{}),clearTimerLoop=ctx.clearTimerLoop||(()=>{}),renderTimerState=ctx.renderTimerState||(()=>{}),renderCasePhase=ctx.renderCasePhase||(()=>{}),autoWakeEnabled=ctx.autoWakeEnabled||(()=>false),requestScreenWakeLock=ctx.requestScreenWakeLock||(()=>{}),pauseTimer=ctx.pauseTimer||(()=>{});
  const currentSettingsObject=ctx.currentSettingsObject||(()=>({})),fillBlankVitalsFromLast=ctx.fillBlankVitalsFromLast||(()=>{}),markMilestone=ctx.markMilestone||(()=>false),openComplicationDialog=ctx.openComplicationDialog||(()=>{});
  const renderRecovery=ctx.renderRecovery||(()=>{}),beginRecovery=ctx.beginRecovery||(()=>false),confirmFn=ctx.confirm||((msg)=>root.confirm?.(msg)??false);
  let airwayWorkflowContext='';
  /* V17.14.13 canonical Fast Vital interaction owner.
     Migrated from or-speed-hardening.js without changing record semantics. */
  const FAST_FIELDS=Object.freeze([
    {id:'orHr',label:'HR',unit:'bpm'},
    {id:'orMap',label:'MAP',unit:'mmHg'},
    {id:'orSpo2',label:'SpO₂',unit:'%'},
    {id:'orEtco2',label:'ETCO₂',unit:'mmHg'},
    {id:'orRr',label:'RR',unit:'/min'},
    {id:'orTemp',label:'Temp',unit:''}
  ]);
  const FAST_IDS=new Set(FAST_FIELDS.map(x=>x.id));
  const fastMobileQuery=root.matchMedia?.('(max-width:1180px), (pointer:coarse) and (max-width:1400px)')||{matches:false};
  let activeFastId='',fastSavedFlashTimer=0,fastVisibilityTimer=0,fastBound=false;
  function fastFieldIndex(id=activeFastId){return FAST_FIELDS.findIndex(x=>x.id===id)}
  function activeFastInput(){const el=document.activeElement;return el&&FAST_IDS.has(el.id)?el:null}
  function isOrActive(){return !!$('orlive')?.classList.contains('active')}
  function stateRecordCount(){return Array.isArray(state.records)?state.records.length:0}
  function positionFastEntryRail(){
    const rail=$('orFastEntryRail');if(!rail||rail.hidden)return;
    const viewport=root.visualViewport;
    rail.style.bottom='auto';
    rail.style.top=`${Math.max(viewport?.offsetTop||0,(viewport?.offsetTop||0)+(viewport?.height||root.innerHeight)-rail.offsetHeight-8)}px`;
  }
  function fastMetricText(row,input){const v=String(input?.value??'').trim(),unit=row.id==='orTemp'?($('orTempUnit')?.textContent||''):row.unit;return v?`${row.label} ${v}${unit?` ${unit}`:''}`:`${row.label} • blank`}
  function updateFastEntryRail({saved=false}={}){
    const rail=$('orFastEntryRail');if(!rail)return;
    const idx=fastFieldIndex(),row=FAST_FIELDS[idx],input=row?$(row.id):null,show=fastMobileQuery.matches&&isOrActive()&&idx>=0&&document.activeElement===input;
    rail.hidden=!show;document.body?.classList.toggle('or-fast-entry-active',show);if(!show)return;
    if($('orFastEntryProgress'))$('orFastEntryProgress').textContent=`VITAL ${idx+1}/${FAST_FIELDS.length}`;
    if($('orFastEntryCurrent')){$('orFastEntryCurrent').textContent=saved?'✓ Vitals saved':fastMetricText(row,input);$('orFastEntryCurrent').classList.toggle('saved',saved)}
    if($('orFastEntryPrevBtn'))$('orFastEntryPrevBtn').disabled=idx<=0;
    if($('orFastEntryNextBtn')){$('orFastEntryNextBtn').disabled=false;$('orFastEntryNextBtn').textContent=idx>=FAST_FIELDS.length-1?'เสร็จ':'ถัดไป';$('orFastEntryNextBtn').setAttribute('aria-label',idx>=FAST_FIELDS.length-1?'จบการกรอก โดยยังไม่บันทึก':'ช่องถัดไป')}
    if($('orFastEntrySaveBtn'))$('orFastEntrySaveBtn').textContent='✓ SAVE';
    positionFastEntryRail();
  }
  function ensureFastInputVisible(){
    const input=activeFastInput();if(!input||!fastMobileQuery.matches||document.querySelector('dialog[open]'))return;
    const viewport=root.visualViewport,rail=$('orFastEntryRail'),rect=input.getBoundingClientRect(),topLimit=(viewport?.offsetTop||0)+8,bottomLimit=(viewport?.offsetTop||0)+(viewport?.height||root.innerHeight)-(rail&&!rail.hidden?rail.offsetHeight+16:8);
    if(bottomLimit-topLimit<rect.height)return;
    const delta=rect.top<topLimit?rect.top-topLimit:rect.bottom>bottomLimit?rect.bottom-bottomLimit:0;
    if(Math.abs(delta)>1)root.scrollBy({top:delta,left:0,behavior:'instant'});
  }
  function queueFastInputVisibility(){clearTimeout(fastVisibilityTimer);fastVisibilityTimer=setTimeout(ensureFastInputVisible,180)}
  function refreshFastViewport(reason='or-live'){
    root.ANESVET_MOBILE_OR_OWNER?.sync?.(reason);positionFastEntryRail();if(activeFastInput())queueFastInputVisibility();
  }
  function focusFastField(index){
    const row=FAST_FIELDS[index],el=row?$(row.id):null;if(!el)return false;activeFastId=row.id;
    try{el.focus({preventScroll:true})}catch(_){el.focus()}
    updateFastEntryRail();queueFastInputVisibility();return true;
  }
  function dismissFastKeyboard(){const el=activeFastInput();if(el)el.blur();activeFastId='';clearTimeout(fastVisibilityTimer);updateFastEntryRail();refreshFastViewport('fast-dismiss')}
  function flashFastVitalsSaved(){clearTimeout(fastSavedFlashTimer);updateFastEntryRail({saved:true});fastSavedFlashTimer=setTimeout(()=>updateFastEntryRail(),900)}
  function saveFastVitals(){
    const before=stateRecordCount(),y=root.scrollY,record=$('orRecordNowBtn');if(!record)return false;record.click();
    setTimeout(()=>{const after=stateRecordCount();if(after>before){flashFastVitalsSaved();dismissFastKeyboard();requestAnimationFrame(()=>root.scrollTo({top:y,left:0,behavior:'auto'}));document.dispatchEvent(new CustomEvent('anesvet:fast-vitals-saved',{detail:{before,after}}))}else updateFastEntryRail()},0);return true;
  }
  function bindFastVitalInteraction(){
    if(fastBound)return;fastBound=true;
    document.addEventListener('focusin',e=>{if(!FAST_IDS.has(e.target?.id))return;activeFastId=e.target.id;updateFastEntryRail();queueFastInputVisibility()});
    document.addEventListener('focusout',e=>{if(!FAST_IDS.has(e.target?.id))return;setTimeout(()=>{if(!activeFastInput()){activeFastId='';updateFastEntryRail()}},40)});
    document.addEventListener('input',e=>{if(FAST_IDS.has(e.target?.id)){activeFastId=e.target.id;updateFastEntryRail()}});
    document.addEventListener('keydown',e=>{if(!FAST_IDS.has(e.target?.id))return;if(e.key==='Escape'){e.preventDefault();dismissFastKeyboard();return}if(e.key!=='Enter'&&e.key!=='NumpadEnter')return;e.preventDefault();e.stopImmediatePropagation();const idx=fastFieldIndex(e.target.id);if(e.ctrlKey||e.metaKey){saveFastVitals();return}if(e.shiftKey){focusFastField(Math.max(0,idx-1));return}if(idx<FAST_FIELDS.length-1)focusFastField(idx+1);else dismissFastKeyboard()},true);
    $('orFastEntryPrevBtn')?.addEventListener('click',()=>focusFastField(Math.max(0,fastFieldIndex()-1)));
    $('orFastEntryNextBtn')?.addEventListener('click',()=>{const idx=fastFieldIndex();if(idx<FAST_FIELDS.length-1)focusFastField(idx+1);else dismissFastKeyboard()});
    $('orFastEntrySaveBtn')?.addEventListener('click',saveFastVitals);
    [$('orFastEntryPrevBtn'),$('orFastEntryNextBtn'),$('orFastEntrySaveBtn')].forEach(btn=>btn?.addEventListener('pointerdown',e=>e.preventDefault()));
    root.ANESVET_MOBILE_OR_OWNER?.subscribe?.((_view,reason)=>{if(['viewport','focusin','focusout','pageshow'].includes(reason))refreshFastViewport(reason)});
    root.visualViewport?.addEventListener?.('scroll',positionFastEntryRail,{passive:true});
    fastMobileQuery.addEventListener?.('change',()=>{updateFastEntryRail();root.ANESVET_VIEWPORT_COORDINATOR?.schedule?.('media-change')});
    refreshFastViewport('fast-bind');updateFastEntryRail();
  }
function syncOrFromMain(){Object.entries(OR_SYNC).forEach(([aId,bId])=>{const a=$(aId),b=$(bId);if(a&&b&&document.activeElement!==a)a.value=b.value})}
function syncMainFromOr(orId){const mainId=OR_SYNC[orId],a=$(orId),b=$(mainId);if(!a||!b)return;b.value=a.value;b.dispatchEvent(new Event(b.tagName==='SELECT'?'change':'input',{bubbles:true}))}
Object.keys(OR_SYNC).forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>syncMainFromOr(id))});
['map','spo2','orMap','orSpo2'].forEach(id=>$(id)?.addEventListener('blur',()=>setTimeout(maybeShowCriticalClinicalAlert,0)));
function orStatusText(level,good,warn,danger){return level==='neutral'?'No measurement entered':level==='danger'?danger:level==='warn'?warn:good}
function sparkSvg(values,minHint=null,maxHint=null){const vals=values.filter(v=>v!==null&&v!==''&&v!==undefined).map(Number).filter(Number.isFinite);if(vals.length<2)return '<div class="or-spark-empty">Need ≥2 records</div>';let min=Math.min(...vals),max=Math.max(...vals);if(Number.isFinite(minHint))min=Math.min(min,minHint);if(Number.isFinite(maxHint))max=Math.max(max,maxHint);if(max===min){max+=1;min-=1}const w=220,h=70,p=7;const coords=vals.map((v,i)=>{const x=p+(i/(vals.length-1))*(w-p*2),y=h-p-((v-min)/(max-min))*(h-p*2);return [x.toFixed(1),y.toFixed(1)]});const pts=coords.map(x=>x.join(',')).join(' '),last=coords[coords.length-1],lastVal=vals[vals.length-1];return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="#14758c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3.5" fill="#0d5265"/><text x="${w-p}" y="${p+7}" text-anchor="end" font-size="10" fill="#54656f">${escapeHtml(lastVal)}</text></svg>`}
function renderOrMiniTrends(){const r=(state.records||[]).slice(-6),isC=getTempDisplayUnit()==='C',m={orSparkMap:['map',55,80],orSparkSpo2:['spo2',90,100],orSparkEtco2:['etco2',30,60],orSparkTemp:['temp',isC?tempStoredFToDisplay(98):98,isC?tempStoredFToDisplay(100):100]};Object.entries(m).forEach(([id,[key,min,max]])=>{if(!$(id))return;const vals=r.map(x=>key==='temp'&&x[key]!==null&&x[key]!==''&&x[key]!==undefined?tempStoredFToDisplay(x[key]):x[key]);$(id).innerHTML=sparkSvg(vals,min,max)})}
function renderOrRecent(){const items=[...(state.records||[]).slice(-5).map(r=>({epoch:r.epoch,elapsedMs:r.elapsedMs,kind:'Record',desc:`HR ${r.hr??'—'} • MAP ${r.map??'—'} • SpO₂ ${r.spo2??'—'} • ETCO₂ ${r.etco2??'—'} • Temp ${r.temp==null?'—':tempTextF(r.temp)}`})),...(state.events||[]).slice(-5).map(e=>({epoch:e.epoch,elapsedMs:e.elapsedMs,kind:e.category,desc:`${e.name}${e.dose?' • '+e.dose:''}`}))].sort((a,b)=>b.epoch-a.epoch).slice(0,7);const box=$('orRecentActivity');if(!box)return;if(!items.length){box.className='or-recent-list empty-state compact';box.textContent='ยังไม่มีข้อมูล';return}box.className='or-recent-list';box.innerHTML=items.map(i=>`<div class="or-recent-item"><span class="t">${escapeHtml(formatShortElapsed(i.elapsedMs))}</span><span class="kind">${escapeHtml(i.kind)}</span><span class="desc">${escapeHtml(i.desc)}</span></div>`).join('')}
function renderOrTimerState(){if(!$('orTimerState'))return;if(state.timer.running){$('orTimerState').className='timer-state running';$('orTimerState').textContent='● RUNNING';$('orStartBtn').textContent='Running';$('orStartBtn').disabled=true;$('orPauseBtn').disabled=false;$('orPauseBtn').textContent='Pause case'}else if((state.timer.elapsedMs||0)>0){$('orTimerState').className='timer-state paused';$('orTimerState').textContent='PAUSED';$('orStartBtn').textContent='▶ Resume';$('orStartBtn').disabled=false;$('orPauseBtn').disabled=true;$('orPauseBtn').textContent='Paused'}else{$('orTimerState').className='timer-state ready';$('orTimerState').textContent='READY';$('orStartBtn').textContent='▶ Start case';$('orStartBtn').disabled=false;$('orPauseBtn').disabled=true;$('orPauseBtn').textContent='Pause'}$('orCaseClock').textContent=formatElapsed(currentElapsed())}

function hasProcedureMilestone(label){return (state.events||[]).some(e=>e?.name===label)}
function procedureMilestoneEvent(label){return (state.events||[]).find(e=>e?.name===label&&e?.note==='Procedure milestone')||(state.events||[]).find(e=>e?.name===label)||null}
const OR_WORKFLOW_PROFILES={
  routine:{label:'Routine / Elective',badge:'ROUTINE',help:'Fast documentation path for standard anesthesia workflow.'},
  critical:{label:'Emergency / Critical',badge:'CRITICAL',help:'Keeps stabilization/support documentation visible without forcing treatment choices.'},
  csection:{label:'Cesarean section / C-section',badge:'C-SECTION',help:'Adds delivery milestones and elapsed timing while preserving the standard anesthesia record.'},
  custom:{label:'Custom / Other',badge:'CUSTOM',help:'Standard OR LIVE with neutral workflow controls.'}
};
function activeWorkflowProfile(){
  const frozen=state.caseStartedAt&&state.procedureTemplateSnapshot?.workflowProfile;
  const v=frozen||state.caseWorkflowProfile||$('caseWorkflowProfile')?.value||'routine';
  return OR_WORKFLOW_PROFILES[v]?v:'routine';
}
function workflowProfileInfo(){return OR_WORKFLOW_PROFILES[activeWorkflowProfile()]||OR_WORKFLOW_PROFILES.routine}
function workflowEvent(name){return (state.events||[]).find(e=>e?.name===name)||null}
function workflowElapsed(fromEvent,toEvent){
  const a=fromEvent?.epoch,b=toEvent?.epoch;
  if(!Number.isFinite(Number(a))||!Number.isFinite(Number(b))||Number(b)<Number(a))return '—';
  return formatElapsed(Number(b)-Number(a));
}
function recordWorkflowEvent(name,category='Workflow',note='Workflow milestone'){
  if(!clinicalWriteAllowed())return false;
  if(workflowEvent(name)){toast(`${name} already recorded`);return false}
  if(!state.caseStartedAt){toast('Start case before recording this milestone');return false}
  addEvent({category,name,note});return true;
}
function recordPreAnestheticWorkflowEvent(name,category='Workflow',note='Pre-anesthetic workflow event'){
  if(!clinicalWriteAllowed())return false;
  if(workflowEvent(name)){toast(`${name} already recorded`);return false}
  if(state.caseStartedAt)return recordWorkflowEvent(name,category,note);
  const epoch=Date.now(),ev={id:crypto.randomUUID?crypto.randomUUID():String(epoch+Math.random()),epoch,elapsedMs:0,clock:formatClock(epoch),category,name,note,preAnesthetic:true};
  state.events.push(ev);state.events.sort((a,b)=>a.epoch-b.epoch);addAudit('PREANESTHETIC_WORKFLOW_EVENT',name);save();renderEvents();renderProcedureTimeline();renderOrLive();toast(`${name} • ${ev.clock}`);return true;
}
function templateQuickDrugCandidates(){
  const t=activeProcedureTemplate(),refs=t?.quickDrugRefs||[];if(!refs.length||!state.protocolSnapshot)return [];
  const all=frozenQuickDrugs(),out=[],seen=new Set();
  for(const ref of refs){const id=String(ref?.id||''),name=normalizeMedicationIdentity(ref?.name||'');const d=(id&&all.find(x=>String(x.id||'')===id))||(name&&all.find(x=>normalizeMedicationIdentity(x.name)===name));if(!d)continue;const key=`${d.id||''}|${normalizeMedicationIdentity(d.name)}`;if(seen.has(key))continue;seen.add(key);out.push({...d,templatePreferred:true})}
  return out;
}
function renderTemplateQuickActions(){
  const box=$('orTemplateQuickActions');if(!box)return;const t=activeProcedureTemplate(),hospital=t?.source==='hospital';
  const milestones=hospital?(t?.extraMilestones||[]):[],events=hospital?(t?.quickEvents||[]):[],drugs=hospital?(t?.quickDrugRefs||[]):[];
  if(!milestones.length&&!events.length&&!drugs.length){box.hidden=true;box.innerHTML='';return}
  const milestoneButtons=milestones.map((label,i)=>`<button type="button" class="btn ${workflowEvent(label)?'done':''}" data-template-action="milestone" data-template-index="${i}" ${workflowEvent(label)?'disabled':''}>${workflowEvent(label)?'✓ ':'＋ '}${escapeHtml(label)}</button>`).join('');
  const eventButtons=events.map((ev,i)=>`<button type="button" class="btn" data-template-action="event" data-template-index="${i}">＋ ${escapeHtml(ev.label||'Event')}</button>`).join('');
  const all=frozenQuickDrugs(),drugButtons=drugs.map((ref,i)=>{const id=String(ref?.id||''),name=normalizeMedicationIdentity(ref?.name||''),d=(id&&all.find(x=>String(x.id||'')===id))||(name&&all.find(x=>normalizeMedicationIdentity(x.name)===name));return `<button type="button" class="btn" data-template-action="med" data-template-index="${i}" ${!state.caseStartedAt?'disabled':''}>💉 ${escapeHtml(ref.name||d?.name||'Medication')}${d?'':' • REVIEW'}</button>`}).join('');
  box.hidden=false;box.innerHTML=`<div class="template-quick-head"><span>${escapeHtml(t.label)} • QUICK DOCUMENTATION</span><small>Shortcuts only • clinician confirms actual actions</small></div><div class="or-template-quick-buttons">${milestoneButtons}${eventButtons}${drugButtons}</div>`;
}
function runTemplateQuickAction(button){
  const t=activeProcedureTemplate(),kind=button?.dataset?.templateAction,index=Number(button?.dataset?.templateIndex);if(t?.source!=='hospital'||!Number.isInteger(index))return;
  if(kind==='milestone'){
    const label=(t.extraMilestones||[])[index];if(!label)return;if(!state.caseStartedAt){toast('Start case before recording a procedure milestone');return}if(recordWorkflowEvent(label,'Procedure','Hospital procedure template milestone')){renderTemplateQuickActions();renderProcedureTimeline();renderOrRecent();renderWorkflowContext()}return;
  }
  if(kind==='event'){
    const ev=(t.quickEvents||[])[index];if(!ev)return;if(!state.caseStartedAt){toast('Start case before recording an OR event');return}if(!clinicalWriteAllowed())return;addEvent({category:ev.category||'Procedure',name:ev.label,note:'Hospital procedure template quick event'});renderTemplateQuickActions();renderOrLive();return;
  }
  if(kind==='med'){
    const ref=(t.quickDrugRefs||[])[index];if(!ref)return;if(!state.caseStartedAt){toast('Start case before medication documentation');return}const all=frozenQuickDrugs(),id=String(ref.id||''),name=normalizeMedicationIdentity(ref.name||''),d=(id&&all.find(x=>String(x.id||'')===id))||(name&&all.find(x=>normalizeMedicationIdentity(x.name)===name));if(d)openOrQuickDrug({drugId:d.id,purpose:'template'});else{toast(`${ref.name||'Medication'} is not in the frozen protocol/library • opening medication workspace`);openOrQuickDrug({purpose:'template'})}return;
  }
}
$('orTemplateQuickActions')?.addEventListener('click',e=>{const b=e.target.closest('[data-template-action]');if(b)runTemplateQuickAction(b)});

function renderWorkflowContext(){
  const panel=$('orCaseContextPanel'),badge=$('orWorkflowBadge'),title=$('orContextTitle'),help=$('orContextHelp'),metrics=$('orContextMetrics'),actions=$('orContextActions');
  if(!panel||!title||!help||!metrics||!actions)return;
  const profile=activeWorkflowProfile(),info=workflowProfileInfo(),template=activeProcedureTemplate();
  panel.className=`or-context-panel ${profile}`;title.textContent=template?.id&&template.id!=='custom'?template.label:info.label;help.textContent=`${template?.focus||info.help} • ${template?.note||'Documentation workflow only.'}`;
  if($('orContextEyebrow'))$('orContextEyebrow').textContent=`PROCEDURE TEMPLATE • ${info.label}`;
  if(badge){badge.textContent=template?.badge||info.badge;badge.className=`status-pill workflow ${profile}`;}
  const btn=(action,label,cls='')=>`<button type="button" class="btn ${cls}" data-workflow-action="${action}">${label}</button>`;
  if(profile==='critical'){
    const s=workflowEvent('Stabilization checkpoint'),support=(state.events||[]).filter(e=>e?.category==='Support').at(-1);
    metrics.innerHTML=`<div><span>Stabilization</span><b>${s?`Recorded ${escapeHtml(s.clock||'')}`:'Not timestamped'}</b></div><div><span>Latest support event</span><b>${support?escapeHtml(`${support.name} • ${support.clock||''}`):'—'}</b></div>`;
    actions.innerHTML=`${btn('stabilization','＋ Stabilization checkpoint',s?'done':'primary')}${btn('support-event','＋ Support event')}${btn('meds','💉 Medication')}${btn('record','＋ Record vitals')}`;
  }else if(profile==='csection'){
    const ind=procedureMilestoneEvent('Induction'),first=workflowEvent('First neonate delivered'),last=workflowEvent('Last neonate delivered');
    metrics.innerHTML=`<div><span>Induction → first neonate</span><b>${workflowElapsed(ind,first)}</b></div><div><span>First → last neonate</span><b>${workflowElapsed(first,last)}</b></div><div><span>Delivered milestones</span><b>${first?'First ✓':'First —'} • ${last?'Last ✓':'Last —'}</b></div>`;
    actions.innerHTML=`${btn('first-neonate','👶 First neonate',first?'done':'primary')}${btn('last-neonate','👶 Last neonate',last?'done':'')}${btn('neonatal-support','＋ Neonatal support event')}${btn('meds','💉 Maternal medication')}`;
  }else if(profile==='routine'){
    const airway=airwayRecorded(),surg=hasProcedureMilestone('Surgery start');
    metrics.innerHTML=`<div><span>Fast path</span><b>${airway?'Airway ✓':'Airway —'} • ${surg?'Surgery ✓':'Surgery —'}</b></div><div><span>Documentation</span><b>Record • Meds • Recovery</b></div>`;
    actions.innerHTML=`${btn('meds','💉 Medication')}${btn('record','＋ Record vitals')}`;
  }else{
    metrics.innerHTML=`<div><span>Workflow</span><b>Standard OR LIVE</b></div><div><span>Context</span><b>Custom / clinician-defined</b></div>`;
    actions.innerHTML=`${btn('meds','💉 Medication')}${btn('record','＋ Record vitals')}`;
  }
  const noteEl=$('orTemplateContextNote');if(noteEl){const notes=[];if(template?.chartingIntervalMin)notes.push(`<b>Documentation reminder:</b> ${escapeHtml(template.chartingIntervalMin)} min`);if(template?.fluidSetupNote)notes.push(`<b>Fluid / setup note:</b> ${escapeHtml(template.fluidSetupNote)}`);if(template?.procedureNote)notes.push(`<b>Procedure note:</b> ${escapeHtml(template.procedureNote)}`);noteEl.hidden=!notes.length;noteEl.innerHTML=notes.join(' • ')}
}
function inductionMedicationRecords(){return (state.drugAdministrations||[]).filter(d=>!d.voidedAt&&String(d.source||'').startsWith('OR Induction'))}
function normalizeMedicationIdentity(value){return String(value||'').trim().toLowerCase().replace(/\s+/g,' ')}
function plannedRoutineMedicationRows(){
  const plan=(state.protocolSnapshot?.caseDrugPlan||[]).filter(Boolean),admins=(state.drugAdministrations||[]).filter(a=>a&&!a.voidedAt).slice().sort((a,b)=>(a.epoch||0)-(b.epoch||0)),used=new Set(),rows=[];
  plan.forEach((item,planIndex)=>{
    const phase=String(item.phase||'').toLowerCase(),role=String(item.role||'').toLowerCase(),standby=!!item.standby||phase==='emergency'||role.includes('emergency')||role.includes('standby');
    if(standby)return;
    const plannedId=normalizeMedicationIdentity(item.id),plannedName=normalizeMedicationIdentity(item.name),actualById=plannedId?admins.find(a=>!used.has(a.id)&&normalizeMedicationIdentity(a?.calculationBasis?.drug?.id)===plannedId):null;
    const actual=actualById||admins.find(a=>!used.has(a.id)&&normalizeMedicationIdentity(a.drug)===plannedName)||null;if(actual)used.add(actual.id);
    const provisional=actual?null:(state.inductionProvisionalAdministrations||[]).find(x=>!x.completedAt&&String(item.phase||'').toLowerCase()==='induction'&&((plannedId&&String(x.drugId||'')===plannedId)||normalizeMedicationIdentity(x.drug)===plannedName))||null;
    rows.push({item,planIndex,actual,provisional,status:actual?'given':provisional?'given-pending':'pending'});
  });
  return rows;
}
function medicationQueuePhaseOrder(){
  const phase=state.casePhase||'setup',hasPendingInduction=plannedRoutineMedicationRows().some(r=>r.status==='pending'&&String(r.item.phase)==='induction');
  if(hasPendingInduction&&['induction','intraop','emergence'].includes(phase))return ['induction','pre','post'];
  if(phase==='setup')return ['pre','induction','post'];
  if(phase==='induction')return ['induction','pre','post'];
  if(phase==='intraop')return ['pre','post','induction'];
  if(['emergence','recovery'].includes(phase))return ['post','pre','induction'];
  return ['pre','induction','post'];
}
function orderedMedicationQueueRows(){
  const order=medicationQueuePhaseOrder(),rank=p=>{const i=order.indexOf(String(p||''));return i<0?order.length:i};
  const statusRank=s=>s==='pending'?0:s==='given-pending'?1:2;return plannedRoutineMedicationRows().slice().sort((a,b)=>statusRank(a.status)-statusRank(b.status)||rank(a.item.phase)-rank(b.item.phase)||a.planIndex-b.planIndex);
}
function rowNeedsMedicationDocumentation(row){return row?.status==='pending'||row?.status==='given-pending'}
function pendingPlannedMedicationRows(){return orderedMedicationQueueRows().filter(rowNeedsMedicationDocumentation)}
function medicationQueueTimingBucket(row,casePhase=state.casePhase||'setup'){
  if(row?.status==='given')return 'documented';
  if(row?.status==='given-pending')return 'review';
  const medPhase=String(row?.item?.phase||'').toLowerCase(),phase=String(casePhase||'setup').toLowerCase();
  if(phase==='setup')return 'later';
  if(phase==='emergency')return 'review';
  if(medPhase==='post')return ['emergence','recovery','complete','locked'].includes(phase)?'review':'later';
  if(medPhase==='pre'||medPhase==='induction')return 'review';
  // Unknown/custom planned phases must stay visible rather than being silently deferred.
  return 'review';
}
function reviewNowPlannedMedicationRows(){return orderedMedicationQueueRows().filter(r=>rowNeedsMedicationDocumentation(r)&&medicationQueueTimingBucket(r)==='review')}
function laterPlannedMedicationRows(){return orderedMedicationQueueRows().filter(r=>rowNeedsMedicationDocumentation(r)&&medicationQueueTimingBucket(r)==='later')}
function medicationQueueSummary(){
  const rows=orderedMedicationQueueRows(),review=rows.filter(r=>rowNeedsMedicationDocumentation(r)&&medicationQueueTimingBucket(r)==='review'),later=rows.filter(r=>rowNeedsMedicationDocumentation(r)&&medicationQueueTimingBucket(r)==='later'),documented=rows.filter(r=>r.status==='given');
  return{rows,review,later,documented};
}
function renderMedicationQueueGroup(label,rows,kind,limit){
  if(!rows.length||limit<=0)return{html:'',shown:0};
  const visible=rows.slice(0,limit),html=`<div class="or-medication-queue-group ${kind}"><div class="or-medication-queue-group-head"><span>${escapeHtml(label)}</span><b>${rows.length}</b></div>${visible.map(r=>{const d=r.item,phase=caseDrugPlanPhaseLabel(d.phase),actual=r.actual,provisional=r.provisional,detail=actual?`${fmtDose(actual.actual)} ${actual.unit||'mL'} • ${actual.route||'—'} • ${actual.clock||''}`:provisional?`Given ${provisional.clock||''} • details pending`:[d.route,d.conc?`${d.conc} ${d.concUnit||''}`:'',d.hospitalProtocol?`${d.hospitalProtocol} protocol`:''].filter(Boolean).join(' • ')||'Actual administration not documented',stateText=kind==='documented'?'✓ GIVEN':r.status==='given-pending'?'GIVEN • REVIEW':kind==='later'?'LATER':'NEEDS REVIEW';return `<article class="or-medication-queue-row ${r.status} timing-${kind}" data-plan-index="${r.planIndex}"><div class="or-medication-queue-drug"><span>${escapeHtml(phase)}</span><b>${escapeHtml(d.name||'Medication')}</b><small>${escapeHtml(detail)}</small></div><div class="or-medication-queue-state">${kind==='documented'?`<b>${stateText}</b>`:`<span class="or-medication-timing ${kind}">${stateText}</span><button class="btn or-medication-record-btn" type="button" data-plan-index="${r.planIndex}">Record</button>`}</div></article>`}).join('')}${rows.length>visible.length?`<div class="or-medication-queue-more">+${rows.length-visible.length} more in ${escapeHtml(label.toLowerCase())} • open All medications</div>`:''}</div>`;
  return{html,shown:visible.length};
}
let medicationQueueUserExpanded=false;
function setMedicationQueueExpanded(expanded){
  medicationQueueUserExpanded=!!expanded;
  renderOrMedicationQueue();
}
function renderOrMedicationQueue(){
  const panel=$('orMedicationQueue'),list=$('orMedicationQueueList'),badge=$('orMedicationQueueBadge'),next=$('orMedicationQueueNextBtn'),all=$('orMedicationQueueAllBtn'),hint=$('orMedicationQueueHint'),toggle=$('orMedicationQueueToggleBtn');if(!panel||!list||!badge||!next)return;
  const started=!!state.caseStartedAt,{rows,review,later,documented}=medicationQueueSummary();panel.hidden=!started||!rows.length||state.caseLocked;
  if(panel.hidden){medicationQueueUserExpanded=false;return;}
  const needsReview=review.length>0,hasPendingPlan=needsReview||later.length>0,expanded=hasPendingPlan||medicationQueueUserExpanded;
  panel.classList.toggle('compact',!expanded);
  list.hidden=!expanded;
  const actions=panel.querySelector('.or-medication-queue-actions');if(actions)actions.hidden=!expanded;
  if(toggle){toggle.hidden=hasPendingPlan;toggle.textContent=expanded?'Hide plan':'View plan';toggle.setAttribute('aria-expanded',expanded?'true':'false');}
  if(review.length&&later.length){badge.textContent=`${review.length} NEED REVIEW • ${later.length} LATER`;badge.className='status-pill warn';}
  else if(review.length){badge.textContent=`${review.length} NEED REVIEW`;badge.className='status-pill warn';}
  else if(later.length){badge.textContent=`CURRENT CLEAR • ${later.length} LATER`;badge.className='status-pill neutral';}
  else{badge.textContent='CURRENT CLEAR • PLAN DOCUMENTED';badge.className='status-pill good';}
  if(hint){
    if(review.length)hint.textContent=`${documented.length} documented • ${review.length} planned administration${review.length===1?'':'s'} need review/documentation for the current or earlier phase${later.length?` • ${later.length} planned for later`:''}.`;
    else if(later.length)hint.textContent=`${later.length} planned medication${later.length===1?'':'s'} for a later phase • Record administration when given; planned timing is a reference.`;
    else hint.textContent=`Current phase clear • all ${rows.length} routine planned medication${rows.length===1?'':'s'} documented. Open only when you need the full plan.`;
  }
  let html='';
  html+=renderMedicationQueueGroup('NEEDS REVIEW',review,'review',review.length).html;
  html+=renderMedicationQueueGroup('PLANNED • LATER PHASE',later,'later',later.length).html;
  html+=renderMedicationQueueGroup('DOCUMENTED',documented,'documented',2).html;
  list.innerHTML=html||'<div class="empty-state compact">No routine planned medications to review.</div>';
  next.hidden=!review.length;next.disabled=!review.length;next.textContent=review.length?`💉 Review next • ${review[0].item.name}`:'✓ Current phase clear';
  if(all)all.textContent=review.length?'All medications':'Open medication workspace';
}
function openPlannedMedicationRow(row){
  if(!row?.item)return;const phase=String(row.item.phase||'');openOrQuickDrug({phase,purpose:phase==='induction'?'induction':'planned',drugId:row.item.id});
}
function inductionDrugRecorded(){return inductionMedicationRecords().length>0}
function inductionMedicationComplete(){
  if(state.inductionDocumentationMode==='deferred-v1472')return !!state.inductionMedicationReviewCompletedAt;
  return !!state.inductionMedicationReviewCompletedAt||inductionDrugRecorded();
}
function airwayRecorded(){return !!($('airwayEttSize')?.value||$('airwayCircuit')?.value||$('airwayDifficulty')?.value||hasProcedureMilestone('Intubation'))}
function triggerOrMilestone(label){
  const btn=[...document.querySelectorAll('.or-milestone')].find(x=>x.dataset.label===label);
  if(!btn)return false;markMilestone(btn);renderOrLive();return true;
}
function copyValue(from,to){const a=$(from),b=$(to);if(a&&b)b.value=a.value||''}
function openAirwayWorkflow(context='edit'){
  if(!clinicalWriteAllowed())return;
  airwayWorkflowContext=context==='intubation'?'':'edit';
  window.ANESVET_OR_WORKSPACE?.setView?.('airway',{scroll:true});
  const box=$('orAirwayPanelDetails');
  if(box){box.open=true;window.ANESVET_WORKSPACE_OWNER?.openForElement?.(box,{persist:false,scroll:false})}
  requestAnimationFrame(()=>{if(window.ANESVET_MOBILE_OR_OWNER?.editing?.())return;$('airwayEttSize')?.focus?.({preventScroll:true})});
}
function renderOrPrimaryFlow(){
  const title=$('orPrimaryActionTitle'),help=$('orPrimaryActionHelp'),primary=$('orPrimaryActionBtn'),secondary=$('orSecondaryPhaseBtn'),drug=$('orPrimaryDrugBtn'),stickyDrug=$('orStickyDrugBtn'),stepCounter=$('orPrimaryStepCounter'),docNote=$('orPrimaryDocumentationNote');if(!title||!help||!primary)return;
  const phase=state.caseLocked?'locked':(state.casePhase||'setup'),started=!!state.caseStartedAt,pendingInduction=started&&!inductionMedicationComplete(),reviewNow=started?reviewNowPlannedMedicationRows().length:0,laterPlanned=started?laterPlannedMedicationRows().length:0,profile=activeWorkflowProfile();
  const stepMeta={setup:'STEP 1 OF 5 • SETUP',induction:'STEP 2 OF 5 • INDUCTION',intraop:'STEP 3 OF 5 • SURGERY',emergence:'STEP 4 OF 5 • EMERGENCE',emergency:'URGENT • OR RETURN',recovery:'STEP 5 OF 5 • RECOVERY',complete:'WORKFLOW COMPLETE',locked:'FINAL RECORD'};
  if(stepCounter)stepCounter.textContent=stepMeta[phase]||'CURRENT STEP';
  primary.disabled=false;primary.hidden=false;secondary.hidden=true;secondary.textContent='';drug.hidden=true;if(stickyDrug){stickyDrug.hidden=!started||['recovery','complete','locked'].includes(phase);stickyDrug.classList.toggle('pending',reviewNow>0);stickyDrug.textContent=reviewNow?`💉 MEDS • ${reviewNow} review`:'💉 MEDS';}
  if(docNote){docNote.hidden=!started||!reviewNow||['setup','recovery','complete','locked'].includes(phase);docNote.textContent=reviewNow?`Documentation remaining • ${reviewNow} planned medication record${reviewNow===1?'':'s'} need review • does not block the next clinical step${laterPlanned?` • ${laterPlanned} later`:''}`:'';}
  let t='Current step',h='',label='',action='';
  if(phase==='setup'){t='Start induction';h='กดครั้งเดียวเพื่อ timestamp Induction + เริ่มจับเวลา • ปริมาณยาค่อยลงย้อนหลังได้หลัง airway stable';label='▶ Start induction';action='start-induction';}
  else if(phase==='induction'){
    drug.hidden=false;drug.textContent=pendingInduction?'💉 Induction meds • ใส่ทีหลัง':'💉 Medications';drug.dataset.mode=pendingInduction?'induction':'generic';
    if(!airwayRecorded()){t='Intubation';h='กดเพื่อบันทึกเวลา Intubation เท่านั้น • รายละเอียด ETT / ventilator / fluid ค่อยลงเมื่อผู้ป่วย stable';label='🫁 Intubation';action='airway';}
    else{t='Ready for surgery';h=reviewNow?'Intubation ถูกบันทึกแล้ว • เริ่มผ่าตัดได้ • รายละเอียดยา/airway ค่อยทบทวนภายหลังได้':'Intubation ถูกบันทึกแล้ว — กดเมื่อเริ่มผ่าตัด';label='▶ Surgery start';action='surgery-start';secondary.hidden=false;secondary.textContent='✎ Airway details';secondary.dataset.action='airway-edit';}
  }else if(phase==='intraop'){
    drug.hidden=false;drug.textContent=reviewNow?`💉 Medications • ${reviewNow} review`:'💉 Medications';drug.dataset.mode=pendingInduction?'induction':'generic';
    if(profile==='csection'&&!workflowEvent('First neonate delivered')){t='C-section • delivery';h='บันทึกเวลาลูกตัวแรกเมื่อถูกนำออก เพื่อให้ timeline คำนวณจาก induction อัตโนมัติ';label='👶 First neonate delivered';action='first-neonate';secondary.hidden=false;secondary.textContent='■ Surgery end';secondary.dataset.action='surgery-end';}
    else if(profile==='csection'&&!workflowEvent('Last neonate delivered')){t='C-section • delivery';h='ลูกตัวแรกถูกบันทึกแล้ว • บันทึกเวลาลูกตัวสุดท้าย หรือจบการผ่าตัดตาม clinical workflow จริง';label='👶 Last neonate delivered';action='last-neonate';secondary.hidden=false;secondary.textContent='■ Surgery end';secondary.dataset.action='surgery-end';}
    else{t='Intraoperative';h=reviewNow?'บันทึก vitals ตามปกติ • Medication queue แยกรายการที่ต้องทบทวนตอนนี้ออกจากยาที่วางไว้สำหรับภายหลัง':'บันทึก vitals จาก RECORD NOW • MEDS ใช้ลงยาเพิ่มเติมได้ตลอดเคส';label='■ Surgery end';action='surgery-end';}
  }
  else if(phase==='emergence'){const intubated=airwayRecorded();t='Emergence';h=intubated?'กดเมื่อถอดท่อแล้ว ระบบจะสร้าง Recovery handoff และเข้า Recovery':'ไม่มี airway/intubation record — สามารถเริ่ม Recovery ได้โดยตรง';label=intubated?'🫁 Extubation → Recovery':'→ Begin Recovery';action=intubated?'extubation':'recovery';drug.hidden=false;drug.textContent=reviewNow?`💉 Medications • ${reviewNow} review`:'💉 Medications';drug.dataset.mode=pendingInduction?'induction':'generic';}
  else if(phase==='emergency'){t='Emergency return';h='OR LIVE ใช้งานได้สำหรับ resuscitation / airway / medication';label='→ Return to Recovery';action='recovery';drug.hidden=false;drug.textContent='💉 Medications';drug.dataset.mode='generic';}
  else if(phase==='recovery'){t='Recovery active';h='บันทึก recovery vitals • หากมีการให้ยาเพิ่มใช้ปุ่ม Medication ในหน้า Recovery';label='Open Recovery';action='open-recovery';}
  else if(phase==='complete'){t='Recovery complete';h='ดำเนินการ Final review / End Case';label='Go to End Case';action='end-case';}
  else if(phase==='locked'){t='Final record locked';h='เคสนี้เป็น LOCKED FINAL';label='Locked';action='locked';primary.disabled=true;}
  title.textContent=t;help.textContent=h;primary.textContent=label;primary.dataset.action=action;
}
const OR_WORKFLOW_ACTION_META={
  'start-induction':{title:'Start induction?',context:'Start anesthesia case timer and record the Induction milestone.',confirm:'Confirm induction',undoLabel:'Start induction'},
  intubation:{undoLabel:'Intubation'},
  'surgery-start':{title:'Start surgery?',context:'Record Surgery start and move the case to INTRAOPERATIVE.',confirm:'Confirm surgery start',undoLabel:'Surgery start'},
  'first-neonate':{title:'Record first neonate?',context:'Timestamp First neonate delivered for the C-section timeline.',confirm:'Confirm first neonate',undoLabel:'First neonate'},
  'last-neonate':{title:'Record last neonate?',context:'Timestamp Last neonate delivered for the C-section timeline.',confirm:'Confirm last neonate',undoLabel:'Last neonate'},
  'surgery-end':{title:'End surgery?',context:'Record Surgery end and move the case to EMERGENCE.',confirm:'Confirm surgery end',undoLabel:'Surgery end'},
  extubation:{title:'Extubation complete?',context:'Record Extubation and move directly into RECOVERY.',confirm:'Confirm extubation',undoLabel:'Extubation → Recovery'},
  recovery:{title:'Begin recovery?',context:'Move this case into RECOVERY and record a recovery-start timestamp.',confirm:'Confirm recovery',undoLabel:'Begin recovery'}
};
let pendingOrWorkflowAction='';
function orWorkflowActionMeta(action){return OR_WORKFLOW_ACTION_META[action]||null}
function closeOrStepConfirm(){const d=$('orStepConfirmDialog');pendingOrWorkflowAction='';if(d?.open){try{d.close()}catch(e){d.removeAttribute('open')}}}
function openOrStepConfirm(action){
  const meta=orWorkflowActionMeta(action);if(!meta)return false;pendingOrWorkflowAction=action;
  const patient=$('patientName')?.value.trim()||'Unnamed patient',phase=phaseLabel(),clock=formatClock();
  if($('orStepConfirmTitle'))$('orStepConfirmTitle').textContent=meta.title;
  if($('orStepConfirmText'))$('orStepConfirmText').textContent=meta.context;
  if($('orStepConfirmContext'))$('orStepConfirmContext').textContent=`${patient} • ${phase} • ${clock}`;
  if($('orStepConfirmGoBtn'))$('orStepConfirmGoBtn').textContent=meta.confirm;
  const d=$('orStepConfirmDialog');if(!d)return false;try{if(!d.open)d.showModal()}catch(e){d.setAttribute('open','')}return true;
}
function deepCloneOrNull(v){try{return v==null?v:JSON.parse(JSON.stringify(v))}catch(e){return null}}
function captureOrWorkflowUndo(action){
  const meta=orWorkflowActionMeta(action)||{undoLabel:action};
  return {
    id:crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random()),action,label:meta.undoLabel||action,epoch:Date.now(),quickUntil:Date.now()+90000,undoUntil:Date.now()+300000,
    before:{
      casePhase:state.casePhase||'setup',caseStartedAt:state.caseStartedAt??null,surgeryEndedAt:state.surgeryEndedAt??null,extubatedAt:state.extubatedAt??null,
      recoveryStartedAt:state.recoveryStartedAt??null,recoveryCompletedAt:state.recoveryCompletedAt??null,emergencyReturnActive:!!state.emergencyReturnActive,
      timer:deepCloneOrNull(state.timer),protocolSnapshot:deepCloneOrNull(state.protocolSnapshot),caseIdentitySnapshot:deepCloneOrNull(state.caseIdentitySnapshot),procedureTemplateSnapshot:deepCloneOrNull(state.procedureTemplateSnapshot),inductionDocumentationMode:state.inductionDocumentationMode??null,
      inductionMedicationReviewCompletedAt:state.inductionMedicationReviewCompletedAt??null,inductionProvisionalAdministrations:deepCloneOrNull(state.inductionProvisionalAdministrations||[]),recExtubation:$('recExtubation')?.value||'',handoffLength:(state.recoveryHandoffs||[]).length
    },
    beforeEventIds:(state.events||[]).map(e=>String(e.id))
  };
}
function commitOrWorkflowUndo(tx){
  if(!tx)return;const before=new Set(tx.beforeEventIds||[]);tx.createdEventIds=(state.events||[]).filter(e=>!before.has(String(e.id))).map(e=>String(e.id));delete tx.beforeEventIds;
  state.orLastTransition=tx;addAudit('WORKFLOW_STEP_CONFIRMED',`${tx.label} • Undo available for 5 minutes or until another workflow step replaces it`);save();renderOrUndoControls();
}
function orUndoAvailable(){return !!(state.orLastTransition&&!state.caseLocked&&Date.now()<=Number(state.orLastTransition.undoUntil||0))}
function renderOrUndoControls(){
  const tx=state.orLastTransition,available=orUndoAvailable(),label=tx?.label||'last workflow step',quick=available&&Date.now()<=Number(tx.quickUntil||0);
  const quickBtn=$('orUndoStepBtn');if(quickBtn){quickBtn.hidden=!quick;quickBtn.textContent=`↶ Undo • ${label}`;}
  const moreBtn=$('orMobileUndoBtn');if(moreBtn){moreBtn.hidden=!available;moreBtn.textContent=`↶ Undo last step • ${label}`;}
  const recoveryRelated=available&&['extubation','recovery'].includes(tx?.action),recoveryBtn=$('recoveryUndoStepBtn'),recoveryMoreBtn=$('recoveryMoreUndoBtn');
  if(recoveryBtn){recoveryBtn.hidden=!recoveryRelated;recoveryBtn.textContent=`↶ Undo • ${label}`;}
  if(recoveryMoreBtn){recoveryMoreBtn.hidden=!recoveryRelated;recoveryMoreBtn.textContent=`↶ Undo • ${label}`;}
}
function hasPostTransitionClinicalData(tx){
  const t=Number(tx?.epoch||0);if(!t)return false;
  const after=x=>Number(x?.epoch||0)>t+250;
  if(tx.action==='start-induction')return (state.records||[]).some(after)||(state.drugAdministrations||[]).some(after)||(state.complications||[]).some(after)||(state.recoveryRecords||[]).some(after)||(state.events||[]).some(e=>after(e)&&!(tx.createdEventIds||[]).includes(String(e.id)));
  if(['extubation','recovery'].includes(tx.action))return (state.recoveryRecords||[]).some(after)||(state.recoveryScores||[]).some(after);
  return false;
}
function undoLastOrWorkflowStep(){
  if(!orUndoAvailable()){toast('No workflow step available to undo');return false}
  const tx=state.orLastTransition;if(hasPostTransitionClinicalData(tx)){toast('Undo blocked: clinical data was recorded after this step. Use the documented correction / emergency workflow instead.');return false}
  if(!confirmFn(`Undo last workflow step?\n${tx.label}\n\nThe original action and this undo remain in the audit trail.`))return false;
  const b=tx.before||{},created=new Set((tx.createdEventIds||[]).map(String));
  state.events=(state.events||[]).filter(e=>!created.has(String(e.id)));
  state.casePhase=b.casePhase||'setup';state.caseStartedAt=b.caseStartedAt??null;state.surgeryEndedAt=b.surgeryEndedAt??null;state.extubatedAt=b.extubatedAt??null;
  state.recoveryStartedAt=b.recoveryStartedAt??null;state.recoveryCompletedAt=b.recoveryCompletedAt??null;state.emergencyReturnActive=!!b.emergencyReturnActive;
  if(b.timer)state.timer=deepCloneOrNull(b.timer)||state.timer;state.protocolSnapshot=deepCloneOrNull(b.protocolSnapshot);state.caseIdentitySnapshot=deepCloneOrNull(b.caseIdentitySnapshot);state.procedureTemplateSnapshot=deepCloneOrNull(b.procedureTemplateSnapshot);
  state.inductionDocumentationMode=b.inductionDocumentationMode??null;state.inductionMedicationReviewCompletedAt=b.inductionMedicationReviewCompletedAt??null;state.inductionProvisionalAdministrations=deepCloneOrNull(b.inductionProvisionalAdministrations)||[];
  if(Array.isArray(state.recoveryHandoffs)&&Number.isInteger(Number(b.handoffLength)))state.recoveryHandoffs=state.recoveryHandoffs.slice(0,Number(b.handoffLength));
  if($('recExtubation'))$('recExtubation').value=b.recExtubation||'';state.recExtubation=b.recExtubation||'';
  const undoneLabel=tx.label;state.orLastTransition=null;addAudit('WORKFLOW_STEP_UNDONE',undoneLabel);save();if(state.timer?.running)startTimerLoop();else clearTimerLoop();renderTimerState();renderCasePhase();renderRecoveryState();renderRecovery();renderEvents();renderProcedureTimeline();renderProcedureTemplatePicker();renderOrLive();renderOrUndoControls();
  if(['extubation','recovery'].includes(tx.action))setTab('orlive',{force:true});
  toast(`Undone • ${undoneLabel}`);return true;
}
function runOrWorkflowMutation(action,fn){const tx=captureOrWorkflowUndo(action);const changed=fn();if(changed===false)return false;commitOrWorkflowUndo(tx);return true}
$('orStepConfirmCancelBtn')?.addEventListener('click',closeOrStepConfirm);
$('orStepConfirmDialog')?.addEventListener('click',e=>{if(e.target===$('orStepConfirmDialog'))closeOrStepConfirm()});
$('orStepConfirmGoBtn')?.addEventListener('click',()=>{const action=pendingOrWorkflowAction;closeOrStepConfirm();if(action)handleOrWorkflowAction(action,{confirmed:true})});
$('orUndoStepBtn')?.addEventListener('click',undoLastOrWorkflowStep);$('orMobileUndoBtn')?.addEventListener('click',()=>{closeOrMoreDialog();undoLastOrWorkflowStep()});$('recoveryUndoStepBtn')?.addEventListener('click',undoLastOrWorkflowStep);
function handleOrWorkflowAction(action,{confirmed=false}={}){
  if(orWorkflowActionMeta(action)&&!confirmed){openOrStepConfirm(action);return}
  if(action==='start-induction'){
    runOrWorkflowMutation(action,()=>{
      if(!startCaseFromOr())return false;
      if(!hasProcedureMilestone('Induction'))triggerOrMilestone('Induction');
      state.inductionDocumentationMode='deferred-v1472';state.inductionMedicationReviewCompletedAt=null;
      const assumed=window.ANESVET_MEDICATION_WORKSPACE?.markPreparedInductionGivenAtMilestone?.()||[];
      save();renderOrPrimaryFlow();toast(assumed.length?`Induction saved • ${assumed.length} prepared induction medication${assumed.length===1?'':'s'} marked given • details later`:'Induction timestamp saved');return true;
    });return;
  }
  if(action==='induction-drug'){openOrQuickDrug({phase:'induction',purpose:'induction'});return}
  if(action==='airway'){
    if(!state.caseStartedAt&&!startCaseFromOr())return;
    runOrWorkflowMutation('intubation',()=>{
      if(!hasProcedureMilestone('Induction'))triggerOrMilestone('Induction');
      if(hasProcedureMilestone('Intubation'))return false;
      const changed=triggerOrMilestone('Intubation');
      if(changed!==false){save({reason:'workflow:intubation-timestamp'});renderOrPrimaryFlow();toast('Intubation timestamp saved • รายละเอียด airway ค่อยลงเมื่อ stable');}
      return changed;
    });return;
  }
  if(action==='airway-edit'){if(!state.caseStartedAt&&!startCaseFromOr())return;openAirwayWorkflow('edit');return}
  if(action==='surgery-start'){
    runOrWorkflowMutation(action,()=>{if(!hasProcedureMilestone('Induction'))triggerOrMilestone('Induction');return triggerOrMilestone('Surgery start')});return;
  }
  if(action==='first-neonate'){runOrWorkflowMutation(action,()=>recordWorkflowEvent('First neonate delivered','C-section','Delivery milestone'));return}
  if(action==='last-neonate'){runOrWorkflowMutation(action,()=>recordWorkflowEvent('Last neonate delivered','C-section','Delivery milestone'));return}
  if(action==='surgery-end'){runOrWorkflowMutation(action,()=>triggerOrMilestone('Surgery end'));return}
  if(action==='extubation'){runOrWorkflowMutation(action,()=>triggerOrMilestone('Extubation'));return}
  if(action==='recovery'){runOrWorkflowMutation(action,()=>beginRecovery({skipConfirm:true}));return}
  if(action==='open-recovery'){setTab('recovery',{force:true});return}
  if(action==='end-case'){setTab('endcase');return}
}
$('orPrimaryActionBtn')?.addEventListener('click',()=>handleOrWorkflowAction($('orPrimaryActionBtn').dataset.action));
$('orSecondaryPhaseBtn')?.addEventListener('click',()=>handleOrWorkflowAction($('orSecondaryPhaseBtn').dataset.action));
$('orPrimaryDrugBtn')?.addEventListener('click',()=>$('orPrimaryDrugBtn').dataset.mode==='induction'?openOrQuickDrug({phase:'induction',purpose:'induction'}):openOrQuickDrug());
$('orStickyDrugBtn')?.addEventListener('click',()=>inductionMedicationComplete()?openOrQuickDrug():openOrQuickDrug({phase:'induction',purpose:'induction'}));
$('orMedicationQueueNextBtn')?.addEventListener('click',()=>{const row=reviewNowPlannedMedicationRows()[0];if(row)openPlannedMedicationRow(row)});
$('orMedicationQueueToggleBtn')?.addEventListener('click',()=>setMedicationQueueExpanded(!medicationQueueUserExpanded));
$('orMedicationQueueAllBtn')?.addEventListener('click',()=>openOrQuickDrug());
$('orMedicationQueueList')?.addEventListener('click',e=>{const b=e.target.closest?.('.or-medication-record-btn');if(!b)return;const idx=Number(b.dataset.planIndex),row=plannedRoutineMedicationRows().find(r=>r.planIndex===idx);if(row)openPlannedMedicationRow(row)});
document.addEventListener('anesvet:drug-administration-changed',()=>{renderOrMedicationQueue();renderOrPrimaryFlow();if(state.casePhase==='intraop')renderOrQuickMedStrip()});
document.addEventListener('anesvet:induction-provisional-changed',()=>{renderOrMedicationQueue();renderOrPrimaryFlow();if(state.casePhase==='intraop')renderOrQuickMedStrip()});
$('orContextActions')?.addEventListener('click',e=>{
  const b=e.target.closest('[data-workflow-action]');if(!b)return;const action=b.dataset.workflowAction;
  if(action==='meds'){if(!state.caseStartedAt){toast('Start case before medication documentation');return}openOrQuickDrug();return}
  if(action==='record'){if(!state.caseStartedAt&&!startCaseFromOr())return;addRecord('');renderOrLive();return}
  if(action==='stabilization'){recordPreAnestheticWorkflowEvent('Stabilization checkpoint','Stabilization','Clinician-documented stabilization workflow checkpoint');return}
  if(action==='support-event'){recordPreAnestheticWorkflowEvent('Critical care support event','Support','Clinician-documented support workflow checkpoint');return}
  if(action==='first-neonate'){handleOrWorkflowAction('first-neonate');return}
  if(action==='last-neonate'){handleOrWorkflowAction('last-neonate');return}
  if(action==='neonatal-support'){if(!clinicalWriteAllowed())return;addEvent({category:'Neonatal',name:'Neonatal support event',note:'C-section workflow timestamp'});renderOrLive();return}
});

function renderAirwayPanel(){
  const mode=$('airwayVentMode')?.value||'';
  if($('ventilatorFields'))$('ventilatorFields').hidden=!['Manual PPV','Mechanical ventilation'].includes(mode);
  const recorded=!!($('airwayEttSize')?.value||$('airwayCircuit')?.value||$('airwayDifficulty')?.value||hasProcedureMilestone('Intubation'));
  if($('airwayStatus')){$('airwayStatus').textContent=recorded?'RECORDED':'NOT RECORDED';$('airwayStatus').className=`status-pill ${recorded?'good':'warn'}`;}
  const bits=[];if($('airwayEttSize')?.value)bits.push(`ETT ${$('airwayEttSize').value} mm`);if($('airwayDifficulty')?.value)bits.push($('airwayDifficulty').value);if($('airwayAttempts')?.value)bits.push(`${$('airwayAttempts').value} attempt${$('airwayAttempts').value==='1'?'':'s'}`);if(mode)bits.push(mode);
  if($('orAirwaySummary'))$('orAirwaySummary').textContent=recorded?(bits.join(' • ')||'Intubation recorded'):'ยังไม่ได้บันทึก airway';
  renderOrPrimaryFlow();
}
function setVentilationMode(mode,{persist=true}={}){
  const allowed=['','Spontaneous','Manual PPV','Mechanical ventilation'];
  mode=allowed.includes(String(mode||''))?String(mode||''):'';
  const airway=$('airwayVentMode'),orMirror=$('orVentilation'),master=$('ventilation');
  if(airway)airway.value=mode;
  if(orMirror)orMirror.value=mode;
  if(master){master.value=mode;master.dispatchEvent(new Event('change',{bubbles:true}))}
  if($('ventilatorFields'))$('ventilatorFields').hidden=!['Manual PPV','Mechanical ventilation'].includes(mode);
  renderAirwayPanel();
  if(persist)save({reason:'ventilation-mode'});
  try{document.dispatchEvent(new CustomEvent('anesvet:ventilation-mode-changed',{detail:{mode}}))}catch(_){ }
  return mode;
}
$('airwayVentMode')?.addEventListener('change',()=>setVentilationMode($('airwayVentMode')?.value||''));
['airwayEttSize','airwayEttDepth','airwayCuff','airwayDifficulty','airwayAttempts','airwayCircuit','airwayNote','airwayVt','airwayPip','airwayPeep','airwayVentRr'].forEach(id=>{
  const el=$(id);if(!el)return;const eventName=el.tagName==='SELECT'?'change':'input';el.addEventListener(eventName,()=>{renderAirwayPanel();if(eventName==='change')save({reason:`airway:${id}`});else scheduleAutosave(`airway:${id}`)});
});

function setupHardwareClamp(value,min,max,step){const n=Number(value);if(!Number.isFinite(n))return min;return Math.min(max,Math.max(min,Math.round(n/step)*step))}
function renderSetupHardware(){
  const vap=setupHardwareClamp($('setupVaporizer')?.value||0,0,5,.1),o2=setupHardwareClamp($('setupO2')?.value||0,0,10,.1);
  if($('setupVaporizer'))$('setupVaporizer').value=vap.toFixed(1);if($('setupVaporizerDial'))$('setupVaporizerDial').value=vap;
  if($('setupVaporizerReadout'))$('setupVaporizerReadout').textContent=vap<=0?'OFF':`${vap.toFixed(1)}%`;
  if($('setupVaporizerKnob'))$('setupVaporizerKnob').style.setProperty('--dial-angle',`${-135+(vap/5)*270}deg`);
  if($('setupO2'))$('setupO2').value=o2.toFixed(1);if($('setupO2Slider'))$('setupO2Slider').value=o2;
  if($('setupO2Float'))$('setupO2Float').style.setProperty('--flow-level',`${(o2/10)*100}%`);
}
function setSetupHardware(kind,value){
  const input=$(kind==='vap'?'setupVaporizer':'setupO2');if(!input)return;
  input.value=setupHardwareClamp(value,0,kind==='vap'?5:10,.1).toFixed(1);renderSetupHardware();
}
$('setupVaporizerDial')?.addEventListener('input',e=>setSetupHardware('vap',e.target.value));
$('setupO2Slider')?.addEventListener('input',e=>setSetupHardware('o2',e.target.value));
$('setupVaporizer')?.addEventListener('input',e=>setSetupHardware('vap',e.target.value));
$('setupO2')?.addEventListener('input',e=>setSetupHardware('o2',e.target.value));
$('setupVaporizerMinus')?.addEventListener('click',()=>setSetupHardware('vap',Number($('setupVaporizer')?.value||0)-.1));
$('setupVaporizerPlus')?.addEventListener('click',()=>setSetupHardware('vap',Number($('setupVaporizer')?.value||0)+.1));
$('setupO2Minus')?.addEventListener('click',()=>setSetupHardware('o2',Number($('setupO2')?.value||0)-.1));
$('setupO2Plus')?.addEventListener('click',()=>setSetupHardware('o2',Number($('setupO2')?.value||0)+.1));

function closeAirwaySetup(){
  const dlg=$('orAirwaySetupDialog');if(!dlg)return;
  dlg.classList.remove('is-open');dlg.hidden=true;document.body.classList.remove('airway-setup-open');
}
$('orAirwaySetupClose')?.addEventListener('click',closeAirwaySetup);
$('orAirwaySetupLater')?.addEventListener('click',closeAirwaySetup);
$('orAirwaySetupDialog')?.addEventListener('click',e=>{if(e.target===$('orAirwaySetupDialog'))closeAirwaySetup()});

$('setupOpenInductionMeds')?.addEventListener('click',()=>{closeAirwaySetup();openOrQuickDrug({phase:'induction',purpose:'induction'})});
$('saveAirwaySetupBtn')?.addEventListener('click',()=>{
  if(!clinicalWriteAllowed())return;
  [['setupEttSize','airwayEttSize'],['setupEttDepth','airwayEttDepth'],['setupCuff','airwayCuff'],['setupDifficulty','airwayDifficulty'],['setupCircuit','airwayCircuit'],['setupVentMode','airwayVentMode'],['setupPip','airwayPip'],['setupPeep','airwayPeep'],['setupVt','airwayVt'],['setupVentRr','airwayVentRr'],['setupVaporizer','vaporizer'],['setupO2','o2flow'],['setupFluidRate','fluidRateInput'],['setupFluidActual','fluidActualTotal']].forEach(([a,b])=>copyValue(a,b));
  if($('orVaporizer'))$('orVaporizer').value=$('vaporizer')?.value||'';
  if($('orO2'))$('orO2').value=$('o2flow')?.value||'';
  if($('orVentilation'))$('orVentilation').value=$('airwayVentMode')?.value||'';
  if($('orFluidManageRate'))$('orFluidManageRate').value=$('fluidRateInput')?.value||'';
  save({reason:'airway-anesthesia-setup'});renderAirwayPanel();renderOrFluidPanel?.();
  const parts=[];if($('airwayEttSize')?.value)parts.push(`ETT ${$('airwayEttSize').value} mm`);if($('airwayEttDepth')?.value)parts.push(`depth ${$('airwayEttDepth').value} cm`);if($('airwayDifficulty')?.value)parts.push($('airwayDifficulty').value);if($('airwayVentMode')?.value)parts.push($('airwayVentMode').value);
  addEvent({category:'Airway',name:'Airway / anesthesia setup saved',note:parts.join(' • ')||'Airway / anesthesia setup saved'});
  if(airwayWorkflowContext==='intubation'){if(!hasProcedureMilestone('Induction'))triggerOrMilestone('Induction');if(!hasProcedureMilestone('Intubation'))triggerOrMilestone('Intubation')}
  airwayWorkflowContext='';
  closeAirwaySetup();
  renderOrPrimaryFlow();renderOrLive();
  toast('บันทึก Airway / anesthesia setup แล้ว');
});
$('saveAirwayBtn')?.addEventListener('click',()=>{
  save();renderAirwayPanel();
  const parts=[];if($('airwayEttSize').value)parts.push(`ETT ${$('airwayEttSize').value} mm`);if($('airwayEttDepth').value)parts.push(`depth ${$('airwayEttDepth').value} cm`);if($('airwayDifficulty').value)parts.push($('airwayDifficulty').value);if($('airwayAttempts')?.value)parts.push(`${$('airwayAttempts').value} attempt${$('airwayAttempts').value==='1'?'':'s'}`);if($('airwayNote')?.value)parts.push($('airwayNote').value);if($('airwayVentMode').value)parts.push($('airwayVentMode').value);
  addEvent({category:'Airway',name:'Airway record updated',note:parts.join(' • ')||'Airway record updated'});
  if(airwayWorkflowContext==='intubation'){if(!hasProcedureMilestone('Induction'))triggerOrMilestone('Induction');if(!hasProcedureMilestone('Intubation'))triggerOrMilestone('Intubation');}
  airwayWorkflowContext='';
  const airwayBox=$('orAirwayPanelDetails');if(airwayBox)airwayBox.open=window.ANESVET_OR_WORKSPACE?.getView?.()==='airway';
  renderOrPrimaryFlow();window.ANESVET_OR_WORKSPACE?.updateBadges?.();toast('Airway details saved');
});
$('orVentilation')?.addEventListener('change',()=>setVentilationMode($('orVentilation')?.value||''));

function renderOrLive(){
  if(!$('orlive'))return;
  renderOrPhaseTracker();
  syncOrFromMain();
  root.ANESVET_OR_WORKSPACE?.renderHardware?.();
  const st=thresholds(),species=$('species').value,name=$('patientName').value.trim()||'Unnamed patient',breed=$('breed').value.trim(),weight=getVal('weight',0);
  $('orPatientName').textContent=name;$('orPatientMeta').textContent=`${species==='cat'?'Cat':species==='dog'?'Dog':'—'}${$('sex')?.value?' • '+({male:'M',female:'F'}[$('sex').value]||''):''}${$('reproductiveStatus')?.value?' '+({intact:'intact',neutered:'neutered',spayed:'spayed'}[$('reproductiveStatus').value]||''):''}${breed?' • '+breed:''}${$('age')?.value?' • '+$('age').value:''} • ${weight??'—'} kg`;
  $('orAsaBadge').textContent=`ASA ${$('asa').value}${$('emergency').checked?'-E':''}`;
  $('orProcedureLine').textContent=`Procedure: ${$('procedure').value.trim()||$('patientProcedure')?.value.trim()||'—'}`;
  if($('orTeamLine'))$('orTeamLine').textContent=`Team: Surgeon ${$('surgeon')?.value.trim()||'—'} • Anesthetist ${$('anesthetist')?.value.trim()||'—'} • Assistant ${$('surgicalAssistant')?.value.trim()||'—'}`;
  const riskParts=[];
  if($('patientAllergies')?.value.trim())riskParts.push(`Allergy: ${$('patientAllergies').value.trim()}`);
  if($('patientComorbidities')?.value.trim())riskParts.push(`Disease: ${$('patientComorbidities').value.trim()}`);
  if($('patientPrecautions')?.value.trim())riskParts.push(`Caution: ${$('patientPrecautions').value.trim()}`);
  const structuredRisks=preopRiskSummaryLabels({compact:true});if(structuredRisks.length)riskParts.push(`Risk flags: ${structuredRisks.join(', ')}`);
  if($('orRiskLine')){const airwayRisk=!!($('riskBrachycephalic')?.checked||$('riskBOAS')?.checked||$('riskDifficultAirway')?.checked||$('riskUpperAirway')?.checked||$('riskAspiration')?.checked);$('orRiskLine').hidden=!riskParts.length;$('orRiskLine').classList.toggle('airway-risk',airwayRisk);$('orRiskLine').textContent=riskParts.length?`${airwayRisk?'⚠ AIRWAY RISK • ':'⚠ '}${riskParts.join(' • ')}`:'';}
  if($('orStickyPatient'))$('orStickyPatient').textContent=`${name} • ${weight??'—'} kg`;if($('orStickyPhase'))$('orStickyPhase').textContent=phaseLabel();if($('orStickyClock'))$('orStickyClock').textContent=formatElapsed(currentElapsed());
    $('orPhaseBadge').textContent=phaseLabel();
  $('orPhaseBadge').className=`status-pill phase ${phaseClass()}`;
  $('orlive').classList.toggle('recovery-mode',state.casePhase==='recovery');
  $('orlive').classList.toggle('emergency-return-mode',state.casePhase==='emergency');
  $('orlive').classList.toggle('intraop-mode',state.casePhase==='intraop');
  renderWorkflowContext();
  renderTemplateQuickActions();
  const overall=$('globalStatus').textContent;$('orGlobalStatus').textContent=overall;$('orGlobalStatus').className=overall==='INTERVENE'?'or-status-danger':overall==='REASSESS'?'or-status-warn':overall==='NO DATA'?'or-status-neutral':'or-status-good';
  const latest=latestRecord();$('orLastRecord').textContent=latest?`${latest.clock} • ${formatShortElapsed(latest.elapsedMs)}`:'—';
  if(latest){
    const due=latest.epoch+Number($('recordInterval').value||5)*60000,delta=due-Date.now();
    $('orNextDue').textContent=delta<=0?`DUE +${formatShortElapsed(Math.abs(delta))}`:`in ${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;
    $('orNextDueClock').textContent=`clock ${formatClock(due)}`;
    $('orRecordNowBtn').classList.toggle('due',delta<=0);

    $('orRecordNowBtn').textContent=delta<=0?'🔴 RECORD DUE':`＋ RECORD NOW • ${Math.floor(delta/60000)}:${pad(Math.floor((delta%60000)/1000))}`;
  }else{
    const interval=Number($('recordInterval').value||5)*60000;
    if(state.caseStartedAt){
      const remaining=interval-currentElapsed(),dueNow=remaining<=0;
      $('orNextDue').textContent=dueNow?`FIRST DUE +${formatShortElapsed(Math.abs(remaining))}`:`first in ${Math.floor(remaining/60000)}:${pad(Math.floor((remaining%60000)/1000))}`;
      $('orNextDueClock').textContent=`case + ${Math.round(interval/60000)} min`;
      $('orRecordNowBtn').classList.toggle('due',dueNow);$('orRecordNowBtn').textContent=dueNow?'🔴 FIRST RECORD DUE':`＋ RECORD FIRST SET • ${Math.floor(remaining/60000)}:${pad(Math.floor((remaining%60000)/1000))}`;
    }else{$('orNextDue').textContent='Starts with case';$('orNextDueClock').textContent='—';$('orRecordNowBtn').classList.remove('due');$('orRecordNowBtn').textContent='＋ RECORD FIRST SET'}
  }
  if($('orStickyDue')){$('orStickyDue').textContent=$('orNextDue')?.textContent||'—';$('orStickyDue').classList.toggle('due',$('orRecordNowBtn')?.classList.contains('due'))}
  const vitalsFocus=$('orVitalsFocus'),monitoringActive=!!state.caseStartedAt&&!['recovery','complete','locked'].includes(state.casePhase||'');
  if(vitalsFocus)vitalsFocus.hidden=!monitoringActive;
  if(monitoringActive){
    if($('orVitalsFocusDue')){$('orVitalsFocusDue').textContent=$('orNextDue')?.textContent||'—';$('orVitalsFocusDue').classList.toggle('due',$('orRecordNowBtn')?.classList.contains('due'));}
    if($('orVitalsFocusLast'))$('orVitalsFocusLast').textContent=latest?`${latest.clock} • ${vitalRecordSummary(latest)}`:'No saved vitals yet';
    if($('orCopyLastVitalsBtn')){$('orCopyLastVitalsBtn').disabled=!latest;$('orCopyLastVitalsBtn').textContent='↻ FILL BLANKS';}
    const diff=renderOrVitalChangeState();
    if($('orVitalsFocusSaveBtn')){
      const due=$('orRecordNowBtn')?.classList.contains('due');$('orVitalsFocusSaveBtn').classList.toggle('due',due);
      $('orVitalsFocusSaveBtn').textContent='＋ บันทึก Vitals';$('orVitalsFocusSaveBtn').setAttribute('aria-label',due?'บันทึก Vitals ถึงเวลาบันทึกแล้ว':latest?`บันทึก Vitals เปลี่ยน ${diff.changed} ช่อง ว่าง ${diff.blank} ช่อง`:'บันทึก Vitals ชุดแรก');
    }
    renderOrQuickMedStrip();
  }else{renderOrVitalChangeState();}
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
  renderOrFluidPanel();renderOrMiniTrends();renderOrRecent();renderOrTimerState();renderSaveState();renderRecoveryState();renderComplications();renderAlertProtocolStatus();renderActiveProblems();renderAirwayPanel();renderOrMedicationQueue();renderOrPrimaryFlow();renderOrMobileDock();renderOrWorkspacePreferences();
}
function renderOrMobileDock(){
  const dock=$('orMobileDock'),next=$('orMobileNextBtn'),record=$('orMobileRecordBtn'),meds=$('orMobileMedsBtn'),primary=$('orPrimaryActionBtn'),label=$('orMobileNextLabel'),icon=$('orMobileNextIcon'),medsLabel=$('orMobileMedsLabel');
  const action=primary?.dataset.action||'start-induction',phase=state.casePhase||'setup',intraop=phase==='intraop';
  const actionUi={
    'start-induction':['▶','START INDUCTION'],airway:['🫁','INTUBATE / AIRWAY'],'surgery-start':['▶','START SURGERY'],
    'first-neonate':['👶','FIRST NEONATE'],'last-neonate':['👶','LAST NEONATE'],'surgery-end':['■','END SURGERY'],
    extubation:['🫁','EXTUBATE → RECOVERY'],recovery:['→','BEGIN RECOVERY'],'open-recovery':['→','OPEN RECOVERY'],
    'end-case':['✓','END CASE'],locked:['✓','LOCKED']
  };
  const ui=actionUi[action]||['▶','CONTINUE'];
  if(dock)dock.classList.toggle('intraop',intraop);
  // V17.11.3: keep the workflow transition visible during active surgery.
  // End Surgery previously disappeared from the mobile dock, forcing a scroll/More-menu detour.
  // Safety is preserved because phase-changing actions still use the existing confirmation dialog.
  if(next){next.hidden=false;next.disabled=!!primary?.disabled;next.classList.toggle('danger',phase==='emergency'||action==='surgery-end');next.classList.toggle('workflow-secondary',intraop);next.setAttribute('aria-label',`Next clinical step: ${ui[1]}`);}
  if(icon)icon.textContent=ui[0];if(label)label.textContent=ui[1];
  if(record){record.hidden=false;const due=!!$('orRecordNowBtn')?.classList.contains('due');record.classList.toggle('due',due);record.classList.toggle('primary',intraop);record.setAttribute('aria-label',intraop?'Record intraoperative vital signs':'Record vital signs');const b=record.querySelector('b');if(b)b.textContent=due?'RECORD VITALS • DUE':intraop?'RECORD VITALS':'VITALS';}
  if(meds){const review=state.caseStartedAt?reviewNowPlannedMedicationRows().length:0;meds.hidden=!intraop;meds.classList.toggle('pending',review>0);meds.setAttribute('aria-label',review?`Medications, ${review} planned medication record${review===1?'':'s'} need review`:'Medications');if(medsLabel)medsLabel.textContent=review?`MEDS • ${review}`:'MEDS';}
  const wf=$('orMobileWorkflowBtn'),wfLabel=$('orMobileWorkflowLabel'),wfHelp=$('orMobileWorkflowHelp');
  if(wf){wf.hidden=!intraop;wf.disabled=!!primary?.disabled;if(wfLabel)wfLabel.textContent=ui[1];if(wfHelp)wfHelp.textContent=intraop?'Workflow transition • confirmation required':'Confirm the next anesthesia phase';}
  renderOrUndoControls();
}
function openOrDetailsAndScroll(selector){
  const el=document.querySelector(selector);if(!el)return;el.open=true;requestAnimationFrame(()=>el.scrollIntoView({behavior:'smooth',block:'center'}));
}
function startCaseFromOr(){if(!clinicalWriteAllowed())return false;if(state.timer.running)return true;if(!validateCaseReadyToStart())return false;if(!state.caseStartedAt&&!confirmCaseDrugPlanBeforeStart())return false;const firstStart=(state.timer.elapsedMs||0)===0&&!state.caseStartedAt;state.timer.running=true;state.timer.startedEpoch=Date.now();if(firstStart){state.caseStartedAt=state.timer.startedEpoch;state.casePhase='induction';state.caseIdentitySnapshot={patientMasterId:state.patientMasterId||$('patientMasterId')?.value||'',patientName:$('patientName')?.value.trim()||state.patientName||'',hospitalId:$('hospitalId')?.value.trim()||state.hospitalId||'',visitId:$('visitId')?.value.trim()||state.visitId||'',species:$('species')?.value||state.species||'',microchip:$('microchip')?.value.trim()||state.microchip||'',weight:Number($('weight')?.value||state.weight)||null,capturedAt:state.timer.startedEpoch};state.procedureTemplateId=$('procedureTemplateId')?.value||state.procedureTemplateId||'custom';state.procedureTemplateSnapshot=PROCEDURE_TEMPLATES.snapshot({id:state.procedureTemplateId,procedure:$('patientProcedure')?.value.trim()||state.patientProcedure||state.procedure||'',workflowProfile:state.caseWorkflowProfile||$('caseWorkflowProfile')?.value||'routine',capturedAt:state.timer.startedEpoch});captureProtocolSnapshot();addAudit('PROCEDURE_TEMPLATE_FROZEN',`${state.procedureTemplateSnapshot.label} • Workflow ${state.procedureTemplateSnapshot.workflowProfile} • documentation-only`);addAudit('CASE_STARTED',`Anesthesia case timer started • patient ${state.caseIdentitySnapshot.patientName||'Unnamed'} • BW ${state.caseIdentitySnapshot.weight??'—'} kg`);renderProcedureTemplatePicker();}startTimerLoop();renderTimerState();renderOrTimerState();renderCasePhase();save();if(autoWakeEnabled())requestScreenWakeLock(true);if(firstStart)addEvent({category:'Case',name:'Case started',note:'Anesthesia case timer started'});toast(firstStart?'Case timer started':'Case timer resumed');return true}
$('orStartBtn')?.addEventListener('click',startCaseFromOr);$('orPauseBtn')?.addEventListener('click',()=>{pauseTimer();renderOrLive()});$('orRecordNowBtn')?.addEventListener('click',()=>{if(!state.timer.running&&(state.timer.elapsedMs||0)===0){if(!startCaseFromOr())return}addRecord('');renderOrLive()});$('openOrLiveBtn')?.addEventListener('click',()=>setTab('orlive'));$('orOpenDrugBtn')?.addEventListener('click',openOrQuickDrug);$('orOpenTrendsBtn')?.addEventListener('click',()=>setTab('trends'));$('orOpenTimelineBtn')?.addEventListener('click',()=>setTab('timeline'));
function renderOrWorkspacePreferences(){
  const cfg=currentSettingsObject(),profile=['minimal','standard','full'].includes(cfg.orMoreProfile)?cfg.orMoreProfile:'minimal',phase=state.casePhase||'preop';
  const ids={workflow:'orMobileWorkflowBtn',drug:'orMobileDrugBtn',fluid:'orMobileFluidBtn',event:'orMobileEventBtn',airway:'orMobileAirwayBtn',trends:'orMobileTrendsBtn',timeline:'orMobileTimelineBtn',caseSummary:'orMobileCaseSummaryBtn'};
  const essential={
    preop:['drug','event'],
    induction:['drug','airway','event'],
    intraop:['workflow','drug','fluid','event'],
    emergence:['airway','drug','event'],
    recovery:['event'],
    emergency:['event','drug','airway','fluid'],
    complete:[]
  }[phase]||['drug','event'];
  const visible=new Set(essential);
  if(profile==='standard'||profile==='full'){visible.add('trends');visible.add('timeline')}
  if(profile==='full'){Object.keys(ids).forEach(k=>visible.add(k))}
  else visible.delete('caseSummary');
  Object.entries(ids).forEach(([key,id])=>{const el=$(id);if(el)el.hidden=!visible.has(key)||(key==='workflow'&&phase!=='intraop')});
  if($('orMoreTitle'))$('orMoreTitle').textContent=`More • ${phaseLabel()}`;
  if($('orMoreProfileNote'))$('orMoreProfileNote').textContent=`${profile[0].toUpperCase()+profile.slice(1)} menu • ${essential.length} phase-relevant action${essential.length===1?'':'s'}${profile==='minimal'?'':' + view tools'}`;
  if($('orMiniTrendsPanel'))$('orMiniTrendsPanel').hidden=cfg.showMiniTrends===false;
  if($('orRecentActivityPanel'))$('orRecentActivityPanel').hidden=cfg.showRecentActivity===false;
}
function closeOrMoreDialog(){const d=$('orMoreDialog');if(d?.open){try{d.close()}catch(e){d.removeAttribute('open')}}}
function openOrMoreDialog(){const d=$('orMoreDialog');if(!d)return;renderOrWorkspacePreferences();try{if(!d.open)d.showModal()}catch(e){d.setAttribute('open','')}}
$('orMobileNextBtn')?.addEventListener('click',()=>$('orPrimaryActionBtn')?.click());
$('orMobileRecordBtn')?.addEventListener('click',()=>$('orRecordNowBtn')?.click());
$('orMobileMedsBtn')?.addEventListener('click',()=>openOrQuickDrug());
$('orMobileWorkflowBtn')?.addEventListener('click',()=>{closeOrMoreDialog();$('orPrimaryActionBtn')?.click()});
$('orVitalsFocusSaveBtn')?.addEventListener('click',()=>$('orRecordNowBtn')?.click());
$('orCopyLastVitalsBtn')?.addEventListener('click',fillBlankVitalsFromLast);
$('orQuickMedAllBtn')?.addEventListener('click',()=>openOrQuickDrug());
$('orQuickMedButtons')?.addEventListener('click',e=>{const b=e.target.closest('[data-or-quick-med]');if(!b)return;const row=plannedRoutineMedicationRows().find(r=>String(r.item?.id||'')===String(b.dataset.orQuickMed));if(row?.status==='given-pending'&&String(row.item?.phase||'').toLowerCase()==='induction'){window.ANESVET_MEDICATION_WORKSPACE?.recordPreparedInductionNow?.(b.dataset.orQuickMed);return}openOrQuickDrug({drugId:b.dataset.orQuickMed})});
$('orMobileMoreBtn')?.addEventListener('click',openOrMoreDialog);
$('orMoreCloseBtn')?.addEventListener('click',closeOrMoreDialog);
$('orMoreDialog')?.addEventListener('click',e=>{if(e.target===$('orMoreDialog'))closeOrMoreDialog()});
$('orMobileDrugBtn')?.addEventListener('click',()=>{closeOrMoreDialog();openOrQuickDrug()});
$('orMobileFluidBtn')?.addEventListener('click',()=>{closeOrMoreDialog();openOrDetailsAndScroll('#orFluidPanelDetails')});
$('orMobileEventBtn')?.addEventListener('click',()=>{closeOrMoreDialog();openOrDetailsAndScroll('.or-event-problem-menu')});
$('orMobileAirwayBtn')?.addEventListener('click',()=>{closeOrMoreDialog();openAirwayWorkflow('edit')});
$('orMobileTrendsBtn')?.addEventListener('click',()=>{closeOrMoreDialog();setTab('trends')});
$('orMobileTimelineBtn')?.addEventListener('click',()=>{closeOrMoreDialog();setTab('timeline')});
$('orMobileCaseSummaryBtn')?.addEventListener('click',()=>{closeOrMoreDialog();setTab('casesummary')});$('orMoreSettingsBtn')?.addEventListener('click',()=>{closeOrMoreDialog();setTab('settings');setTimeout(()=>document.querySelector('.or-workspace-settings-panel')?.scrollIntoView({behavior:'smooth',block:'start'}),50)});
$$('.or-milestone').forEach(btn=>btn.addEventListener('click',()=>{markMilestone(btn);renderOrLive()}));$$('.or-event').forEach(btn=>btn.addEventListener('click',()=>{addEvent({category:btn.dataset.cat,name:btn.dataset.label});renderOrLive()}));$$('.or-complication').forEach(btn=>btn.addEventListener('click',()=>openComplicationDialog(btn.dataset.complication||'')));
$('orFullscreenBtn')?.addEventListener('click',async()=>{try{if(!document.fullscreenElement){if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();document.body.classList.add('or-fullscreen');$('orFullscreenBtn').textContent='Exit full screen'}else{if(document.exitFullscreen)await document.exitFullscreen();document.body.classList.remove('or-fullscreen');$('orFullscreenBtn').textContent='⛶ Full screen'}}catch(e){document.body.classList.toggle('or-fullscreen')}});document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement){document.body.classList.remove('or-fullscreen');if($('orFullscreenBtn'))$('orFullscreenBtn').textContent='⛶ Full screen'}});
  function bind(){bindFastVitalInteraction();return true}
  return Object.freeze({
    version:VERSION,bind,closeOrMoreDialog,
    syncOrFromMain,syncMainFromOr,workflowProfileInfo,activeWorkflowProfile,hasProcedureMilestone,procedureMilestoneEvent,workflowEvent,templateQuickDrugCandidates,renderTemplateQuickActions,renderWorkflowContext,
    inductionMedicationRecords,normalizeMedicationIdentity,plannedRoutineMedicationRows,reviewNowPlannedMedicationRows,laterPlannedMedicationRows,medicationQueueSummary,renderOrMedicationQueue,setMedicationQueueExpanded,inductionMedicationComplete,
    renderOrPrimaryFlow,renderOrUndoControls,handleOrWorkflowAction,startCaseFromOr,undoLastOrWorkflowStep,renderAirwayPanel,setVentilationMode,renderOrLive,renderOrWorkspacePreferences,renderOrRecent,renderOrTimerState,
    focusFastField,saveFastVitals,refreshFastViewport
  });
}
const api=Object.freeze({version:VERSION,create});root.ANESVET_OR_LIVE_CONTROLLER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
