/* ANESVET V17.10.11 — single workspace disclosure/focus coordinator. */
(function(root){
'use strict';
const VERSION='17.10.11';
function openForElement(el,{persist=true,scroll=false}={}){
 if(!el)return false;
 try{if(el.closest?.('.patient-secondary-field'))root.ANESVET_PATIENT_PREOP_SIMPLIFICATION?.setDetails?.(true,persist)}catch(_){}
 try{root.ANESVETProgressiveDisclosure?.openForElement?.(el,persist)}catch(_){}
 try{root.ANESVETFocusedWorkspace?.openForElement?.(el,persist)}catch(_){}
 let node=el.parentElement;while(node){if(node.tagName==='DETAILS'&&!node.open)node.open=true;node=node.parentElement}
 if(scroll)requestAnimationFrame(()=>{if(root.ANESVET_MOBILE_OR_OWNER?.editing?.())return;el.scrollIntoView?.({behavior:'smooth',block:'nearest'})});
 return true;
}
function openWorkflowStatus(){
 const tracker=document.querySelector('#orlive .or-phase-tracker-panel');if(!tracker)return false;
 tracker.classList.add('ux-phase-requested');if('open' in tracker)tracker.open=true;openForElement(tracker,{scroll:true});return true;
}
function syncWorkflow(){
 const body=document.body,wide=window.matchMedia('(min-width:1180px)').matches,tablet=window.matchMedia('(min-width:760px) and (max-width:1179px)').matches;
 document.documentElement.classList.toggle('ux-phone',window.matchMedia('(max-width:720px)').matches);body.classList.toggle('ux-wide-workspace',wide);body.classList.toggle('ux-tablet-workspace',tablet);body.dataset.uxViewport=wide?'wide':tablet?'tablet':'mobile';
 const workflow=document.querySelector('.workflow-tabs'),tabs=[...(workflow?.querySelectorAll('.tab')||[])],active=tabs.find(x=>x.classList.contains('active'));tabs.forEach(x=>x.toggleAttribute('aria-current',x===active));if(active){active.setAttribute('aria-current','step');body.dataset.uxActiveTab=active.dataset.tab||''}
 if(active&&workflow&&window.matchMedia('(max-width:1180px), (pointer:coarse)').matches&&!body.classList.contains('or-mobile-active')&&!body.classList.contains('recovery-mobile-active')&&workflow.scrollWidth>workflow.clientWidth+1){const max=Math.max(0,workflow.scrollWidth-workflow.clientWidth),left=Math.max(0,Math.min(max,active.offsetLeft-(workflow.clientWidth-active.offsetWidth)/2));requestAnimationFrame(()=>{try{workflow.scrollTo({left,behavior:'auto'})}catch(_){workflow.scrollLeft=left}})}
}
function syncViewport(){syncWorkflow()}
function bind(){if(bind.done)return;bind.done=true;document.addEventListener('focusin',e=>openForElement(e.target,{persist:false}),true);document.addEventListener('invalid',e=>openForElement(e.target,{persist:false}),true);document.addEventListener('anesvet:viewportchange',syncWorkflow);root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',syncWorkflow);const workflow=document.querySelector('.workflow-tabs');if(workflow){new MutationObserver(syncWorkflow).observe(workflow,{subtree:true,attributes:true,attributeFilter:['class']})}syncWorkflow()}
const api=Object.freeze({version:VERSION,bind,openForElement,openWorkflowStatus,syncViewport});root.ANESVET_WORKSPACE_OWNER=api;root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
