# Runtime Module Grouping III Audit — V17.13.14

## Scope
Move the complete `clinical-foundation` startup group to `runtime/clinical/` without changing startup order or clinical behavior.

## Path changes
Moved 3 files from root:
- `drug-dose-reference.js`
- `protocol-review.js`
- `clinical-workflow.js`

New location: `runtime/clinical/`.

## Runtime changes
- `index.html` references the three new paths in the same positions 6–8.
- `service-worker.js` precaches the three new paths.
- `config/runtime-map.json` records current path = target path for `clinical-foundation`.
- `movedStartupGroups` now records both `platform-foundation` and `clinical-foundation`.
- release/cache generation → 17.13.14.

## Preserved contracts
- startup count unchanged: 69
- exact startup order unchanged
- platform group unchanged: 5 under `runtime/platform/`
- lazy module count/path unchanged: 7 under `runtime/knowledge/`
- no clinical calculation or threshold changes
- no persistence schema changes
- no Induction/Intubation/End Surgery/Emergency Return/Recovery/Final Lock semantic changes

## Package result
Root files: **69 → 66**.
