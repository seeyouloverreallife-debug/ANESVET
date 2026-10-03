# ANESVET V17.13.4 — Legacy Presentation Retirement IV / OR Interaction Ownership Consolidation

## เป้าหมาย
พัฒนาต่อจาก V17.13.3 แบบ incremental โดยใช้ V17.13.3 เป็น source of truth และลด legacy presentation/runtime ownership โดยไม่เปลี่ยน clinical semantics, dose/safety rules, persistence schema หรือ finalization contract

## Runtime retirement
หยุดโหลด JavaScript เพิ่ม 1 ตัว:
- `or-speed-hardening.js`

Runtime script references ลดจาก **70 → 69**.

Source เดิมยังเก็บไว้ใน package เพื่อ traceability และขึ้นต้นด้วย retired marker ชัดเจน

## Behavior ที่ย้ายแล้ว
### Fast Vital rail / keyboard → `or-live-controller.js`
- ย้ายลำดับ HR → MAP → SpO₂ → ETCO₂ → RR → Temp เข้า OR LIVE canonical owner
- Enter = ไปช่องถัดไป / ช่องสุดท้าย = จบการกรอกโดยยังไม่บันทึก
- Shift+Enter = ย้อนช่อง
- Ctrl/Cmd+Enter หรือปุ่ม SAVE เท่านั้นจึงบันทึก Vitals
- คง visible-viewport anchoring, focus visibility และ Android/mobile rail behavior เดิม
- `documentation-guardian.js` เรียก `ANESVET_OR_LIVE_INSTANCE.focusFastField()` โดยตรง ไม่พึ่ง legacy global แล้ว

### Quick Drug keyboard assist → `medication-workspace-controller.js`
- Enter progression: Actual → Route → Concentration → Save button
- ไม่ auto-save จาก Enter
- induction action label อยู่ภายใต้ Medication Workspace owner และอิง provisional induction state ภายใน owner เดียวกัน
- dose calculation, concentration validation, duplicate administration safeguard และ confirmation flow เดิมไม่เปลี่ยน

### PWA freeze / BFCache lifecycle → `pwa-controller.js`
- `pwa-controller.js` รับ callback สำหรับ `freeze` และ persisted `pageshow`
- app callback ยังคงเรียก persistence path เดิมผ่าน `flushPendingSave('page-freeze')`
- BFCache restore ยังคง render OR LIVE / Recovery, refresh session lock, restore wake lock และ refresh mobile/fast-vital viewport state
- ไม่สร้าง persistence path ใหม่

## Cache cleanup
- หยุด precache `or-speed-hardening.js`
- หยุด precache standalone `or-speed-hardening.css` เพราะ style ที่ใช้งานจริงถูก bundle อยู่ใน `anesvet-ui-bundle.css` แล้ว
- source CSS เดิมยังอยู่ใน package เพื่อ audit/traceability

## Clinical behavior preserved
ไม่ตั้งใจเปลี่ยน:
- Induction = prepared induction medications considered given / details pending
- individual induction administration time แก้ไขย้อนหลังได้
- Intubation = timestamp-only
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery criteria / handoff
- Final Lock / archive verification
- dose calculation / concentration handling / safety thresholds
- persistence schema / current-case storage contracts

## QA
Current-release contract suites:
- `QA_V17_13_4_LEGACY_RETIREMENT_IV.js`: 31/31 PASS
- `QA_V17_13_4_STATIC_INTEGRITY.js`: 14/14 PASS
- `QA_V17_13_4_CURRENT_WORKFLOW.js`: 31/31 PASS
- `QA_V17_13_4_END_TO_END.js`: 17/17 PASS
- `QA_V17_13_4_OR_INTERACTION.js`: 33/33 PASS
- Total: **126/126 PASS**

Static runtime syntax:
- Active runtime JavaScript: **69/69 PASS** (`node --check`)

## Scope limitation
QA รอบนี้ยังเป็น static/source-contract + deterministic Node regression ไม่ใช่ physical Android/iPad/PWA/IME interaction test. ก่อน production validation ควร smoke test บนอุปกรณ์จริง โดยเน้น Fast Vital keyboard/viewport, Quick Drug keyboard flow, app task switching/BFCache และ installed-PWA update lifecycle.
