# Release Notes — ANESVET V16.8.1

**Architecture Refactor Phase 2**

## Added
- `patient-domain.js`
- `or-domain.js`
- `recovery-domain.js`
- unit-testable boundaries สำหรับ Patient, OR vital helpers และ Recovery calculations

## Refactored
- Patient matching/search/history helpers ใน `app.js` เรียกผ่าน Patient Domain API
- exact vital duplicate/signature/summary/critical record helper เรียกผ่าน OR Domain API
- Recovery score/readiness/elapsed helper เรียกผ่าน Recovery Domain API

## Behavior intentionally unchanged
- Patient workflow และ Patient Master storage
- vital record saving / duplicate guard window (12 s)
- alert thresholds และ alert protocol
- Recovery completion criteria
- Final Lock / checksum
- medication safety, dose reference และ reconciliation
- IndexedDB/localStorage keys และ backup schema

## Defect prevention found during refactor
- module loading เป็น fail-fast: ถ้า Patient/OR/Recovery domain module โหลดไม่ครบ `app.js` จะไม่ทำงานต่อแบบเงียบ ๆ
- service-worker cache manifest รวม domain modules ใหม่และตรวจ uniqueness/missing assets ใน QA

## QA summary
- Domain unit tests: 22/22 PASS
- Clinical Validation: 15/15 PASS
- browser inline production harness: PASS
- mobile horizontal overflow: 0 px
- page errors: 0
- console errors: 0
- JavaScript syntax: 26/26 PASS
- duplicate HTML IDs: 0
- service-worker assets: 46/46 unique, missing 0
