/* ANESVET V16.18.1 — Patient Master Controller
   UI/controller extraction only. Patient-domain/orchestration/storage semantics are injected and unchanged. */
(function(root){
'use strict';
const VERSION='16.18.1';

function create(ctx={}){
  const $=ctx.$, $$=ctx.$$;
  const escapeHtml=ctx.escapeHtml||((v)=>String(v??''));
  const formatDate=ctx.formatDate||(()=> '');
  const toast=ctx.toast||(()=>{});
  const patientDomain=ctx.patientDomain;
  const patientOrch=ctx.patientOrchestration;
  if(!$||!$$||!patientDomain||!patientOrch||typeof ctx.getState!=='function'||typeof ctx.getPatientCache!=='function'||typeof ctx.setPatientCache!=='function')return null;

  const state=new Proxy({}, {
    get(_t,p){return ctx.getState()?.[p]},
    set(_t,p,v){const s=ctx.getState();if(s)s[p]=v;return true}
  });
  const cache=()=>ctx.getPatientCache()||[];
  const setCache=(rows)=>{ctx.setPatientCache(Array.isArray(rows)?rows:[]);return ctx.getPatientCache()||[]};
  const backend=()=>ctx.getPatientBackend?.()||'initializing';
  const setBackend=(v)=>ctx.setPatientBackend?.(v);

  function normalizePatientKey(v){return patientDomain.normalizeKey(v)}
  function patientFromCase(c){return patientDomain.patientFromCase(c)}
  function patientIdentityKey(p){return patientDomain.patientIdentityKey(p)}
  function activePatientById(id){return patientOrch.resolveActivePatient(cache(),id)}
  function patientHnKeys(p){return patientDomain.hnKeys(p)}
  function patientChipKeys(p){return patientDomain.chipKeys(p)}
  function patientAnesthesiaHistory(p){return patientDomain.anesthesiaHistory(ctx.getArchive?.()||[],p)}
  function caseLowestTemp(c){return root.AnesvetWorkflow?.measuredRange?.(c.records,'temp')?.min??null}
  function caseLowestMap(c){return root.AnesvetWorkflow?.measuredRange?.(c.records,'map')?.min??null}
  function caseLowestSpo2(c){return root.AnesvetWorkflow?.measuredRange?.(c.records,'spo2')?.min??null}
  function caseHistoryConcern(c){
    const parts=[];const diff=String(c.airwayDifficulty||'').trim();
    if(diff&&!/^(none|easy|normal|no)$/i.test(diff))parts.push(`Difficult airway: ${diff}${c.airwayEttSize?` • ETT ${c.airwayEttSize}`:''}`);
    const lowMap=caseLowestMap(c);if(lowMap!==null&&lowMap<60)parts.push(`Lowest MAP ${ctx.fmtDose?.(lowMap)??lowMap} mmHg`);
    const lowSpo2=caseLowestSpo2(c);if(lowSpo2!==null&&lowSpo2<94)parts.push(`Lowest SpO₂ ${ctx.fmtDose?.(lowSpo2)??lowSpo2}%`);
    const low=caseLowestTemp(c);if(low!==null&&low<98)parts.push(`Lowest temp ${ctx.tempTextF?.(low)??low}`);
    const comp=[...new Set((c.complications||[]).map(x=>x.type||x.name).filter(Boolean))];if(comp.length)parts.push(`Complication: ${comp.slice(0,3).join(', ')}${comp.length>3?'…':''}`);
    if(c.emergencyReturnActive||(c.events||[]).some(e=>/emergency return/i.test(`${e.name||''} ${e.note||''}`)))parts.push('Emergency return to OR recorded');
    if(c.recoveryStartedAt&&!c.recoveryCompletedAt)parts.push('Recovery not marked complete');
    if(c.voidedAt)parts.push('Record voided');
    return parts;
  }
  function renderPatientHistory(p=null){
    const panel=$('patientHistoryPanel'),list=$('patientHistoryList'),summary=$('patientHistorySummary'),concerns=$('patientHistoryConcerns');if(!panel||!list||!summary)return;
    if(!p){panel.hidden=true;list.innerHTML='';if(concerns)concerns.hidden=true;return}
    const hist=patientAnesthesiaHistory(p);panel.hidden=false;summary.textContent=`${hist.length} archived case${hist.length===1?'':'s'}${hist[0]?` • last ${formatDate(hist[0].archivedAt||hist[0].createdAt)}`:''}`;
    const concernRows=[];hist.slice(0,5).forEach(c=>caseHistoryConcern(c).forEach(x=>concernRows.push(`${formatDate(c.archivedAt||c.createdAt||Date.now())}: ${x}`)));
    if(concerns){concerns.hidden=!concernRows.length;concerns.innerHTML=concernRows.length?`<b>Previous recorded concerns</b> • ${concernRows.map(escapeHtml).join(' • ')}`:''}
    list.innerHTML=hist.length?hist.slice(0,4).map(c=>`<div class="patient-history-item"><strong>${escapeHtml(formatDate(c.archivedAt||c.createdAt||Date.now()))}</strong><div><strong>${escapeHtml(c.procedure||c.patientProcedure||'Procedure —')}</strong><br><span>ASA ${escapeHtml(c.asa||'—')}${c.emergency?'-E':''} • ${escapeHtml(c.visitId?`Visit ${c.visitId}`:(c.humanRecordId||'No Visit ID'))}</span></div><span>${c.caseLocked?'Final':'Working'}${c.voidedAt?' • VOID':''}</span></div>`).join(''):'<div class="empty-state compact">No previous anesthesia cases linked to this patient.</div>';
  }
  function openPatientHistoryInArchive(){const p=activePatientById($('patientMasterId')?.value||state.patientMasterId||'');if(!p)return;ctx.setTab?.('cases');if($('archiveSearch'))$('archiveSearch').value=p.hospitalId||p.patientName||'';ctx.renderArchives?.()}
  async function persistPatientRecord(p){
    p.updatedAt=Date.now();if(backend()==='IndexedDB')await ctx.idbPutPatient?.(p);
    const next=cache().filter(x=>x.patientId!==p.patientId);next.unshift(p);setCache(next);
    if(backend()!=='IndexedDB')ctx.saveFallbackPatients?.();return p;
  }
  async function retirePatient(id){
    const patientCache=cache(),p=patientCache.find(x=>x.patientId===id);if(!p)return;
    if(state.timer?.running||(state.timer?.elapsedMs||0)>0||(state.records||[]).length){toast('Finish the current anesthesia case before managing Patient Master records');return}
    if(($('patientMasterId')?.value||state.patientMasterId)===p.patientId){toast('Switch or unlink the current patient before retiring this Patient Master');return}
    if(p.mergedInto){toast('This record is already merged into another patient');return}
    if(p.retiredAt){
      const conflict=patientOrch.findRestoreConflict(patientCache,p,{hnKeys:patientHnKeys,chipKeys:patientChipKeys});
      if(conflict){alert(`Cannot restore because an active Patient Master already uses the same HN or Microchip:\n${conflict.patientName||'Unnamed'}${conflict.hospitalId?` • HN ${conflict.hospitalId}`:''}\n\nMerge the duplicate records instead.`);return}
      if(!confirm(`Restore ${p.patientName||'this patient'} to active Patient Master?`))return;
      await persistPatientRecord(patientOrch.restoreRecord(p));renderPatientMaster();renderLinkedPatient();toast('Patient restored');return;
    }
    const reason=prompt(`Retire ${p.patientName||'this patient'} from active Patient Master?\nArchived cases will not be deleted.\n\nReason (optional):`,'');if(reason===null)return;
    await persistPatientRecord(patientOrch.retireRecord(p,reason,Date.now()));renderPatientMaster();renderLinkedPatient();toast('Patient retired — history retained');
  }
  function findMergeTarget(query,sourceId){return patientOrch.findMergeTargets(cache(),query,sourceId,normalizePatientKey)}
  async function mergePatientRecord(sourceId){
    const patientCache=cache(),source=patientCache.find(x=>x.patientId===sourceId);if(!source||source.mergedInto)return;
    if(state.timer?.running||(state.timer?.elapsedMs||0)>0||(state.records||[]).length){toast('Finish the current anesthesia case before merging Patient Master records');return}
    const query=prompt(`Merge duplicate Patient Master\n\nSource: ${source.patientName||'Unnamed'}${source.hospitalId?` • HN ${source.hospitalId}`:''}\n\nEnter TARGET HN, Microchip, exact patient name, or Patient ID:`,'');if(!query?.trim())return;
    const matches=findMergeTarget(query,sourceId);if(matches.length!==1){alert(matches.length?'More than one target matched. Use HN, Microchip, or Patient ID to identify exactly one patient.':'No active target patient found.');return}
    const target=matches[0];if(!confirm(`Merge duplicate record?\n\nSOURCE (will be retired): ${source.patientName||'Unnamed'}${source.hospitalId?` • HN ${source.hospitalId}`:''}\nTARGET (kept): ${target.patientName||'Unnamed'}${target.hospitalId?` • HN ${target.hospitalId}`:''}\n\nLocked anesthesia records will NOT be rewritten. Their old patient IDs are preserved and linked through an alias.`))return;
    const merged=patientOrch.mergeRecords(source,target,Date.now());
    try{await persistPatientRecord(merged.target);await persistPatientRecord(merged.source)}catch(e){toast('Patient merge failed');return}
    if(($('patientMasterId')?.value||state.patientMasterId)===source.patientId)usePatientMaster(merged.target.patientId);
    renderPatientMaster();renderLinkedPatient();toast('Duplicate merged — original anesthesia records preserved');
  }
  function sexReproText(p){const sex=({male:'Male',female:'Female'})[p.sex]||'Sex unknown',repro=({intact:'Intact',neutered:'Neutered',spayed:'Spayed'})[p.reproductiveStatus]||'status unknown';return `${sex} • ${repro}`}
  function patientAgeText(p){const d=ctx.dateFromIso?.(p.birthDate||''),parts=ctx.agePartsFromDob?.(d);return parts?ctx.formatAgeThai?.(parts,!!p.birthDateEstimated):'Age —'}
  function renderPreviousWeightReference(p=null){
    const box=$('previousWeightReference'),text=$('previousWeightText');if(!box||!text)return;
    if(!p||!(Number(p.lastWeight)>0)){box.hidden=true;text.textContent='—';return}
    const d=p.lastWeightAt?formatDate(p.lastWeightAt):null;box.hidden=false;text.textContent=`Previous weight: ${p.lastWeight} kg${d?` • recorded ${d}`:' • recorded date unavailable'} • reference only — enter today's measured weight below`;
  }
  function renderLinkedPatient(){
    const patientCache=cache(),box=$('linkedPatientBanner'),id=$('patientMasterId')?.value||state.patientMasterId||'',raw=patientCache.find(x=>x.patientId===id),p=activePatientById(id)||raw;
    if(!box)return;box.hidden=!p;if(p&&$('linkedPatientText'))$('linkedPatientText').textContent=`${p.patientName}${p.hospitalId?' • HN '+p.hospitalId:''} • ${p.species==='cat'?'Cat':'Dog'}${p.breed?' • '+p.breed:''}${p.retiredAt?' • RETIRED':''}`;
    renderPreviousWeightReference(p||null);renderPatientHistory(p||null);
  }
  function patientSearchMatches(p,q){return patientDomain.searchMatches(p,q)}
  function renderPatientMaster(){
    const patientCache=cache(),box=$('patientMasterResults');if(!box)return;const q=($('patientMasterSearch')?.value||'').trim(),showRetired=!!$('showRetiredPatients')?.checked;
    const active=patientCache.filter(p=>!p.retiredAt&&!p.mergedInto);
    if($('patientMasterCount'))$('patientMasterCount').textContent=`${active.length} ACTIVE${patientCache.length!==active.length?` • ${patientCache.length-active.length} RETIRED`:''}`;
    if(!q){if($('patientMasterSearchStatus'))$('patientMasterSearchStatus').textContent='Search when needed';box.innerHTML='<div class="empty-state patient-master-idle">พิมพ์ HN / ชื่อ / Microchip / Breed เพื่อค้นหาผู้ป่วยเดิม</div>';renderLinkedPatient();return}
    const eligible=patientCache.filter(p=>showRetired||(!p.retiredAt&&!p.mergedInto));const list=eligible.filter(p=>patientSearchMatches(p,q)).sort((a,b)=>(b.updatedAt||0)-(a.updatedAt||0)).slice(0,30);
    if($('patientMasterSearchStatus'))$('patientMasterSearchStatus').textContent=`${list.length} matches`;
    if(!list.length){box.innerHTML='<div class="empty-state">ไม่พบผู้ป่วย • สามารถสร้าง New patient ได้</div>';renderLinkedPatient();return}
    box.innerHTML=list.map(p=>{const retired=!!p.retiredAt,merged=!!p.mergedInto;return `<div class="patient-master-card ${retired?'retired':''} ${merged?'merged':''}"><div><h3>${escapeHtml(p.patientName||'Unnamed')} ${p.hospitalId?`<span class="muted">• HN ${escapeHtml(p.hospitalId)}</span>`:''}${retired?'<span class="patient-retired-badge">RETIRED</span>':''}${merged?'<span class="patient-merged-badge">MERGED</span>':''}</h3><div class="patient-master-meta"><span>${p.species==='cat'?'Cat':'Dog'}</span><span>${escapeHtml(p.breed||'Breed —')}</span><span>${escapeHtml(sexReproText(p))}</span><span>${escapeHtml(patientAgeText(p))}</span>${p.lastWeight?`<span>Last BW ${escapeHtml(p.lastWeight)} kg</span>`:''}${p.microchip?`<span>Chip ${escapeHtml(p.microchip)}</span>`:''}${retired&&p.retiredReason?`<span>${escapeHtml(p.retiredReason)}</span>`:''}</div></div><div class="patient-master-actions">${!retired?`<button type="button" class="btn primary patient-use-btn" data-use-patient="${escapeHtml(p.patientId)}">Use patient</button>`:''}${merged?`<button type="button" class="btn" disabled>Merged → ${escapeHtml(activePatientById(p.patientId)?.patientName||'target')}</button>`:`<button type="button" class="btn patient-retire-btn" data-retire-patient="${escapeHtml(p.patientId)}">${retired?'Restore':'Retire'}</button>`}${!retired?`<button type="button" class="btn patient-merge-btn" data-merge-patient="${escapeHtml(p.patientId)}">Merge duplicate</button>`:''}</div></div>`}).join('');
    $$('.patient-use-btn').forEach(b=>b.addEventListener('click',()=>usePatientMaster(b.dataset.usePatient)));$$('.patient-retire-btn').forEach(b=>b.addEventListener('click',()=>retirePatient(b.dataset.retirePatient)));$$('.patient-merge-btn').forEach(b=>b.addEventListener('click',()=>mergePatientRecord(b.dataset.mergePatient)));renderLinkedPatient();
  }
  function setPatientField(id,value){const el=$(id);if(!el)return;if(el.type==='checkbox')el.checked=!!value;else el.value=value??''}
  function usePatientMaster(id){
    const p=activePatientById(id);if(!p)return;if(state.timer?.running||(state.timer?.elapsedMs||0)>0||(state.records||[]).length){toast('เคสเริ่มแล้ว ไม่สามารถเปลี่ยน Patient Master ได้');return}
    setPatientField('patientMasterId',p.patientId);state.patientMasterId=p.patientId;setPatientField('patientName',p.patientName);setPatientField('hospitalId',p.hospitalId);setPatientField('visitId','');setPatientField('species',p.species);setPatientField('sex',p.sex);setPatientField('reproductiveStatus',p.reproductiveStatus);setPatientField('microchip',p.microchip);setPatientField('breed',p.breed);setPatientField('birthDate',p.birthDate);setPatientField('birthDateEstimated',p.birthDateEstimated);setPatientField('ageSource',p.ageSource);setPatientField('estimatedBirthPeriod',p.estimatedBirthPeriod);setPatientField('approxAgeYears',p.approxAgeYears||'');setPatientField('approxAgeMonths',p.approxAgeMonths||'');setPatientField('approxAgeWeeks',p.approxAgeWeeks||'');setPatientField('weight','');setPatientField('bcs',p.lastBcs||'');setPatientField('patientAllergies',p.allergies);setPatientField('patientComorbidities',p.comorbidities);setPatientField('patientPrecautions',p.precautions);
    if($('birthDateUnknown'))$('birthDateUnknown').checked=!!p.birthDateEstimated;ctx.renderAgeUI?.();syncAsaCards();state.patientSaved=false;updatePatientSaveStatus();if($('patientMasterSearch'))$('patientMasterSearch').value='';renderPatientMaster();ctx.updateDashboard?.();toast(`ใช้ Patient Master: ${p.patientName}`);
  }
  function clearPatientRegistration(){
    if(state.timer?.running||(state.timer?.elapsedMs||0)>0||(state.records||[]).length){toast('เคสเริ่มแล้ว ไม่สามารถเปลี่ยนผู้ป่วยได้');return}
    ['patientMasterId','patientName','hospitalId','visitId','microchip','breed','birthDate','age','ageSource','estimatedBirthPeriod','patientAllergies','patientComorbidities','patientPrecautions'].forEach(id=>setPatientField(id,''));
    setPatientField('species','');setPatientField('sex','');setPatientField('reproductiveStatus','');setPatientField('birthDateEstimated',false);setPatientField('approxAgeYears','');setPatientField('approxAgeMonths','');setPatientField('approxAgeWeeks','');setPatientField('weight','');setPatientField('bcs','');setPatientField('asa','');
    if($('birthDateUnknown'))$('birthDateUnknown').checked=false;if($('approxAgeControls'))$('approxAgeControls').hidden=true;state.patientMasterId='';state.patientSaved=false;ctx.renderAgeUI?.();updatePatientSaveStatus();if($('patientMasterSearch'))$('patientMasterSearch').value='';renderPatientMaster();ctx.updateDashboard?.();$('patientName')?.focus();
  }
  function existingPatientLifecycle(id,key,fallback){const p=cache().find(x=>x.patientId===id);const v=p?.[key];return v===undefined?fallback:JSON.parse(JSON.stringify(v))}
  function currentPatientMasterObject(){
    const id=$('patientMasterId')?.value||state.patientMasterId||'';
    return {patientId:id||crypto.randomUUID?.()||String(Date.now()+Math.random()),hospitalId:$('hospitalId')?.value.trim()||'',patientName:$('patientName')?.value.trim()||'',species:$('species')?.value||'',sex:$('sex')?.value||'',reproductiveStatus:$('reproductiveStatus')?.value||'',microchip:$('microchip')?.value.trim()||'',breed:$('breed')?.value.trim()||'',birthDate:$('birthDate')?.value||'',birthDateEstimated:!!$('birthDateEstimated')?.checked,ageSource:$('ageSource')?.value||'',estimatedBirthPeriod:$('estimatedBirthPeriod')?.value||'',approxAgeYears:$('approxAgeYears')?.value||'0',approxAgeMonths:$('approxAgeMonths')?.value||'0',approxAgeWeeks:$('approxAgeWeeks')?.value||'0',lastWeight:$('weight')?.value||'',lastWeightAt:Date.now(),lastBcs:$('bcs')?.value||'',allergies:$('patientAllergies')?.value.trim()||'',comorbidities:$('patientComorbidities')?.value.trim()||'',precautions:$('patientPrecautions')?.value.trim()||'',retiredAt:existingPatientLifecycle(id,'retiredAt',null),retiredReason:existingPatientLifecycle(id,'retiredReason',''),mergedInto:existingPatientLifecycle(id,'mergedInto',''),mergedPatientIds:existingPatientLifecycle(id,'mergedPatientIds',[]),hnAliases:existingPatientLifecycle(id,'hnAliases',[]),microchipAliases:existingPatientLifecycle(id,'microchipAliases',[]),mergeAudit:existingPatientLifecycle(id,'mergeAudit',[]),createdAt:Date.now(),updatedAt:Date.now()};
  }
  async function upsertPatientMasterFromCurrent(){
    if(!$('patientName')?.value.trim())return null;let patientCache=cache(),p=currentPatientMasterObject(),existing=patientCache.find(x=>x.patientId===p.patientId);
    const hn=normalizePatientKey(p.hospitalId),chip=normalizePatientKey(p.microchip);const conflicts=patientCache.filter(x=>x.patientId!==p.patientId&&!x.mergedInto&&((hn&&patientHnKeys(x).has(hn))||(chip&&patientChipKeys(x).has(chip))));const unique=[...new Map(conflicts.map(x=>[x.patientId,x])).values()];
    if(unique.length>1){alert('Data conflict: HN / microchip matches more than one Patient Master. Please check the identifiers before saving.');return false}
    if(unique.length===1){
      const m=unique[0],sameHn=hn&&patientHnKeys(m).has(hn),sameChip=chip&&patientChipKeys(m).has(chip),mismatch=[];
      if(normalizePatientKey(m.patientName)!==normalizePatientKey(p.patientName))mismatch.push(`Name: ${m.patientName} ↔ ${p.patientName}`);if((m.species||'')!==(p.species||''))mismatch.push(`Species: ${m.species||'—'} ↔ ${p.species||'—'}`);if(normalizePatientKey(m.breed)!==normalizePatientKey(p.breed)&&m.breed&&p.breed)mismatch.push(`Breed: ${m.breed} ↔ ${p.breed}`);
      const reason=[sameHn?'HN match':'',sameChip?'Microchip match':''].filter(Boolean).join(' + '),diffText=mismatch.length?`\n\nDifferences:\n• ${mismatch.join('\n• ')}`:'';
      const choice=prompt(`⚠ Existing Patient Master match (${reason})\n\nExisting: ${m.patientName||'Unnamed'} • ${m.species==='cat'?'Cat':'Dog'}${m.breed?' • '+m.breed:''}\nForm: ${p.patientName||'Unnamed'} • ${p.species==='cat'?'Cat':'Dog'}${p.breed?' • '+p.breed:''}${diffText}\n\nType USE = load existing patient\nType NEW = create a separate patient (conflicting identifier(s) will be cleared)\nCancel = return to check HN / microchip`,'');
      if(choice===null||!choice.trim())return false;
      if(choice.trim().toUpperCase()==='USE'){usePatientMaster(m.patientId);toast('Existing Patient Master loaded • enter today’s current weight and save again');return false}
      if(choice.trim().toUpperCase()==='NEW'){if(sameHn)setPatientField('hospitalId','');if(sameChip)setPatientField('microchip','');setPatientField('patientMasterId','');state.patientMasterId='';state.patientSaved=false;updatePatientSaveStatus();renderLinkedPatient();toast('Conflicting identifier cleared • enter a unique HN / microchip, then Save again');if(sameHn)$('hospitalId')?.focus();else $('microchip')?.focus();return false}
      toast('No merge performed • type USE or NEW, or check the identifiers');return false;
    }
    if(existing){p.patientId=existing.patientId;p.createdAt=existing.createdAt||p.createdAt;p.retiredAt=existing.retiredAt||null;p.retiredReason=existing.retiredReason||'';p.mergedInto=existing.mergedInto||'';p.mergedPatientIds=Array.isArray(existing.mergedPatientIds)?existing.mergedPatientIds:[];p.hnAliases=Array.isArray(existing.hnAliases)?existing.hnAliases:[];p.microchipAliases=Array.isArray(existing.microchipAliases)?existing.microchipAliases:[];p.mergeAudit=Array.isArray(existing.mergeAudit)?existing.mergeAudit:[]}
    try{if(backend()==='IndexedDB')p=await ctx.idbPutPatient?.(p);else{patientCache=patientCache.filter(x=>x.patientId!==p.patientId);patientCache.unshift(p);setCache(patientCache);ctx.saveFallbackPatients?.()}}
    catch(e){setBackend('localStorage fallback');patientCache=cache().filter(x=>x.patientId!==p.patientId);patientCache.unshift(p);setCache(patientCache);ctx.saveFallbackPatients?.()}
    patientCache=cache().filter(x=>x.patientId!==p.patientId);patientCache.unshift(p);setCache(patientCache);setPatientField('patientMasterId',p.patientId);state.patientMasterId=p.patientId;renderPatientMaster();renderLinkedPatient();return p;
  }
  function syncAsaCards(){const selected=$('asa')?.value||'';$$('.asa-card').forEach(c=>c.classList.toggle('selected',!!selected&&c.dataset.asa===selected));if($('selectedAsaBadge'))$('selectedAsaBadge').textContent=selected?`ASA ${selected}${$('emergency')?.checked?'-E':''}`:'ASA —'}
  function updatePatientSaveStatus(){const el=$('patientSaveStatus');if(!el)return;if(state.patientSaved){el.className='status-pill good';el.textContent='ยืนยันข้อมูลแล้ว'}else{el.className='status-pill warn';el.textContent='ยังไม่ยืนยันข้อมูล'}}
  function renderPatientRiskBanner(){
    const parts=[],allergy=$('patientAllergies')?.value.trim(),disease=$('patientComorbidities')?.value.trim(),caution=$('patientPrecautions')?.value.trim();if(allergy)parts.push(`ALLERGY: ${allergy}`);if(disease)parts.push(`DISEASE: ${disease}`);if(caution)parts.push(`CAUTION: ${caution}`);
    const structured=ctx.preopRiskSummaryLabels?.({compact:true})||[];if(structured.length)parts.push(`RISK: ${structured.slice(0,5).join(', ')}${structured.length>5?` +${structured.length-5}`:''}`);
    const b=$('patientRiskBanner');if(!b)return;b.hidden=!parts.length;if($('patientRiskText'))$('patientRiskText').textContent=parts.join(' • ');if($('editRiskBtn'))$('editRiskBtn').hidden=!(allergy||disease||caution);if($('reviewAnestheticRiskBtn'))$('reviewAnestheticRiskBtn').hidden=!structured.length;
  }
  function bind(){
    $('viewPatientHistoryBtn')?.addEventListener('click',openPatientHistoryInArchive);$('patientMasterSearch')?.addEventListener('input',renderPatientMaster);$('showRetiredPatients')?.addEventListener('change',renderPatientMaster);$('newPatientMasterBtn')?.addEventListener('click',clearPatientRegistration);
    // R09: unlink changes the patient identity relationship. Do not allow this
    // silently during an active/recorded case, or leave old SAVED readiness intact.
    $('unlinkPatientBtn')?.addEventListener('click',()=>{
      if(state.caseStartedAt||state.timer?.running||(state.timer?.elapsedMs||0)>0||(state.records||[]).length){
        toast('Current case started or recorded — cannot unlink Patient Master');return;
      }
      setPatientField('patientMasterId','');state.patientMasterId='';
      state.patientSaved=false;ctx.invalidatePreOrOverride?.();
      updatePatientSaveStatus();renderLinkedPatient();ctx.updateDashboard?.({persist:false});
      toast('Unlinked from Patient Master — Save Patient & Case Setup again');
    });
    // R04: ASA selection must not reapply all hospital settings before its UI state is synchronized.
    $$('.asa-card').forEach(card=>card.addEventListener('click',()=>{const input=$('asa');if(!input)return;input.value=card.dataset.asa;state.patientSaved=false;syncAsaCards();updatePatientSaveStatus();ctx.updateDashboard?.()}));
    $('editRiskBtn')?.addEventListener('click',()=>ctx.setTab?.('patient'));$('reviewAnestheticRiskBtn')?.addEventListener('click',()=>ctx.setTab?.('preop'));
  }

  return Object.freeze({
    version:VERSION,bind,normalizePatientKey,patientFromCase,patientIdentityKey,activePatientById,renderPatientHistory,renderLinkedPatient,renderPatientMaster,usePatientMaster,clearPatientRegistration,currentPatientMasterObject,upsertPatientMasterFromCurrent,syncAsaCards,updatePatientSaveStatus,renderPatientRiskBanner,persistPatientRecord,retirePatient,mergePatientRecord
  });
}

const api=Object.freeze({version:VERSION,create});root.ANESVET_PATIENT_MASTER_CONTROLLER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
