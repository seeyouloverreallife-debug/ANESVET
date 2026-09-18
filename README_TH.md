# ANESVET V14.1 — Clinical Record Integrity & Archive UX

## Archive Search / Filter
- Search patient / HN / Record ID / procedure / surgeon / anesthetist
- Date range
- Locked / Voided / Working copy
- Newest / Oldest / Patient / HN sort

## Void instead of Delete
- LOCKED FINAL records cannot be permanently deleted from normal archive UI
- Void requires reason + author + typed VOID confirmation
- Original record, checksum, amendments and audit trail remain available
- Working copies can still be deleted

## Final Sign-off
Before End, Lock & Archive:
- Anesthetist signs
- Surgeon signs
- Signer name + timestamp stored
- Both signatures are required for READY TO END

## Record Identity & Integrity
- Human Record ID: ANV-YYYYMMDD-XXXXX
- Final SHA-256 checksum created at final lock
- Archive shows short checksum
- Verify integrity button recomputes checksum
- Amendments / void metadata do not rewrite original clinical checksum

## Backup Health
Cases page shows:
- Database backend
- Archived case count
- Last backup age
- Browser storage estimate
- Backup now button
- Backup age warning at 7+ days

## Sticky OR status
While scrolling OR LIVE, a compact sticky bar keeps visible:
- Case status
- Case time
- Next vital-sign due
- Record now button

## Preserved V14 hardening
- IndexedDB archive
- First-record reminder
- Sound/vibration alert
- Wake Lock
- Plausibility validation
- Protocol governance/versioning
- Audit trail + amendments

## URL
https://seeyouloverreallife-debug.github.io/ANESVET/?v=14.1
