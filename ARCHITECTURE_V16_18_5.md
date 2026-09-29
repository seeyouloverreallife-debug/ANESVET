# ANESVET V16.18.5 — Architecture Hardening Phase 9

## Goal
Continue incremental controller extraction without changing Final Lock, checksum, archive, amendment, VOID, report, or persisted clinical semantics.

## New ownership boundary

### `finalization-archive-controller.js`
Owns:
- final anesthetist / surgeon sign-off UI and bindings
- End Case readiness rendering
- medication-reconciliation gate handoff
- Final Lock transaction orchestration
- archive snapshot write
- Final Archive verification / retry bridge
- archive search/filter/rendering
- archived-record integrity check UI
- locked-record amendment flow
- locked-record VOID flow
- working-copy load/delete actions
- End Case / Archive DOM event bindings

It receives persistence, checksum, report-export, timer/wake-lock, audit, archive backend, and state services through dependency injection.

## Preserved boundaries
The following remain outside this controller:
- `case-runtime.js` clinical checksum payload definition and SHA-256 implementation
- `finalization.js` progressive End Case guidance / preferred-report workflow
- `final-archive-assurance.js` independent post-lock verification UX
- PDF report builders and archived report rendering
- backup / restore transaction logic
- IndexedDB initialization / migration logic

## Layer model
```text
Controller
├── patient-master-controller.js
├── preop-controller.js
├── or-live-controller.js
├── medication-workspace-controller.js
├── recovery-controller.js
├── finalization-archive-controller.js   ← new extraction
└── dose-reference-controller.js

App composition
└── app.js
    ├── case/procedure composition
    ├── protocol + Drug Library configuration
    ├── shared report/handoff builders
    ├── fluid/problem/alert services
    ├── backup/restore transaction + UI bridge
    └── controller dependency wiring
```

## Compatibility contract
Unchanged:
- `DB_VERSION = 2`
- Final Lock prerequisites
- medication reconciliation requirement before Final Lock
- unresolved alert / complication gate
- final sign-off semantics
- SHA-256 checksum payload/algorithm
- legacy FNV1A verification compatibility
- locked final records cannot be edited directly
- amendments append without modifying original clinical payload
- final records are VOIDed, not deleted
- working-copy archive behavior

## Next extraction sequence
1. Backup / Restore controller
2. Protocol / settings boundary if real-device regression remains stable
3. End Architecture Hardening with integration tests around controller → storage boundaries

Do not combine these extractions with major clinical behavior changes.
