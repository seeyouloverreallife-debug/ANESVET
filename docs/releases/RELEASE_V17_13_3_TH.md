# ANESVET V17.13.3 — Legacy Presentation Retirement III

## เป้าหมาย
ลด runtime presentation patch ต่อจาก V17.13.2 แบบ incremental โดยใช้ V17.13.2 เป็น source of truth และย้าย behavior ที่ยังจำเป็นไปหา canonical owner ก่อนหยุดโหลด legacy module

## Runtime retirement
หยุดโหลด JavaScript เพิ่ม 2 ตัว:
- `usability-hardening.js`
- `mobile-first-r27.js`

Runtime script references ลดจาก **72 → 70**.

## Behavior ที่ย้ายแล้ว
### Pre-OR readiness
- ปุ่ม “ไปแก้” ของแต่ละ readiness item ใช้ `tab` / `target` จาก readiness model เดิมโดยตรง
- ตัด regex heuristic ของ `usability-hardening.js` ออก
- Safety gate / override criteria เดิมไม่เปลี่ยน

### Save / offline feedback
- storage status assist, delayed dirty warning, offline status และ manual retry ย้ายไป `app-shell.js`
- retry ยังเรียก save path เดิม ไม่สร้าง persistence path ใหม่

### End Case
- blocker chip ใช้ `type` จาก `finalization.js` เป็น action key โดยตรง
- click / keyboard Enter / Space พาไปยัง Recovery, alerts, complications, medication reconciliation, sign-off หรือ final checklist ตาม flow เดิม

### Return to active case
- floating “กลับ OR LIVE / Recovery” ย้ายไป `repeat-presentation-owner.js`
- รักษา guard สำหรับ modal, security lock, read-only session และ pointer drag/swipe เพื่อไม่ให้ resume โดยไม่ตั้งใจ

### Mobile Identity
- Identity bridge ใน legacy mobile workflow ย้ายไป `workspace-owner.js`
- ยัง reuse `securityIdentityChip` / Session dialog เดิม และไม่ bypass PIN

## Audited but retained
- `or-speed-hardening.js` ยังมี behavior เฉพาะที่ใช้งานจริง จึงยังไม่ retire ในรอบนี้
- `repeat-presentation-owner.js` ยังเป็น canonical owner ของ repeat/final-review presentation

## Release integrity
- runtime app version / manifest / cache generation อัปเดตเป็น V17.13.3
- Service Worker generation: `anesvet-v17-13-3-startup`
- retired JavaScript ไม่อยู่ใน runtime หรือ JS precache แต่ source file ยังเก็บไว้เพื่อ traceability

## Clinical behavior preserved
ไม่ตั้งใจเปลี่ยน dose calculation, concentration handling, safety thresholds, persistence schema, readiness/recovery criteria, Induction = prepared induction drugs given/details pending, editable individual induction time, Intubation timestamp-only, End Surgery, Emergency Return, Final Lock หรือ archive verification

## Scope limitation
QA รอบนี้เป็น static/source-contract + Node deterministic regression. ยังไม่ใช่ physical Android/iPad/PWA/IME test; ก่อน production ควรทดสอบ workflow จริงบนอุปกรณ์อย่างน้อยหนึ่งรอบ โดยเฉพาะ keyboard/viewport และ floating return shortcut.
