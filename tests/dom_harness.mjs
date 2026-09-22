import {createRequire} from 'node:module';
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const require=createRequire(import.meta.url),dep=n=>process.env.TEST_NODE_MODULES?require(path.join(process.env.TEST_NODE_MODULES,n)):require(n);
const {JSDOM,VirtualConsole}=dep('jsdom'),{IDBFactory,IDBKeyRange}=dep('fake-indexeddb');
const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
export async function createDomApp({current,settings,archive,seedStorage={}}={}){
 const errors=[],vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/navigation|window.print/.test(e.message))errors.push(e.message)});
 const dom=new JSDOM(fs.readFileSync(root+'/index.html','utf8').replace(/<script\b[^>]*src=[\s\S]*?<\/script>/g,''),{url:'http://anesvet.test/',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc}),w=dom.window;
 Object.defineProperty(w,'indexedDB',{value:new IDBFactory()});w.IDBKeyRange=IDBKeyRange;Object.defineProperty(w.crypto,'subtle',{value:crypto.webcrypto.subtle});w.TextEncoder=TextEncoder;w.structuredClone=structuredClone;w.scrollTo=()=>{};w.confirm=()=>true;w.prompt=(msg,def='')=>def||'TEST reason';w.alert=()=>{};
 w.HTMLDialogElement.prototype.showModal=function(){this.open=true};w.HTMLDialogElement.prototype.close=function(){this.open=false};
 const ctx=new Proxy({measureText:()=>({width:10}),createLinearGradient:()=>({addColorStop(){}}),setTransform(){}},{get:(o,k)=>o[k]||(()=>{})});w.HTMLCanvasElement.prototype.getContext=()=>ctx;
 const seed={...seedStorage};if(current)seed.anesvet_v14_3_current=current;if(settings)seed.anesvet_v14_3_settings=settings;if(archive)seed.anesvet_v14_3_archive_legacy=archive;
 for(const [k,v] of Object.entries(seed))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
 w.addEventListener('error',e=>errors.push(e.error?.stack||e.message));w.eval(fs.readFileSync(root+'/clinical-workflow.js','utf8'));
 // Test-only access to real production functions; no clinical function is replaced.
 let app=fs.readFileSync(root+'/app.js','utf8');const pos=app.lastIndexOf('})();');app=app.slice(0,pos)+`globalThis.__test={getState:()=>state,activeAlertProtocol,currentSettingsObject,computeCaseChecksum,verifyBackupPayloadIntegrity,calculateLibraryDrug,recordDrugAdministration,voidDrugAdministration,caseLowestMap,caseLowestSpo2,caseLowestTemp,save,buildPdfReport,getArchive,renderRecoveryHandoff};\n`+app.slice(pos);
 await w.eval(app);const settle=()=>new Promise(r=>setTimeout(r,30));await settle();const el=id=>w.document.getElementById(id);
 const set=(id,value)=>{const e=el(id);if(!e)throw Error('Missing field '+id);if(e.type==='checkbox')e.checked=!!value;else e.value=String(value);e.dispatchEvent(new w.Event(e.type==='checkbox'||e.tagName==='SELECT'?'change':'input',{bubbles:true}))};
 const click=async id=>{const e=el(id);if(!e)throw Error('Missing button '+id);e.click();await settle()};
 return {dom,w,el,set,click,settle,state:()=>JSON.parse(w.localStorage.getItem('anesvet_v14_3_current')),api:w.__test,errors,close:()=>w.close()};
}
export async function setupPatient(a,{species='dog',weight=12.5}={}){a.set('patientName','TEST V14.7');a.set('species',species);a.set('weight',weight);a.set('bcs',5);a.w.document.querySelector('.asa-card[data-asa="II"]').click();a.set('anesthetist','Dr Test');a.set('surgeon','Dr Surgeon');await a.click('savePatientBtn')}
