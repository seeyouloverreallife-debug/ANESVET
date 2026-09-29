/* ANESVET V16.14.0 — Problem → Intervention → Response Review
   Read-only case review. It links existing documentation without creating
   treatment recommendations, changing thresholds, or writing clinical data. */
(function(root){
'use strict';
const VERSION='16.14.0';
let filter='all';
const $=id=>document.getElementById(id);
const app=()=>root.AnesvetApp;
const workflow=()=>root.AnesvetWorkflow;
const st=()=>app()?.getState?.()||{};
const esc=v=>app()?.escapeHtml?.(String(v??''))??String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const num=v=>v===null||v===undefined||String(v).trim()===''||!Number.isFinite(Number(v))?null:Number(v);
function clock(epoch,fallback=''){if(fallback)return String(fallback);if(!epoch)return '—';try{return new Date(epoch).toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false})}catch{return '—'}}
function elapsed(ms){ms=Math.max(0,Number(ms)||0);const s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),ss=s%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`:`${m}:${String(ss).padStart(2,'0')}`}
function metricOf(ep){return ep?.metric||Object.entries({map:'hypotension',spo2:'hypoxemia',etco2:'ventilation',temp:'hypothermia'}).find(([,v])=>v===ep?.key)?.[0]||''}
function metricLabel(metric){return ({map:'MAP',spo2:'SpO₂',etco2:'ETCO₂',temp:'Temperature',hr:'HR',rr:'RR'})[metric]||metric||'Measurement'}
function unit(metric){return metric==='map'||metric==='etco2'?' mmHg':metric==='spo2'?'%':metric==='temp'?' °F':''}
function valueText(metric,value){const n=num(value);if(n===null)return 'not recorded';if(metric==='temp')return `${n.toFixed(1)} °F`;return `${Number.isInteger(n)?n:n.toFixed(1)}${unit(metric)}`}
function thresholdClass(value,t){const n=num(value);if(n===null||!t)return 'neutral';if((t.criticalLow!=null&&n<Number(t.criticalLow))||(t.criticalHigh!=null&&n>Number(t.criticalHigh)))return 'danger';if((t.warningLow!=null&&n<Number(t.warningLow))||(t.warningHigh!=null&&n>Number(t.warningHigh)))return 'warn';return 'good'}
function thresholdLabel(cls){return cls==='danger'?'critical range':cls==='warn'?'warning range':cls==='good'?'within configured range':'not classified'}
function alertThreshold(ep,state=st()){if(ep?.thresholds)return ep.thresholds;const metric=metricOf(ep);return state.alertProtocolOverride?.protocol?.[metric]||state.protocolSnapshot?.alertProtocol?.[metric]||workflow()?.defaultAlertProtocol?.()?.[metric]||null}
function recordEpoch(r,s){return Number(r?.epoch)||((Number(s.caseStartedAt)||0)+(Number(r?.elapsedMs)||Number(r?.caseElapsedMs)||0))}
function metricMeasurements(metric,s=st()){const out=[];
  for(const r of s.records||[]){const v=num(r?.[metric]);if(v!==null)out.push({epoch:recordEpoch(r,s),clock:r.clock||'',value:v,context:'Anesthesia',record:r})}
  for(const r of s.recoveryRecords||[]){const v=num(r?.[metric]);if(v!==null&&!r?.na?.[metric])out.push({epoch:Number(r.epoch)||((Number(s.caseStartedAt)||0)+(Number(r.caseElapsedMs)||0)),clock:r.clock||'',value:v,context:'Recovery',record:r})}
  return out.filter(x=>x.epoch>0).sort((a,b)=>a.epoch-b.epoch);
}
function firstMeasurementAfter(metric,epoch,s=st()){return metricMeasurements(metric,s).find(x=>x.epoch>=Number(epoch||0))||null}
function snapshotLine(snap){if(!snap||typeof snap!=='object')return '';const parts=[];for(const k of ['hr','map','spo2','etco2','rr','temp']){const v=num(snap[k]);if(v!==null)parts.push(`${metricLabel(k)} ${valueText(k,v)}`)}return parts.join(' • ')}
function alertModel(ep,s=st()){const metric=metricOf(ep),t=alertThreshold(ep,s),interventions=(ep.interventions||[]).map(x=>{const follow=metric?firstMeasurementAfter(metric,x.epoch||((Number(s.caseStartedAt)||0)+(Number(x.elapsedMs)||0)),s):null;return {...x,follow}});
  const resolved=!!ep.resolvedAt,status=resolved?'resolved':'active',duration=resolved?Math.max(0,Number(ep.resolvedAt)-(Number(ep.startedAt||ep.epoch)||Number(ep.resolvedAt))):null;
  const followEvidence=interventions.some(x=>!!x.follow)||resolved;
  return {id:ep.id,kind:'alert',status,title:ep.label||ep.key||'Alert',tone:(ep.peakLevel||ep.level)==='danger'?'danger':'warn',startedAt:ep.startedAt||ep.epoch,startedClock:ep.clock||'',problem:[ep.trigger||`${metricLabel(metric)} ${valueText(metric,ep.value)}`,ep.acknowledgedAt?`Acknowledged ${clock(ep.acknowledgedAt)}${ep.acknowledgedBy?` • ${ep.acknowledgedBy}`:''}`:'Not acknowledged'].filter(Boolean),interventions,followEvidence,metric,threshold:t,resolvedAt:ep.resolvedAt,resolvedClock:ep.resolvedClock,resolutionNote:ep.resolutionNote||'',resolvedBy:ep.resolvedBy||'',resolutionMethod:ep.resolutionMethod||'',duration};
}
function complicationModel(c){const responses=(c.responses||[]).map(x=>({...x,snapshotText:snapshotLine(x.snapshot)})),resolved=c.status==='resolved'||!!c.resolvedAt,status=resolved?'resolved':'active';const duration=resolved?Math.max(0,Number(c.resolvedAt)-(Number(c.epoch)||Number(c.resolvedAt))):null;
  return {id:c.id,kind:'problem',status,title:c.type||'Complication',tone:c.severity==='emergency'?'danger':'warn',startedAt:c.epoch,startedClock:c.clock||'',problem:[c.assessment?`Assessment: ${c.assessment}`:'',c.note||'',c.onsetSnapshot?`Onset snapshot: ${snapshotLine(c.onsetSnapshot)}`:''].filter(Boolean),initialIntervention:c.intervention||'',responses,followEvidence:responses.length>0||resolved,resolvedAt:c.resolvedAt,resolvedClock:c.resolvedClock,resolutionNote:c.resolutionNote||'',resolvedBy:c.resolvedBy||'',duration};
}
function models(s=st()){return [...(s.alertEpisodes||[]).map(ep=>alertModel(ep,s)),...(s.complications||[]).map(complicationModel)].sort((a,b)=>(a.startedAt||0)-(b.startedAt||0))}
function summary(ms){return {episodes:ms.length,withIntervention:ms.filter(m=>m.kind==='alert'?m.interventions.length>0:!!m.initialIntervention||m.responses.length>0).length,withResponse:ms.filter(m=>m.followEvidence).length,active:ms.filter(m=>m.status==='active').length}}
function responseHtml(m){
  if(m.kind==='alert'){
    const blocks=[];
    for(const x of m.interventions){const follow=x.follow;blocks.push(`<div class="pir-response-row"><div><b>${esc(clock(x.epoch,x.clock))}</b><span>${follow?`${esc(follow.context)} follow-up ${esc(clock(follow.epoch,follow.clock))}`:'No later measurement documented'}</span></div><p>${follow?`${esc(metricLabel(m.metric))} ${esc(valueText(m.metric,follow.value))} • ${esc(thresholdLabel(thresholdClass(follow.value,m.threshold)))}`:'No later '+esc(metricLabel(m.metric))+' value is linked after this documented intervention.'}</p></div>`)}
    if(m.resolvedAt)blocks.push(`<div class="pir-response-row outcome"><div><b>${esc(clock(m.resolvedAt,m.resolvedClock))}</b><span>Documented outcome${m.duration!=null?` • episode ${esc(elapsed(m.duration))}`:''}</span></div><p>${esc(m.resolutionNote||'Resolved')}${m.resolvedBy?` • ${esc(m.resolvedBy)}`:''}${m.resolutionMethod?` • ${esc(m.resolutionMethod)}`:''}</p></div>`);
    return blocks.length?blocks.join(''):'<div class="pir-empty-step">No intervention / outcome response documented yet.</div>';
  }
  const blocks=(m.responses||[]).map(x=>`<div class="pir-response-row"><div><b>${esc(clock(x.epoch,x.clock))}</b><span>Documented response / action${x.actor?` • ${esc(x.actor)}`:''}</span></div><p>${esc(x.note||'Response captured')}${x.snapshotText?`<br><small>${esc(x.snapshotText)}</small>`:''}</p></div>`);
  if(m.resolvedAt&&!blocks.some(x=>String(x).includes(esc(m.resolutionNote))))blocks.push(`<div class="pir-response-row outcome"><div><b>${esc(clock(m.resolvedAt,m.resolvedClock))}</b><span>Documented outcome${m.duration!=null?` • episode ${esc(elapsed(m.duration))}`:''}</span></div><p>${esc(m.resolutionNote||'Resolved')}${m.resolvedBy?` • ${esc(m.resolvedBy)}`:''}</p></div>`);
  return blocks.length?blocks.join(''):'<div class="pir-empty-step">No response / outcome documented yet.</div>';
}
function interventionHtml(m){
  if(m.kind==='alert')return m.interventions.length?m.interventions.map(x=>`<div class="pir-intervention-row"><b>${esc(clock(x.epoch,x.clock))}</b><p>${esc(x.note||'Intervention documented')}${x.actor?`<small>${esc(x.actor)}</small>`:''}</p></div>`).join(''):'<div class="pir-empty-step">No intervention documented.</div>';
  const rows=[];if(m.initialIntervention)rows.push(`<div class="pir-intervention-row"><b>${esc(clock(m.startedAt,m.startedClock))}</b><p>${esc(m.initialIntervention)}<small>Initial intervention</small></p></div>`);for(const x of m.responses||[])if(x.note)rows.push(`<div class="pir-intervention-row"><b>${esc(clock(x.epoch,x.clock))}</b><p>${esc(x.note)}${x.actor?`<small>${esc(x.actor)}</small>`:''}</p></div>`);return rows.length?rows.join(''):'<div class="pir-empty-step">No intervention documented.</div>';
}
function cardHtml(m){return `<article class="pir-card ${esc(m.tone)} ${m.status==='resolved'?'resolved':'active'}" data-pir-id="${esc(m.id)}"><header><div><span class="pir-kind">${m.kind==='alert'?'ALERT EPISODE':'COMPLICATION / PROBLEM'}</span><h3>${esc(m.title)}</h3></div><span class="pir-status ${m.status}">${m.status==='resolved'?'RESOLVED':'ACTIVE'}</span></header><div class="pir-chain"><section><div class="pir-step-label">1 • Problem</div><b>${esc(clock(m.startedAt,m.startedClock))}</b>${m.problem.length?m.problem.map(x=>`<p>${esc(x)}</p>`).join(''):'<p>No structured problem detail.</p>'}</section><section><div class="pir-step-label">2 • Intervention</div>${interventionHtml(m)}</section><section><div class="pir-step-label">3 • Response / outcome</div>${responseHtml(m)}</section></div>${m.status==='active'?`<footer><button class="btn" type="button" data-pir-open="${esc(m.id)}">Open active problem</button><span>Review only — ANESVET does not infer treatment success.</span></footer>`:''}</article>`}
function filtered(ms){return filter==='active'?ms.filter(x=>x.status==='active'):filter==='resolved'?ms.filter(x=>x.status==='resolved'):ms}
function refresh(){const box=$('pirReviewList');if(!box)return null;const ms=models(),sum=summary(ms),show=filtered(ms);
  if($('pirEpisodeCount'))$('pirEpisodeCount').textContent=String(sum.episodes);if($('pirInterventionCount'))$('pirInterventionCount').textContent=String(sum.withIntervention);if($('pirResponseCount'))$('pirResponseCount').textContent=String(sum.withResponse);if($('pirActiveCount'))$('pirActiveCount').textContent=String(sum.active);
  document.querySelectorAll('[data-pir-filter]').forEach(b=>b.classList.toggle('primary',b.dataset.pirFilter===filter));
  box.innerHTML=show.length?show.map(cardHtml).join(''):`<div class="empty-state">${ms.length?'No episodes match this filter.':'No alert episodes or structured complications documented in this case.'}</div>`;
  return {version:VERSION,summary:sum,models:ms};
}
function reportHtml(s=st()){const ms=models(s);if(!ms.length)return '<div style="font-size:8px">No alert episodes or structured complications</div>';return ms.map(m=>`<div class="report-event"><b>${esc(clock(m.startedAt,m.startedClock))}</b><span>${esc(m.status.toUpperCase())}</span><div><b>${esc(m.title)}</b><br><span>Problem: ${esc(m.problem.join(' • ')||'—')}</span><br><span>Intervention: ${esc(m.kind==='alert'?(m.interventions.map(x=>x.note).filter(Boolean).join(' | ')||'None documented'):(m.initialIntervention||m.responses.map(x=>x.note).filter(Boolean).join(' | ')||'None documented'))}</span><br><span>Response / outcome: ${esc(m.resolutionNote||(m.followEvidence?'Follow-up documentation present':'No response documented'))}</span></div></div>`).join('')}
function openActive(){const s=st();app()?.setTab?.(s.casePhase==='recovery'?'recovery':'orlive',{force:true});setTimeout(()=>{const el=$(s.casePhase==='recovery'?'recoveryProblemsPanel':'orProblemPanel');el?.scrollIntoView?.({behavior:'smooth',block:'center'})},100)}
function init(){
  document.addEventListener('click',e=>{const f=e.target.closest?.('[data-pir-filter]');if(f){filter=f.dataset.pirFilter||'all';refresh();return}if(e.target.closest?.('[data-pir-open]')){openActive();return}if(e.target.closest?.('[data-more-tab="timeline"], [data-tab="timeline"]'))setTimeout(refresh,60);});
  for(const ev of ['anesvet:problem-response-changed','anesvet:fast-vitals-saved','anesvet:drug-administration-changed'])document.addEventListener(ev,()=>setTimeout(refresh,0));
  refresh();
}
root.ANESVET_PROBLEM_RESPONSE_REVIEW=Object.freeze({version:VERSION,models,summary,refresh,reportHtml});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})(typeof globalThis!=='undefined'?globalThis:this);
