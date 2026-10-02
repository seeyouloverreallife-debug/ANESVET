/* ANESVET V17.5.4 — OR LIVE Speed & Android/PWA Hardening
   Interaction hardening only. Does not change clinical calculations or record semantics. */
(()=>{
  'use strict';

  const FAST_FIELDS=[
    {id:'orHr',label:'HR',unit:'bpm'},
    {id:'orMap',label:'MAP',unit:'mmHg'},
    {id:'orSpo2',label:'SpO₂',unit:'%'},
    {id:'orEtco2',label:'ETCO₂',unit:'mmHg'},
    {id:'orRr',label:'RR',unit:'/min'},
    {id:'orTemp',label:'Temp',unit:''}
  ];
  const FAST_IDS=new Set(FAST_FIELDS.map(x=>x.id));
  const mobileQuery=matchMedia('(max-width:1180px), (pointer:coarse) and (max-width:1400px)');
  const vv=window.visualViewport||null;
  let baselineVisualHeight=vv?.height||window.innerHeight||0;
  let activeFastId='';
  let lastOrientation=screen?.orientation?.type||String(window.orientation||'');
  let savedFlashTimer=null;
  let visibilityTimer=null;

  const byId=id=>document.getElementById(id);
  const rail=byId('orFastEntryRail');
  const current=byId('orFastEntryCurrent');
  const progress=byId('orFastEntryProgress');
  const prev=byId('orFastEntryPrevBtn');
  const next=byId('orFastEntryNextBtn');
  const saveBtn=byId('orFastEntrySaveBtn');

  function stateRecordCount(){
    try{return (typeof state!=='undefined'&&Array.isArray(state.records))?state.records.length:Number((byId('recordCountText')?.textContent||'').match(/\d+/)?.[0]||0)}catch(_){return 0}
  }
  function isOrActive(){return !!byId('orlive')?.classList.contains('active')}
  function fieldIndex(id=activeFastId){return FAST_FIELDS.findIndex(x=>x.id===id)}
  function activeInput(){const el=document.activeElement;return el&&FAST_IDS.has(el.id)?el:null}
  function keyboardCandidate(){return window.ANESVET_MOBILE_OR_OWNER?.editing?.()??!!document.activeElement?.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=hidden]),textarea,select,[contenteditable="true"]')}
  function updateViewportMetrics({orientationReset=false}={}){
    window.ANESVET_MOBILE_OR_OWNER?.sync?.(orientationReset?'orientation':'or-speed');
    positionEntryRail();
  }

  function positionEntryRail(){
    if(!rail||rail.hidden)return;
    const viewport=window.visualViewport;
    // Anchor to the visible bottom once; never subtract a stale keyboard gap
    // from a layout viewport that Android has already resized.
    rail.style.bottom='auto';
    rail.style.top=`${Math.max(viewport?.offsetTop||0,(viewport?.offsetTop||0)+(viewport?.height||window.innerHeight)-rail.offsetHeight-8)}px`;
  }
  function queueFocusedVisibility(){
    clearTimeout(visibilityTimer);
    visibilityTimer=setTimeout(ensureFocusedCardVisible,180);
  }

  function metricText(row,input){
    const v=String(input?.value??'').trim();
    const unit=row.id==='orTemp'?(byId('orTempUnit')?.textContent||''):row.unit;
    return v?`${row.label} ${v}${unit?` ${unit}`:''}`:`${row.label} • blank`;
  }
  function updateRail({saved=false}={}){
    if(!rail)return;
    const idx=fieldIndex();
    const row=FAST_FIELDS[idx];
    const input=row?byId(row.id):null;
    const show=mobileQuery.matches&&isOrActive()&&idx>=0&&document.activeElement===input;
    rail.hidden=!show;
    document.body.classList.toggle('or-fast-entry-active',show);
    if(!show)return;
    if(progress)progress.textContent=`VITAL ${idx+1}/${FAST_FIELDS.length}`;
    if(current){current.textContent=saved?'✓ Vitals saved':metricText(row,input);current.classList.toggle('saved',saved)}
    if(prev)prev.disabled=idx<=0;
    if(next){next.disabled=false;next.textContent=idx>=FAST_FIELDS.length-1?'เสร็จ':'ถัดไป';next.setAttribute('aria-label',idx>=FAST_FIELDS.length-1?'จบการกรอก โดยยังไม่บันทึก':'ช่องถัดไป');}
    if(saveBtn)saveBtn.textContent='✓ SAVE';
    positionEntryRail();
  }

  function ensureFocusedCardVisible(){
    const input=activeInput();if(!input||!mobileQuery.matches)return;
    if(document.querySelector('dialog[open]'))return;
    const viewport=window.visualViewport;
    const rect=input.getBoundingClientRect();
    const topLimit=(viewport?.offsetTop||0)+8;
    const bottomLimit=(viewport?.offsetTop||0)+(viewport?.height||window.innerHeight)-(rail&&!rail.hidden?rail.offsetHeight+16:8);
    if(bottomLimit-topLimit<rect.height)return;
    // A long warning card may never fit. Only reveal the actual input and do
    // not center cards, animate scrolling, or react recursively to vv.scroll.
    const delta=rect.top<topLimit?rect.top-topLimit:rect.bottom>bottomLimit?rect.bottom-bottomLimit:0;
    if(Math.abs(delta)>1)window.scrollBy({top:delta,left:0,behavior:'instant'});
  }

  function focusAt(index){
    const row=FAST_FIELDS[index];if(!row)return false;
    const el=byId(row.id);if(!el)return false;
    activeFastId=row.id;
    try{el.focus({preventScroll:true})}catch(_){el.focus()}
    updateRail();
    queueFocusedVisibility();
    return true;
  }

  function dismissFastKeyboard(){
    const el=activeInput();if(el)el.blur();
    activeFastId='';
    clearTimeout(visibilityTimer);
    updateRail();
    updateViewportMetrics();
  }

  function flashSaved(){
    clearTimeout(savedFlashTimer);
    updateRail({saved:true});
    savedFlashTimer=setTimeout(()=>updateRail(),900);
  }

  function saveVitalsFromRail(){
    const before=stateRecordCount();
    const y=window.scrollY;
    const record=byId('orRecordNowBtn');
    if(!record)return false;
    record.click();
    setTimeout(()=>{
      const after=stateRecordCount();
      if(after>before){
        flashSaved();
        dismissFastKeyboard();
        requestAnimationFrame(()=>window.scrollTo({top:y,left:0,behavior:'auto'}));
        document.dispatchEvent(new CustomEvent('anesvet:fast-vitals-saved',{detail:{before,after}}));
      }else updateRail();
    },0);
    return true;
  }

  document.addEventListener('focusin',e=>{
    if(!FAST_IDS.has(e.target?.id))return;
    activeFastId=e.target.id;updateRail();queueFocusedVisibility();
  });
  document.addEventListener('focusout',e=>{
    if(!FAST_IDS.has(e.target?.id))return;
    setTimeout(()=>{if(!activeInput()){activeFastId='';updateRail()}},40);
  });
  document.addEventListener('input',e=>{if(FAST_IDS.has(e.target?.id)){activeFastId=e.target.id;updateRail()}});

  /* Enter moves through fields. The last field finishes editing; a record
     requires an explicit Save action (or the deliberate Ctrl/Meta+Enter shortcut). */
  document.addEventListener('keydown',e=>{
    if(!FAST_IDS.has(e.target?.id))return;
    if(e.key==='Escape'){e.preventDefault();dismissFastKeyboard();return}
    if(e.key!=='Enter'&&e.key!=='NumpadEnter')return;
    e.preventDefault();e.stopImmediatePropagation();
    const idx=fieldIndex(e.target.id);
    if(e.ctrlKey||e.metaKey){saveVitalsFromRail();return}
    if(e.shiftKey){focusAt(Math.max(0,idx-1));return}
    if(idx<FAST_FIELDS.length-1)focusAt(idx+1);else dismissFastKeyboard();
  },true);

  prev?.addEventListener('click',()=>focusAt(Math.max(0,fieldIndex()-1)));
  next?.addEventListener('click',()=>{const idx=fieldIndex();if(idx<FAST_FIELDS.length-1)focusAt(idx+1);else dismissFastKeyboard()});
  saveBtn?.addEventListener('click',saveVitalsFromRail);
  // Tapping the rail must not blur a field before its button handles the tap.
  [prev,next,saveBtn].forEach(btn=>btn?.addEventListener('pointerdown',e=>e.preventDefault()));

  /* Medication workspace: keyboard navigation reduces taps, but never auto-saves.
     Confirmation and duplicate-administration safeguards remain in app.js. */
  const drugDialog=byId('orQuickDrugDialog');
  function updateQuickDrugActionLabel(){
    const btn=byId('orQuickDrugSaveBtn');if(!btn||!drugDialog?.open)return;
    let induction=false,remaining=0;
    try{
      induction=typeof orQuickContext!=='undefined'&&orQuickContext?.purpose==='induction';
      remaining=typeof inductionMedicationPendingRows==='function'?inductionMedicationPendingRows().length:0;
    }catch(_){/* keep generic label */}
    btn.textContent=induction&&remaining>1?'Save actual → next':'Save actual administered';
  }
  if(drugDialog){
    new MutationObserver(()=>{if(drugDialog.open){updateViewportMetrics();updateQuickDrugActionLabel()}else setTimeout(()=>updateViewportMetrics(),80)}).observe(drugDialog,{attributes:true,attributeFilter:['open']});
    drugDialog.addEventListener('input',updateQuickDrugActionLabel);
    drugDialog.addEventListener('change',updateQuickDrugActionLabel);
  }
  document.addEventListener('anesvet:drug-administration-changed',()=>setTimeout(updateQuickDrugActionLabel,0));
  document.addEventListener('keydown',e=>{
    if(!drugDialog?.open||e.key!=='Enter'||e.shiftKey||e.ctrlKey||e.metaKey||e.altKey)return;
    if(e.target?.tagName==='TEXTAREA'||e.target?.tagName==='BUTTON')return;
    const id=e.target?.id;
    const map={orQuickDrugActual:'orQuickDrugRoute',orQuickDrugRoute:'orQuickDrugConcentration',orQuickDrugConcentration:'orQuickDrugSaveBtn'};
    const target=map[id];if(!target)return;
    e.preventDefault();byId(target)?.focus();
  },true);

  /* Page Lifecycle hardening for installed PWA / Android task switching. */
  document.addEventListener('freeze',()=>{
    try{if(typeof flushPendingSave==='function')flushPendingSave('page-freeze');else if(typeof save==='function')save({reason:'page-freeze'})}catch(_){/* app already owns primary persistence path */}
  });
  window.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',e=>{
    if(!e.detail?.persisted)return;
    setTimeout(()=>{
      try{if(typeof renderOrLive==='function')renderOrLive()}catch(_){ }
      try{if(typeof renderRecovery==='function')renderRecovery()}catch(_){ }
      try{if(typeof writeSessionLock==='function')writeSessionLock()}catch(_){ }
      try{if(typeof autoWakeEnabled==='function'&&autoWakeEnabled()&&typeof requestScreenWakeLock==='function')requestScreenWakeLock(true)}catch(_){ }
      updateViewportMetrics({orientationReset:true});
    },0);
  });

  const onViewportChange=e=>{
    const orientationReset=/orientation/.test(e?.detail?.reason||'');
    updateViewportMetrics({orientationReset});
    if(activeInput())queueFocusedVisibility();
  };
  window.ANESVET_MOBILE_OR_OWNER?.subscribe((view,reason)=>{if(reason==='viewport'||reason==='focusin'||reason==='focusout'||reason==='pageshow')onViewportChange({detail:{reason}})});
  vv?.addEventListener('scroll',positionEntryRail,{passive:true});
  mobileQuery.addEventListener?.('change',()=>{updateRail();window.ANESVET_VIEWPORT_COORDINATOR?.schedule('media-change')});

  updateViewportMetrics({orientationReset:true});
  updateRail();

  window.ANESVET_OR_SPEED_HARDENING=Object.freeze({
    version:'17.6.0',
    fields:FAST_FIELDS.map(x=>x.id),
    refreshViewport:updateViewportMetrics,
    focusField:index=>focusAt(index),
    saveVitals:saveVitalsFromRail
  });
})();
