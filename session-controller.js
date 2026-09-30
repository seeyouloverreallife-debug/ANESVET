/* ANESVET V17.2.4 — Session Controller
   UI/session ownership boundary with stale-lock self-recovery.
   Interaction safety rule: only an explicit VIEW mode may block controls; INITIALIZING must never freeze the UI. */
(function(root){
'use strict';
function create({getCaseInfo=()=>({}),toast=()=>{},onMode=()=>{},appVersion='',lockKey,tabKey,ttlMs=30000,heartbeatMs=5000,channelName='anesvet-session-v14'}={}){
  const shell=root.ANESVET_APP_SHELL;if(!shell)throw new Error('ANESVET app-shell.js failed to load');
  const {$}=shell,coordFactory=root.ANESVET_SESSION_COORDINATION?.create;if(!coordFactory)throw new Error('ANESVET session-coordination.js failed to load');
  let mode='initializing',recoveryTimer=null;
  function readLock(){return coordinator?.readLock?.()||null}
  function isFresh(lock){return !!coordinator?.isFresh?.(lock)}
  function writeLock(){return coordinator?.writeLock?.()||false}
  function release(){coordinator?.release?.()}
  function safeTarget(target){return !!target?.closest?.('.session-safe,[data-tab],[data-more-tab],#moreMenuBtn,.archive-pdf,.archive-summary-pdf,.verify-integrity')}
  function render(){
    const view=mode==='view',banner=$('sessionBanner');document.body.classList.toggle('session-readonly',view);if(banner)banner.hidden=!view;
    if(view){const lock=readLock(),detail=lock?.patientName?`Active tab: ${lock.patientName}`:'Another ANESVET tab currently owns the clinical session';if($('sessionBannerText'))$('sessionBannerText').textContent=`${detail}. This tab will not save or modify clinical records.`}
    else if($('sessionBannerText'))$('sessionBannerText').textContent='This tab has control of the ANESVET clinical session.';
  }
  function renderConflict(lock,reason=''){
    const text=reason||`Another ANESVET tab is active${lock?.patientName?` with ${lock.patientName}`:''}. View only prevents current-case overwrite. Take control only if the other tab should stop recording.`;
    if($('sessionDialogText'))$('sessionDialogText').textContent=text;const d=$('sessionDialog');try{if(d&&!d.open)d.showModal()}catch(_){ }
  }
  const coordinator=coordFactory({lockKey,tabKey,ttlMs,heartbeatMs,channelName,appVersion,getCaseInfo,
    onMode:(next,reason,lock)=>{mode=next;if(next==='active'){try{$('sessionDialog')?.close()}catch(_){ }if(reason)toast(reason)}else{if(reason&&$('sessionDialogText'))$('sessionDialogText').textContent=reason;if(reason&&String(reason).startsWith('Another tab'))toast('Another tab took control — VIEW ONLY')}onMode(next,reason,lock);render()},
    onMessage:(m,next)=>{if(m?.type==='RELEASE'&&next!=='active')recoverOrphanedSession(false);else if(next!=='active')render()}
  });
  function setMode(next,reason=''){coordinator.setMode(next,reason)}
  function takeControl(reason='Control transferred to this tab'){coordinator.takeControl(reason)}
  function showConflict(lock){coordinator.setMode('view','');renderConflict(lock)}
  function refresh(){const r=coordinator.refresh();if(r?.mode==='view')renderConflict(r.lock);return r}
  function recoverOrphanedSession(announce=true){
    if(mode==='active')return false;const lock=readLock();if(isFresh(lock))return false;
    coordinator.takeControl(announce?'Previous ANESVET session expired — control restored to this screen':'');return true;
  }
  function init(){
    if(mode!=='initializing')return mode;
    try{
      const next=coordinator.init();if(next==='view')renderConflict(readLock());return next;
    }catch(err){
      // Never leave the app in a silent interaction-dead state. If there is no fresh competing writer,
      // restore local control; otherwise remain explicitly view-only and surface the conflict.
      const lock=readLock();
      if(isFresh(lock)){mode='view';render();renderConflict(lock,'Session coordination could not initialize cleanly while another active session lock exists. Take control only if the other screen should stop recording.');return mode}
      mode='active';render();toast('Session coordination recovered — local control restored');return mode;
    }
  }
  function isActive(){return mode==='active'}
  function bind(){
    root.addEventListener?.('pageshow',()=>{recoverOrphanedSession(false);render()});
    root.document?.addEventListener?.('visibilitychange',()=>{if(root.document.visibilityState==='visible'){recoverOrphanedSession(false);render()}});
    if(!recoveryTimer)recoveryTimer=setInterval(()=>recoverOrphanedSession(false),Math.max(2000,Math.min(heartbeatMs,5000)));
    $('sessionViewOnlyBtn')?.addEventListener('click',()=>{try{$('sessionDialog')?.close()}catch(_){ }setMode('view');toast('Opened in VIEW ONLY mode')});
    $('sessionDialogTakeControlBtn')?.addEventListener('click',()=>takeControl());$('sessionTakeControlBtn')?.addEventListener('click',()=>takeControl());$('sessionRefreshBtn')?.addEventListener('click',refresh);
    const blockViewOnly=e=>{if(mode!=='view'||safeTarget(e.target))return;const actionable=e.target.closest?.('button,input,select,textarea,label');if(actionable&&actionable.closest?.('.tabpage')){if(e.cancelable)e.preventDefault();e.stopImmediatePropagation();if(e.type==='click')toast('VIEW ONLY — Take control before editing')}};
    // Block only explicit VIEW mode. `initializing` is transitional and must never become a global click shield.
    document.addEventListener('click',blockViewOnly,true);
    document.addEventListener('beforeinput',blockViewOnly,true);
    document.addEventListener('change',blockViewOnly,true);
    document.addEventListener('keydown',e=>{if(mode!=='view'||safeTarget(e.target))return;const actionable=e.target.closest?.('input,select,textarea');if(actionable&&actionable.closest?.('.tabpage')){if(e.cancelable)e.preventDefault();e.stopImmediatePropagation()}},true);
  }
  return Object.freeze({init,bind,render,renderConflict,readLock,isFresh,writeLock,release,setMode,takeControl,showConflict,refresh,recoverOrphanedSession,isActive,isViewOnly:()=>mode==='view',getMode:()=>mode});
}
root.ANESVET_SESSION_CONTROLLER=Object.freeze({create});
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
