# ANESVET V15.10.2 — Briefing → OR LIVE Transition Hotfix

## Root cause
V15.10.0–V15.10.1 มี typo ใน `preOrBriefingSignature()` โดยอ้าง `PREOP_RISK_DEFS` ซึ่งไม่มีตัวแปรนี้อยู่จริง (ตัวที่ถูกต้องคือ `PREOP_RISK_FLAGS`) เมื่อกด `Reviewed → Open OR LIVE` จึงเกิด JavaScript `ReferenceError` ก่อนบันทึก briefing และก่อนเปลี่ยนหน้า ทำให้ผู้ใช้เห็นเหมือนปุ่มไม่ทำงาน

## Fix
- เปลี่ยน `PREOP_RISK_DEFS` → `PREOP_RISK_FLAGS`
- เพิ่ม dedicated `openOrLiveAfterBriefingReview()`
  - ตรวจ OR/Recovery lock
  - ตรวจ Pre-OR readiness/override ซ้ำ
  - บันทึก reviewer + briefing snapshot
  - ตรวจว่า local save สำเร็จ
  - re-sign persisted state หาก save re-sample UI field
  - ปิด dialog แบบ fallback-safe
  - เปิด OR LIVE แบบ force เฉพาะหลัง safety ผ่าน
  - ตรวจว่า OR LIVE active จริง; มี direct UI fallback หาก tab transition ล้มเหลว
- เพิ่มข้อความ error หาก save/transition ล้มเหลว แทนการกดแล้วเงียบ

## PWA / cache reliability
- Service worker ใช้ network-first สำหรับ navigation/index และ cache fallback เมื่อ offline
- ลดโอกาส GitHub Pages/PWA เปิด HTML/JS hotfix รุ่นเก่าจาก cache หลัง deploy รุ่นใหม่

## Validation
Browser-level Chromium test ทำ flow จริง:
1. Patient setup + BW + procedure + ASA
2. Save Patient & Case Setup
3. Record pre-anesthetic physical exam
4. Record anesthetic risk review
5. Complete Pre-op checklist
6. Open Pre-OR briefing
7. Enter reviewer
8. Click `Reviewed → Open OR LIVE`

ผล: briefing closed, OR LIVE active + visible, JavaScript errors = 0.

## Clinical content
- ETT preparation logic จาก V15.10.1 ไม่ได้เปลี่ยนใน hotfix นี้
- Dose, alert threshold, ASA logic, fluid reference และ Case Drug Plan safety ไม่เปลี่ยน
