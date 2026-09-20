import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');

const count=(s,re)=>(s.match(re)||[]).length;
const must=(cond,msg)=>assert.ok(cond,msg);

// Core version / structure
must(manifest.name.includes('V14.7.2'),'manifest should be V14.7.2');
must(sw.includes('v14-7-2'),'service worker cache should identify V14.7.2');
must(count(app,/function\s+phaseLabel\s*\(/g)===1,'phaseLabel must be declared once');
const fnNames=[...app.matchAll(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]);
const dupFns=[...new Set(fnNames.filter((n,i)=>fnNames.indexOf(n)!==i))];
must(dupFns.length===0,`named function declarations must be unique: ${dupFns.join(', ')}`);
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
must(new Set(ids).size===ids.length,'HTML ids must be unique');

// Temperature UX: input is display-only; clinical records remain canonical Fahrenheit internally.
must(html.includes('id="settingTemperatureUnit"'),'temperature unit setting missing');
must(app.includes("temperatureUnit:'C'"),'Thailand default display should be Celsius');
must(app.includes("temp:tempInputStoredF('temp')"),'anesthesia snapshot must canonicalize temperature');
must(app.includes("temp=tempNA?null:tempInputStoredF('recTemp')"),'recovery snapshot must canonicalize temperature');
must(app.includes('Temp_F_canonical')&&app.includes('Temp_C'),'CSV should identify both temperature units');
const cToF=c=>Number(c)*9/5+32;
const fToC=f=>(Number(f)-32)*5/9;
assert.ok(Math.abs(cToF(37)-98.6)<1e-9,'37 C -> 98.6 F');
assert.ok(Math.abs(fToC(98.6)-37)<1e-9,'98.6 F -> 37 C');

// Fresh-case safety invariants
must(/id="weight"[^>]*value=/.test(html)===false,'weight must not have an HTML default value');
for(const id of ['hr','rr','sap','map','dap','spo2','etco2','temp']){
  const re=new RegExp(`id="${id}"[^>]*value=`);
  must(!re.test(html),`${id} must not have a clinical default value`);
}
must(app.includes('validateCaseReadyToStart()'),'case-start safety validation missing');
must(app.includes("requireCurrentWeight('using the Drug Calculator')"),'weight-based drug guard missing');
must(app.includes("state.patientSaved=true;save();syncAsaCards();updatePatientSaveStatus();")&&app.includes("// V14.6.4: current-weight dependent UI")&&app.includes("updateDashboard();\n  toast('บันทึก Patient Master + Case Setup แล้ว')"),'new-patient current BW must propagate immediately after successful Save');

// Patient / data integrity
must(html.includes('id="hospitalId"')&&html.includes('id="visitId"'),'HN and Visit IDs must remain separate');
must(app.includes('findMergeTarget(')&&app.includes('mergedPatientIds'),'Patient Master duplicate lifecycle missing');
must(app.includes('SESSION_LOCK_KEY')&&app.includes('BroadcastChannel'),'multi-tab protection missing');
must(app.includes('computeCaseChecksum(')&&app.includes("checksumAlgorithm='SHA-256'"),'archive checksum path missing');
must(app.includes('const canMigrateClinicalPayload=!(c.caseLocked&&c.finalChecksum)'),'legacy signed records must not be mutated by V14.6 clinical-array migration');

// Structured complication workflow
for(const id of ['complicationDialog','complicationType','complicationSeverity','complicationAssessment','complicationIntervention','complicationList','orActiveComplicationCount']){
  must(html.includes(`id="${id}"`),`complication UI missing ${id}`);
}
must(app.includes('function startComplicationRecord'),'structured complication start missing');
must(app.includes('function complicationResponse'),'complication response/resolution missing');
must(app.includes("addAudit('COMPLICATION_STARTED'"),'complication start audit missing');
must(app.includes("status:'active'")&&app.includes("c.status='resolved'"),'complication lifecycle states missing');
must(app.includes("activeComplications===0")&&app.includes('resolve/document outcome ก่อน Lock'),'unresolved complication must block final lock');

// Structured medication administration audit
for(const id of ['drugAdminUnit','drugAdminBy','drugAdminConcentration','drugAdministrationAudit','drugAuditCount']){
  must(html.includes(`id="${id}"`),`drug administration UI missing ${id}`);
}
must(app.includes('function recordDrugAdministration'),'structured medication administration missing');
must(app.includes('function voidDrugAdministration'),'medication void workflow missing');
must(app.includes("addAudit('DRUG_ADMINISTERED'")&&app.includes("addAudit('DRUG_ADMIN_VOIDED'"),'medication audit trail missing');
must(app.includes('drugAdministrationId')&&app.includes('linked events จะถูกเก็บไว้'),'linked medication events must be protected');
must(app.includes("if(!by){toast('กรุณาระบุผู้ให้ยา')"),'administered-by must be required');

// Recovery transition + explicit N/A + V14.6 readiness score
must(html.includes('recovery-observation-na-btn')&&html.includes('recovery-check-na-btn'),'Recovery N/A controls missing');
must(html.includes('id="recNaReason"'),'Recovery N/A reason field missing');
must(app.includes('recoveryNAReasonValid()'),'Recovery N/A reason validation missing');
must(app.includes("state.casePhase='recovery'")&&app.includes("state.casePhase='complete'"),'Recovery phase transitions missing');
must(app.includes('Recovery readiness ยังไม่ครบ'),'Recovery readiness guard missing');
for(const id of ['saveRecoveryScoreBtn','recScoreAirway','recScoreOxygen','recScoreTemp','recScoreMentation','recScoreComfort','recoveryScoreHistory']){
  must(html.includes(`id="${id}"`),`Recovery Readiness Score UI missing ${id}`);
}
must(html.includes('ไม่ใช่ validated discharge score'),'internal recovery score must not be presented as validated');
must(app.includes('function currentRecoveryScore')&&app.includes('function saveRecoveryScore'),'recovery scoring logic missing');
must(app.includes("addAudit('RECOVERY_SCORE_ADDED'"),'recovery score audit missing');
must(app.includes('scoreCount>0'),'at least one recovery readiness score must be required for recovery completion');

// Dose / age / fluid regression anchors
must(app.includes("d.mode==='mgkg'")&&app.includes('const total=weight*dose'),'mg/kg dose calculation path missing');
must(app.includes('function agePartsFromDob'),'age calculation missing');
must(app.includes('function getFluidMetrics'),'fluid integration missing');

// Backup / restore
must(app.includes("format:'ANESVET_BACKUP',version:'14.7.2'"),'backup version must be 14.7.2');
must(app.includes("raw.format!=='ANESVET_BACKUP'")&&app.includes('idbClearCases()'),'backup restore integrity path missing');

// Reset must preserve persistent stores by only resetting current case state.
must(app.includes('state=freshState()')&&app.includes("localStorage.setItem(CURRENT_KEY,JSON.stringify(state))"),'fresh reset path missing');
must(!app.slice(app.indexOf('function resetCurrent('),app.indexOf('\n}',app.indexOf('function resetCurrent('))+2).includes('localStorage.removeItem(SETTINGS_KEY)'),'reset must not delete settings');
must(app.includes('complications:[],drugAdministrations:[],alertEpisodes:[],recoveryScores:[]'),'fresh reset must clear V14.6 case-only structured records');

// Print/PDF hardening + V14.6 report sections
must(css.includes('display:table-header-group'),'print table headers should repeat');
must(css.includes('page-break-inside:avoid'),'print rows/cards should avoid splitting');
must(css.includes('overflow-wrap:anywhere'),'print long text should wrap');
for(const id of ['reportComplications','reportDrugAdministrations','reportRecoveryScores']){
  must(html.includes(`id="${id}"`),`PDF/report section missing ${id}`);
}

// V14.6.2 alert UX / configurable BP helpers
for(const id of ['clinicalGuideDialog','clinicalGuideTitle','clinicalGuideSteps','clinicalGuideComplicationBtn','settingShowSapDap','settingCriticalPopup']){
  must(html.includes(`id="${id}"`),`V14.6.4 clinical alert UI missing ${id}`);
}
must(app.includes('function maybeShowCriticalClinicalAlert'),'critical alert popup logic missing');
must(app.includes('syncAlertEpisodes')&&app.includes('WF.classifyAlert'),'configured alert classifier must be used');
must(app.includes('CLINICAL_GUIDES')&&app.includes("hypotension:{")&&app.includes("hypoxemia:{"),'quick clinical guide content missing');
must(app.includes('function renderSapDapVisibility'),'SAP/DAP visibility setting missing');
must(css.includes('body.hide-sap-dap .sap-dap-helper'),'SAP/DAP hide CSS missing');
must(app.includes('criticalPopupEnabled:true')&&app.includes('showSapDap:true'),'new alert settings should have explicit defaults');

// V14.6.4 reliability & safety
must(app.includes('async function idbGetMeta')&&app.includes('async function reconcileCurrentFromMirror'),'IndexedDB current-case recovery path missing');
must(app.includes('caseActivityEpoch(')&&app.includes('Restore this newer clinical state'),'mirror freshness / restore prompt missing');
must(html.includes('id="settingDiazepamDose"')&&html.includes('id="settingAdrenalineDose"'),'built-in protocol dose settings missing');
must(app.includes('function activeBuiltInProtocol')&&app.includes("protocolNumber('diazepamDose'"),'calculator must use protocol-controlled built-in doses');
must(app.includes('builtInProtocol:{')&&app.includes("unit:'mg/kg'"),'protocol snapshot must freeze built-in dose units');
must(app.includes('Concentration unit')&&app.includes('concUnit'),'explicit Hospital Drug Library concentration units missing');
must(app.includes("cu==='μg/mL'?conc/1000:conc")&&app.includes("cu==='mg/mL'?conc*1000:conc"),'mg/μg concentration conversion path missing');
must(app.includes('function ensureAlertEpisode')&&app.includes('CLINICAL_ALERT_ACKNOWLEDGED')&&app.includes('CLINICAL_ALERT_RESOLVED'),'clinical alert episode lifecycle missing');
must(app.includes('async function verifyBackupPayloadIntegrity')&&app.includes('checksum mismatch'),'backup checksum validation missing');
must(sw.includes("message")&&sw.includes('SKIP_WAITING')&&!sw.includes("install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting()"),'service worker update must wait for explicit activation');
must(html.includes('id="updateBanner"')&&app.includes('Finish / archive current case before updating'),'safe PWA update UI missing');
must(app.includes('caseLowestMap')&&app.includes('caseLowestSpo2')&&app.includes('Emergency return to OR recorded'),'previous anesthesia warning expansion missing');

console.log(`ANESVET V14.7.2 regression checks: PASS (${ids.length} unique HTML ids, ${fnNames.length} unique named functions)`);

// V14.7.2 compatibility and integration contracts.
for(const key of ['anesvet_v14_3_current','anesvet_v14_3_settings','anesvet_v14_3_archive','anesvet_v14_3_protocol_audit'])must(app.includes(key),'original key retained: '+key);
must(html.indexOf('clinical-workflow.js')<html.indexOf('app.js'),'helper loads before application');
must(sw.includes('clinical-workflow.js?v=14.7.2'),'offline cache includes helper');
must(count(app,/\$\('orStickyRecordBtn'\)\?\.addEventListener/g)===1,'sticky record listener must bind once');
for(const id of ['alertProtocolDialog','orQuickDrugDialog','orProblemPanel','recoveryProblemPanel','recoveryHandoffText','reportRecoveryHandoff'])must(ids.includes(id),'new UI '+id);
for(const file of [...sw.matchAll(/'\.\/([^']+)'/g)].map(x=>x[1].split('?')[0]))must(fs.existsSync(path.join(root,file)),'cache asset exists: '+file);
for(const id of ['orPrimaryActionBtn','orSecondaryPhaseBtn','orPrimaryDrugBtn','orStickyDrugBtn','orAirwayPanelDetails','orFluidPanelDetails','orQuickInductionSkipBtn','orQuickDrugDoneBtn','recoveryMedicationBtn','recoveryHandoffSummary'])must(ids.includes(id),'V14.7.2 OR LIVE UX control '+id);
must(app.includes("state.inductionDocumentationMode='deferred-v1472'")&&app.includes("triggerOrMilestone('Induction')"),'Start induction must timestamp the milestone without forcing dose entry');
must(app.includes('function nextInductionQuickDrugIndex')&&app.includes('Induction medications reviewed'),'multi-drug induction review flow missing');
must(app.includes("source:induction?'OR Induction':recovery?'Recovery Medication':'OR Quick Drug'"),'induction/recovery medication sources must be distinct');
must(app.includes('adminEpoch:b.adminEpoch')&&app.includes('retrospective:'),'retrospective induction administration time support missing');
must(app.includes('function renderRecoveryHandoffSummary')&&css.includes('.handoff-summary-grid'),'compact recovery handoff missing');
must(app.includes("airwayWorkflowContext==='intubation'")&&app.includes("triggerOrMilestone('Intubation')"),'Airway save must be able to create the Intubation milestone');
must(css.includes('.or-live-page>.or-status-row{display:none}')&&css.includes('.or-live-page .or-alert-panel,.or-live-page .complication-watch-panel{display:none}'),'duplicate OR LIVE workspaces should be visually suppressed');
must(count(html,/class="or-milestone"/g)>=5,'legacy milestone hooks must remain for compatibility');
console.log('V14.7.2 integration and storage contracts: PASS');
