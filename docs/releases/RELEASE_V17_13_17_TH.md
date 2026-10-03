# ANESVET V17.13.17 — Session Ownership Migration / Runtime Module Grouping VI

ฐานงาน: V17.13.16

## เปลี่ยนหลัก
- ย้าย session ownership pair 2 ตัวไป `runtime/core/`:
  - session-coordination
  - session-controller
- คง startup order เดิม positions 17–18
- `runtime/core/` ตอนนี้ครอบคลุม app-foundation positions 9–18 ครบ 10 modules
- root startup modules ลด 53 → 51
- root files ลด 58 → 56

## Source preservation
Session pair 2/2 byte-identical กับ V17.13.16.

## Session safety
ยังคง:
- localStorage clinical-session lock
- sessionStorage tab identity
- BroadcastChannel heartbeat/take-control
- stale-owner wake verification
- VIEW ONLY guard
- orphaned-session recovery

## Clinical/data safety
ไม่มีการเปลี่ยน persistence schema, IndexedDB behavior, checksum API, validation semantics, dose calculation, concentration, alert threshold, Induction/Intubation semantics, End Surgery, Emergency Return, Recovery หรือ Final Lock.

## QA
ดู `qa/current/QA_V17_13_17_RESULTS.txt`.

## Release verification
- Contract QA: 200/200 PASS
- Session ownership QA: 20/20 PASS
- Runtime JS syntax: 76/76 PASS
- Service Worker syntax: PASS
- CSS parser: 40/40 PASS
- Session moved sources: 2/2 byte-identical
- Physical Android/iPad/PWA/IME validation: not performed in this static release pass
- Service Worker inventory: 123 assets / 76 JS / 2 CSS
- Logical runtime compare vs V17.13.16: 76/76 PASS (version normalization only)
