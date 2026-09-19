/* ANESVET V14.7.1: V14.7 production helpers retained; baseline clinical values unchanged. */
(function(root){
'use strict';
const clone=x=>JSON.parse(JSON.stringify(x));
const metrics=['map','spo2','etco2','temp'];
const labels={map:'MAP',spo2:'SpO₂',etco2:'ETCO₂',temp:'Temperature'};
const legacy={map:{warningLow:70,criticalLow:60,warningHigh:null,criticalHigh:null},spo2:{warningLow:95,criticalLow:90,warningHigh:null,criticalHigh:null},etco2:{warningLow:40,criticalLow:30,warningHigh:55,criticalHigh:60},temp:{warningLow:99,criticalLow:98,warningHigh:null,criticalHigh:null}};
const numeric=x=>x===null||x===undefined||String(x).trim()===''||!Number.isFinite(Number(x))?null:Number(x);
function defaultAlertProtocol(){return {schema:1,temperatureUnit:'F',...clone(legacy)}}
function validateAlertProtocol(input){
  const p=defaultAlertProtocol(),errors=[];
  if(input?.temperatureUnit&&input.temperatureUnit!=='F')errors.push('Protocol temperature must be canonical F');
  if(input?.schema&&input.schema!==1)errors.push('Unsupported alert protocol schema');
  for(const key of metrics){const r=input?.[key];if(!r){errors.push(`${labels[key]}: missing thresholds`);continue}
    for(const f of ['warningLow','criticalLow','warningHigh','criticalHigh']){const n=numeric(r[f]);p[key][f]=n;if(n===null&&r[f]!==null&&r[f]!==undefined&&String(r[f]).trim()!=='')errors.push(`${labels[key]}: invalid ${f}`);if(n!==null&&(n<0||n>(key==='spo2'?100:key==='temp'?140:300)))errors.push(`${labels[key]}: ${f} outside supported range`)}
    const v=p[key];for(const side of ['Low','High'])if((v['warning'+side]===null)!==(v['critical'+side]===null))errors.push(`${labels[key]}: warning and critical ${side} must be set together`);
    if(v.warningLow===null&&v.warningHigh===null)errors.push(`${labels[key]}: at least one threshold pair is required`);
    if(v.warningLow!==null&&v.criticalLow>=v.warningLow)errors.push(`${labels[key]}: critical low must be below warning low`);
    if(v.warningHigh!==null&&v.criticalHigh<=v.warningHigh)errors.push(`${labels[key]}: critical high must be above warning high`);
    if(v.warningLow!==null&&v.warningHigh!==null&&v.warningLow>=v.warningHigh)errors.push(`${labels[key]}: warning low must be below warning high`);
  }return {valid:errors.length===0,errors,protocol:p};
}
function normalizeAlertProtocol(p){const r=validateAlertProtocol(p);return r.valid?r.protocol:defaultAlertProtocol()}
function effectiveAlertProtocol(c={},hospital){if(c.alertProtocolOverride?.protocol)return normalizeAlertProtocol(c.alertProtocolOverride.protocol);if(c.protocolSnapshot?.alertProtocol)return normalizeAlertProtocol(c.protocolSnapshot.alertProtocol);if(c.caseStartedAt||c.protocolSnapshot)return defaultAlertProtocol();return normalizeAlertProtocol(hospital||defaultAlertProtocol())}
function classifyAlert(key,value,protocol){const n=numeric(value);if(n===null)return 'neutral';const t=normalizeAlertProtocol(protocol)[key];if(!t)return 'neutral';if((t.criticalLow!==null&&n<t.criticalLow)||(t.criticalHigh!==null&&n>t.criticalHigh))return 'danger';if((t.warningLow!==null&&n<t.warningLow)||(t.warningHigh!==null&&n>t.warningHigh))return 'warn';return 'good'}
function measuredRange(records,key){const values=(records||[]).map(r=>numeric(r[key])).filter(v=>v!==null);return values.length?{min:Math.min(...values),max:Math.max(...values)}:null}
function buildHandoff(c,epoch=Date.now()){
  const records=[...(c.records||[])].sort((a,b)=>a.epoch-b.epoch),recovery=[...(c.recoveryRecords||[])].sort((a,b)=>a.epoch-b.epoch);
  return clone({schema:1,generatedAt:epoch,caseId:c.caseId,patientName:c.patientName||'',hospitalId:c.hospitalId||'',visitId:c.visitId||'',species:c.species||'',weight:numeric(c.weight),procedure:c.procedure||c.patientProcedure||'',asa:c.asa||'',anesthetist:c.anesthetist||'',allergies:c.patientAllergies||'',comorbidities:c.patientComorbidities||'',precautions:c.patientPrecautions||'',caseStartedAt:c.caseStartedAt||null,surgeryEndedAt:c.surgeryEndedAt||null,extubatedAt:c.extubatedAt||null,recoveryStartedAt:c.recoveryStartedAt||null,
    airway:{ett:c.airwayEttSize||'',depth:c.airwayEttDepth||'',difficulty:c.airwayDifficulty||'',cuff:c.airwayCuff||'',circuit:c.airwayCircuit||'',ventilation:c.airwayVentMode||''},latestAnesthesia:records.at(-1)||null,latestRecovery:recovery.at(-1)||null,extrema:Object.fromEntries(metrics.map(k=>[k,measuredRange(records,k)])),administrations:(c.drugAdministrations||[]).filter(d=>!d.voidedAt),alerts:(c.alertEpisodes||[]).filter(a=>!a.resolvedAt),complications:(c.complications||[]).filter(x=>x.status!=='resolved'),
    fluids:{actualTotal:numeric(c.fluidActualTotal),crystalloid:numeric(c.balanceCrystalloid),bolus:numeric(c.balanceBolus),blood:numeric(c.balanceBloodIn),bloodLoss:numeric(c.balanceBloodLoss),urine:numeric(c.balanceUrine),rate:numeric(c.fluidRateInput)},protocol:{name:c.protocolSnapshot?.name||'',version:c.protocolSnapshot?.version||'',capturedAt:c.protocolSnapshot?.capturedAt||null,alerts:effectiveAlertProtocol(c),override:c.alertProtocolOverride||null},oxygen:c.recOxygen||'',pain:c.recPain||'',mentation:c.recMentation||'',plan:c.planAnalgesia||'',emergencyReturns:(c.events||[]).filter(e=>e.category==='Emergency'&&/return/i.test(e.name||'')).length});
}
const api={clone,metrics,labels,numeric,defaultAlertProtocol,validateAlertProtocol,normalizeAlertProtocol,effectiveAlertProtocol,classifyAlert,measuredRange,buildHandoff};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.AnesvetWorkflow=Object.freeze(api);
})(typeof globalThis!=='undefined'?globalThis:this);
