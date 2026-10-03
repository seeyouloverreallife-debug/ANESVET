# ANESVET build / migration tools

`config/runtime-map.json` is the source-of-truth runtime path inventory.

Current V17.14.5 policy:
- startup JavaScript: 69 modules total;
- `runtime/platform/`: 5 platform-foundation modules;
- `runtime/clinical/`: 3 clinical-foundation modules;
- `runtime/core/`: 10 app-foundation modules;
- `runtime/domains/`: 5 domain/PWA/dose-reference boundary modules;
- `runtime/orchestration/`: 3 patient/OR/recovery orchestration modules;
- remaining startup modules at package root: 43;
- lazy Clinical Knowledge / ECG JavaScript: 7 modules under `runtime/knowledge/`;
- `knowledge-loader.js` owns lazy knowledge load order/path;
- `index.html` owns startup load order/path;
- Service Worker must precache all 69 startup + 7 lazy modules;
- CSS and icons remain grouped under `assets/`.

For any future runtime path move, update in the same patch:
1. `config/runtime-map.json`
2. `index.html` or the responsible lazy loader
3. `service-worker.js`
4. current path/group QA
5. release/owner documentation
