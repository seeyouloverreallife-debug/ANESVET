/* ANESVET V17.10.11 — Drug Plan + Start Case workflow presentation. */
(function(root){
'use strict';const $=id=>document.getElementById(id);let current=null,pending=false;
function planState(){const st=$('caseDrugPlanStatus'),items=[...document.querySelectorAll('#caseDrugPlanList .case-drug-plan-item')],txt=(st?.textContent||'').toLowerCase(),frozen=st?.classList.contains('frozen')||txt.includes('frozen'),reviewed=frozen||st?.classList.contains('reviewed')||(txt.includes('reviewed')&&!txt.includes('not reviewed'));return {count:items.length,frozen,reviewed}}
function weight(){const n=Number($('weight')?.value||0);return Number.isFinite(n)&&n>0?n:0}
function spec(){
 const s=root.AnesvetApp?.getState?.()||{},p=planState(),bw=weight(),nativeAction=$('drugNextTaskBtn')?.dataset.action||'';
 if(s.caseStartedAt)return {title:'Case started — ใช้ Frozen Drug Plan ใน OR LIVE',summary:'บันทึกเฉพาะปริมาณที่ให้จริงใน OR LIVE',label:'กลับ OR LIVE',run:()=>root.AnesvetApp?.setTab?.('orlive'),tone:'good'};
 if(!bw)return {title:'ต้องยืนยัน Current BW ก่อนคำนวณยา',summary:'กลับ Patient เพื่อบันทึกน้ำหนักวันนี้ • ระบบจะไม่ใช้ default BW',label:'ไปยืนยัน BW',run:()=>root.AnesvetApp?.setTab?.('patient'),tone:'warn'};
 if(nativeAction==='build'||!p.count)return {title:'สร้าง Case Drug Plan',summary:`Current BW ${bw.toFixed(1)} kg • ดึงจาก Hospital Protocol แล้วปรับเฉพาะเคสนี้ได้`,label:'สร้างแผนจาก protocol',run:()=>{$('autoCaseDrugPlanBtn')?.click()},tone:'warn'};
 if(nativeAction==='review'||!p.reviewed)return {title:'ตรวจและ Review Case Drug Plan',summary:'ตรวจยา • dose • concentration • route • standby ก่อนยืนยันแผน',label:'Review plan',run:()=>{$('reviewCaseDrugPlanBtn')?.click()},tone:'warn'};
 return {title:p.frozen?'Drug Plan frozen สำหรับเคสนี้':'Drug Plan reviewed — ตรวจความพร้อมเข้า OR',summary:p.frozen?'การเปลี่ยน protocol ภายหลังจะไม่เปลี่ยน frozen plan ของเคส':'ใช้ readiness / briefing gate เดิมก่อน Start Case',label:'ตรวจความพร้อม → OR LIVE',run:()=>{$('goOrLiveFromDrugBtn')?.click()},tone:'good'};
}
function render(){current=spec();const p=planState(),bw=weight(),title=$('drugWorkflowFocusTitle');if(!title)return;title.textContent=current.title;$('drugWorkflowFocusSummary').textContent=current.summary;$('drugWorkflowPrimaryBtn').textContent=current.label;$('drugWorkflowFocus').dataset.tone=current.tone;$('drugWorkflowBwChip').textContent=bw?`BW ${bw.toFixed(1)} kg`:'BW NOT CONFIRMED';$('drugWorkflowBwChip').className=`status-pill ${bw?'good':'warn'}`;$('drugWorkflowPlanChip').textContent=p.frozen?'PLAN FROZEN':p.reviewed?'PLAN REVIEWED':p.count?'PLAN NOT REVIEWED':'NO CASE PLAN';$('drugWorkflowPlanChip').className=`status-pill ${p.reviewed?'good':'warn'}`}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
function bind(){if(bind.done)return;bind.done=true;$('drugWorkflowPrimaryBtn')?.addEventListener('click',()=>{current=spec();current.run()});['weight','drugFocusPlanOnly'].forEach(id=>$(id)?.addEventListener('change',schedule));const o=new MutationObserver(schedule);['caseDrugPlanStatus','caseDrugPlanList','patientSaveStatus','preopProgress'].forEach(id=>{const e=$(id);if(e)o.observe(e,{attributes:true,childList:true,characterData:true,subtree:true})});document.addEventListener('click',e=>{if(e.target.closest?.('#drugs,#casesummary,.workflow-tabs'))schedule()},true);render()}
root.ANESVET_DRUG_START_SIMPLIFICATION=Object.freeze({version:'17.10.11',spec,render,schedule});root.ANESVET_LIFECYCLE_COORDINATOR?.ready(bind);
})(window);
