# ANESVET configuration

## runtime-map.json
Machine-readable path/load-order contract introduced in V17.13.11.

It records:
- 69 startup JavaScript modules in exact `index.html` order;
- 5 `platform-foundation` startup modules under `runtime/platform/`;
- 3 `clinical-foundation` startup modules under `runtime/clinical/`;
- all 10 `app-foundation` startup modules under `runtime/core/`;
- 5 `domains` startup modules under `runtime/domains/`;
- 3 `orchestration` startup modules under `runtime/orchestration/`;
- remaining 43 startup modules at package root;
- 7 lazy Clinical Knowledge / ECG modules under `runtime/knowledge/`;
- current production CSS and icon paths;
- semantic runtime groups and proposed future directories.

Runtime policy in V17.14.6:
- keep the proven static `<script defer>` startup model;
- preserve exact startup order while paths move group-by-group;
- Service Worker must precache all 69 startup + 7 lazy modules at their current paths;
- future path moves must update path manifest + index/lazy loader + Service Worker + current QA in the same release.
