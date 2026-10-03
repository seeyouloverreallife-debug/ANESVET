/* ANESVET V16.12.0 — Documentation Guardian
   State-derived documentation reminders only. This module never infers that a
   medication was administered, never creates a clinical record, and never
   changes dose/alert/recovery logic. It points the user to existing workflows. */
(()=>{
  'use strict';
  const VERSION='16.12.0';
  const $=id=>document.getElementById(id);
  const api=()=>window.AnesvetApp||null;
  const state=()=>api()?.getState?.()||null;
  const esc=v=>api()?.escapeHtml?.(v)??String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const issuesById=new Map();
  let refreshTimer=null;

  function num(v,fallback=0){const n=Number(v);return Number.isFinite(n)?n:fallback}
  function minutesText(ms){
    const m=Math.max(0,Math.floor(ms/60000)),s=Math.max(0,Math.floor((ms%60000)/1000));
    return m?`${m}m ${String(s).padStart(2,'0')}s`:`${s}s`;
  }
  function eventNamed(s,name){return (s?.events||[]).some(e=>!e?.voidedAt&&String(e?.name||'').trim().toLowerCase()===String(name||'').trim().toLowerCase())}
  function activeAlerts(s){return (s?.alertEpisodes||[]).filter(a=>!a?.resolvedAt)}
  function activeComplications(s){return (s?.complications||[]).filter(c=>c?.status!=='resolved')}
  function airwayDocumented(s){
    if(eventNamed(s,'Airway record updated'))return true;
    return ['airwayEttSize','airwayEttDepth','airwayCuff','airwayDifficulty','airwayCircuit','airwayVentMode','airwayVt','airwayPip','airwayPeep','airwayVentRr']
      .some(k=>s?.[k]!==undefined&&s?.[k]!==null&&String(s[k]).trim()!=='');
  }
  function caseElapsedMs(s,now=Date.now()){
    const base=num(s?.timer?.elapsedMs,0);
    if(s?.timer?.running&&s?.timer?.startedEpoch)return Math.max(0,base+(now-num(s.timer.startedEpoch,now)));
    return Math.max(0,base);
  }
  function anesthesiaDue(s,intervalMin=5,now=Date.now()){
    if(!s?.caseStartedAt||s?.caseLocked||['setup','recovery','complete','locked'].includes(String(s?.casePhase||'setup')))return null;
    const interval=Math.max(1,num(intervalMin,5))*60000,records=Array.isArray(s.records)?s.records:[];
    if(!records.length){
      const elapsed=caseElapsedMs(s,now),late=elapsed-interval;
      return late>=0?{first:true,lateMs:late,intervalMs:interval}:null;
    }
    const last=records.at(-1),epoch=num(last?.epoch,0);if(!epoch)return null;
    const late=now-(epoch+interval);return late>=0?{first:false,lateMs:late,intervalMs:interval,last}:null;
  }
  function recoveryDue(s,intervalMin=5,now=Date.now()){
    if(String(s?.casePhase||'')!=='recovery'||s?.recoveryCompletedAt||s?.emergencyReturnActive)return null;
    const arr=Array.isArray(s.recoveryRecords)?s.recoveryRecords:[],interval=Math.max(1,num(intervalMin,5))*60000;
    if(!arr.length){
      const started=num(s?.recoveryStartedAt,0);if(!started)return {first:true,lateMs:0,intervalMs:interval};
      return {first:true,lateMs:Math.max(0,now-started),intervalMs:interval};
    }
    const last=arr.at(-1),late=now-(num(last?.epoch,now)+interval);return late>=0?{first:false,lateMs:late,intervalMs:interval,last}:null;
  }
  function norm(v){return String(v||'').trim().toLowerCase().replace(/\s+/g,' ')}
  function isStandby(item){const phase=norm(item?.phase),role=norm(item?.role);return !!item?.standby||phase==='emergency'||role.includes('emergency')||role.includes('standby')}
  function medicationRowsFromState(s){
    const plan=(s?.protocolSnapshot?.caseDrugPlan||s?.caseDrugPlan||[]).filter(Boolean),admins=(s?.drugAdministrations||[]).filter(a=>a&&!a.voidedAt).slice().sort((a,b)=>num(a?.epoch)-num(b?.epoch)),used=new Set(),rows=[];
    plan.forEach((item,planIndex)=>{
      if(isStandby(item))return;
      const pid=norm(item.id),pname=norm(item.name),byId=pid?admins.find(a=>!used.has(a.id)&&norm(a?.calculationBasis?.drug?.id)===pid):null;
      const actual=byId||admins.find(a=>!used.has(a.id)&&norm(a?.drug)===pname)||null;if(actual)used.add(actual.id);
      rows.push({item,planIndex,actual,status:actual?'given':'pending'});
    });
    return rows;
  }
  function medTiming(row,phase){
    if(row?.status==='given')return 'documented';
    const mp=norm(row?.item?.phase),cp=norm(phase||'setup');
    if(cp==='setup')return 'later';
    if(cp==='emergency')return 'review';
    if(mp==='post')return ['emergence','recovery','complete','locked'].includes(cp)?'review':'later';
    if(mp==='pre'||mp==='induction')return 'review';
    return 'review';
  }
  function medicationRowsLive(s){
    try{const rows=api()?.medicationQueue?.();if(Array.isArray(rows))return rows;}catch(_){ }
    return medicationRowsFromState(s);
  }
  function currentMedicationReview(s){return medicationRowsLive(s).filter(r=>r?.status==='pending'&&medTiming(r,s?.casePhase)==='review')}
  function medicationReconciliationSummary(s){
    try{const x=window.AnesvetMedicationReconciliation?.summary?.(s);if(x)return x;}catch(_){ }
    const rows=medicationRowsFromState(s),decisions=s?.medicationReconciliation?.decisions||{},pending=rows.filter(r=>{
      if(r.actual)return false;
      const same=Object.values(decisions).find(d=>d?.status==='not-given'&&norm(d?.drug||'')===norm(r.item?.name||''));
      return !same;
    }).length;
    return {total:rows.length,pending,given:rows.filter(r=>!!r.actual).length,notGiven:Math.max(0,rows.length-pending-rows.filter(r=>!!r.actual).length),complete:pending===0};
  }
  function issue(scope,id,tone,title,detail,action,actionLabel,data={}){return {scope,id:`${scope}:${id}`,tone,title,detail,action,actionLabel,data}}

  function evaluateState(s,{now=Date.now(),recordIntervalMin=5,recoveryIntervalMin=5}={}){
    const out={or:[],recovery:[],end:[],completeness:[]};if(!s)return out;
    const phase=String(s.casePhase||'setup');
    const due=anesthesiaDue(s,recordIntervalMin,now);
    if(due){
      const title=due.first?'First anesthesia vital set is due':'Anesthesia vitals are overdue',detail=due.first?`Case monitoring interval ${recordIntervalMin} min • no vital set documented yet`:`Target every ${recordIntervalMin} min • overdue ${minutesText(due.lateMs)}`;
      out.or.push(issue('or','vitals-due',due.lateMs>=Math.max(60000,due.intervalMs)?'danger':'warn',title,detail,'record-or-vitals','Enter vitals'));
    }
    if(s.caseStartedAt&&!s.caseLocked&&eventNamed(s,'Intubation')&&!airwayDocumented(s))out.or.push(issue('or','airway','warn','Intubation is timestamped but airway details are not documented','Record ETT / airway / ventilation details. This reminder does not assume which airway technique was used.','airway','Open airway record'));
    const medReview=currentMedicationReview(s);
    if(s.caseStartedAt&&!s.caseLocked&&medReview.length&&!['complete','locked'].includes(phase)){
      const first=medReview[0],names=medReview.slice(0,3).map(r=>r.item?.name||'Medication').join(' • ');
      out.or.push(issue('or','medication','warn',`${medReview.length} planned medication record${medReview.length===1?'':'s'} need review`,`${names}${medReview.length>3?' …':''} • no matching Actual administration record yet; this does not mean the medication was not given.`,'medication','Review medication',{row:first}));
    }

    const rDue=recoveryDue(s,recoveryIntervalMin,now);
    if(rDue){
      const title=rDue.first?'First recovery vital set needs documentation':'Recovery vitals are overdue',detail=rDue.first?'Recovery is active • record a measured recovery set when available':`Target every ${recoveryIntervalMin} min • overdue ${minutesText(rDue.lateMs)}`;
      out.recovery.push(issue('recovery','vitals-due',!rDue.first&&rDue.lateMs>=Math.max(60000,rDue.intervalMs)?'danger':'warn',title,detail,'record-recovery-vitals','Enter recovery vitals'));
    }
    if(phase==='recovery'&&!s.recoveryCompletedAt&&!s.emergencyReturnActive&&!s.extubatedAt&&!s?.recoveryObservationNA?.extubation){
      out.recovery.push(issue('recovery','extubation','warn','Extubation status is not documented','Enter extubation time, or use the existing N/A path when extubation is not applicable.','extubation','Review extubation'));
    }
    if(phase==='recovery'&&!s.recoveryCompletedAt&&medReview.length){
      const first=medReview[0];out.recovery.push(issue('recovery','medication','warn',`${medReview.length} planned medication record${medReview.length===1?'':'s'} need review`,'Current/earlier-phase planned medication has no matching Actual administration record yet.','medication','Review medication',{row:first}));
    }
    const openProblems=activeAlerts(s).length+activeComplications(s).length;
    if(phase==='recovery'&&!s.recoveryCompletedAt&&openProblems)out.recovery.push(issue('recovery','problems','danger',`${openProblems} active alert/problem${openProblems===1?'':'s'} still open`,'Review acknowledgement, intervention and outcome before finalizing the record.','problems','Review problems'));

    const intubated=eventNamed(s,'Intubation'),airwayOk=!intubated||airwayDocumented(s),monitoringOk=!s.caseStartedAt||(s.records||[]).length>0,medSummary=medicationReconciliationSummary(s),problemsOk=activeAlerts(s).length===0&&activeComplications(s).length===0,recoveryOk=!!s.recoveryCompletedAt,signoffOk=!!s.finalSignoff?.anesthetist&&!!s.finalSignoff?.surgeon;
    out.completeness=[
      {key:'airway',label:'Airway',ok:airwayOk,detail:intubated?(airwayOk?'Intubation + airway documentation found':'Intubation timestamp without airway details'):'No intubation documentation gap detected'},
      {key:'monitoring',label:'Monitoring',ok:monitoringOk,detail:monitoringOk?`${(s.records||[]).length} anesthesia vital record${(s.records||[]).length===1?'':'s'}`:'No anesthesia vital records documented'},
      {key:'medications',label:'Medications',ok:!!medSummary.complete,detail:medSummary.complete?`${medSummary.total||0} planned item${medSummary.total===1?'':'s'} reconciled`:`${medSummary.pending||0} planned medication${medSummary.pending===1?'':'s'} pending reconciliation`},
      {key:'problems',label:'Problems',ok:problemsOk,detail:problemsOk?'No unresolved alerts / complications':`${activeAlerts(s).length} alert(s) • ${activeComplications(s).length} complication(s) open`},
      {key:'recovery',label:'Recovery',ok:recoveryOk,detail:recoveryOk?(s.recoveryCompletionOverride?'Complete with documented override':'Recovery complete'):'Recovery not complete'},
      {key:'signoff',label:'Sign-off',ok:signoffOk,detail:signoffOk?'Anesthetist + surgeon signed':'Final clinical sign-off incomplete'}
    ];
    if(!airwayOk)out.end.push(issue('end','airway','warn','Airway documentation needs review','Intubation is timestamped, but structured airway details were not found.','airway','Review airway'));
    if(!monitoringOk)out.end.push(issue('end','monitoring','warn','No anesthesia vital records documented','ANESVET cannot determine whether monitoring occurred outside the app. Review the anesthesia record before final lock.','review-record','Review record'));
    if(!medSummary.complete)out.end.push(issue('end','medication','warn',`${medSummary.pending||0} planned medication${medSummary.pending===1?'':'s'} need reconciliation`,'Document each frozen-plan item as Actual administration or explicit Not given with reason.','med-reconciliation','Reconcile meds'));
    if(!problemsOk)out.end.push(issue('end','problems','danger','Active alert/problem remains unresolved',`${activeAlerts(s).length} unresolved alert(s) • ${activeComplications(s).length} active complication(s).`,'problems','Review problems'));
    if(!recoveryOk)out.end.push(issue('end','recovery','danger','Recovery is not complete','Complete Recovery, or use the existing documented override workflow when clinically appropriate.','recovery','Open Recovery'));
    if(!signoffOk)out.end.push(issue('end','signoff','warn','Final clinical sign-off is incomplete','Anesthetist and surgeon sign-off are required by the existing finalization workflow.','signoff','Review sign-off'));
    return out;
  }

  function liveOptions(){return {recordIntervalMin:Math.max(1,num($('recordInterval')?.value,5)),recoveryIntervalMin:Math.max(1,num($('recRecordInterval')?.value,5)),now:Date.now()}}
  function currentEvaluation(){return evaluateState(state(),liveOptions())}
  function badgeClass(issues){return issues.some(x=>x.tone==='danger')?'danger':issues.length?'warn':'good'}
  function badgeText(issues){return issues.length?`${issues.length} REVIEW`:'CLEAR'}
  function registerIssues(issues){issues.forEach(x=>issuesById.set(x.id,x))}
  function renderIssueList(listEl,issues,clearText){
    if(!listEl)return;registerIssues(issues);
    if(!issues.length){listEl.innerHTML=`<div class="documentation-guardian-clear"><span>✓</span><div><b>Documentation clear for this stage</b><small>${esc(clearText)}</small></div></div>`;return}
    listEl.innerHTML=issues.map(x=>`<article class="documentation-guardian-issue ${esc(x.tone)}"><span class="documentation-guardian-dot" aria-hidden="true"></span><div class="documentation-guardian-copy"><b>${esc(x.title)}</b><small>${esc(x.detail)}</small></div><button type="button" class="btn documentation-guardian-action" data-guardian-id="${esc(x.id)}">${esc(x.actionLabel||'Review')}</button></article>`).join('');
  }
  function renderCompact(scope,issues,{active=true,clearText='' }={}){
    const panel=$(`${scope}DocumentationGuardian`),badge=$(`${scope}DocumentationGuardianBadge`),list=$(`${scope}DocumentationGuardianList`);if(!panel||!badge||!list)return;
    panel.hidden=!active;if(!active)return;
    badge.textContent=badgeText(issues);badge.className=`status-pill ${badgeClass(issues)}`;
    renderIssueList(list,issues,clearText);
    panel.classList.toggle('has-danger',issues.some(x=>x.tone==='danger'));
  }
  function renderEnd(evaluation,s){
    const panel=$('endDocumentationGuardian'),badge=$('endDocumentationGuardianBadge'),grid=$('endDocumentationGuardianCompleteness'),list=$('endDocumentationGuardianList');if(!panel||!badge||!grid||!list)return;
    const issues=evaluation.end;badge.textContent=s?.caseLocked?'LOCKED':badgeText(issues);badge.className=`status-pill ${s?.caseLocked?'good':badgeClass(issues)}`;
    grid.innerHTML=evaluation.completeness.map(c=>`<div class="documentation-completeness-item ${c.ok?'good':'review'}"><span>${c.ok?'✓':'!'}</span><div><b>${esc(c.label)}</b><small>${esc(c.detail)}</small></div></div>`).join('');
    renderIssueList(list,issues,s?.caseLocked?'Final record is locked; Guardian is read-only.':'No documentation gaps detected by the Guardian. Final checklist and clinical judgment still apply.');
  }
  function refresh(){
    clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>{
      const s=state();if(!s){setTimeout(refresh,180);return;}issuesById.clear();const ev=currentEvaluation(),phase=String(s.casePhase||'setup');
      renderCompact('or',ev.or,{active:!!s.caseStartedAt&&!s.caseLocked&&!['recovery','complete','locked'].includes(phase),clearText:'No current-stage documentation reminder. Continue measured monitoring and normal workflow.'});
      renderCompact('recovery',ev.recovery,{active:phase==='recovery'&&!s.recoveryCompletedAt,clearText:'No current Recovery documentation reminder.'});
      renderEnd(ev,s);
    },20);
  }
  function scrollTo(el,focus=false){if(!el)return;try{el.scrollIntoView({behavior:'smooth',block:'center'})}catch(_){el.scrollIntoView()}if(focus)setTimeout(()=>{try{el.focus({preventScroll:true})}catch(_){el.focus?.()}},180)}
  function openAirway(){api()?.setTab?.('orlive',{force:true});setTimeout(()=>{const d=$('orAirwayPanelDetails');if(d)d.open=true;scrollTo(d||$('saveAirwayBtn'))},100)}
  function openProblems(){const s=state(),tab=String(s?.casePhase||'')==='recovery'?'recovery':'orlive';api()?.setTab?.(tab,{force:true});setTimeout(()=>scrollTo($(tab==='recovery'?'recoveryProblemsPanel':'orProblemPanel')),120)}
  function runAction(x){
    if(!x)return;
    switch(x.action){
      case 'record-or-vitals': api()?.setTab?.('orlive',{force:true});setTimeout(()=>{scrollTo($('orVitalsFocus')||$('orHr'));if(window.ANESVET_OR_LIVE_INSTANCE?.focusFastField)window.ANESVET_OR_LIVE_INSTANCE.focusFastField(0);else scrollTo($('orHr'),true)},100);break;
      case 'airway': openAirway();break;
      case 'medication': {
        const row=x.data?.row,item=row?.item||{};const purpose=norm(item.phase)==='induction'?'induction':'planned';
        if(String(state()?.casePhase||'')==='recovery')api()?.setTab?.('recovery',{force:true});else api()?.setTab?.('orlive',{force:true});
        setTimeout(()=>api()?.openMedication?.({phase:item.phase||'',purpose,drugId:item.id||''}),100);break;
      }
      case 'record-recovery-vitals': api()?.setTab?.('recovery',{force:true});setTimeout(()=>{scrollTo($('recoveryObservationPanel')||$('recHR'));scrollTo($('recHR'),true)},100);break;
      case 'extubation': api()?.setTab?.('recovery',{force:true});setTimeout(()=>scrollTo($('recExtubation'),true),100);break;
      case 'problems': openProblems();break;
      case 'med-reconciliation': api()?.setTab?.('endcase',{force:true});setTimeout(()=>window.AnesvetMedicationReconciliation?.focusPending?.()||scrollTo($('medicationReconciliationPanel')),100);break;
      case 'recovery': api()?.setTab?.('recovery',{force:true});setTimeout(()=>scrollTo($('recoveryFocusCompleteBtn')||$('recoveryReadiness')),100);break;
      case 'signoff': api()?.setTab?.('endcase',{force:true});setTimeout(()=>scrollTo(document.querySelector('.final-signoff-panel')),100);break;
      case 'review-record': api()?.setTab?.('record',{force:true});break;
    }
  }
  document.addEventListener('click',e=>{const b=e.target.closest?.('[data-guardian-id]');if(!b)return;runAction(issuesById.get(b.dataset.guardianId));setTimeout(refresh,250)});
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-tab],[data-mobile-tab],button'))setTimeout(refresh,90)});
  document.addEventListener('change',()=>refresh());
  document.addEventListener('anesvet:drug-administration-changed',()=>refresh());
  document.addEventListener('anesvet:medication-reconciliation-changed',()=>refresh());
  document.addEventListener('anesvet:fast-vitals-saved',()=>refresh());
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh()});
  setInterval(refresh,5000);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(refresh,120),{once:true});else setTimeout(refresh,120);

  window.ANESVET_DOCUMENTATION_GUARDIAN=Object.freeze({version:VERSION,evaluateState,refresh,currentEvaluation});
})();
