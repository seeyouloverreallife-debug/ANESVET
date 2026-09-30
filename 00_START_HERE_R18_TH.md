# ANESVET V17.2.22 — R18 Restore Session Guard

ฐานพัฒนา: V17.2.21 / Checkpoint R17 — ไม่ได้สร้างโครงการขึ้นใหม่

## สิ่งที่แก้ (R18 เท่านั้น)
- ตรวจ **Session ownership** ซ้ำหลังขั้นตอนที่มี `await` เช่นเปิดฐานข้อมูล / Replace Dataset / Read-back Verification
- ไม่ดำเนินการเขียน localStorage หรือออกใบยืนยัน Restore หากเจ้าของ Session เปลี่ยนระหว่างทาง
- เมื่อเสียสิทธิ์ระหว่าง Restore จะ **ไม่ Rollback อัตโนมัติจากแท็บเก่า** เพราะอาจทับข้อมูลของเจ้าของใหม่
- เก็บ Snapshot ไว้ให้ตรวจสอบและแจ้งว่า Restore อาจเป็น **partial restore**
- เพิ่ม `canRestoreWrite` ซึ่งตรวจเฉพาะ Session ระหว่าง Restore เพราะ Current-case freshness baseline จะยังอิงข้อมูลก่อน Restore จนกว่าแอปจะเริ่มใหม่

## ผลการทดสอบ
- Automated regression: **23/23 suites PASS**
- R18 focused cases: **7/7 PASS** (รวม forced takeover ขณะ IndexedDB commit และ read-back)
- JavaScript syntax: **141/141 PASS**, HTML duplicate IDs: **0**, missing precache files: **0**

## สำคัญ
- **ไม่ใช่ Atomic Transaction ระหว่าง localStorage/IndexedDB**; ระหว่าง Restore ที่ถูกแย่งสิทธิ์มีโอกาสเกิดข้อมูลกู้คืนบางส่วน อย่ากด Restore ซ้ำทันทีโดยไม่ตรวจสอบ
- ยังไม่ได้ยืนยัน Browser E2E หรือ Android/iPad จริง
- ทดสอบด้วยเคสจำลองและสำรองข้อมูลนอกเครื่องก่อนเท่านั้น

เปิด `index.html` ผ่าน static HTTP server / GitHub Pages เพื่อทดลอง PWA ไม่ควรนำไปแทนระบบบันทึกเคสจริงก่อนผ่าน Device QA

เอกสาร: `R18_CHANGELOG.md`, `R18_DEVICE_TEST_STEPS_TH.md`, `QA_R18_RESULTS.json`
