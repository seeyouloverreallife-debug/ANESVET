/* ANESVET V15.12.1 — Reliability/environment helpers. Pure and non-clinical. */
(function(root){
'use strict';
const REQUIRED_DOM_IDS=[
  'patient','preop','drugs','casesummary','orlive','recovery','endcase','settings',
  'patientName','species','weight','asa','preOrBriefingDialog','orQuickDrugDialog','recoveryFocusRecordBtn'
];
function checkDom(doc){
  const missing=REQUIRED_DOM_IDS.filter(id=>!doc.getElementById(id));
  return {ok:missing.length===0,label:'Critical UI elements',detail:missing.length?`Missing: ${missing.join(', ')}`:'All critical UI elements present'};
}
function checkLocalStorage(storage){
  const key='__anesvet_self_test__'+Date.now();
  try{storage.setItem(key,'ok');const ok=storage.getItem(key)==='ok';storage.removeItem(key);return {ok,label:'Local clinical storage',detail:ok?'Write/read verified':'Readback mismatch'}}catch(e){return {ok:false,label:'Local clinical storage',detail:e?.message||String(e)}}
}
function checkIndexedDb(idb){return {ok:!!idb,label:'IndexedDB archive',detail:idb?'Available':'Unavailable in this browser'}}
function checkServiceWorker(nav){return {ok:!!nav?.serviceWorker,label:'PWA/service worker',detail:nav?.serviceWorker?'Supported':'Not supported; browser refresh/offline behavior may differ'}}
function checkWorkflow(WF){
  try{
    if(!WF||typeof WF.defaultAlertProtocol!=='function'||typeof WF.validateAlertProtocol!=='function')return {ok:false,label:'Clinical workflow helpers',detail:'Workflow helper API unavailable'};
    const r=WF.validateAlertProtocol(WF.defaultAlertProtocol());
    return {ok:!!r.valid,label:'Clinical workflow helpers',detail:r.valid?'Default alert protocol validates':'Default alert protocol failed validation'};
  }catch(e){return {ok:false,label:'Clinical workflow helpers',detail:e?.message||String(e)}}
}
function summarize(checks){return {ok:checks.every(x=>x.ok),passed:checks.filter(x=>x.ok).length,total:checks.length,checks};}
const api=Object.freeze({REQUIRED_DOM_IDS,checkDom,checkLocalStorage,checkIndexedDb,checkServiceWorker,checkWorkflow,summarize});
root.AnesvetReliability=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
