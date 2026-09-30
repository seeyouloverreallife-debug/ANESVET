# ANESVET V17.2.19 — Checkpoint R15 / Current Case Mirror Integrity

**ต่อยอดจาก:** V17.2.18 R14 ZIP ต้นฉบับ (ไม่สร้างใหม่จากศูนย์)
**สถานะ:** ผ่าน Unit/Regression/JS syntax เท่านั้น ไม่ได้ยืนยันบน Android/iPad จริง

## ปัญหาที่พบจาก source
1. `queueCurrentMirror()` เคยทำสำเนาจาก `state` ในหน่วยความจำ ซึ่งอาจมีข้อมูลที่ยังไม่ได้ Save; ทำให้ IndexedDB Mirror อาจใหม่กว่าข้อมูล Clinical Current Case ที่ยืนยันแล้ว
2. เมื่อ Current Case เก็บเป็น JSON เสีย แต่ไม่มี Safety Checkpoint/Legacy ให้กู้ ขั้นตอน Startup อาจใช้ state ว่างแล้วอนุญาตให้ Save กลับลง key เดิมได้
3. การ Restore จาก IndexedDB Mirror เดิมอาจเขียนทับ primary ที่อ่านไม่ออก และไม่มีการยืนยัน Read-back / rebasing ของ Freshness Guard

## การแก้ไขขอบเขต R15
- `queueCurrentMirror(verifiedPayload)` รับเฉพาะ payload ของ Current Case ที่ Save และ Read-back ผ่านแล้ว
- ก่อน Mirror เขียน IndexedDB: ตรวจว่า Session ยัง ACTIVE, เป็นเจ้าของสิทธิ์, Freshness ตรง และข้อความ Current Case ยังเหมือน payload 100%
- ป้องกันการเขียนทับ Current Case ที่ unreadable โดยอัตโนมัติแม้ไม่มี Recovery Candidate; แสดง Warning และบล็อก clinical writes
- Mirror restoration ใช้ `guardedStartupCurrentWrite` + Read-back และอัปเดต Freshness baseline หลัง Save สำเร็จ
- Archive import bridge ที่ Save current case ต้องตรวจ Read-back ก่อน และ Queue Mirror จาก payload ที่ Save สำเร็จ
- เปลี่ยนเวอร์ชัน cache / manifest เป็น V17.2.19

## วิธีทดสอบ
1. แตกไฟล์ ZIP ในโฟลเดอร์ใหม่ (ไม่ทับแอปเวอร์ชันที่ใช้งานจริง)
2. ติดตั้ง Node.js แล้วรัน `node RUN_R15_QA.js` ในโฟลเดอร์นี้ ดู `QA_R15_RESULTS.json`
3. ทดสอบเคสจำลองบน Android/iPad ตาม `DEVICE_R15_TEST_STEPS_TH.md`
4. ตรวจ Backup ของเคสจริงก่อนอัปเดต; ห้าม Clear Site Data/ถอน PWA โดยไม่ได้สำรองและทดสอบ Backup

## ข้อจำกัด / R16
- IndexedDB และ localStorage ยังไม่ใช่ atomic transaction ข้ามแท็บ แม้ R12–R15 เพิ่มการป้องกันแล้ว
- ไม่มีหลักฐาน Browser E2E/Android/iPad ผ่านจากรอบนี้
- R16: ตรวจ Archive Import/Restore และ callback ที่เขียนข้อมูลหลายจุด ว่าทุกทางเคารพ Read-only/Case Freshness
- ห้ามนำรุ่นนี้ไปใช้กับผู้ป่วยจริงก่อนทำ Device Acceptance + Recovery Drill
