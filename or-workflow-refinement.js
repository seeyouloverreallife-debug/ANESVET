/* ANESVET V17.10.11 — OR LIVE phase presentation refinement. No clinical mutation. */
(function(root){'use strict';const $=id=>document.getElementById(id);let pending=false;
function activeKey(){
 const s=root.AnesvetApp?.getState?.()||{},phase=s.casePhase||'setup',action=$('orPrimaryActionBtn')?.dataset.action||'';
 if(phase==='setup'||action==='start-induction')return'induction';
 if(phase==='induction'&&(action==='airway'||action==='airway-edit'))return'airway';
 if(phase==='induction'||phase==='intraop')return'surgery';
 if(phase==='emergence')return'emergence';
 if(phase==='recovery'||phase==='complete'||phase==='locked')return'recovery';
 return phase==='emergency'?'surgery':'induction';
}
function render(){
 const strip=$('orCorePhaseStrip');if(!strip)return;const key=activeKey(),order=['induction','airway','surgery','emergence','recovery'],i=order.indexOf(key);
 strip.querySelectorAll('[data-core-phase]').forEach(el=>{const x=order.indexOf(el.dataset.corePhase);el.classList.toggle('active',x===i);el.classList.toggle('done',x>=0&&i>=0&&x<i)});
 const action=$('orPrimaryActionBtn')?.dataset.action||'';strip.dataset.action=action;
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
function bind(){if(bind.done)return;bind.done=true;const o=new MutationObserver(schedule);['orPrimaryActionBtn','orPhaseBadge','casePhaseBadge'].forEach(id=>{const e=$(id);if(e)o.observe(e,{attributes:true,childList:true,characterData:true,subtree:true})});document.addEventListener('anesvet:viewportchange',schedule);render()}
root.ANESVET_OR_WORKFLOW_REFINEMENT=Object.freeze({version:'17.10.11',render,activeKey});root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
