/* Round 01: isolated unit test for ASA event binding. This file does not modify runtime behavior. */
'use strict';
const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const src=fs.readFileSync(__dirname+'/patient-master-controller.js','utf8');
let passed=0;
const tests=[];
function test(name,run){
 try{run();tests.push({name,pass:true});passed++;console.log('PASS',name)}
 catch(e){tests.push({name,pass:false,error:e.message});console.error('FAIL',name,e);process.exitCode=1}
}
function makeElement(id='',asa=''){
 const classes=new Set();const listeners={};
 return {id,dataset:asa?{asa}:{},value:'',textContent:'',className:'',
 classList:{add(c){classes.add(c)},remove(c){classes.delete(c)},toggle(c,on){if(on)classes.add(c);else classes.delete(c)},contains(c){return classes.has(c)}},
 addEventListener(type,fn){(listeners[type]??=[]).push(fn)},fire(type){for(const fn of listeners[type]||[])fn({target:this})}};
}
function env(){
 const elements=new Map();const get=id=>elements.get(id)||null;
 for(const id of ['asa','selectedAsaBadge','patientSaveStatus','viewPatientHistoryBtn','patientMasterSearch','showRetiredPatients','newPatientMasterBtn','unlinkPatientBtn','editRiskBtn','reviewAnestheticRiskBtn']) elements.set(id,makeElement(id));
 const cards=['I','II','III','IV','V'].map(x=>makeElement('',''+x));
 const state={patientSaved:true,asa:'',emergency:false};
 const calls={settings:0,dashboard:0};
 const sandbox={globalThis:{},module:{exports:{}},console};
 vm.createContext(sandbox);vm.runInContext(src,sandbox,{filename:'patient-master-controller.js'});
 const api=sandbox.module.exports;
 const ctl=api.create({
  $:get,$$:sel=>sel==='.asa-card'?cards:[],patientDomain:{},patientOrchestration:{},
  getState:()=>state,getPatientCache:()=>[],setPatientCache(){},
  loadSettings:()=>{calls.settings++},updateDashboard:()=>{calls.dashboard++},
 });
 assert.ok(ctl,'controller must be instantiated');
 return {get,cards,state,calls,ctl};
}
test('patient master controller binds all five ASA cards',()=>{
 const x=env();x.ctl.bind();
 assert.deepEqual(x.cards.map(c=>Object.keys(c.dataset).length),[1,1,1,1,1]);
 x.cards[0].fire('click');assert.equal(x.get('asa').value,'I');
 x.cards[4].fire('click');assert.equal(x.get('asa').value,'V');
 assert.equal(x.calls.dashboard,2);
});
test('ASA selection updates save status and exactly one selected card',()=>{
 const x=env();x.ctl.bind();x.cards[2].fire('click');
 assert.equal(x.get('asa').value,'III');
 assert.equal(x.get('selectedAsaBadge').textContent,'ASA III');
 assert.equal(x.state.patientSaved,false);
 assert.equal(x.get('patientSaveStatus').textContent,'NOT SAVED');
 assert.deepEqual(x.cards.filter(c=>c.classList.contains('selected')).map(c=>c.dataset.asa),['III']);
});
test('ASA binder does not mark patient as saved or create medication/vital entries',()=>{
 const x=env();x.ctl.bind();x.cards[1].fire('click');
 assert.equal(x.state.patientSaved,false);
 assert.equal(x.state.records,undefined);
 assert.equal(x.state.medications,undefined);
});
console.log(JSON.stringify({suite:'R01-patient-asa-binding',passed,total:tests.length,tests},null,2));
if(passed!==tests.length)process.exitCode=1;
