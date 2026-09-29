# Migration — V16.9.0 → V16.10.0

## Database
No database migration is required.

- DB name: `ANESVET_DB` unchanged
- DB version: `2` unchanged
- storage keys: unchanged
- archived-case format: unchanged

## Current-case data
V16.10.0 does not introduce a required persisted clinical field. Recovery transition and contextual button state are derived from existing fields including:
- `casePhase`
- `recoveryStartedAt`
- `recoveryCompletedAt`
- `extubatedAt`
- `recoveryRecords`
- `recoveryScores`
- checklist / N/A state
- active alerts / complications

## Upgrade behavior
Existing V16.9.0 cases continue to load without conversion. The Recovery Handoff retains the same source data and full detailed text; only the default presentation is more compact.

## PWA cache
Service worker cache key changes to `anesvet-v16-10-0-recovery-workflow` and includes `recovery-refinement.css`. A normal reload/update is sufficient; local clinical data should not be cleared.
