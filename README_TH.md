# ANESVET V14.6.4 — Reliability & Safety Release

## สิ่งที่ปรับปรุงหลัก

- **Current-case recovery จาก IndexedDB mirror**: ตอนเปิดแอป ระบบเปรียบเทียบ current case ใน localStorage กับ mirror ใน IndexedDB และเสนอ restore เมื่อพบข้อมูล mirror ที่ใหม่กว่า
- **Built-in Drug Protocol ย้ายออกจาก hard-coded dose**: dose/factor ของ Diazepam, Propofol, Tramadol, Carprofen, Meloxicam, Cefazolin preset, Convenia preset, Adrenaline และ Atropine ปรับได้จาก Hospital Settings และถูก freeze เข้า protocol snapshot ตอน Start Case
- **Explicit concentration units**: Hospital Drug Library เก็บ unit ของ concentration (`mg/mL` หรือ `μg/mL`) แยกชัดเจน และ calculator รองรับการแปลง mg↔μg อย่างถูกต้อง
- **Clinical alert episodes**: critical MAP/SpO₂ alert เก็บเวลาเริ่ม, acknowledge และ resolved พร้อมขึ้นใน Procedure Timeline / audit trail
- **Backup integrity validation ก่อน Restore**: ตรวจ checksum ของ LOCKED FINAL records ที่ตรวจสอบได้ก่อนแทนที่ฐานข้อมูลเดิม และเตือน/บล็อกแบบเข้มเมื่อพบ mismatch
- **Safe PWA update**: service worker เวอร์ชันใหม่จะรอ ไม่ `skipWaiting` อัตโนมัติ และ UI จะไม่อนุญาตให้สลับเวอร์ชันระหว่าง current case ที่ยังมีข้อมูล
- **Previous anesthesia warnings เพิ่มรายละเอียด**: แสดง difficult airway/ETT, lowest MAP, lowest SpO₂, hypothermia, complication และ emergency return เมื่อมีข้อมูลในเคสก่อนหน้า
- คง fix จาก **V14.6.3 New Patient Current BW propagation**

## Clinical safety notes

ANESVET เป็น decision-support + digital anesthesia record ไม่ใช่ continuous physiologic monitor และไม่แทนการประเมินผู้ป่วย, waveform, airway, anesthetic depth หรือ protocol ของโรงพยาบาล

ควรตรวจ Hospital Protocol และ concentration/dose ทุกครั้งก่อนใช้งานจริง โดยเฉพาะหลังอัปเดตเวอร์ชันหรือแก้ protocol settings

## Validation

โฟลเดอร์ `tests/` มี regression checks, workflow scenarios และ browser E2E smoke test สำหรับ critical workflow ที่รองรับการทดสอบด้วย Chromium headless

## Compatibility

- คง storage keys ตระกูล `anesvet_v14_3_*` โดยตั้งใจ เพื่อให้ข้อมูลจาก V14.3+ อัปเกรดแบบ in-place และไม่สร้างฐานข้อมูลซ้ำโดยไม่จำเป็น
- IndexedDB schema ยังคงเข้ากันได้กับ V14.6.3; release นี้ไม่ได้เพิ่ม object store ใหม่
- แนะนำให้ Export Backup ก่อนอัปเดตจากเครื่องที่มีข้อมูลเคสจริง

## Validation commands

```bash
node --check app.js
node --check service-worker.js
node tests/regression.mjs
node tests/workflow_scenarios.mjs
node tests/e2e_browser.mjs
```
