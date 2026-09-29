# Migration — V16.15.0 → V16.16.0

## Data migration
No clinical-data migration is required.

Legacy `FNV1A-...` locked records remain verifiable with their original fallback checksum semantics.

V16.16.0 keeps:
- `DB_VERSION = 2`
- existing current-case key
- existing archive store/key
- Patient Master
- Hospital Settings / Drug Library / Procedure Template library
- Backup schema 2
- Final Lock checksum semantics

## Update steps
1. Keep the V16.15.0 Full Backup available.
2. Deploy V16.16.0 and allow the existing PWA update guard to reload only when it is safe.
3. Open one existing archived locked case and use **Verify integrity** as a spot check.
4. If the current case is already Final Locked, open End Case. V16.16.0 will check whether the matching archive copy exists and matches the final checksum.
5. For the first test case, run the full path: Recovery complete → Final checklist/sign-off → Final Lock → Archive verification → Start new case.

## Existing locked current record with missing archive
V16.16.0 does not unlock or rewrite the clinical payload. Use **Retry archive & verify**. If the retry still fails, export the report and Full Backup before using any destructive reset workflow.
