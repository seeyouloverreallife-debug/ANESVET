/* ANESVET V16.18.0 — Case Lifecycle Queries
   Pure release/update safety queries. These helpers do not mutate case data. */
(function(root){
'use strict';
function hasActiveCaseData(s={}){return !!(s?.timer?.running||(s?.timer?.elapsedMs||0)>0||(s?.records||[]).length||(s?.events||[]).length||(s?.complications||[]).length||(s?.drugAdministrations||[]).length||(s?.alertEpisodes||[]).length||(s?.recoveryScores||[]).length||(s?.recoveryTransfers||[]).length||s?.patientSaved)}
function finalCaseIsSealed(s={}){return !!(s?.caseLocked&&s?.finalChecksum&&s?.lockedAt)}
function versionReloadUnsafe(s={}){return !finalCaseIsSealed(s)&&hasActiveCaseData(s)}
const api=Object.freeze({hasActiveCaseData,finalCaseIsSealed,versionReloadUnsafe});
root.ANESVET_CASE_LIFECYCLE=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
