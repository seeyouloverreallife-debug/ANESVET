# Runtime Module Grouping I Audit — V17.13.12

## Scope
Move the complete lazy Clinical Knowledge / ECG group to `runtime/knowledge/` without changing startup JavaScript paths or clinical behavior.

## Path changes
Moved 7 files from root:
- clinical-knowledge-data.js
- ecg-educational-rules.js
- ecg-visual-atlas-data.js
- special-patient-knowledge.js
- comorbidity-knowledge.js
- clinical-knowledge-ui.js
- ecg-visual-atlas.js

New location: `runtime/knowledge/`.

## Runtime changes
- `knowledge-loader.js` now requests the seven new paths with `?v=17.13.12`.
- Sequential lazy load order remains unchanged.
- `service-worker.js` precaches the seven new paths for offline use.
- `config/runtime-map.json` records the new current paths and `lazyJsMoveStatus: moved-runtime-knowledge`.

## Preserved contracts
- startup script count/order unchanged: 69
- lazy module count/order unchanged: 7
- no clinical calculation or threshold changes
- no persistence schema changes
- no Induction/Intubation/End Surgery/Emergency Return/Recovery/Final Lock semantic changes

## Package result
Root files: **81 → 74**.

The migration is path-only for the seven lazy implementation modules; their file bytes are preserved from V17.13.11.
