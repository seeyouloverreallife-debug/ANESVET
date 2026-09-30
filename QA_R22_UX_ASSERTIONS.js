/* UI-only R22 regression: exercise the new layout script with synthetic DOM.
 * This is not a replacement for Android/iPad visual E2E. */
'use strict';
const fs=require('fs'),vm=require('vm'),path=require('path'),assert=require('assert');
const root=__dirname,script=fs.readFileSync(path.join(root,'clinical-simplicity.js'),'utf8'),css=fs.readFileSync(path.join(root,'clinical-simplicity.css'),'utf8');
const make=(id,classes=[])=>({id, parentElement:null,classList:{contains:x=>classes.includes(x)},dataset:{},callbacks:{},setAttribute(k,v){this[k]=v},addEventListener(k,fn){this.callbacks[k]=fn},click(){this.callbacks.click?.()},textContent:'',insertAdjacentElement(pos,el){assert.equal(pos,'afterend');move(this.parentElement,el,this.parentElement.children.indexOf(this)+1)}});
function move(parent,el,index){if(el.parentElement){let a=el.parentElement.children;let i=a.indexOf(el);a.splice(i,1);if(parent===el.parentElement&&i<index)index--;};parent.children.splice(index,0,el);el.parentElement=parent;}
const $map={};const reg=n=>($map[n.id]=n,n);
const page=reg(make('orlive',['tabpage','active'])),focus=reg(make('orVitalsFocus'));
const primary=make('primary'),vitals=make('vitals'),status=make('status'),meds=reg(make('orMedicationQueue')),secondary=make('secondary'),guardian=reg(make('orDocumentationGuardian')),context=reg(make('orCaseContextPanel')),tracker=make('tracker');
page.children=[];page.querySelector=s=>({'.or-primary-flow':primary,'.or-vital-grid':vitals,'.or-status-row':status,'.or-secondary-grid':secondary,'.or-phase-tracker-panel':tracker})[s]||null;
page.insertBefore=(el,before)=>move(page,el,page.children.indexOf(before));
for(const el of [focus,meds,guardian,context,tracker,status,vitals,secondary,primary]){el.parentElement=page;page.children.push(el)}
const actions=make('actions');actions.children=[];actions.insertBefore=(el,before)=>move(actions,el,0);Object.defineProperty(actions,'firstChild',{get(){return actions.children[0]||null}});
const originalReturn=reg(make('orMobileCaseSummaryBtn'));let navCalls=0;originalReturn.addEventListener('click',()=>navCalls++);
const recovery=reg(make('recovery',['tabpage']));reg(make('recoveryMoreCaseSummaryBtn'));
const labels=['.workflow-tabs .tab[data-tab="drugs"] span:last-child','.workflow-tabs .tab[data-tab="orlive"] span:last-child','[data-mobile-tab="drugs"] b','[data-mobile-tab="orlive"] b','#orMobileMoreBtn b','#recoveryMobileMoreBtn b','#orMobileRecordBtn b','#orMobileMedsBtn b','#recoveryMobileMedicationBtn b'];
const labelNodes=Object.fromEntries(labels.map(k=>[k,make(k)]));
const document={readyState:'complete',documentElement:{classList:{add(){}}},getElementById:id=>$map[id]||actions.children.find(n=>n.id===id)||null,querySelector:s=>s==='.topbar .top-actions'?actions:labelNodes[s]||null,createElement:tag=>{assert.equal(tag,'button');return make('')} };
vm.runInNewContext(script,{document,window:{},console});
const ordered=page.children.map(x=>x.id);assert.deepEqual(ordered.slice(0,8),['primary','orVitalsFocus','vitals','status','orMedicationQueue','secondary','orDocumentationGuardian','orCaseContextPanel']);
assert.equal(ordered[8],'tracker');assert.equal(new Set(page.children).size,9);
assert.strictEqual($map.orVitalsFocus,focus);assert.strictEqual($map.orMedicationQueue,meds);
assert.equal($map.orlive.dataset.uxR22Or,'1');
assert.equal(labelNodes['.workflow-tabs .tab[data-tab="orlive"] span:last-child'].textContent,'OR LIVE');
assert.equal(labelNodes['#orMobileMoreBtn b'].textContent,'เมนู');
const back=document.getElementById('uxR22ReturnCase');assert(back,'mobile case back button created');back.click();assert.equal(navCalls,1,'back invokes controller-owned case summary button');
assert(css.includes('body.recovery-mobile-active #recovery.active>*{order:20}'),'all mobile recovery siblings assigned default late order');
assert(css.includes('#recovery>.dashboard-grid{order:2}'),'recovery observation grid prioritized');
assert(css.includes('#recovery>#recoveryProblemsPanel{order:3}'),'problems prioritized');
assert(!/localStorage|sessionStorage|case\.records|record\s*=/.test(script),'UI module does not touch patient storage');
console.log('R22 UX ASSERTIONS: 12/12 PASS (synthetic DOM + static safeguards)');
