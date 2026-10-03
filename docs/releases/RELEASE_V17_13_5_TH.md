# ANESVET V17.13.5 — Legacy Presentation Retirement V / CSS & Precache Consolidation

## เป้าหมาย
พัฒนาต่อจาก V17.13.4 แบบ incremental โดยใช้ V17.13.4 เป็น source of truth และลด presentation/offline payload ที่ซ้ำ โดยไม่เปลี่ยน clinical semantics, dose/safety rules, persistence schema, finalization contract หรือ CSS cascade ที่ผู้ใช้เห็นจริง

## สิ่งที่เปลี่ยน
### Service Worker CSS precache consolidation
ใน V17.13.4 `anesvet-ui-bundle.css` มี source CSS เดิมครบ 38 ไฟล์อยู่แล้ว แต่ Service Worker ยัง precache standalone CSS ซ้ำจำนวนมาก

V17.13.5 เปลี่ยนให้ precache production CSS เพียง 2 ไฟล์ที่ runtime ใช้จริง:
- `anesvet-ui-bundle.css`
- `or-workspace-restructure.css`

ผลลัพธ์:
- Service Worker asset list: **156 → 119 assets**
- CSS precache references: **39 → 2**
- ตัด duplicate standalone CSS จาก precache: **37 ไฟล์**
- ลด source payload ซ้ำประมาณ **387,214 bytes (~378 KB uncompressed)**

Standalone CSS source files ยังอยู่ใน package ครบ เพื่อ audit / rollback / future refactor

## Visual behavior protection
รอบนี้ไม่ได้แก้เนื้อหา CSS production ที่ browser ใช้งานจริง
- `anesvet-ui-bundle.css` SHA-256 ยังคง `e89f28c6c08f0743ea86c6a3c691a8496d7e99e056226f20613044955e85fe81`
- `or-workspace-restructure.css` SHA-256 ยังคง `fee4fcd43dce265c6a52d61ef0eec96dbeb31266d3b54310799aec8462052cda`

ทั้งสองไฟล์ byte-identical กับ V17.13.4 จึงไม่มีการตั้งใจเปลี่ยน CSS cascade หรือ visual rules ใน milestone นี้

## Runtime ownership
- Runtime JavaScript ยังคง **69 scripts**
- retired JS 13 modules จาก Retirement I–IV ยังคงไม่ถูกโหลด
- canonical owners จาก V17.13.4 ยังคงเดิม
- ไม่มีการ retire JavaScript เพิ่มในรอบนี้ เพราะ scope คือ CSS/offline payload consolidation

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
Current-release contract suites:
- `QA_V17_13_5_LEGACY_RETIREMENT_V.js`: 38/38 PASS
- `QA_V17_13_5_STATIC_INTEGRITY.js`: 15/15 PASS
- `QA_V17_13_5_CURRENT_WORKFLOW.js`: 31/31 PASS
- `QA_V17_13_5_END_TO_END.js`: 17/17 PASS
- `QA_V17_13_5_OR_INTERACTION.js`: 33/33 PASS
- Total: **134/134 PASS**

Static runtime syntax:
- Active runtime JavaScript: **69/69 PASS** (`node --check`)

## Scope limitation
QA รอบนี้ยังเป็น static/source-contract + deterministic Node regression ไม่ใช่ physical Android/iPad/PWA/IME interaction test. ก่อน production validation ควร smoke test installed PWA update/offline startup และ Fast Vital/Quick Drug interaction บนอุปกรณ์จริง
