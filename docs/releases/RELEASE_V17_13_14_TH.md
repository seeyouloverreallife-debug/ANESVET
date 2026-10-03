# ANESVET V17.13.14 — Runtime Module Grouping III

## เป้าหมาย
พัฒนาต่อจาก V17.13.13 แบบ incremental โดยย้าย startup JavaScript กลุ่ม `clinical-foundation` เข้าสู่ `runtime/clinical/` และรักษา exact startup order/clinical behavior เดิม

## 1) Clinical foundation grouping
ย้าย startup modules 3 ตัวจาก package root → `runtime/clinical/`:
- `drug-dose-reference.js`
- `protocol-review.js`
- `clinical-workflow.js`

ลำดับใน `index.html` ยังคงเป็น startup positions 6–8 เดิมทั้งหมด

## 2) Runtime path alignment
อัปเดตพร้อมกัน:
- `index.html` → path ใหม่ทั้ง 3 ตัว
- `service-worker.js` → precache path ใหม่ทั้ง 3 ตัว
- `config/runtime-map.json` → current path = target path สำหรับ `clinical-foundation`
- QA path-aware guards
- release/cache generation → 17.13.14

## 3) Startup scope intentionally limited
Startup JavaScript รวมยังคง **69 modules**
- 5 modules → `runtime/platform/`
- 3 modules → `runtime/clinical/`
- 61 modules → root เดิม

Lazy Clinical Knowledge / ECG ยังอยู่ `runtime/knowledge/` 7 modules ตามเดิม

## 4) Package result
Root files: **69 → 66**

## Runtime behavior preserved
ไม่มี intentional change ต่อ:
- dose reference data / dose calculations
- protocol review logic
- clinical workflow thresholds
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
- persistence schema

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + syntax/CSS parser validation ไม่ใช่ physical Android/iPad/PWA/IME visual interaction test

## QA
- Canonical CSS Ownership II: **25/25 PASS**
- Package Structure: **40/40 PASS**
- Runtime Module Grouping III: **48/48 PASS**
- Static Integrity: **25/25 PASS**
- Current Workflow: **31/31 PASS**
- End-to-End: **17/17 PASS**
- OR Interaction: **33/33 PASS**
- **Total contract QA: 219/219 PASS**

Additional validation:
- startup + lazy runtime JavaScript syntax: **76/76 PASS**
- Service Worker syntax: **PASS**
- CSS parser: **40/40 PASS, 0 errors**
- clinical-foundation modules: **3/3 exact byte-identical versus V17.13.13**
- logical runtime modules: **76/76 no non-version content changes versus V17.13.13**
- Service Worker inventory: **120 assets / 76 JavaScript / 2 CSS**
