/* ANESVET V16.2.0 — Focused Clinical Workspace
   UX-only. Does not change clinical decisions, calculations, thresholds, safety gates, records or storage schema. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const qa = sel => [...document.querySelectorAll(sel)];
  const STORE='anesvet_focused_workspace_v162';
  let pref={};
  try{pref=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){pref={}}
  const savePref=()=>{try{localStorage.setItem(STORE,JSON.stringify(pref))}catch(_){}};

  function syncWorkflowStepStates(){
    const tabs=qa('.workflow-tabs .tab[data-tab]');
    const main=tabs.filter(x=>['patient','preop','drugs','orlive','recovery','endcase'].includes(x.dataset.tab));
    const active=main.findIndex(x=>x.classList.contains('active'));
    main.forEach((btn,i)=>{
      const state=active<0?'future':i<active?'past':i===active?'current':'future';
      btn.dataset.stepState=state;
      btn.setAttribute('aria-label',`${btn.textContent.trim()} • step ${i+1} of ${main.length}`);
    });
  }

  function setupWorkflowObserver(){
    const tabs=document.querySelector('.workflow-tabs'); if(!tabs)return;
    const obs=new MutationObserver(syncWorkflowStepStates);
    qa('.workflow-tabs .tab[data-tab]').forEach(b=>obs.observe(b,{attributes:true,attributeFilter:['class']}));
    syncWorkflowStepStates();
  }

  function setupOrCompactContext(){
    const command=document.querySelector('#orlive .or-command-bar');
    if(!command || !('IntersectionObserver' in window))return;
    const io=new IntersectionObserver(entries=>{
      const e=entries[0];
      const orActive=$('orlive')?.classList.contains('active');
      document.body.classList.toggle('ux-or-context-compact',!!orActive && !e.isIntersecting && e.boundingClientRect.top<0);
    },{threshold:.08});
    io.observe(command);

    const page=$('orlive');
    if(page){new MutationObserver(()=>{if(!page.classList.contains('active'))document.body.classList.remove('ux-or-context-compact','ux-or-show-phase')}).observe(page,{attributes:true,attributeFilter:['class']})}
  }

  function setupOrWorkflowStatusAction(){
    const grid=document.querySelector('#orMoreDialog .or-more-grid');
    const tracker=document.querySelector('#orlive .or-phase-tracker-panel');
    if(!grid||!tracker||$('uxOrWorkflowStatusBtn'))return;
    const btn=document.createElement('button');
    btn.id='uxOrWorkflowStatusBtn';btn.type='button';btn.className='or-more-action';
    btn.innerHTML='<span>⌁</span><b>Workflow status</b><small>ดูขั้นตอนทั้งหมดของเคส</small>';
    const drug=$('orMobileDrugBtn');
    if(drug)grid.insertBefore(btn,drug);else grid.prepend(btn);
    btn.addEventListener('click',()=>{
      try{$('orMoreDialog')?.close()}catch(_){$('orMoreDialog')?.removeAttribute('open')}
      window.ANESVET_WORKSPACE_OWNER?.openWorkflowStatus?.();
    });
    tracker.addEventListener('toggle',()=>{if(!tracker.open)tracker.classList.remove('ux-phase-requested')});
  }

  function panelKey(panel){return `recovery:${panel.id}`}
  function recoveryPanelSummary(panel){
    if(panel.id==='recoveryObservationPanel'){
      const ids=['recHR','recRR','recSpO2','recTemp','recMentation','recExtubation'];
      const filled=ids.filter(id=>String($(id)?.value||'').trim()).length;
      const na=qa('#recoveryObservationPanel .recovery-observation-na-btn.active').length;
      return `Observations ${Math.min(6,filled+na)}/6 • เปิดเมื่อจะบันทึก/แก้ค่าฟื้นสลบ`;
    }
    if(panel.id==='recoveryChecklistPanel'){
      const rows=qa('#recoveryChecklistPanel .recovery-check-item');
      const reviewed=rows.filter(row=>row.querySelector('.recovery-check')?.checked||row.querySelector('.recovery-check-na-btn')?.classList.contains('active')).length;
      return `Checklist ${reviewed}/${rows.length} • เปิดเฉพาะตอน reassess readiness`;
    }
    return 'แตะเพื่อเปิดรายละเอียด';
  }

  function setRecoveryPanelOpen(panel,open,{persist=true}={}){
    if(!panel?.classList.contains('ux-recovery-collapsible'))return;
    panel.classList.toggle('ux-open',!!open);
    const btn=panel.querySelector(':scope > .ux-recovery-heading .ux-recovery-toggle');
    if(btn){btn.setAttribute('aria-expanded',String(!!open));btn.querySelector('.ux-recovery-toggle-label').textContent=open?'พับ':'เปิด'}
    if(persist){pref[panelKey(panel)]=!!open;savePref()}
  }

  function updateRecoveryPanel(panel){
    if(!panel)return;
    const s=panel.querySelector(':scope > .ux-recovery-heading .ux-recovery-summary');
    if(s)s.textContent=recoveryPanelSummary(panel);
    if(panel.id==='recoveryChecklistPanel'){
      const rows=qa('#recoveryChecklistPanel .recovery-check-item');
      const reviewed=rows.filter(row=>row.querySelector('.recovery-check')?.checked||row.querySelector('.recovery-check-na-btn')?.classList.contains('active')).length;
      panel.classList.toggle('ux-complete',rows.length>0&&reviewed===rows.length);
      panel.classList.toggle('ux-attention',reviewed<rows.length);
    }
  }

  function enhanceRecoveryPanel(id,defaultOpen){
    const panel=$(id);if(!panel||panel.classList.contains('ux-recovery-collapsible'))return;
    const oldHeading=Array.from(panel.children).find(el=>/^H2$/.test(el.tagName));
    if(!oldHeading)return;
    const title=oldHeading.textContent.trim();
    const heading=document.createElement('div');heading.className='ux-recovery-heading';
    const copy=document.createElement('div');copy.className='ux-recovery-heading-copy';
    const h=document.createElement('h2');h.textContent=title;
    const summary=document.createElement('small');summary.className='ux-recovery-summary';
    copy.append(h,summary);
    const toggle=document.createElement('button');toggle.type='button';toggle.className='ux-recovery-toggle';toggle.innerHTML='<span class="ux-recovery-toggle-label">เปิด</span><span class="ux-recovery-toggle-icon" aria-hidden="true">⌄</span>';
    heading.append(copy,toggle);
    const body=document.createElement('div');body.className='ux-recovery-body';
    const children=Array.from(panel.children).filter(x=>x!==oldHeading);
    children.forEach(x=>body.appendChild(x));
    oldHeading.replaceWith(heading);panel.appendChild(body);panel.classList.add('ux-recovery-collapsible');
    const key=panelKey(panel);const open=Object.prototype.hasOwnProperty.call(pref,key)?!!pref[key]:!!defaultOpen;
    setRecoveryPanelOpen(panel,open,{persist:false});updateRecoveryPanel(panel);
    toggle.addEventListener('click',()=>setRecoveryPanelOpen(panel,!panel.classList.contains('ux-open')));
    heading.addEventListener('click',e=>{if(e.target.closest('button,input,select,textarea,label,a'))return;setRecoveryPanelOpen(panel,!panel.classList.contains('ux-open'))});
    body.addEventListener('input',()=>updateRecoveryPanel(panel),true);body.addEventListener('change',()=>updateRecoveryPanel(panel),true);body.addEventListener('click',()=>setTimeout(()=>updateRecoveryPanel(panel),0),true);
  }

  function revealFor(el){
    if(!el)return;
    const ux=el.closest?.('.ux-recovery-collapsible');
    if(ux)setRecoveryPanelOpen(ux,true);
  }

  function setupRecoveryProgressiveWorkspace(){
    enhanceRecoveryPanel('recoveryObservationPanel',true);
    enhanceRecoveryPanel('recoveryChecklistPanel',false);
    const phase=$('recoveryPhaseBadge');
    if(phase){
      const sync=()=>{
        const t=(phase.textContent||'').toUpperCase();
        document.body.classList.toggle('ux-recovery-active',t.includes('ACTIVE'));
      };
      new MutationObserver(sync).observe(phase,{childList:true,characterData:true,subtree:true});sync();
    }
  }

  function setupMobileChrome(){window.ANESVET_WORKSPACE_OWNER?.syncViewport?.();}

  window.ANESVETFocusedWorkspace={openForElement:revealFor,setRecoveryPanelOpen};
  document.documentElement.classList.add('focused-workspace-v162');
  setupWorkflowObserver();setupOrCompactContext();setupOrWorkflowStatusAction();setupRecoveryProgressiveWorkspace();setupMobileChrome();
})();
