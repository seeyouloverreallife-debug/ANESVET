# ANESVET V17.13.13 — Runtime Module Grouping II

## เป้าหมาย
พัฒนาต่อจาก V17.13.12 แบบ incremental โดยเริ่มย้าย startup JavaScript กลุ่มแรกเข้าสู่โครงสร้าง `runtime/` โดยรักษา exact startup order และ behavior เดิม

## 1) Platform foundation grouping
ย้าย startup modules 5 ตัวจาก package root → `runtime/platform/`:
- `lifecycle-coordinator.js`
- `viewport-coordinator.js`
- `workspace-owner.js`
- `presentation-ownership.js`
- `mobile-or-owner.js`

ลำดับใน `index.html` ยังคงเป็นลำดับ 1–5 เดิมทั้งหมด

## 2) Runtime path alignment
อัปเดตพร้อมกัน:
- `index.html` → path ใหม่ทั้ง 5 ตัว
- `service-worker.js` → precache path ใหม่ทั้ง 5 ตัว
- `config/runtime-map.json` → current path = target path สำหรับ `platform-foundation`
- release/cache generation → 17.13.13

## 3) Startup scope intentionally limited
Startup JavaScript รวมยังคง **69 modules**
- 5 modules → `runtime/platform/`
- 64 modules → root เดิม

Lazy Clinical Knowledge / ECG ยังอยู่ `runtime/knowledge/` 7 modules ตาม V17.13.12

## 4) Package result
Root files: **74 → 69**

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

## Scope limitation
QA เป็น static/source-contract + deterministic Node regression + syntax/CSS parser validation ไม่ใช่ physical Android/iPad/PWA/IME visual interaction test

## QA
- Canonical CSS Ownership II: **25/25 PASS**
- Package Structure: **37/37 PASS**
- Runtime Module Grouping II: **41/41 PASS**
- Static Integrity: **22/22 PASS**
- Current Workflow: **31/31 PASS**
- End-to-End: **17/17 PASS**
- OR Interaction: **33/33 PASS**
- **Total contract QA: 206/206 PASS**

Additional validation:
- startup + lazy runtime JavaScript syntax: **76/76 PASS**
- Service Worker syntax: **PASS**
- CSS parser: **40/40 PASS, 0 errors**
- platform modules moved: **5/5 behavior-byte preserved**; 4/5 exact byte-identical, `presentation-ownership.js` differs only by release version stamp
- logical runtime modules: **76/76 no non-version content changes versus V17.13.12**
- Service Worker inventory: **120 assets / 76 versioned JS / 2 versioned CSS**
