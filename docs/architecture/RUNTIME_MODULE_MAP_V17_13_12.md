# Runtime Module Map — V17.13.12

## Current runtime policy
- Startup JavaScript: **69 modules**, still at package root.
- Lazy Clinical Knowledge / ECG JavaScript: **7 modules**, now under `runtime/knowledge/`.
- Exact startup order remains unchanged from V17.13.11.
- Lazy module order remains controlled by `knowledge-loader.js` and unchanged semantically.
- Service Worker must precache **all 69 startup + all 7 lazy modules** at their current paths.

Source of truth: `config/runtime-map.json`.

## First real module move
V17.13.12 moves the complete lazy-knowledge group:
- `clinical-knowledge-data.js`
- `ecg-educational-rules.js`
- `ecg-visual-atlas-data.js`
- `special-patient-knowledge.js`
- `comorbidity-knowledge.js`
- `clinical-knowledge-ui.js`
- `ecg-visual-atlas.js`

from package root to `runtime/knowledge/`.

## Startup modules
The 69 startup modules remain at root for this milestone. Their exact `<script>` order in `index.html` continues to be cross-checked against `config/runtime-map.json`.

## Migration guard
`qa/current/QA_V17_13_12_RUNTIME_GROUPING_I.js` verifies:
- 69 startup modules and exact order;
- 7 lazy modules under `runtime/knowledge/`;
- no lazy root copies remain;
- current lazy paths equal the declared target paths;
- Knowledge loader list equals the runtime map;
- Service Worker coverage for startup + lazy code;
- version/cache alignment;
- no retired JS returns to runtime.

## Next safe group
A future release can move one startup semantic group at a time. `platform-foundation` is the smallest high-value candidate, but only after updating static script paths and preserving exact order with the same regression discipline.
