import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';

const root=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const body=(html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]||'').replace(/<script[^>]*src="\.\/app\.js[^>]*><\/script>/i,'');
const chromium=process.env.CHROMIUM_BIN||'/usr/bin/chromium';
if(!fs.existsSync(chromium))throw new Error(`Chromium not found: ${chromium}`);

const port=9451;
const profile='/tmp/anesvet-v1464-e2e-profile';
fs.rmSync(profile,{recursive:true,force:true});
const chrome=spawn(chromium,[
  `--remote-debugging-port=${port}`,'--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--disable-background-networking','--no-first-run','--no-default-browser-check',`--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','ignore','ignore']});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let ws;
try{
  let targets;
  for(let i=0;i<80;i++){
    try{targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();if(targets?.length)break}catch{}
    await sleep(100);
  }
  if(!targets?.length)throw new Error('Chromium DevTools target did not start');
  const page=targets.find(x=>x.type==='page')||targets[0];
  ws=new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
  let seq=0;const pending=new Map();
  ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pending.has(m.id)){pending.get(m.id)(m);pending.delete(m.id)}};
  const command=(method,params={})=>new Promise(resolve=>{const id=++seq;pending.set(id,resolve);ws.send(JSON.stringify({id,method,params}))});
  async function evalJs(expression,{awaitPromise=true}={}){
    const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise});
    if(r.result?.exceptionDetails){throw new Error(r.result.exceptionDetails.text||JSON.stringify(r.result.exceptionDetails))}
    return r.result?.result?.value;
  }
  await command('Runtime.enable');
  await command('Page.enable');

  // about:blank has an opaque origin. Replace Web Storage with deterministic in-page stores.
  await evalJs(`(()=>{function store(){const m=new Map();return{getItem:k=>m.has(String(k))?m.get(String(k)):null,setItem:(k,v)=>m.set(String(k),String(v)),removeItem:k=>m.delete(String(k)),clear:()=>m.clear(),key:i=>[...m.keys()][i]??null,get length(){return m.size}}}Object.defineProperty(window,'localStorage',{value:store(),configurable:true});Object.defineProperty(window,'sessionStorage',{value:store(),configurable:true});window.confirm=()=>true;window.prompt=(msg,def='')=>def||'';window.alert=()=>{};if(typeof BroadcastChannel==='undefined')window.BroadcastChannel=class{postMessage(){}close(){}addEventListener(){}};return true})()`);
  await evalJs(`document.body.innerHTML=${JSON.stringify(body)};document.title='ANESVET E2E';true`);
  await evalJs(app);
  await sleep(500);

  // Scenario A: New Patient current BW must propagate immediately after Save.
  await evalJs(`(()=>{const set=(id,v)=>{const e=document.getElementById(id);e.value=v;e.dispatchEvent(new Event(e.tagName==='SELECT'?'change':'input',{bubbles:true}))};set('patientName','E2E New Patient');set('species','dog');set('weight','12.5');set('bcs','5');set('asa','2');document.getElementById('savePatientBtn').click();return true})()`);
  await sleep(700);
  assert.equal(await evalJs(`document.getElementById('drugWeight').textContent.trim()`),'12.5 kg','Current BW did not propagate to Drug Calculator');
  assert.match(await evalJs(`document.getElementById('fluidReference').textContent`),/63 mL\/hr/,'Current BW did not propagate to fluid reference');
  assert.match(await evalJs(`document.getElementById('propofolMg').textContent`),/^50(?:\.0)? mg$/,'Default protocol Propofol calculation unexpected');

  // Scenario B: protocol-controlled built-in dose changes must drive the calculator.
  await evalJs(`(()=>{document.getElementById('settingPropofolDose').value='2';document.getElementById('saveSettingsBtn').click();return true})()`);
  await sleep(250);
  assert.match(await evalJs(`document.getElementById('propofolMg').textContent`),/^25(?:\.0)? mg$/,'Protocol-controlled Propofol dose did not update calculation');
  assert.match(await evalJs(`document.getElementById('propofolProtocolChip').textContent`),/^2(?:\.0)? mg\/kg planned$/,'Protocol chip did not reflect configured dose');

  // Scenario C: critical MAP alert must create -> acknowledge -> resolve an alert episode.
  await evalJs(`(()=>{document.querySelectorAll('.preop-check').forEach(x=>x.checked=true);document.getElementById('startCaseBtn').click();return true})()`);
  await sleep(250);
  await evalJs(`(()=>{const m=document.getElementById('map');m.value='55';m.dispatchEvent(new Event('input',{bubbles:true}));return true})()`);
  await sleep(200);
  assert.equal(await evalJs(`document.getElementById('clinicalGuideDialog').open`),true,'Critical MAP did not open clinical guide');
  await evalJs(`document.getElementById('clinicalGuideDismissBtn').click();true`);
  await sleep(150);
  let episodes=JSON.parse(await evalJs(`localStorage.getItem('anesvet_v14_3_current')`)).alertEpisodes;
  assert.equal(episodes.length,1,'Alert episode was not persisted');
  assert.ok(episodes[0].acknowledgedAt,'Alert acknowledge timestamp missing');
  await evalJs(`(()=>{const m=document.getElementById('map');m.value='72';m.dispatchEvent(new Event('input',{bubbles:true}));return true})()`);
  await sleep(180);
  episodes=JSON.parse(await evalJs(`localStorage.getItem('anesvet_v14_3_current')`)).alertEpisodes;
  assert.ok(episodes[0].resolvedAt,'Alert resolution timestamp missing');

  console.log('ANESVET V14.6.4 browser E2E smoke: PASS (BW propagation, protocol dose, alert lifecycle)');
} finally {
  try{ws?.close()}catch{}
  try{chrome.kill('SIGKILL')}catch{}
  await sleep(250);
  try{fs.rmSync(profile,{recursive:true,force:true,maxRetries:3,retryDelay:100})}catch{}
}
