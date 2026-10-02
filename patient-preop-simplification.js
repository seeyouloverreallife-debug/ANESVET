/* ANESVET V17.10.10 — Patient + Pre-op progressive workflow presentation. */
(function(root){
'use strict';
const $=id=>document.getElementById(id);
const SECONDARY='.patient-secondary-field';
function value(id){const e=$(id);return String(e?.value||'').trim()}
function patientState(){
 const missing=[];
 if(!value('patientName'))missing.push('ชื่อ');
 if(!value('species'))missing.push('Species');
 const w=Number(value('weight'));if(!(w>0))missing.push('Current BW');
 if(!value('patientProcedure')&&!value('procedure'))missing.push('Procedure');
 if(!value('asa'))missing.push('ASA');
 return {missing,ready:missing.length===0};
}
function renderPatient(){
 const s=patientState(),box=$('patientRequiredSummary');if(!box)return;
 box.classList.toggle('ready',s.ready);
 box.textContent=s.ready?'✓ ข้อมูลหลักพร้อม — ตรวจข้อควรระวัง แล้วบันทึกไป Pre-check':`ยังขาด ${s.missing.length} รายการ: ${s.missing.join(' • ')}`;
}
function setDetails(open,persist=true){
 document.querySelectorAll(`#patient ${SECONDARY}`).forEach(el=>el.classList.toggle('patient-secondary-open',!!open));
 const b=$('patientMoreDetailsBtn');if(b){b.setAttribute('aria-expanded',String(!!open));b.textContent=open?'− ซ่อนรายละเอียดเพิ่มเติม':'＋ รายละเอียดเพิ่มเติม'}
 if(persist){try{localStorage.setItem('anesvet.patient.details.open',open?'1':'0')}catch(_){}}
}
function revealSecondaryFor(el){
 const sec=el?.closest?.(SECONDARY);if(sec&&!sec.classList.contains('patient-secondary-open'))setDetails(true);
}
function preopNext(){
 const b=$('preopNextIncompleteBtn');if(b&&!b.disabled){b.click();return}
 const exam=$('preopExamStatus'),risk=$('preopRiskStatus');
 if(exam&&!/RECORDED|DONE|COMPLETE/i.test(exam.textContent||'')){root.ANESVET_WORKSPACE_OWNER?.openForElement?.($('preopExamHeading'),{scroll:true});return}
 if(risk&&!/REVIEWED|DONE|COMPLETE/i.test(risk.textContent||'')){root.ANESVET_WORKSPACE_OWNER?.openForElement?.($('preopRiskHeading'),{scroll:true});return}
}
function renderPreop(){
 const progress=$('preopProgress'),title=$('preopQuickTitle'),summary=$('preopQuickSummary'),btn=$('preopQuickActionBtn');if(!progress||!title||!summary||!btn)return;
 const text=(progress.textContent||'').trim(),m=text.match(/(\d+)\s*\/\s*(\d+)/),done=m?Number(m[1]):0,total=m?Number(m[2]):0,complete=total>0&&done>=total;
 if(complete){title.textContent='✓ Pre-op checklist reviewed';summary.textContent='ไป Drug Plan / Readiness ต่อได้ โดย safety gate เดิมยังตรวจครบ';btn.textContent='→ ไป Drug Plan';btn.dataset.mode='drugs'}
 else{title.textContent=done?`เหลือ ${Math.max(0,total-done)} รายการที่ต้องทบทวน`:'เริ่ม Pre-op review';summary.textContent='ทำรายการที่ยังขาดทีละรายการ • ระบบไม่ mark Done หรือ N/A ให้อัตโนมัติ';btn.textContent='↓ ทำรายการถัดไป';btn.dataset.mode='next'}
}
function bind(){
 if(bind.done)return;bind.done=true;
 let open=false;try{open=localStorage.getItem('anesvet.patient.details.open')==='1'}catch(_){}
 setDetails(open);renderPatient();renderPreop();
 $('patientMoreDetailsBtn')?.addEventListener('click',()=>setDetails($('patientMoreDetailsBtn')?.getAttribute('aria-expanded')!=='true'));
 $('#patient');
 ['patientName','species','weight','patientProcedure','procedure','asa'].forEach(id=>$(id)?.addEventListener('input',renderPatient));

 $('preopQuickActionBtn')?.addEventListener('click',()=>{if($('preopQuickActionBtn')?.dataset.mode==='drugs')root.AnesvetApp?.setTab?.('drugs');else preopNext()});
 const po=$('preopProgress');if(po)new MutationObserver(renderPreop).observe(po,{subtree:true,childList:true,characterData:true,attributes:true});
}
root.ANESVET_PATIENT_PREOP_SIMPLIFICATION=Object.freeze({version:'17.10.10',bind,renderPatient,renderPreop,setDetails});
root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
