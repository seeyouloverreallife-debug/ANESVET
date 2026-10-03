# ANESVET V17.14.0 — Post-Refactor Clinical UX Verification & Improvement

ฐานงาน: V17.13.20

## สรุป
V17.14.0 หยุดการจัด runtime folder ชั่วคราว และกลับมาตรวจ UX ที่เคยแก้ไปแล้วหลัง refactor หลายรอบ เพื่อป้องกันการทำงานซ้ำและจับ regression จริงจาก source ปัจจุบัน

### Verified retained
- Keyboard / VisualViewport / editing-focus hardening
- End Surgery mobile reachability
- Recovery → End Case และ Emergency Return ↔ OR path
- Dark startup / splash transition

### Actual UX fix
พบหน้า Home บน mobile แสดง `ข้อมูลในเครื่อง · V17.11.3` แบบ hard-code

แก้เป็น version authority จาก `APP_VERSION`:
- `window.AnesvetApp.version = APP_VERSION`
- `mobile-design.js` แสดง `V${app().version}`

จึงไม่ต้องแก้ literal version ใน mobile Home ทุก release อีก

## สิ่งที่ไม่เปลี่ยน
- persistence schema / IndexedDB
- dose calculation / concentration
- alert thresholds
- Induction prepared meds = Given / details pending
- editable individual induction administration time
- Intubation timestamp-only
- End Surgery clinical mutation/confirmation
- Emergency Return semantics
- Recovery readiness/completion
- Final Lock / archive verification

## QA
- Existing contract suites + post-refactor UX suite: 344/344 PASS ก่อน final packaging
- Final syntax/CSS/checksum/package verification ถูกบันทึกใน `qa/current/QA_V17_14_0_RESULTS.txt`

## ข้อจำกัด
ไม่ได้ทำ physical Android/iPad/PWA/IME visual interaction test ใน environment นี้
