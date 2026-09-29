# Migration — V16.21.0 → V16.22.0

## Data migration
No clinical data migration is required.

- IndexedDB remains version 2.
- Full Backup remains schema 3.
- Current case and archived-case structures are unchanged.
- Staff/PIN Security Baseline data is unchanged.
- Hospital Protocol Governance data is unchanged.

## New files
- `case-review-dashboard.js`
- `case-review-dashboard.css`
- V16.22 release/QA/guide documents

## Application integration
`AnesvetApp` now exposes `caseReview.archives()`, which returns a deep clone of the current archive cache for read-only review.

`renderArchives()` dispatches `anesvet:archive-changed` so the dashboard refreshes after archive changes.

## Rollback
Clinical records remain compatible with V16.21.0 because V16.22.0 does not modify their schema. If rolling back the application build, Case Review UI/metadata simply disappears; clinical data does not require conversion.
