# Migration — ANESVET V16.1 → V16.2

## Data
No data migration is required.

V16.2 retains the existing ANESVET current-case keys, archive storage, IndexedDB database/version, protocol data, medication data, audit records, and V16 unified record architecture.

## UI preference
V16.2 adds one UI-only local preference key:
- `anesvet_focused_workspace_v162`

It stores only open/collapsed state for the new Recovery workspace sections. It does not contain clinical data.

## Existing progressive-disclosure preference
Existing V16.1 `anesvet_pd_state_v1` preferences remain respected. For a fresh UI state, Recovery Readiness Score defaults to collapsed in V16.2.

## PWA update
Service-worker cache changes to:
- `anesvet-v16-2-0-focused-workspace`

After deployment, allow the existing ANESVET update banner to apply the new service worker. Current/archived clinical data must not be cleared as part of this update.
