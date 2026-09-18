import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'style.css'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));

const count=(s,re)=>(s.match(re)||[]).length;
const must=(cond,msg)=>assert.ok(cond,msg);

// Core version / structure
must(manifest.name.includes('V14.5'),'manifest should be V14.5');
must(count(app,/function\s+phaseLabel\s*\(/g)===1,'phaseLabel must be declared once');
const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
must(new Set(ids).size===ids.length,'HTML ids must be unique');

// Temperature UX: input is display-only; clinical records remain canonical Fahrenheit internally.
must(html.includes('id="settingTemperatureUnit"'),'temperature unit setting missing');
must(app.includes("temperatureUnit:'C'"),'Thailand default display should be Celsius');
must(app.includes("temp:tempInputStoredF('temp')"),'anesthesia snapshot must canonicalize temperature');
must(app.includes("temp=tempNA?null:tempInputStoredF('recTemp')"),'recovery snapshot must canonicalize temperature');
must(app.includes("Temp_F_canonical")&&app.includes("Temp_C"),'CSV should identify both temperature units');
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

// Patient / data integrity
must(html.includes('id="hospitalId"')&&html.includes('id="visitId"'),'HN and Visit IDs must remain separate');
must(app.includes('findMergeTarget(')&&app.includes('mergedPatientIds'),'Patient Master duplicate lifecycle missing');
must(app.includes('SESSION_LOCK_KEY')&&app.includes('BroadcastChannel'),'multi-tab protection missing');
must(app.includes('computeCaseChecksum(')&&app.includes("checksumAlgorithm='SHA-256'"),'archive checksum path missing');

// Recovery transition + explicit N/A
must(html.includes('recovery-observation-na-btn')&&html.includes('recovery-check-na-btn'),'Recovery N/A controls missing');
must(html.includes('id="recNaReason"'),'Recovery N/A reason field missing');
must(app.includes('recoveryNAReasonValid()'),'Recovery N/A reason validation missing');
must(app.includes("state.casePhase='recovery'")&&app.includes("state.casePhase='complete'"),'Recovery phase transitions missing');
must(app.includes('Recovery readiness ยังไม่ครบ'),'Recovery readiness guard missing');

// Dose / age / fluid regression anchors
must(app.includes("d.mode==='mgkg'")&&app.includes('const total=weight*dose'),'mg/kg dose calculation path missing');
must(app.includes('function agePartsFromDob'),'age calculation missing');
must(app.includes('function getFluidMetrics'),'fluid integration missing');

// Backup / restore
must(app.includes("format:'ANESVET_BACKUP',version:'14.5'"),'backup version must be 14.5');
must(app.includes("raw.format!=='ANESVET_BACKUP'")&&app.includes('idbClearCases()'),'backup restore integrity path missing');

// Reset must preserve persistent stores by only resetting current case state.
must(app.includes('state=freshState()')&&app.includes("localStorage.setItem(CURRENT_KEY,JSON.stringify(state))"),'fresh reset path missing');
must(!/function resetCurrent\([\s\S]*?localStorage\.removeItem\(SETTINGS_KEY\)/.test(app),'reset must not delete settings');

// Print/PDF hardening anchors
must(css.includes('display:table-header-group'),'print table headers should repeat');
must(css.includes('page-break-inside:avoid'),'print rows/cards should avoid splitting');
must(css.includes('overflow-wrap:anywhere'),'print long text should wrap');

console.log('ANESVET V14.5 regression checks: PASS');
