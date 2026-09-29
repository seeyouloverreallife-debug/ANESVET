/* ANESVET V16.13.0 — Procedure Templates 2.0
   Built-in + hospital-defined documentation/workflow presets.
   Templates never prescribe doses, select medications for administration, change
   physiologic alert thresholds, or make treatment decisions. */
(function(root){
'use strict';
const STORAGE_KEY='anesvet_v16_procedure_template_library';
const LIBRARY_FORMAT='ANESVET_PROCEDURE_TEMPLATE_LIBRARY_V1';
const clone=x=>JSON.parse(JSON.stringify(x));
const CORE_MILESTONES=['Induction','Intubation','Surgery start','Surgery end','Extubation','Recovery'];
const BUILT_INS=[
  {id:'ovh',label:'OVH / OHE',badge:'OVH',defaultProcedure:'OVH / OHE',workflowProfile:'routine',aliases:['ovh','ohe','spay','ovariohysterectomy','ovariectomy','ทำหมันเพศเมีย','ทำหมันตัวเมีย'],focus:'Standard soft-tissue anesthesia documentation',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'Uses the standard anesthesia timeline; no procedure-specific drug or monitoring rules are added.'},
  {id:'castration',label:'Castration',badge:'CASTRATION',defaultProcedure:'Castration',workflowProfile:'routine',aliases:['castration','neuter','orchiectomy','ทำหมันเพศผู้','ทำหมันตัวผู้'],focus:'Standard routine anesthesia documentation',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'Keeps the routine OR LIVE flow compact.'},
  {id:'dental',label:'Dental',badge:'DENTAL',defaultProcedure:'Dental / scaling ± extraction',workflowProfile:'routine',aliases:['dental','dentistry','scaling','tooth extraction','extraction','ขูดหินปูน','ถอนฟัน','ทำฟัน'],focus:'Routine anesthesia timeline for dental procedures',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'Procedure details can still be entered in the editable Procedure field and Event timeline.'},
  {id:'mass',label:'Mass removal',badge:'MASS',defaultProcedure:'Mass removal',workflowProfile:'routine',aliases:['mass removal','mass excision','tumor removal','lumpectomy','ตัดก้อน','ผ่าก้อน','ก้อน'],focus:'Routine soft-tissue procedure documentation',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'Keeps procedure-specific surgical details in free-text/Event records without changing anesthesia rules.'},
  {id:'exploratory',label:'Exploratory laparotomy',badge:'EX-LAP',defaultProcedure:'Exploratory laparotomy',workflowProfile:'routine',aliases:['exploratory laparotomy','ex lap','ex-lap','laparotomy','celiotomy','ผ่าช่องท้อง','เปิดช่องท้อง'],focus:'Standard anesthesia workflow with a clear operative timeline',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'No assumption is made about the underlying diagnosis or treatment.'},
  {id:'orthopedic',label:'Orthopedic',badge:'ORTHO',defaultProcedure:'Orthopedic surgery',workflowProfile:'routine',aliases:['orthopedic','orthopaedic','fracture','tplo','fho','patella','กระดูก','ข้อ','กระดูกหัก'],focus:'Routine anesthesia timeline for orthopedic surgery',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'Implant, positioning, tourniquet, block, or surgical details remain clinician-documented events when relevant.'},
  {id:'csection',label:'C-section',badge:'C-SECTION',defaultProcedure:'Cesarean section / C-section',workflowProfile:'csection',aliases:['c-section','csection','cesarean','caesarean','cesarean section','caesarean section','ผ่าคลอด','ผ่าคลอดลูก'],focus:'Adds delivery timestamps to the standard anesthesia timeline',milestones:CORE_MILESTONES,extraMilestones:['First neonate delivered','Last neonate delivered'],quickEvents:[{category:'Neonatal',label:'Neonatal support event'}],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'First/last neonate timestamps are documentation milestones only; maternal and neonatal treatment remains clinician-directed.'},
  {id:'emergency',label:'Emergency / critical',badge:'EMERGENCY',defaultProcedure:'Emergency procedure',workflowProfile:'critical',aliases:['emergency','critical','trauma','ฉุกเฉิน','วิกฤต'],focus:'Keeps stabilization and support documentation visible',milestones:CORE_MILESTONES,extraMilestones:['Stabilization checkpoint','Critical care support event'],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'This template changes documentation visibility only; it does not mark ASA-E or choose resuscitation/treatment.'},
  {id:'custom',label:'Custom / other',badge:'CUSTOM',defaultProcedure:'',workflowProfile:'custom',aliases:[],focus:'Clinician-defined procedure with the standard OR LIVE framework',milestones:CORE_MILESTONES,extraMilestones:[],quickEvents:[],quickDrugRefs:[],chartingIntervalMin:null,fluidSetupNote:'',procedureNote:'',note:'Use the Procedure field and workflow-profile override for cases that do not fit a preset.'}
];
const BUILTIN_INDEX=Object.fromEntries(BUILT_INS.map(t=>[t.id,freezeTemplate({...t,source:'builtin'})]));
function normalize(v){return String(v||'').trim().toLowerCase().replace(/[–—]/g,'-').replace(/\s+/g,' ')}
function cleanText(v,max=160){return String(v??'').trim().replace(/\s+/g,' ').slice(0,max)}
function cleanList(v,maxItems=12,maxLen=100){
  const arr=Array.isArray(v)?v:String(v||'').split(/\r?\n|,/);
  const seen=new Set(),out=[];
  for(const raw of arr){const x=cleanText(raw,maxLen);if(!x)continue;const k=normalize(x);if(seen.has(k))continue;seen.add(k);out.push(x);if(out.length>=maxItems)break}
  return out;
}
function cleanQuickEvents(v){
  const arr=Array.isArray(v)?v:String(v||'').split(/\r?\n/),out=[];
  for(const raw of arr){
    let category='Procedure',label='';
    if(raw&&typeof raw==='object'){category=cleanText(raw.category||'Procedure',40)||'Procedure';label=cleanText(raw.label||raw.name,100)}
    else{const s=cleanText(raw,150);if(!s)continue;const parts=s.split('|');if(parts.length>1){category=cleanText(parts.shift(),40)||'Procedure';label=cleanText(parts.join('|'),100)}else label=s}
    if(label)out.push({category,label});if(out.length>=10)break;
  }
  return out;
}
function cleanQuickDrugRefs(v){
  const arr=Array.isArray(v)?v:String(v||'').split(/\r?\n|,/),out=[];
  for(const raw of arr){
    let id='',name='';
    if(raw&&typeof raw==='object'){id=cleanText(raw.id,100);name=cleanText(raw.name||raw.label,100)}else name=cleanText(raw,100);
    if(!id&&!name)continue;out.push({id,name});if(out.length>=8)break;
  }
  return out;
}
function freezeTemplate(t){
  return Object.freeze({...t,milestones:Object.freeze([...(t.milestones||[])]),extraMilestones:Object.freeze([...(t.extraMilestones||[])]),aliases:Object.freeze([...(t.aliases||[])]),quickEvents:Object.freeze((t.quickEvents||[]).map(x=>Object.freeze({...x}))),quickDrugRefs:Object.freeze((t.quickDrugRefs||[]).map(x=>Object.freeze({...x})))});
}
function sanitizeHospital(raw,{keepId=true}={}){
  raw=raw&&typeof raw==='object'?raw:{};
  const label=cleanText(raw.label,80);if(!label)throw new Error('Template name is required');
  const rawId=cleanText(raw.id,100);const id=keepId&&/^hospital:[A-Za-z0-9._-]+$/.test(rawId)?rawId:`hospital:${(root.crypto?.randomUUID?.()||`${Date.now()}-${Math.random().toString(36).slice(2)}`).replace(/[^A-Za-z0-9._-]/g,'')}`;
  const profile=['routine','critical','csection','custom'].includes(String(raw.workflowProfile||''))?String(raw.workflowProfile):'routine';
  const interval=raw.chartingIntervalMin===''||raw.chartingIntervalMin==null?null:Number(raw.chartingIntervalMin);
  const milestones=cleanList(raw.milestones?.length?raw.milestones:CORE_MILESTONES,16,100);if(!milestones.length)milestones.push(...CORE_MILESTONES);
  const coreNorm=new Set(CORE_MILESTONES.map(normalize)),extraFromMilestones=milestones.filter(x=>!coreNorm.has(normalize(x))),extra=cleanList([...(raw.extraMilestones||[]),...extraFromMilestones],12,100);
  return {
    schema:2,id,label,badge:cleanText(raw.badge||label.toUpperCase(),24),defaultProcedure:cleanText(raw.defaultProcedure,140),workflowProfile:profile,
    aliases:cleanList(raw.aliases,12,80),focus:cleanText(raw.focus||'Hospital-defined anesthesia documentation workflow',180),milestones:[...CORE_MILESTONES],extraMilestones:extra,
    quickEvents:cleanQuickEvents(raw.quickEvents),quickDrugRefs:cleanQuickDrugRefs(raw.quickDrugRefs),chartingIntervalMin:Number.isFinite(interval)&&interval>=1&&interval<=60?interval:null,
    fluidSetupNote:cleanText(raw.fluidSetupNote,240),procedureNote:cleanText(raw.procedureNote,240),note:cleanText(raw.note||'Hospital-defined documentation preset. Verify case-specific clinical plan before use.',240),
    source:'hospital',createdAt:Number(raw.createdAt)||Date.now(),updatedAt:Date.now()
  };
}
function readHospital(){
  try{const raw=JSON.parse(root.localStorage?.getItem(STORAGE_KEY)||'[]');if(!Array.isArray(raw))return [];return raw.map(x=>{try{return sanitizeHospital(x,{keepId:true})}catch(_){return null}}).filter(Boolean)}catch(_){return []}
}
function writeHospital(list){const rows=(Array.isArray(list)?list:[]).map(x=>sanitizeHospital(x,{keepId:true})).slice(0,50);root.localStorage?.setItem(STORAGE_KEY,JSON.stringify(rows));return rows}
function hospitalIndex(){return Object.fromEntries(readHospital().map(t=>[t.id,t]))}
function get(id){const key=String(id||'').toLowerCase();if(BUILTIN_INDEX[key])return clone(BUILTIN_INDEX[key]);const h=hospitalIndex();return h[id]?clone(h[id]):clone(BUILTIN_INDEX.custom)}
function listBuiltIn(){return BUILT_INS.map(t=>clone({...t,source:'builtin'}))}
function listHospital(){return readHospital().map(clone)}
function list(){return [...listBuiltIn(),...listHospital()]}
function infer(procedure){
  const p=normalize(procedure);if(!p)return null;let best=null,bestLen=0;
  for(const t of list()){if(t.id==='custom')continue;for(const raw of [t.defaultProcedure,t.label,...(t.aliases||[])]){const a=normalize(raw);if(!a)continue;if((p===a||p.includes(a)||a.includes(p))&&a.length>bestLen){best=t;bestLen=a.length}}}
  return best?clone(best):null;
}
function resolve(id,procedure='',fallbackProfile='routine'){
  const explicit=String(id||'');if(explicit){const t=get(explicit);if(t.id===explicit||BUILTIN_INDEX[String(explicit).toLowerCase()])return t}
  const inferred=infer(procedure);if(inferred)return inferred;if(fallbackProfile==='csection')return clone(BUILTIN_INDEX.csection);if(fallbackProfile==='critical')return clone(BUILTIN_INDEX.emergency);return clone(BUILTIN_INDEX.custom);
}
function snapshot({id,procedure='',workflowProfile='',capturedAt=Date.now()}={}){
  const t=resolve(id,procedure,workflowProfile||'routine');
  return {schema:2,id:t.id,label:t.label,badge:t.badge,source:t.source||'builtin',procedure:String(procedure||t.defaultProcedure||''),recommendedWorkflowProfile:t.workflowProfile,workflowProfile:String(workflowProfile||t.workflowProfile),focus:t.focus,milestones:[...(t.milestones||CORE_MILESTONES)],extraMilestones:[...(t.extraMilestones||[])],quickEvents:clone(t.quickEvents||[]),quickDrugRefs:clone(t.quickDrugRefs||[]),chartingIntervalMin:t.chartingIntervalMin??null,fluidSetupNote:t.fluidSetupNote||'',procedureNote:t.procedureNote||'',note:t.note,scope:'documentation-only',capturedAt:Number(capturedAt)||Date.now()};
}
function saveHospital(raw){const row=sanitizeHospital(raw,{keepId:true}),rows=readHospital(),i=rows.findIndex(x=>x.id===row.id);if(i>=0){row.createdAt=rows[i].createdAt||row.createdAt;rows[i]=row}else rows.push(row);writeHospital(rows);return clone(row)}
function deleteHospital(id){const key=String(id||'');if(!key.startsWith('hospital:'))return false;const rows=readHospital(),next=rows.filter(x=>x.id!==key);if(next.length===rows.length)return false;writeHospital(next);return true}
function duplicate(id){const base=get(id);return sanitizeHospital({...base,id:'',label:`${base.label} — Hospital`,source:'hospital',createdAt:Date.now(),updatedAt:Date.now()},{keepId:false})}
function exportHospital(){return {format:LIBRARY_FORMAT,version:1,exportedAt:Date.now(),templates:listHospital()}}
function importHospital(payload,{merge=true}={}){
  const src=Array.isArray(payload)?payload:Array.isArray(payload?.templates)?payload.templates:null;if(!src)throw new Error('Invalid procedure template library');
  const incoming=src.map(x=>sanitizeHospital(x,{keepId:true})),current=merge?readHospital():[],map=new Map(current.map(x=>[x.id,x]));incoming.forEach(x=>map.set(x.id,x));const rows=writeHospital([...map.values()]);return {imported:incoming.length,total:rows.length};
}
function replaceHospital(rows){return writeHospital(rows||[])}
function revision(){try{return root.localStorage?.getItem(STORAGE_KEY)||'[]'}catch(_){return '[]'}}
const api=Object.freeze({version:'16.13.0',storageKey:STORAGE_KEY,libraryFormat:LIBRARY_FORMAT,coreMilestones:Object.freeze([...CORE_MILESTONES]),get,list,listBuiltIn,listHospital,infer,resolve,snapshot,normalize,saveHospital,deleteHospital,duplicate,exportHospital,importHospital,replaceHospital,revision});
if(typeof module!=='undefined'&&module.exports)module.exports=api;
root.ANESVET_PROCEDURE_TEMPLATES=api;
})(typeof globalThis!=='undefined'?globalThis:this);
