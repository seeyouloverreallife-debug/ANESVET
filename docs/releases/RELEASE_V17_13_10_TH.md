# ANESVET V17.13.10 — Canonical CSS Ownership II + Package Structure I

## เป้าหมาย
พัฒนาต่อจาก V17.13.9 แบบ incremental โดยใช้ V17.13.9 เป็น source of truth ไม่ rewrite application และไม่เปลี่ยน clinical semantics

Milestone นี้มี 2 เป้าหมายพร้อมกัน:
1. ลด legacy CSS source identity ต่อจาก V17.13.9 โดยไม่เปลี่ยน declaration/cascade
2. จัด package ที่เคยแบนและมีไฟล์บน root มากกว่า 300 ไฟล์ให้เป็นหมวดหมู่ที่ดูแลต่อได้ง่ายขึ้น โดยคง runtime paths เดิมไว้

## 1) Canonical CSS Ownership Migration II
Retire legacy CSS source names เพิ่ม 2 ตัว:
- `usability-hardening.css` → `src/styles/canonical/workflow-assist-presentation.css`
- `mobile-first-r27.css` → `src/styles/canonical/mobile-workspace-presentation.css`

ทั้งสองไฟล์ใช้ source bytes เดิมจาก V17.13.9 แบบ exact copy และ bundle declarations/order ไม่เปลี่ยน

### Debt status
- retired presentation JS: **13** modules (คงเดิม)
- legacy-active CSS source debt: **11 → 9**
- bundle source markers: **38**
- source CSS: **29 canonical + 9 legacy-active = 38**
- runtime CSS delivery: **2 stylesheets**

## 2) Package Structure Consolidation I
ก่อนจัดโครงสร้าง root มีไฟล์ประมาณ **311 files**
หลังจัดโครงสร้าง root เหลือ **86 files** โดยไม่ย้าย startup/runtime JS ที่ `index.html` ใช้งานจริง

โครงสร้างหลัก:
- `docs/releases/` — release notes
- `docs/architecture/` — owner maps / layout contracts
- `docs/audits/` — migration / presentation / CSS debt audits
- `docs/retirement/` — retirement history
- `qa/current/` — QA ของ release ปัจจุบัน
- `qa/archive/` — QA/results รุ่นเก่า
- `qa/evidence/` — screenshots/evidence
- `src/styles/canonical/` — source-only canonical CSS ที่รวมเข้า bundle
- `src/styles/legacy-active/` — CSS legacy-name ที่ยังมี active visual dependency
- `src/legacy-js/` — retired JS source สำหรับ audit/rollback เท่านั้น
- `build/history/` — historical checksum/source metadata

### Runtime path policy
เพื่อป้องกัน path regression:
- 69 startup JS files ยังคง path เดิมที่ root
- `index.html`, `manifest.webmanifest`, `service-worker.js`, `app.js` ยังคง root
- runtime CSS ยังเป็น `anesvet-ui-bundle.css` + `or-workspace-restructure.css`
- source-only CSS และ retired JS เท่านั้นที่ย้ายเข้าโฟลเดอร์ใน milestone นี้

## Release alignment
- runtime/service worker/knowledge loader → **V17.13.10**
- cache generation → `anesvet-v17-13-10-startup`

## Runtime behavior preserved
ไม่มี intentional change ต่อ:
- Induction = given / details pending
- editable induction administration time
- Intubation = timestamp-only
- Fast Vital
- Quick Drug
- End Surgery
- Emergency Return OR ↔ Recovery
- Recovery / handoff
- Final Lock / archive verification
- PWA freeze / BFCache restoration
- dose / concentration calculations
- alert thresholds
- persistence schema

## QA
Current release QA อยู่ที่ `qa/current/`

- `QA_V17_13_10_CANONICAL_CSS_OWNERSHIP_II.js`: **25/25 PASS**
- `QA_V17_13_10_PACKAGE_STRUCTURE.js`: **26/26 PASS**
- `QA_V17_13_10_STATIC_INTEGRITY.js`: **17/17 PASS**
- `QA_V17_13_10_CURRENT_WORKFLOW.js`: **31/31 PASS**
- `QA_V17_13_10_END_TO_END.js`: **17/17 PASS**
- `QA_V17_13_10_OR_INTERACTION.js`: **33/33 PASS**
- Total contract QA: **149/149 PASS**

Additional validation:
- active startup JavaScript syntax: **69/69 PASS**
- startup + lazy runtime JavaScript syntax: **76/76 PASS**
- CSS parser: **40/40 PASS, 0 errors**
- Service Worker runtime delivery remains **119 assets / 75 JS / 2 CSS**

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + syntax/CSS parser validation ไม่ใช่ physical Android/iPad/PWA/IME visual interaction test
