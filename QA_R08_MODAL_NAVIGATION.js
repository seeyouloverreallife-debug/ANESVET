/* R08: Modal/navigation lifecycle regression for ANESVET.
 * Dynamic tests run the shipped app.js and medication controller snippets.
 * No medications, calculations, case keys, or clinical records are mutated.
 */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const app=fs.readFileSync(__dirname+'/app.js','utf8');
const medSource=fs.readFileSync(__dirname+'/medication-workspace-controller.js','utf8');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const tests=[];
function test(label,run){try{run();tests.push({label,pass:true});console.log('PASS',label)}catch(e){tests.push({label,pass:false,error:e.message});console.error('FAIL',label,e.stack)}}
class FakeElement {
  constructor(id){this.id=id;this.open=false;this.hidden=false;this.value='';this.dataset={};this.events={};this.failClose=false;this.showCalls=0;this.closeCalls=0;this.attributes={};}
  addEventListener(t,f){(this.events[t]??=[]).push(f)}
  emit(t){for(const f of this.events[t]||[])f({target:this})}
  showModal(){this.showCalls++;this.open=true}
  close(){this.closeCalls++;if(this.failClose)throw new Error('dialog close denied');this.open=false;this.emit('close')}
  removeAttribute(name){if(name==='open')this.open=false;delete this.attributes[name]}
  setAttribute(name,v){this.attributes[name]=v;if(name==='open')this.open=true}
}
function makeEnv(){
  const els=new Map(),get=id=>{if(!els.has(id))els.set(id,new FakeElement(id));return els.get(id)};
  const patient={caseId:'case-1',drugAdministrations:[{id:'saved-drug',drug:'Propofol',actual:1.2}],auditTrail:[],weight:8};
  const controller=require('./medication-workspace-controller.js').create({$ :get,$$:()=>[],workflow:{clone:x=>JSON.parse(JSON.stringify(x)),numeric:x=>Number(x)},getState:()=>patient});
  assert(controller,'medication workspace controller constructed');controller.bind();
  return {els,get,patient,controller};
}
function corruptEditorState(x){x.get('orQuickDrugBatchEditor').hidden=false;x.get('orQuickDrugSingleEditor').hidden=true;x.get('orQuickDrugSaveBtn').hidden=true}
function editorReset(x){assert.equal(x.get('orQuickDrugBatchEditor').hidden,true);assert.equal(x.get('orQuickDrugSingleEditor').hidden,false);assert.equal(x.get('orQuickDrugSaveBtn').hidden,false)}
function captureState(x){return JSON.stringify(x.patient)}
function appCloseBinder(x){
  const button=new FakeElement('closeMedication');button.dataset.closeDialog='orQuickDrugDialog';
  const generic=new FakeElement('closeGeneric');generic.dataset.closeDialog='pilotFeedbackDialog';
  const missing=new FakeElement('closeMissing');missing.dataset.closeDialog='missingDialog';
  const start=app.indexOf("$$('[data-close-dialog]').forEach"),end=app.indexOf("for(const id of ['orProblemPanel'",start);
  assert(start>0&&end>start);
  const context={$$:selector=>selector==='[data-close-dialog]'?[button,generic,missing]:[], $:x.get,
    closeOrQuickDrugWorkspace:()=>x.controller.closeOrQuickDrugWorkspace(),
    closeDialogSafe:id=>{const d=x.get(id);if(d.open)d.close();else d.removeAttribute('open')}};
  vm.runInNewContext(app.slice(start,end),context);return{button,generic,missing};
}
test('generic Close/back to OR uses controller cleanup and closes dialog',()=>{
  const x=makeEnv(),before=captureState(x);x.get('orQuickDrugDialog').showModal();corruptEditorState(x);
  const b=appCloseBinder(x);b.button.emit('click');assert.equal(x.get('orQuickDrugDialog').open,false);editorReset(x);assert.equal(captureState(x),before);
});
test('system Escape/Back close event resets editor without recording a medication',()=>{
  const x=makeEnv(),before=captureState(x);x.get('orQuickDrugDialog').showModal();corruptEditorState(x);
  x.get('orQuickDrugDialog').close();editorReset(x);assert.equal(captureState(x),before);
});
test('top Close button follows same controller-owned close path',()=>{
  const x=makeEnv();x.get('orQuickDrugDialog').showModal();corruptEditorState(x);
  x.get('orQuickDrugCloseTop').emit('click');editorReset(x);assert.equal(x.get('orQuickDrugDialog').open,false);
});
test('controller does not throw when browser close throws; leaves editor reset',()=>{
  const x=makeEnv();x.get('orQuickDrugDialog').showModal();x.get('orQuickDrugDialog').failClose=true;corruptEditorState(x);
  x.controller.closeOrQuickDrugWorkspace();editorReset(x);assert.equal(x.get('orQuickDrugDialog').open,false);
});
test('attempted reopening while a medication dialog is already open preserves entered draft',()=>{
  const x=makeEnv();x.get('orQuickDrugDialog').showModal();x.get('orQuickDrugActual').value='0.75';
  corruptEditorState(x);const before=captureState(x);x.controller.openOrQuickDrug({purpose:'induction'});
  assert.equal(x.get('orQuickDrugActual').value,'0.75');assert.equal(x.get('orQuickDrugBatchEditor').hidden,false);
  assert.equal(x.get('orQuickDrugDialog').showCalls,1);assert.equal(captureState(x),before);
});
test('unrelated generic Close uses guarded helper and does not reset medication dialog',()=>{
  const x=makeEnv();const b=appCloseBinder(x);x.get('pilotFeedbackDialog').showModal();x.get('orQuickDrugDialog').showModal();
  b.generic.emit('click');assert.equal(x.get('pilotFeedbackDialog').open,false);assert.equal(x.get('orQuickDrugDialog').open,true);
  b.missing.emit('click');assert.equal(x.get('orQuickDrugDialog').open,true);
});
function mobileEnv(){
  const d=new FakeElement('mobileWorkflowDialog'),stages=[];let syncs=0;
  const start=app.indexOf('function openMobileWorkflowDialog(){'),end=app.indexOf('// V17.2.2 interaction recovery:',start);
  assert(start>0&&end>start);
  const ctx={$:id=>id==='mobileWorkflowDialog'?d:null,BOOT:{mark:(...v)=>stages.push(v)},syncMobileWorkflowLocks:()=>syncs++,safeCloseOpenDialog:el=>{if(!el.open)return false;el.close();return true}};
  vm.runInNewContext(app.slice(start,end)+'\nthis.openMenu=openMobileWorkflowDialog;this.closeMenu=closeMobileWorkflowDialog;',ctx);
  return {d,ctx,stages,get syncs(){return syncs}};
}
test('mobile menu opens only once on repeated taps',()=>{
  const x=mobileEnv();x.ctx.openMenu();x.ctx.openMenu();assert.equal(x.d.showCalls,1);assert.equal(x.syncs,2);
});
test('mobile menu can close, then open again for Patient / Pre-op / Medications',()=>{
  const x=mobileEnv();x.ctx.openMenu();x.ctx.closeMenu();assert.equal(x.d.open,false);x.ctx.openMenu();assert.equal(x.d.showCalls,2);
  for(const id of ['patient','preop','drugs'])assert(html.includes(`data-mobile-tab="${id}"`));
});
test('mobile menu fallback still opens if native dialog API is unavailable',()=>{
  const x=mobileEnv();x.d.showModal=undefined;x.ctx.openMenu();assert.equal(x.d.open,true);x.ctx.closeMenu();assert.equal(x.d.open,false);
});
function mobileTabClick(id){
  const button=new FakeElement('mobileTab-'+id);button.dataset.mobileTab=id;
  const events=[];const start=app.indexOf("$$('[data-mobile-tab]').forEach(btn=>btn.addEventListener('click',"),end=app.indexOf('function syncQuickConcentrations(){',start);
  assert(start>0&&end>start);
  const ctx={$$:selector=>selector==='[data-mobile-tab]'?[button]:[],
    closeMobileWorkflowDialog:()=>events.push('dialog-closed'),
    setTab:(tab,opts)=>events.push(['navigate',tab,opts||{}])};
  vm.runInNewContext(app.slice(start,end),ctx);button.emit('click');return events;
}
test('Patient / Pre-op / Medication mobile selection closes dialog before routing',()=>{
  for(const id of ['patient','preop','drugs']){
    const events=mobileTabClick(id);assert.equal(events[0],'dialog-closed');
    assert.equal(events[1][0],'navigate');assert.equal(events[1][1],id);
    assert.equal(Object.keys(events[1][2]).length,0,'navigation does not force bypass clinical guards');
  }
});
test('mobile safety-gated routes never pass force:true',()=>{
  for(const id of ['orlive','recovery']){const ev=mobileTabClick(id);assert.equal(ev[1][1],id);assert.equal(Object.keys(ev[1][2]).length,0)}
});
test('no clinical dose calculation/storage schema modification in R08 close routines',()=>{
  const s=medSource.slice(medSource.indexOf('  function clearOrQuickDrugEditorState(){'),medSource.indexOf('  function recordInductionWithoutDrug(){'));
  for(const term of ['drugAdministrations','localStorage','dose','calculatedMl','state.casePhase=','state.caseLocked='])assert(!s.includes(term),term);
  assert(app.includes("const CURRENT_KEY = 'anesvet_v14_3_current'"));assert(app.includes("const TAB_KEY = 'anesvet_v14_3_tab'"));
});
const passed=tests.filter(x=>x.pass).length;
console.log(JSON.stringify({suite:'R08-modal-navigation',passed,total:tests.length,failures:tests.filter(x=>!x.pass)},null,2));
if(passed!==tests.length)process.exitCode=1;
