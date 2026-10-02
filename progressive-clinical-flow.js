/* ANESVET V16.3.0 — Progressive Clinical Flow
   UX-only layer. No clinical calculations, thresholds, safety gates, record semantics,
   medication logic, or finalization criteria are changed. */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const q = (sel, root=document) => root.querySelector(sel);
  const qa = (sel, root=document) => [...root.querySelectorAll(sel)];
  const DETAILS_KEY = 'anesvet_v163_patient_optional_open';
  let patientBrowsing = false;
  let refreshTimer = 0;

  function isPhone(){ return window.matchMedia('(max-width:720px)').matches; }
  function isGood(el){ return !!el && el.classList.contains('good'); }
  function activePageId(){ return q('.tabpage.active')?.id || ''; }
  function schedule(){ clearTimeout(refreshTimer); refreshTimer = setTimeout(refresh, 30); }

  function revealFor(target){window.ANESVET_WORKSPACE_OWNER?.openForElement?.(target,{persist:true});}

  /* ---------- Patient master: compact once a patient is linked ---------- */
  function setupPatientMasterCompact(){
    const panel=q('#patient .patient-master-panel'), banner=$('linkedPatientBanner');
    if(!panel || !banner || $('patientMasterChangeBtn')) return;
    const actions=banner.querySelector('div:last-child') || banner;
    const btn=document.createElement('button');
    btn.id='patientMasterChangeBtn';
    btn.type='button';
    btn.className='btn ux-patient-change-btn';
    btn.textContent='ค้นหา / เปลี่ยน';
    const unlink=$('unlinkPatientBtn');
    if(unlink?.parentElement===banner) banner.insertBefore(btn,unlink); else banner.appendChild(btn);
    btn.addEventListener('click',()=>{
      patientBrowsing=true; renderPatientMasterCompact();
      requestAnimationFrame(()=>{ $('patientMasterSearch')?.focus(); });
    });
    $('unlinkPatientBtn')?.addEventListener('click',()=>{patientBrowsing=false;setTimeout(renderPatientMasterCompact,0)});
    $('newPatientMasterBtn')?.addEventListener('click',()=>{patientBrowsing=false;setTimeout(renderPatientMasterCompact,0)});
    $('patientMasterSearch')?.addEventListener('input',()=>{ if($('patientMasterSearch')?.value) patientBrowsing=true; renderPatientMasterCompact(); });
    new MutationObserver(renderPatientMasterCompact).observe(banner,{attributes:true,attributeFilter:['hidden']});
    renderPatientMasterCompact();
  }

  function renderPatientMasterCompact(){
    const panel=q('#patient .patient-master-panel'), banner=$('linkedPatientBanner');
    if(!panel || !banner) return;
    const linked=!banner.hidden;
    if(!linked) patientBrowsing=false;
    panel.classList.toggle('ux-linked-patient',linked);
    panel.classList.toggle('ux-linked-compact',linked && !patientBrowsing);
  }

  /* ---------- Patient form: essentials first on phone ---------- */
  function patientOptionalNodes(){
    const ids=['visitId','reproductiveStatus','microchip','bcs'];
    const nodes=ids.map(id=>$(id)?.closest('label')).filter(Boolean);
    const bcsGuide=q('#patient .bcs-guide'); if(bcsGuide) nodes.push(bcsGuide);
    return nodes;
  }
  function optionalValueCount(){
    return ['visitId','reproductiveStatus','microchip','bcs'].filter(id=>String($(id)?.value||'').trim()).length;
  }
  function patientDetailsOpen(){
    try{return localStorage.getItem(DETAILS_KEY)==='1';}catch(_){return false;}
  }
  function setPatientDetailsOpen(open,persist=true){
    const page=$('patient'),btn=$('patientDetailsToggle'); if(!page||!btn)return;
    page.classList.toggle('ux-patient-details-open',!!open);
    btn.setAttribute('aria-expanded',String(!!open));
    const n=optionalValueCount();
    btn.innerHTML=`<span>${open?'ซ่อน':'แสดง'}รายละเอียดเพิ่มเติม</span><small>${n?`${n} รายการมีข้อมูล`:'Visit ID • reproductive • microchip • BCS'}</small><b aria-hidden="true">${open?'⌃':'⌄'}</b>`;
    if(persist){try{localStorage.setItem(DETAILS_KEY,open?'1':'0')}catch(_){}}
  }
  function setupPatientDetails(){
    // V17.11.3: Patient detail disclosure is canonically owned by
    // ANESVET_PATIENT_PREOP_SIMPLIFICATION. Do not create a second toggle/state owner.
    if(window.ANESVET_PATIENT_PREOP_SIMPLIFICATION)return;
    const panel=q('#patient .patient-entry-panel'), grid=q('#patient .patient-form-grid');
    if(!panel||!grid||$('patientDetailsToggle'))return;
    patientOptionalNodes().forEach(n=>n.classList.add('ux-patient-optional'));
    const bar=document.createElement('div');bar.className='ux-patient-form-toolbar';
    bar.innerHTML='<div><b>ข้อมูลหลักของเคส</b><small>เริ่มจากข้อมูลที่ใช้กับการวางยาและการคำนวณก่อน</small></div><button id="patientDetailsToggle" class="ux-patient-details-toggle" type="button" aria-expanded="false"></button>';
    panel.insertBefore(bar,grid);
    $('patientDetailsToggle').addEventListener('click',()=>setPatientDetailsOpen(!$('patient').classList.contains('ux-patient-details-open')));
    patientOptionalNodes().forEach(n=>n.addEventListener('focusin',()=>setPatientDetailsOpen(true,false)));
    setPatientDetailsOpen(patientDetailsOpen(),false);
    ['visitId','reproductiveStatus','microchip','bcs'].forEach(id=>$(id)?.addEventListener('input',()=>setPatientDetailsOpen($('patient').classList.contains('ux-patient-details-open'),false)));
    ['reproductiveStatus','bcs'].forEach(id=>$(id)?.addEventListener('change',()=>setPatientDetailsOpen($('patient').classList.contains('ux-patient-details-open'),false)));
  }

  /* ---------- Make completed workflow areas visually quieter ---------- */
  function renderCompletionStates(){
    const patient=$('patient'); if(patient) patient.classList.toggle('ux-step-complete',isGood($('patientSaveStatus')));
    const preop=$('preop'); if(preop) preop.classList.toggle('ux-step-complete',isGood($('preopProgress')));
    const drugs=$('drugs');
    if(drugs){
      const s=String($('caseDrugPlanStatus')?.textContent||'').toLowerCase();
      const reviewed=$('caseDrugPlanStatus')?.classList.contains('reviewed') || $('caseDrugPlanStatus')?.classList.contains('frozen') || (s.includes('reviewed')&&!s.includes('not reviewed')) || s.includes('frozen');
      drugs.classList.toggle('ux-step-complete',!!reviewed);
    }
    const end=$('endcase');if(end)end.classList.toggle('ux-step-complete',isGood($('endCaseReadiness')));
  }

  /* ---------- Drug support/reference section gets explicit disclosure ---------- */
  function setupDrugSupportDisclosure(){
    const panel=q('#drugs .dose-spotlight-panel'); if(!panel||panel.dataset.uxV163)return; panel.dataset.uxV163='1';
    const heading=panel.querySelector(':scope > .section-heading'); if(!heading)return;
    const toggle=document.createElement('button');toggle.type='button';toggle.className='btn ux-drug-support-toggle';toggle.textContent='ย่อ Quick Presets';
    heading.appendChild(toggle);
    let open=true;
    const apply=()=>{panel.classList.toggle('ux-support-collapsed',!open);toggle.textContent=open?'ย่อ Quick Presets':'เปิด Quick Presets';toggle.setAttribute('aria-expanded',String(open));};
    toggle.addEventListener('click',()=>{open=!open;apply()});apply();
  }

  function refresh(){
    renderPatientMasterCompact();
    renderCompletionStates();
    document.documentElement.classList.add('progressive-clinical-flow-v163');
  }

  function boot(){
    setupPatientMasterCompact();setupPatientDetails();setupDrugSupportDisclosure();
    ['patientSaveStatus','preopProgress','caseDrugPlanStatus','endCaseReadiness','endCaseNextTaskBtn','linkedPatientBanner'].forEach(id=>{
      const el=$(id);if(el)new MutationObserver(schedule).observe(el,{attributes:true,childList:true,characterData:true,subtree:true});
    });
    qa('.tabpage,.workflow-tabs .tab').forEach(el=>new MutationObserver(schedule).observe(el,{attributes:true,attributeFilter:['class']}));
    document.addEventListener('change',e=>{if(e.target.closest?.('#patient,#preop,#drugs,#endcase'))schedule()},true);
    document.addEventListener('click',e=>{if(e.target.closest?.('#patient,#preop,#drugs,#endcase,.mobile-quick-bar,.workflow-tabs'))schedule()},true);
    document.addEventListener('anesvet:viewportchange',schedule);
    refresh();
  }

  window.ANESVET_LIFECYCLE_COORDINATOR?.ready(boot);
})();
