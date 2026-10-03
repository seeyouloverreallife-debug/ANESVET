# Runtime Module Grouping II Audit — V17.13.13

## Scope
Move the complete `platform-foundation` startup group to `runtime/platform/` without changing startup order or clinical behavior.

## Path changes
Moved 5 files from root:
- lifecycle-coordinator.js
- viewport-coordinator.js
- workspace-owner.js
- presentation-ownership.js
- mobile-or-owner.js

New location: `runtime/platform/`.

## Runtime changes
- `index.html` references the five new paths in the same positions 1–5.
- `service-worker.js` precaches the five new paths.
- `config/runtime-map.json` records the new current paths and `startupJsMoveStatus: moved-platform-foundation`.
- `movedStartupGroups` now records `platform-foundation`.

## Preserved contracts
- startup count unchanged: 69
- exact startup order unchanged
- lazy module count/path unchanged: 7 under `runtime/knowledge/`
- no clinical calculation or threshold changes
- no persistence schema changes
- no Induction/Intubation/End Surgery/Emergency Return/Recovery/Final Lock semantic changes

## Package result
Root files: **74 → 69**.
