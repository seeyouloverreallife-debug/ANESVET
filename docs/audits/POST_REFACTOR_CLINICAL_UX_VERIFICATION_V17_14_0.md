# ANESVET V17.14.0 — Post-Refactor Clinical UX Verification

ฐานงาน: V17.13.20 Controller Runtime Grouping IX

## เป้าหมาย
หลัง refactor/runtime grouping หลายรอบ ตรวจว่าการแก้ UX สำคัญในอดีตยังอยู่จริง ไม่ย้อนกลับไปเขียนใหม่โดยไม่มีหลักฐาน และแก้เฉพาะ regression/UX debt ที่พบจาก source ปัจจุบัน

## 1. Keyboard / viewport — VERIFIED RETAINED
ยังคงมี:
- `viewport-coordinator.js` เป็น owner ของ VisualViewport resize
- `mobile-or-owner.js` คำนวณ soft-keyboard offset และ focus state
- `mobile-design.js` ไม่ rerender shell ขณะ active field ยังถือ focus
- `app.js::setTab()` blur editable control ก่อน reset viewport
- Recovery/End Case ใช้ two-frame viewport settle + shared `anesvet:viewportchange`
- `workspace-owner.js` ไม่ force scroll ขณะ mobile owner ระบุว่ากำลัง editing

ไม่แก้ behavior ใน V17.14.0

## 2. End Surgery visibility — VERIFIED RETAINED
ยังคงมี:
- OR mobile dock แสดง workflow next action เสมอ
- `surgery-end` map เป็น `END SURGERY`
- mobile context ให้ priority กับ `orSecondaryPhaseBtn` เมื่อ action เป็น surgery-end
- presentation layer ยอมให้ End Surgery reachable แม้ native secondary control ถูกซ่อนโดย layout layer
- native confirmation/state mutation ยังเป็น owner เดิม

ไม่แก้ clinical transition ใน V17.14.0

## 3. Recovery navigation — VERIFIED RETAINED
ยังคงมี:
- Emergency Return to OR และ return-to-Recovery path
- Recovery complete → End Case
- recovery refinement ฟัง shared viewport event
- completed Recovery next task → End Case
- repeat presentation owner มี explicit End Case route

ไม่แก้ Recovery state/readiness semantics

## 4. Startup transition — VERIFIED RETAINED
ยังคงมี:
- HTML/manifest background `#0b2d31`
- startup critical CSS inline ก่อน external runtime CSS
- main layout ถูกถอดจาก layout ชั่วคราวระหว่าง boot
- startup logo preload
- dark gradient boot surface
- recoverable boot-error actions

ดังนั้น old white/logo first-paint regression ไม่พบจาก current source contract

## 5. พบ UX bug จริงและแก้แล้ว
`mobile-design.js` ยังแสดงข้อความ Home:

`ข้อมูลในเครื่อง · V17.11.3`

แบบ hard-code แม้ build ปัจจุบันเป็น V17.13.20

V17.14.0 แก้โดย:
- expose `window.AnesvetApp.version = APP_VERSION`
- mobile home อ่าน `app().version`
- เพิ่ม QA ป้องกัน hard-coded stale version กลับมาอีก

## Scope limitation
การยืนยันรอบนี้เป็น static/source-contract + deterministic Node regression + syntax/CSS parsing ไม่ใช่ physical Android/iPad/PWA/IME interaction test จึงไม่อ้างว่าได้ยืนยันพฤติกรรม soft keyboard หรือ installed-PWA splash บนอุปกรณ์จริง
