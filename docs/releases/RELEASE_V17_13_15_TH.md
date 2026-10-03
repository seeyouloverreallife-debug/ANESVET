# ANESVET V17.13.15 — App Foundation Dependency Audit / Runtime Grouping IV

ฐานงาน: V17.13.14

## เปลี่ยนหลัก
- audit app-foundation 10 modules แล้วแยก dependency เป็น 3 subgroup
- ย้าย subgroup ที่เสี่ยงต่ำสุด 4 ตัวไป `runtime/core/`
- คง startup order เดิมตำแหน่ง 9–12
- root startup modules ลด 61 → 57
- root files ลด 66 → 62
- state/storage และ session subgroup ยังไม่ย้าย

## Source preservation
4 moved modules byte-identical กับ V17.13.14 ทุก byte.
Logical runtime comparison 76/76 modules ไม่พบ non-version code change.

## Clinical safety
ไม่มีการเปลี่ยน dose calculation, concentration, alert threshold, persistence schema, Induction/Intubation semantics, End Surgery, Emergency Return, Recovery หรือ Final Lock.

## QA
ดู `qa/current/QA_V17_13_15_RESULTS.txt`.
