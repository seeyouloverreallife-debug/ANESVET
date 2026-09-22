import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const must=(c,m)=>assert.ok(c,m);
must(app.includes("const APP_VERSION='15.0.0'"),'APP_VERSION must be V15.0.0');
must(manifest.name.includes('V15.0.0')&&manifest.start_url.includes('15.0.0'),'manifest must identify V15.0.0');
must(sw.includes('anesvet-v15-0-0-hospital-pilot'),'service-worker cache must identify hospital pilot release');
// Verified active-case safety checkpoint
must(app.includes("SAFETY_CHECKPOINT_FORMAT='ANESVET_ACTIVE_SAFETY_CHECKPOINT_V1'"),'safety checkpoint format missing');
must(app.includes('function writeSafetyCheckpoint')&&app.includes('Safety checkpoint verification failed'),'checkpoint read-after-write verification missing');
must(app.includes('function recoverFromSafetyCheckpoint')&&app.includes('SAFETY_CHECKPOINT_RECOVERED'),'checkpoint recovery/audit path missing');
must(app.includes('clearSafetyCheckpoint();\n  localStorage.setItem(CURRENT_KEY'),'reset must clear stale safety checkpoint');
must(html.includes('id="safetyRecoveryBanner"')&&html.includes('id="safetyRecoveryText"'),'recovery notice UI missing');
// Medication basis must remain bound to current case / BW / frozen protocol
must(app.includes('protocolVersion:state.protocolSnapshot?.version')&&app.includes('weightKg:currentWeightKg()'),'medication dialog safety basis missing');
must(app.includes("SAFETY STOP: patient/BW/protocol changed"),'stale medication calculation safety stop missing');
must(app.includes('medicationSaveInFlight')&&app.includes("saveBtn.disabled=true"),'rapid double-tap medication guard missing');
// Recovery exception must be explicit and auditable, and final lock requires recovery completion
must(app.includes('recoveryCompletionOverride'),'recovery completion override record missing');
must(app.includes('Reason for completing despite incomplete readiness (required)'),'recovery override reason must be required');
must(app.includes("OVERRIDE: '+completionOverride.reason"),'recovery override must be in audit detail');
must(app.includes("if(!state.recoveryCompletedAt){toast('Recovery must be completed or completed with a documented override before final lock')"),'final lock must require recovery completion');
must(app.includes('const ready=!!state.recoveryCompletedAt&&signoffReady'),'End Case readiness must include recovery completion');
must(app.includes('caseIdentitySnapshot')&&app.includes('function caseIdentityChanges'),'case-start patient identity/BW snapshot guard missing');
must(app.includes("CASE_IDENTITY_BW_CORRECTED")&&app.includes('Reason for correction (required)'),'active-case identity/BW correction must require audit reason');
console.log('ANESVET V15.0.0 Hospital Pilot safety contracts: PASS');
