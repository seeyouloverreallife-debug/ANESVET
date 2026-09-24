# ANESVET V15.12.0 — Clinical Safety & Reliability

รุ่นนี้เป็น **hardening release** ต่อจาก V15.11.0 โดยหยุดเพิ่ม clinical feature ใหม่ชั่วคราว และเน้นให้ ANESVET พร้อมสำหรับ Hospital Pilot มากขึ้น

## จุดสำคัญ
- Reliability self-check ใน Settings
- local runtime error diagnostics
- automated browser smoke test สำหรับ phone / iPad-size / desktop
- golden flow test: Patient → Pre-op → Briefing → OR LIVE → Start Induction
- แยก `support.js` และ `reliability.js` ออกจาก `app.js` แบบ conservative refactor
- Report issue เปลี่ยนเป็น Email `anesvetth@gmail.com` หรือ Facebook Page `Anesvet`
- ปิด active Google Apps Script/webhook feedback path
- ไม่เปลี่ยน clinical dose / threshold / briefing reference / recovery safety logic

## ก่อนแจก Pilot
แนะนำอัปไฟล์ทั้งหมดขึ้น GitHub Pages แล้วเปิดด้วย `?v=15.12.0` หรือ Hard Refresh หนึ่งครั้ง เพื่อให้ service worker/cache เปลี่ยนเป็นรุ่นใหม่

## การ Report
กด `🐞 Report` หรือ Report issue ใน MORE:
1. กรอกรายละเอียด
2. เลือก **Email report** เพื่อเปิด mail app ไปที่ `anesvetth@gmail.com`
3. หรือเลือก **Facebook: Anesvet** ระบบจะ copy structured report ให้ก่อนเปิด Facebook search
4. ถ้ามี screenshot ให้แนบเองใน Email/Facebook

ANESVET จะไม่ใส่ชื่อผู้ป่วย, HN, microchip หรือข้อมูลเจ้าของลง structured report อัตโนมัติ

ดูรายละเอียดที่ `RELEASE_NOTES_V15_12_0.md` และผล QA ที่ `QA_V15_12.md`
