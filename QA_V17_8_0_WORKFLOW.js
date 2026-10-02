const fs=require('fs'),vm=require('vm'),path=require('path');
const ROOT=__dirname,results=[];
function test(name,fn){try{const detail=fn();results.push({name,pass:true,detail:detail??'PASS'})}catch(e){results.push({name,pass:false,detail:e.message})}}
function assert(v,msg){if(!v)throw new Error(msg)}
function load(file,key){const code=fs.readFileSync(path.join(ROOT,file),'utf8');const ctx={window:{},globalThis:{},Date,console};ctx.globalThis=ctx.window;vm.createContext(ctx);vm.runInContext(code,ctx,{filename:file});return ctx.window[key]}
const phase=load('case-lifecycle-model.js','ANESVET_CASE_LIFECYCLE_MODEL');
const session=load('session-lifecycle-model.js','ANESVET_SESSION_MODEL');
const recovery=load('recovery-orchestration.js','ANESVET_RECOVERY_ORCHESTRATION');
const lifecycle=load('case-lifecycle.js','ANESVET_CASE_LIFECYCLE');
const app=fs.readFileSync(path.join(ROOT,'app.js'),'utf8');
const orc=fs.readFileSync(path.join(ROOT,'or-live-controller.js'),'utf8');
const rec=fs.readFileSync(path.join(ROOT,'recovery-controller.js'),'utf8');
const med=fs.readFileSync(path.join(ROOT,'medication-workspace-controller.js'),'utf8');

test('phase order setup→induction→intraop→emergence→recovery',()=>{assert(JSON.stringify(phase.ORDER)===JSON.stringify(['setup','induction','intraop','emergence','recovery']),'phase order mismatch')});
test('tracker marks earlier phases done',()=>{const t=phase.trackerState('emergence');assert(t.stepState('setup')==='done'&&t.stepState('induction')==='done'&&t.stepState('intraop')==='done'&&t.stepState('emergence')==='active','tracker state mismatch')});
test('recovery begin patch preserves first recovery timestamp',()=>{const p=recovery.beginPatch({recoveryStartedAt:100},200);assert(p.casePhase==='recovery'&&p.recoveryStartedAt===100&&!p.emergencyReturnActive,'begin patch mismatch')});
test('recovery complete patch moves to complete',()=>{const p=recovery.completePatch(null,300);assert(p.casePhase==='complete'&&p.recoveryCompletedAt===300&&!p.emergencyReturnActive,'complete patch mismatch')});
test('session locks recovery access during emergency return',()=>{const s=session.sessionStatus({caseStartedAt:1,casePhase:'recovery',emergencyReturnActive:true});assert(!s.recoveryAccess&&s.orLiveByStartedCase,'emergency access mismatch')});
test('sealed final case is safe from reload rescue',()=>{const s={caseLocked:true,finalChecksum:'abc',lockedAt:10,patientSaved:true};assert(lifecycle.finalCaseIsSealed(s)&&!lifecycle.versionReloadUnsafe(s),'sealed case safety mismatch')});
test('active mutable case is reload-unsafe',()=>{const s={caseLocked:false,patientSaved:true,records:[],events:[]};assert(lifecycle.versionReloadUnsafe(s),'active case should be reload unsafe')});

test('Start Case freezes identity + procedure + protocol before save',()=>{const p=orc.indexOf('function startCaseFromOr');const q=orc.indexOf('save();',p);const chunk=orc.slice(p,q);assert(chunk.includes('caseIdentitySnapshot=')&&chunk.includes('procedureTemplateSnapshot=')&&chunk.includes('captureProtocolSnapshot()'),'start freeze contract missing')});
test('Surgery end uses native milestone mutation',()=>{assert(orc.includes("if(action==='surgery-end'){runOrWorkflowMutation(action,()=>triggerOrMilestone('Surgery end'))"),'surgery-end mutation missing')});
test('Extubation routes through Recovery controller',()=>{assert(orc.includes("if(action==='extubation'){runOrWorkflowMutation(action,()=>triggerOrMilestone('Extubation'));return}")&&app.includes("if(label==='Extubation')")&&app.includes('enterRecoveryAfterExtubation();'),'extubation route missing')});
test('Recovery transition saves and navigates Recovery',()=>{const p=rec.indexOf('function enterAfterExtubation');const chunk=rec.slice(p,rec.indexOf('function emergencyReturnToOr',p));assert(chunk.includes("ctx.save?.()")&&chunk.includes("ctx.setTab?.('recovery',{force:true})")&&chunk.includes("state.casePhase='recovery'"),'extubation→recovery contract missing')});
test('Emergency return has explicit OR and Recovery paths',()=>{assert(rec.includes("state.emergencyReturnActive=true;state.casePhase='emergency'")&&rec.includes("state.emergencyReturnActive=false;state.casePhase='recovery'"),'emergency return contract missing')});
test('Recovery completion pauses timer and goes End Case',()=>{const p=rec.indexOf('function complete()');const chunk=rec.slice(p,rec.indexOf('function resetDueReminder',p));assert(chunk.includes("ctx.pauseTimer?.()")&&chunk.includes("ctx.setTab?.('endcase')")&&chunk.includes('completePatch'),'recovery completion contract missing')});
test('Workflow undo is blocked after post-transition clinical data',()=>{assert(orc.includes('hasPostTransitionClinicalData(tx)')&&orc.includes('Undo blocked: clinical data was recorded after this step'),'undo safety missing')});
test('Geno V Cefazolin profile remains actionable',()=>{assert(app.includes("workingConc:250")&&app.includes("diluentMl:4")&&app.includes("dataset.rawml=String(cefRaw)"),'cefazolin Geno V contract missing')});
test('Geno V Convenia profile remains actionable',()=>{assert(app.includes("workingConc:80")&&app.includes("dataset.rawml=String(convRaw)"),'convenia Geno V contract missing')});
test('Medication actual confirmation remains required',()=>{assert(med.includes("if(!(actual>0)||!route||!by||!concentration)"),'medication confirmation guard missing')});
test('Medication workspace stays open for consecutive entries',()=>{assert(med.includes('workspace stays open')&&med.includes('nextUnrecordedQuickDrugIndex'),'continuous medication workflow missing')});
test('Case phase transition persists before rerender',()=>{const p=app.indexOf('function setCasePhase');const chunk=app.slice(p,app.indexOf('function renderTimerState',p));const tail=chunk.slice(chunk.indexOf("if(log)"));assert(tail.indexOf('save();')>=0&&tail.indexOf('save();')<tail.indexOf('renderCasePhase();'),'phase save/render order mismatch')});
test('Final lock guard is used by lifecycle layer',()=>{assert(app.includes('finalCaseIsSealed=(caseObj=state)=>CASE_LIFECYCLE.finalCaseIsSealed(caseObj)'),'final seal integration missing')});

const pass=results.filter(x=>x.pass).length,fail=results.length-pass;const out={suite:'ANESVET V17.10.11 Full Workflow Regression',generatedAt:new Date().toISOString(),scope:'Node pure-model + source-contract regression; NOT browser/device E2E',pass,fail,total:results.length,results};
fs.writeFileSync(path.join(ROOT,'QA_V17_8_0_WORKFLOW_RESULTS.json'),JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));process.exitCode=fail?1:0;
