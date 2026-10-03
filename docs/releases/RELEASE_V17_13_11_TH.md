# ANESVET V17.13.11 — Package Structure II + Runtime Module Grouping Preparation

## เป้าหมาย
พัฒนาต่อจาก V17.13.10 แบบ incremental โดยใช้ V17.13.10 เป็น source of truth ไม่ rewrite application และไม่เปลี่ยน clinical semantics

Milestone นี้เตรียมย้าย active runtime JavaScript ให้เป็นโฟลเดอร์ในอนาคต โดยสร้าง path/load-order contract ก่อน และย้ายเฉพาะ static runtime assets ที่เสี่ยงต่ำในรอบนี้

## 1) Runtime path manifest
เพิ่ม `config/runtime-map.json` เป็น machine-readable migration/QA source of truth:
- startup JS **69 modules** พร้อม exact order
- lazy Clinical Knowledge / ECG JS **7 modules**
- semantic group ของแต่ละ module
- proposed future path ใต้ `runtime/*`
- production CSS paths
- app/PWA icon paths

V17.13.11 ยังใช้ static `<script>` tags แบบเดิมในการเปิดแอป ไม่เปลี่ยนไปใช้ dynamic loader

## 2) Runtime static assets เข้าโฟลเดอร์
ย้ายแบบ byte-preserving:
- production CSS → `assets/css/`
- app/PWA icons → `assets/icons/`

Root files ลด **86 → 81**

Startup/lazy JavaScript ยังอยู่ root ทั้งหมดเพื่อคง startup behavior เดิม

## 3) Offline precache defect fixed
Runtime path QA พบว่า V17.13.10 โหลด `viewport-coordinator.js` ใน `index.html` แต่ Service Worker ไม่ได้ precache ไฟล์นี้

V17.13.11 เพิ่ม `viewport-coordinator.js?v=17.13.11` เข้า startup precache ทำให้ coverage เป็น:
- startup JS: **69/69**
- lazy JS: **7/7**

## Release alignment
- deployment/runtime version → **V17.13.11**
- cache generation → `anesvet-v17-13-11-startup`
- production CSS paths → `assets/css/*`
- icon paths → `assets/icons/*`

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

- Canonical CSS ownership II: **25/25 PASS**
- Package structure II: **31/31 PASS**
- Runtime path map: **31/31 PASS**
- Static integrity: **17/17 PASS**
- Current workflow: **31/31 PASS**
- End-to-End: **17/17 PASS**
- OR Interaction: **33/33 PASS**
- Total contract QA: **185/185 PASS**

Additional validation:
- active startup + lazy runtime JavaScript syntax: **76/76 PASS**
- Service Worker syntax: **PASS**
- CSS parser: **40/40 PASS, 0 errors**
- Service Worker precache inventory: **119 assets / 76 versioned JS / 2 versioned CSS**
- moved CSS/icon files are byte-identical to V17.13.10
- all 76 runtime JS files have no non-version code changes versus V17.13.10
- `index.html` / manifest differences are limited to V17.13.11 alignment and the intended CSS/icon paths
- Service Worker differences are limited to version/path alignment plus the `viewport-coordinator.js` precache fix

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + syntax/CSS parser validation ไม่ใช่ physical Android/iPad/PWA/IME visual interaction test
