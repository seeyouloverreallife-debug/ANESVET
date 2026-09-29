/* ANESVET V16.18.1 — Pre-op Controller
   Structured physical examination/risk/checklist UI extracted from app.js. Clinical rules unchanged. */
(function(root){
'use strict';
const VERSION='16.18.1';
const PREOP_EXAM_FIELD_IDS=Object.freeze(['preopMentation','preopHR','preopPulse','preopHeart','preopRR','preopRespEffort','preopLungs','preopTemp','preopMM','preopCRT','preopHydration','preopPain','preopExamNotes','preopExaminer']);
const PREOP_RISK_FLAGS=Object.freeze([
  {id:'riskBrachycephalic',group:'Airway',label:'Brachycephalic anatomy',short:'BRACHYCEPHALIC'},
  {id:'riskBOAS',group:'Airway',label:'Suspected / known BOAS',short:'BOAS'},
  {id:'riskDifficultAirway',group:'Airway',label:'Previous / anticipated difficult airway',short:'DIFFICULT AIRWAY'},
  {id:'riskUpperAirway',group:'Airway',label:'Other upper-airway disease / obstruction risk',short:'UPPER AIRWAY'},
  {id:'riskAspiration',group:'Aspiration / GI',label:'Regurgitation / vomiting / megaesophagus / full-stomach risk',short:'ASPIRATION'},
  {id:'riskCardiacDisease',group:'Cardiovascular',label:'Known / suspected cardiac disease',short:'CARDIAC'},
  {id:'riskArrhythmia',group:'Cardiovascular',label:'Clinically relevant arrhythmia',short:'ARRHYTHMIA'},
  {id:'riskRespiratoryDisease',group:'Respiratory',label:'Respiratory disease / impaired respiratory reserve',short:'RESPIRATORY'},
  {id:'riskHypovolemia',group:'Perfusion',label:'Dehydration / hypovolemia / poor perfusion',short:'HYPOVOLEMIA'},
  {id:'riskAnemiaBleeding',group:'Perfusion',label:'Anemia / coagulopathy / bleeding concern',short:'ANEMIA/BLEEDING'},
  {id:'riskRenal',group:'Organ / metabolic',label:'Renal disease / oliguria / anuria concern',short:'RENAL'},
  {id:'riskHepatic',group:'Organ / metabolic',label:'Hepatic disease / impaired hepatic function',short:'HEPATIC'},
  {id:'riskMetabolicElectrolyte',group:'Organ / metabolic',label:'Electrolyte / acid-base / metabolic abnormality',short:'METABOLIC'},
  {id:'riskHypoglycemia',group:'Organ / metabolic',label:'Hypoglycemia risk',short:'HYPOGLYCEMIA'},
  {id:'riskPediatric',group:'Patient',label:'Pediatric / neonatal',short:'PEDIATRIC'},
  {id:'riskGeriatric',group:'Patient',label:'Geriatric / reduced physiologic reserve',short:'GERIATRIC'},
  {id:'riskObesity',group:'Patient',label:'Obesity / body-condition concern',short:'OBESITY'},
  {id:'riskPregnancy',group:'Patient',label:'Pregnancy / peripartum',short:'PREGNANCY'},
  {id:'riskPreviousAnesthetic',group:'History',label:'Previous anesthetic / recovery adverse event',short:'PREV ANESTHETIC EVENT'},
  {id:'riskEmergency',group:'Procedure',label:'Emergency / unstable / critical procedure context',short:'EMERGENCY'},
  {id:'riskMajorHemorrhage',group:'Procedure',label:'Major hemorrhage / transfusion risk',short:'HEMORRHAGE'}
]);
const BOAS_DETAIL_IDS=Object.freeze(['riskBOASStertor','riskBOASStridor','riskBOASExerciseHeat','riskBOASSleep','riskBOASRegurg','riskBOASAirwaySurgery','riskBOASPreviousDifficultIntubation']);

function create(ctx={}){
  const $=ctx.$, $$=ctx.$$;if(!$||!$$||typeof ctx.getState!=='function')return null;
  const escapeHtml=ctx.escapeHtml||((v)=>String(v??'')),formatDate=ctx.formatDate||(()=>''),formatClock=ctx.formatClock||(()=>''),toast=ctx.toast||(()=>{});
  const state=new Proxy({}, {get(_t,p){return ctx.getState()?.[p]},set(_t,p,v){const s=ctx.getState();if(s)s[p]=v;return true}});
  function preopExamEnteredCount(){return PREOP_EXAM_FIELD_IDS.filter(id=>{const el=$(id);return !!(el&&String(el.value??'').trim())}).length}
  function renderPreopExam(){
    const panel=document.querySelector('.preop-exam-panel'),badge=$('preopExamStatus'),meta=$('preopExamSavedMeta');if(!badge)return;
    const checked=!!document.querySelector('#preop .preop-check[data-key="exam"]')?.checked,stamp=state.preopExamRecordedAt;panel?.classList.toggle('exam-saved',!!stamp);
    if(stamp){badge.className='status-pill good';badge.textContent='RECORDED';if(meta)meta.textContent=`บันทึก ${formatDate(stamp)} ${formatClock(stamp)} • ${state.preopExamRecordedBy||$('preopExaminer')?.value||'examiner not specified'}`;return}
    if(checked){badge.className='status-pill warn';badge.textContent='CHECKED • NO STRUCTURED RECORD';if(meta)meta.textContent='Checklist ถูกติ๊กแล้ว แต่ยังไม่มี structured physical examination';return}
    badge.className='status-pill warn';badge.textContent=preopExamEnteredCount()?'UNSAVED CHANGES':'NOT RECORDED';if(meta)meta.textContent=preopExamEnteredCount()?'มีข้อมูลที่ยังไม่ได้กดบันทึกผลตรวจ':'ยังไม่ได้บันทึกผลตรวจ';
  }
  function markPreopExamDirty(){ctx.invalidatePreOrOverride?.();if(state.preopExamRecordedAt){state.preopExamRecordedAt=null;state.preopExamRecordedBy='';const cb=document.querySelector('#preop .preop-check[data-key="exam"]');if(cb)cb.checked=false;document.querySelector('#preop .preop-item[data-preop-key="exam"]')?.classList.remove('na')}renderPreopExam();renderPreop()}
  function savePreopPhysicalExam(){
    if(!ctx.clinicalWriteAllowed?.())return;const count=preopExamEnteredCount(),examiner=$('preopExaminer')?.value.trim()||$('anesthetist')?.value.trim()||'';
    if(!count){toast('กรุณาบันทึกผลตรวจร่างกายอย่างน้อย 1 รายการ');return}if(!examiner){toast('กรุณาระบุผู้ตรวจร่างกาย');$('preopExaminer')?.focus();return}if(count<5&&!confirm(`มี structured findings ${count} รายการ\nต้องการบันทึก Physical Examination และ mark checklist Done ต่อหรือไม่?`))return;
    if($('preopExaminer')&&!$('preopExaminer').value.trim())$('preopExaminer').value=examiner;ctx.save?.();state.preopExamRecordedAt=Date.now();state.preopExamRecordedBy=examiner;
    const item=document.querySelector('#preop .preop-item[data-preop-key="exam"]'),cb=item?.querySelector('.preop-check');item?.classList.remove('na');if(cb){cb.disabled=false;cb.checked=true}
    ctx.invalidatePreOrOverride?.();ctx.addAudit?.('PREANESTHETIC_PHYSICAL_EXAM_RECORDED',`${count} structured finding(s) recorded`,examiner);ctx.save?.();renderPreop();renderPreopExam();ctx.renderCaseSummary?.();toast('Physical examination saved • checklist marked Done');
  }
  function preopExamReportHtml(){
    const val=id=>{const v=$(id)?.value??state[id]??'';return v===null||v===undefined||String(v).trim()===''?'—':String(v)};
    const items=[['Mentation',val('preopMentation')],['HR',val('preopHR')==='—'?'—':`${val('preopHR')} bpm`],['Pulse',val('preopPulse')],['Heart',val('preopHeart')],['RR',val('preopRR')==='—'?'—':`${val('preopRR')} bpm`],['Respiratory effort',val('preopRespEffort')],['Lungs',val('preopLungs')],['Temperature',state.preopTemp!==''&&state.preopTemp!=null?(ctx.tempTextF?.(state.preopTemp)||'—'):'—'],['Mucous membrane',val('preopMM')],['CRT',val('preopCRT')],['Hydration',val('preopHydration')],['Pain / discomfort',val('preopPain')],['Examined by',val('preopExaminer')],['Recorded at',state.preopExamRecordedAt?`${formatDate(state.preopExamRecordedAt)} ${formatClock(state.preopExamRecordedAt)}`:'Not formally recorded']];
    return `<div class="report-physical-exam"><div class="report-physical-exam-grid">${items.map(([l,v])=>`<div class="report-physical-exam-item"><span>${escapeHtml(l)}</span><b>${escapeHtml(v)}</b></div>`).join('')}</div><div class="report-physical-exam-note"><b>Abnormal / relevant findings:</b> ${escapeHtml(val('preopExamNotes'))}</div></div>`;
  }
  function preopRiskSelectedFlags(){return PREOP_RISK_FLAGS.filter(r=>!!$(r.id)?.checked)}
  function preopRiskEnteredCount(){return preopRiskSelectedFlags().length+(String($('riskOther')?.value||'').trim()?1:0)}
  function preopRiskSummaryLabels({compact=false}={}){const labels=preopRiskSelectedFlags().map(r=>compact?r.short:r.label),other=String($('riskOther')?.value||'').trim();if(other)labels.push(compact?`OTHER: ${other}`:`Other: ${other}`);return labels}
  function renderBOASRiskDetail(){const show=!!($('riskBrachycephalic')?.checked||$('riskBOAS')?.checked);if($('boasRiskDetail'))$('boasRiskDetail').hidden=!show}
  function renderPreopRisk(){
    const badge=$('preopRiskStatus'),meta=$('preopRiskSavedMeta');if(!badge)return;renderBOASRiskDetail();const count=preopRiskEnteredCount(),none=!!$('preopRiskNone')?.checked,stamp=state.preopRiskRecordedAt;document.querySelector('.preop-risk-panel')?.classList.toggle('risk-saved',!!stamp);
    if($('preopRiskCount'))$('preopRiskCount').textContent=none?'NO ADDITIONAL FLAGS':`${count} FLAG${count===1?'':'S'}`;if(stamp){badge.className='status-pill good';badge.textContent='REVIEWED';if(meta)meta.textContent=`บันทึก ${formatDate(stamp)} ${formatClock(stamp)} • ${state.preopRiskRecordedBy||$('preopRiskAssessor')?.value||'reviewer not specified'}`;return}
    const riskChecked=!!document.querySelector('#preop .preop-check[data-key="risk"]')?.checked;if(riskChecked){badge.className='status-pill warn';badge.textContent='CHECKED • NO STRUCTURED REVIEW';if(meta)meta.textContent='Checklist ถูกติ๊กแล้ว แต่ยังไม่มี structured risk review';return}
    badge.className='status-pill warn';badge.textContent=(none||count)?'UNSAVED CHANGES':'NOT REVIEWED';if(meta)meta.textContent=(none||count)?'มี Risk assessment ที่ยังไม่ได้กดบันทึก':'ยังไม่ได้ทบทวน Anesthetic Risk Flags';
  }
  function markPreopRiskDirty(){ctx.invalidatePreOrOverride?.();if(state.preopRiskRecordedAt){state.preopRiskRecordedAt=null;state.preopRiskRecordedBy='';const cb=document.querySelector('#preop .preop-check[data-key="risk"]');if(cb)cb.checked=false;document.querySelector('#preop .preop-item[data-preop-key="risk"]')?.classList.remove('na')}renderPreopRisk();renderPreop()}
  function savePreopRiskAssessment(){
    if(!ctx.clinicalWriteAllowed?.())return;const count=preopRiskEnteredCount(),none=!!$('preopRiskNone')?.checked,assessor=$('preopRiskAssessor')?.value.trim()||$('preopExaminer')?.value.trim()||$('anesthetist')?.value.trim()||'';
    if(!none&&!count){toast('เลือก Risk flag อย่างน้อย 1 รายการ หรือเลือก No additional risk flags identified');return}if(!assessor){toast('กรุณาระบุผู้ทบทวน Anesthetic Risk');$('preopRiskAssessor')?.focus();return}if($('preopRiskAssessor')&&!$('preopRiskAssessor').value.trim())$('preopRiskAssessor').value=assessor;
    ctx.save?.();state.preopRiskRecordedAt=Date.now();state.preopRiskRecordedBy=assessor;const item=document.querySelector('#preop .preop-item[data-preop-key="risk"]'),cb=item?.querySelector('.preop-check');item?.classList.remove('na');if(cb){cb.disabled=false;cb.checked=true}
    ctx.invalidatePreOrOverride?.();ctx.addAudit?.('PREANESTHETIC_RISK_REVIEW_RECORDED',none?'No additional structured risk flags':`${count} structured risk flag(s)`,assessor);ctx.save?.();renderPreop();renderPreopRisk();ctx.renderPatientRiskBanner?.();ctx.renderCaseSummary?.();ctx.renderOrLive?.();toast('Anesthetic risk review saved • checklist marked Done');
  }
  function riskAssessmentReportHtml(){
    const none=!!state.preopRiskNone,flags=PREOP_RISK_FLAGS.filter(r=>!!state[r.id]),groups={};flags.forEach(r=>(groups[r.group]??=[]).push(r.label));const groupHtml=Object.entries(groups).map(([g,items])=>`<div class="report-risk-group"><span>${escapeHtml(g)}</span><b>${escapeHtml(items.join(' • '))}</b></div>`).join('');
    const boasDetails=[['Stertor / snoring',state.riskBOASStertor],['Stridor / inspiratory noise',state.riskBOASStridor],['Exercise / heat intolerance',state.riskBOASExerciseHeat],['Sleep-disordered breathing / collapse history',state.riskBOASSleep],['Regurgitation / reflux history',state.riskBOASRegurg],['Previous airway surgery',state.riskBOASAirwaySurgery],['Previous difficult intubation / airway recovery event',state.riskBOASPreviousDifficultIntubation]].filter(x=>x[1]).map(x=>x[0]);
    const other=String(state.riskOther||'').trim(),boasNote=String(state.riskBOASNotes||'').trim();return `<div class="report-risk-assessment"><h4>Anesthetic Risk Flags</h4>${none?'<div class="report-risk-none">☑ No additional structured risk flags identified</div>':(groupHtml||'<div class="report-risk-none">Not formally reviewed</div>')}${boasDetails.length?`<div class="report-risk-note"><b>Brachycephalic / BOAS details:</b> ${escapeHtml(boasDetails.join(' • '))}${boasNote?` • ${escapeHtml(boasNote)}`:''}</div>`:(boasNote?`<div class="report-risk-note"><b>Airway / BOAS note:</b> ${escapeHtml(boasNote)}</div>`:'')}${other?`<div class="report-risk-note"><b>Other risk:</b> ${escapeHtml(other)}</div>`:''}<div class="report-risk-meta">Reviewed by ${escapeHtml(state.preopRiskRecordedBy||state.preopRiskAssessor||'—')} • ${state.preopRiskRecordedAt?`${escapeHtml(formatDate(state.preopRiskRecordedAt))} ${escapeHtml(formatClock(state.preopRiskRecordedAt))}`:'Not formally recorded'}</div></div>`;
  }
  function renderPreop(){const checks=$$('.preop-check'),total=checks.length,done=checks.filter(x=>x.checked).length,na=$$('.preop-item.na').length,reviewed=done+na;if($('preopProgress')){$('preopProgress').textContent=`${reviewed}/${total} REVIEWED`;$('preopProgress').className=`status-pill ${reviewed===total?'good':'warn'}`}if($('preopWarning'))$('preopWarning').textContent=reviewed===total?'Pre-anesthetic checklist reviewed':'ยังมีรายการที่ต้องเลือก Done หรือ N/A';renderPreopExam();renderPreopRisk();ctx.save?.();ctx.renderWorkflowLocks?.()}
  function bind(){
    $$('.preop-check').forEach(el=>el.addEventListener('change',()=>{if(el.checked)el.closest('.preop-item')?.classList.remove('na');ctx.invalidatePreOrOverride?.();renderPreop()}));
    $$('.preop-na-btn').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const item=btn.closest('.preop-item'),next=!item.classList.contains('na');item.classList.toggle('na',next);const cb=item.querySelector('.preop-check');if(next&&cb)cb.checked=false;ctx.invalidatePreOrOverride?.();renderPreop()}));
    $('goDrugCalculatorBtn')?.addEventListener('click',()=>ctx.setTab?.('drugs'));$('goOrLiveFromPreopBtn')?.addEventListener('click',()=>ctx.setTab?.('orlive'));$('goOrLiveFromDrugBtn')?.addEventListener('click',()=>ctx.setTab?.('orlive'));$('openPreopBtn')?.addEventListener('click',()=>ctx.setTab?.('preop'));
    PREOP_EXAM_FIELD_IDS.forEach(id=>{const el=$(id);if(!el)return;el.addEventListener(el.tagName==='SELECT'?'change':'input',markPreopExamDirty)});$('savePreopExamBtn')?.addEventListener('click',savePreopPhysicalExam);
    const riskFieldIds=[...PREOP_RISK_FLAGS.map(r=>r.id),...BOAS_DETAIL_IDS,'riskBOASNotes','riskOther','preopRiskAssessor'];riskFieldIds.forEach(id=>{const el=$(id);if(!el)return;el.addEventListener(el.type==='checkbox'||el.tagName==='SELECT'?'change':'input',()=>{if(id!=='preopRiskAssessor'&&$('preopRiskNone')?.checked)$('preopRiskNone').checked=false;markPreopRiskDirty();ctx.renderPatientRiskBanner?.();ctx.renderCaseSummary?.()})});
    $('preopRiskNone')?.addEventListener('change',()=>{if($('preopRiskNone').checked){PREOP_RISK_FLAGS.forEach(r=>{if($(r.id))$(r.id).checked=false});BOAS_DETAIL_IDS.forEach(id=>{if($(id))$(id).checked=false});if($('riskBOASNotes'))$('riskBOASNotes').value='';if($('riskOther'))$('riskOther').value=''}markPreopRiskDirty();ctx.renderPatientRiskBanner?.();ctx.renderCaseSummary?.()});$('savePreopRiskBtn')?.addEventListener('click',savePreopRiskAssessment);
  }
  return Object.freeze({version:VERSION,bind,examFieldIds:PREOP_EXAM_FIELD_IDS,riskFlags:PREOP_RISK_FLAGS,boasDetailIds:BOAS_DETAIL_IDS,preopExamEnteredCount,renderPreopExam,markPreopExamDirty,savePreopPhysicalExam,preopExamReportHtml,preopRiskSelectedFlags,preopRiskEnteredCount,preopRiskSummaryLabels,renderBOASRiskDetail,renderPreopRisk,markPreopRiskDirty,savePreopRiskAssessment,riskAssessmentReportHtml,renderPreop});
}
const api=Object.freeze({version:VERSION,create,examFieldIds:PREOP_EXAM_FIELD_IDS,riskFlags:PREOP_RISK_FLAGS,boasDetailIds:BOAS_DETAIL_IDS});root.ANESVET_PREOP_CONTROLLER=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
