(function(root){
'use strict';
const VERSION='17.4.0';
const options=Object.freeze({
 species:['dog','cat','unknown'],rateContext:['low','expected','high','unknown'],
 quality:['good','poor','unknown'],regularity:['regular','respiratory','irregular','unknown'],
 p:['normal','abnormal','absent','unknown'],relation:['one','dropped','independent','unknown'],
 qrs:['narrow','wide','chaotic','flat','unknown'],pr:['normal','prolonged','progressive','fixed','unknown'],
 ectopy:['none','earlyNarrow','earlyWide','runWide','unknown'],perfusion:['adequate','poor','absent','unknown'],
 responsive:['yes','no','unknown'],breathing:['yes','no','unknown'],paperSpeed:['25','50','unknown'],gain:['known','unknown']
});
function normalize(input={}){
 const o={};for(const [key,allowed] of Object.entries(options))o[key]=allowed.includes(input[key])?input[key]:'unknown';
 const rate=String(input.rate??'').trim();o.rate=rate!==''&&Number.isFinite(Number(rate))&&Number(rate)>0?Number(rate):null;
 return o;
}
function interpret(input={},data=root.ANESVET_KNOWLEDGE_DATA){
 const o=normalize(input),candidates=[],missing=[],warnings=[];
 const reference=(source,locator)=>({source,locator});
 const ecg=(pages,section)=>reference('ECG',`${section}; PDF pp. ${pages}`);
 const statement=(text,refs)=>({text,refs});
 const add=(id,text)=>{const guide=data?.rhythms?.find(r=>r.id===id);if(guide&&!candidates.some(c=>c.id===id))candidates.push({id,name:guide.name,reason:statement(text,guide.references)})};
 const result={version:VERSION,mode:'Rule-based educational pattern review',diagnosis:false,normalized:o,candidates,missing,warnings,urgency:'review',hemodynamics:null,anesthesia:[],workflow:data?.workflow||[]};
 const cprRefs=[reference('RECOVER24','Table 1 MON-11 and CPR algorithm')];
 if(o.perfusion==='absent'||(o.responsive==='no'&&o.breathing==='no')){
  result.urgency='immediate';
  result.hemodynamics=statement('สงสัยไม่มี effective circulation หรือ unresponsive + apneic: เรียกทีม/ประเมิน CPA และเริ่ม RECOVER BLS เมื่อเข้าเกณฑ์ โดยไม่รอ ECG workflow',cprRefs);
  warnings.push(statement('ข้อความนี้อาศัย clinical observations ที่คุณเลือก; ไม่ยืนยัน CPA หรือ ROSC จาก ECG',cprRefs));
 }else if(o.perfusion==='poor'){
  result.urgency='urgent';result.hemodynamics=statement('Perfusion แย่: ขอ clinician support และแก้ reversible contributors พร้อมประเมิน rhythm; ไม่รอ educational classification',[reference('TECH','Ch. 13, PDF pp. 427–430')]);
 }else if(o.perfusion==='adequate')result.hemodynamics=statement('รายงาน perfusion ว่าเหมาะสม; ECG อย่างเดียวไม่ยืนยัน cardiac output ให้ติดตาม BP/pulse และ trend',[reference('TECH','Ch. 13, PDF pp. 428–430')]);
 else{missing.push('Pulse / BP / perfusion');result.hemodynamics=statement('ยังประเมิน hemodynamic significance ไม่ได้: ต้องตรวจ pulse, BP และ perfusion',[reference('TECH','Ch. 13, PDF pp. 428–430')]);}
 result.anesthesia.push(statement('ทบทวน depth, administered drugs, oxygenation/ventilation, temperature และ electrolytes/acid-base ตาม clinical context',[reference('TECH','Ch. 13, PDF pp. 428–430')]));
 if(o.quality!=='good'){
  add('artifact','Signal quality ไม่ได้รับการยืนยัน: ตรวจ electrodes/lead contact และ patient-pulse correlation ก่อนจัด rhythm');
  missing.push('Confirmed usable ECG signal');return result;
 }
 if(o.paperSpeed==='unknown'||o.gain==='unknown')warnings.push(statement('ยังไม่ทราบ speed/gain: ห้ามสรุป interval/width measurements จากช่องกระดาษ; ยืนยัน calibration ก่อน',[ecg('31–35','Waveforms, calibration and paper speeds')]));
 const contradictions=(o.qrs==='flat'||o.qrs==='chaotic')&&(o.p==='normal'||o.relation==='one'||o.ectopy==='earlyWide'||o.ectopy==='earlyNarrow');
 if(contradictions){warnings.push(statement('ข้อมูลที่เลือกขัดกัน: organized P:QRS/ectopy กับ flat/chaotic tracing; ตรวจ strip และแก้ observations',[ecg('314–315, 372–373','Arrest patterns and morphology')]));missing.push('Consistent observations');add('artifact','ข้อมูลไม่สอดคล้องกัน; ต้องตรวจ technical artifact และทบทวน strip');return result;}
 if(o.qrs==='flat'){add('asystole','เลือก flat tracing; exclude disconnected lead/low gain และประเมิน circulation');return result;}
 if(o.qrs==='chaotic'){add('vf','เลือก chaotic tracing ไม่มี organized QRS; exclude artifact และใช้ clinical CPA assessment');return result;}
 for(const [key,label] of [['regularity','Regularity'],['p','P wave'],['relation','P:QRS'],['qrs','QRS morphology']])if(o[key]==='unknown')missing.push(label);
 if(o.relation==='dropped'){
  add('av2','เลือก P ที่ไม่ conduct ทุกครั้ง: ทบทวน second-degree AV block กับ nonconducted APC; ไม่ระบุ Mobitz subtype จาก ratio อย่างเดียว');
  add('apc','Nonconducted atrial premature beat อาจเลียนแบบ AV block; ตรวจ P timing/morphology');
  if(o.p==='absent'){warnings.push(statement('เลือก absent P แต่รายงาน dropped P:QRS; ต้องยืนยัน atrial activity ก่อน',[ecg('257–271','AV block differential')]));}
 }else if(o.relation==='independent'){
  add('av3','เลือก P/QRS independent: เป็น AV dissociation ที่ต้องแยก complete block กับ usurpation/isorhythmic dissociation');
  if(o.rateContext==='high'&&o.qrs==='wide')add('vt','Wide rapid rhythm พร้อม independent atrial activity อาจเป็น VT; ต้องตรวจหลาย leads/capture/fusion และ perfusion');
 }else if(o.relation==='one'&&o.p==='normal'){
  if(o.pr==='prolonged'){
   if(o.paperSpeed!=='unknown'&&o.gain==='known')add('av1','รายงาน calibrated prolonged PR พร้อม 1:1 conduction: ทบทวน first-degree AV block ตาม species reference');
   else missing.push('Calibrated PR measurement before first-degree AV block review');
  }
  if(o.qrs==='wide'){
   add('svt','Sinus P:QRS อาจยังสัมพันธ์แม้ QRS wide: ทบทวน aberrancy/conduction disease; width อย่างเดียวไม่ยืนยัน VT');
   warnings.push(statement('Sinus atrial pattern กับ wide QRS ต้อง review conduction/morphology; ไม่เท่ากับ normal sinus ECG',[ecg('113–118','Wide-complex supraventricular rhythms')]));
  }else if(o.qrs==='narrow'){
   if(o.regularity==='respiratory')add('sinus_arrhythmia','Sinus P:QRS 1:1 และ R–R เปลี่ยนสัมพันธ์ respiration; ตรวจ longer strip/pause/ectopy');
   else if(o.regularity==='regular')add(o.rateContext==='low'?'sinus_brady':o.rateContext==='high'?'sinus_tachy':'sinus','Regular sinus P:QRS 1:1; rate classification มาจาก patient context ที่คุณเลือก ไม่ใช้ automatic species cutoff');
   else{add('sinus','Sinus relationship อาจมี irregular sinus discharge/ectopy; ต้องตรวจ longer strip');missing.push('Explain irregularity / exclude pauses and ectopy');}
  }
 }else if(o.p==='absent'&&o.regularity==='irregular'){
  add('af','Irregularly irregular และไม่เห็น consistent P สนับสนุนการทบทวน AF; ต้องแยก frequent ectopy/artifact และ hidden P');
  add('apc','Frequent atrial ectopy อาจคล้าย AF; ต้องยืนยัน P ใน longer strip/multiple leads');
 }else if(o.regularity==='regular'&&o.qrs==='narrow'&&o.rateContext==='high'&&(o.p==='absent'||o.p==='abnormal')){
  add('svt','Regular rapid narrow-complex pattern และ P ไม่ชัด/ผิดรูป: ทบทวน SVT กับ sinus/atrial/junctional mechanisms');
 }
 if(o.ectopy==='earlyNarrow')add('apc','รายงาน early narrow beat: ทบทวน atrial/junctional ectopy และ P morphology');
 if(o.ectopy==='earlyWide')add('vpc','รายงาน premature wide abnormal beat: ทบทวน VPC เทียบ SV ectopy with aberrancy');
 if(o.ectopy==='runWide'||(o.qrs==='wide'&&o.rateContext==='high')){
  add('vt','Wide-complex run/rapid pattern: ทบทวน ventricular origin; width/rate อย่างเดียวไม่พอ');
  add('svt','SV rhythm with aberrant conduction ยังเป็น differential ของ wide-complex tachycardia');
 }
 if(o.perfusion==='absent'&&['narrow','wide'].includes(o.qrs))add('pea','รายงาน circulation absent กับ organized activity: PEA เป็น clinical possibility; ECG เพียงอย่างเดียวระบุไม่ได้');
 if(!candidates.length){missing.push('Longer strip / additional leads / clinician interpretation');warnings.push(statement('ข้อมูลยังไม่พอหรือ pattern อยู่นอก rules ชุดนี้; ไม่บังคับให้ได้ชื่อ rhythm',[ecg('125–373','Rhythm differential and exceptions')]));}
 if(o.rate===null)missing.push('Observed ventricular rate (bpm)');
 if(o.rateContext==='unknown')missing.push('Rate relative to this patient');
 return result;
}
const api=Object.freeze({version:VERSION,options,normalize,interpret});root.ANESVET_ECG_EDUCATION=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
