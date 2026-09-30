# ANESVET Checkpoint R04 — 30 กันยายน 2026

Base: `ANESVET_V17_2_7_CHECKPOINT_R03_ASA_TAP_TRACE.zip` (R03); produced `V17.2.8`.

## วิเคราะห์จาก source (ไม่ใช่จาก trace อุปกรณ์จริง)
1. `patient-master-controller.js` เดิมเรียก `ctx.loadSettings()` ระหว่างการเลือก ASA และก่อน `syncAsaCards()`; `loadSettings()` ใน `app.js` ประกอบด้วยการ refresh ทั้ง Settings, Temperature, Branding, Protocol และ UI ที่ไม่เกี่ยวกับ ASA. ถ้าฟังก์ชันนั้นโยน exception ก่อนถึง `syncAsaCards()`, ค่า hidden `#asa` จะเปลี่ยนแล้วแต่ selected UI ยังค้างได้. R04 นำ call ที่ไม่จำเป็นนี้ออกและ sync การ์ด/สถานะ save ก่อนเรียก Dashboard.
2. Sentinel R03 สามารถรายงาน `handled` เมื่อค่า ASA เปลี่ยนไปเป็นค่าที่คาดโดยไม่จำเป็นต้องเห็น click. R04 กำหนด `clickSeen` และยืนยัน click target อยู่บนการ์ด ASA หรือ element ลูกก่อน.
3. ถ้า overlay รับ click ขณะที่พิกัดอยู่เหนือ ASA card เดิมจะนับเป็น click ของการ์ด; R04 บันทึก `clickInterceptedBy` และให้ hint HIT_TEST_MISMATCH.

## Diff เทียบ R03
- Runtime changed: app.js, index.html, manifest.webmanifest, patient-master-controller.js, service-worker.js.
- Runtime/schema not changed: drug calculator, OR LIVE, Recovery, Sync, patient record storage format/key.
- Historical QA, docs, data และ asset ไฟล์อื่นจาก R03 คงเดิมในแพ็ก.

## ผล QA ใน container
- Suites: 9 suites / 93 of 93 checks passed.
- JavaScript syntax: 71 of 71 files passed `node --check`.
- HTML markup IDs: 1327 unique, no duplicates.
- Local HTML resources: 86 existing; SW file assets: 88 existing.
- Browser E2E: **NOT TESTED**; physical Android/iPad device: **NOT TESTED**.
- Source-file parity: 520 of 525 previous files unchanged (excluding newly added QA/release docs).

## R05
ถ้า ASA ยังใช้งานไม่ได้ ให้เก็บ `interaction hint`, `stage`, `ASA probe` และ screenshot จาก test device เท่านั้น แล้วตรวจ branch ตามนั้น. หาก ASA ทำงาน แต่ navigation เสีย ให้แยกตรวจ navigation binding ไม่โยนปัญหาเข้า clinical modules หลายระบบพร้อมกัน.
