'use strict';
const fs=require('fs'),R=__dirname,read=f=>fs.readFileSync(R+'/'+f,'utf8');
const h=read('index.html'),o=read('or-live-controller.js'),m=read('medication-workspace-controller.js'),w=read('or-workspace-restructure.js'),c=read('or-workspace-restructure.css'),app=read('app.js'),sw=read('service-worker.js');
const startBranch=o.slice(o.indexOf("if(action==='start-induction')"),o.indexOf("if(action==='induction-drug')"));
const T=[
['Induction quick strip exists',w.includes('id:\'orInductionQuickStrip\'')&&w.includes('orQuickInductionTimestampBtn')],
['Induction button delegates authoritative workflow',w.includes("handleOrWorkflowAction('start-induction')")],
['Quick strip owns Start Induction without duplicate primary button',w.includes("classList.toggle('or-induction-owned',action==='start-induction'&&!status.started)")&&c.includes('.or-primary-flow.or-induction-owned{display:none!important}')],
['Quick induction strip retires after Surgery start',w.includes("section.hidden=!activePhase")&&w.includes("['start-induction','airway','surgery-start'].includes(action)")],
['Start Induction remains timestamp/milestone only',startBranch.includes("triggerOrMilestone('Induction')")&&!startBranch.includes('recordDrugAdministration')&&!startBranch.includes('recordPreparedInductionNow')],
['Prepared list filters planned induction only',m.includes("d&&d.planned&&String(d.phase||'').toLowerCase()==='induction'")],
['Prepared dose prefers frozen planned mL',m.includes('frozenPlannedMl=Number(d.plannedMl)')&&m.includes('Number.isFinite(frozenPlannedMl)')],
['Prepared drug tap captures current epoch',m.includes('const tapEpoch=Date.now(),tapElapsed=currentElapsed(),tapClock=formatClock(tapEpoch)')],
['Prepared drug requires started case',m.includes("if(!state.caseStartedAt||!state.protocolSnapshot){toast('กด Induction ก่อนบันทึกยาที่ให้')")],
['Prepared drug blocks non-plan drug IDs',m.includes("รายการนี้ไม่ได้อยู่ใน frozen Induction plan")],
['Already-given drug cannot silently duplicate',m.includes("if(row.given){toast(`${row.name} บันทึกแล้ว")],
['Complete prepared drug records immediately',m.includes("source:'OR Induction Quick'")&&m.includes("note:'Prepared induction quick tap • Calculated-as-Given'")],
['Immediate administration uses tap timestamp',m.includes('adminEpoch:tapEpoch,adminElapsedMs:tapElapsed,adminClock:tapClock,documentedAt:tapEpoch')],
['Incomplete setup opens editor but preserves tap time',m.includes("openOrQuickDrug({phase:'induction',purpose:'induction',drugId:String(row.id),adminEpoch:tapEpoch,adminElapsedMs:tapElapsed,adminClock:tapClock,tapCaptured:true})")],
['Quick editor context carries captured time',m.includes('orQuickContext={phase,purpose,allowRecovery,tapCaptured,adminEpoch:tapEpoch')],
['Quick editor shows drug-tap administration time',m.includes("tapTime?'drug tap':'Induction'")],
['Medication instance exposed to OR workspace',app.includes('window.ANESVET_MEDICATION_WORKSPACE=MEDICATION_WORKSPACE_CONTROLLER')],
['OR controller instance exposed for milestone action',app.includes('window.ANESVET_OR_LIVE_INSTANCE=OR_LIVE_CONTROLLER')],
['Buttons disabled until Induction starts',w.includes("b.disabled=!status.started||!!row.given")],
['Given induction drugs show recorded clock',w.includes("`✓ Given ${row.given.clock||''}`")],
['Drug buttons explicitly say tap when injected',w.includes('mL • tap when injected')],
['Induction strip rerenders after administration',w.includes("document.addEventListener('anesvet:drug-administration-changed'")],
['Meds details remains separately reachable',w.includes("orInductionOpenMedsBtn")&&w.includes("setView('meds',{scroll:true})")],
['Intubation remains timestamp-only',o.includes("runOrWorkflowMutation('intubation'")&&!o.includes("openAirwayWorkflow('intubation')")],
['Airway and Support remain deferred workspaces',w.includes('ET tube & intubation details')&&w.includes('Fluids & ventilation')],
['Induction strip styled compactly on mobile',c.includes('.or-induction-quick-strip')&&c.includes('.or-prepared-induction-meds')],
['Current SW generation',sw.includes("anesvet-v17-11-1-startup")],
['Current workspace assets cached',sw.includes('or-workspace-restructure.js?v=17.11.1')&&sw.includes('or-workspace-restructure.css?v=17.11.1')],
['End Surgery preserved',h.includes('data-label="Surgery end"')],
['Emergency Return preserved',h.includes('id="emergencyReturnOrBtn"')],
['Final Lock preserved',h.includes('id="endSaveArchiveBtn"')]
];
let p=0;for(const [n,v] of T){console.log((v?'PASS':'FAIL')+'  '+n);if(v)p++}
console.log(`\n${p}/${T.length} PASS`);process.exit(p===T.length?0:1);
