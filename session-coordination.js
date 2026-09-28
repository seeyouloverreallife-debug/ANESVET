(()=>{
'use strict';
function create({lockKey,tabKey,ttlMs=30000,heartbeatMs=5000,channelName='anesvet-session',appVersion='',getCaseInfo=()=>({}),onMode=()=>{},onMessage=()=>{}}={}){
  let mode='initializing',heartbeat=null,channel=null;
  const tabId=(()=>{try{let id=sessionStorage.getItem(tabKey);if(!id){id=crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random());sessionStorage.setItem(tabKey,id)}return id}catch(e){return crypto.randomUUID?crypto.randomUUID():String(Date.now()+Math.random())}})();
  function readLock(){try{const x=JSON.parse(localStorage.getItem(lockKey)||'null');return x&&x.tabId?x:null}catch(e){return null}}
  function isFresh(lock){return !!(lock&&lock.tabId&&Number(lock.heartbeatAt)>0&&(Date.now()-Number(lock.heartbeatAt))<ttlMs)}
  function writeLock(){if(mode!=='active')return false;const info=getCaseInfo()||{},lock={tabId,heartbeatAt:Date.now(),caseId:info.caseId||'',patientName:info.patientName||'',version:appVersion};try{localStorage.setItem(lockKey,JSON.stringify(lock))}catch(e){return false}try{channel?.postMessage({type:'HEARTBEAT',...lock})}catch(e){}return true}
  function release(){const lock=readLock();if(lock?.tabId===tabId){try{localStorage.removeItem(lockKey)}catch(e){};try{channel?.postMessage({type:'RELEASE',tabId})}catch(e){}}}
  function emitMode(next,reason='',lock=null){mode=next;if(heartbeat){clearInterval(heartbeat);heartbeat=null}if(next==='active'){writeLock();heartbeat=setInterval(writeLock,heartbeatMs)}try{onMode(next,reason,lock)}catch(e){}return next}
  function takeControl(reason='Control transferred to this tab'){emitMode('active',reason);try{channel?.postMessage({type:'TAKE_CONTROL',tabId,heartbeatAt:Date.now()})}catch(e){}}
  function refresh(){const lock=readLock();if(!isFresh(lock)||lock.tabId===tabId){takeControl();return {mode:'active',lock}}emitMode('view','',lock);return {mode:'view',lock}}
  function init(){
    try{if('BroadcastChannel' in window){channel=new BroadcastChannel(channelName);channel.onmessage=e=>{const m=e.data||{};if(m.tabId===tabId)return;if(m.type==='TAKE_CONTROL'&&mode==='active')emitMode('view','Another tab took control. This tab is now view-only.',m);try{onMessage(m,mode)}catch(err){}}}}
    catch(e){}
    window.addEventListener('storage',e=>{if(e.key!==lockKey)return;const lock=readLock();if(mode==='active'&&isFresh(lock)&&lock.tabId!==tabId)emitMode('view','Another tab took control. This tab is now view-only.',lock);else try{onMessage({type:'LOCK_CHANGED',lock},mode)}catch(err){}});
    const lock=readLock();if(!isFresh(lock)||lock.tabId===tabId)emitMode('active','',lock);else emitMode('view','',lock);
    return mode;
  }
  function setMode(next,reason=''){return emitMode(next,reason,readLock())}
  function getMode(){return mode}
  function broadcast(type,payload={}){try{channel?.postMessage({type,tabId,...payload});return true}catch(e){return false}}
  return Object.freeze({tabId,readLock,isFresh,writeLock,release,takeControl,refresh,init,setMode,getMode,broadcast});
}
window.ANESVET_SESSION_COORDINATION=Object.freeze({create});
})();
