/* ANESVET V17.11.3 — Recovery → End Case presentation refinement. No clinical mutation. */
(function(root){'use strict';const $=id=>document.getElementById(id);let pending=false;
function stage(){
 const s=root.AnesvetApp?.getState?.()||{},ready=String($('recoveryFocusReadiness')?.textContent||'').toUpperCase();
 if(s.recoveryCompletedAt)return'final';
 if(s.casePhase!=='recovery'||s.emergencyReturnActive)return'monitor';
 if(ready.includes('READY FOR RECOVERY COMPLETE'))return'complete';
 if((s.recoveryRecords||[]).length)return'review';
 return'monitor';
}
function render(){
 const key=stage(),order=['monitor','review','complete','final'],i=order.indexOf(key),strip=$('recoveryCorePhaseStrip');
 if(strip)strip.querySelectorAll('[data-recovery-core]').forEach(el=>{const x=order.indexOf(el.dataset.recoveryCore);el.classList.toggle('active',x===i);el.classList.toggle('done',x<i)});
 const s=root.AnesvetApp?.getState?.()||{},exit=$('recoveryExitCard'),legacy=$('completeRecoveryBtn');
 if(exit){exit.classList.toggle('recovery-exit-ready',!!s.recoveryCompletedAt);exit.setAttribute('aria-hidden',s.recoveryCompletedAt?'false':'true')}
 if(legacy)legacy.classList.toggle('recovery-legacy-hidden',s.casePhase==='recovery'&&!s.recoveryCompletedAt);
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
function bind(){if(bind.done)return;bind.done=true;const o=new MutationObserver(schedule);['recoveryFocusReadiness','recoveryPhaseBadge','recoveryFocusCompleteBtn','endRecoveryStatus'].forEach(id=>{const e=$(id);if(e)o.observe(e,{attributes:true,childList:true,characterData:true,subtree:true})});document.addEventListener('anesvet:viewportchange',schedule);render()}
root.ANESVET_RECOVERY_END_REFINEMENT=Object.freeze({version:'17.11.3',stage,render});root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
