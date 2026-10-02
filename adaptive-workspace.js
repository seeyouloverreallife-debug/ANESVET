/* ANESVET V16.4.0 — adaptive workspace polish. Presentation/accessibility only. */
(()=>{
  'use strict';
  const body=document.body;
  const mqWide=window.matchMedia('(min-width:1180px)');
  const mqTablet=window.matchMedia('(min-width:760px) and (max-width:1179px)');

  function syncViewportClass(){
    body.classList.toggle('ux-wide-workspace',mqWide.matches);
    body.classList.toggle('ux-tablet-workspace',mqTablet.matches);
    body.dataset.uxViewport=mqWide.matches?'wide':(mqTablet.matches?'tablet':'mobile');
  }
  syncViewportClass();
  mqWide.addEventListener?.('change',syncViewportClass);
  mqTablet.addEventListener?.('change',syncViewportClass);

  // Accessibility mirror for the visual workflow stepper; no navigation or gate logic is changed.
  const tabs=[...document.querySelectorAll('.workflow-tabs .tab[data-tab]')];
  function syncCurrentStep(){
    let active='';
    tabs.forEach(tab=>{
      if(tab.classList.contains('active')){tab.setAttribute('aria-current','step');active=tab.dataset.tab||'';}
      else tab.removeAttribute('aria-current');
    });
    if(active) body.dataset.uxActiveTab=active;
  }
  syncCurrentStep();
  if(tabs.length){
    const obs=new MutationObserver(syncCurrentStep);
    tabs.forEach(tab=>obs.observe(tab,{attributes:true,attributeFilter:['class']}));
  }

  // Visual-only confirmation when the existing persistence layer reports a completed save.
  const saveState=document.getElementById('saveState');
  if(saveState){
    // Animation classes are presentation, not another successful save.
    const statusSignature=()=>['error','saving','dirty','saved'].find(mode=>saveState.classList.contains(mode))+'|'+saveState.textContent;
    let previous=statusSignature(),flashTimer=null;
    const savedObs=new MutationObserver(()=>{
      const current=statusSignature();
      if(current===previous)return;
      previous=current;
      if(saveState.classList.contains('saved')){
        saveState.classList.remove('ux-just-saved');
        // Force a new animation only after the app itself reports saved.
        void saveState.offsetWidth;
        saveState.classList.add('ux-just-saved');
        clearTimeout(flashTimer);
        flashTimer=window.setTimeout(()=>saveState.classList.remove('ux-just-saved'),650);
      }
    });
    savedObs.observe(saveState,{attributes:true,attributeFilter:['class'],childList:true,characterData:true,subtree:true});
  }
})();
