# Controller Ownership Migration — V17.13.20

The canonical controller boundary is now `runtime/controllers/`.

`index.html`, `service-worker.js` and `config/runtime-map.json` point to the same seven canonical paths. Legacy root copies are intentionally absent.

No controller declarations were reordered. No controller logic, persistence schema, dose semantics, alert thresholds, recovery readiness rules or final-lock rules were changed by this migration.
