# ANESVET V16.19.1 — Production Validation Protocol (TH)

เอกสารนี้ใช้สำหรับทดสอบ ANESVET บนอุปกรณ์จริงก่อนใช้เป็นระบบหลักใน OR

## หลักการ
- ใช้ test/disposable case ไม่ใช้ข้อมูลผู้ป่วยจริงในรอบ validation หากไม่จำเป็น
- กด PASS หลังสังเกต step นั้นครบเท่านั้น
- หากเกิดปัญหาให้เลือก FAIL หรือ BLOCKED และบันทึก bug reference
- Validation Center จะเก็บ technical evidence แต่ไม่ควรใช้แทน anesthesia record จริง

## 12 ขั้นตอน
1. Run Device Readiness และต้องไม่มี hard failure
2. สร้าง test case → save → ออกจากหน้า/แอป → กลับมาแล้วข้อมูลล่าสุดยังอยู่
3. OR LIVE: บันทึก Fast Vitals หลายครั้ง + event/milestone และตรวจลำดับเวลา
4. Medication: planned drug ต้องไม่กลายเป็น GIVEN เอง และ actual administration ต้องเกิดจาก explicit confirmation
5. ระหว่าง active case ล็อกหน้าจอ/สลับแอป ≥5 นาที → กลับมาแล้ว timer/phase/recent data ถูกต้อง
6. Force-close app/browser → reopen → test case และ recent data กลับมา
7. ปิด network → บันทึกข้อมูล local → เปิด network → ไม่มี record หาย
8. เข้า Recovery → serial record → medication review → handoff → complete Recovery
9. Final reconciliation/sign-off → Final Lock → Final Archive Assurance = VERIFIED
10. Full Backup schema 3 → Verify backup file = full verification
11. Restore ไฟล์นั้นใน disposable/test browser profile → post-restore verification ผ่าน → reopen แล้ว dataset ยังอยู่
12. ทดสอบ portrait/landscape + soft keyboard และ endurance ระหว่าง sleep/task switching

## Evidence target
ทำซ้ำ workflow บนอุปกรณ์/build เดียวกันเพื่อสะสม evidence. UI แสดงเป้าหมาย 20 consecutive PASS runs. หากมี FAIL/BLOCKED ให้แก้สาเหตุและเริ่มสะสม consecutive PASS ใหม่ตามผลที่เกิดจริง

## อุปกรณ์ที่ควรทดสอบ
- Android phone ที่จะใช้จริง
- Android tablet ที่จะใช้จริง
- Windows installed PWA
- iPad/Safari หรือ installed web app หากโรงพยาบาลจะใช้งานจริง

แต่ละ device profile ต้องมีผลของตัวเอง เพราะ lifecycle/background/storage behavior ต่างกันได้
