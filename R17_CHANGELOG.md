# ANESVET V17.2.21 — R17 Backup Restore / Rollback Safety

## Scope (source of truth: V17.2.20 R16 ZIP)

- Restore is fail-closed if active-session ownership is missing, or a pre-restore snapshot cannot be **durably stored and read back** from IndexedDB.
- Snapshot must contain the exact Current Case stored on disk; a newer unsaved in-memory Current Case cannot become a false rollback point.
- IndexedDB dataset replacement must confirm its transaction; verification compares all clinical fields (medication doses/vitals) for modern **and legacy** backup payloads.
- Restored archived cases, patient data and current case are **re-read from IndexedDB**, not just compared with in-memory UI caches.
- Also read back settings, drug library, quick presets, protocol audit, protocol governance and breed aliases (plus pilot feedback queue when available).
- If a restore fails, retain snapshot; explicitly report when automatic rollback cannot fully complete. Rollback snapshot cleanup itself is read-back verified.
- No changes to dose formulas, clinical thresholds, OR LIVE, case schema, or Final Lock checksums.

## Safety change

Automatic Restore now **requires working IndexedDB** for a verified rollback snapshot. Where IndexedDB is unavailable or browser storage is blocked, Restore is denied rather than proceeding without an independently recoverable rollback copy.

## Verification

- R17 focused tests: 14/14 simulated cases; R16 pre-fix baseline exposed 7 failing conditions in original first 9 cases.
- Overall automated suites: 22/22 PASS; JavaScript syntax: 136/136 PASS.
- Static: no duplicate HTML IDs and no missing required cache asset; version and cache names consistent.
- Browser E2E and real Android/iPad testing are NOT verified.
- localStorage + IndexedDB still cannot form a truly atomic cross-store transaction; simultaneous-tab races are mitigated but not eliminated.
