# ANESVET V17.13.20 — Controller Runtime Grouping IX

ฐานงาน: V17.13.19

## เปลี่ยนหลัก
- audit dependency ของ startup positions 27–33
- ย้าย 7 controller modules ไป `runtime/controllers/`
- คง startup order positions 27–33 เดิม
- root startup modules ลด 43 → 36
- root files ลด 48 → 41

## Controller boundary
ประกอบด้วย Patient Master, Pre-op, Medication Workspace, OR LIVE, Recovery, Backup/Restore และ Finalization/Archive.

## Source preservation
5 modules byte-identical กับ V17.13.19; Medication Workspace และ OR LIVE ต่างเฉพาะ release stamp 17.13.19 → 17.13.20.

## Runtime safety
- `index.html`, `service-worker.js`, `config/runtime-map.json` ชี้ canonical controller paths ใหม่ครบ
- startup order 69 modules ไม่เปลี่ยน
- lazy knowledge 7 modules ไม่เปลี่ยน
- legacy root controller copies ถูกเอาออก

## Clinical/data safety
ไม่มีการเปลี่ยน dose calculation, concentration handling, persistence schema, alert threshold, Induction/Intubation semantics, Emergency Return, Recovery, Backup integrity หรือ Final Lock.

## QA
ดู `qa/current/QA_V17_13_20_RESULTS.txt`.

## Scope limitation
Static/source-contract + deterministic Node regression + syntax/CSS validation only. Physical Android/iPad/PWA/IME interaction validation was not performed in this release pass.

## Final verification
- Contract QA: 310/310 PASS
- Controller Dependency Audit: 34/34 PASS
- Runtime JS syntax: 76/76 PASS
- Service Worker syntax: PASS
- CSS parser: 40/40 PASS
- Logical runtime compare vs V17.13.19: 76/76 PASS after version normalization
- Normalized `index.html`: byte-equivalent after reverting controller path + version changes
- Normalized Service Worker: byte-equivalent after reverting controller path + version + cache generation changes
- Service Worker inventory: 120 assets / 76 JS / 2 CSS
- Physical Android/iPad/PWA/IME validation: not performed in this static release pass
