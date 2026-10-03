# Presentation State / Negative Selector Audit — ANESVET V17.13.7

## Scope
ต่อจาก V17.13.6 แบบ incremental โดยใช้ V17.13.6 เป็น source of truth และตรวจ presentation state ที่อยู่ด้านใน `:not(...)` เพื่อแยกว่าเป็น active state จริงหรือเป็น legacy state ที่ไม่มี runtime emitter แล้ว

## Audit method
1. Parse startup scripts จาก `index.html` (69 scripts)
2. รวม lazy/offline JavaScript ที่ Service Worker precache เพื่อไม่พลาด state ที่สร้างหลัง startup
3. Extract class ภายใน `:not(.state)` จาก `anesvet-ui-bundle.css`
4. ตรวจ active runtime + HTML ว่ามี emitter/reference ของ state หรือไม่
5. ถ้า state ไม่มี active emitter ให้ตรวจ resolved visual behavior ก่อนย้าย ownership / prune
6. คง state ที่ยังมี canonical runtime owner แม้จะอยู่ใน source CSS เก่า

## Findings
V17.13.6 มี negative-state class 2 ตัวที่ไม่มี active emitter:
- `ux-or-context-compact`
- `ux-patient-details-open`

หลัง V17.13.7 cleanup production bundle ไม่มี orphan `:not(.state)` เหลือ

## 1) OR compact context state
Legacy owner `focused-workspace.js` เคยสร้าง `body.ux-or-context-compact` จาก IntersectionObserver เพื่อเปิด `#orStickyMini` เมื่อ command bar เลื่อนพ้น viewport

แต่ module นี้ถูก retire จาก runtime ตั้งแต่ Legacy Retirement II และ canonical mobile design ใช้ workspace/header context แทน sticky mini แล้ว

V17.13.7 จึง:
- ลบ rules ที่พึ่ง `ux-or-context-compact` ออกจาก `focused-workspace.css` และ canonical bundle
- ลบ `ux-context-in` animation ที่ใช้เฉพาะ retired sticky behavior
- ย้าย resolved tablet behavior ไป `or-workspace-restructure.css` โดยตรง:
  - 768–1179 px + `body.or-mobile-active` → `#orStickyMini` hidden
- mobile ≤767 px ยังถูก canonical `mobile-design.css` ซ่อน
- wide ≥1180 px ยังถูก canonical adaptive workspace rule ซ่อน

ผลคือไม่ต้องมี phantom state class เพื่อรักษา OR context behavior

## 2) Patient details state
Legacy `progressive-clinical-flow.js` เคยสร้าง `#patient.ux-patient-details-open` แต่ module นี้ถูก retire แล้ว

Canonical Patient owner ปัจจุบันคือ `patient-preop-simplification.js` ซึ่งใช้:
- `.patient-secondary-field`
- `.patient-secondary-open`
- `#patientMoreDetailsBtn`

V17.13.6 rule:
`#patient:not(.ux-patient-details-open) .patient-form-grid{row-gap:9px!important}`
จึงกลายเป็น always-active บน ≤720 px

V17.13.7 ลบ rule นี้ ทำให้ canonical `mobile-design.css` กลับมา own mobile form spacing ที่ 12 px ตาม design system ปัจจุบัน

## Protected active negative states
ตัวอย่าง state ที่ตรวจแล้วว่ายัง active และไม่ถูก prune:
- `ux-phase-requested` — emitted by `workspace-owner.js`
- `patient-secondary-open` — emitted by `patient-preop-simplification.js`
- negative states อื่นใน production bundleผ่าน active runtime/HTML reference scan

## Bundle result
- V17.13.6: 396,844 bytes
- V17.13.7: 395,727 bytes
- delta: -1,117 bytes (~0.28%)
- source markers: 38/38 retained
- standalone source CSS: 38 files retained

## Clinical scope
ไม่มีการเปลี่ยน clinical calculations, thresholds, medication semantics, persistence schema, recovery readiness, finalization contract หรือ record semantics

## Validation summary
- Presentation State QA: 41/41 PASS
- Current workflow regression: 31/31 PASS
- End-to-End regression: 17/17 PASS
- OR Interaction regression: 33/33 PASS
- Static integrity: 15/15 PASS
- CSS parser: 4/4 PASS, 0 errors
- Startup JS syntax: 69/69 PASS
- Startup + lazy JS syntax: 76/76 PASS
