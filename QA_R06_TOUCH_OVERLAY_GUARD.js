/* R06 regression fixture updated in R07 to send a realistic pointerdown before pointerup. Original R06 test remains preserved in the R06 archive. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/usability-hardening.js','utf8');
const css=fs.readFileSync(__dirname+'/usability-hardening.css','utf8');
const begin=src.indexOf('  let lastResumePointerAt=0;');
const end=src.indexOf('  function updateReturnShortcut(');
const pointerLine=src.split('\n').find(l=>l.includes("document.addEventListener('pointerup'"));
const downLine=src.split('\n').find(l=>l.includes("document.addEventListener('pointerdown',rememberShortcutPress"));
assert(begin>=0&&end>begin&&pointerLine&&downLine);
const tested=src.slice(begin,end)+'\n'+downLine+'\n'+pointerLine+'\nthis.isEligible=returnShortcutPointerEligible;this.create=ensureReturnShortcut;';
const cases=[];
function t(name,fn){try{fn();cases.push({name,pass:true});console.log('PASS',name)}catch(e){cases.push({name,pass:false,error:e.message});console.error('FAIL',name,e.stack)}}
function env({modal=false,security=false,readOnly=false,securityClass=false,inert=false,hidden=false,hit='button',target='button',coords=true,secondary=false,primary=true}={}){
 let button=null,clickHandler=null,pointerHandler=null,downHandler=null,hitTarget=null,now=10000,stopped=0,prevented=0;
 const calls=[];
 const overlay={id:'otherSurface'};
 const child={id:'child'};
 const buttonFactory=()=>({id:'uxReturnCase',hidden:false,inert:false,closest:()=>inert?{}:null,contains:x=>x===child,
  getBoundingClientRect:()=>({left:20,right:100,top:100,bottom:160}),dataset:{},setAttribute(){},
  addEventListener(type,fn){if(type==='click')clickHandler=fn;}});
 const body={classList:{contains:s=>s==='session-readonly'?readOnly:s==='security-locked'?securityClass:false},appendChild(btn){button=btn;}};
 const document={body,getElementById(id){if(id==='uxReturnCase')return button;if(id==='securityLockOverlay')return{hidden:!security};return null},
  createElement(){return buttonFactory()},
  querySelector(s){if(s==='dialog[open]'&&modal)return{id:'modal'};return null},
  elementFromPoint(){return hit==='button'?button:hit==='child'?child:hit==='overlay'?overlay:null},
  addEventListener(type,fn){if(type==='pointerup')pointerHandler=fn; if(type==='pointerdown')downHandler=fn;}};
 const ctx={document,$:document.getElementById.bind(document),api:()=>({resumeActiveCase:args=>{calls.push(args.source);return true}}),
  lastResumePointerAt:0,Date:{now:()=>now}};
 vm.createContext(ctx);vm.runInContext(tested,ctx);ctx.create();
 button.hidden=hidden;button.inert=inert;
 const fire=(kind='pointerup',overrides={})=>{
  const ev={clientX:coords?50:180,clientY:coords?115:190,isPrimary:primary,button:secondary?2:0,
  target:target==='button'?button:target==='child'?child:overlay,
  cancelable:true,preventDefault(){prevented++},stopImmediatePropagation(){stopped++},stopPropagation(){stopped++},...overrides};
  if(kind==='pointerup'){downHandler(ev);pointerHandler(ev);}else if(kind==='click')clickHandler?.(ev);
  return ev;
 };
 return {ctx,button,calls,fire,overlay,get prevented(){return prevented},get stopped(){return stopped},setNow:v=>{now=v}};
}
t('tap on actual topmost return shortcut works exactly once',()=>{const x=env();x.fire();x.fire('click');assert.deepEqual(x.calls,['shortcut-pointer-fallback']);assert.equal(x.prevented,1);assert.equal(x.stopped,1)});
t('child within button is accepted when also the hit-tested topmost target',()=>{const x=env({hit:'child',target:'child'});x.fire();assert.equal(x.calls.length,1)});
t('overlay tap on identical coordinates never triggers resume and is not cancelled',()=>{const x=env({hit:'overlay',target:'overlay'});x.fire();assert.equal(x.calls.length,0);assert.equal(x.prevented,0);assert.equal(x.stopped,0)});
t('synthetic/retargeted button pointer hidden by visible overlay is blocked',()=>{const x=env({hit:'overlay',target:'button'});x.fire();assert.equal(x.calls.length,0)});
t('overlay target even if hit test yields button is blocked',()=>{const x=env({hit:'button',target:'overlay'});x.fire();assert.equal(x.calls.length,0)});
t('native open dialog blocks click and coordinate fallback',()=>{const x=env({modal:true});x.fire();x.fire('click');assert.equal(x.calls.length,0)});
t('security lock overlay blocks pointer and click routes',()=>{const x=env({security:true});x.fire();x.fire('click');assert.equal(x.calls.length,0)});
t('security-locked body blocks fallback and click',()=>{const x=env({securityClass:true});x.fire();x.fire('click');assert.equal(x.calls.length,0)});
t('view-only session blocks forced resume shortcut routes',()=>{const x=env({readOnly:true});x.fire();x.fire('click');assert.equal(x.calls.length,0)});
t('inert or hidden button never triggers a route',()=>{for(const o of [{inert:true},{hidden:true}]){const x=env(o);x.fire();x.fire('click');assert.equal(x.calls.length,0)}});
t('primary pointer only: ignore secondary button and non-primary touch',()=>{for(const o of [{secondary:true},{primary:false}]){const x=env(o);x.fire();assert.equal(x.calls.length,0)}});
t('outside button bounding rect never resumes even with button event target',()=>{const x=env({coords:false});x.fire();assert.equal(x.calls.length,0)});
t('missing elementFromPoint cannot authorize global pointer fallback',()=>{const x=env({hit:'missing'});x.fire();assert.equal(x.calls.length,0);x.fire('click');assert.equal(x.calls.length,1)});
t('normal keyboard/native click still works without preceding pointerup',()=>{const x=env();x.fire('click',{clientX:0,clientY:0});assert.deepEqual(x.calls,['shortcut-click'])});
t('non-cancelable valid pointerup does not invoke preventDefault',()=>{const x=env();x.fire('pointerup',{cancelable:false});assert.equal(x.prevented,0);assert.equal(x.calls.length,1)});
t('shortcut layer stays above mobile dock but below mandatory lock screen',()=>{const a=css.match(/\.ux-return-case\{[^}]*z-index:(\d+)/),securityCss=fs.readFileSync(__dirname+'/security-baseline.css','utf8'),b=securityCss.match(/\.security-lock-overlay\{[^}]*z-index:(\d+)/);assert(a&&b);assert(Number(a[1])>85);assert(Number(a[1])<Number(b[1]));});
t('R06 only UX shim changed: critical clinical code is not in shortcut module',()=>{assert(!tested.includes('CURRENT_KEY'));assert(!tested.includes('drugAdministrations'));assert(!tested.includes('localStorage.setItem'));});
const passed=cases.filter(x=>x.pass).length;
console.log(JSON.stringify({suite:'R06-touch-overlay-guard',passed,total:cases.length},null,2));
if(passed!==cases.length)process.exitCode=1;
