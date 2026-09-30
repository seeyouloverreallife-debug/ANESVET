/* R05: Isolated navigation transition and diagnostic regression without clinical payloads. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const navCode=app.slice(app.indexOf('function setTab(id,opts={}){'),app.indexOf("$$('.tab[data-tab]').forEach"));
const sentinel=html.match(/<script id="anesvetBootSentinel">([\s\S]*?)<\/script>/)?.[1];
const cases=[];
function test(name,fn){try{fn();cases.push({name,pass:true});console.log('PASS',name)}catch(e){cases.push({name,pass:false,error:e.message});console.error('FAIL',name,e.stack)}}
class E{
 constructor(id,classes=[]){this.id=id;this.classes=new Set(classes);this.dataset={tab:id};}
 get classList(){return {contains:x=>this.classes.has(x),toggle:(x,v)=>{if(v===undefined)v=!this.classes.has(x);v?this.classes.add(x):this.classes.delete(x)},add:x=>this.classes.add(x)}}
}
function pageEnv({storageFails=false,readinessAllowed=true,recoveryAllowed=true,recoveryLocksOr=false,renderFails=false}={}){
 const names=['patient','preop','drugs','orlive','recovery','endcase','settings','casesummary','cases'];
 const pages=names.map(id=>new E(id,['tabpage',...(id==='patient'?['active']:[])]));
 const tabs=names.map(id=>new E(id, id==='patient'?['tab','active']:['tab']));
 const elements=new Map(pages.map(x=>[x.id,x]));const nav=[],toasts=[];let scrolls=0;
 const noop=()=>{};
 const ctx={document:{getElementById:id=>elements.get(id)||null,body:{classList:{toggle:noop}}},
   $$:s=>s==='.tab'?tabs:s==='.tabpage'?pages:[],
   BOOT:{nav:(status,target,reason)=>nav.push({status,target,reason}),mark:(status)=>nav.push({status})},
   toast:m=>toasts.push(m),state:{caseStartedAt:0},
   orLiveLockedByRecovery:()=>recoveryLocksOr,requestOrLiveAccess:()=>readinessAllowed,
   recoveryAccessAllowed:()=>recoveryAllowed,renderWorkflowLocks:noop,
   closeTransientNavigationDialogs:noop,recoverInvisibleModalBlockers:noop,exitOrFullscreenForNavigation:noop,
   closeMoreMenu:noop,closeRecoveryMoreDialog:noop,
   currentSettingsObject:()=>({orFocusMode:true}),
   localStorage:{setItem:()=>{if(storageFails)throw new Error('SecurityError: localStorage denied')}},TAB_KEY:'anesvet_v14_3_tab',
   renderTrends:noop,renderProcedureTimeline:noop,renderArchives:noop,renderBackupHealth:noop,
   renderCaseSummary:()=>{if(renderFails)throw new Error('simulated summary renderer failure')},
   renderOrLive:noop,renderAirwayPanel:noop,updateDoseSpotlights:noop,syncQuickConcentrations:noop,renderCaseDrugPlan:noop,
   renderRecovery:noop,renderRecoveryRecords:noop,updateRecoveryDue:noop,renderEndCase:noop,renderAlertProtocolStatus:noop,
   renderDrugLibrarySettings:noop,renderQuickPresetSettings:noop,renderBreedAliasSettings:noop,
   renderProtocolGovernance:noop,renderProtocolDoseReview:noop,
   renderMobileQuickBar:noop,scrollAppTop:()=>scrolls++,setTimeout:noop};
 vm.createContext(ctx);vm.runInContext(navCode+'\nthis.switchTab=setTab;',ctx);
 return {...ctx,pages,tabs,nav,toasts,get scrolls(){return scrolls}};
}
test('R05: normal navigation selects one visible page and records rendered',()=>{
 const x=pageEnv();x.switchTab('preop');assert.equal(x.pages.filter(p=>p.classes.has('active')).map(x=>x.id).join(','),'preop');assert.equal(x.nav.at(-1).status,'rendered');assert.equal(x.scrolls,1);
});
test('R05: storage failure cannot abort route or subsequent UI render',()=>{
 const x=pageEnv({storageFails:true});x.switchTab('drugs');assert(x.pages.find(p=>p.id==='drugs').classes.has('active'));assert.equal(x.nav.at(-1).status,'rendered');assert(x.nav.some(x=>x.status==='navigation-tab-preference-unavailable'));assert.equal(x.scrolls,1);
});
test('R05: unknown or non-page IDs never clear active pages',()=>{
 const x=pageEnv();x.switchTab('fake-dialog');assert(x.pages.find(p=>p.id==='patient').classes.has('active'));assert.equal(x.nav.at(-1).status,'invalid-target');
});
test('R05: OR LIVE readiness gate remains enforced',()=>{
 const x=pageEnv({readinessAllowed:false});x.switchTab('orlive');assert(x.pages.find(p=>p.id==='patient').classes.has('active'));assert.equal(x.nav.at(-1).status,'blocked-readiness');
});
test('R05: Recovery gate remains enforced',()=>{
 const x=pageEnv({recoveryAllowed:false});x.switchTab('recovery');assert(x.pages.find(p=>p.id==='patient').classes.has('active'));assert.equal(x.nav.at(-1).status,'blocked-recovery');assert(x.toasts.length>0);
});
test('R05: recovery lock on OR LIVE is never bypassed',()=>{
 const x=pageEnv({recoveryLocksOr:true});x.switchTab('orlive');assert.equal(x.nav.at(-1).status,'blocked-recovery');
});
test('R05: forced clinical resume still selects page, with no new safety bypass',()=>{
 const x=pageEnv({readinessAllowed:false});x.switchTab('orlive',{force:true});assert(x.pages.find(p=>p.id==='orlive').classes.has('active'));assert.equal(x.nav.at(-1).status,'rendered');
});
test('R05: render failure is traced and rethrown, never falsely marked successful',()=>{
 const x=pageEnv({renderFails:true});assert.throws(()=>x.switchTab('casesummary'),/simulated summary/);assert.equal(x.nav.at(-1).status,'render-error');assert(!x.nav.some(n=>n.status==='rendered'));
});
test('R05: active case storage schema and keys remain unchanged',()=>{
 assert(app.includes("const CURRENT_KEY = 'anesvet_v14_3_current'"));assert(app.includes("const TAB_KEY = 'anesvet_v14_3_tab'"));assert(!navCode.includes('state.casePhase='));assert(!navCode.includes('state.records='));
});
test('R05: inline navigation sentinel exposes routing outcomes in diagnostics',()=>{
 assert(sentinel?.includes('function noteNavigationClick(e)'));assert(sentinel.includes('CLICK_WITHOUT_ROUTE'));assert(sentinel.includes('lastNavigation'));assert(sentinel.includes('nav:noteNavigation'));assert(sentinel.includes('navigation: ${s.lastNavigation?JSON.stringify(s.lastNavigation)'));
});
test('R05: navigator accepts only bounded status and route strings',()=>{
 assert(sentinel.includes("if(!allowed.includes(status))return"));assert(sentinel.includes('safeTarget'));
});
test('R05: app, manifest, cache, script and stylesheet versions are consistent',()=>{
 const sw=fs.readFileSync(__dirname+'/service-worker.js','utf8'),manifest=JSON.parse(fs.readFileSync(__dirname+'/manifest.webmanifest','utf8'));
 assert(html.includes('<title>ANESVET V17.2.9</title>'));assert(app.includes("const APP_VERSION='17.2.9'"));
 assert(sw.includes("const CACHE='anesvet-v17-2-9-r05-mobile-navigation'"));assert.equal(manifest.start_url,'./?v=17.2.9');
 assert(html.includes('./app.js?v=17.2.9'));assert(sw.includes('./app.js?v=17.2.9'));
});
const passed=cases.filter(t=>t.pass).length;
console.log(JSON.stringify({suite:'R05-mobile-navigation',passed,total:cases.length},null,2));
if(passed!==cases.length)process.exitCode=1;
