'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path');const R=path.resolve(__dirname,'../..'),read=f=>fs.readFileSync(path.join(R,f),'utf8');
const results=[];function test(name,fn){try{fn();results.push([name,true])}catch(e){results.push([name,false,e.message])}}function assert(v,m){if(!v)throw new Error(m)}
function load(file,key){const code=read(file),ctx={window:{},globalThis:{},Date,console};ctx.globalThis=ctx.window;vm.createContext(ctx);vm.runInContext(code,ctx,{filename:file});return ctx.window[key]}
const phase=load('case-lifecycle-model.js','ANESVET_CASE_LIFECYCLE_MODEL');
const session=load('session-lifecycle-model.js','ANESVET_SESSION_MODEL');
const recovery=load('runtime/orchestration/recovery-orchestration.js','ANESVET_RECOVERY_ORCHESTRATION');
const lifecycle=load('runtime/core/case-lifecycle.js','ANESVET_CASE_LIFECYCLE');
const workflow=require(path.join(R,'runtime/clinical/clinical-workflow.js'));
const patient=read('patient-preop-simplification.js'),drug=read('drug-start-simplification.js'),orc=read('runtime/controllers/or-live-controller.js'),med=read('runtime/controllers/medication-workspace-controller.js'),rec=read('runtime/controllers/recovery-controller.js'),app=read('app.js'),final=read('finalization.js'),orw=read('or-workspace-restructure.js');

test('Patient gate requires identity/BW/procedure/ASA',()=>{['patientName','species','weight','patientProcedure','asa'].forEach(x=>assert(patient.includes(x),`missing ${x}`))});
test('Drug Plan blocks unconfirmed BW and routes through review',()=>{assert(drug.includes('ต้องยืนยัน Current BW')&&drug.includes("runAction('review')")&&drug.includes('goOrLiveFromDrugBtn'),'drug gate contract missing')});
test('Start case freezes protocol/identity before OR',()=>{const p=orc.indexOf('function startCaseFromOr'),q=orc.indexOf('save();',p),chunk=orc.slice(p,q);assert(chunk.includes('caseIdentitySnapshot=')&&chunk.includes('captureProtocolSnapshot()'),'freeze contract missing')});
test('Induction marks frozen induction meds Given • details pending',()=>{assert(orc.includes('markPreparedInductionGivenAtMilestone')&&med.includes("status:'given-details-pending'"),'induction semantics missing')});
test('Individual induction drug administration time remains editable',()=>{assert(med.includes('epochFromTimeInput')&&med.includes('Administration time adjusted from Induction'),'editable time missing')});
test('Intubation remains timestamp-only',()=>{assert(orc.includes("runOrWorkflowMutation('intubation'")&&!orc.includes("openAirwayWorkflow('intubation')"),'intubation contract missing')});
test('OR monitor is fixed above secondary charting',()=>{const a=orw.indexOf('if(vitals&&command)'),b=orw.indexOf("const nav=make('nav'");assert(a>=0&&b>a&&orw.includes('data-or-workspace="fluid"')&&orw.includes('data-or-workspace="vent"'),'OR order missing')});
test('Surgery end uses audited workflow mutation',()=>{assert(orc.includes("if(action==='surgery-end'){runOrWorkflowMutation(action,()=>triggerOrMilestone('Surgery end'))"),'surgery end missing')});
test('Extubation enters Recovery through controller',()=>{assert(orc.includes("if(action==='extubation'")&&app.includes('enterRecoveryAfterExtubation();')&&rec.includes("state.casePhase='recovery'"),'recovery route missing')});
test('Emergency Return preserves explicit Recovery↔OR path',()=>{assert(rec.includes("state.emergencyReturnActive=true;state.casePhase='emergency'")&&rec.includes("state.emergencyReturnActive=false;state.casePhase='recovery'"),'emergency return missing')});
test('Recovery complete goes to End Case',()=>{const p=rec.indexOf('function complete()'),chunk=rec.slice(p,rec.indexOf('function resetDueReminder',p));assert(chunk.includes("ctx.setTab?.('endcase')")&&chunk.includes('completePatch'),'recovery completion missing')});
test('Finalization retains explicit final lock path',()=>{assert(app.includes('finalCaseIsSealed')&&final.includes('final')||app.includes('endSaveArchiveBtn'),'finalization missing')});
test('Case lifecycle phase order remains stable',()=>{assert(JSON.stringify(phase.ORDER)===JSON.stringify(['setup','induction','intraop','emergence','recovery']),'phase order mismatch')});
test('Recovery patch preserves first recovery timestamp',()=>{const p=recovery.beginPatch({recoveryStartedAt:100},200);assert(p.recoveryStartedAt===100&&p.casePhase==='recovery','recovery patch mismatch')});
test('Session model locks Recovery while Emergency Return active',()=>{const s=session.sessionStatus({caseStartedAt:1,casePhase:'recovery',emergencyReturnActive:true});assert(!s.recoveryAccess&&s.orLiveByStartedCase,'session emergency mismatch')});
test('Final sealed case is reload-safe',()=>{const s={caseLocked:true,finalChecksum:'abc',lockedAt:10,patientSaved:true};assert(lifecycle.finalCaseIsSealed(s)&&!lifecycle.versionReloadUnsafe(s),'final seal mismatch')});
test('Synthetic completed case produces coherent recovery handoff',()=>{const c={caseId:'QA-1',patientName:'Mochi',species:'Dog',weight:6.8,procedure:'Castration',asa:'II',caseStartedAt:1000,surgeryEndedAt:5000,recoveryStartedAt:6000,airwayEttSize:'5.5',airwayEttDepth:'17',airwayDifficulty:'Easy',airwayCuff:'Inflated / sealed',airwayCircuit:'Rebreathing',airwayVentMode:'Spontaneous',records:[{epoch:2000,map:78,spo2:99,etco2:38,temp:100}],recoveryRecords:[{epoch:7000,hr:110}],drugAdministrations:[{drug:'Propofol',actual:1.2,unit:'mL'}],fluidActualTotal:120,fluidRateInput:34,protocolSnapshot:{name:'QA',version:'1',capturedAt:900}};const hand=workflow.buildHandoff(c,8000);assert(hand.patientName==='Mochi'&&hand.airway.ett==='5.5'&&hand.administrations.length===1&&hand.fluids.actualTotal===120&&hand.extrema.spo2.min===99,'handoff mismatch')});

const pass=results.filter(x=>x[1]).length;for(const r of results)console.log(`${r[1]?'PASS':'FAIL'}  ${r[0]}${r[2]?` — ${r[2]}`:''}`);console.log(`\n${pass}/${results.length} PASS`);process.exit(pass===results.length?0:1);
