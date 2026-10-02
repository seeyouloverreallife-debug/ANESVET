(function(root){
'use strict';
const VERSION='17.10.10';
function create(ctx={}){
 const $=ctx.$||((id)=>document.getElementById(id));
 function countText(id){const t=String($(id)?.textContent||'0');const n=parseInt(t,10);return Number.isFinite(n)?n:0}
 function update(){
   const alerts=countText('orAlertCount'),problems=countText('orProblemCount'),complications=countText('orActiveComplicationCount');
   const total=alerts+problems+complications,title=$('orCoreSafetyTitle'),summary=$('orCoreSafetySummary'),box=$('orCoreSafety');
   if(!title||!summary||!box)return;
   box.classList.toggle('active',total>0);
   title.textContent=total>0?`${total} item${total===1?'':'s'} need attention`:'No active problems';
   const parts=[];if(problems)parts.push(`${problems} problem${problems===1?'':'s'}`);if(alerts)parts.push(`${alerts} alert${alerts===1?'':'s'}`);if(complications)parts.push(`${complications} complication${complications===1?'':'s'}`);
   summary.textContent=parts.length?parts.join(' • '):'No active alerts or complications';
 }
 function openDetails(){const d=$('orSecondaryDetails');if(d)d.open=true;requestAnimationFrame(()=>{const target=$('orProblemPanel')||$('orAlertList');target?.scrollIntoView?.({behavior:'smooth',block:'center'})})}
 function bind(){
   $('orCoreSafetyOpenBtn')?.addEventListener('click',openDetails);
   const obs=typeof MutationObserver!=='undefined'?new MutationObserver(update):null;
   ['orAlertCount','orProblemCount','orActiveComplicationCount'].forEach(id=>{const el=$(id);if(el&&obs)obs.observe(el,{childList:true,subtree:true,characterData:true})});
   update();return true;
 }
 return Object.freeze({version:VERSION,bind,update,openDetails});
}
const api=Object.freeze({version:VERSION,create});root.ANESVET_OR_SIMPLIFICATION_CONTROLLER=api;
if(typeof document!=='undefined'){const start=()=>{try{const c=create();c.bind();root.ANESVET_OR_SIMPLIFICATION=c}catch(e){console.warn('OR simplification init',e)}};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start()}
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
