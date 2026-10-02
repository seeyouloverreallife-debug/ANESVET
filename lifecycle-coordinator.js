(function(root){
'use strict';
const VERSION='17.10.7',subs=new Map();
function emit(type,detail={}){
 const list=[...(subs.get(type)||[])];
 for(const fn of list){try{fn(Object.freeze({type,detail,ts:Date.now()}))}catch(e){console.warn('Lifecycle subscriber',type,e)}}
}
function subscribe(type,fn){
 if(typeof fn!=='function')return()=>{};
 if(!subs.has(type))subs.set(type,new Set());
 subs.get(type).add(fn);return()=>subs.get(type)?.delete(fn);
}
function bind(){
 if(bind.done||typeof window==='undefined')return;bind.done=true;
 window.addEventListener('pageshow',e=>emit('pageshow',{persisted:!!e.persisted}));
 window.addEventListener('online',()=>emit('connectivity',{online:true}));
 window.addEventListener('offline',()=>emit('connectivity',{online:false}));
 window.addEventListener('anesvet:data-safety-changed',e=>emit('data-safety',{source:e?.detail||null}));
 document.addEventListener('anesvet:final-archive-status',e=>emit('final-archive-status',{source:e?.detail||null}));
}
function ready(fn){if(typeof fn!=='function')return;if(typeof document==='undefined'){fn();return}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn,{once:true});else fn()}

const api=Object.freeze({version:VERSION,subscribe,emit,bind,ready});root.ANESVET_LIFECYCLE_COORDINATOR=api;bind();
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
