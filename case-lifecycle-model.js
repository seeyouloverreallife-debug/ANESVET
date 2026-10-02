(function(){
'use strict';
const ORDER=Object.freeze(['setup','induction','intraop','emergence','recovery']);
const META=Object.freeze({
 setup:Object.freeze({label:'SETUP',className:'setup',title:'SETUP',help:'เตรียมข้อมูลผู้ป่วย อุปกรณ์ และ pre-anesthetic checklist',hint:'Next: กด Start case เพื่อเข้าสู่ Induction',eventName:''}),
 induction:Object.freeze({label:'INDUCTION',className:'induction',title:'INDUCTION',help:'เริ่มวางยา / induction และเตรียม airway',hint:'Next: เมื่อเริ่มผ่าตัด กด Surgery start',eventName:'Induction phase'}),
 intraop:Object.freeze({label:'INTRAOPERATIVE',className:'intraop',title:'INTRAOPERATIVE',help:'อยู่ระหว่างการผ่าตัดและเฝ้าระวัง anesthesia',hint:'Next: เมื่อผ่าตัดเสร็จ กด Surgery end',eventName:'Intraoperative phase'}),
 emergence:Object.freeze({label:'EMERGENCE',className:'emergence',title:'SURGERY END / EMERGENCE',help:'การผ่าตัดสิ้นสุด รอการตื่นและถอดท่อ',hint:'Next: เมื่อถอดท่อ กด Extubation → ระบบจะเข้า Recovery อัตโนมัติ',eventName:'Emergence phase'}),
 recovery:Object.freeze({label:'RECOVERY',className:'recovery',title:'RECOVERY',help:'หลังถอดท่อ บันทึก recovery vital signs เป็นช่วงเวลา',hint:'Recovery active — OR LIVE ถูกล็อก ยกเว้น Emergency return',eventName:'Recovery phase'}),
 emergency:Object.freeze({label:'EMERGENCY RETURN',className:'emergency',title:'EMERGENCY RETURN',help:'กลับ OR LIVE เพื่อ airway / ventilation / resuscitation',hint:'EMERGENCY RETURN — เมื่อ stable แล้วกด Return to Recovery',eventName:'Emergency return to OR'}),
 complete:Object.freeze({label:'COMPLETE',className:'complete',title:'COMPLETE',help:'Recovery complete — พร้อม End Case',hint:'Recovery complete — ไป End Case',eventName:'Case complete'})
});
function normalize(phase){return META[phase]?phase:'setup'}
function metadata(phase,{locked=false}={}){if(locked)return Object.freeze({label:'LOCKED',className:'locked',title:'COMPLETE',help:META.complete.help,hint:META.complete.hint,eventName:''});return META[normalize(phase)]}
function trackerState(phase,{locked=false}={}){const current=locked?'complete':normalize(phase),idx=ORDER.indexOf(current);return {current,index:idx,order:ORDER,meta:metadata(current),stepState(step){const pidx=ORDER.indexOf(step);if(current==='emergency')return step==='recovery'?'emergency-active':(pidx>=0&&pidx<4?'done':'');if(current==='complete')return 'done';if(step===current)return 'active';return pidx>=0&&idx>=0&&pidx<idx?'done':''}}}
function eventName(phase){return META[phase]?.eventName||''}
window.ANESVET_CASE_LIFECYCLE_MODEL=Object.freeze({ORDER,META,normalize,metadata,trackerState,eventName});
})();
