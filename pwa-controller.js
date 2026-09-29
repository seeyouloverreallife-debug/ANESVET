/* ANESVET V16.18.0 — PWA Controller
   Install/update lifecycle only. Clinical update-safety decision is injected as a pure query. */
(function(root){
'use strict';
function create({isReloadUnsafe=()=>false,toast=()=>{},serviceWorkerUrl='./service-worker.js'}={}){
  const shell=root.ANESVET_APP_SHELL;if(!shell)throw new Error('ANESVET app-shell.js failed to load');const {$}=shell;
  let deferredPrompt=null,pendingRegistration=null,reloading=false,bound=false;
  function renderUpdateBanner(reg){pendingRegistration=reg||pendingRegistration;const b=$('updateBanner');if(!b||!pendingRegistration?.waiting)return;const active=!!isReloadUnsafe();b.hidden=false;if($('updateBannerTitle'))$('updateBannerTitle').textContent=active?'ANESVET update ready — deferred for active case':'ANESVET update ready';if($('updateBannerText'))$('updateBannerText').textContent=active?'เพื่อความปลอดภัย ระบบจะไม่เปลี่ยน version ระหว่าง current case. Finish + Final Lock หรือ Reset current case ก่อนอัปเดต':'เวอร์ชันใหม่ดาวน์โหลดแล้ว พร้อมติดตั้งโดย reload แอปหนึ่งครั้ง';if($('updateNowBtn')){$('updateNowBtn').disabled=active;$('updateNowBtn').textContent=active?'Update after case':'Update now'}}
  async function setupServiceWorkerUpdates(){if(!('serviceWorker'in navigator))return;try{const reg=await navigator.serviceWorker.register(serviceWorkerUrl);pendingRegistration=reg;if(reg.waiting)renderUpdateBanner(reg);reg.addEventListener('updatefound',()=>{const nw=reg.installing;if(!nw)return;nw.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)renderUpdateBanner(reg)})});navigator.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;root.location.reload()})}catch(_){ }}
  function bind(){if(bound)return;bound=true;root.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;if($('installBtn'))$('installBtn').hidden=false});$('installBtn')?.addEventListener('click',async()=>{if(!deferredPrompt)return;deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('installBtn').hidden=true});root.addEventListener('appinstalled',()=>{if($('installBtn'))$('installBtn').hidden=true});$('updateNowBtn')?.addEventListener('click',()=>{const reg=pendingRegistration;if(!reg?.waiting)return;if(isReloadUnsafe()){renderUpdateBanner(reg);toast('Finish and Final Lock the current case, or Reset it, before updating');return}reg.waiting.postMessage({type:'SKIP_WAITING'})});$('updateLaterBtn')?.addEventListener('click',()=>{if($('updateBanner'))$('updateBanner').hidden=true});root.addEventListener('load',setupServiceWorkerUpdates)}
  return Object.freeze({bind,renderUpdateBanner,setupServiceWorkerUpdates,getPendingRegistration:()=>pendingRegistration});
}
root.ANESVET_PWA_CONTROLLER=Object.freeze({create});
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
