/* ANESVET V16.21.0 — Finalization & Archive Controller
   Incremental controller extraction. Final Lock prerequisites, checksum semantics,
   archive persistence, amendment/VOID rules, and report behavior remain injected and unchanged. */
(function(root){
'use strict';
const VERSION='16.21.0';

function create(ctx={}){
  const $=ctx.$, $$=ctx.$$;
  const escapeHtml=ctx.escapeHtml||((v)=>String(v??''));
  const formatClock=ctx.formatClock||(()=>''), formatDate=ctx.formatDate||(()=>''), formatElapsed=ctx.formatElapsed||(()=>''), fmtVol=ctx.fmtVol||((v)=>String(v??''));
  const toast=ctx.toast||(()=>{}), confirm=ctx.confirm||((m)=>root.confirm?.(m)??false), prompt=ctx.prompt||((m,d='')=>root.prompt?.(m,d)??null);
  if(!$||!$$||typeof ctx.getState!=='function')return null;
  const state=new Proxy({}, {get(_t,p){return ctx.getState()?.[p]},set(_t,p,v){const s=ctx.getState();if(s)s[p]=v;return true}});
  let amendmentArchiveIndex=null;

  const getBackend=()=>ctx.getArchiveBackend?.()||'initializing';
  const getCache=()=>ctx.getArchiveCache?.()||[];
  const setCache=(rows)=>ctx.setArchiveCache?.(rows||[]);
  function getArchive(){const rows=getCache();return rows.length?rows:(ctx.getLegacyArchiveSeed?.()||[])}
  function persistFallback(){ctx.persistArchiveFallback?.(getCache())}

  function renderFinalSignoff(){
    state.finalSignoff=state.finalSignoff||{anesthetist:null,surgeon:null};
    const defs=[['anesthetist','signoffAnesthetistName','signoffAnesthetistTime','signAnesthetistBtn'],['surgeon','signoffSurgeonName','signoffSurgeonTime','signSurgeonBtn']];
    defs.forEach(([role,nameId,timeId,btnId])=>{
      const signed=state.finalSignoff[role],source=$(role)?.value.trim()||'';
      if($(nameId))$(nameId).textContent=signed?.name||source||'—';
      if($(timeId))$(timeId).textContent=signed?`Signed ${formatDate(signed.epoch)} ${formatClock(signed.epoch)}`:'Not signed';
      if($(btnId)){$(btnId).disabled=!!signed;$(btnId).textContent=signed?'✓ Signed':`✓ Sign ${role}`;$(btnId).closest('.signoff-card')?.classList.toggle('signed',!!signed)}
    });
    const ok=!!state.finalSignoff.anesthetist&&!!state.finalSignoff.surgeon;
    if($('finalSignoffStatus')){$('finalSignoffStatus').textContent=ok?'SIGNED':'SIGN-OFF REQUIRED';$('finalSignoffStatus').className=`status-pill ${ok?'good':'warn'}`}
    return ok;
  }
  async function signFinalRole(role){
    if(state.caseLocked){toast('Record already locked');return}
    let name=$(role)?.value.trim();if(!name){toast(`กรุณากรอกชื่อ ${role} ใน Patient & Case Setup ก่อน`);return}
    let identity=null;
    if(ctx.securityEnabled?.()){
      identity=await ctx.authenticateForAction?.('final-signoff',{expectedName:name,title:`Final sign-off • ${role}`});
      if(!identity)return;
      name=identity.displayName||name;
      if(!confirm(`Authenticated as ${name}

Sign final record as ${role}?`))return;
    }else if(!confirm(`Sign final record as ${role}?
${name}`))return;
    state.finalSignoff=state.finalSignoff||{anesthetist:null,surgeon:null};
    state.finalSignoff[role]={name,epoch:Date.now(),...(identity?{staffId:identity.id,staffCode:identity.staffCode||'',staffRole:identity.role,sessionId:identity.sessionId||'',deviceId:identity.deviceId||'',authMethod:identity.authMethod||'local-pin'}:{})};
    ctx.addAudit?.('FINAL_SIGNOFF',`${role}: ${name}`,name);ctx.save?.();renderFinalSignoff();renderEndCase();
  }
  function renderDefaultReportPreference(){
    const pref=ctx.currentSettingsObject?.()?.defaultReport||'summary',summary=$('endExportSummaryPdfBtn'),full=$('endExportPdfBtn');
    if(summary)summary.classList.toggle('primary',pref==='summary');
    if(full)full.classList.toggle('primary',pref==='full');
  }
  function plannedMedicationReconciliationItems(){
    const plan=state.protocolSnapshot?.caseDrugPlan||state.caseDrugPlan||[];
    return (Array.isArray(plan)?plan:[]).filter(d=>{const phase=String(d?.phase||'').toLowerCase(),role=String(d?.role||'').toLowerCase();return !d?.standby&&phase!=='emergency'&&!role.includes('emergency')&&!role.includes('standby')});
  }
  function medicationReconciliationComplete(){
    const mr=root.AnesvetMedicationReconciliation;
    if(mr?.isComplete)return !!mr.isComplete(ctx.getState());
    return plannedMedicationReconciliationItems().length===0;
  }
  function focusMedicationReconciliation(){
    const mr=root.AnesvetMedicationReconciliation;
    if(mr?.focusPending)return mr.focusPending();
    const el=$('medicationReconciliationPanel');if(el){try{el.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){el.scrollIntoView()}}
  }
  function renderEndCase(){
    renderDefaultReportPreference();
    if(!$('endcase'))return;
    $('endPatient').textContent=`${$('patientName')?.value.trim()||'Unnamed'} • ${{cat:'Cat',dog:'Dog'}[$('species')?.value]||'—'} • ${$('weight')?.value||'—'} kg`;
    $('endProcedure').textContent=$('procedure')?.value.trim()||'—';
    $('endDuration').textContent=formatElapsed(ctx.currentElapsed?.()||0);
    $('endRecordCount').textContent=(state.records||[]).length;
    $('endEventCount').textContent=(state.events||[]).length;
    if($('endDrugAdminCount'))$('endDrugAdminCount').textContent=(state.drugAdministrations||[]).filter(x=>!x.voidedAt).length;
    const activeComplications=(state.complications||[]).filter(x=>x.status!=='resolved').length;if($('endActiveComplications'))$('endActiveComplications').textContent=String(activeComplications);
    $('endRecoveryStatus').textContent=state.recoveryCompletedAt?'Complete':'Review recovery';
    const latestScore=(state.recoveryScores||[]).at(-1);if($('endRecoveryScore'))$('endRecoveryScore').textContent=latestScore?`${latestScore.total}/${latestScore.possible} (${latestScore.percent}%)`:'—';
    const endFm=ctx.getFluidMetrics?.()||{totalIn:0,loss:0,urine:0};
    if($('endFluidTotal'))$('endFluidTotal').textContent=`${fmtVol(endFm.totalIn)} mL`;
    if($('endBloodLoss'))$('endBloodLoss').textContent=`${fmtVol(endFm.loss)} mL`;
    if($('endUrine'))$('endUrine').textContent=`${fmtVol(endFm.urine)} mL`;
    const signoffReady=renderFinalSignoff();
    const ready=!!state.recoveryCompletedAt&&signoffReady&&!(state.alertEpisodes||[]).some(a=>!a.resolvedAt)&&activeComplications===0&&medicationReconciliationComplete()&&['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].every(id=>!!$(id)?.checked);
    $('endCaseReadiness').textContent=ready?'READY TO END':'REVIEW';
    $('endCaseReadiness').className=`status-pill ${ready?'good':'warn'}`;
  }
  async function finalizeCase(){
    if(!ctx.clinicalWriteAllowed?.())return;
    if(!state.recoveryCompletedAt){toast('Recovery must be completed or completed with a documented override before final lock');ctx.setTab?.('recovery');return}
    if((state.alertEpisodes||[]).some(a=>!a.resolvedAt)){toast('Resolve active alerts / document outcome before Lock');return}
    const activeComplications=(state.complications||[]).filter(x=>x.status!=='resolved').length;if(activeComplications){toast(`ยังมี ${activeComplications} active complication — resolve/document outcome ก่อน Lock`);return}
    if(!medicationReconciliationComplete()){toast('Reconcile planned medications: document each item as Given or Not given before Final Lock');focusMedicationReconciliation();return}
    const ready=renderFinalSignoff()&&['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].every(id=>!!$(id)?.checked);if(!ready){toast('กรุณาตรวจ checklist และ Final Sign-off ก่อน End Case');return}
    if(!confirm('End, LOCK & Archive this anesthesia case? หลัง archive เคสนี้จะถือเป็น final record'))return;
    if(state.timer?.running)ctx.pauseTimer?.();
    state.casePhase='complete';state.caseLocked=true;state.lockedAt=Date.now();ctx.addAudit?.('CASE_LOCKED','Final clinical record locked');
    state.finalChecksum=await ctx.computeCaseChecksum?.(ctx.getState());state.checksumAlgorithm='SHA-256';state.checksumCreatedAt=Date.now();
    ctx.renderCasePhase?.();ctx.save?.({persistLocked:true});await ctx.releaseScreenWakeLock?.(true);
    const archiveWriteOk=await archiveSnapshot(),assurance=await verifyFinalArchive(ctx.getState());
    try{document.dispatchEvent(new CustomEvent('anesvet:final-archive-status',{detail:{...assurance,archiveWriteOk}}))}catch(e){}
    if(!archiveWriteOk)toast('Final record is LOCKED but archive copy could not be verified — retry archive before starting a new case');
    if(typeof root.showCaseFinalizedDialog==='function')root.showCaseFinalizedDialog();else if(assurance.ok)setTimeout(()=>ctx.resetCurrent?.(),350);
  }

  async function archiveSnapshot(){
    ctx.save?.();ctx.addAudit?.('CASE_ARCHIVED',state.caseLocked?'Locked final record archived':'Working copy archived');ctx.save?.();
    const snap=JSON.parse(JSON.stringify(ctx.getState()));if(!snap.humanRecordId)snap.humanRecordId=ctx.makeHumanRecordId?.(snap.createdAt||Date.now());if(snap.caseLocked&&!snap.finalChecksum){snap.finalChecksum=await ctx.computeCaseChecksum?.(snap);snap.checksumAlgorithm='SHA-256';snap.checksumCreatedAt=Date.now()}snap.archivedAt=Date.now();if(snap.caseLocked&&!snap.lockedAt)snap.lockedAt=Date.now();if(!Array.isArray(snap.amendments))snap.amendments=[];if(!Array.isArray(snap.auditTrail))snap.auditTrail=[];
    try{await ctx.initArchiveDb?.();if(getBackend()==='IndexedDB')await ctx.idbPutCase?.(snap);let rows=getCache().filter(c=>c.caseId!==snap.caseId);rows.unshift(snap);setCache(rows);if(getBackend()!=='IndexedDB')persistFallback();renderArchives();ctx.renderStorageStatus?.();if(snap.caseLocked)ctx.clearSafetyCheckpoint?.();toast('Archived current case');return true}catch(e){console.error(e);toast('Archive failed');return false}
  }
  function legacyFnv1aClinicalChecksum(caseObj){const text=JSON.stringify(ctx.originalClinicalPayload?.(caseObj)),prefix='FNV1A-';let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)}return `${prefix}${(h>>>0).toString(16).padStart(8,'0').toUpperCase()}`}
  async function computeChecksumForStored(caseObj,storedChecksum){return String(storedChecksum||'').toUpperCase().startsWith('FNV1A-')?legacyFnv1aClinicalChecksum(caseObj):await ctx.computeCaseChecksum?.(caseObj)}
  async function verifyFinalArchive(caseObj=ctx.getState()){
    const src=caseObj||ctx.getState();if(!src?.caseLocked)return {ok:false,code:'NOT_LOCKED',message:'Current record is not Final Locked'};
    if(!src.finalChecksum)return {ok:false,code:'NO_CHECKSUM',message:'Final Locked record has no checksum'};
    await ctx.initArchiveDb?.();
    const archived=getArchive().find(c=>c?.caseId===src.caseId);
    if(!archived)return {ok:false,code:'ARCHIVE_MISSING',message:'Locked current record was not found in Cases / Archive',caseId:src.caseId,recordId:src.humanRecordId||'',backend:getBackend(),expectedChecksum:src.finalChecksum};
    if(!archived.finalChecksum)return {ok:false,code:'ARCHIVE_NO_CHECKSUM',message:'Archived copy has no final checksum',caseId:src.caseId,recordId:src.humanRecordId||'',backend:getBackend(),archivedAt:archived.archivedAt||0,expectedChecksum:src.finalChecksum};
    const expected=String(src.finalChecksum||'').toUpperCase(),archiveStored=String(archived.finalChecksum||'').toUpperCase(),currentComputed=await computeChecksumForStored(src,expected),archiveComputed=await computeChecksumForStored(archived,archiveStored);
    const currentMatches=String(currentComputed||'').toUpperCase()===expected,archiveMatches=String(archiveComputed||'').toUpperCase()===archiveStored,crossMatches=archiveStored===expected;
    const ok=currentMatches&&archiveMatches&&crossMatches;
    return {ok,code:ok?'VERIFIED':(!currentMatches?'CURRENT_CHECKSUM_MISMATCH':!archiveMatches?'ARCHIVE_CHECKSUM_MISMATCH':'CHECKSUM_DIVERGENCE'),message:ok?'Locked current record and archived copy match the final checksum':'Final archive verification failed',caseId:src.caseId,recordId:src.humanRecordId||'',backend:getBackend(),lockedAt:src.lockedAt||0,archivedAt:archived.archivedAt||0,expectedChecksum:src.finalChecksum,archiveChecksum:archived.finalChecksum,currentComputed,archiveComputed,algorithm:expected.startsWith('FNV1A-')?'FNV1A-legacy':String(src.checksumAlgorithm||'SHA-256'),counts:{records:(archived.records||[]).length,recoveryRecords:(archived.recoveryRecords||[]).length,events:(archived.events||[]).length,drugAdministrations:(archived.drugAdministrations||[]).length,complications:(archived.complications||[]).length,audit:(archived.auditTrail||[]).length,amendments:(archived.amendments||[]).length}};
  }
  async function retryFinalArchive(){
    if(!state?.caseLocked)return {ok:false,code:'NOT_LOCKED',message:'Current record is not Final Locked'};
    const writeOk=await archiveSnapshot(),result=await verifyFinalArchive(ctx.getState());
    try{document.dispatchEvent(new CustomEvent('anesvet:final-archive-status',{detail:{...result,archiveWriteOk:writeOk,retry:true}}))}catch(e){}
    return {...result,archiveWriteOk:writeOk};
  }

  function openAmendmentDialog(i){const c=getArchive()[i];if(!c||!c.caseLocked){toast('Amendment ใช้กับ locked final record');return}amendmentArchiveIndex=i;$('amendmentCaseName').textContent=`${c.patientName||'Unnamed'} • ${c.procedure||c.patientProcedure||'—'}`;$('amendmentAuthor').value=$('anesthetist')?.value.trim()||'';$('amendmentReason').value='';$('amendmentText').value='';const d=$('amendmentDialog');if(d?.showModal)d.showModal();else d?.setAttribute('open','')}
  function closeAmendmentDialog(){const d=$('amendmentDialog');if(!d)return;if(d.close)d.close();else d.removeAttribute('open');amendmentArchiveIndex=null}
  async function saveAmendment(){const i=amendmentArchiveIndex,c=getArchive()[i];if(!c)return;const author=$('amendmentAuthor').value.trim(),reason=$('amendmentReason').value.trim(),text=$('amendmentText').value.trim();if(!author||!reason||!text){toast('กรุณากรอก Author, Reason และ Amendment');return}if(!confirm('Add amendment to LOCKED FINAL record?\\nOriginal clinical data จะไม่ถูกแก้'))return;c.amendments=c.amendments||[];const a={id:root.crypto?.randomUUID?root.crypto.randomUUID():String(Date.now()),epoch:Date.now(),clock:formatClock(),author,reason,text};c.amendments.push(a);c.auditTrail=c.auditTrail||[];c.auditTrail.push({id:root.crypto?.randomUUID?root.crypto.randomUUID():String(Date.now()+1),epoch:Date.now(),clock:formatClock(),elapsedMs:c.timer?.elapsedMs||0,action:'AMENDMENT_ADDED',detail:`${reason} • ${text}`,actor:author});try{if(getBackend()==='IndexedDB')await ctx.idbPutCase?.(c);else persistFallback();closeAmendmentDialog();renderArchives();toast('Amendment added')}catch(e){toast('Amendment save failed')}}

  function archiveFilteredList(){
    let list=getArchive().slice(),q=$('archiveSearch')?.value.trim().toLowerCase()||'',from=$('archiveDateFrom')?.value||'',to=$('archiveDateTo')?.value||'',status=$('archiveStatusFilter')?.value||'all',sort=$('archiveSort')?.value||'newest';
    if(q)list=list.filter(c=>[c.patientName,c.hospitalId,c.visitId,c.microchip,c.humanRecordId,c.procedure,c.patientProcedure,c.surgeon,c.anesthetist].some(v=>String(v||'').toLowerCase().includes(q)));
    if(from)list=list.filter(c=>formatDate(c.archivedAt||c.createdAt||0)>=from);
    if(to)list=list.filter(c=>formatDate(c.archivedAt||c.createdAt||0)<=to);
    if(status==='locked')list=list.filter(c=>c.caseLocked&&!c.voidedAt);if(status==='voided')list=list.filter(c=>!!c.voidedAt);if(status==='working')list=list.filter(c=>!c.caseLocked);
    list.sort((a,b)=>sort==='oldest'?((a.archivedAt||a.createdAt||0)-(b.archivedAt||b.createdAt||0)):sort==='patient'?String(a.patientName||'').localeCompare(String(b.patientName||''),'th'):sort==='hn'?String(a.hospitalId||a.visitId||a.humanRecordId||'').localeCompare(String(b.hospitalId||b.visitId||b.humanRecordId||''),'th'):((b.archivedAt||b.createdAt||0)-(a.archivedAt||a.createdAt||0)));
    return list;
  }
  function renderArchives(){
    const source=getArchive(),list=archiveFilteredList(),el=$('archiveList');ctx.renderStorageStatus?.();ctx.renderBackupHealth?.();
    if($('archiveResultCount'))$('archiveResultCount').textContent=`${list.length} / ${source.length} cases`;
    if(!el)return;
    if(!list.length){el.className='archive-list empty-state';el.textContent=source.length?'ไม่พบเคสที่ตรงกับตัวกรอง':'ยังไม่มี archived case';return}
    el.className='archive-list';
    el.innerHTML=list.map(c=>{const i=source.findIndex(x=>x.caseId===c.caseId),name=c.patientName||'Unnamed',asa=`ASA ${c.asa||'—'}${c.emergency?'-E':''}`,records=(c.records||[]).length,events=(c.events||[]).length,recoveryRecords=(c.recoveryRecords||[]).length,drugAdmins=(c.drugAdministrations||[]).filter(x=>!x.voidedAt).length,complications=(c.complications||[]).length,voided=!!c.voidedAt;
      const finalBadge=c.caseLocked?'<span class="archive-final-badge">✓ LOCKED FINAL</span>':'';const voidBadge=voided?'<span class="archive-void-badge">VOIDED</span>':'';const integrity=c.finalChecksum?`<span class="archive-integrity-badge">ID ${escapeHtml(c.humanRecordId||'—')} • ${escapeHtml(ctx.shortChecksum?.(c.finalChecksum)||'')}</span>`:`<span class="archive-integrity-badge">ID ${escapeHtml(c.humanRecordId||'—')}</span>`;
      const protocol=c.protocolSnapshot?.version?`<span>Protocol ${escapeHtml(c.protocolSnapshot.version)}</span>`:'';const amendments=(c.amendments||[]).length;const loadButton=c.caseLocked?'':`<button class="btn load-archive" data-i="${i}">Load working copy</button>`;const amendButton=c.caseLocked&&!voided?`<button class="btn archive-amend" data-i="${i}">＋ Add amendment${amendments?` (${amendments})`:''}</button>`:'';const voidButton=c.caseLocked&&!voided?`<button class="btn archive-void" data-i="${i}">Void record</button>`:'';const deleteButton=!c.caseLocked?`<button class="btn danger-outline delete-archive" data-i="${i}">Delete working copy</button>`:'';
      return `<div class="archive-card ${voided?'archive-voided':''}"><div><h3>${escapeHtml(name)} ${finalBadge} ${voidBadge}</h3><div class="archive-meta"><span>${escapeHtml(formatDate(c.archivedAt||c.createdAt||Date.now()))}</span><span>${escapeHtml(c.hospitalId?`HN ${c.hospitalId}`:'No HN')}</span>${c.visitId?`<span>Visit ${escapeHtml(c.visitId)}</span>`:''}<span>${escapeHtml(asa)}</span><span>${records} anesthesia records</span><span>${recoveryRecords} recovery records</span><span>${events} events</span><span>${drugAdmins} drug administrations</span><span>${complications} complications</span>${protocol}<span>${escapeHtml(c.procedure||c.patientProcedure||'—')}</span></div><div style="margin-top:5px">${integrity}</div>${voided?`<div class="settings-note">Voided ${escapeHtml(formatDate(c.voidedAt))} • ${escapeHtml(c.voidedBy||'—')} • ${escapeHtml(c.voidReason||'—')}</div>`:''}</div><div class="archive-actions"><button class="btn archive-summary-pdf" data-i="${i}">Summary PDF</button><button class="btn archive-pdf" data-i="${i}">Full PDF</button>${c.finalChecksum?`<button class="btn verify-integrity" data-i="${i}">Verify integrity</button>`:''}${amendButton}${voidButton}${loadButton}${deleteButton}</div></div>`;
    }).join('');
    $$('.archive-summary-pdf').forEach(b=>b.addEventListener('click',()=>ctx.exportArchivedPdfSummary?.(Number(b.dataset.i))));$$('.archive-pdf').forEach(b=>b.addEventListener('click',()=>ctx.exportArchivedPdf?.(Number(b.dataset.i))));$$('.verify-integrity').forEach(b=>b.addEventListener('click',()=>verifyArchivedIntegrity(Number(b.dataset.i),b)));$$('.archive-amend').forEach(b=>b.addEventListener('click',()=>openAmendmentDialog(Number(b.dataset.i))));$$('.archive-void').forEach(b=>b.addEventListener('click',()=>voidArchive(Number(b.dataset.i))));$$('.load-archive').forEach(b=>b.addEventListener('click',()=>loadArchive(Number(b.dataset.i))));$$('.delete-archive').forEach(b=>b.addEventListener('click',()=>deleteArchive(Number(b.dataset.i))));
  }
  async function verifyArchivedIntegrity(i,button=null){const c=getArchive()[i];if(!c||!c.finalChecksum){toast('No final checksum available');return}const now=await ctx.computeCaseChecksum?.(c),ok=now===c.finalChecksum;if(button){button.textContent=ok?'✓ Integrity OK':'⚠ Integrity mismatch';button.classList.toggle('danger-outline',!ok)}toast(ok?'Record integrity verified':'⚠ Record integrity mismatch — review record')}
  async function voidArchive(i){const c=getArchive()[i];if(!c||!c.caseLocked||c.voidedAt)return;const reason=prompt('Reason for VOID\nOriginal record จะยังคงอยู่ใน archive');if(!reason?.trim()){toast('Void cancelled');return}const by=prompt('Voided by',$('anesthetist')?.value.trim()||$('surgeon')?.value.trim()||'');if(!by?.trim()){toast('Void cancelled');return}const code=prompt('พิมพ์ VOID เพื่อยืนยัน');if(code!=='VOID'){toast('Void cancelled');return}c.voidedAt=Date.now();c.voidedBy=by.trim();c.voidReason=reason.trim();c.auditTrail=c.auditTrail||[];c.auditTrail.push({id:root.crypto?.randomUUID?root.crypto.randomUUID():String(Date.now()),epoch:Date.now(),clock:formatClock(),elapsedMs:c.timer?.elapsedMs||0,action:'RECORD_VOIDED',detail:c.voidReason,actor:c.voidedBy});try{if(getBackend()==='IndexedDB')await ctx.idbPutCase?.(c);else persistFallback();renderArchives();toast('Final record marked VOID — original retained')}catch(e){toast('Void failed')}}
  function loadArchive(i){const c=getArchive()[i];if(!c)return;if(c.caseLocked){toast('Locked final record แก้ตรง ๆ ไม่ได้ — ใช้ Add amendment');return}if(!confirm(`Load working copy "${c.patientName||'Unnamed'}" แทน current case?`))return;const next=JSON.parse(JSON.stringify(c));next.timer={running:false,startedEpoch:null,elapsedMs:next.timer?.elapsedMs||0};ctx.replaceState?.(next);ctx.persistCurrentState?.(next);ctx.queueCurrentMirror?.();ctx.restartAtAppRoot?.()}
  async function deleteArchive(i){const c=getArchive()[i];if(!c)return;if(c.caseLocked){toast('Final record ลบไม่ได้ — ใช้ Void record');return}if(!confirm(`Delete working copy "${c.patientName||'Unnamed'}"?`))return;try{await ctx.initArchiveDb?.();if(getBackend()==='IndexedDB')await ctx.idbDeleteCase?.(c.caseId);setCache(getCache().filter(x=>x.caseId!==c.caseId));if(getBackend()!=='IndexedDB')persistFallback();renderArchives();toast('Working copy deleted')}catch(e){toast('Delete failed')}}

  function bind(){
    $('signAnesthetistBtn')?.addEventListener('click',async()=>signFinalRole('anesthetist'));
    $('signSurgeonBtn')?.addEventListener('click',async()=>signFinalRole('surgeon'));
    ['endConfirmRecovery','endConfirmRecord','endConfirmDrugs','endConfirmPdf'].forEach(id=>$(id)?.addEventListener('change',renderEndCase));
    $('endBackupBtn')?.addEventListener('click',()=>ctx.backupAllData?.());
    $('endExportPdfBtn')?.addEventListener('click',()=>ctx.exportPdfReport?.());
    $('endExportSummaryPdfBtn')?.addEventListener('click',()=>ctx.exportPdfSummary?.());
    $('endSaveArchiveBtn')?.addEventListener('click',finalizeCase);
    $('amendmentCloseBtn')?.addEventListener('click',closeAmendmentDialog);$('amendmentCancelBtn')?.addEventListener('click',closeAmendmentDialog);$('amendmentSaveBtn')?.addEventListener('click',saveAmendment);
    ['archiveSearch','archiveDateFrom','archiveDateTo','archiveStatusFilter','archiveSort'].forEach(id=>{const el=$(id);if(el)el.addEventListener(el.tagName==='SELECT'?'change':'input',renderArchives)});
    $('clearArchiveFiltersBtn')?.addEventListener('click',()=>{['archiveSearch','archiveDateFrom','archiveDateTo'].forEach(id=>{if($(id))$(id).value=''});if($('archiveStatusFilter'))$('archiveStatusFilter').value='all';if($('archiveSort'))$('archiveSort').value='newest';renderArchives()});
    $('archiveCaseBtn')?.addEventListener('click',()=>archiveSnapshot());
  }

  return Object.freeze({version:VERSION,bind,renderFinalSignoff,renderEndCase,focusMedicationReconciliation,plannedMedicationReconciliationItems,medicationReconciliationComplete,finalizeCase,archiveSnapshot,getArchive,verifyFinalArchive,retryFinalArchive,renderArchives,archiveFilteredList,verifyArchivedIntegrity,voidArchive,loadArchive,deleteArchive,openAmendmentDialog,closeAmendmentDialog});
}
const api=Object.freeze({version:VERSION,create});root.ANESVET_FINALIZATION_ARCHIVE_CONTROLLER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
