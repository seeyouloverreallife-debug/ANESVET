/* ANESVET V17.14.14: mobile shell only. Never infer or write clinical evidence. */
(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const q=(selector,scope=document)=>scope?.querySelector(selector)||null;
  const app=()=>window.AnesvetApp;
  const labels={start:'เริ่มใช้งาน',casehub:'เคส',more:'เพิ่มเติม',patient:'ข้อมูลผู้ป่วย',casesummary:'สรุปเคส',preop:'Pre-check',plan:'แผนวางยา',drugs:'ยา / Drug Plan',orlive:'OR LIVE',recovery:'Recovery',endcase:'ปิดเคส',cases:'คลังเคส',settings:'ตั้งค่า',record:'บันทึกทั้งหมด',trends:'Trends',timeline:'Timeline',events:'เหตุการณ์',dashboard:'Advanced'};
  const active=()=>document.querySelector('.tabpage.active')?.id||'patient';
  const txt=(id,text)=>{const e=$(id);if(e&&e.textContent!==String(text??''))e.textContent=String(text??'');};
  const hide=(id,value)=>{const e=$(id);if(e&&e.hidden!==value)e.hidden=value;};
  const navigate=id=>{if(!app())return;app().setTab(id);schedule();};
  const nativeClick=id=>{const b=$(id);if(b&&!b.disabled)b.click();else app()?.toast('รายการนี้ยังไม่พร้อมใช้งาน');};
  const phaseText=s=>({setup:'เตรียมเคส',induction:'Induction',intubation:'Intubation',maintenance:'Maintenance',intraop:'ช่วงวางยา',recovery:'Recovery',complete:'จบเคส'})[s.casePhase]||s.casePhase||'เตรียมเคส';
  function currentCaseSummary(s){
    const species={dog:'สุนัข',cat:'แมว'}[s.species]||s.species||'ยังไม่ระบุชนิด';
    const bw=Number(s.weight)>0?`${s.weight} kg`:'รอยืนยันน้ำหนัก';
    return `${species} · ${bw} · ASA ${s.asa||'—'}${s.emergency?'-E':''}`;
  }
  function hasCase(s){return !!(s.patientName||s.patientSaved||s.caseStartedAt||s.caseLocked||(s.records||[]).length||(s.events||[]).length);}
  function render(){
    if(!app())return;
    const id=active(),s=app().getState(),home=id==='start',ctx=['orlive','recovery'].includes(id);
    document.body.classList.toggle('av-home-open',home);
    document.body.classList.toggle('av-or-ready',id==='orlive'&&!s.caseStartedAt);
    document.body.dataset.avPage=id;
    document.documentElement.style.setProperty('--av-footer',ctx?'148px':'96px');
    hide('avBottom',home||document.body.classList.contains('av-boot-error'));
    txt('avWorkspaceTitle',labels[id]||'ANESVET');
    txt('avWorkspaceCase',hasCase(s)?`${s.patientName||'ยังไม่ระบุชื่อ'} · ${currentCaseSummary(s)}`:'ยังไม่มีเคสที่บันทึก');
    txt('avWorkspaceStatus',$('saveState')?.textContent?`เคสในเครื่อง · ${$('saveState').textContent}`:'');
    hide('avMeasurementStatus',id!=='orlive');
    const latest=s.records?.[s.records.length-1],diff=$('orVitalChangeSummary');
    txt('avMeasurementStatus',!latest?'ค่ากรอกเอง · ยังไม่มี Vitals record':`Vitals record ${latest.clock} · ${diff?.classList.contains('has-changes')?'มีค่าแก้ไขยังไม่ลง record':diff?.classList.contains('has-blanks')?'มีช่องว่างในชุดที่กำลังกรอก':'ชุดค่าตรงกับ record ล่าสุด'}`);
    for(const el of document.querySelectorAll('[data-av-threshold]'))txt(el.id,$(el.dataset.avThreshold)?.textContent||'');
    $('avWorkspaceStatus').classList.toggle('av-save-error',!!$('saveState')?.classList.contains('error'));
    txt('avHomeLocalStatus',s.simulationMode?'โหมดฝึก · ข้อมูลจำลอง':`ข้อมูลในเครื่อง · V${app().version||'—'}`);
    const existing=hasCase(s);hide('avHomeCase',!existing);hide('avHomeEmpty',existing);
    txt('avHomeSubtitle',existing?'กลับทำเคสต่อ หรือเลือกงานใหม่':'พร้อมสำหรับเคสถัดไป');
    txt('avHomeCaseKicker',s.simulationMode?'เคสฝึก':s.caseLocked?'เคสที่ปิดแล้ว':'เคสปัจจุบัน');
    txt('avHomePatient',s.patientName||'ยังไม่ระบุชื่อ');
    txt('avHomeMeta',currentCaseSummary(s));
    txt('avHomeProcedure',[s.procedure||'ยังไม่ระบุหัตถการ',s.visitId||s.hospitalId||''].filter(Boolean).join(' · '));
    txt('avHomePhase',phaseText(s));
    txt('avHomeSaved',s.lastSavedAt?`ล่าสุด ${new Date(s.lastSavedAt).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}`:'ยังไม่ได้บันทึก');
    txt('avHomePrimary',existing?(s.caseLocked?'ดูเคสที่ปิดแล้ว':'ทำเคสนี้ต่อ'):'สร้างเคสใหม่');
    hide('avHomeNew',!existing);
    const locked=app().security?.enabled()&&app().security?.locked();
    const status=app().startupStatus?.()||{};
    const blocked=!!status.freshnessBlocked||!!status.restoreReview;
    const primary=$('avHomePrimary');if(primary)primary.disabled=blocked;
    if($('avHomeNew'))$('avHomeNew').disabled=blocked||locked||status.sessionActive===false;
    txt('avHomeState',locked?'ผู้ใช้งานถูกล็อก · แตะเมนูเพื่อปลดล็อก':status.sessionActive===false?'เปิดในโหมดดูข้อมูล · มีแท็บอื่นกำลังใช้งาน':blocked?'ข้อมูลต้องได้รับการตรวจสอบก่อนทำเคสต่อ':'');
    hide('avHomeState',!locked&&status.sessionActive!==false&&!blocked);
    for(const b of document.querySelectorAll('[data-av-nav]')){
      const tab=b.dataset.avNav;
      const current=tab==='casehub'?['casehub','patient','preop','plan','drugs','casesummary'].includes(id):tab==='more'?['more','cases','settings','endcase','record','events','trends','timeline','dashboard'].includes(id):tab===id;
      if(current)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
    }
    hide('avBottomContext',!ctx);
    txt('avContextPrimary',id==='recovery'?($('recoveryMobilePrimaryLabel')?.textContent||'บันทึกฟื้นตัว'):'บันทึก Vitals');
    const nativePrimary=$(id==='recovery'?'recoveryMobileRecordBtn':'orRecordNowBtn');
    $('avContextPrimary').disabled=blocked||locked||status.sessionActive===false||!!nativePrimary?.disabled;
    const secondary=$('orSecondaryPhaseBtn'),primaryStep=$('orPrimaryActionBtn');
    const surgeryEndReady=secondary?.dataset.action==='surgery-end'&&!secondary.disabled;
    // End Surgery is a time-critical transition. Keep it reachable from the
    // mobile context action even if another presentation layer temporarily hides
    // the native secondary button; native click still owns confirmation/state.
    const step=surgeryEndReady?secondary:primaryStep;
    const action=step?.dataset.action,stepLabels={'start-induction':'เริ่มวางยา',airway:'ใส่ท่อช่วยหายใจ','surgery-start':'เริ่มผ่าตัด','surgery-end':'จบผ่าตัด',extubation:'ถอดท่อ → ฟื้นตัว',recovery:'เริ่มฟื้นตัว','open-recovery':'ดูการฟื้นตัว','end-case':'ทบทวนปิดเคส'};
    hide('avContextWorkflow',id!=='orlive'||!step||(step.hidden&&action!=='surgery-end')||action==='locked');
    txt('avContextWorkflow',stepLabels[action]||step?.textContent||'ขั้นตอนถัดไป');
    $('avContextWorkflow').dataset.nativeTarget=step?.id||'';
    $('avContextWorkflow').disabled=blocked||locked||status.sessionActive===false||!!step?.disabled;
    $('avContextWorkflow').setAttribute('aria-label',action==='surgery-end'?'จบผ่าตัด (End surgery) — ยืนยันก่อนบันทึก':stepLabels[action]||step?.textContent||'ขั้นตอนถัดไป');
    $('avHeaderTools').setAttribute('aria-label',id==='orlive'?'เครื่องมือ OR LIVE':id==='recovery'?'เครื่องมือ Recovery':'เมนูเพิ่มเติม');
  }
  let pending=false;
  const isEditingTarget=el=>window.ANESVET_MOBILE_OR_OWNER?.editing?.(el)??!!el?.matches?.('input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]),textarea,select,[contenteditable="true"]');
  function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render();});}
  function scheduleFromChange(e){
    // Do not rebuild the mobile shell while a field still owns focus.
    // Android IME/visualViewport can otherwise combine DOM updates with keyboard
    // resize and move the workspace/tab strip during typing.
    if(isEditingTarget(e.target)&&document.activeElement===e.target)return;
    schedule();
  }
  function continueCase(){
    const s=app()?.getState();if(!s)return;
    if(app().security?.enabled()&&app().security?.locked()){nativeClick('securityIdentityChip');return;}
    if(s.caseStartedAt||s.recoveryStartedAt||s.recoveryCompletedAt||s.caseLocked){app().resumeActiveCase({source:'startup-home'});schedule();}
    else navigate('patient');
  }
  function newCase(){
    if(!app())return;
    if(!hasCase(app().getState()))navigate('patient');
    else nativeClick('newCaseBtn'); // Original archive verification, double confirmation and ownership checks.
  }
  function openTools(){
    const id=active();if(id==='orlive')nativeClick('orMobileMoreBtn');else if(id==='recovery')nativeClick('recoveryMobileMoreBtn');else navigate('more');
  }
  function saveVitals(){
    const id=active();
    if(id==='recovery'){nativeClick('recoveryMobileRecordBtn');return;}
    if(id==='orlive')nativeClick('orRecordNowBtn');
  }
  function contextMeds(){if(active()==='recovery')nativeClick('recoveryMobileMedicationBtn');else nativeClick('orQuickMedAllBtn');}
  function stylesReady(){return Array.from(document.querySelectorAll('link[data-av-style]')).every(el=>el.dataset.avStyle==='ready');}

function setupMedicationFormOrder(){const editor=$('orQuickDrugSingleEditor');if(!editor||$('orQuickDrugReferenceDetails'))return;const fields=q('.quick-drug-fields',editor),fill=q('.quick-drug-fill-row',editor),calc=$('orQuickDrugCalculation');if(fields&&calc)calc.after(fields);if(fields&&fill)fields.after(fill);const reference=$('orQuickDrugDoseReference'),info=Array.from(editor.children).find(el=>el.tagName==='P'&&!el.id);if(reference||info){const details=document.createElement('details');details.id='orQuickDrugReferenceDetails';details.className='ux-task-details';const summary=document.createElement('summary');summary.textContent='ดูข้อมูลอ้างอิงและวิธีกรอกปริมาณยา';details.append(summary);if(reference)details.append(reference);if(info)details.append(info);const note=$('orQuickDrugNote')?.closest('label');if(note)note.after(details);else editor.append(details);}}

  function install(){setupMedicationFormOrder();
    document.body.classList.add('av-mobile-design');
    for(const el of document.querySelectorAll('.or-vital-card input'))el.placeholder='—';
    // Move native auxiliary controls into their existing sheet; keep IDs and listeners.
    const tools=$('orMoreDialog')?.querySelector('.or-more-grid');
    if(tools){
      const group=document.createElement('div');group.className='av-page-tools';
      for(const el of document.querySelectorAll('.or-command-bar .or-tools-menu,.or-command-bar .or-knowledge-mini,.or-command-bar .context-help-btn'))group.append(el);
      tools.after(group);
      const hints=document.createElement('details');hints.className='av-threshold-details';hints.id='avVitalThresholds';
      const title=document.createElement('summary');title.textContent='เกณฑ์เตือน Vitals ตามค่าตั้งของเคส';hints.append(title);
      for(const [label,id] of [['HR','orHrHint'],['MAP','orMapHint'],['SpO₂','orSpo2Hint'],['ETCO₂','orEtco2Hint'],['Temp','orTempHint'],['RR','orRrHint']]){
        const row=document.createElement('p'),name=document.createElement('b'),value=document.createElement('span');name.textContent=label+' · ';value.id='avThreshold'+id;value.dataset.avThreshold=id;row.append(name,value);hints.append(row);
      }
      group.after(hints);
      const fill=$('orCopyLastVitalsBtn');if(fill)group.append(fill);
    }
    // The OR controller owns queue expansion. A second closed details wrapper
    // would hide pending planned medications even when the native list is open.
    // Keep the native queue intact, including its badge and documented-plan toggle.
    const practice=$('simulationWelcomeCard');if(practice)$('more')?.append(practice);
    document.addEventListener('click',e=>{
      const b=e.target.closest('[data-av-route],[data-av-action],[data-av-native],[data-av-knowledge]');if(!b||b.disabled)return;
      if(b.dataset.avRoute)navigate(b.dataset.avRoute);
      else if(b.dataset.avNative)nativeClick(b.dataset.avNative);
      else if(b.dataset.avKnowledge){const L=window.ANESVET_KNOWLEDGE_LOADER;if(L)L.open(b.dataset.avKnowledge).catch(console.error);else window.ANESVET_CLINICAL_KNOWLEDGE?.open(b.dataset.avKnowledge);}
      else ({continue:continueCase,new:newCase,tools:openTools,vitals:saveVitals,meds:contextMeds,workflow:()=>{if(active()==='orlive')nativeClick($('avContextWorkflow').dataset.nativeTarget);},identity:()=>nativeClick('securityIdentityChip'),retry:()=>location.reload(),diagnostic:()=>window.ANESVET_BOOT_DIAGNOSTIC?.open(),review:()=>{if(!stylesReady()||!app()||!window.ANESVET_BOOT_DIAGNOSTIC?.snapshot().ready)return;hide('avBoot',true);document.body.classList.remove('av-boot-error','av-booting');navigate('cases');}})[b.dataset.avAction]?.();
    });
    for(const page of document.querySelectorAll('.tabpage'))new MutationObserver(schedule).observe(page,{attributes:true,attributeFilter:['class']});
    ['caseStripPatient','caseStripAsa','casePhaseBadge','saveState','securityIdentityChip','caseFreshnessBanner','sessionBanner','orVitalChangeSummary','orVitalSaveFeedback'].forEach(id=>{const el=$(id);if(el)new MutationObserver(schedule).observe(el,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class']});});
    ['orPrimaryActionBtn','orSecondaryPhaseBtn'].forEach(id=>{const el=$(id);if(el)new MutationObserver(schedule).observe(el,{childList:true,attributes:true,attributeFilter:['data-action','hidden','disabled']});});
    // Shell state does not need a full render on every keystroke. Native OR vital
    // entry remains live in or-speed-hardening.js; shell refreshes on committed
    // changes, focus exit, navigation/status mutations and archive events.
    document.addEventListener('change',scheduleFromChange);
    document.addEventListener('focusout',e=>{if(isEditingTarget(e.target))requestAnimationFrame(schedule);},true);
    window.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('final-archive-status',schedule);
    window.ANESVET_MOBILE_OR_OWNER?.subscribe((view,reason)=>{if(!view.editing&&(reason==='viewport'||reason==='pageshow'))schedule();});
    const started=Date.now(),coldLaunch=performance.getEntriesByType('navigation')[0]?.type!=='reload';
    function showBootError(message){
      document.body.classList.remove('av-booting');document.body.classList.add('av-boot-error');hide('avBoot',false);hide('avBootErrorActions',false);
      if($('avBootReview'))$('avBootReview').disabled=!stylesReady()||!app()||!window.ANESVET_BOOT_DIAGNOSTIC?.snapshot().ready;
      txt('avBootTitle','ยังเปิดข้อมูลในเครื่องไม่ได้');txt('avBootStatus',message);hide('avBottom',true);
      $('avBootRetry')?.focus({preventScroll:true});
    }
    function checkBoot(){
      // Startup can paint immediately, but clinical controls must wait for the
      // complete existing stylesheet cascade and the native data-readiness gate.
      const styles=Array.from(document.querySelectorAll('link[data-av-style]'));
      if(styles.some(el=>el.dataset.avStyle==='error')){showBootError('โหลดรูปแบบหน้าจอไม่สำเร็จ ลองเปิดอีกครั้ง ข้อมูลเคสเดิมยังอยู่ในเครื่อง');return;}
      if(!stylesReady()){
        if(Date.now()-started>12000){showBootError('ยังโหลดหน้าจอไม่ครบ ลองเปิดอีกครั้ง ข้อมูลเคสเดิมยังอยู่ในเครื่อง');return;}
        txt('avBootStatus','กำลังเตรียมหน้าจอ');setTimeout(checkBoot,100);return;
      }
      txt('avBootStatus','กำลังเปิดข้อมูลในเครื่อง');
      const boot=window.ANESVET_BOOT_DIAGNOSTIC?.snapshot();
      if(boot?.ready&&app()){
        const status=app().startupStatus?.()||{};
        if(status.primaryUnreadable||status.recoveredOnlyInMemory||status.restoreReview){showBootError('ตรวจข้อมูลและสำเนาที่พบก่อนเริ่มเคสใหม่ ข้อมูลเดิมยังได้รับการเก็บรักษาตามระบบตรวจสอบของโปรแกรม');return;}
        if(coldLaunch&&performance.now()<1200){setTimeout(checkBoot,Math.min(100,1200-performance.now()));return;}
        hide('avBoot',true);$('avBoot').setAttribute('aria-busy','false');document.body.classList.remove('av-booting');
        let next='';try{next=sessionStorage.getItem('anesvet_ui_next_page')||'';sessionStorage.removeItem('anesvet_ui_next_page');}catch(_){}
        // Cold launches show home; reload/update keeps the native active-case route.
        if(next==='patient')navigate('patient');else if(!app().getState().caseStartedAt&&!app().getState().recoveryStartedAt&&!app().getState().caseLocked)navigate('start');
        render();return;
      }
      if(boot?.lastError||Date.now()-started>12000){showBootError('เปิดโปรแกรมไม่สำเร็จ ลองเปิดอีกครั้ง หรือเปิดรายงานปัญหาเพื่อดูรายละเอียด');return;}
      setTimeout(checkBoot,100);
    }
    checkBoot();
  }
  window.ANESVET_MOBILE_DESIGN=Object.freeze({version:'17.6.1',render,home:()=>navigate('start')});
  window.ANESVET_LIFECYCLE_COORDINATOR?.ready(install);
})();
