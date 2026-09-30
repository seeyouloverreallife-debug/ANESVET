# R21 QA — V17.2.25

- Focused controller/bridge tests: **20/20 PASS**
- Regression suites: **26/26 PASS**
- JavaScript syntax: **162/162 PASS**
- Duplicate HTML ids: **0**
- Missing Service Worker asset references: **0**
- Version/cache/manifest consistency: **True**
- Previous files unchanged: **695/701**
- Previously existing files modified: **6** — index.html, recovery-controller.js, manifest.webmanifest, service-worker.js, or-live-controller.js, app.js

## Browser E2E
Playwright Chromium was attempted with local HTTP. `Page.goto` returned `net::ERR_BLOCKED_BY_ADMINISTRATOR`. **Browser E2E NOT VERIFIED**.

## Static direct-call audit
Analyzed direct function calls in `app.js` using Acorn AST (local development tool). Previous missing names `closeRecoveryMoreDialog`, `closeOrMoreDialog`, `recoveryTransferLatest` are now declared bridge functions. Remaining matches were `getComputedStyle` (browser global) and `migrateV3` (local function argument). This does not guarantee that all runtime paths are error-free.

## Notes
No backend/clinical safety validation or physical device acceptance in this QA run. Only use on mock cases until signed off on actual devices.
