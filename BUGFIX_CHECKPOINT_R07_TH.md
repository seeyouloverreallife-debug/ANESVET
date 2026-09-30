# ANESVET R07 — V17.2.11

## ฐานและเป้าหมาย
- ฐานจริงคือ ANESVET V17.2.10 Checkpoint R06
- แก้ **ปุ่มลัดกลับ OR LIVE / Recovery** เมื่อ `pointerup` อยู่บนปุ่ม แต่ `pointerdown` เริ่มจากตำแหน่งอื่น หรือเป็นท่าลากนิ้ว
- เป็นการแก้ gesture guard ไม่เปลี่ยนการตัดสินใจทางคลินิกหรือการบันทึกเคส

## ต้นเหตุที่ตรวจจาก source
R06 ตรวจ `elementFromPoint()` และ `event.target` ตอน `pointerup` แต่ไม่ได้จำจุดเริ่มต้น (`pointerdown`) ของนิ้ว เมื่อ gesture เคลื่อนมาจบที่ปุ่ม มีความเสี่ยงที่ document-level fallback จะสั่งกลับเคสโดยไม่ตั้งใจ

## การเปลี่ยนแปลง
1. บันทึก `pointerId` และพิกัดเริ่มต้นเฉพาะการแตะปุ่มที่อยู่บนสุดจริง
2. `pointerup` ต้องเป็น pointer เดียวกัน ระยะเคลื่อน <= 14px และจบภายใน 1,500ms
3. ปฏิเสธ gesture หาก Dialog เปิดขึ้น, security lock, VIEW ONLY หรือ overlay บังระหว่างแตะ
4. `pointercancel` ล้าง gesture และกัน browser-generated click ต่อเนื่องจาก gesture ที่ถูกปฏิเสธ
5. คง native/keyboard click ตามเดิมและป้องกัน click ซ้ำหลัง fallback สำเร็จ
6. ปรับ version/cache เป็น V17.2.11 (SW cache key ใหม่, HTML query URLs, manifest)

## ไฟล์ที่แก้
- Runtime: `usability-hardening.js`; version-only: `app.js`, `index.html`, `service-worker.js`, `manifest.webmanifest`
- QA fixtures เปลี่ยนให้ทดสอบ gesture จริงและรุ่นปัจจุบัน: `QA_R06_TOUCH_OVERLAY_GUARD.js`, `QA_R06_NAVIGATION.js`, `QA_R06_ASA_CLICK_TRACE.js`
- เพิ่ม `QA_R07_SHORTCUT_TAP_ORIGIN.js`, `QA_BOOT_RUNTIME_V17_2_11.js`, `RUN_R07_QA.js` และ checkpoint metadata
- เก็บ R06 ZIP เดิมแยกไว้เพื่อใช้เป็น immutable rollback baseline; QA R06 เก่าอยู่ใน ZIP ต้นฉบับ

## ห้ามสรุปเกินผลทดสอบ
- Unit/regression ใน Node ผ่าน; ไม่มีหลักฐานยืนยันว่าปุ่มที่ไม่ตอบสนองบนอุปกรณ์ผู้ใช้ได้รับการแก้ทั้งหมด
- Browser E2E ถูกบล็อก (`ERR_BLOCKED_BY_ADMINISTRATOR`) ทั้ง localhost และ file URL และไม่ได้ทดสอบอุปกรณ์จริง
- ไม่เปลี่ยน schema, storage keys, drug calculator, dosage logic, OR LIVE Controller, Recovery Controller หรือ safety/access gates

## R08 แนะนำ
- ขอ Diagnostic จากอุปกรณ์ทดสอบหากยังพบคลิกไม่ทำงาน แล้วเลือกแก้ *เพียงหนึ่งโมดูล* ที่มีหลักฐาน
- ทดสอบบน Android/iPad: swipe, tap, modal, VIEW ONLY, Resume, dialog close แล้วกลับ Patient/Pre-op/Drugs
