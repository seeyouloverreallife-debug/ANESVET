'use strict';
/* Focused deterministic interaction harness. No patient data; no browser dependency. */
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const html=fs.readFileSync(path.join(__dirname,'index.html'),'utf8');
const code=html.match(/<script id="anesvetBootSentinel">([\s\S]*?)<\/script>/)?.[1];
assert(code,'boot sentinel present');new vm.Script(code);
class FakeElement{
  constructor(id='',doc){this.id=id;this.doc=doc;this.hidden=false;this.attributes={};this.dataset={};this.children=[];this.listeners={};this.textContent='';this.value='';this.tagName='DIV';this.className='';this.style={};this.classList={toggle:()=>{},contains:()=>false};}
  setAttribute(key,value){this.attributes[key]=String(value)}
  hasAttribute(key){return key in this.attributes}
  addEventListener(type,cb){(this.listeners[type]??=[]).push(cb)}
  fire(type){for(const cb of this.listeners[type]||[])cb({target:this,currentTarget:this,stopPropagation(){}})}
  focus(){}
  appendChild(el){this.children.push(el);if(el.id)this.doc.map.set(el.id,el);return el}
  append(...els){this.children.push(...els)}
  replaceChildren(...els){this.children=els}
  querySelector(sel){if(sel[0]==='#')return this.doc.getElementById(sel.slice(1));return null}
  querySelectorAll(){return []}
  closest(){return null}
  set innerHTML(html){this._html=html;for(const match of html.matchAll(/\bid="([^"]+)"/g)){if(!this.doc.map.has(match[1]))this.doc.map.set(match[1],new FakeElement(match[1],this.doc))}}
  get innerHTML(){return this._html||''}
}
function run(){
  const doc={map:new Map(),events:{},visibilityState:'visible',
    getElementById(id){return this.map.get(id)||null},
    createElement(){return new FakeElement('',this)},
    addEventListener(name,fn){(this.events[name]??=[]).push(fn)},
    querySelectorAll(){return []},querySelector(){return null},
    elementFromPoint(){return null}};
  const body=new FakeElement('body',doc);body.className='';body.classList={contains:()=>false};body.inert=false;doc.body=body;
  const btn=new FakeElement('bootDiagnosticBtn',doc),badge=new FakeElement('anesvetIssueBadge',doc);badge.hidden=true;doc.map.set(btn.id,btn);doc.map.set(badge.id,badge);
  const ls=new Map(),ss=new Map(),timeouts=[];
  const windowListeners={}, win={addEventListener(name,cb){(windowListeners[name]??=[]).push(cb)},getSelection(){return{removeAllRanges(){},addRange(){}}},confirm:()=>true};
  const env={window:win,document:doc,localStorage:{getItem:k=>ls.get(k)||null,setItem:(k,v)=>ls.set(k,v)},sessionStorage:{getItem:k=>ss.get(k)||null},
    location:{href:'https://local.example/ANESVET/'},navigator:{userAgent:'Test browser',clipboard:{writeText:async()=>{}}},
    setTimeout:(fn,ms)=>{timeouts.push({fn,ms})},Date,JSON,String,Number,Object,Math,console,Error};
  vm.createContext(env);vm.runInContext(code,env);
  const boot=win.ANESVET_BOOT_DIAGNOSTIC;
  assert(boot);
  assert.strictEqual(body.children.length,0,'nothing pops up on load');
  assert.strictEqual(badge.hidden,true);
  boot.fail(new Error('Simulated startup failure'),{source:'test-app.js'});
  assert.strictEqual(body.children.length,0,'no overlay after failure');
  assert.strictEqual(badge.hidden,false,'badge lights up');
  assert.strictEqual(badge.textContent,'1','one unseen issue');
  boot.fail(new Error('Simulated startup failure'),{source:'test-app.js'});
  assert.strictEqual(badge.textContent,'1','duplicate groups collapse');
  assert.strictEqual(boot.issues().length,1,'duplicate group deduplicated');
  assert.strictEqual(boot.issues()[0].count,2,'occurrences preserved');
  btn.fire('click');
  assert.strictEqual(body.children.length,1,'panel only created on click');
  const panel=doc.getElementById('anesvetBootDiagnosticPanel');assert(panel);
  assert.strictEqual(panel.hidden,false,'panel open');
  assert.strictEqual(badge.hidden,true,'reading clears badge');
  assert.strictEqual(doc.getElementById('anesvetIssueList').children.length,1,'one issue row');
  assert(doc.getElementById('anesvetDiagPre').textContent.includes('Simulated startup failure'),'report accessible');
  doc.getElementById('anesvetDiagClose').fire('click');
  assert.strictEqual(panel.hidden,true,'panel closable');
  boot.issue('runtime','Another real error','from demo');
  assert.strictEqual(badge.textContent,'1','new issue raises one badge');
  assert.strictEqual(panel.hidden,true,'no automatic reopening');
  assert.strictEqual(boot.issues().length,2);
  btn.fire('click');
  assert.strictEqual(doc.getElementById('anesvetIssueList').children.length,2);
  doc.getElementById('anesvetIssueDismiss').fire('click');
  assert.strictEqual(boot.issues().length,0,'clear issue notifications explicitly');
  assert.strictEqual(badge.hidden,true);
  const reportText=boot.text('manual diagnostic');assert(!reportText.includes('PATIENT-ID-SECRET'));
  doc.getElementById('anesvetDiagClose').fire('click');
  const before=body.children.length;
  boot.show('auto-system-diagnostic');
  assert.strictEqual(body.children.length,before,'legacy show is quiet as well');
  assert.strictEqual(badge.hidden,false);
  const index=html;
  assert(/#pilotFeedbackBtn\{display:none!important\}/.test(fs.readFileSync(path.join(__dirname,'clinical-simplicity.css'),'utf8')));
  const app=fs.readFileSync(path.join(__dirname,'app.js'),'utf8');
  assert(app.includes("BOOT?.issue?.('runtime'"),'manual caught runtime errors mirror to notification system');
  assert(app.includes('function maybeShowCriticalClinicalAlert()'),'clinical safety alerts retained');
  const m=JSON.parse(fs.readFileSync(path.join(__dirname,'manifest.webmanifest')));
  const sw=fs.readFileSync(path.join(__dirname,'service-worker.js'),'utf8');
  assert.strictEqual(m.start_url,'./?v=17.2.27');
  assert(index.includes("const VERSION='17.2.27'"));
  assert(app.includes("const APP_VERSION='17.2.27'"));
  assert(sw.includes("const CACHE='anesvet-v17-2-27-r23-silent-bug-center'"));
  assert(app.includes("const CURRENT_KEY = 'anesvet_v14_3_current'"),'patient storage key unchanged');
  const ids=[...index.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.strictEqual(ids.length,new Set(ids).size,'no duplicate HTML IDs');
  const assets=[...sw.matchAll(/"(\.\/[^"\s]+)"/g)].map(x=>x[1]);
  for(const file of assets){const name=file.replace(/^\.\//,'').split('?')[0];if(name)assert(fs.existsSync(path.join(__dirname,name)),'missing '+name)}
  console.log('PASS: no auto overlay; click icon; unread badge; grouped duplicates; issue details; manual clearing; clinical alert preserved; data keys; version/cache; assets; unique IDs');
}
run();
