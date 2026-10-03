# ANESVET V17.9.1 — Architecture Consolidation II

## UI ownership audit
The largest overlap was found around Recovery → End Case and mobile repeat-use presentation:
- repeat-use-ux
- repeat-use-r26
- recovery-endcase-ux
- mobile-first-r27
- mobile-design

These modules previously owned their own pageshow / final-archive / DOM-ready browser subscriptions while rendering overlapping workflow surfaces.

## Consolidation
Extended `lifecycle-coordinator.js` with:
- final-archive-status
- shared DOM-ready helper

Migrated browser lifecycle triggers for the overlapping UI modules to the coordinator.
Also migrated OR Speed Hardening's BFCache pageshow recovery trigger while preserving its persisted-page-only behavior.

The rendering logic itself remains in the existing modules in V17.9.1. This deliberately separates event ownership first, before attempting to merge/remove rendering implementations.

## Regression guards
The release must preserve:
- End Surgery
- keyboard/input hardening
- calculated-as-given medication override flow
- OR LIVE core-first layout
- Recovery core-first layout / Handoff
- emergency return to OR
- final archive / End Case surfaces

Critical save/pagehide/session logic remains untouched.
