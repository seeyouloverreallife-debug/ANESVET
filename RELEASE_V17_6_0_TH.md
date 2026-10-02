# ANESVET V17.6.0 — Stabilization / Viewport Lifecycle Consolidation

## เป้าหมาย
ลดการกระตุกและการขยับของหน้าจอระหว่างพิมพ์บน mobile/PWA โดยไม่เปลี่ยน clinical calculations, medication semantics, case schema หรือ archive semantics

## การเปลี่ยนแปลง
- เพิ่ม `viewport-coordinator.js` เป็นเจ้าของ resize/orientation/VisualViewport resize เพียงจุดเดียว
- coalesce event burst ให้เหลือสูงสุดหนึ่ง `anesvet:viewportchange` ต่อ animation frame
- OR speed hardening, mobile keyboard compatibility, workflow alignment และ responsive workspace ใช้ event กลางแทน direct window resize listeners
- คง VisualViewport scroll listener เฉพาะ OR fast-entry rail ซึ่งต้องยึดกับ visible viewport จริง
- bump cache/version references เป็น 17.6.0

## สิ่งที่ไม่ได้เปลี่ยน
- drug dose/reference logic
- clinical alert thresholds
- medication administration semantics
- patient/case data schema
- final lock/archive semantics
- backup/restore logic

## Validation ใน build environment นี้
- JavaScript syntax check: ผ่านทุก production JS
- HTML duplicate IDs: ไม่พบ
- local asset/script/style references: ไม่พบไฟล์หาย
- Browser E2E QA เดิม: ยังไม่ได้รัน เนื่องจาก environment ไม่มี Playwright dependency จึงไม่อ้างว่า E2E ผ่าน

## Physical-device validation ที่ยังต้องทำ
- Android + Gboard/Samsung Keyboard
- installed PWA: focus vitals, next field, save, keyboard dismiss
- OR LIVE -> Recovery -> End Surgery
- background/foreground และ orientation change ระหว่าง active case
