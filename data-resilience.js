(()=>{
'use strict';
const $=id=>document.getElementById(id);
const state={pendingBackup:null,pendingRestore:null,pendingRestoreIntegrity:null,lastArchiveIntegrity:null};
const bridge=()=>window.AnesvetDataBridge;
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function fmtBytes(n){n=Number(n);if(!Number.isFinite(n))return '—';if(n<1024)return `${n} B`;if(n<1024**2)return `${(n/1024).toFixed(1)} KB`;if(n<1024**3)return `${(n/1024**2).toFixed(1)} MB`;return `${(n/1024**3).toFixed(2)} GB`}
function fmtWhen(t){return t?new Date(Number(t)).toLocaleString():'Never'}
function daysAgo(t){return t?Math.floor((Date.now()-Number(t))/86400000):null}
function semver(v){return String(v||'').split(/[.-]/).slice(0,3).map(x=>Number(x)||0)}
function compareVersion(a,b){const A=semver(a),B=semver(b);for(let i=0;i<3;i++){if(A[i]>B[i])return 1;if(A[i]<B[i])return -1}return 0}
async function storageSnapshot(){
  let usage=null,quota=null,persisted=null;
  try{if(navigator.storage?.estimate){const e=await navigator.storage.estimate();usage=Number(e.usage);quota=Number(e.quota)}}catch(e){}
  try{if(navigator.storage?.persisted)persisted=await navigator.storage.persisted()}catch(e){}
  const ratio=Number.isFinite(usage)&&Number.isFinite(quota)&&quota>0?usage/quota:null;
  let level='unknown',label='Estimate unavailable';
  if(ratio!=null){if(ratio>=.85){level='critical';label='Critical'}else if(ratio>=.65){level='watch';label='Getting full'}else{level='good';label='Good'}}
  return {usage,quota,ratio,persisted,level,label};
}
function healthClass(level){return level==='good'?'data-health-good':level==='critical'?'data-health-critical':level==='watch'?'data-health-watch':'data-health-neutral'}
function setStatus(el,text,level='neutral'){if(!el)return;el.textContent=text;el.className=`data-health-value ${healthClass(level)}`}
async function renderHealth(){
  const b=bridge();if(!b)return;
  const storage=await storageSnapshot(),archive=b.getArchive(),patients=b.getPatients(),current=b.getCurrent(),receipt=b.getBackupReceipt?.(),last=b.getLastBackupEpoch?.()||0,copies=await b.recoveryCopyStatus();
  setStatus($('persistentStorageHealth'),storage.persisted===true?'Protected from routine eviction':storage.persisted===false?'Best-effort browser storage':'Not reported',storage.persisted===true?'good':'watch');
  if($('persistentStorageDetail'))$('persistentStorageDetail').textContent=storage.persisted===true?'Browser granted persistent storage for this origin.':'Request persistence when supported; browser/OS can still impose limits.';
  setStatus($('storageRiskHealth'),storage.ratio==null?'Estimate unavailable':`${storage.label} • ${(storage.ratio*100).toFixed(1)}%`,storage.level);
  if($('storageRiskDetail'))$('storageRiskDetail').textContent=storage.ratio==null?'StorageManager quota estimate unavailable.':`${fmtBytes(storage.usage)} used of ${fmtBytes(storage.quota)} estimated quota.`;
  const locked=archive.filter(c=>c.caseLocked).length,latestArchive=Math.max(0,...archive.map(c=>Number(c.archivedAt||c.createdAt||0)).filter(Number.isFinite));
  let coverage='No backup receipt',coverageLevel='watch',coverageDetail='Create a full backup to establish coverage.';
  if(receipt&&last){const newerArchive=latestArchive>Number(receipt.latestArchiveAt||0)+250,newerCurrent=Number(current.lastSavedAt||0)>Number(receipt.currentLastSavedAt||0)+250&&!(current.caseLocked&&current.casePhase==='complete');const countChanged=archive.length>Number(receipt.archiveCount||0);const stale=newerArchive||newerCurrent||countChanged;coverage=stale?'Backup is behind current data':'Current data covered';coverageLevel=stale?'watch':'good';coverageDetail=`Last backup ${fmtWhen(last)} • ${receipt.archiveCount||0} cases • ${receipt.patientCount||0} patients${stale?' • newer local data exists':''}`}
  setStatus($('backupCoverageHealth'),coverage,coverageLevel);if($('backupCoverageDetail'))$('backupCoverageDetail').textContent=coverageDetail;
  const recoveryCount=[copies.checkpoint,copies.mirror,copies.rollback].filter(Boolean).length;
  setStatus($('recoveryCopiesHealth'),recoveryCount?`${recoveryCount} recovery source${recoveryCount===1?'':'s'} available`:'No recovery copies',recoveryCount?'good':'neutral');
  if($('recoveryCopiesDetail')){const parts=[];if(copies.checkpoint)parts.push(`Checkpoint: ${copies.checkpoint.patientName||'case'} • ${fmtWhen(copies.checkpoint.savedAt)}`);if(copies.mirror)parts.push(`IndexedDB mirror: ${copies.mirror.patientName||'case'} • ${fmtWhen(copies.mirror.savedAt)}`);if(copies.rollback)parts.push(`Pre-restore rollback: ${fmtWhen(copies.rollback.createdAt)} • ${copies.rollback.archiveCount} cases`);$('recoveryCopiesDetail').textContent=parts.join(' | ')||'ANESVET will create recovery copies during active-case persistence and before restore.'}
  const rb=$('rollbackRestoreBtn');if(rb)rb.hidden=!copies.rollback;
  if($('dataHealthMeta'))$('dataHealthMeta').textContent=`${b.getArchiveBackend()} • ${archive.length} archived (${locked} locked) • ${patients.length} patients • V${b.appVersion()}`;
  if(state.lastArchiveIntegrity){const r=state.lastArchiveIntegrity;setStatus($('archiveIntegrityHealth'),r.mismatch?`${r.mismatch} checksum mismatch`:`Verified ${r.valid}/${r.verifiable}`,r.mismatch?'critical':r.verifiable?'good':'neutral');if($('archiveIntegrityDetail'))$('archiveIntegrityDetail').textContent=`Locked ${r.locked} • verifiable ${r.verifiable} • legacy/unverifiable ${r.unverifiable}`}
  else{setStatus($('archiveIntegrityHealth'),locked?'Not batch-verified this session':'No locked records',locked?'watch':'neutral');if($('archiveIntegrityDetail'))$('archiveIntegrityDetail').textContent=locked?'Use Verify all locked records for a current checksum audit.':'Integrity audit will become available when locked records exist.'}
}
async function requestPersistence(){const btn=$('requestPersistentStorageBtn');if(btn)btn.disabled=true;try{if(!navigator.storage?.persist){toastSafe('Persistent storage API is not supported by this browser');return}const already=await navigator.storage.persisted?.();const granted=already===true?true:await navigator.storage.persist();toastSafe(granted?'Persistent storage granted':'Browser did not grant persistent storage');await renderHealth()}catch(e){console.error(e);toastSafe('Could not request persistent storage')}finally{if(btn)btn.disabled=false}}
function toastSafe(msg){const b=bridge(),t=$('toast');if(b?.toast)b.toast(msg);else if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}}
function integrityHtml(r){
  const whole=r.payload?.available?`<div class="resilience-manifest ${r.payload.valid?'ok':'bad'}"><b>${r.payload.valid?'✓ Backup file digest verified':'✕ Backup file digest mismatch'}</b><span>SHA-256 whole-backup integrity manifest</span></div>`:`<div class="resilience-manifest legacy"><b>Legacy backup — no whole-file manifest</b><span>Locked final checksums can still be checked, but full backup-file integrity cannot be proven.</span></div>`;
  return `${whole}<div class="resilience-metrics"><div><span>Locked finals</span><b>${r.locked}</b></div><div><span>Verified</span><b>${r.valid}/${r.verifiable}</b></div><div><span>Legacy / no checksum</span><b>${r.unverifiable}</b></div><div class="${r.mismatch?'metric-danger':''}"><span>Mismatch</span><b>${r.mismatch}</b></div></div>${r.details?.length?`<div class="resilience-warning">${r.details.slice(0,8).map(esc).join('<br>')}</div>`:''}`
}
async function openBackupPreflight(){
  const b=bridge();if(!b)return;const d=$('backupPreflightDialog');if(!d)return;
  $('backupPreflightSummary').innerHTML='<div class="resilience-loading">Preparing verified backup snapshot…</div>';$('backupPreflightIntegrity').innerHTML='';$('confirmCreateBackupBtn').disabled=true;try{d.showModal()}catch(e){d.setAttribute('open','')}
  try{const payload=await b.buildBackupPayload(),integrity=await b.verifyBackupPayloadIntegrity(payload),storage=await storageSnapshot();state.pendingBackup=payload;$('backupPreflightSummary').innerHTML=`<div class="resilience-metrics"><div><span>Archived cases</span><b>${payload.archive.length}</b></div><div><span>Locked finals</span><b>${payload.summary?.lockedCount||0}</b></div><div><span>Patients</span><b>${payload.patients.length}</b></div><div><span>Current case</span><b>${payload.current?.patientName?esc(payload.current.patientName):'Empty'}</b></div></div><div class="resilience-note">Backup schema ${payload.backupSchema||1} • V${esc(payload.version)} • database ${esc(payload.summary?.archiveBackend||'—')} • storage ${storage.persisted?'persistent':'best-effort'}</div>`;$('backupPreflightIntegrity').innerHTML=integrityHtml(integrity);$('confirmCreateBackupBtn').disabled=integrity.payload?.available&&integrity.payload.valid!==true}catch(e){console.error(e);$('backupPreflightSummary').innerHTML='<div class="resilience-warning">Could not prepare backup. Check storage and try again.</div>'}
}
async function createBackupFromPreflight(){const b=bridge(),btn=$('confirmCreateBackupBtn');if(!b||!state.pendingBackup)return;if(btn)btn.disabled=true;try{await b.downloadBackupPayload(state.pendingBackup);$('backupPreflightDialog')?.close();state.pendingBackup=null;await renderHealth()}catch(e){console.error(e);toastSafe('Backup failed')}finally{if(btn)btn.disabled=false}}
function currentReplacementHtml(raw,b){const a=b.getArchive(),p=b.getPatients(),c=b.getCurrent();return `<div class="restore-compare"><div><b>On this device now</b><span>${a.length} archived cases</span><span>${p.length} patients</span><span>${c.patientName?`Current: ${esc(c.patientName)}`:'No named current case'}</span></div><div><b>Backup file</b><span>${raw.archive.length} archived cases</span><span>${Array.isArray(raw.patients)?raw.patients.length:'Patients will be derived'}</span><span>${raw.current?.patientName?`Current: ${esc(raw.current.patientName)}`:'No named current case'}</span></div></div>`}
async function previewRestoreFile(file){
  const b=bridge();if(!b)return;let raw;try{raw=JSON.parse(await file.text());if(raw?.format!=='ANESVET_BACKUP'||!raw.current||!Array.isArray(raw.archive))throw new Error('Not an ANESVET backup')}catch(e){toastSafe('Restore failed: invalid backup file');return}
  const d=$('restorePreviewDialog');state.pendingRestore=raw;state.pendingRestoreIntegrity=null;$('restorePreviewSummary').innerHTML='<div class="resilience-loading">Checking backup…</div>';$('restorePreviewIntegrity').innerHTML='';$('restoreAcknowledge').checked=false;$('restoreMismatchCode').value='';$('restoreMismatchWrap').hidden=true;$('confirmRestoreBtn').disabled=true;if($('restoreProgress')){$('restoreProgress').hidden=true;$('restoreProgress').textContent=''}try{d.showModal()}catch(e){d.setAttribute('open','')}
  try{const integrity=await b.verifyBackupPayloadIntegrity(raw);state.pendingRestoreIntegrity=integrity;const age=daysAgo(raw.exportedAt),cmp=compareVersion(raw.version,b.appVersion()),versionWarn=cmp>0?`<div class="resilience-warning">Backup was created by newer ANESVET V${esc(raw.version)}. This version is V${esc(b.appVersion())}; compatibility cannot be guaranteed.</div>`:'';const activeWarn=b.hasMutableActiveCase()?'<div class="resilience-warning">An editable current case exists on this device. Restore will replace it. A rollback snapshot will be attempted before restore.</div>':'';$('restorePreviewSummary').innerHTML=`<div class="restore-file-head"><b>${esc(file.name)}</b><span>Exported ${fmtWhen(raw.exportedAt)}${age!=null?` • ${age} day${age===1?'':'s'} ago`:''}</span><span>Backup schema ${raw.backupSchema||1} • source V${esc(raw.version||'unknown')}</span></div>${currentReplacementHtml(raw,b)}${versionWarn}${activeWarn}`;$('restorePreviewIntegrity').innerHTML=integrityHtml(integrity);$('restoreMismatchWrap').hidden=integrity.mismatch===0;updateRestoreReady()}catch(e){console.error(e);$('restorePreviewSummary').innerHTML='<div class="resilience-warning">Could not validate backup file.</div>'}
}
function updateRestoreReady(){const i=state.pendingRestoreIntegrity,ack=$('restoreAcknowledge')?.checked,code=$('restoreMismatchCode')?.value||'',manifestOk=!i?.payload?.available||i.payload.valid===true,clinicalOk=!i?.clinical?.available||i.clinical.valid===true;if($('confirmRestoreBtn'))$('confirmRestoreBtn').disabled=!(i&&ack&&manifestOk&&clinicalOk&&(i.mismatch===0||code==='RESTORE'))}
async function confirmRestore(){const b=bridge(),raw=state.pendingRestore,btn=$('confirmRestoreBtn'),i=state.pendingRestoreIntegrity;if(!b||!raw)return;if(btn)btn.disabled=true;if($('restoreProgress')){$('restoreProgress').hidden=false;$('restoreProgress').textContent='Creating pre-restore rollback snapshot, restoring data, then verifying the restored dataset…'}try{const allow=!!(i?.mismatch&&$('restoreMismatchCode')?.value==='RESTORE'),result=await b.applyRestorePayload(raw,{storeRollback:true,allowIntegrityMismatch:allow}),v=result.verification||{};if($('restoreProgress'))$('restoreProgress').textContent=`Restore verified • ${result.archiveCount} cases • ${result.patientCount} patients • ${v.level==='full'?'clinical SHA-256 matched':'structural verification'}${result.rollbackStored?' • rollback snapshot saved':' • rollback snapshot unavailable'}`;toastSafe('Restore completed and verified');setTimeout(()=>b.restart(),900)}catch(e){console.error(e);if($('restoreProgress'))$('restoreProgress').textContent=`Restore failed: ${e.message||e}`;toastSafe('Restore failed — automatic rollback was attempted')}finally{if(btn)btn.disabled=false}}
async function verifyAll(){const b=bridge(),btn=$('verifyAllArchivesBtn');if(!b)return;if(btn){btn.disabled=true;btn.textContent='Verifying…'}try{const r=await b.verifyAllArchiveIntegrity((done,total)=>{if(btn)btn.textContent=`Verifying ${done}/${total}`});state.lastArchiveIntegrity=r;await renderHealth();toastSafe(r.mismatch?`Integrity audit found ${r.mismatch} mismatch`:`Integrity audit passed ${r.valid}/${r.verifiable}`)}catch(e){console.error(e);toastSafe('Integrity audit failed')}finally{if(btn){btn.disabled=false;btn.textContent='Verify all locked records'}}}
async function rollbackRestore(){const b=bridge();if(!b)return;if(!confirm('Rollback to the automatic snapshot saved immediately before the last restore?\n\nCurrent restored data will be replaced.'))return;const btn=$('rollbackRestoreBtn');if(btn)btn.disabled=true;try{await b.rollbackLastRestore();toastSafe('Rollback restored and verified pre-restore data');setTimeout(()=>b.restart(),500)}catch(e){console.error(e);toastSafe(e.message||'Rollback failed')}finally{if(btn)btn.disabled=false}}
function closeDialog(id){try{$(id)?.close()}catch(e){$(id)?.removeAttribute('open')}}
function init(){
  $('requestPersistentStorageBtn')?.addEventListener('click',requestPersistence);
  $('verifyAllArchivesBtn')?.addEventListener('click',verifyAll);
  $('rollbackRestoreBtn')?.addEventListener('click',rollbackRestore);
  $('backupPreflightCancelBtn')?.addEventListener('click',()=>closeDialog('backupPreflightDialog'));
  $('confirmCreateBackupBtn')?.addEventListener('click',createBackupFromPreflight);
  $('restorePreviewCancelBtn')?.addEventListener('click',()=>closeDialog('restorePreviewDialog'));
  $('restoreAcknowledge')?.addEventListener('change',updateRestoreReady);
  $('restoreMismatchCode')?.addEventListener('input',updateRestoreReady);
  $('confirmRestoreBtn')?.addEventListener('click',confirmRestore);
  renderHealth();
  window.addEventListener('online',renderHealth);window.addEventListener('offline',renderHealth);window.addEventListener('anesvet:data-safety-changed',renderHealth);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)renderHealth()});
}
window.AnesvetDataResilience={renderHealth,openBackupPreflight,previewRestoreFile,requestPersistence,verifyAll};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
