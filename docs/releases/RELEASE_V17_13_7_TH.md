# ANESVET V17.13.7 — Presentation State / Negative Selector Audit

## เป้าหมาย
พัฒนาต่อจาก V17.13.6 แบบ incremental โดยใช้ V17.13.6 เป็น source of truth แก้ presentation state ที่ตกค้างหลัง retire legacy owners โดยไม่ rewrite UI และไม่เปลี่ยน clinical semantics

## สิ่งที่เปลี่ยน
### 1) Retired OR context state cleanup
- `focused-workspace.js` ถูก retire จาก runtime อยู่แล้ว จึงไม่มี emitter ของ `ux-or-context-compact`
- ลบ `ux-or-context-compact` rules และ `ux-context-in` animation ออกจาก source/bundle
- ย้าย tablet result ที่ยังต้องรักษาไป canonical `or-workspace-restructure.css`
- 768–1179 px + OR focus active → `#orStickyMini` ยังคง hidden โดยไม่พึ่ง phantom state
- mobile และ wide behavior ยังคงมี canonical owner เดิม

### 2) Patient details negative-state cleanup
- `progressive-clinical-flow.js` ถูก retire แล้ว จึงไม่มี emitter ของ `ux-patient-details-open`
- ลบ always-active legacy rule ที่บังคับ mobile patient row-gap = 9 px
- canonical `mobile-design.css` กลับมา own spacing = 12 px
- การเปิด/ปิดรายละเอียด Patient ยังคงใช้ canonical `.patient-secondary-field` / `.patient-secondary-open` จาก `patient-preop-simplification.js`

### 3) Negative selector audit guard
- scan startup + lazy runtime union
- production bundle หลัง cleanup ไม่มี class ภายใน `:not(.state)` ที่ไม่มี active runtime/HTML reference
- `ux-phase-requested` ถูกคงไว้เพราะ `workspace-owner.js` ยัง emit จริง

## Runtime / delivery
- Runtime JavaScript: **69 scripts**
- Runtime stylesheets: **2**
- JavaScript retirement count: **13 modules** (ไม่ retire เพิ่ม)
- Bundle: **396,844 → 395,727 bytes** (-1,117 bytes / ~0.28%)
- Bundle source markers: **38/38**
- standalone source CSS: **38 files**

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
- Fast Vital keyboard/save semantics
- Quick Drug keyboard progression
- PWA freeze / BFCache restoration callbacks

## QA
- `QA_V17_13_7_PRESENTATION_STATE.js`: 41/41 PASS
- `QA_V17_13_7_STATIC_INTEGRITY.js`: 15/15 PASS
- `QA_V17_13_7_CURRENT_WORKFLOW.js`: 31/31 PASS
- `QA_V17_13_7_END_TO_END.js`: 17/17 PASS
- `QA_V17_13_7_OR_INTERACTION.js`: 33/33 PASS
- Total: **137/137 PASS**

รายละเอียด audit: `PRESENTATION_STATE_AUDIT_V17_13_7.md`

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + CSS parser/syntax validation ไม่ใช่ physical Android/iPad/PWA/IME interaction test

## CSS hashes
- `anesvet-ui-bundle.css`: `76d521ae1bab10e351a060a391094a55bb01abd7b21c4de97c32ac04374c196f`
- `or-workspace-restructure.css`: `d3b28658ebca228d5b3ddc168cff8909f8baf68efee4262d7a330a8cac52cd3d`

## Additional validation
- CSS parser (touched stylesheets): 4/4 PASS, 0 errors
- Active startup JavaScript syntax: 69/69 PASS
- Startup + lazy runtime JavaScript syntax: 76/76 PASS
- Service Worker syntax: PASS
