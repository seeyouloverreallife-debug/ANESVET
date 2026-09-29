/* ANESVET V16.18.0 — App Shell
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
const api=Object.freeze({$,$$,escapeHtml,clamp,pad,formatClock,formatDate,formatElapsed,formatShortElapsed,createToast});
root.ANESVET_APP_SHELL=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
