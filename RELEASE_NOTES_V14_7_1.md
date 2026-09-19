# ANESVET V14.7.1 — OR LIVE Workflow UX

## Why this release

V14.7 มีความสามารถใน OR LIVE ครบขึ้นมาก แต่มีปุ่มและ panel ซ้ำหลายจุด และ milestone ที่ต้องใช้ตั้งแต่ช่วงต้น เช่น Induction / Intubation อยู่ต่ำกว่าข้อมูล monitoring หลาย section รอบนี้จึงปรับ interaction hierarchy โดยไม่เปลี่ยน clinical logic เดิม

## Workflow-first OR LIVE

เพิ่ม `Next Clinical Step` เป็น action หลักด้านบนหน้าจอ ปุ่มเปลี่ยนตาม `casePhase` และข้อมูลที่ถูกบันทึกแล้ว:

1. SETUP → **Induction + Drug**
2. INDUCTION → **Record induction drug** หรือ **Airway / Intubation**
3. Airway recorded → **Surgery start**
4. INTRAOPERATIVE → **Surgery end**
5. EMERGENCE → **Extubation → Recovery** หรือ Begin Recovery ถ้าไม่มี airway/intubation record
6. EMERGENCY RETURN → **Return to Recovery**

ผู้ใช้ยังเข้าถึงทางเลือกเดิมผ่าน Tools / Event / Problem และ legacy milestone hooks ถูกเก็บใน DOM เพื่อ compatibility

## Induction medication integration

- Start Induction จะเริ่ม timer/freeze protocol ก่อนเปิด OR Quick Drug
- Quick Drug filter เฉพาะ phase `induction` ใน workflow นี้
- พยายาม preselect จาก Anesthesia Plan หรือ Hospital Quick Preset ที่ถูก freeze กับเคส
- ถ้าไม่มี match ระบบแสดง Select drug แทนการเดายา
- Actual administered ยังคงว่างและต้องยืนยัน actual mL, route, operator และ preparation
- Administration จาก workflow นี้ถูก tag เป็น `OR Induction` ใน medication audit
- มีทางเลือก `Induction without injectable drug` สำหรับกรณีที่ไม่ควรสร้าง administration record

## Intubation / Airway

Airway panel เปลี่ยนเป็น collapsible workspace และ primary workflow จะเปิด/scroll ไปให้ทันที เมื่อ Save จาก Intubation context ระบบจะลง Intubation milestone อัตโนมัติ รวมถึงลง Induction milestone ก่อนถ้ายังขาด เพื่อรักษาลำดับ timeline

## Visual simplification

- Utility controls: Start/Resume, Pause, Keep awake, Recovery, Full screen → `Tools`
- Phase tracker → collapsed details
- Fluid/Blood Loss → collapsed
- Airway/Ventilation → collapsed
- Manual Event/Problem → collapsed
- ซ่อน OR status row ที่ซ้ำกับ sticky cockpit
- ซ่อน Prioritized Alerts และ Active Complications ชุดเก่าที่ซ้ำกับ Active Alerts / Problems

## Compatibility / safety

- Storage keys `anesvet_v14_3_*` ไม่เปลี่ยน
- IndexedDB `ANESVET_DB` version 2 ไม่เปลี่ยน
- V14.7 configurable alert protocol / case override / alert lifecycle / Quick Drug / recovery handoff / final lock logic คงเดิม
- ไม่มีการเปลี่ยน dose, concentration default, alert threshold, HR/RR range, fluid reference, plausibility limit หรือ recovery score

## Validation note

Static syntax/regression and no-dependency workflow checks pass. A supplemental real-Chromium OR LIVE interaction/visual smoke also passes using the exact production source loaded with `page.set_content`; direct local-origin navigation is blocked by this runtime. Full origin-based PWA E2E (service worker/offline/update/storage) and the jsdom DOM suite remain acceptance gates to rerun on an authorized workstation before production use.
