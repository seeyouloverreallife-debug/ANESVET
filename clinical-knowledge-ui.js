(function(root){
'use strict';
const D=root.ANESVET_KNOWLEDGE_DATA,R=root.ANESVET_ECG_EDUCATION;
if(!D||!R){console.error('ANESVET knowledge dependencies missing');return}
const P=root.ANESVET_SPECIAL_PATIENT_KNOWLEDGE,C=root.ANESVET_COMORBIDITY_KNOWLEDGE;
const GUIDES=Object.freeze([...D.guides,...(P?.guides||[]),...(C?.guides||[])]),SOURCES=Object.freeze({...D.sources,...(P?.sources||{}),...(C?.sources||{})});
const $=id=>document.getElementById(id),esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const safeUrl=s=>/^https:\/\//.test(String(s))?String(s):'';
let tab='guides',query='',group='all',selected=null,quickTopic='',returnFocus=null,quickFocus=null,treeNode='',treeHistory=[],ecgValues={};
const canonical=s=>String(s||'').normalize('NFKC').trim().toLowerCase().replace(/[\s_\-\/().]+/g,' ').trim();
function findDrug(name){const n=canonical(name);return D.drugs.find(d=>d.aliases.some(a=>canonical(a)===n))||null}
function refsHtml(refs){return `<details class="ck-evidence"><summary>แหล่งอ้างอิง · ${refs.length}</summary><ul>${refs.map(r=>{const s=SOURCES[r.source];if(!s)return '<li>Source unavailable</li>';const url=safeUrl(s.url);return `<li><b>${esc(s.title)}</b><br>${esc(r.locator)}${url?`<br><a href="${esc(url)}" target="_blank" rel="noopener noreferrer">เปิดต้นทาง ↗</a>`:`<br><small>Project PDF · ${esc(s.filename)}</small>`}</li>`}).join('')}</ul></details>`}
function cHtml(c){return `<p>${esc(c.text)}</p>${refsHtml(c.refs||[])}`}
function notice(){return '<p class="ck-note">เพื่อการเรียนรู้และทบทวนทางคลินิก · ตรวจ patient และ hospital protocol ก่อนตัดสินใจ · เนื้อหาเป็น source-checked editorial synthesis ยังไม่มี independent clinical signoff</p>'}
function showDialog(d,focus){if(!d.open)d.showModal();requestAnimationFrame(()=>focus?.focus());}
function scrollContent(el){const d=$('clinicalKnowledgeDialog');if(d)d.style.scrollPaddingTop=`${(d.querySelector('.ck-chrome')?.offsetHeight||140)+12}px`;el?.scrollIntoView({block:'start'});}
function close(){ecgValues={};const d=$('clinicalKnowledgeDialog');if(d?.open)d.close();}
function open(nextTab='guides',id='',q=''){
 const d=$('clinicalKnowledgeDialog');if(!d)return;
 if(!d.open){returnFocus=document.activeElement;ecgValues={};}
 tab=['drugs','guides','ecg','sources'].includes(nextTab)?nextTab:'guides';query=q;group='all';selected=id||null;treeHistory=[];treeNode='';
 render();showDialog(d,$('ckTitle'));d.scrollTop=0;
}
function openDrug(name){const found=findDrug(name);open('drugs',found?.id||'',found?'':String(name||''));}
function openGuide(id){const guide=GUIDES.find(g=>g.id===id);if(!guide){open('guides');return}open('guides',guide.id);}
function openQuick(id){const g=GUIDES.find(x=>x.id===id);if(!g)return;
 const d=$('knowledgeQuickDialog');quickTopic=id;quickFocus=document.activeElement;
 $('ckQuickTitle').textContent=g.title;$('ckQuickBody').innerHTML=`<p class="ck-trigger">${esc(g.trigger.text)}</p><ol>${g.quick.map(c=>`<li>${esc(c.text)}</li>`).join('')}</ol>${refsHtml(g.references)}<p class="ck-note">Quick Assist · ยืนยัน patient/monitor ก่อนใช้ · การเปิดคู่มือไม่ acknowledge alert หรือบันทึก intervention</p>`;
 showDialog(d,$('ckQuickTitle'));d.scrollTop=0;
}
function closeQuick(){if($('knowledgeQuickDialog')?.open)$('knowledgeQuickDialog').close()}
function openFullFromQuick(){const id=quickTopic;closeQuick();openGuide(id);returnFocus=quickFocus;}
function sourcePage(){return `<h3>Evidence & content review</h3>${notice()}<p>Content ${esc(D.contentVersion)} · PDF locators คือหน้าไฟล์แบบเริ่มที่ 1; ไม่รวมตำราเต็มเล่ม; ภาพ ECG ตัดจากไฟล์ที่แนบตามคำขอ</p><h4>Guideline / research updates</h4>${D.updates.map(c=>`<article class="ck-entry">${cHtml(c)}</article>`).join('')}${P?`<p class="ck-note">Special patients content ${esc(P.contentVersion)} · ${esc(P.reviewStatus)}</p>`:''}<h4>Source register</h4>${Object.entries(SOURCES).map(([key,s])=>`<details class="ck-entry"><summary>${esc(key)} · ${esc(s.title)}</summary><p>${esc(s.kind)} · accessed ${esc(s.accessed)}</p>${s.url?`<a href="${esc(safeUrl(s.url))}" target="_blank" rel="noopener noreferrer">${esc(s.url)}</a>`:`<p>${esc(s.filename)}</p><p class="ck-hash">SHA-256 ${esc(s.sha256)}</p>`}</details>`).join('')}`}
function drugDetail(d){return `<button class="btn session-safe" type="button" data-ck-back>← รายการยา</button><h3>${esc(d.name)}</h3><p class="ck-meta">${esc(d.group)} · monograph ${esc(D.contentVersion)}</p><p class="ck-note">Qualitative knowledge · Calculator และ reviewed dose ranges เดิมใช้ protocol เดิม; หน้านี้ไม่มี dose import หรือ apply dose</p>${Object.entries(d.fields).map(([key,c])=>`<details class="ck-field" ${['clinicalRole','cautions','cardiovascular','respiratory'].includes(key)?'open':''}><summary>${esc(D.fieldLabels[key])}</summary>${cHtml(c)}</details>`).join('')}<h4>References</h4>${refsHtml(d.references)}`}
function guideDetail(g){
 if(!treeNode)treeNode=g.start;
 const node=g.nodes.find(n=>n.id===treeNode)||g.nodes[0];
 return `<button class="btn session-safe" type="button" data-ck-back>← คู่มือทั้งหมด</button><h3>${esc(g.title)}</h3>${cHtml(g.trigger)}<details class="ck-entry"><summary>Quick Assist</summary><ol>${g.quick.map(c=>`<li>${cHtml(c)}</li>`).join('')}</ol></details>${g.sections?`<nav class="ck-phase-nav" aria-label="ช่วงการดูแล"><button class="btn session-safe" type="button" data-ck-phase="risk">ก่อนวางยา</button><button class="btn session-safe" type="button" data-ck-phase="extubation">ก่อนถอดท่อ</button><button class="btn session-safe" type="button" data-ck-phase="recovery">ช่วงฟื้น</button><button class="btn session-safe" type="button" data-ck-phase="rescue">เมื่อเกิดปัญหา</button></nav>${g.sections.map((section,i)=>`<details id="ckPhase_${esc(section.id)}" class="ck-field ck-phase" ${i===0?'open':''}><summary>${esc(section.title)}</summary>${section.claims.map(cHtml).join('')}</details>`).join('')}`:''}<section class="ck-tree" aria-labelledby="ckDecisionTitle"><div class="ck-tree-head"><b id="ckDecisionTitle">Decision tree · ให้ clinician เลือกจากข้อมูลจริง</b><button class="btn session-safe" type="button" data-tree-reset>เริ่มใหม่</button></div>${treeHistory.length?`<details class="ck-path"><summary>เส้นทางที่เลือก ${treeHistory.length} ขั้น</summary>${treeHistory.map(s=>`<p>${esc(s.question)} → ${esc(s.label)}</p>${cHtml(s.action)}`).join('')}</details><button class="btn session-safe" type="button" data-tree-prev>← ขั้นก่อนหน้า</button>`:''}${treeNode==='end'?'<h4>สิ้นสุด branch นี้ — ตรวจ response และ reassess ตาม patient</h4>':`<h4>${esc(node.question.text)}</h4>${refsHtml(node.question.refs)}<div class="ck-branches">${node.branches.map((b,i)=>`<button class="session-safe" type="button" data-tree-branch="${i}">${esc(b.label)} →</button>`).join('')}</div>`}</section><details class="ck-entry"><summary>Full tree · อ่านทุก branch</summary>${g.nodes.map(n=>`<section><h4>${esc(n.question.text)}</h4>${refsHtml(n.question.refs)}<ul>${n.branches.map(b=>`<li><b>${esc(b.label)}</b>${cHtml(b.action)}${b.next?`<small>ต่อ: ${esc(g.nodes.find(x=>x.id===b.next)?.question.text||b.next)}</small>`:'<small>จุดประเมินผล/ส่งต่อ</small>'}</li>`).join('')}</ul></section>`).join('')}</details><details class="ck-field" open><summary>Monitoring / reassessment</summary>${g.monitor.map(cHtml).join('')}</details><details class="ck-field" open><summary>Watch-outs</summary>${g.avoid.map(cHtml).join('')}</details>${g.drugLinks.length?`<h4>Related drug knowledge</h4><div class="ck-related">${g.drugLinks.map(id=>`<button class="btn session-safe" type="button" data-ck-drug="${esc(id)}">${esc(D.drugs.find(d=>d.id===id)?.name||id)}</button>`).join('')}</div>`:''}${g.relatedGuides?.length?`<h4>คู่มือที่เกี่ยวข้อง</h4><div class="ck-related">${g.relatedGuides.map(id=>`<button class="btn session-safe" type="button" data-ck-guide="${esc(id)}">${esc(GUIDES.find(x=>x.id===id)?.title||id)} →</button>`).join('')}</div>`:''}<h4>References</h4>${refsHtml(g.references)}`;
}
function indexView(){
 const list=tab==='drugs'?D.drugs:GUIDES,key=tab==='drugs'?'group':'category';
 const categories=[...new Set(list.map(x=>x[key]))];
 const items=list.filter(x=>(group==='all'||x[key]===group)&&(!query||JSON.stringify(x).toLowerCase().includes(query.toLowerCase())));
 return `<label class="ck-search-label">ค้นหา ${tab==='drugs'?'ชื่อยา / class / effect':'ภาวะแทรกซ้อน / ผู้ป่วยเฉพาะกลุ่ม'}<input id="ckSearch" class="session-safe" type="search" value="${esc(query)}" placeholder="${tab==='drugs'?'เช่น propofol, ketamine, apnea':'เช่น หน้าสั้น, BOAS, airway, recovery'}" autocomplete="off"></label><div class="ck-filters" role="group" aria-label="หมวดเนื้อหา"><button type="button" class="session-safe ${group==='all'?'active':''}" data-ck-group="all">ทั้งหมด</button>${categories.map(c=>`<button class="session-safe ${group===c?'active':''}" type="button" data-ck-group="${esc(c)}">${esc(c)}</button>`).join('')}</div><p class="ck-meta" role="status">${items.length} ${tab==='drugs'?'monographs':'full guides'}</p><div class="ck-list">${items.map(x=>`<button type="button" class="ck-list-item session-safe" data-ck-select="${esc(x.id)}"><strong>${esc(x.name||x.title)}</strong><span>${esc(x[key])}</span><small>${esc(tab==='drugs'?x.fields.clinicalRole.text:x.trigger.text)}</small><span class="ck-open">เปิดรายละเอียด →</span></button>`).join('')||'<p>ไม่พบเนื้อหาที่ตรงกัน · ล้างคำค้นหรือเลือกหมวดอื่น ไม่มีการจับคู่ยาแบบเดาสุ่ม</p>'}</div>`;
}
const ECG_FIELDS=[
 ['species','Patient species',[['dog','Dog'],['cat','Cat']]],
 ['quality','Signal quality',[['good','ยืนยัน usable signal'],['poor','มี artifact / poor signal']]],
 ['paperSpeed','Paper speed',[['25','25 mm/s'],['50','50 mm/s']]],
 ['gain','Gain / calibration',[['known','ตรวจ calibration แล้ว']]],
 ['rateContext','1. Rate relative to this patient',[['low','ต่ำตาม patient context'],['expected','ตามที่คาดสำหรับ patient'],['high','สูงตาม patient context']]],
 ['regularity','2. Regularity',[['regular','Regular'],['respiratory','แปรตาม respiration'],['irregular','Irregularly irregular / nonphasic']]],
 ['p','3. P wave',[['normal','Consistent sinus-like P'],['abnormal','P morphology เปลี่ยน/ectopic'],['absent','ไม่เห็น consistent P']]],
 ['relation','4. P:QRS',[['one','1:1 conduction'],['dropped','บาง P ไม่มี QRS'],['independent','P และ QRS independent']]],
 ['qrs','5. QRS morphology',[['narrow','Narrow/คล้าย baseline'],['wide','Wide/abnormal morphology'],['chaotic','Chaotic/no organized QRS'],['flat','Flat tracing']]],
 ['pr','PR pattern',[['normal','ตาม calibrated reference'],['prolonged','Prolonged (วัดเทียบ species reference)'],['progressive','Progressively lengthening'],['fixed','คงที่รอบ dropped beat']]],
 ['ectopy','Premature beats / runs',[['none','ไม่เห็น'],['earlyNarrow','Early narrow beat'],['earlyWide','Early wide beat'],['runWide','Run of wide complexes']]],
 ['perfusion','7. Mechanical circulation / perfusion',[['adequate','ตรวจ pulse/BP แล้วเหมาะสม'],['poor','Perfusion แย่ / BP ลด'],['absent','ตรวจพบไม่มี effective circulation']]],
 ['responsive','Responsive?',[['yes','ตอบสนอง'],['no','Unresponsive']]],
 ['breathing','Effective breathing?',[['yes','มี'],['no','Apneic / ไม่มี']]]
];
function ecgView(){return `<h3>ECG / Rhythm · Educational Assistant</h3><p class="ck-note">เลือก observations จาก ECG และผู้ป่วยเอง · ระบบไม่อ่าน waveform/image และไม่ใช่ automated diagnostic ECG interpretation · ผลไม่ถูกบันทึกลง patient record</p>${root.ANESVET_ECG_VISUALS?.render()||''}<details class="ck-entry"><summary>Structured workflow: Rate → Regularity → P → P:QRS → QRS → Rhythm → Perfusion → Anesthesia</summary><ol>${D.workflow.map(w=>`<li><b>${esc(w.label)}</b>${cHtml(w.claim)}</li>`).join('')}</ol></details><form id="ckECGForm" class="ck-ecg-form"><div class="ck-form-grid">${ECG_FIELDS.map(([id,label,opts])=>`${id==='rateContext'?`<label>1. Observed ventricular rate (bpm)<input class="session-safe" name="rate" id="ckECG_rate" type="number" inputmode="numeric" min="1" step="1" value="${esc(ecgValues.rate||'')}" placeholder="อ่านจาก strip / monitor ที่ตรวจแล้ว"></label>`:''}<label>${esc(label)}<select class="session-safe" name="${id}" id="ckECG_${id}"><option value="unknown">— ไม่ทราบ / ยังไม่ประเมิน —</option>${opts.map(([v,l])=>`<option value="${v}" ${ecgValues[id]===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`).join('')}</div><p class="ck-note">ไม่มี automatic dog/cat rate cutoff · wide QRS ไม่เท่ากับ VT เสมอ · ECG ไม่ยืนยัน pulse/CO</p><div class="ck-actions"><button class="btn primary session-safe" type="submit">6–8. ทบทวน rhythm & significance</button><button class="btn session-safe" type="button" id="ckECGReset">ล้าง observations</button></div><div id="ckECGResult" role="status" aria-live="polite"></div></form><details class="ck-entry"><summary>Educational Rhythm Guide · ${D.rhythms.length} patterns</summary>${D.rhythms.map(r=>`<details class="ck-field"><summary>${esc(r.name)}</summary><button type="button" class="btn session-safe" data-ecg-rhythm="${esc(r.id)}">ดูภาพตัวอย่าง →</button><h4>ECG features</h4>${cHtml(r.features)}<h4>Hemodynamic significance</h4>${cHtml(r.significance)}<h4>Anesthesia considerations</h4>${cHtml(r.anesthesia)}</details>`).join('')}</details>`}
function resultHtml(r){return `<section class="ck-result ${r.urgency}" data-urgency="${esc(r.urgency)}"><h4>${r.urgency==='immediate'?'Immediate clinical assessment / suspected CPA':r.urgency==='urgent'?'Urgent hemodynamic review':'Educational pattern review'}</h4>${cHtml(r.hemodynamics)}<p class="ck-note">Possible patterns to review · ไม่ใช่ diagnosis หรือ treatment order</p>${r.candidates.map(c=>`<article><h4>${esc(c.name)}</h4>${cHtml(c.reason)}<button type="button" class="btn session-safe" data-ecg-rhythm="${esc(c.id)}">ดูภาพตัวอย่าง →</button></article>`).join('')||'<p>ยังไม่มี pattern ที่สรุปได้จาก observations</p>'}${r.missing.length?`<h4>ข้อมูลที่ยังขาด</h4><ul>${[...new Set(r.missing)].map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}${r.warnings.map(cHtml).join('')}<h4>8. Anesthesia considerations</h4>${r.anesthesia.map(cHtml).join('')}<button class="btn session-safe" type="button" data-ck-guide="${r.urgency==='immediate'?'arrest':'arrhythmia'}">Open ${r.urgency==='immediate'?'CPA':'Arrhythmia'} Full Guide</button></section>`}
function render(){
 $('ckTitle').textContent=({drugs:'Anesthesia Drug Knowledge',guides:'Clinical Full Guides',ecg:'ECG / Rhythm Education',sources:'Sources & review'})[tab];
 document.querySelectorAll('[data-ck-tab]').forEach(b=>{const active=b.dataset.ckTab===tab;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});
 let body;if(tab==='sources')body=sourcePage();else if(tab==='ecg')body=ecgView();else if(selected){const item=(tab==='drugs'?D.drugs:GUIDES).find(x=>x.id===selected);body=item?(tab==='drugs'?drugDetail(item):guideDetail(item)):indexView();}else body=indexView();
 $('ckBody').innerHTML=body;
 if(tab==='ecg'){
  const form=$('ckECGForm');form.addEventListener('submit',evt=>{evt.preventDefault();ecgValues=Object.fromEntries(new FormData(form).entries());$('ckECGResult').innerHTML=resultHtml(R.interpret(ecgValues,D));scrollContent($('ckECGResult'))});
  form.addEventListener('change',()=>{ecgValues=Object.fromEntries(new FormData(form).entries());$('ckECGResult').replaceChildren()});
  $('ckECG_rate').addEventListener('input',()=>{ecgValues=Object.fromEntries(new FormData(form).entries());$('ckECGResult').replaceChildren()});
  $('ckECGReset').addEventListener('click',()=>{ecgValues={};render();$('ckECG_species').focus()});
 }
 const search=$('ckSearch');search?.addEventListener('input',()=>{const pos=search.selectionStart;query=search.value;render();$('ckSearch')?.focus();try{$('ckSearch')?.setSelectionRange(pos,pos)}catch(_){}});
}
function calculatorLink(name){return `<button type="button" class="ck-drug-link session-safe" data-ck-drug="${esc(name)}" aria-label="Drug knowledge: ${esc(name)}">Drug knowledge ↗</button>`}
function bind(){
 const shell=document.createElement('div');shell.id='clinicalKnowledgeShell';
 shell.innerHTML=`<dialog id="clinicalKnowledgeDialog" class="ck-dialog" aria-labelledby="ckTitle"><div class="ck-chrome"><header class="ck-header"><div><small>ANESVET · CLINICAL KNOWLEDGE</small><h2 id="ckTitle" tabindex="-1">Knowledge</h2></div><button id="ckClose" class="btn session-safe" type="button" aria-label="ปิด Knowledge และกลับไปงานเดิม">✕ ปิด</button></header><nav class="ck-tabs" aria-label="Knowledge sections"><button class="session-safe" type="button" data-ck-tab="drugs">Drugs</button><button class="session-safe" type="button" data-ck-tab="guides">Full Guides</button><button class="session-safe" type="button" data-ck-tab="ecg">ECG</button><button class="session-safe" type="button" data-ck-tab="sources">Sources</button></nav></div><main id="ckBody" class="ck-body"></main><footer class="ck-footer">Read-only education · คง calculator, thresholds และ patient record เดิม</footer></dialog><dialog id="knowledgeQuickDialog" class="ck-quick-dialog" aria-labelledby="ckQuickTitle"><header class="ck-header"><div><small>CONTEXTUAL QUICK ASSIST</small><h2 id="ckQuickTitle" tabindex="-1">Quick Assist</h2></div><button id="ckQuickClose" class="btn session-safe" type="button" aria-label="ปิด Quick Assist">✕</button></header><div id="ckQuickBody" class="ck-body"></div><div class="ck-actions"><button id="ckQuickFull" class="btn primary session-safe" type="button">Open Full Guide →</button></div></dialog>`;
 document.body.append(shell);
 $('ckClose').addEventListener('click',close);$('ckQuickClose').addEventListener('click',closeQuick);$('ckQuickFull').addEventListener('click',openFullFromQuick);
 $('clinicalKnowledgeDialog').addEventListener('close',()=>{if(!$('clinicalKnowledgeDialog').open){ecgValues={};$('ckBody').replaceChildren();returnFocus?.focus?.()}});
 $('knowledgeQuickDialog').addEventListener('close',()=>quickFocus?.focus?.());
 document.addEventListener('click',evt=>{
  const b=evt.target.closest?.('[data-ck-tab],[data-ck-select],[data-ck-back],[data-ck-group],[data-tree-branch],[data-tree-prev],[data-tree-reset],[data-ck-drug],[data-ck-guide],[data-open-clinical-knowledge],[data-ck-phase]');if(!b)return;
  evt.preventDefault();
  if(b.dataset.ckPhase){const el=$('ckPhase_'+b.dataset.ckPhase);if(el){el.open=true;scrollContent(el);el.querySelector('summary')?.focus()}return}
  if(b.hasAttribute('data-open-clinical-knowledge')){open(b.dataset.openClinicalKnowledge||'guides');return}
  if(b.dataset.ckDrug){const found=findDrug(b.dataset.ckDrug);if($('clinicalKnowledgeDialog').open){tab='drugs';selected=found?.id||null;query=found?'':b.dataset.ckDrug;group='all';render();$('clinicalKnowledgeDialog').scrollTop=0}else openDrug(b.dataset.ckDrug);return}
  if(b.dataset.ckGuide){tab='guides';selected=b.dataset.ckGuide;treeNode='';treeHistory=[];render();$('clinicalKnowledgeDialog').scrollTop=0;return}
  if(b.dataset.ckTab){if(tab==='ecg'&&$('ckECGForm'))ecgValues=Object.fromEntries(new FormData($('ckECGForm')).entries());tab=b.dataset.ckTab;selected=null;query='';group='all';treeNode='';treeHistory=[];render();$('clinicalKnowledgeDialog').scrollTop=0;return}
  if(b.dataset.ckGroup){group=b.dataset.ckGroup;render();return}
  if(b.dataset.ckSelect){selected=b.dataset.ckSelect;treeNode='';treeHistory=[];render();$('clinicalKnowledgeDialog').scrollTop=0;$('ckTitle').focus();return}
  if(b.hasAttribute('data-ck-back')){selected=null;treeNode='';treeHistory=[];render();$('clinicalKnowledgeDialog').scrollTop=0;$('ckSearch')?.focus();return}
  const g=GUIDES.find(x=>x.id===selected);if(!g)return;
  if(b.hasAttribute('data-tree-reset')){treeHistory=[];treeNode=g.start;}
  else if(b.hasAttribute('data-tree-prev')){const prev=treeHistory.pop();if(prev)treeNode=prev.node;}
  else if(b.hasAttribute('data-tree-branch')){const node=g.nodes.find(n=>n.id===treeNode),branch=node?.branches[Number(b.dataset.treeBranch)];if(!branch)return;treeHistory.push({node:node.id,question:node.question.text,label:branch.label,action:branch.action});treeNode=branch.next||'end'}
  render();scrollContent($('ckDecisionTitle'));
 });
 // Links are added only to calculator/reference surfaces, never to OR LIVE cards.
 document.querySelectorAll('#drugs .drug-card').forEach(card=>{const name=card.querySelector('[data-drug]')?.dataset.drug||card.querySelector('.drug-card-head h3')?.textContent?.trim();if(findDrug(name))card.insertAdjacentHTML('beforeend',calculatorLink(name))});
 for(const [selectId,buttonId] of [['customInductionDrug','ckCustomInduction'],['customPreDrug','ckCustomPre'],['customPostDrug','ckCustomPost']]){
  const select=$(selectId);if(!select)continue;const b=document.createElement('button');b.id=buttonId;b.type='button';b.className='ck-drug-link session-safe';b.textContent='Selected drug knowledge ↗';select.closest('.drug-card')?.append(b);
  b.addEventListener('click',()=>{const text=select.selectedOptions?.[0]?.textContent||'';openDrug(text.replace(/\s*[•|].*$/,''))});
 }
 const dose=$('doseReferenceDialog');if(dose){const b=document.createElement('button');b.type='button';b.className='btn session-safe';b.textContent='Open Drug Knowledge →';dose.querySelector('.dialog-actions')?.prepend(b);b.addEventListener('click',()=>{const name=$('doseReferenceTitle')?.textContent||'';dose.close();openDrug(name)})}
 const clinical=$('clinicalGuideDialog');if(clinical){
  const b=document.createElement('button');b.type='button';b.className='btn session-safe';b.textContent='Open Full Guide →';b.id='ckExistingAlertFull';clinical.querySelector('.dialog-actions')?.prepend(b);
  b.addEventListener('click',()=>{const id=clinical.dataset.ckGuideTopic||'';clinical.close();open('guides',id)});
 }
}
const api=Object.freeze({version:D.version,open,openDrug,openGuide,openQuick,close,findDrug});root.ANESVET_CLINICAL_KNOWLEDGE=api;
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind,{once:true});else bind();
})(typeof globalThis!=='undefined'?globalThis:this);
