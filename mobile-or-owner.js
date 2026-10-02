/* ANESVET V17.10.8 — shared mobile/OR viewport + editing presentation owner. */
(function(root){
'use strict';
const VERSION='17.10.8';
const EDIT='input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]):not([type=hidden]),textarea,select,[contenteditable="true"]';
const subs=new Set();let last={editing:false,keyboardOpen:false,offset:0,height:0};
function editing(el=document.activeElement){return !!el?.matches?.(EDIT)}
function snapshot(){
 const vv=root.visualViewport,edit=editing(),layout=root.innerHeight||document.documentElement.clientHeight||vv?.height||0;
 const height=vv?.height||layout,offset=Math.max(0,layout-height-(vv?.offsetTop||0));
 return Object.freeze({editing:edit,keyboardOpen:edit&&offset>=110,offset,height,activeId:document.activeElement?.id||''});
}
function emit(reason='sync'){
 const next=snapshot();last=next;
 if(!document.body)return next;
 document.body.classList.toggle('anesvet-soft-keyboard',next.keyboardOpen);
 document.body.classList.toggle('r27-keyboard-open',next.keyboardOpen&&!document.body.classList.contains('av-mobile-design'));
 document.body.classList.toggle('av-editing',document.body.classList.contains('av-mobile-design')&&matchMedia('(max-width:720px)').matches&&next.editing);
 document.documentElement.style.setProperty('--anesvet-keyboard-offset',`${Math.round(next.offset)}px`);
 document.documentElement.style.setProperty('--anesvet-visual-height',`${Math.round(next.height)}px`);
 subs.forEach(fn=>{try{fn(next,reason)}catch(e){console.warn('Mobile OR owner subscriber',e)}});
 return next;
}
function subscribe(fn){if(typeof fn!=='function')return()=>{};subs.add(fn);return()=>subs.delete(fn)}
function bind(){if(bind.done)return;bind.done=true;document.addEventListener('anesvet:viewportchange',()=>emit('viewport'));document.addEventListener('focusin',()=>emit('focusin'),true);document.addEventListener('focusout',()=>requestAnimationFrame(()=>emit('focusout')),true);root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',()=>emit('pageshow'));emit('boot')}
const api=Object.freeze({version:VERSION,bind,subscribe,snapshot,editing,sync:emit});root.ANESVET_MOBILE_OR_OWNER=api;root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
