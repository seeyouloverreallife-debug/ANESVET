(()=>{
'use strict';
function appendScore(scores,entry){return [...(Array.isArray(scores)?scores:[]),entry]}
function appendRecord(records,entry){return [...(Array.isArray(records)?records:[]),entry]}
function beginPatch(stateLike={},epoch=Date.now()){return {emergencyReturnActive:false,casePhase:'recovery',recoveryStartedAt:stateLike.recoveryStartedAt||epoch,recoveryCompletedAt:null}}
function completePatch(completionOverride=null,epoch=Date.now()){return {recoveryCompletionOverride:completionOverride,recoveryCompletedAt:epoch,casePhase:'complete',emergencyReturnActive:false}}
function applyPatch(target,patch){Object.assign(target,patch);return target}
window.ANESVET_RECOVERY_ORCHESTRATION=Object.freeze({appendScore,appendRecord,beginPatch,completePatch,applyPatch});
})();
