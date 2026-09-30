const fs=require('fs');const vm=require('vm');const assert=require('assert');
const src=fs.readFileSync(__dirname+'/session-controller.js','utf8');
function env({initial='active',freshLock=false,throwInit=false}={}){
  const listeners={};
  const cls=new Set();
  const elements={};
  function el(id){return elements[id]||(elements[id]={id,hidden:true,textContent:'',open:false,addEventListener(){},close(){this.open=false},showModal(){this.open=true}})}
  const document={
    body:{classList:{toggle(c,on){on?cls.add(c):cls.delete(c)},contains:c=>cls.has(c)}},
    addEventListener(type,fn,capture){(listeners[type]??=[]).push(fn)},
  };
  const root={document,addEventListener(){},setInterval(){return 1},clearInterval(){},console};
  root.ANESVET_APP_SHELL={$:id=>el(id)};
  let mode='initializing';const lock=freshLock?{tabId:'other',heartbeatAt:Date.now(),patientName:'X'}:null;
  root.ANESVET_SESSION_COORDINATION={create:({onMode})=>({
    init(){if(throwInit)throw new Error('boom');mode=initial;onMode(initial,'',lock);return initial},
    readLock(){return lock},isFresh(){return freshLock},writeLock(){return true},release(){},
    setMode(next,reason=''){mode=next;onMode(next,reason,lock);return next},
    takeControl(reason=''){mode='active';onMode('active',reason,lock);return 'active'},
    refresh(){return {mode,lock}},
  })};
  const sandbox={globalThis:root,module:{exports:{}},exports:{},console,setInterval:root.setInterval,clearInterval:root.clearInterval,document};
  vm.createContext(sandbox);vm.runInContext(src,sandbox);
  const factory=root.ANESVET_SESSION_CONTROLLER||sandbox.module.exports;
  const c=factory.create({});
  function fire(type,target){const e={type,target,cancelable:true,prevented:false,stopped:false,preventDefault(){this.prevented=true},stopImmediatePropagation(){this.stopped=true}};(listeners[type]||[]).forEach(fn=>fn(e));return e}
  return {c,fire,document,cls,el};
}
function target(kind='button') {const action={closest(sel){if(sel.includes('button')||sel.includes('input')||sel.includes('select')||sel.includes('textarea')||sel.includes('label'))return action;if(sel==='.tabpage')return {};return null}};return action}
let pass=0;function t(name,fn){try{fn();console.log('PASS',name);pass++}catch(e){console.error('FAIL',name,e);process.exitCode=1}}

t('INITIALIZING does not act as global click shield',()=>{const x=env();x.c.bind();const e=x.fire('click',target());assert.equal(e.prevented,false);assert.equal(e.stopped,false);assert.equal(x.document.body.classList.contains('session-readonly'),false)});
t('init with no competing lock becomes ACTIVE and is idempotent',()=>{const x=env({initial:'active'});assert.equal(x.c.init(),'active');assert.equal(x.c.init(),'active');x.c.bind();const e=x.fire('click',target());assert.equal(e.prevented,false);assert.equal(x.c.isActive(),true)});
t('explicit VIEW mode blocks action click',()=>{const x=env({initial:'view',freshLock:true});assert.equal(x.c.init(),'view');x.c.bind();const e=x.fire('click',target());assert.equal(e.prevented,true);assert.equal(e.stopped,true);assert.equal(x.document.body.classList.contains('session-readonly'),true)});
t('explicit VIEW blocks beforeinput rather than relying on non-cancelable input event',()=>{const x=env({initial:'view',freshLock:true});x.c.init();x.c.bind();const e=x.fire('beforeinput',target('input'));assert.equal(e.prevented,true);assert.equal(e.stopped,true)});
t('failed init without a fresh competing lock recovers ACTIVE instead of freezing',()=>{const x=env({throwInit:true,freshLock:false});assert.equal(x.c.init(),'active');x.c.bind();const e=x.fire('click',target());assert.equal(e.prevented,false);assert.equal(x.c.isActive(),true)});
t('failed init with fresh competing lock fails explicitly to VIEW mode',()=>{const x=env({throwInit:true,freshLock:true});assert.equal(x.c.init(),'view');x.c.bind();const e=x.fire('click',target());assert.equal(e.prevented,true);assert.equal(x.c.isViewOnly(),true)});
if(!process.exitCode)console.log(`RESULT ${pass}/6 PASS`);
