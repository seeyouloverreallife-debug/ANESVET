/* ANESVET R13 — prevent stale in-memory current case from overwriting a newer shared local copy.
   This guard does not merge clinical records; the user reloads to hydrate the latest saved case. */
(function(root){
'use strict';
function create({read,onBlocked=()=>{}}={}){
  if(typeof read!=='function')throw new TypeError('read function required');
  let initialized=false,baseline=null,blocked=false,reason='';
  function block(why){
    if(!blocked){blocked=true;reason=why;try{onBlocked(why)}catch(_){}}
    return false;
  }
  function establish(){
    if(blocked)return false;
    try{baseline=read();initialized=true;return true}
    catch(_){initialized=true;return block('storage-unavailable')}
  }
  function verify(){
    if(blocked)return false;
    if(!initialized)return false; // fail closed before state hydration
    let persisted;
    try{persisted=read()}catch(_){return block('storage-unavailable')}
    if(persisted!==baseline)return block('external-case-change');
    return true;
  }
  function committed(payload){
    // Only call after localStorage read-back verification succeeded.
    if(blocked||!initialized||typeof payload!=='string')return false;
    baseline=payload;return true;
  }
  return Object.freeze({establish,verify,committed,block,isEstablished:()=>initialized,isBlocked:()=>blocked,reason:()=>reason});
}
root.ANESVET_ACTIVE_CASE_FRESHNESS=Object.freeze({create});
if(typeof module!=='undefined'&&module.exports)module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
