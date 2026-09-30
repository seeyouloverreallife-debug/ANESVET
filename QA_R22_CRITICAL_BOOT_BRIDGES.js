/* R22: contract tests for verified Android startup ReferenceErrors, controllers AND app.js. */
'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=__dirname,app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const recoveryModule=require(path.join(root,'recovery-controller.js'));
const orModule=require(path.join(root,'or-live-controller.js'));
let count=0;
function test(name,cb){try{cb();count++;console.log('PASS',name)}catch(e){console.error('FAIL',name,e.stack);process.exitCode=1}}
function dialog(id='test'){
  return {id,open:true,closed:0,removed:0,close(){this.closed++;this.open=false},removeAttribute(name){if(name==='open'){this.removed++;this.open=false}}};
}
const docs=new Map(),get=id=>docs.get(id)||null, state={recoveryTransfers:[]};
global.document={addEventListener(){},querySelector(){return null},querySelectorAll(){return []}};
const recovery=recoveryModule.create({$ : get,$$:()=>[],getState:()=>state,recoveryDomain:{},recoveryOrchestration:{}});
const or=orModule.create({$:get,$$:()=>[],getState:()=>state,workflow:{},procedureTemplates:{}});
test('both controllers are constructed with their existing DI inputs',()=>assert(recovery&&or));
test('Recovery close dialog is exported',()=>assert.equal(typeof recovery.closeMoreDialog,'function'));
test('OR close dialog is exported',()=>assert.equal(typeof or.closeOrMoreDialog,'function'));
test('Recovery latest handoff lookup is exported',()=>assert.equal(typeof recovery.transferLatest,'function'));
test('Recovery close closes an open native dialog',()=>{const d=dialog('recoveryMoreDialog');docs.set(d.id,d);recovery.closeMoreDialog();assert.equal(d.open,false);assert.equal(d.closed,1)});
test('Recovery close is safe if dialog is absent',()=>{docs.delete('recoveryMoreDialog');assert.doesNotThrow(()=>recovery.closeMoreDialog())});
test('Recovery close retains fallback when native close throws',()=>{const d=dialog('recoveryMoreDialog');d.close=()=>{throw Error('native close failed')};docs.set(d.id,d);recovery.closeMoreDialog();assert.equal(d.removed,1)});
test('OR close closes its own dialog without touching Recovery',()=>{const r=dialog('recoveryMoreDialog'),d=dialog('orMoreDialog');docs.set(r.id,r);docs.set(d.id,d);or.closeOrMoreDialog();assert.equal(d.open,false);assert.equal(r.open,true)});
test('OR close retains fallback when native close throws',()=>{const d=dialog('orMoreDialog');d.close=()=>{throw Error('native close failed')};docs.set(d.id,d);or.closeOrMoreDialog();assert.equal(d.removed,1)});
test('Recovery handoff lookup returns null without documented transfer',()=>{state.recoveryTransfers=[];assert.equal(recovery.transferLatest(),null)});
test('Recovery handoff lookup returns latest documented transfer unchanged',()=>{const x={destination:'Ward',handoffTo:'Staff A'},y={destination:'ICU',handoffTo:'Staff B'};state.recoveryTransfers=[x,y];assert.strictEqual(recovery.transferLatest(),y)});
const snippets=[
 'function closeOrMoreDialog(){return OR_LIVE_CONTROLLER.closeOrMoreDialog()}',
 'function closeRecoveryMoreDialog(){return RECOVERY_CONTROLLER.closeMoreDialog()}',
 'function recoveryTransferLatest(){return RECOVERY_CONTROLLER.transferLatest()}'
];
test('all three controller bridges are explicitly declared in app.js',()=>snippets.forEach(x=>assert(app.includes(x),x)));
test('no global window patch, clinical state write or fabricated no-op in bridges',()=>snippets.forEach(x=>assert(!/window\.|\.push\(|localStorage|=>\s*\{\s*\}/.test(x))));
test('actual app.js bridges execute against real controller instances',()=>{
 const ctx={OR_LIVE_CONTROLLER:or,RECOVERY_CONTROLLER:recovery};
 vm.createContext(ctx);vm.runInContext(snippets.join('\n')+'\nthis.run=()=>{closeOrMoreDialog();closeRecoveryMoreDialog();return recoveryTransferLatest()};',ctx);
 docs.set('orMoreDialog',dialog('orMoreDialog'));docs.set('recoveryMoreDialog',dialog('recoveryMoreDialog'));
 assert.strictEqual(ctx.run(),state.recoveryTransfers.at(-1));assert.equal(get('orMoreDialog').open,false);assert.equal(get('recoveryMoreDialog').open,false);
});
test('navigation calls exported Recovery close method before route switch',()=>{
 const start=app.indexOf('function setTab(id,opts={}){'),end=app.indexOf("$$('.tab[data-tab]').forEach",start);assert(start>0&&end>start);
 assert(app.slice(start,end).includes('closeMoreMenu();closeRecoveryMoreDialog();'));
});
test('real setTab implementation completes patient->preop navigation with controller-owned close bridge',()=>{
 const a=app.indexOf('function setTab(id,opts={}){'),z=app.indexOf("$$('.tab[data-tab]').forEach",a);
 const mk=(id,isPage)=>{const classes=new Set([isPage?'tabpage':'tab',...(id==='patient'?['active']:[])]);return{id,dataset:{tab:id},classList:{contains:k=>classes.has(k),toggle:(k,v)=>v?classes.add(k):classes.delete(k)},classes}};
 const pages=['patient','preop','drugs','orlive','recovery'].map(id=>mk(id,true)),tabs=pages.map(x=>mk(x.id,false)),nav=[];
 const element=id=>pages.find(x=>x.id===id)||null,noop=()=>{};
 const env={RECOVERY_CONTROLLER:recovery,BOOT:{nav:(...args)=>nav.push(args)},
  document:{getElementById:element,body:{classList:{toggle:noop}}},$$:selector=>selector==='.tab'?tabs:selector==='.tabpage'?pages:[],
  state:{caseStartedAt:0},orLiveLockedByRecovery:()=>false,requestOrLiveAccess:()=>true,recoveryAccessAllowed:()=>true,
  toast:noop,renderWorkflowLocks:noop,scrollAppTop:noop,closeTransientNavigationDialogs:noop,recoverInvisibleModalBlockers:noop,exitOrFullscreenForNavigation:noop,
  closeMoreMenu:noop,currentSettingsObject:()=>({orFocusMode:true}),localStorage:{setItem:noop},TAB_KEY:'anesvet_v14_3_tab',renderMobileQuickBar:noop
 };
 vm.createContext(env);vm.runInContext(snippets[1]+'\n'+app.slice(a,z)+'\nthis.navigate=setTab;',env);
 const d=dialog('recoveryMoreDialog');docs.set(d.id,d);env.navigate('preop');
 assert(pages.find(x=>x.id==='preop').classes.has('active'));assert(!pages.find(x=>x.id==='patient').classes.has('active'));
 assert.equal(d.open,false);assert.equal(nav.at(-1)[0],'rendered');
});
test('forced active clinical resume also uses Recovery bridge' ,()=>{
 const start=app.indexOf('function forceActivateClinicalUI(id){'),end=app.indexOf('function forceActivateOrLiveUI()',start);
 assert(start>0&&end>start);assert(app.slice(start,end).includes('closeRecoveryMoreDialog()'));
});
test('Case Summary and handoff build use controller transfer getter',()=>{
 assert(app.includes('const transfer=recoveryTransferLatest()'));assert(app.includes('h.transfer=recoveryTransferLatest()?'));
});
test('Report Issue menus invoke controller-owned closers',()=>{
 assert(app.includes("()=>{closeOrMoreDialog();openPilotFeedbackDialog()}"));
 assert(app.includes("()=>{closeRecoveryMoreDialog();openPilotFeedbackDialog()}"));
});
test('boot sentinel now displays the same version as app bundle',()=>{
 assert(html.includes("const VERSION='17.2.26'"));assert(html.includes('<title>ANESVET V17.2.26</title>'));assert(app.includes("const APP_VERSION='17.2.26'"));
});
console.log('R22_BRIDGE_TESTS',count+'/20');
