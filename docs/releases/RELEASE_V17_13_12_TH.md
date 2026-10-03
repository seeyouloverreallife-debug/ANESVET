# ANESVET V17.13.12 — Runtime Module Grouping I

## เป้าหมาย
พัฒนาต่อจาก V17.13.11 แบบ incremental โดยเริ่มย้าย JavaScript เป็นโฟลเดอร์จริงครั้งแรกจากกลุ่มที่แยกตัวจาก startup มากที่สุด และคง clinical/runtime behavior เดิม

## 1) Lazy Knowledge runtime grouping
ย้าย lazy Clinical Knowledge / ECG modules ทั้ง 7 ตัว:
- `clinical-knowledge-data.js`
- `ecg-educational-rules.js`
- `ecg-visual-atlas-data.js`
- `special-patient-knowledge.js`
- `comorbidity-knowledge.js`
- `clinical-knowledge-ui.js`
- `ecg-visual-atlas.js`

จาก root → `runtime/knowledge/`

## 2) Loader + offline path alignment
- `knowledge-loader.js` เปลี่ยนไปโหลด `runtime/knowledge/*?v=17.13.12`
- ลำดับการโหลดทั้ง 7 ไฟล์ยังเหมือนเดิม
- Service Worker precache path ใหม่ครบ 7/7
- ไม่มี root copy ของ lazy modules เหลือ

## 3) Startup path intentionally unchanged
Startup JavaScript **69 modules** ยังอยู่ root และ exact order เดิมทั้งหมด

เหตุผล: milestone นี้พิสูจน์ path migration กับ lazy group ก่อน ไม่ย้าย startup dependency graph หลายกลุ่มพร้อมกัน

## 4) Runtime map
`config/runtime-map.json`:
- release → 17.13.12
- startupJsMoveStatus → prepared-not-moved
- lazyJsMoveStatus → moved-runtime-knowledge
- lazy current paths = `runtime/knowledge/*`

## Package result
Root files: **81 → 74**

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
- Package Structure: **34/34 PASS**
- Runtime Module Grouping I: **36/36 PASS**
- Static Integrity: **19/19 PASS**
- Current Workflow: **31/31 PASS**
- End-to-End: **17/17 PASS**
- OR Interaction: **33/33 PASS**
- **Total contract QA: 195/195 PASS**

Additional validation:
- startup + lazy runtime JavaScript syntax: **76/76 PASS**
- Service Worker syntax: **PASS**
- CSS parser: **40/40 PASS, 0 errors**
- moved lazy modules: **7/7 byte-identical to V17.13.11**
- Service Worker inventory: **119 assets / 76 versioned JS / 2 versioned CSS**
- startup modules: no non-version/non-path code changes versus V17.13.11
