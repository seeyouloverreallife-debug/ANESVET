# Domains Ownership Migration — V17.13.18

## Moved modules
Startup positions 19–23 remain unchanged:
- `pwa-controller.js` → `runtime/domains/pwa-controller.js`
- `dose-reference-controller.js` → `runtime/domains/dose-reference-controller.js`
- `patient-domain.js` → `runtime/domains/patient-domain.js`
- `or-domain.js` → `runtime/domains/or-domain.js`
- `recovery-domain.js` → `runtime/domains/recovery-domain.js`

## Source preservation
- Dose-reference, Patient, OR and Recovery sources are byte-identical to V17.13.17.
- PWA controller differs only in its release comment stamp (`17.13.17` → `17.13.18`).

## Preserved contracts
- PWA safe-update checkpoint flow and `updateViaCache:'none'` registration remain unchanged.
- Dose reference remains a presentation/reference boundary and does not become an administration/calculation owner.
- Patient identity/history helpers remain unchanged.
- OR duplicate-vital/signature/alert helpers remain unchanged.
- Recovery scoring/readiness/trend helpers remain unchanged.
- No clinical dose, alert threshold, persistence schema, Induction/Intubation, End Surgery, Emergency Return, Recovery or Final Lock behavior was intentionally changed.

## Release hardening finding
During final verification, the asset query versions had been bumped to 17.13.18 while the Service Worker cache generation string was still `anesvet-v17-13-17-startup`. The cache generation and inherited QA assertions were corrected to `anesvet-v17-13-18-startup`, then the complete regression suite was rerun. This prevents a new release from reusing the prior startup cache namespace.
