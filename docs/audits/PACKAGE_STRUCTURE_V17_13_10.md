# Package Structure Consolidation I — V17.13.10

## Problem
The historical package accumulated release notes, owner maps, QA scripts/results, source-only CSS and retired JS in the project root. V17.13.9 had more than 300 top-level files, making source ownership and release inspection unnecessarily difficult.

## Safety constraint
Do not move runtime paths used by `index.html`, Service Worker startup, manifest, or lazy runtime until path-aware regression coverage exists.

## Implemented structure
```
/
├─ index.html
├─ manifest.webmanifest
├─ service-worker.js
├─ app.js + active runtime JS
├─ anesvet-ui-bundle.css
├─ or-workspace-restructure.css
├─ START_HERE_TH.txt
├─ BUILD_SHA256.txt
├─ assets/
├─ docs/
│  ├─ releases/
│  ├─ architecture/
│  ├─ audits/
│  └─ retirement/
├─ qa/
│  ├─ current/
│  ├─ archive/
│  └─ evidence/
├─ src/
│  ├─ styles/
│  │  ├─ canonical/
│  │  └─ legacy-active/
│  └─ legacy-js/
└─ build/
   └─ history/
```

## Result
- top-level files: approximately **311 → 86**
- active runtime startup JS moved: **0**
- runtime stylesheet paths moved: **0**
- retired JS preserved: **13/13**
- bundle source CSS preserved: **38/38**
- historical QA preserved under archive
- historical release/architecture/audit documents preserved

## Future structure work
A later milestone may move active runtime JS into `src/runtime/` only after all dynamic imports, Service Worker paths, PWA update behavior and physical-device startup paths are regression-protected. V17.13.10 intentionally does not do that.
