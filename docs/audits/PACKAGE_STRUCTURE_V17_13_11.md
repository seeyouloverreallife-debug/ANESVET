# Package Structure Consolidation II — V17.13.11

## Goal
Continue the folder cleanup started in V17.13.10 without moving active JavaScript before path/order regression protection exists.

## Changes
### Runtime static assets grouped
Moved byte-for-byte:
- `anesvet-ui-bundle.css` → `assets/css/anesvet-ui-bundle.css`
- `or-workspace-restructure.css` → `assets/css/or-workspace-restructure.css`
- `icon-192.png` → `assets/icons/icon-192.png`
- `icon-512.png` → `assets/icons/icon-512.png`
- `icon-maskable-512.png` → `assets/icons/icon-maskable-512.png`

All moved files are byte-identical to V17.13.10 source assets.

### Runtime JavaScript preparation
Added:
- `config/runtime-map.json`
- `config/README.md`
- `docs/architecture/RUNTIME_MODULE_MAP_V17_13_11.md`
- `qa/current/QA_V17_13_11_RUNTIME_PATHS.js`

No startup or lazy JavaScript file is moved in this milestone.

## Resulting root
Top-level files: **86 → 81**.

The remaining root files are intentionally runtime-oriented:
- 69 startup scripts;
- 7 lazy scripts;
- `service-worker.js`;
- `index.html`;
- `manifest.webmanifest`;
- `START_HERE_TH.txt`;
- `BUILD_SHA256.txt`.

## Current tree
```text
/
├─ index.html
├─ manifest.webmanifest
├─ service-worker.js
├─ app.js + active startup/lazy JS
├─ START_HERE_TH.txt
├─ BUILD_SHA256.txt
├─ assets/
│  ├─ css/            production runtime CSS
│  ├─ icons/          app/PWA icons
│  ├─ ecg/
│  ├─ fonts/
│  └─ startup/
├─ config/
│  └─ runtime-map.json
├─ docs/
├─ qa/
├─ src/
├─ tools/
└─ build/
```

## Offline startup finding
The new runtime-path inventory exposed one mismatch in V17.13.10: `viewport-coordinator.js` was loaded by `index.html` but not precached by Service Worker.

V17.13.11 adds it to the startup precache. Service Worker coverage now matches the complete startup/lazy map.

## Next safe migration
Move JavaScript one semantic group at a time only after preserving exact load order and updating `runtime-map.json`, `index.html`, Service Worker and lazy loaders in the same patch.

## Verification summary
- contract QA: **185/185 PASS**
- runtime JS syntax: **76/76 PASS**
- CSS parser: **40/40 PASS**
- root files: **81**
- production CSS/icon bytes: unchanged from V17.13.10
- active JavaScript code: no non-version changes from V17.13.10
