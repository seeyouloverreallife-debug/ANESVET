/* ANESVET V17.14.9 — PWA Controller
   Safe update lifecycle with active-case checkpointing. */
(function(root){
'use strict';
function create({isReloadUnsafe=()=>false,prepareForUpdate=async()=>({ok:true}),onReloadStarting=()=>{},flushOnFreeze=()=>{},restoreAfterBFCache=()=>{},toast=()=>{},serviceWorkerUrl='./service-worker.js'}={}){
  const shell=root.ANESVET_APP_SHELL;if(!shell)throw new Error('ANESVET app-shell.js failed to load');const {$}=shell;
  let deferredPrompt=null,pendingRegistration=null,reloading=false,bound=false,activating=false,reloadBlocked=false,controllerListenerBound=false;
  async function verifyCheckpoint(){
    if(!isReloadUnsafe())return;
    const result=await prepareForUpdate();
    if(result!==true&&result?.ok!==true)throw new Error(result?.reason||'Current case could not be verified before update');
  }
  async function reloadAfterVerification(){
    if(reloading)return false;
    reloading=true;
    try{
      await verifyCheckpoint();
      onReloadStarting();
      root.location.reload();
      return true;
    }catch(e){
      reloading=false;activating=false;reloadBlocked=true;
      renderUpdateBanner();toast(`Update paused — ${e?.message||e}`);return false;
    }
  }
  function renderUpdateBanner(reg){
    pendingRegistration=reg||pendingRegistration;const b=$('updateBanner');if(!b||(!pendingRegistration?.waiting&&!reloadBlocked))return;
    const active=!!isReloadUnsafe();b.hidden=false;
    if($('updateBannerTitle'))$('updateBannerTitle').textContent=active?'ANESVET update ready — current case will be preserved':'ANESVET update ready';
    if($('updateBannerText'))$('updateBannerText').textContent=reloadBlocked?'ยังไม่โหลดหน้าใหม่ เพราะยืนยันสำเนาเคสไม่ผ่าน แก้ปัญหาการบันทึกแล้วกดลองอีกครั้ง':active?'ระบบจะบันทึกและตรวจสอบ current case บนเครื่องก่อน แล้วเปิดเวอร์ชันใหม่กลับเข้าสู่เคสเดิมโดยอัตโนมัติ':'เวอร์ชันใหม่ดาวน์โหลดแล้ว พร้อมติดตั้งโดย reload แอปหนึ่งครั้ง';
    if($('updateNowBtn')){$('updateNowBtn').disabled=activating||reloading;$('updateNowBtn').textContent=reloadBlocked?'Verify case & retry':active?'Save case & update':'Update now'}
  }
  async function activateWaitingUpdate(){
    if(activating||reloading)return false;
    if(reloadBlocked)return reloadAfterVerification();
    const reg=pendingRegistration;if(!reg?.waiting)return false;activating=true;
    const btn=$('updateNowBtn');if(btn)btn.disabled=true;
    try{
      await verifyCheckpoint();
      reg.waiting.postMessage({type:'SKIP_WAITING'});
      return true;
    }catch(e){
      activating=false;if(btn)btn.disabled=false;renderUpdateBanner(reg);toast(`Update paused — ${e?.message||e}`);return false;
    }
  }
  async function setupServiceWorkerUpdates(){
    if(!('serviceWorker'in navigator))return;
    if(!controllerListenerBound){
      controllerListenerBound=true;
      let hadController=!!navigator.serviceWorker.controller;
      navigator.serviceWorker.addEventListener('controllerchange',()=>{
        // The first installation claims the page naturally; no reload is needed.
        if(!hadController){hadController=true;return;}
        reloadAfterVerification();
      });
    }
    try{
      const reg=await navigator.serviceWorker.register(serviceWorkerUrl,{updateViaCache:'none'});pendingRegistration=reg;
      try{await reg.update()}catch(_){ }
      if(reg.waiting)renderUpdateBanner(reg);
      reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)renderUpdateBanner(reg)})});
    }catch(_){ }
  }
  function bind(){
    if(bound)return;bound=true;
    root.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if($('installBtn'))$('installBtn').hidden=false});
    $('installBtn')?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true});
    root.addEventListener('appinstalled',()=>{if($('installBtn'))$('installBtn').hidden=true});
    $('updateNowBtn')?.addEventListener('click',activateWaitingUpdate);
    $('updateLaterBtn')?.addEventListener('click',()=>{if($('updateBanner'))$('updateBanner').hidden=true});
    root.document?.addEventListener?.('freeze',()=>{try{flushOnFreeze()}catch(_){}});
    root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe?.('pageshow',e=>{if(!e.detail?.persisted)return;setTimeout(()=>{try{restoreAfterBFCache()}catch(_){}},0)});
    if(root.document?.readyState==='complete')setupServiceWorkerUpdates();
    else root.addEventListener('load',setupServiceWorkerUpdates);
  }
  return Object.freeze({bind,renderUpdateBanner,setupServiceWorkerUpdates,activateWaitingUpdate,getPendingRegistration:()=>pendingRegistration});
}
root.ANESVET_PWA_CONTROLLER=Object.freeze({create});
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
