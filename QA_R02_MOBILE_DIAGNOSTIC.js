/* R02 targeted QA: the boot sentinel must remain safe and useful before app.js finishes. */
'use strict';
const fs=require('fs'),assert=require('assert'),vm=require('vm');
const index=fs.readFileSync(__dirname+'/index.html','utf8');
const source=index.match(/<script id="anesvetBootSentinel">([\s\S]*?)<\/script>/)?.[1];
assert(source,'inline sentinel exists');new vm.Script(source);
const tests=[];
function t(name,fn){try{fn();tests.push({name,pass:true});console.log('PASS',name)}catch(err){tests.push({name,pass:false,error:err.stack});console.error('FAIL',name,err);process.exitCode=1}}
function env({readOnly=false,hasModal=false,overlay=false,lock=false}={}){
  const documentListeners={},windowListeners={},pending=[],storage=new Map();
  if(lock)storage.set('anesvet_v14_3_active_session',JSON.stringify({tabId:'separate-tab',heartbeatAt:Date.now(),patientName:'DO NOT EXPOSE THIS'}));
  const storageObj={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,String(v))};
  class E{
    constructor(id=''){this.id=id;this.dataset={};this.listeners={};this.hidden=true;this.className='';this.tagName='BUTTON';this.textContent='';this.style={};this.open=false;}
    addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
    fire(type,args={}){for(const fn of (this.listeners[type]||[]))fn({target:this,currentTarget:this,stopPropagation(){},...args})}
    setAttribute(){}
    querySelector(id){return get(id.slice(1))}
    closest(selector){return selector==='.asa-card'?null:null}
    getBoundingClientRect(){return{left:20,right:100,top:100,bottom:150,width:80,height:50}}
  }
  const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new E(id));return els.get(id)};
  const body=new E('body');body.className=readOnly?'session-readonly':'';
  body.classList={contains:s=>readOnly&&s==='session-readonly'};body.children=[];
  body.appendChild=e=>{body.children.push(e);els.set(e.id,e)};
  const asa=new E('asa');asa.value='';els.set('asa',asa);
  const card=new E('');card.dataset.asa='II';card.className='asa-card';
  card.getBoundingClientRect=()=>({left:20,right:100,top:100,bottom:150,width:80,height:50});
  card.closest=s=>s==='.asa-card'?card:null;
  const cover=new E('cover');cover.id='overlay';cover.tagName='DIV';cover.closest=()=>null;
  const dialog=new E('modal');dialog.open=hasModal;
  get('sessionBanner').hidden=!readOnly;
  const document={body,visibilityState:'visible',
    getElementById:id=>get(id),
    createElement:()=>new E(),
    addEventListener:(type,fn)=>{(documentListeners[type]??=[]).push(fn)},
    querySelectorAll:sel=>sel==='.asa-card'?[card]:sel==='dialog[open]'?(hasModal?[dialog]:[]):[],
    querySelector:sel=>sel==='.asa-card.selected'?(asa.value==='II'?card:null):null,
    elementFromPoint:()=>overlay?cover:card,
  };
  const window={addEventListener:(type,fn)=>{(windowListeners[type]??=[]).push(fn)}};
  const context={window,document,navigator:{userAgent:'test-browser',clipboard:{writeText:async()=>{}}},location:{href:'https://example.test/'},
    localStorage:storageObj,sessionStorage:{getItem:()=>lock?'this-tab':null},
    setTimeout:(fn,ms)=>{pending.push({fn,ms})},getComputedStyle:()=>({pointerEvents:readOnly?'none':'auto'}),
    Date,console,Error,JSON,Object,Number,String,Math};
  vm.createContext(context);vm.runInContext(source,context);
  const boot=window.ANESVET_BOOT_DIAGNOSTIC;
  const fire=(type,target,x=45,y=125)=>{const e={target:target||card,clientX:x,clientY:y};for(const fn of documentListeners[type]||[])fn(e)};
  const tick=ms=>{for(const item of pending.filter(x=>x.ms===ms))item.fn()};
  return {boot,get,body,asa,card,cover,fire,tick,pending,storage};
}
t('sentinel boot watchdog exposes a user-visible panel before any controller binding',()=>{const x=env();x.tick(3500);assert.equal(x.get('anesvetBootDiagnosticPanel').dataset.reason,'boot timeout')});
t('R02: partial startup stall is displayed instead of logged silently',()=>{const x=env();x.boot.mark('patient-master-bound');x.tick(8000);assert.equal(x.get('anesvetBootDiagnosticPanel').dataset.reason,'startup incomplete');assert(x.boot.text().includes('STARTUP_INCOMPLETE'))});
t('R02: a completed startup does not display a stall',()=>{const x=env();x.boot.mark('patient-master-bound');x.boot.ready();x.tick(3500);x.tick(8000);assert.equal(x.body.children.length,0)});
t('R02: delayed successful startup closes only the transient startup warning',()=>{const x=env();x.boot.mark('patient-master-bound');x.tick(8000);const p=x.get('anesvetBootDiagnosticPanel');assert.equal(p.hidden,false);x.boot.ready();assert.equal(p.hidden,true)});
t('R02: diagnostics may be opened manually even if app.js never binds',()=>{const x=env();x.get('bootDiagnosticBtn').fire('click');assert.equal(x.get('anesvetBootDiagnosticPanel').dataset.reason,'manual diagnostic')});
t('R02: view-only lock is diagnosed without exposing patient identity or lock token',()=>{const x=env({readOnly:true,lock:true});x.boot.mark('patient-master-bound');x.fire('pointerdown',x.card);x.tick(450);const text=x.boot.text();assert(text.includes('VIEW_ONLY:'));assert(text.includes('"readOnly":true'));assert(!text.includes('DO NOT EXPOSE THIS'));assert(!text.includes('separate-tab'))});
t('R02: overlay intercepting ASA tap is differentiated from unbound handler',()=>{const x=env({overlay:true});x.boot.mark('patient-master-bound');x.boot.ready();x.fire('pointerdown',x.cover);x.tick(450);assert.equal(x.boot.snapshot().lastAsaProbe.status,'NOT_HANDLED');assert.equal(x.boot.snapshot().lastAsaProbe.hitIsCard,false);assert(x.boot.text().includes('HIT_TEST_MISMATCH'))});
t('R02: ASA tap handled by controller does not raise false error',()=>{const x=env();x.boot.mark('patient-master-bound');x.boot.ready();x.fire('pointerdown',x.card);x.asa.value='II';x.tick(450);assert.equal(x.boot.snapshot().lastAsaProbe.status,'handled');assert.equal(x.body.children.length,0)});
t('R02: open modal is listed as a possible click blocker',()=>{const x=env({hasModal:true});x.boot.mark('patient-master-bound');x.boot.ready();x.fire('pointerdown',x.card);x.tick(450);assert(x.boot.text().includes('OPEN_DIALOG'))});
t('R02 version, URLs, app version and service worker cache are consistent',()=>{
 const app=fs.readFileSync(__dirname+'/app.js','utf8'),sw=fs.readFileSync(__dirname+'/service-worker.js','utf8'),manifest=JSON.parse(fs.readFileSync(__dirname+'/manifest.webmanifest','utf8'));
 assert(index.includes('<title>ANESVET V17.2.6</title>'));assert(app.includes("const APP_VERSION='17.2.6'"));assert(sw.includes("const CACHE='anesvet-v17-2-6-r02-mobile-diagnostic'"));
 assert(index.includes('./app.js?v=17.2.6'));assert(sw.includes('./app.js?v=17.2.6'));assert.equal(manifest.start_url,'./?v=17.2.6');
 assert(!index.includes('v=17.2.5'));assert(!sw.includes('v=17.2.5'));
});
console.log(JSON.stringify({suite:'R02-mobile-boot-diagnostic',passed:tests.filter(t=>t.pass).length,total:tests.length,tests:tests.map(({name,pass})=>({name,pass}))},null,2));
if(tests.some(x=>!x.pass))process.exitCode=1;
