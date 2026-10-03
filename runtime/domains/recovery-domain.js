(()=>{
'use strict';
function scoreFromValues(values={}){const domains={};let total=0,possible=0,incomplete=false,na=0;for(const k of ['airway','oxygenation','temperature','mentation','comfort']){const v=values[k]??'';domains[k]=v;if(v===''){incomplete=true;continue}if(v==='NA'){na++;continue}const n=Number(v);if(!Number.isFinite(n)){incomplete=true;continue}total+=n;possible+=2}return {domains,total,possible,percent:possible?Math.round(total/possible*100):null,incomplete,na,note:String(values.note||'').trim()}}
function scoreText(sc){if(!sc||sc.incomplete||!sc.possible)return 'Incomplete';return `${sc.total}/${sc.possible} (${sc.percent}%)${sc.na?` • N/A ${sc.na}`:''}`}
function readiness({all=[],done=0,na=0,rr=0,spo=0,tempF=null,ment='',ext='',spoNA=false,tempNA=false,extNA=false,records=0,scores=0,naReasonOk=true,emergencyReturnActive=false}={}){const reviewed=done+na,spoOk=spo>0||spoNA,tempOk=(tempF!==null&&tempF>0)||tempNA,extOk=!!ext||extNA,missing=[];if(reviewed!==all.length)missing.push(`checklist ${reviewed}/${all.length}`);if(!records)missing.push('vitals');if(!scores)missing.push('score');if(!(rr>0))missing.push('RR');if(!spoOk)missing.push('SpO₂');if(!tempOk)missing.push('Temp');if(!ment)missing.push('mentation');if(!extOk)missing.push('extubation');if(!naReasonOk)missing.push('N/A reason');const ready=reviewed===all.length&&records>0&&scores>0&&rr>0&&spoOk&&tempOk&&!!ment&&extOk&&naReasonOk&&!emergencyReturnActive;return {all,done,na,reviewed,rr,spo,tempF,ment,ext,spoOk,tempOk,extOk,records,scores,naReasonOk,missing,ready}}
function elapsed(startedAt,completedAt=null,now=Date.now()){return startedAt?Math.max(0,(completedAt||now)-startedAt):0}
function oxygenSupportUsed(value){const s=String(value||'').trim().toLowerCase();return !!s&&s!=='room air'}
function trendSummary(records=[]){
  const arr=(Array.isArray(records)?records:[]).filter(Boolean).slice().sort((a,b)=>(Number(a.epoch)||0)-(Number(b.epoch)||0));
  const first=arr[0]||null,latest=arr.at(-1)||null;
  const temps=arr.filter(r=>!r?.na?.temp&&Number.isFinite(Number(r?.temp))).map(r=>Number(r.temp));
  const oxygenRecords=arr.filter(r=>String(r?.oxygen||'').trim());
  return {
    count:arr.length,first,latest,
    tempFirst:temps.length?temps[0]:null,tempLatest:temps.length?temps.at(-1):null,tempDelta:temps.length>1?temps.at(-1)-temps[0]:null,
    oxygenLatest:latest?.oxygen||'',oxygenSupportCount:oxygenRecords.filter(r=>oxygenSupportUsed(r.oxygen)).length,oxygenDocumentedCount:oxygenRecords.length,
    mentationFirst:first?.mentation||'',mentationLatest:latest?.mentation||'',
    painScale:latest?.painScale||'',painScore:latest?.painScore||'',dysphoria:latest?.dysphoria||'',nausea:latest?.nausea||'',ambulation:latest?.ambulation||''
  }
}
window.ANESVET_RECOVERY_DOMAIN=Object.freeze({scoreFromValues,scoreText,readiness,elapsed,oxygenSupportUsed,trendSummary});
})();
