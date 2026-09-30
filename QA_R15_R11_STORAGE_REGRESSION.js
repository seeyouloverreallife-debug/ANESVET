/* R11: execute actual recovery and startup code with simulated browser-storage failure. */
'use strict';
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/app.js','utf8');
const tests=[];
function test(name,fn){try{fn();tests.push([name,true]);console.log('PASS',name)}catch(e){tests.push([name,false,e.message]);console.error('FAIL',name,e.stack)}}
function extract(begin,end){const a=src.indexOf(begin);if(a<0)throw Error('missing '+begin);const b=src.indexOf(end,a+begin.length);if(b<0)throw Error('missing '+end);return src.slice(a,b)}
const helper=extract('function readLegacyCurrentCase(','function load(){');
const prelude=extract("    let raw=null,currentCorrupt=false;","    if(raw && typeof raw");
const startupGuard=extract('let startupPrimaryRaw=null;','const CASE_FRESHNESS=');
const preference=extract('function safeStartupPreference(','let alertFeedbackEnabled=');
const legacyKey='anesvet_v13_3_current';
function storage({contents={},throwReads=[],throwWrites=false,silentWrites=false}={}){
 const data={...contents},calls={reads:[],writes:[],deletes:[]};
 return {data,calls,getItem(key){calls.reads.push(key);if(throwReads.includes(key))throw Error('SecurityError: read');return data[key]??null},setItem(key,value){calls.writes.push(key);if(throwWrites)throw Error('QuotaExceededError');if(!silentWrites)data[key]=value},removeItem(key){calls.deletes.push(key);delete data[key]}};
}
function ctx(store,active=true){const marks=[];const scope={localStorage:store,CURRENT_KEY:'anesvet_current',BOOT:{mark:(...x)=>marks.push(x)},sessionActive:()=>active,SESSION_CONTROLLER:{verifyOwnership:()=>true},startupRecoveryNotice:null,migrateV3Case:x=>({...x,migratedFromV3:true}),recoverFromSafetyCheckpoint:x=>x,JSON};vm.createContext(scope);vm.runInContext(helper,scope);return{scope,marks}}
function run(store,active=true){const {scope,marks}=ctx(store,active);const script=`(function(){${startupGuard}\n${prelude}\nreturn {raw,currentCorrupt,notice:startupRecoveryNotice};})()`;return {...vm.runInContext(script,scope),marks}}
function read(store){const {scope}=ctx(store);return scope.readLegacyCurrentCase(store,x=>({...x,migratedFromV3:true}))}
test('valid current case takes priority over old snapshots',()=>{const st=storage({contents:{anesvet_current:JSON.stringify({caseId:'new',patientName:'New'}),[legacyKey]:JSON.stringify({caseId:'old'})}});const r=run(st);assert.equal(r.raw.caseId,'new');assert.deepStrictEqual(st.calls.writes,[])});
test('corrupt newest legacy snapshot does not mask valid later one',()=>{const st=storage({contents:{anesvet_v14_2_current:'{broken',[legacyKey]:JSON.stringify({caseId:'ok',patientName:'Bee'})}});const r=run(st);assert.equal(r.raw.caseId,'ok');assert.equal(JSON.parse(st.data.anesvet_current).caseId,'ok')});
test('VIEW ONLY loads previous case without overwriting active writer',()=>{const st=storage({contents:{[legacyKey]:JSON.stringify({caseId:'previous'})}});const r=run(st,false);assert.equal(r.raw.caseId,'previous');assert.equal(st.calls.writes.length,0);assert(r.notice.reason.includes('memory only'))});
test('denied read for one legacy key skips to next candidate',()=>{const st=storage({contents:{[legacyKey]:JSON.stringify({caseId:'ok'})},throwReads:['anesvet_v14_2_current']});assert.equal(read(st).caseData.caseId,'ok')});
test('corrupt primary is retained byte-for-byte when legacy case is found',()=>{const st=storage({contents:{anesvet_current:'{corrupt',[legacyKey]:JSON.stringify({caseId:'prior',patientName:'Old'})}});const r=run(st);assert.equal(r.raw.caseId,'prior');assert.equal(st.data.anesvet_current,'{corrupt');assert(!st.calls.writes.includes('anesvet_current'));assert(r.notice.reason.includes('unreadable'))});
test('storage permission denied on migration write still loads case in memory with warning',()=>{const st=storage({contents:{[legacyKey]:JSON.stringify({caseId:'ok'})},throwWrites:true});const r=run(st);assert.equal(r.raw.caseId,'ok');assert(r.notice.reason.includes('memory only'));assert.equal(st.data.anesvet_current,undefined)});
test('silently dropped storage write is not treated as a persisted recovery',()=>{const st=storage({contents:{[legacyKey]:JSON.stringify({caseId:'ok'})},silentWrites:true});assert(run(st).notice.reason.includes('memory only'))});
test('verified migration does not display inaccurate storage warning',()=>{const st=storage({contents:{[legacyKey]:JSON.stringify({caseId:'ok'})}});const r=run(st);assert.equal(r.notice,null);assert.deepEqual(r.marks.at(-1),['legacy-current-restored',legacyKey])});
test('prior-version candidate remains intact after migration',()=>{const srcCase={caseId:'one',patientName:'Dog'};const st=storage({contents:{[legacyKey]:JSON.stringify(srcCase)}});run(st);assert.deepStrictEqual(JSON.parse(st.data[legacyKey]),srcCase);assert.equal(st.calls.deletes.length,0)});
test('legacy v9 migration retains original semantics',()=>{const st=storage({contents:{anesvet_v9_current:JSON.stringify({caseId:'9'})}});const r=read(st);assert.equal(r.caseData.casePhase,'intraop');assert(Array.isArray(r.caseData.responses));assert(Array.isArray(r.caseData.corrections))});
test('legacy v8 and v7 ensure response arrays',()=>{for(const key of ['anesvet_v8_current','anesvet_v7_current']){const r=read(storage({contents:{[key]:JSON.stringify({caseId:key})}}));assert(Array.isArray(r.caseData.responses))}});
test('legacy v6.1 initializes pre-op fields',()=>{const st=storage({contents:{anesvet_v6_1_current:JSON.stringify({caseId:'v61'})}});const r=read(st);assert.equal(r.caseData.caseStartedAt,null);assert.deepEqual(JSON.stringify(r.caseData.preopChecks),'{}')});
test('legacy v5/v4 signalment bootstrap preserved',()=>{for(const key of ['anesvet_v5_current','anesvet_v4_current']){const r=read(storage({contents:{[key]:JSON.stringify({caseId:key,patientName:'Test'})}}));assert.equal(r.caseData.bcs,'5');assert.equal(r.caseData.patientSaved,true);assert.equal(r.caseData.breed,'')}});
test('legacy v3 passes through temperature conversion adapter',()=>{const st=storage({contents:{anesvet_v3_current:JSON.stringify({caseId:'v3'})}});assert.equal(read(st).caseData.migratedFromV3,true)});
test('ignore malformed JSON arrays and scalar candidates',()=>{const st=storage({contents:{anesvet_v14_2_current:'[]',anesvet_v14_1_current:'15',anesvet_v14_current:JSON.stringify({caseId:'valid'})}});assert.equal(read(st).caseData.caseId,'valid')});
test('missing all current versions returns null without writes',()=>{const st=storage();const r=run(st);assert.equal(r.raw,null);assert.equal(st.calls.writes.length,0)});
test('session storage preference safe-read tolerates SecurityError',()=>{const st=storage({throwReads:['tab']});const scope={localStorage:st,BOOT:{mark:()=>{}},JSON};vm.createContext(scope);vm.runInContext(preference,scope);assert.equal(scope.safeStartupPreference('tab'),null)});
test('saved tab preference uses safe accessor in bootstrap',()=>{assert(src.includes("let storedTab=safeStartupPreference(TAB_KEY)||'casesummary';"))});
test('alert feedback preference uses safe accessor',()=>{assert(src.includes("let alertFeedbackEnabled=safeStartupPreference(ALERT_PREF_KEY)!=='off';"))});
test('mirror write failure returns false instead of crashing bootstrap',()=>{assert(src.includes("BOOT?.mark?.('current-mirror-restore-write-failed')"));assert(src.includes('The original saved case was preserved'))});
test('original recover-from-checkpoint occurs before legacy fallback',()=>{assert(prelude.indexOf('recoverFromSafetyCheckpoint(raw,currentCorrupt)')<prelude.indexOf('readLegacyCurrentCase('))});
const passed=tests.filter(x=>x[1]).length;console.log(JSON.stringify({suite:'r11-storage-safe-startup',passed,total:tests.length,failed:tests.filter(x=>!x[1])},null,2));if(passed!==tests.length)process.exitCode=1;
