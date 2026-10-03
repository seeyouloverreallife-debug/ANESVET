# Domains Dependency Audit — V17.13.18

## Scope
Audit startup positions 19–23 before changing their package paths.

## Audited modules
1. `pwa-controller.js`
2. `dose-reference-controller.js`
3. `patient-domain.js`
4. `or-domain.js`
5. `recovery-domain.js`

## Dependency findings
- `pwa-controller.js` depends on `ANESVET_APP_SHELL` and lifecycle-coordinator state, both loaded before position 19.
- Its default `./service-worker.js` URL is passed to `navigator.serviceWorker.register()` and remains document-relative; moving the script file does not change that registration base.
- `dose-reference-controller.js` depends on `ANESVET_APP_SHELL`, loaded at position 9.
- Patient, OR and Recovery domain modules expose pure domain helpers through their existing global boundaries.
- None of the five modules uses script-relative `fetch()`, dynamic `import()`, `new URL()`, `document.currentScript`, `import.meta`, `__dirname` or `__filename` behavior.

## Conclusion
The five modules form a safe contiguous startup boundary for a path-only migration, provided positions 19–23, Service Worker precache paths and global contracts remain unchanged.
