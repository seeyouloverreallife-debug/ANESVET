# ANESVET V17.2.27 — R23 Silent Bug Center

## เป้าหมาย
ลดการรบกวนการดูแลผู้ป่วยจากหน้าต่างตรวจบั๊กเด้งเอง โดย **ไม่ปิด clinical alerts, safety gate, หรือ patient data protections**

## สิ่งที่แก้
- เปลี่ยนปุ่ม Diagnostic ขนาดเดิมเป็นไอคอน 🐞 ขนาด 36 px บนแถบด้านบน มีตัวเลขกลุ่มปัญหาใหม่ที่ยังไม่ได้อ่าน (สูงสุด 9+)
- ย้าย Startup failure, JavaScript/runtime error, failed navigation, ASA click investigation และ watchdog เข้าบันทึกปัญหาในเครื่อง
- ห้ามโค้ดวินิจฉัยปัญหาเปิด debug overlay เองอีกต่อไป แผงรายละเอียดเปิด **เมื่อกดไอคอนเท่านั้น**
- กดไอคอนจะเห็นรายการล่าสุด เวลา รายละเอียด และจำนวนครั้งที่พบซ้ำ พร้อมปุ่มคัดลอกหรือส่งรายงานผ่านฟอร์ม Feedback เดิม
- รวม error ลักษณะเดียวกันภายใน 10 นาที และเมื่อเปิดดูจะล้างตัวเลข *ยังไม่ได้อ่าน* โดยไม่ลบรายการย้อนหลัง
- เพิ่มปุ่ม `ล้างรายการ` แบบมีคำยืนยัน: ล้างเฉพาะ notification ของ software bug **ไม่ลบข้อมูลผู้ป่วย / ประวัติบันทึก / Clinical Alerts / runtime log เดิม**
- ใน OR fullscreen ซึ่งซ่อน header จะปรากฏไอคอนเล็กมุมขวาบนเฉพาะกรณีมีปัญหาที่ยังไม่ได้อ่าน
- ลด false positives จากการเลื่อนผ่านปุ่ม ASA (ไม่เปิด notification หากไม่มี click และไม่ได้พิสูจน์ว่ามี interaction failure)
- ชะลอ watchdog แล้วนำรายการ `Startup delay` ออกหากการเริ่มระบบสำเร็จทีหลัง
- ยังคงข้อมูล diagnostic ที่จำเป็นภายในเครื่องและการส่งแบบ manual เท่านั้น ไม่มี auto upload

## ขอบเขตที่ **ไม่ได้** เปลี่ยน
- Medication workflow, drug calculator, dose tables, charting, save/restore, current-case keys, clinical thresholds, critical popups, session locking, data safety/freshness banners
- ไอคอน 🐞 เป็นบั๊กของ **โปรแกรม** ไม่ใช่การเตือนชีพจร ความดัน SpO₂ หรือ ETCO₂

## ทดสอบ
- New R23 deterministic UI tests: ผ่าน (no auto-overlay, badge, grouping, detail, clearing, preserving keys, asset references)
- Navigation regression version-adjusted: 12/12 ผ่าน
- Previous clinical/data regression suites: 22/22 ผ่าน (อีก 5 suite ของ R22 มี expected behavior เป็น debug overlay เด้งเอง / version constant เดิม จึงแทนที่ด้วย R23 behavior test)
- JS syntax check, duplicate static DOM IDs, PWA asset presence: ผ่าน
- ไม่ได้ทดสอบด้วยผู้ใช้จริงบน Android/iOS หรือ live-anesthesia patient case; Chromium headless ในสภาพแวดล้อมนี้ไม่ตอบสนอง

## วิธีอัปเดต GitHub Pages
1. สำรอง export ข้อมูลเคสจากแอปก่อน
2. แตก `ANESVET_V17_2_27_R23_SILENT_BUG_CENTER_DEPLOY.zip`
3. Upload 5 files (`index.html`, `app.js`, `clinical-simplicity.css`, `manifest.webmanifest`, `service-worker.js`) ลง root ของ repository **ทับไฟล์ชื่อเดิม**
4. Commit/Deploy แล้วเปิดหน้าใหม่ รอให้ PWA อัปเดตเสร็จ อาจต้องปิดแอปแล้วเปิดอีกครั้งเพื่อใช้ service worker รุ่นใหม่
5. ตรวจที่มุมบนแสดง `V17.2.27` และลองกดไอคอน 🐞 (ไม่มี error ก็เปิดดู technical details ได้)

## ความปลอดภัย
อย่านำรุ่นใหม่ไปบันทึกผู้ป่วยจริงจนกว่าจะทดสอบในเครื่องที่ใช้งานและตรวจบันทึกข้อมูลสำคัญครบ 1 clinical simulation case
