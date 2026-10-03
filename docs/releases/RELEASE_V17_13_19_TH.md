# ANESVET V17.13.19 — Orchestration Dependency Audit / Runtime Module Grouping VIII

ฐานงาน: V17.13.18

## เปลี่ยนหลัก
- audit dependency ของ startup positions 24–26
- ย้าย 3 modules ไป `runtime/orchestration/`:
  - patient-master-orchestration
  - or-record-orchestration
  - recovery-orchestration
- คง startup order positions 24–26 เดิม
- root startup modules ลด 46 → 43
- root files ลด 51 → 48

## Source preservation
ทั้ง 3 orchestration modules เป็น byte-identical กับ V17.13.18 ไม่มีการแก้ patient merge logic, OR vital correction logic หรือ Recovery patch semantics.

## Runtime safety
- `index.html`, `service-worker.js` และ `config/runtime-map.json` ชี้ canonical paths ใหม่ครบ
- Service Worker ยังคง precache startup 69 + lazy 7 modules
- controller ที่ใช้ orchestration globals ยังโหลดหลัง orchestration boundary ตามเดิม

## Clinical/data safety
ไม่มีการเปลี่ยน persistence schema, dose calculation, concentration, alert threshold, Induction/Intubation semantics, End Surgery, Emergency Return, Recovery หรือ Final Lock.

## QA
ดู `qa/current/QA_V17_13_19_RESULTS.txt`.

## Scope limitation
Static/source-contract + deterministic Node regression + syntax/CSS validation only. Physical Android/iPad/PWA/IME interaction validation was not performed in this release pass.

## Final verification
- Contract QA: 269/269 PASS
- Orchestration Dependency Audit: 30/30 PASS
- Runtime JS syntax: 76/76 PASS
- Service Worker syntax: PASS
- CSS parser: 40/40 PASS
- Logical runtime compare vs V17.13.18: 76/76 PASS after version normalization
- Normalized `index.html`: byte-equivalent after reverting orchestration path + version changes
- Normalized Service Worker: byte-equivalent after reverting orchestration path + version + cache generation changes
- Service Worker inventory: 120 assets / 76 JS / 2 CSS
- Physical Android/iPad/PWA/IME validation: not performed in this static release pass
