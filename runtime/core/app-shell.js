/* ANESVET V17.13.3 — App Shell
   Shared non-clinical UI utilities. No clinical state, thresholds, medication logic,
   Recovery criteria, persistence schema, or finalization semantics live here. */
(function(root){
'use strict';
const $=id=>document.getElementById(id);
const $$=sel=>[...document.querySelectorAll(sel)];
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
function clamp(v,min,max,fallback=null){if(v===''||v===null||v===undefined)return fallback;const n=Number(v);return Number.isFinite(n)?Math.max(min,Math.min(max,n)):fallback}
function pad(n){return String(n).padStart(2,'0')}
function formatClock(epoch=Date.now()){const d=new Date(epoch);return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`}
function formatDate(epoch){const d=new Date(epoch);return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`}
function formatElapsed(ms){const s=Math.max(0,Math.floor((ms||0)/1000)),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),sec=s%60;return `${pad(h)}:${pad(m)}:${pad(sec)}`}
function formatShortElapsed(ms){const s=Math.max(0,Math.floor((ms||0)/1000)),m=Math.floor(s/60),sec=s%60;return m>=60?formatElapsed(ms):`${m}:${pad(sec)}`}
function createToast(target='toast',durationMs=2200){let timer=null;return function toast(message){const t=typeof target==='string'?$(target):target;if(!t)return;t.textContent=String(message??'');t.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>t.classList.remove('show'),durationMs)}}

function bindSaveStateFeedback(){
  const saveState=$('saveState');if(!saveState||saveState.dataset.shellFeedbackBound==='1')return;
  saveState.dataset.shellFeedbackBound='1';
  const signature=()=>['error','saving','dirty','saved'].find(x=>saveState.classList.contains(x))+'|'+saveState.textContent;
  let previous=signature(),timer=null;
  new MutationObserver(()=>{const current=signature();if(current===previous)return;previous=current;if(saveState.classList.contains('saved')){saveState.classList.remove('ux-just-saved');void saveState.offsetWidth;saveState.classList.add('ux-just-saved');clearTimeout(timer);timer=setTimeout(()=>saveState.classList.remove('ux-just-saved'),650)}}).observe(saveState,{attributes:true,attributeFilter:['class'],childList:true,characterData:true,subtree:true});
}

/* Canonical storage-status assist migrated from usability-hardening.js.
   This is presentation only: retry delegates to the existing app save path. */
let storageDirtyTimer=0;
function ensureStorageStatusAssist(){
  if($('uxSaveAssist'))return $('uxSaveAssist');
  const el=document.createElement('section');
  el.id='uxSaveAssist';el.className='ux-save-assist';el.hidden=true;el.setAttribute('role','status');el.setAttribute('aria-live','polite');
  el.innerHTML='<div><b id="uxSaveAssistTitle">Storage status</b><span id="uxSaveAssistText"></span></div><button id="uxSaveRetryBtn" class="btn" type="button" hidden>ลองบันทึกอีกครั้ง</button>';
  const anchor=$('updateBanner')||$('safetyRecoveryBanner')||document.querySelector('.topbar');anchor?.insertAdjacentElement('afterend',el);
  $('uxSaveRetryBtn')?.addEventListener('click',()=>{const ok=root.AnesvetApp?.save?.({reason:'ux-retry'});setTimeout(updateStorageStatusAssist,40);if(ok===false)root.AnesvetApp?.toast?.('ยังบันทึกไม่สำเร็จ — ตรวจพื้นที่จัดเก็บหรือ reload หลังสำรองข้อมูล')});
  return el;
}
function showStorageStatusAssist(tone,title,text,retry=false){const el=ensureStorageStatusAssist();if(!el)return;el.hidden=false;el.dataset.tone=tone;if($('uxSaveAssistTitle'))$('uxSaveAssistTitle').textContent=title;if($('uxSaveAssistText'))$('uxSaveAssistText').textContent=text;if($('uxSaveRetryBtn'))$('uxSaveRetryBtn').hidden=!retry}
function updateStorageStatusAssist(){
  const save=$('saveState'),mode=save?.classList.contains('error')?'error':save?.classList.contains('dirty')?'dirty':save?.classList.contains('saving')?'saving':'saved',offline=navigator.onLine===false;
  clearTimeout(storageDirtyTimer);
  if(mode==='error'){showStorageStatusAssist('danger','บันทึกข้อมูลไม่สำเร็จ','ข้อมูลล่าสุดยังไม่ยืนยันว่าเก็บลงเครื่องแล้ว',true);return}
  if(offline){showStorageStatusAssist('offline','Offline • ยังทำเคสต่อได้','ANESVET จะบันทึก current case บนอุปกรณ์นี้ต่อไป โดยไม่ต้องใช้อินเทอร์เน็ต',mode==='dirty');return}
  if(mode==='dirty'){storageDirtyTimer=setTimeout(()=>{const now=$('saveState');if(now?.classList.contains('dirty'))showStorageStatusAssist('warn','ยังมีข้อมูลที่ยังไม่บันทึก','Autosave ใช้เวลานานกว่าปกติ สามารถลองบันทึกซ้ำได้',true)},1800);const el=$('uxSaveAssist');if(el)el.hidden=true;return}
  const el=$('uxSaveAssist');if(el)el.hidden=true;
}
function bindStorageStatusAssist(){
  const save=$('saveState');if(!save||save.dataset.shellStorageAssistBound==='1')return;save.dataset.shellStorageAssistBound='1';ensureStorageStatusAssist();new MutationObserver(updateStorageStatusAssist).observe(save,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class']});root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe?.('connectivity',updateStorageStatusAssist);window.addEventListener('online',updateStorageStatusAssist);window.addEventListener('offline',updateStorageStatusAssist);updateStorageStatusAssist();
}
const api=Object.freeze({$,$$,escapeHtml,clamp,pad,formatClock,formatDate,formatElapsed,formatShortElapsed,createToast,bindSaveStateFeedback,bindStorageStatusAssist,updateStorageStatusAssist});
root.ANESVET_APP_SHELL=api;
root.ANESVET_LIFECYCLE_COORDINATOR?.ready?.(()=>{bindSaveStateFeedback();bindStorageStatusAssist()});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
