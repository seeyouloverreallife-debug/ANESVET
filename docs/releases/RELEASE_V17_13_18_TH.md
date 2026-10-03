# ANESVET V17.13.18 — Domains Dependency Audit / Runtime Module Grouping VII

ฐานงาน: V17.13.17

## เปลี่ยนหลัก
- audit dependency ของ startup positions 19–23
- ย้าย 5 modules ไป `runtime/domains/`:
  - pwa-controller
  - dose-reference-controller
  - patient-domain
  - or-domain
  - recovery-domain
- คง startup order positions 19–23 เดิม
- root startup modules ลด 51 → 46
- root files ลด 56 → 51

## Source preservation
- dose-reference / patient / OR / recovery: byte-identical กับ V17.13.17
- PWA controller: ต่างเฉพาะ release stamp

## Runtime safety
- `index.html`, `service-worker.js` และ `config/runtime-map.json` ชี้ canonical paths ใหม่ครบ
- Service Worker ยัง precache startup 69 + lazy 7 modules
- domain global boundaries ที่ `app.js` ใช้อยู่ยังเหมือนเดิม

## Clinical/data safety
ไม่มีการเปลี่ยน persistence schema, checksum API, dose calculation, concentration, alert threshold, Induction/Intubation semantics, End Surgery, Emergency Return, Recovery หรือ Final Lock.

## QA
ดู `qa/current/QA_V17_13_18_RESULTS.txt`.

## Scope limitation
Static/source-contract + deterministic Node regression + syntax/CSS validation only. Physical Android/iPad/PWA/IME interaction validation was not performed in this release pass.

## Release hardening finding
พบว่า cache generation ของ Service Worker ยังเป็น `anesvet-v17-13-17-startup` แม้ asset refs เป็น 17.13.18 แล้ว จึงแก้เป็น `anesvet-v17-13-18-startup` และแก้ QA guard ที่ inherit ค่าเก่ามาด้วย จากนั้นรัน regression ใหม่ครบทั้งหมด.

## Final verification
- Contract QA: 238/238 PASS
- Domains Dependency Audit: 28/28 PASS
- Runtime JS syntax: 76/76 PASS
- Service Worker syntax: PASS
- CSS parser: 40/40 PASS
- Logical runtime compare vs V17.13.17: 76/76 PASS after version normalization
- Normalized `index.html`: byte-equivalent after reverting domain path + version changes
- Normalized Service Worker: byte-equivalent after reverting domain path + version + cache-generation changes
- Service Worker inventory: 120 assets / 76 JS / 2 CSS
- Physical Android/iPad/PWA/IME validation: not performed in this static release pass
