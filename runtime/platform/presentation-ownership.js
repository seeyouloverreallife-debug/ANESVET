/* ANESVET V17.14.11 — Presentation Ownership Registry
 * Non-clinical. Establishes one canonical presentation owner per workflow surface.
 * It does not mutate case state, calculations, safety rules, or persistence. */
(function(root){
'use strict';
const VERSION='17.14.11',owners=new Map(),history=[];
const retiredModules=Object.freeze(['ui-refinement.js','adaptive-workspace.js','clinical-simplicity.js','recovery-endcase-ux.js','repeat-use-ux.js','repeat-use-r26.js','focused-workspace.js','progressive-disclosure.js','progressive-clinical-flow.js','pilot-efficiency.js','usability-hardening.js','mobile-first-r27.js','or-speed-hardening.js']);
function claim(zone,owner,{replace=false}={}){
  if(!zone||!owner)return false;
  const current=owners.get(zone);
  if(current&&current!==owner&&!replace){history.push({at:Date.now(),type:'claim-denied',zone,current,requested:owner});return false}
  owners.set(zone,owner);history.push({at:Date.now(),type:'claim',zone,owner});return true;
}
function ownerOf(zone){return owners.get(zone)||''}
function isOwner(zone,owner){return ownerOf(zone)===owner}
function canMutate(zone,actor){const owner=ownerOf(zone);return !owner||owner===actor}
function snapshot(){return {version:VERSION,owners:Object.fromEntries(owners),retiredModules:[...retiredModules],history:history.slice(-50)}}
root.ANESVET_PRESENTATION_OWNERSHIP=Object.freeze({version:VERSION,claim,ownerOf,isOwner,canMutate,retiredModules,snapshot});
})(window);
