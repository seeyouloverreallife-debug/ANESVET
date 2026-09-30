/* R07: Floating shortcut requires a genuine on-button pointerdown, not just pointerup coordinates. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/usability-hardening.js','utf8');
const from=src.indexOf('  let lastResumePointerAt=0;');
const until=src.indexOf('  function updateReturnShortcut(){');
assert(from>0&&until>from,'R07 source section available');
const section=src.slice(from,until)+'\nthis.testApi={start:rememberShortcutPress,end:handleShortcutPointerEnd,cancel:()=>{shortcutPress=null;rejectShortcutPointerClickUntil=Date.now()+700;},eligible:returnShortcutTapEligible,create:ensureReturnShortcut};';
const results=[];
function t(name,fn){try{fn();results.push({name,pass:true});console.log('PASS',name)}catch(e){results.push({name,pass:false,error:e.message});console.error('FAIL',name,e.stack)}}
function env(opts={}){
  let button=null,click=null,now=10000,modal=!!opts.modal,hit='button',locked=false,readOnly=false;
  const calls=[];let prevented=0,stopped=0;
  const overlay={id:'otherElement'};
  const child={id:'insideShortcut'};
  const b={id:'uxReturnCase',hidden:false,inert:false,dataset:{},closest:()=>null,contains:x=>x===child,
    getBoundingClientRect:()=>({left:20,right:120,top:100,bottom:160}),setAttribute(){},
    addEventListener(type,fn){if(type==='click')click=fn;}};
  const doc={body:{classList:{contains:s=>s==='security-locked'?locked:s==='session-readonly'?readOnly:false},appendChild(el){button=el;}},
    getElementById(id){if(id==='uxReturnCase')return button;if(id==='securityLockOverlay')return {hidden:true};return null},
    createElement(){return b},querySelector(s){return s==='dialog[open]'&&modal?{id:'otherDialog'}:null},
    elementFromPoint(){return hit==='overlay'?overlay:hit==='none'?null:hit==='child'?child:b;}};
  const ctx={document:doc,$:doc.getElementById.bind(doc),api:()=>({resumeActiveCase:o=>{calls.push(o.source);return true}}),
    Date:{now:()=>now},Math};
  vm.createContext(ctx);vm.runInContext(section,ctx);ctx.testApi.create();b.hidden=false;
  const make=(options={})=>({clientX:options.x??60,clientY:options.y??125,pointerId:options.id??4,isPrimary:options.primary??true,
    button:options.button??0,detail:options.detail??1,target:options.target==='other'?overlay:options.target==='child'?child:b,
    cancelable:options.cancelable??true,preventDefault(){prevented++},stopImmediatePropagation(){stopped++},stopPropagation(){stopped++}});
  const start=(o={})=>ctx.testApi.start(make(o));
  const end=(o={})=>ctx.testApi.end(make(o));
  const nativeClick=(o={})=>click(make(o));
  return {start,end,nativeClick,cancel:ctx.testApi.cancel,calls,button,setTime:v=>now=v,setModal:v=>modal=v,setHit:v=>hit=v,setLocked:v=>locked=v,setReadonly:v=>readOnly=v,get prevented(){return prevented},get stopped(){return stopped}};
}
t('normal shortcut tap resumes once even when native click follows',()=>{const x=env();x.start();x.end();x.nativeClick();assert.deepEqual(x.calls,['shortcut-pointer-fallback']);assert.equal(x.prevented,1)});
t('genuine child-element pointerdown/up is accepted',()=>{const x=env();x.setHit('child');x.start({target:'child'});x.end({target:'child'});assert.equal(x.calls.length,1)});
t('a pointerup without any pointerdown never triggers fallback',()=>{const x=env();x.end();assert.equal(x.calls.length,0)});
t('down outside shortcut then release inside cannot resume',()=>{const x=env();x.start({x:180});x.end({x:60});assert.equal(x.calls.length,0)});
t('drag more than 14 px inside shortcut cannot resume',()=>{const x=env();x.start({x:40});x.end({x:90});x.nativeClick();assert.equal(x.calls.length,0)});
t('small finger motion within button is still a tap',()=>{const x=env();x.start({x:45,y:121});x.end({x:53,y:125});assert.equal(x.calls.length,1)});
t('pointerId mismatch is rejected',()=>{const x=env();x.start({id:11});x.end({id:12});assert.equal(x.calls.length,0)});
t('long press exceeding 1500ms is not interpreted as tap',()=>{const x=env();x.start();x.setTime(11501);x.end();x.nativeClick();assert.equal(x.calls.length,0)});
t('pointer cancel invalidates press',()=>{const x=env();x.start();x.cancel();x.end();assert.equal(x.calls.length,0)});
t('security lock appearing after pointerdown blocks resume',()=>{const x=env();x.start();x.setLocked(true);x.end();assert.equal(x.calls.length,0)});
t('session changing to readonly after pointerdown blocks resume',()=>{const x=env();x.start();x.setReadonly(true);x.end();assert.equal(x.calls.length,0)});
t('modal opened during press blocks return-to-case',()=>{const x=env();x.start();x.setModal(true);x.end();assert.equal(x.calls.length,0)});
t('overlay covering button by release blocks fallback',()=>{const x=env();x.start();x.setHit('overlay');x.end();assert.equal(x.calls.length,0)});
t('secondary mouse button is ignored',()=>{const x=env();x.start({button:2});x.end({button:2});assert.equal(x.calls.length,0)});
t('non-primary touch pointer is ignored',()=>{const x=env();x.start({primary:false});x.end({primary:false});assert.equal(x.calls.length,0)});
t('native keyboard activation continues to work',()=>{const x=env();x.nativeClick({detail:0});assert.deepEqual(x.calls,['shortcut-click'])});
t('keyboard click remains usable after a rejected drag',()=>{const x=env();x.start({x:30});x.end({x:100});x.nativeClick({detail:0});assert.deepEqual(x.calls,['shortcut-click'])});
t('subsequent valid press works after rejected drag',()=>{const x=env();x.start({x:30});x.end({x:100});x.start();x.end();assert.deepEqual(x.calls,['shortcut-pointer-fallback'])});
t('when target is not topmost at press start, pointer is not armed',()=>{const x=env();x.setHit('overlay');x.start();x.setHit('button');x.end();assert.equal(x.calls.length,0)});
t('normal native click path works without pointer support',()=>{const x=env();x.nativeClick({detail:1});assert.deepEqual(x.calls,['shortcut-click'])});
t('pointerup suppression does not cancel browser event when press is invalid',()=>{const x=env();x.end();assert.equal(x.prevented,0);assert.equal(x.stopped,0)});
t('valid noncancelable event does not call preventDefault',()=>{const x=env();x.start();x.end({cancelable:false});assert.equal(x.prevented,0);assert.equal(x.calls.length,1)});
t('clinical storage/dose calculation is absent from UX patch',()=>{assert(!section.includes('CURRENT_KEY'));assert(!section.includes('drugAdministrations'));assert(!section.includes('localStorage.setItem'));});
const passed=results.filter(x=>x.pass).length;
console.log(JSON.stringify({suite:'R07-shortcut-tap-origin',passed,total:results.length},null,2));
if(passed!==results.length)process.exitCode=1;
