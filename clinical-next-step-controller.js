/* ANESVET V17.10.6 — state-derived clinical next step. Navigation only; native gates remain authoritative. */
(function(root){
'use strict';
const $=id=>document.getElementById(id),app=()=>root.AnesvetApp||null;
let current=null,pending=false;
const good=id=>!!$(id)?.classList.contains('good');
function drugAction(){return $('drugNextTaskBtn')?.dataset.action||''}
function spec(){
 const s=app()?.getState?.()||{};
 if(s.caseLocked)return {title:'เคสปิดและ Archive แล้ว',summary:'ตรวจ Archive verification หรือเริ่มเคสใหม่',label:'ดู End Case',run:()=>app()?.setTab?.('endcase')};
 if(s.recoveryCompletedAt)return {title:'Recovery complete — ปิดเคส',summary:'ตรวจ Final record, sign-off และ Lock & Archive',label:'ไป End Case',run:()=>app()?.setTab?.('endcase')};
 if(s.recoveryStartedAt||s.casePhase==='recovery')return {title:'ทำ Recovery ต่อ',summary:'บันทึก recovery vitals, airway/oxygen, comfort และ readiness',label:'กลับ Recovery',run:()=>app()?.setTab?.('recovery')};
 if(s.caseStartedAt)return {title:'ทำ OR LIVE ต่อ',summary:'บันทึก vitals, ยาที่ให้จริง และเหตุการณ์ระหว่างวางยา',label:'กลับ OR LIVE',run:()=>app()?.setTab?.('orlive')};
 if(!good('patientSaveStatus'))return {title:'บันทึกข้อมูลผู้ป่วยและเคส',summary:'ข้อมูลนี้จะใช้ต่อใน Pre-check, Drug Plan, OR LIVE และรายงาน',label:'ไป Patient',run:()=>app()?.setTab?.('patient')};
 if(!good('preopProgress'))return {title:'ทำ Pre-anesthetic checklist ให้ครบ',summary:$('preopProgress')?.textContent?.trim()||'ตรวจรายการก่อนเริ่มเคส',label:'ไป Pre-check',run:()=>app()?.setTab?.('preop')};
 const da=drugAction();
 if(da==='build')return {title:'สร้าง Case Drug Plan',summary:'เริ่มจาก Hospital Protocol แล้วปรับเฉพาะเคสนี้',label:'สร้างแผนยา',run:()=>{$('drugNextTaskBtn')?.click();app()?.setTab?.('drugs')}};
 if(da==='review')return {title:'Review Case Drug Plan',summary:'ตรวจ dose, concentration, route และยาที่ต้อง standby ก่อน freeze',label:'Review plan',run:()=>app()?.setTab?.('drugs')};
 return {title:'ตรวจความพร้อมก่อนเข้า OR',summary:'เปิด OR LIVE ผ่าน readiness / briefing gate เดิมของ ANESVET',label:'ตรวจและเข้า OR LIVE',run:()=>{$('goOrLiveFromDrugBtn')?.click()}};
}
function render(){current=spec();if(!$('clinicalNextStepCard'))return;$('clinicalNextStepTitle').textContent=current.title;$('clinicalNextStepSummary').textContent=current.summary;$('clinicalNextStepBtn').textContent='→ '+current.label}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
function bind(){if(bind.done)return;bind.done=true;$('clinicalNextStepBtn')?.addEventListener('click',()=>{current=spec();current?.run?.()});document.addEventListener('change',schedule,true);document.addEventListener('click',e=>{if(e.target.closest?.('#patient,#preop,#drugs,#orlive,#recovery,#endcase,.workflow-tabs'))schedule()},true);const o=new MutationObserver(schedule);['patientSaveStatus','preopProgress','caseDrugPlanStatus','casePhaseBadge','recoveryPhaseBadge','endCaseReadiness'].forEach(id=>{const el=$(id);if(el)o.observe(el,{subtree:true,attributes:true,childList:true,characterData:true})});root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('pageshow',schedule);root.ANESVET_LIFECYCLE_COORDINATOR?.subscribe('final-archive-status',schedule);render()}
root.ANESVET_CLINICAL_NEXT_STEP=Object.freeze({version:'17.10.6',spec,render,schedule});root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
