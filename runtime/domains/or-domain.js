(()=>{
'use strict';
const VITAL_KEYS=['hr','rr','sap','map','dap','spo2','etco2','temp','vaporizer','o2flow','fluidRate','fluidTotal','depth','ventilation','note'];
function vitalSnapshotSignature(r){if(!r)return '';return VITAL_KEYS.map(k=>`${k}:${r[k]===null||r[k]===undefined?'':String(r[k]).trim()}`).join('|')}
function recentExactVitalDuplicate(records,snap,guardMs=12000){const last=(records||[]).at(-1);if(!last)return null;const delta=Number(snap?.epoch||Date.now())-Number(last.epoch||0);if(delta<0||delta>guardMs)return null;return vitalSnapshotSignature(last)===vitalSnapshotSignature(snap)?{record:last,delta}:null}
function vitalRecordSummary(r,{formatTemp=v=>String(v)}={}){if(!r)return '—';const bits=[`HR ${r.hr??'—'}`,`RR ${r.rr??'—'}`,`MAP ${r.map??'—'}`,`SpO₂ ${r.spo2??'—'}%`,`ETCO₂ ${r.etco2??'—'}`,`Temp ${r.temp==null?'—':formatTemp(r.temp)}`];if(r.vaporizer!==null&&r.vaporizer!==''&&r.vaporizer!==undefined)bits.push(`Vaporizer ${r.vaporizer}%`);if(r.o2flow!==null&&r.o2flow!==''&&r.o2flow!==undefined)bits.push(`O₂ ${r.o2flow} L/min`);return bits.join(' • ')}
function recordAlert(r,{species='',classifyAlert,defaultAlertProtocol}={}){const num=v=>v===null||v===''||v===undefined?null:Number(v),hr=num(r?.hr),rr=num(r?.rr),map=num(r?.map),spo2=num(r?.spo2),et=num(r?.etco2),temp=num(r?.temp);const hrCritical=hr!==null&&(species==='cat'?(hr<90||hr>225):(hr<40||hr>190));const rrCritical=rr!==null&&(species==='cat'?(rr<7):(rr<6));if(hrCritical||rrCritical)return true;if(typeof classifyAlert!=='function')return false;const protocol=r?.alertProtocol||(typeof defaultAlertProtocol==='function'?defaultAlertProtocol():undefined);return Object.entries({map,spo2,etco2:et,temp}).some(([k,v])=>classifyAlert(k,v,protocol)==='danger')}

const GAS_KEYS=['vaporizer','o2flow'];
function gasNumber(v){if(v===null||v===undefined||String(v).trim()==='')return null;const n=Number(v);return Number.isFinite(n)?n:NaN}
function gasBaseline(records=[],events=[]){
 const baseline={vaporizer:null,o2flow:null};
 const sources=[...records.map(r=>({epoch:r.epoch||0,values:r})),...events.filter(e=>e.gasSettingChange?.version===1).map(e=>({epoch:e.epoch||0,values:e.gasSettingChange.after}))].sort((a,b)=>a.epoch-b.epoch);
 for(const source of sources)for(const key of GAS_KEYS){const n=gasNumber(source.values?.[key]);if(n!==null&&Number.isFinite(n))baseline[key]=n}
 return baseline;
}
function gasChangeDraft(records,events,values){
 const before=gasBaseline(records,events),after={},changes=[];
 for(const key of GAS_KEYS){const n=gasNumber(values?.[key]);if(n!==null&&(!Number.isFinite(n)||n<0||n>(key==='vaporizer'?5:10)))return {ok:false,reason:'invalid',key,before,changes:[]};after[key]=n;if(n!==null&&n!==before[key])changes.push({key,before:before[key],after:n})}
 return {ok:changes.length>0,reason:changes.length?'changed':'unchanged',version:1,before,after,changes};
}
function gasValueText(key,v){const n=Number(v);return v===null||v===undefined?'ยังไม่ระบุ':`${Number.isInteger(n)?n.toFixed(1):String(n)}${key==='vaporizer'?'%':' L/min'}`}
function gasChangeText(change){return (change?.changes||[]).map(c=>`${c.key==='vaporizer'?'Vaporizer':'O₂'} ${gasValueText(c.key,c.before)} → ${gasValueText(c.key,c.after)}`).join(' • ')}

window.ANESVET_OR_DOMAIN=Object.freeze({gasNumber,gasBaseline,gasChangeDraft,gasValueText,gasChangeText,VITAL_KEYS,vitalSnapshotSignature,recentExactVitalDuplicate,vitalRecordSummary,recordAlert});
})();
