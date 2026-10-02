/* ANESVET V16.16.0 — Final Archive Assurance
   Verifies that a Final Locked current record exists in Cases / Archive and that
   both the current sealed payload and archived copy match the same final checksum.
   This module does not alter clinical Final Lock criteria or the sealed case payload. */
(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const api=()=>window.AnesvetApp||null;
  let current={phase:'waiting',ok:false,code:'WAITING',message:'Final record verification will run after Final Lock.'};
  let running=null;

  function st(){try{return api()?.getState?.()||null}catch(e){return null}}
  function fmt(epoch){if(!Number(epoch))return '—';try{return new Date(Number(epoch)).toLocaleString()}catch(e){return '—'}}
  function short(v){try{return api()?.finalArchive?.shortChecksum?.(v)||String(v||'').slice(0,16)||'—'}catch(e){return String(v||'').slice(0,16)||'—'}}
  function emit(){try{document.dispatchEvent(new CustomEvent('anesvet:final-archive-assurance-changed',{detail:{...current}}))}catch(e){}}
  function setStatus(next){current={...current,...next};render();emit();return current}
  function canStartNewCase(){const s=st();return !s?.caseLocked||current.phase==='verified'}

  function lockText(s){return s?.caseLocked?`LOCKED • ${fmt(s.lockedAt)}`:'Pending'}
  function copyText(){if(current.phase==='verified')return `Verified • ${fmt(current.archivedAt)}`;if(current.phase==='failed')return current.code==='ARCHIVE_MISSING'?'Missing / not found':'Needs review';if(current.phase==='verifying')return 'Checking…';return 'Pending'}
  function checksumText(s){if(current.phase==='verified')return `✓ ${short(current.expectedChecksum||s?.finalChecksum)}`;if(current.phase==='failed'&&String(current.code||'').includes('CHECKSUM'))return '⚠ Mismatch';if(s?.caseLocked&&s.finalChecksum)return short(s.finalChecksum);return 'Pending'}
  function detailText(s){
    if(!s?.caseLocked)return 'After Final Lock, ANESVET will verify the archived copy independently before allowing Start new case.';
    if(current.phase==='verifying')return 'Checking Cases / Archive and recomputing the final clinical checksum…';
    if(current.phase==='verified'){
      const c=current.counts||{};
      return `Verified archived final record • ${current.recordId||s.humanRecordId||'Record'} • ${c.records||0} anesthesia records • ${c.recoveryRecords||0} recovery records • ${c.drugAdministrations||0} drug administrations • checksum ${short(current.expectedChecksum||s.finalChecksum)}`;
    }
    if(current.phase==='failed')return `${current.message||'Final archive verification failed'} • Current locked record is preserved. Retry archive before starting a new case.`;
    return 'Final record is locked. Archive verification is required before Start new case.';
  }

  function render(){
    const s=st();
    if($('finalArchiveLockStatus'))$('finalArchiveLockStatus').textContent=lockText(s);
    if($('finalArchiveCopyStatus'))$('finalArchiveCopyStatus').textContent=copyText();
    if($('finalArchiveChecksumStatus'))$('finalArchiveChecksumStatus').textContent=checksumText(s);
    if($('finalArchiveBackendStatus'))$('finalArchiveBackendStatus').textContent=current.backend||api()?.finalArchive?.backend?.()||'—';
    if($('finalArchiveAssuranceDetail'))$('finalArchiveAssuranceDetail').textContent=detailText(s);
    if($('finalArchiveAssuranceSummary'))$('finalArchiveAssuranceSummary').textContent=!s?.caseLocked?'Final archive verification will run automatically after Final Lock.':current.phase==='verified'?'Archived copy independently verified against the sealed record.':current.phase==='failed'?'Final record is locked, but archived copy still needs attention.':'Verifying the archived final record…';
    const badge=$('finalArchiveAssuranceBadge');
    if(badge){
      const label=!s?.caseLocked?'WAITING':current.phase==='verified'?'VERIFIED':current.phase==='failed'?'ATTENTION':current.phase==='verifying'?'VERIFYING':'REVIEW';
      badge.textContent=label;badge.className=`status-pill ${current.phase==='verified'?'good':current.phase==='failed'?'danger':s?.caseLocked?'warn':'muted'}`;
    }
    const verify=$('finalArchiveVerifyBtn');if(verify){verify.disabled=!s?.caseLocked||current.phase==='verifying';verify.hidden=current.phase==='verified';verify.textContent=current.phase==='verifying'?'Verifying…':'Verify final archive'}
    const retry=$('finalArchiveRetryBtn');if(retry)retry.hidden=!(s?.caseLocked&&current.phase==='failed');
    const backup=$('finalArchiveBackupBtn');if(backup)backup.hidden=!(s?.caseLocked&&current.phase==='failed');

    const fb=$('finalizedArchiveAssuranceBadge'),ft=$('finalizedArchiveAssuranceText'),fs=$('caseFinalizedSummary');
    if(fb){fb.textContent=current.phase==='verified'?'VERIFIED':current.phase==='failed'?'ATTENTION':'VERIFYING';fb.className=`status-pill ${current.phase==='verified'?'good':current.phase==='failed'?'danger':'warn'}`}
    if(ft){ft.textContent=current.phase==='verified'?`Archive copy verified • checksum ${short(current.expectedChecksum||s?.finalChecksum)}`:current.phase==='failed'?`${current.message||'Archive verification failed'} — retry before Start new case`:'Verifying archived final record…'}
    if(fs&&s?.caseLocked){const patient=s.patientName||'Patient';fs.textContent=current.phase==='verified'?`${patient} • Final record locked & archive verified`:current.phase==='failed'?`${patient} • Final record locked • archive verification needs attention`:`${patient} • Final record locked • verifying archived copy`;}
    const fRetry=$('finalizedRetryArchiveBtn');if(fRetry)fRetry.hidden=current.phase!=='failed';
    const newCase=$('finalizedNewCaseBtn');if(newCase){newCase.disabled=!!s?.caseLocked&&!canStartNewCase();newCase.title=newCase.disabled?'Archive verification must pass before starting a new case':''}
  }

  async function refresh({silent=false,force=false}={}){
    const s=st();
    if(!s?.caseLocked){setStatus({phase:'waiting',ok:false,code:'WAITING',message:'Final record verification will run after Final Lock.',archivedAt:0,counts:null});return current}
    if(current.phase==='verified'&&!force&&current.caseId===s.caseId){render();return current}
    if(running&&!force)return running;
    setStatus({phase:'verifying',ok:false,code:'VERIFYING',message:'Verifying archived final record…',caseId:s.caseId,recordId:s.humanRecordId||''});
    running=(async()=>{
      try{
        const result=await api()?.finalArchive?.verify?.(s);
        if(result?.ok){setStatus({...result,phase:'verified'});if(!silent)api()?.toast?.('Final archive verified')}
        else{setStatus({...result,phase:'failed'});if(!silent)api()?.toast?.('Final record locked — archive verification needs attention')}
      }catch(e){setStatus({phase:'failed',ok:false,code:'VERIFY_ERROR',message:e?.message||'Unable to verify final archive',caseId:s.caseId,recordId:s.humanRecordId||''})}
      finally{running=null}
      return current;
    })();
    return running;
  }

  async function retry(){
    const s=st();if(!s?.caseLocked)return refresh({force:true});
    setStatus({phase:'verifying',ok:false,code:'RETRYING',message:'Rewriting archived copy and verifying checksum…',caseId:s.caseId,recordId:s.humanRecordId||''});
    try{
      const result=await api()?.finalArchive?.retry?.();
      if(result?.ok){setStatus({...result,phase:'verified'});api()?.toast?.('Archive rewritten and verified')}
      else{setStatus({...result,phase:'failed'});api()?.toast?.('Archive still not verified — keep this locked record and create a backup')}
    }catch(e){setStatus({phase:'failed',ok:false,code:'RETRY_ERROR',message:e?.message||'Archive retry failed',caseId:s.caseId,recordId:s.humanRecordId||''})}
    return current;
  }

  function acceptExternalStatus(detail){
    if(!detail)return;
    const s=st();if(s?.caseId&&detail.caseId&&detail.caseId!==s.caseId)return;
    setStatus({...detail,phase:detail.ok?'verified':'failed'});
  }

  $('finalArchiveVerifyBtn')?.addEventListener('click',()=>refresh({force:true}));
  $('finalArchiveRetryBtn')?.addEventListener('click',retry);
  $('finalizedRetryArchiveBtn')?.addEventListener('click',retry);
  $('finalArchiveBackupBtn')?.addEventListener('click',()=>$('endBackupBtn')?.click());
  document.addEventListener('anesvet:final-archive-status',e=>acceptExternalStatus(e.detail));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="endcase"],[data-mobile-tab="endcase"]'))setTimeout(()=>refresh({silent:true}),60)});
  const onPageShow=()=>setTimeout(()=>refresh({silent:true}),80);window.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',onPageShow);

  window.AnesvetFinalArchiveAssurance=Object.freeze({refresh,retry,getStatus:()=>({...current}),canStartNewCase,render});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>refresh({silent:true}),80),{once:true});else setTimeout(()=>refresh({silent:true}),80);
})();
