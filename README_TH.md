# ANESVET V15.13.0 — Help, Onboarding & Pilot UX

V15.13 เพิ่มระบบช่วยใช้งานสำหรับช่วง Hospital Pilot โดยรักษา clinical workflow และ safety behavior จาก V15.12.1 เดิม

## เริ่มใช้งาน
1. เปิด `index.html` ผ่าน GitHub Pages / web hosting ตามเดิม
2. ผู้ใช้ใหม่จะเห็น walkthrough สั้น 4 ขั้นตอนหนึ่งครั้ง
3. คู่มือเปิดได้ตลอดจาก `⋯ เพิ่มเติม → ? วิธีใช้ / Help`
4. บนมือถือ: `☰ ขั้นตอน → ? วิธีใช้ / Help`
5. ใน OR LIVE / Recovery: เปิด `MORE → ? วิธีใช้`

## Contextual Help
หน้าหลักมีปุ่ม `?` เล็ก ๆ กดแล้ว Help Center จะเปิดตรงหัวข้อที่สัมพันธ์กับหน้าปัจจุบัน ไม่ต้องค้นคู่มือเอง

## Report / Support
- Email: `anesvetth@gmail.com`
- Facebook Page: `Anesvet`
- Report composer จะแนบ app/device/phase context แบบไม่ระบุตัวผู้ป่วยโดยอัตโนมัติ

## Clinical safety
ANESVET เป็น veterinary anesthesia workflow / digital record / decision-support ไม่ใช่ continuous physiologic monitor และไม่แทนการประเมินผู้ป่วย, waveform, airway, anesthetic depth, source monitor data หรือ clinical judgment

Pre-OR Briefing เป็นข้อมูลช่วยเตรียมและค่าเริ่มต้นอ้างอิง ไม่ใช่คำสั่งรักษา และจะไม่ถูกคัดลอกเป็น actual clinical record โดยอัตโนมัติ

## Update จาก V15.12.1
อัปโหลดไฟล์ทั้งหมดของรุ่นนี้ แล้วเปิดครั้งแรกด้วย `?v=15.13.0` หรือ Hard Refresh หนึ่งครั้ง เพื่อให้ service worker/cache ใช้ build ใหม่

ดูรายละเอียดใน `RELEASE_NOTES_V15_13_0.md` และ `QA_V15_13_0.md`
