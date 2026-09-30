/* R20: regression for Android startup ReferenceError in V17.2.14 / R19. */
'use strict';
const fs=require('fs'),assert=require('assert'),vm=require('vm'),path=require('path');
const root=__dirname, app=fs.readFileSync(path.join(root,'app.js'),'utf8'),html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const ctrlModule=require(path.join(root,'finalization-archive-controller.js'));
const tests=[];
function t(label,run){try{run();console.log('PASS',label);tests.push({label,passed:true})}catch(e){console.error('FAIL',label,e.stack);tests.push({label,passed:false});process.exitCode=1}}
let pref='summary',els=new Map();
function el(id){if(!els.has(id)){const e={flags:new Set(),classList:{toggle(cls,on){if(on)e.flags.add(cls);else e.flags.delete(cls)}}};els.set(id,e)}return els.get(id)}
const ctx={$:el,$$:()=>[],getState:()=>({}),currentSettingsObject:()=>({defaultReport:pref})};
const controller=ctrlModule.create(ctx);
t('Controller initialized with existing dependency injection',()=>assert(controller));
t('R20 exports the renderer from finalization controller',()=>assert.strictEqual(typeof controller.renderDefaultReportPreference,'function'));
t('Hospital default summary highlights Summary PDF',()=>{pref='summary';controller.renderDefaultReportPreference();assert(el('endExportSummaryPdfBtn').flags.has('primary'));assert(!el('endExportPdfBtn').flags.has('primary'))});
t('Hospital default full highlights Full PDF',()=>{pref='full';controller.renderDefaultReportPreference();assert(!el('endExportSummaryPdfBtn').flags.has('primary'));assert(el('endExportPdfBtn').flags.has('primary'))});
t('Unset preference safely falls back to summary',()=>{pref=null;controller.renderDefaultReportPreference();assert(el('endExportSummaryPdfBtn').flags.has('primary'))});
t('Missing PDF buttons do not crash Startup',()=>{const c=ctrlModule.create({...ctx,$:()=>null});assert.doesNotThrow(()=>c.renderDefaultReportPreference())});
const functionCode='function renderDefaultReportPreference(){return FINALIZATION_ARCHIVE_CONTROLLER.renderDefaultReportPreference()}';
t('app.js supplies controller bridge instead of calling undefined symbol',()=>assert(app.includes(functionCode)));
t('Startup loadSettings includes bridge after other preferences',()=>{const start=app.indexOf('function loadSettings(){'),end=app.indexOf('function applyHospitalDefaultsToFreshCaseUi(){',start);assert(start>0&&end>start);assert(app.slice(start,end).includes('renderOrWorkspacePreferences();renderDefaultReportPreference();'))});
t('Save Settings also invokes bridge',()=>{assert(app.includes('renderDefaultReportPreference();toast('))});
t('Bridge executes successfully during startup sequence',()=>{pref='summary';let called=0;vm.runInNewContext(functionCode+';renderProtocolGovernance();renderProtocolDoseReview();renderOrWorkspacePreferences();renderDefaultReportPreference();', {FINALIZATION_ARCHIVE_CONTROLLER:controller,renderProtocolGovernance(){called++},renderProtocolDoseReview(){called++},renderOrWorkspacePreferences(){called++}});assert.strictEqual(called,3);assert(el('endExportSummaryPdfBtn').flags.has('primary'))});
t('Controller script loads before app.js',()=>{const c=html.indexOf('src="./finalization-archive-controller.js?v=17.2.24"'),a=html.indexOf('src="./app.js?v=17.2.24"');assert(c>=0&&a>c)});
t('Startup reaches ready() only after loadSettings() and initial UI',()=>{const startup=app.indexOf('loadSettings();applyHospitalDefaultsToFreshCaseUi();');assert(startup>=0&&app.indexOf("BOOT?.ready?.('startup-complete')",startup)>startup)});
console.log('R20_BOOT_REPORT_PREFERENCE',JSON.stringify({passed:tests.filter(x=>x.passed).length,total:tests.length}));
