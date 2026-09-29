/* ANESVET V16.19.0 — Data Safety 2.0 UI
   Descriptive data-protection status only. "Off-device" is a user-confirmed receipt;
   ANESVET does not upload or remotely verify cloud/USB/NAS destinations in this release. */
(function(root){
'use strict';
const VERSION='16.19.0';
const $=id=>document.getElementById(id);
const bridge=()=>root.AnesvetDataBridge;
const esc=s=>String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
const fmtWhen=t=>t?new Date(Number(t)).toLocaleString():'Never';
const fmtAge=t=>{if(!t)return 'never';const d=Math.max(0,Math.floor((Date.now()-Number(t))/86400000));return d===0?'today':`${d} day${d===1?'':'s'} ago`};
function ageLevel(t){if(!t)return'critical';const d=(Date.now()-Number(t))/86400000;return d<=7?'good':d<=14?'watch':'critical'}
function healthClass(level){return level==='good'?'data-health-good':level==='critical'?'data-health-critical':level==='watch'?'data-health-watch':'data-health-neutral'}
function setStatus(id,text,level='neutral'){const el=$(id);if(!el)return;el.textContent=text;el.className=`data-health-value ${healthClass(level)}`}
function toast(msg){const b=bridge();if(b?.toast)b.toast(msg);else{const t=$('toast');if(t){t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}}}
function shortId(v){v=String(v||'');return v.length>16?`${v.slice(0,8)}…${v.slice(-6)}`:v||'—'}
function destinationLabel(v){return ({drive:'Google Drive / cloud drive',hospital_pc:'Hospital PC',usb:'USB / external drive',nas:'NAS / server',other:'Other off-device storage'})[v]||v||'Other'}
function renderHistory(rows){
  const box=$('backupHistoryList');if(!box)return;
  if(!rows?.length){box.innerHTML='<div class="data-safety-empty">No backup history recorded on this device yet.</div>';return}
  box.innerHTML=rows.slice(0,10).map(r=>{
    const verified=r.fileVerifiedAt&&r.verificationOk&&r.verificationLevel==='full';
    const partial=r.fileVerifiedAt&&r.verificationLevel!=='full';
    const external=r.external?.confirmed;
    return `<div class="data-safety-history-row">
      <div class="data-safety-history-main"><b>${esc(fmtWhen(r.epoch))}</b><small>V${esc(r.version||'—')} • schema ${esc(r.backupSchema||1)} • ${Number(r.archiveCount)||0} cases • ${Number(r.patientCount)||0} patients</small><code>${esc(shortId(r.backupId))}</code></div>
      <div class="data-safety-history-tags">
        <span class="ds-tag ${verified?'good':partial?'watch':'neutral'}">${verified?'✓ file verified':partial?'legacy partial':'export receipt'}</span>
        ${external?`<span class="ds-tag good">↗ ${esc(destinationLabel(r.external.destination))}</span>`:'<span class="ds-tag neutral">device copy not confirmed</span>'}
      </div>
    </div>`
  }).join('');
}
function render(){
  const b=bridge();if(!b?.dataSafetySnapshot)return;
  const s=b.dataSafetySnapshot(),history=s.history||[],verified=s.verified,external=s.external,restore=s.lastRestore;
  if($('dataSafety2Meta'))$('dataSafety2Meta').textContent=`Data Safety 2.0 • ${history.length} backup receipt${history.length===1?'':'s'} on this device • whole-file SHA-256 enabled for schema 3`;

  if(verified){setStatus('verifiedBackupFileHealth',`Verified ${fmtAge(verified.fileVerifiedAt)}`,ageLevel(verified.fileVerifiedAt));if($('verifiedBackupFileDetail'))$('verifiedBackupFileDetail').textContent=`${verified.verifiedFileName||'Backup file'} • backup ${shortId(verified.backupId)} • SHA-256 manifest + locked-record checks`}
  else{setStatus('verifiedBackupFileHealth','No schema-3 file verified','watch');if($('verifiedBackupFileDetail'))$('verifiedBackupFileDetail').textContent='Select a downloaded backup file to verify its whole-file SHA-256 manifest and locked final checksums.'}

  if(external){setStatus('offDeviceBackupHealth',`Recorded ${fmtAge(external.external.confirmedAt)}`,ageLevel(external.external.confirmedAt));if($('offDeviceBackupDetail'))$('offDeviceBackupDetail').textContent=`${destinationLabel(external.external.destination)}${external.external.label?` • ${external.external.label}`:''} • user-confirmed, not remotely verified`}
  else{setStatus('offDeviceBackupHealth','No off-device copy recorded','critical');if($('offDeviceBackupDetail'))$('offDeviceBackupDetail').textContent='ANESVET data is local-first. Record a copy stored outside this browser/device after saving the backup file elsewhere.'}

  const rv=restore?.verification;
  if(rv?.ok){setStatus('restoreVerificationHealth',rv.level==='full'?'Last restore fully verified':'Last restore structurally verified',rv.level==='full'?'good':'watch');if($('restoreVerificationDetail'))$('restoreVerificationDetail').textContent=`${fmtWhen(restore.epoch)} • ${rv.archiveCount||0} cases • ${rv.patientCount||0} patients${rv.level==='full'?' • clinical SHA-256 matched':''}`}
  else if(restore){setStatus('restoreVerificationHealth','Restore verification unavailable','watch');if($('restoreVerificationDetail'))$('restoreVerificationDetail').textContent=`Last restore receipt ${fmtWhen(restore.epoch)} • older release or verification data unavailable.`}
  else{setStatus('restoreVerificationHealth','No restore performed','neutral');if($('restoreVerificationDetail'))$('restoreVerificationDetail').textContent='After a restore, ANESVET will compare the restored local dataset with the selected backup before restart.'}

  const latest=history[0];
  setStatus('backupHistoryHealth',history.length?`${history.length} receipt${history.length===1?'':'s'}`:'No history',history.length?'good':'watch');
  if($('backupHistoryDetail'))$('backupHistoryDetail').textContent=latest?`Latest export ${fmtWhen(latest.epoch)} • backup ${shortId(latest.backupId)}`:'History starts when a full backup is created or a backup file is verified.';
  if($('markOffDeviceBtn'))$('markOffDeviceBtn').disabled=!latest;
  renderHistory(history);
}
async function verifySelectedFile(file){
  const b=bridge();if(!b?.verifyBackupFilePayload||!file)return;
  const btn=$('verifyBackupFileBtn');if(btn)btn.disabled=true;
  try{
    const raw=JSON.parse(await file.text()),r=await b.verifyBackupFilePayload(raw,{fileName:file.name});
    if(r.level==='full'&&r.ok)toast('Backup file fully verified');
    else if(r.level==='legacy-partial'&&r.ok)toast('Legacy backup checked — whole-file manifest unavailable');
    else toast('Backup verification found a problem');
    render();
  }catch(e){console.error(e);toast(`Backup verification failed: ${e.message||e}`)}finally{if(btn)btn.disabled=false;if($('verifyBackupFileInput'))$('verifyBackupFileInput').value=''}
}
function openOffDeviceDialog(){
  const b=bridge(),s=b?.dataSafetySnapshot?.(),latest=s?.history?.[0];if(!latest){toast('Create a backup first');return}
  if($('offDeviceBackupId'))$('offDeviceBackupId').value=latest.backupId||'';
  if($('offDeviceDestination'))$('offDeviceDestination').value=latest.external?.destination||'drive';
  if($('offDeviceLabel'))$('offDeviceLabel').value=latest.external?.label||'';
  if($('offDeviceNote'))$('offDeviceNote').value=latest.external?.note||'';
  if($('offDeviceConfirm'))$('offDeviceConfirm').checked=false;
  if($('offDeviceBackupSummary'))$('offDeviceBackupSummary').innerHTML=`<b>Backup ${esc(shortId(latest.backupId))}</b><span>${esc(fmtWhen(latest.epoch))} • ${Number(latest.archiveCount)||0} cases • ${Number(latest.patientCount)||0} patients</span>`;
  const d=$('offDeviceBackupDialog');try{if(d&&!d.open)d.showModal()}catch(e){d?.setAttribute('open','')}
  updateOffDeviceSave();
}
function updateOffDeviceSave(){if($('saveOffDeviceReceiptBtn'))$('saveOffDeviceReceiptBtn').disabled=!$('offDeviceConfirm')?.checked}
function saveOffDeviceReceipt(){
  const b=bridge();if(!b?.markBackupOffDevice)return;
  if(!$('offDeviceConfirm')?.checked)return;
  try{
    b.markBackupOffDevice($('offDeviceBackupId')?.value,{destination:$('offDeviceDestination')?.value||'other',label:$('offDeviceLabel')?.value.trim()||'',note:$('offDeviceNote')?.value.trim()||'',confirmed:true});
    try{$('offDeviceBackupDialog')?.close()}catch(e){$('offDeviceBackupDialog')?.removeAttribute('open')}
    toast('Off-device copy receipt saved');render();
  }catch(e){console.error(e);toast(e.message||'Could not save off-device receipt')}
}
function init(){
  $('verifyBackupFileBtn')?.addEventListener('click',()=>$('verifyBackupFileInput')?.click());
  $('verifyBackupFileInput')?.addEventListener('change',e=>verifySelectedFile(e.target.files?.[0]));
  $('markOffDeviceBtn')?.addEventListener('click',openOffDeviceDialog);
  $('offDeviceConfirm')?.addEventListener('change',updateOffDeviceSave);
  $('saveOffDeviceReceiptBtn')?.addEventListener('click',saveOffDeviceReceipt);
  $('cancelOffDeviceReceiptBtn')?.addEventListener('click',()=>{try{$('offDeviceBackupDialog')?.close()}catch(e){$('offDeviceBackupDialog')?.removeAttribute('open')}});
  root.addEventListener('anesvet:data-safety-changed',render);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render()});
  render();
}
const api=Object.freeze({version:VERSION,render,verifySelectedFile,openOffDeviceDialog});
root.ANESVET_DATA_SAFETY_2=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof globalThis!=='undefined'?globalThis:this);
