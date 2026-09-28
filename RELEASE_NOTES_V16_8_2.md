# ANESVET V16.8.2 — Architecture Refactor Phase 3

## Changed
- เพิ่ม `patient-master-orchestration.js`
- เพิ่ม `or-record-orchestration.js`
- เพิ่ม `recovery-orchestration.js`
- Patient merge/retire/restore mutation ถูกย้ายผ่าน orchestration API
- Vital append/delete/correction mutation ถูกย้ายผ่าน orchestration API
- Recovery score/record append และ phase transition patch ถูกย้ายผ่าน orchestration API
- `app.js` คง DOM/confirmation/audit/clinical alert responsibilities

## Not changed
- State schema
- IndexedDB schema/version
- Storage keys
- Drug dose/reference
- Alert thresholds
- Pre-OR readiness rules
- Recovery readiness criteria
- Medication reconciliation
- Final Lock / checksum rules
- UI design/layout

## QA summary
- Orchestration unit tests: 17/17 PASS
- Behavior parity tests vs V16.8.1: 14/14 PASS
- Clinical Validation: 15/15 PASS
- Browser production-order smoke: PASS
- Patient Save → Pre-check → search Patient Master: PASS in fallback-storage harness
- JavaScript syntax: PASS
- Duplicate HTML IDs: 0
- Service Worker assets: complete + unique
- Page errors: 0
- Console errors: 0

## Limitation
Installed-PWA/service-worker lifecycle ยังต้องทดสอบบน Android/iPad/Windows device จริงเหมือน release ก่อนหน้า เนื่องจาก environment QA ไม่อนุญาต local-origin installed-PWA navigation
