'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const results=[];
async function test(name,fn){try{await fn();results.push({name,pass:true});console.log('PASS',name)}catch(e){results.push({name,pass:false,error:e.message});console.log('FAIL',name,e.message)}}
function harness({prepare=async()=>({ok:true}),controlled=true}={}){
  const elements=Object.fromEntries(['updateBanner','updateBannerTitle','updateBannerText','updateNowBtn','updateLaterBtn'].map(id=>[id,{hidden:true,disabled:false,textContent:'',addEventListener(){}}]));
  let reloads=0,started=0,posts=0;const events={},toasts=[];
  const reg={waiting:{postMessage(){posts++}},addEventListener(){},async update(){}};
  const sw={controller:controlled?{}:null,addEventListener(name,fn){events[name]=fn},async register(){return reg}};
  const context={navigator:{serviceWorker:sw},ANESVET_APP_SHELL:{$:id=>elements[id]},location:{reload(){reloads++}},addEventListener(){}};
  vm.runInNewContext(fs.readFileSync(path.join(__dirname,'pwa-controller.js'),'utf8'),context);
  const api=context.ANESVET_PWA_CONTROLLER.create({isReloadUnsafe:()=>true,prepareForUpdate:prepare,onReloadStarting(){started++},toast:s=>toasts.push(s)});
  return {api,reg,events,elements,toasts,sw,counts:()=>({reloads,started,posts}),async changed(){events.controllerchange();await new Promise(r=>setImmediate(r));}};
}
(async()=>{
  for(const [label,prepare] of [['false',async()=>false],['ok:false',async()=>({ok:false,reason:'checkpoint failed'})],['exception',async()=>{throw Error('storage blocked')}],['missing acknowledgement',async()=>undefined]]){
    await test('Controller change blocks reload on '+label,async()=>{const h=harness({prepare});await h.api.setupServiceWorkerUpdates();h.reg.waiting=null;await h.changed();assert.deepEqual(h.counts(),{reloads:0,started:0,posts:0});assert(!h.elements.updateBanner.hidden);assert(!h.elements.updateNowBtn.disabled);assert(h.toasts.length===1);});
    await test('Activation blocks worker promotion on '+label,async()=>{const h=harness({prepare});h.api.renderUpdateBanner(h.reg);assert.equal(await h.api.activateWaitingUpdate(),false);assert.deepEqual(h.counts(),{reloads:0,started:0,posts:0});});
  }
  await test('Successful update checkpoints before promotion and again before reload',async()=>{let checked=0;const h=harness({prepare:async()=>{checked++;return {ok:true}}});await h.api.setupServiceWorkerUpdates();assert(await h.api.activateWaitingUpdate());assert.equal(checked,1);assert.deepEqual(h.counts(),{reloads:0,started:0,posts:1});await h.changed();assert.equal(checked,2);assert.deepEqual(h.counts(),{reloads:1,started:1,posts:1});await h.changed();assert.equal(h.counts().reloads,1);});
  await test('Failure after promotion keeps page and retries without waiting worker',async()=>{let okay=false;const h=harness({prepare:async()=>({ok:okay})});await h.api.setupServiceWorkerUpdates();h.reg.waiting=null;await h.changed();assert.equal(h.counts().reloads,0);okay=true;assert(await h.api.activateWaitingUpdate());assert.equal(h.counts().reloads,1);});
  await test('Concurrent controller events and taps cannot start duplicate reloads',async()=>{let resolve;const h=harness({prepare:()=>new Promise(r=>resolve=r)});await h.api.setupServiceWorkerUpdates();h.reg.waiting=null;h.events.controllerchange();h.events.controllerchange();assert.equal(await h.api.activateWaitingUpdate(),false);resolve({ok:true});await new Promise(r=>setImmediate(r));assert.equal(h.counts().reloads,1);});
  await test('First installation claims without reloading or checkpointing',async()=>{let checks=0;const h=harness({controlled:false,prepare:async()=>{checks++;return {ok:true}}});await h.api.setupServiceWorkerUpdates();h.sw.controller={};await h.changed();assert.equal(checks,0);assert.equal(h.counts().reloads,0);});
  await test('Worker installation precaches without skipWaiting; explicit message promotes',async()=>{const events={};let skipped=0,cached=0,promise;const sw={addEventListener:(n,f)=>events[n]=f,skipWaiting:()=>{skipped++},clients:{claim(){}}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'service-worker.js'),'utf8'),{self:sw,caches:{open:async()=>({addAll:async assets=>{cached=assets.length}})},URL});events.install({waitUntil:p=>promise=p});await promise;assert(cached>100);assert.equal(skipped,0);events.message({data:{type:'SKIP_WAITING'}});assert.equal(skipped,1);});
  const report={version:'17.5.1',passed:results.filter(x=>x.pass).length,total:results.length,tests:results};fs.writeFileSync(path.join(__dirname,'QA_V17_5_1_PWA_RESULTS.json'),JSON.stringify(report,null,2));if(report.passed!==report.total)process.exitCode=1;
})();
