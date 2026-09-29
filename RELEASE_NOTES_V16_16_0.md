# ANESVET V16.16.0 — Final Archive Assurance

## Goal
Strengthen the final step of a case so **Final Lock is not treated as safely archived until the archived copy is found and independently verified against the final checksum**.

This release changes record-integrity workflow only. It does **not** change anesthesia calculations, alert thresholds, medication decisions, Recovery readiness, Documentation Guardian semantics, or the existing Final Lock clinical requirements.

## What changed

### 1. Lock → Archive → Verify
After the existing Final Lock transaction, ANESVET now:
1. writes the locked current record as before;
2. writes the archived copy as before;
3. locates that same `caseId` in Cases / Archive;
4. recomputes the checksum of the sealed current record;
5. recomputes the checksum of the archived copy;
6. requires both copies to match the same stored `finalChecksum`.

Legacy locked records whose stored checksum uses the older `FNV1A-...` fallback are verified with the same legacy canonical-payload algorithm instead of being forced into SHA-256.

Verification reports explicit states such as:
- `VERIFIED`
- archive missing
- archived checksum missing
- current checksum mismatch
- archived checksum mismatch
- checksum divergence

### 2. Final Archive Assurance panel
End Case now includes a compact record-integrity panel showing:
- Final Lock status
- archived-copy status
- checksum status
- active archive backend
- record/count summary when verification succeeds

### 3. Safer post-lock flow
The finalized dialog now keeps **Start new case disabled until archive verification passes**.

If archive write or verification fails:
- the already locked current record is preserved;
- the user can still export reports;
- the user can open Cases / Archive;
- a **Retry archive & verify** action is available;
- a direct **Backup all data** action is surfaced on End Case.

### 4. Recovery after interrupted/failed final archive
A locked current record is checked again when End Case is reopened or the app is restored. This allows a final record that was locked before an archive failure/interruption to be re-archived and verified without unlocking or editing the clinical payload.

### 5. New Case gate for locked current records
The normal **New Case** action now independently verifies a locked current record before allowing it to be cleared. If verification has not passed, ANESVET returns to End Case instead of discarding the current locked copy.

## Checksum semantics
V16.16.0 continues to use the existing ANESVET SHA-256 clinical checksum model from `case-runtime.js`.

The existing canonical checksum payload intentionally excludes non-clinical archive metadata such as `archivedAt`, `lastSavedAt`, checksum fields and `auditTrail`, so adding archive/audit metadata after Final Lock does not invalidate the sealed clinical payload. Clinical payload mutation is still detected.

## Compatibility / safety boundary
Unchanged:
- IndexedDB `DB_VERSION = 2`
- current/archive clinical schema
- Final Lock prerequisites
- Recovery completion rules
- medication reconciliation rules
- sign-off requirements
- alert/complication blocking rules
- dose calculations
- physiologic alert thresholds
- Documentation Guardian logic
- report calculations

No migration of existing case payloads is required.
