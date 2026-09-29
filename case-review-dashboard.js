/* ANESVET V16.22.0 — Case Review & Quality Dashboard
   Read-only descriptive review of archived anesthesia records.
   It does not grade clinicians, infer causality, or determine whether care was appropriate. */
(function(root){
'use strict';
const VERSION='17.0.0';
const $=id=>typeof document!=='undefined'?document.getElementById(id):null;
const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const num=v=>Number.isFinite(Number(v))?Number(v):null;
const arr=v=>Array.isArray(v)?v:[];
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
function clone(v){return JSON.parse(JSON.stringify(v??null))}
function median(values){const xs=values.map(Number).filter(Number.isFinite).sort((a,b)=>a-b);if(!xs.length)return null;const m=Math.floor(xs.length/2);return xs.length%2?xs[m]:(xs[m-1]+xs[m])/2}
function pct(n,d){return d>0?Math.round((n/d)*100):null}
function fmtPct(n,d){const p=pct(n,d);return p==null?'—':`${p}%`}
function fmtDuration(ms){if(!Number.isFinite(Number(ms))||Number(ms)<0)return '—';const min=Math.round(Number(ms)/60000);if(min<60)return `${min} min`;const h=Math.floor(min/60),m=min%60;return `${h} h${m?` ${m} min`:''}`}
function caseEpoch(c){return Number(c?.lockedAt||c?.archivedAt||c?.createdAt||0)||0}
function protocolLabel(c){const g=c?.protocolSnapshot?.governance||{};const name=g.name||c?.protocolSnapshot?.name||'Legacy / unversioned';const version=g.version||c?.protocolSnapshot?.version||'';return `${name}${version?` • ${version}`:''}`}
function normalizedSpecies(c){const s=String(c?.species||c?.caseIdentitySnapshot?.species||'').toLowerCase();return s==='dog'?'dog':s==='cat'?'cat':'other'}
function procedureText(c){return String(c?.procedure||c?.patientProcedure||'').trim()||'—'}
function isFinal(c){return !!(c?.caseLocked&&c?.finalChecksum&&!c?.voidedAt)}
function isVoided(c){return !!c?.voidedAt}
function documentedCaseElapsed(c){const t=num(c?.timer?.elapsedMs);if(t!=null&&t>=0)return t;const start=num(c?.caseStartedAt),end=num(c?.recoveryCompletedAt||c?.lockedAt);return start!=null&&end!=null&&end>=start?end-start:null}
function recoveryDuration(c){const start=num(c?.recoveryStartedAt),end=num(c?.recoveryCompletedAt);return start!=null&&end!=null&&end>=start?end-start:null}
function alertType(ep){const k=String(ep?.key||'').toLowerCase(),m=String(ep?.metric||'').toLowerCase();if(k==='hypotension'||m==='map')return 'hypotension';if(k==='hypoxemia'||m==='spo2')return 'hypoxemia';if(k==='ventilation'||m==='etco2'||m==='rr')return 'ventilation';if(k==='hypothermia'||m==='temp')return 'hypothermia';return 'other'}
function alertLabel(key){return ({hypotension:'MAP / hypotension alert',hypoxemia:'SpO₂ / hypoxemia alert',ventilation:'ETCO₂ / ventilation alert',hypothermia:'Temperature / hypothermia alert',other:'Other alert'})[key]||key}
function caseProblemReview(c){try{const api=root.ANESVET_PROBLEM_RESPONSE_REVIEW;if(api?.models&&api?.summary){const ms=api.models(c);return api.summary(ms)}}catch(_){ }
  const alerts=arr(c?.alertEpisodes),comps=arr(c?.complications),episodes=alerts.length+comps.length;
  const withIntervention=alerts.filter(x=>arr(x?.interventions).length).length+comps.filter(x=>String(x?.intervention||'').trim()||arr(x?.responses).length).length;
  const withResponse=alerts.filter(x=>x?.resolvedAt||arr(x?.interventions).some(i=>i?.follow)).length+comps.filter(x=>x?.resolvedAt||arr(x?.responses).length).length;
  const active=alerts.filter(x=>!x?.resolvedAt).length+comps.filter(x=>x?.status!=='resolved'&&!x?.resolvedAt).length;
  return{episodes,withIntervention,withResponse,active};
}
function medicationComplete(c){try{const s=root.AnesvetMedicationReconciliation?.summary?.(c);if(s)return !!s.complete}catch(_){ }
  if(c?.caseLocked&&c?.finalChecksum&&(!c.medicationReconciliation||typeof c.medicationReconciliation!=='object'))return true;
  const plan=arr(c?.protocolSnapshot?.caseDrugPlan||c?.caseDrugPlan).filter(x=>x&&!x.standby&&!/emergency|standby/i.test(`${x.phase||''} ${x.role||''}`));
  if(!plan.length)return true;
  const admins=arr(c?.drugAdministrations).filter(x=>!x?.voidedAt),decisions=c?.medicationReconciliation?.decisions||{};
  return plan.every(item=>admins.some(a=>String(a?.drug||'').trim().toLowerCase()===String(item?.name||item?.id||'').trim().toLowerCase())||Object.values(decisions).some(d=>d?.status==='not-given'));
}
function documentationChecks(c){
  try{const ev=root.ANESVET_DOCUMENTATION_GUARDIAN?.evaluateState?.(c,{now:caseEpoch(c)||Date.now(),recordIntervalMin:5,recoveryIntervalMin:5});if(ev?.completeness?.length)return ev.completeness.map(x=>({key:x.key,label:x.label,ok:!!x.ok,detail:x.detail||''}))}catch(_){ }
  return[
    {key:'airway',label:'Airway',ok:true,detail:'Fallback review unavailable'},
    {key:'monitoring',label:'Monitoring',ok:!c?.caseStartedAt||arr(c?.records).length>0,detail:''},
    {key:'medications',label:'Medications',ok:medicationComplete(c),detail:''},
    {key:'problems',label:'Problems',ok:arr(c?.alertEpisodes).every(x=>!!x?.resolvedAt)&&arr(c?.complications).every(x=>x?.status==='resolved'||!!x?.resolvedAt),detail:''},
    {key:'recovery',label:'Recovery',ok:!!c?.recoveryCompletedAt,detail:''},
    {key:'signoff',label:'Sign-off',ok:!!c?.finalSignoff?.anesthetist&&!!c?.finalSignoff?.surgeon,detail:''}
  ];
}
function caseRow(c){
  const alerts=arr(c?.alertEpisodes),complications=arr(c?.complications),checks=documentationChecks(c),complete=checks.filter(x=>x.ok).length,problem=caseProblemReview(c);
  const alertCounts={hypotension:0,hypoxemia:0,ventilation:0,hypothermia:0,other:0};for(const ep of alerts)alertCounts[alertType(ep)]++;
  return{
    caseId:String(c?.caseId||''),recordId:String(c?.humanRecordId||c?.caseId||'—'),epoch:caseEpoch(c),patientName:String(c?.patientName||'Unnamed'),hospitalId:String(c?.hospitalId||''),species:normalizedSpecies(c),procedure:procedureText(c),protocol:protocolLabel(c),locked:!!c?.caseLocked,final:isFinal(c),voided:isVoided(c),
    elapsedMs:documentedCaseElapsed(c),recoveryMs:recoveryDuration(c),recoveryOverride:!!c?.recoveryCompletionOverride,records:arr(c?.records).length,recoveryRecords:arr(c?.recoveryRecords).length,drugAdministrations:arr(c?.drugAdministrations).filter(x=>!x?.voidedAt).length,
    alerts:alerts.length,alertCounts,complications:complications.length,problem,documentationChecks:checks,documentationComplete:complete,documentationTotal:checks.length,medicationReconciled:medicationComplete(c),recoveryComplete:!!c?.recoveryCompletedAt,signoffComplete:!!c?.finalSignoff?.anesthetist&&!!c?.finalSignoff?.surgeon
  };
}
function aggregate(rows){
  const total=rows.length,completeness={};
  for(const r of rows)for(const c of r.documentationChecks){const x=completeness[c.key]||(completeness[c.key]={key:c.key,label:c.label,ok:0,total:0});x.total++;if(c.ok)x.ok++}
  const alertKeys=['hypotension','hypoxemia','ventilation','hypothermia','other'],alerts={};
  for(const k of alertKeys){const cases=rows.filter(r=>r.alertCounts[k]>0).length,episodes=rows.reduce((n,r)=>n+(r.alertCounts[k]||0),0);alerts[k]={key:k,label:alertLabel(k),cases,episodes,totalCases:total}}
  const protocols=new Map();for(const r of rows)protocols.set(r.protocol,(protocols.get(r.protocol)||0)+1);
  const problems=rows.reduce((a,r)=>({episodes:a.episodes+r.problem.episodes,withIntervention:a.withIntervention+r.problem.withIntervention,withResponse:a.withResponse+r.problem.withResponse,active:a.active+r.problem.active}),{episodes:0,withIntervention:0,withResponse:0,active:0});
  return{total,medianElapsedMs:median(rows.map(r=>r.elapsedMs)),medianRecoveryMs:median(rows.map(r=>r.recoveryMs)),casesWithAnyAlert:rows.filter(r=>r.alerts>0).length,casesWithComplication:rows.filter(r=>r.complications>0).length,recoveryOverrides:rows.filter(r=>r.recoveryOverride).length,medicationReconciled:rows.filter(r=>r.medicationReconciled).length,recoveryComplete:rows.filter(r=>r.recoveryComplete).length,signoffComplete:rows.filter(r=>r.signoffComplete).length,allStructuredComplete:rows.filter(r=>r.documentationTotal&&r.documentationComplete===r.documentationTotal).length,completeness:Object.values(completeness),alerts,protocols:[...protocols.entries()].sort((a,b)=>b[1]-a[1]).map(([label,count])=>({label,count})),problems};
}
function applyFilters(cases,filters={}){
  const now=Date.now(),days=Number(filters.days||0),cut=days>0?now-days*86400000:0,q=String(filters.procedure||'').trim().toLowerCase(),protocol=String(filters.protocol||'all'),species=String(filters.species||'all'),dataset=String(filters.dataset||'final');
  return arr(cases).map(caseRow).filter(r=>{
    if(dataset==='final'&&!r.final)return false;if(dataset==='voided'&&!r.voided)return false;if(dataset==='all'){}else if(dataset==='working'&&r.locked)return false;
    if(cut&&r.epoch<cut)return false;if(species!=='all'&&r.species!==species)return false;if(protocol!=='all'&&r.protocol!==protocol)return false;if(q&&!`${r.procedure} ${r.patientName} ${r.hospitalId} ${r.recordId}`.toLowerCase().includes(q))return false;return true;
  }).sort((a,b)=>b.epoch-a.epoch);
}
function model(cases,filters={}){const rows=applyFilters(cases,filters);return{version:VERSION,rows,summary:aggregate(rows),filters:{...filters}}}
function app(){return root.AnesvetApp||null}
function reviewAllowed(){try{const sec=app()?.security;return !(sec?.enabled?.()&&sec?.can?.('case-review')===false)}catch(_){return true}}
function archiveCases(){if(!reviewAllowed())return[];try{return clone(app()?.caseReview?.archives?.()||[])}catch(_){return[]}}
function filterValues(){return{days:$('caseReviewPeriod')?.value||'90',dataset:$('caseReviewDataset')?.value||'final',species:$('caseReviewSpecies')?.value||'all',protocol:$('caseReviewProtocol')?.value||'all',procedure:$('caseReviewSearch')?.value||''}}
function safeDate(epoch){if(!epoch)return '—';try{return new Date(epoch).toLocaleDateString('th-TH',{year:'numeric',month:'short',day:'numeric'})}catch(_){return new Date(epoch).toISOString().slice(0,10)}}
function progressHtml(ok,total,label){const p=pct(ok,total);return `<div class="case-review-progress-row"><div><b>${esc(label)}</b><small>${ok}/${total} case${total===1?'':'s'}</small></div><div class="case-review-progress"><i style="width:${clamp(p||0,0,100)}%"></i></div><span>${p==null?'—':p+'%'}</span></div>`}
function renderProtocolOptions(cases){const el=$('caseReviewProtocol');if(!el)return;const current=el.value||'all',labels=[...new Set(arr(cases).map(protocolLabel))].sort((a,b)=>a.localeCompare(b));el.innerHTML='<option value="all">All protocol versions</option>'+labels.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');if(labels.includes(current))el.value=current}
function render(){const host=$('caseReviewDashboard');if(!host)return null;const allowed=reviewAllowed();if($('caseReviewExportBtn'))$('caseReviewExportBtn').disabled=!allowed;if($('caseReviewDatasetNote')&&!allowed)$('caseReviewDatasetNote').textContent='Current staff role does not have Case Review permission.';const cases=archiveCases();renderProtocolOptions(cases);const m=model(cases,filterValues()),s=m.summary;
  $('caseReviewCount').textContent=`${s.total} case${s.total===1?'':'s'}`;
  $('caseReviewMedianDuration').textContent=fmtDuration(s.medianElapsedMs);$('caseReviewMedianRecovery').textContent=fmtDuration(s.medianRecoveryMs);$('caseReviewStructuredComplete').textContent=fmtPct(s.allStructuredComplete,s.total);
  $('caseReviewStructuredDetail').textContent=s.total?`${s.allStructuredComplete}/${s.total} cases with all displayed structured documentation domains complete`:'No cases in current filter';
  $('caseReviewAlertSummary').textContent=s.total?`${s.casesWithAnyAlert}/${s.total} cases with ≥1 documented physiologic alert episode`:'No cases in current filter';
  const ab=$('caseReviewAlertBreakdown');if(ab)ab.innerHTML=Object.values(s.alerts).filter(x=>x.key!=='other'||x.episodes).map(x=>`<div class="case-review-metric-row"><div><b>${esc(x.label)}</b><small>${x.episodes} documented episode${x.episodes===1?'':'s'}</small></div><span>${x.cases}/${x.totalCases} cases • ${fmtPct(x.cases,x.totalCases)}</span></div>`).join('')||'<div class="empty-state compact">No documented alert episodes in this filter.</div>';
  const cb=$('caseReviewCompleteness');if(cb)cb.innerHTML=s.completeness.map(x=>progressHtml(x.ok,x.total,x.label)).join('')||'<div class="empty-state compact">No cases available.</div>';
  const pb=$('caseReviewProblems');if(pb)pb.innerHTML=s.total?`<div class="case-review-stat-grid"><div><span>Problem / alert episodes</span><b>${s.problems.episodes}</b></div><div><span>With intervention documentation</span><b>${s.problems.withIntervention}</b></div><div><span>With response / outcome evidence</span><b>${s.problems.withResponse}</b></div><div><span>Active in archived records</span><b>${s.problems.active}</b></div></div><small class="case-review-note">These are documentation counts only. ANESVET does not infer treatment effectiveness or clinical appropriateness.</small>`:'<div class="empty-state compact">No cases available.</div>';
  const pr=$('caseReviewProtocols');if(pr)pr.innerHTML=s.protocols.length?s.protocols.map(x=>`<div class="case-review-metric-row"><div><b>${esc(x.label)}</b><small>Frozen protocol snapshot</small></div><span>${x.count} case${x.count===1?'':'s'} • ${fmtPct(x.count,s.total)}</span></div>`).join(''):'<div class="empty-state compact">No protocol snapshot in current filter.</div>';
  const ov=$('caseReviewOverrides');if(ov)ov.textContent=s.total?`${s.recoveryOverrides}/${s.total} Recovery completion override${s.recoveryOverrides===1?'':'s'} documented • ${s.casesWithComplication}/${s.total} cases with ≥1 structured complication`:'—';
  const list=$('caseReviewTableBody');if(list)list.innerHTML=m.rows.slice(0,40).map(r=>`<tr><td>${esc(safeDate(r.epoch))}</td><td><b>${esc(r.patientName)}</b><small>${esc(r.hospitalId?`HN ${r.hospitalId}`:r.recordId)}</small></td><td>${esc(r.procedure)}</td><td>${esc(r.protocol)}</td><td>${r.alerts}</td><td>${r.complications}</td><td>${esc(fmtDuration(r.recoveryMs))}${r.recoveryOverride?'<small>override documented</small>':''}</td><td>${r.documentationComplete}/${r.documentationTotal}</td></tr>`).join('')||'<tr><td colspan="8"><div class="empty-state compact">No archived cases match the current filter.</div></td></tr>';
  const note=$('caseReviewDatasetNote');if(note)note.textContent=allowed?((filterValues().dataset==='final'?'Metrics use non-voided Final Locked records only. ':'Metrics include the selected archive status; interpret mixed/working records as documentation review only. ')+`Showing ${s.total} case${s.total===1?'':'s'}.`):'Access restricted: current staff role does not have Case Review permission.';
  return m;
}
function csvCell(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replace(/"/g,'""')}"`:s}
function exportCsv(){const m=render()||model([],{}),cols=['Date','Record ID','Patient','HN','Species','Procedure','Protocol','Recorded elapsed min','Recovery min','Alert episodes','Complications','Problem episodes','Intervention documented','Response/outcome evidence','Recovery override','Medication reconciled','Recovery complete','Final sign-off','Structured domains complete','Structured domains total'];const lines=[cols.join(',')];for(const r of m.rows)lines.push([safeDate(r.epoch),r.recordId,r.patientName,r.hospitalId,r.species,r.procedure,r.protocol,r.elapsedMs==null?'':Math.round(r.elapsedMs/60000),r.recoveryMs==null?'':Math.round(r.recoveryMs/60000),r.alerts,r.complications,r.problem.episodes,r.problem.withIntervention,r.problem.withResponse,r.recoveryOverride?'yes':'no',r.medicationReconciled?'yes':'no',r.recoveryComplete?'yes':'no',r.signoffComplete?'yes':'no',r.documentationComplete,r.documentationTotal].map(csvCell).join(','));const blob=new Blob(['\uFEFF'+lines.join('\n')],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`ANESVET_CASE_REVIEW_${new Date().toISOString().slice(0,10)}.csv`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500)}
function init(){if(!$('caseReviewDashboard'))return;for(const id of ['caseReviewPeriod','caseReviewDataset','caseReviewSpecies','caseReviewProtocol','caseReviewSearch'])$(id)?.addEventListener(id==='caseReviewSearch'?'input':'change',()=>setTimeout(render,0));$('caseReviewRefreshBtn')?.addEventListener('click',render);$('caseReviewExportBtn')?.addEventListener('click',exportCsv);document.addEventListener('anesvet:archive-changed',()=>setTimeout(render,0));document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab="cases"], [data-mobile-tab="cases"], [data-more-tab="cases"]'))setTimeout(render,80)});setTimeout(render,160)}
const api=Object.freeze({version:VERSION,caseRow,aggregate,applyFilters,model,documentationChecks,render,exportCsv,init});root.ANESVET_CASE_REVIEW_DASHBOARD=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
if(typeof document!=='undefined'){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()}
})(typeof globalThis!=='undefined'?globalThis:this);
