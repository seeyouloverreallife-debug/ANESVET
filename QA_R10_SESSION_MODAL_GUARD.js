/* R10: VIEW ONLY must block interactions in open clinical dialogs as well as tabpages.
 * Runs the shipped session-controller.js in a minimal capture-event DOM. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(__dirname+'/session-controller.js','utf8');
const results=[];
function test(name,fn){try{fn();results.push({name,pass:true});console.log('PASS',name)}catch(error){results.push({name,pass:false,error:error.message});console.error('FAIL',name,error.message)}}
function env(initial='view'){
 const listeners={},marks=[],toasts=[],classes=new Set(),fields=new Map();
 const get=id=>{if(!fields.has(id))fields.set(id,{id,hidden:false,textContent:'',open:false,addEventListener(){},showModal(){this.open=true},close(){this.open=false}});return fields.get(id)};
 const document={body:{classList:{toggle(k,on){on?classes.add(k):classes.delete(k)},contains:k=>classes.has(k)}},addEventListener(type,fn){(listeners[type]??=[]).push(fn)},visibilityState:'visible'};
 const root={document,addEventListener(){},ANESVET_BOOT_DIAGNOSTIC:{mark:(stage,detail)=>marks.push({stage,detail})},ANESVET_APP_SHELL:{$:get},setInterval(){return 1},clearInterval(){}};
 root.ANESVET_SESSION_COORDINATION={create:({onMode})=>({init(){onMode(initial,'',initial==='view'?{patientName:'Example'}:null);return initial},getMode(){return initial},readLock(){return null},isFresh(){return false},setMode(m){onMode(m,'',null);return m},takeControl(){onMode('active','',null)},writeLock(){return true},release(){},refresh(){return{mode:initial}}})};
 const context={globalThis:root,module:{exports:{}},document,console,setInterval:root.setInterval,clearInterval:root.clearInterval};vm.runInNewContext(source,context,{filename:'session-controller.js'});
 const ctrl=context.module.exports.create({toast:msg=>toasts.push(msg)});ctrl.init();ctrl.bind();
 // A real button's closest() walks parents; the tests model that for each scope.
 function target({tag='button',scope='dialog',safe='',dialogId='orQuickDrugDialog'}={}){
  const dialog={id:dialogId};
  const element={tagName:tag.toUpperCase(),closest(selector){
   const parts=selector.split(',').map(s=>s.trim());
   if(parts.includes('.tabpage'))return scope==='page'?{id:'orlive'}:null;
   if(parts.includes('dialog[open]'))return scope==='dialog'?dialog:null;
   if(parts.includes('form'))return tag==='form'?element:null;
   if(parts.includes(tag))return element;
   if(safe && parts.includes(safe))return element;
   return null;
  }};
  return element;
 }
 function fire(type,target){const e={type,target,cancelable:true,prevented:false,stopped:false,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};(listeners[type]||[]).forEach(fn=>{if(!e.stopped)fn(e)});return e}
 return{ctrl,target,fire,marks,toasts,classes};
}
test('VIEW ONLY blocks medication Save inside an open dialog outside tabpage',()=>{const x=env(),e=x.fire('click',x.target({tag:'button',scope:'dialog'}));assert(e.prevented&&e.stopped)});
test('VIEW ONLY blocks input in a clinical dialog',()=>{const x=env(),e=x.fire('beforeinput',x.target({tag:'input',scope:'dialog'}));assert(e.prevented&&e.stopped)});
test('VIEW ONLY blocks route/select change inside dialog',()=>{const x=env(),e=x.fire('change',x.target({tag:'select',scope:'dialog'}));assert(e.prevented&&e.stopped)});
test('VIEW ONLY blocks keyboard input inside dialog',()=>{const x=env(),e=x.fire('keydown',x.target({tag:'textarea',scope:'dialog'}));assert(e.prevented&&e.stopped)});
test('VIEW ONLY retains protection for patient page buttons',()=>{const x=env(),e=x.fire('click',x.target({tag:'button',scope:'page'}));assert(e.prevented&&e.stopped)});
test('VIEW ONLY permits session Take control',()=>{const x=env(),e=x.fire('click',x.target({scope:'dialog',safe:'.session-safe',dialogId:'sessionDialog'}));assert(!e.prevented&&!e.stopped)});
test('VIEW ONLY permits closing a medication dialog',()=>{const x=env(),e=x.fire('click',x.target({scope:'dialog',safe:'[data-close-dialog]'}));assert(!e.prevented&&!e.stopped)});
test('VIEW ONLY permits close-X in a clinical dialog',()=>{const x=env(),e=x.fire('click',x.target({scope:'dialog',safe:'.dialog-close-x'}));assert(!e.prevented&&!e.stopped)});
test('VIEW ONLY permits mobile navigation from its open menu dialog',()=>{const x=env(),e=x.fire('click',x.target({scope:'dialog',safe:'[data-mobile-tab]',dialogId:'mobileWorkflowDialog'}));assert(!e.prevented&&!e.stopped)});
test('VIEW ONLY does not globally block diagnostic button outside protected scopes',()=>{const x=env(),e=x.fire('click',x.target({scope:'other'}));assert(!e.prevented&&!e.stopped)});
test('ACTIVE mode allows dialogs to work',()=>{const x=env('active'),e=x.fire('click',x.target({scope:'dialog'}));assert(!e.prevented&&!e.stopped)});
test('INITIALIZING mode does not trap controls',()=>{const x=env('initializing'),e=x.fire('click',x.target({scope:'dialog'}));assert(!e.prevented&&!e.stopped)});
test('VIEW ONLY diagnostic records blocking without capturing patient or medication contents',()=>{const x=env(),e=x.fire('click',x.target({scope:'dialog'}));assert(e.stopped);assert(x.marks.some(m=>m.stage==='session-view-only-blocked'&&m.detail==='dialog'));assert(!JSON.stringify(x.marks).includes('Example'))});
const count=results.filter(x=>x.pass).length;console.log(JSON.stringify({suite:'R10-session-modal-guard',passed:count,total:results.length,failures:results.filter(x=>!x.pass)},null,2));if(count!==results.length)process.exitCode=1;
