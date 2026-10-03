# ANESVET V17.13.16 — Runtime Module Grouping V / State-Storage Migration

ฐานงาน: V17.13.15

## เปลี่ยนหลัก
- ย้าย state/storage foundation 4 ตัวไป `runtime/core/`:
  - branding
  - clinical-validation
  - case-runtime
  - core-storage
- คง startup order เดิม positions 13–16
- `runtime/core/` ตอนนี้ครอบคลุม app-foundation positions 9–16 จำนวน 8 modules
- session pair positions 17–18 ยัง root และยังไม่เปลี่ยน semantics
- root startup modules ลด 57 → 53
- root files ลด 62 → 58

## Source preservation
Moved state/storage modules 4/4 byte-identical กับ V17.13.15.

## Clinical/data safety
ไม่มีการเปลี่ยน persistence schema, IndexedDB behavior, case checksum API, clinical validation semantics, dose calculation, concentration, alert threshold, Induction/Intubation semantics, End Surgery, Emergency Return, Recovery หรือ Final Lock.

## QA
ดู `qa/current/QA_V17_13_16_RESULTS.txt`.

## Release verification
- Contract QA: 179/179 PASS
- Runtime JS syntax: 76/76 PASS
- Service Worker syntax: PASS
- CSS parser: 40/40 PASS
- Logical runtime compare vs V17.13.15: 76/76 PASS
- State/storage moved sources: 4/4 byte-identical
- Service Worker inventory: 123 assets / 76 JS / 2 CSS
- Physical Android/iPad/PWA/IME validation: not performed in this static release pass
