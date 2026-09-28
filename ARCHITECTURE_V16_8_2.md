# ANESVET V16.8.2 — Architecture Refactor Phase 3

## เป้าหมาย
Phase 3 ต่อจาก pure domain boundaries ของ V16.8.1 โดยย้าย **state mutation / lifecycle orchestration** ออกจาก `app.js` เพิ่มขึ้น แต่ยังคง DOM wiring, confirmation, audit, clinical validation และ alert decision logic ไว้ใน app layer

หลักสำคัญของรุ่นนี้:
- ไม่เปลี่ยน state schema
- ไม่เปลี่ยน localStorage / IndexedDB keys
- ไม่เปลี่ยน dose / alert thresholds / Recovery criteria / Final Lock
- ไม่ rewrite app จากศูนย์
- ย้ายเฉพาะ mutation ที่มี boundary ชัดและ regression-test ได้

## Orchestration modules ใหม่

### `patient-master-orchestration.js`
รับผิดชอบ Patient Master lifecycle transformation:
- resolve merged patient chain
- find merge target
- detect restore conflict จาก HN / microchip aliases
- retire patient record
- restore retired record
- merge duplicate Patient Master records

`app.js` ยังรับผิดชอบ prompt/confirm, persistence call, rendering และ current-case guard.

### `or-record-orchestration.js`
รับผิดชอบ mutation ของ anesthesia vital records:
- append vital record + chronological sort
- exact duplicate guard adapter
- delete vital record
- immutable correction mutation + correction object

Clinical plausibility, alert episode synchronization, audit และ UI feedback ยังคงอยู่ใน `app.js`.

### `recovery-orchestration.js`
รับผิดชอบ Recovery collection/phase mutation:
- append Recovery score
- append Recovery vital record
- build/apply Recovery-start patch
- build/apply Recovery-complete patch

Readiness criteria, override confirmation, Handoff, audit และ rendering ยังอยู่ใน app/domain layer เดิม.

## Layer model หลัง V16.8.2

```text
Core
├── case-runtime.js
├── core-storage.js
└── session-coordination.js

Domain (pure clinical/data helpers)
├── patient-domain.js
├── or-domain.js
└── recovery-domain.js

Orchestration (state mutation boundaries)
├── patient-master-orchestration.js
├── or-record-orchestration.js
└── recovery-orchestration.js

App
└── DOM, prompts/confirmations, audit, clinical orchestration, rendering
```

## Compatibility contract
ไฟล์สำคัญต่อไปนี้ byte-identical กับ V16.8.1:
- case-runtime.js
- core-storage.js
- session-coordination.js
- patient-domain.js
- or-domain.js
- recovery-domain.js
- clinical-validation.js
- clinical-workflow.js
- drug-dose-reference.js
- protocol-review.js
- medication-reconciliation.js
- finalization.js
- reliability.js
- data-resilience.js
- shared UI/CSS system

ดังนั้น V16.8.1 → V16.8.2 ไม่ต้อง migrate database หรือเคสเก่า

## ทำไม app.js ไม่ได้สั้นลงมาก
เป้าหมาย Phase 3 คือสร้าง **ownership boundary** ไม่ใช่ลด line count แบบเชิงตัวเลข การ prompt/confirm, DOM wiring, audit และ render ยังอยู่ใน `app.js` เพื่อหลีกเลี่ยงการย้ายหลาย concern พร้อมกัน

เมื่อ orchestration API ผ่าน production regression แล้ว Phase ถัดไปสามารถย้าย Patient Master controller, OR record controller และ Recovery controller ออกจาก `app.js` ได้ง่ายขึ้นโดยไม่แตะ data schema.

## Next architecture boundary
หลัง V16.8.2:
1. หยุด refactor ชั่วคราวและใช้ regression matrix กับ workflow จริง
2. เริ่ม V16.9 Procedure Templates บน orchestration APIs ใหม่
3. แยก controller/render adapters เพิ่มเฉพาะเมื่อ feature ใหม่ต้องแตะ domain นั้น

ไม่แนะนำให้ refactor medication decision logic หรือ alert rules พร้อมกับเพิ่ม feature ใหม่ใน release เดียวกัน
