const assert=require('assert');
const path=require('path');
class MemStore{constructor(){this.m=new Map()}getItem(k){return this.m.has(k)?this.m.get(k):null}setItem(k,v){this.m.set(k,String(v))}removeItem(k){this.m.delete(k)}}
function fakeClassList(){const s=new Set();return{toggle:(c,on)=>{if(on)s.add(c);else s.delete(c)},add:c=>s.add(c),remove:c=>s.delete(c),contains:c=>s.has(c)}}
function el(){return{hidden:true,disabled:false,textContent:'',classList:fakeClassList(),addEventListener(type,fn){this['on'+type]=fn},closest(){return null},showModal(){this.open=true},close(){this.open=false},open:false}}
(async()=>{
 const tests=[];const test=async(name,fn)=>{try{await fn();tests.push({name,pass:true})}catch(e){tests.push({name,pass:false,error:e.stack||String(e)})}};
 global.window=global;global.localStorage=new MemStore();global.sessionStorage=new MemStore();global.document={body:{classList:fakeClassList()},addEventListener(){},getElementById(){return null}};global.addEventListener=()=>{};
 global.ANESVET_APP_SHELL={$:()=>null};
 require('./session-coordination.js');require('./session-controller.js');
 await test('stale view-only lock is reclaimed without clearing case data',async()=>{
   const foreign={tabId:'old-tab',heartbeatAt:Date.now(),caseId:'case-1',patientName:'A'};localStorage.setItem('lock',JSON.stringify(foreign));
   const c=global.ANESVET_SESSION_CONTROLLER.create({lockKey:'lock',tabKey:'tab',ttlMs:30000,heartbeatMs:5000,getCaseInfo:()=>({caseId:'case-1',patientName:'A'})});
   assert.equal(c.init(),'view');
   foreign.heartbeatAt=Date.now()-60000;localStorage.setItem('lock',JSON.stringify(foreign));
   assert.equal(c.recoverOrphanedSession(false),true);assert.equal(c.isActive(),true);assert.equal(JSON.parse(localStorage.getItem('lock')).caseId,'case-1');
 });
 // fresh isolated globals for PWA controller
 delete require.cache[require.resolve('./pwa-controller.js')];
 const els={updateBanner:el(),updateBannerTitle:el(),updateBannerText:el(),updateNowBtn:el(),updateLaterBtn:el(),installBtn:el()};
 global.ANESVET_APP_SHELL={$:id=>els[id]||null};global.navigator={};global.location={reload(){}};global.addEventListener=()=>{};
 require('./pwa-controller.js');
 await test('active case update remains actionable and prepares checkpoint before activation',async()=>{
   let prepared=0,msg=null,reloadStarted=0;
   const p=global.ANESVET_PWA_CONTROLLER.create({isReloadUnsafe:()=>true,prepareForUpdate:async()=>{prepared++;return{ok:true}},onReloadStarting:()=>reloadStarted++,toast:()=>{}});
   const reg={waiting:{postMessage:m=>{msg=m}}};p.renderUpdateBanner(reg);p.bind();
   assert.equal(els.updateNowBtn.disabled,false);assert.equal(els.updateNowBtn.textContent,'Save case & update');
   await els.updateNowBtn.onclick();assert.equal(prepared,1);assert.deepEqual(msg,{type:'SKIP_WAITING'});assert.equal(reloadStarted,1);
 });
 await test('failed checkpoint prevents service-worker activation',async()=>{
   let msg=null;
   const p=global.ANESVET_PWA_CONTROLLER.create({isReloadUnsafe:()=>true,prepareForUpdate:async()=>({ok:false,reason:'verify failed'}),toast:()=>{}});
   const reg={waiting:{postMessage:m=>{msg=m}}};p.renderUpdateBanner(reg);p.bind();await els.updateNowBtn.onclick();assert.equal(msg,null);
 });
 const out={version:'17.2.2',suite:'mobile-active-case-rescue',passed:tests.filter(x=>x.pass).length,total:tests.length,tests};process.stdout.write(JSON.stringify(out,null,2));process.exit(out.passed===out.total?0:1);
})();
