# ANESVET V16.18.2 — Architecture Hardening Phase 6

## Goal
Continue the incremental extraction sequence without changing Recovery clinical rules or persisted data. This phase moves Recovery UI/controller ownership out of `app.js` into a dedicated controller while keeping the existing Recovery Domain and Recovery Orchestration modules unchanged.

## New ownership boundary

### `recovery-controller.js`
Owns the DOM/controller workflow for:
- Recovery start / complete UI actions
- automatic transition after extubation
- emergency return to OR and return-to-Recovery UI flow
- Recovery readiness presentation
- Recovery checklist + N/A interactions
- serial Recovery vital records
- Recovery score entry/history
- Recovery due reminder UI
- Recovery 2.0 trend cards
- post-anesthetic medication review presentation
- transfer / ward handoff snapshot UI
- mobile Recovery dock / More dialog bindings

The controller receives existing domain/orchestration logic and app services through dependency injection. It does not define a new readiness score, medication rule, alert threshold, archive rule, or database schema.

## Layer model after V16.18.2

```text
Browser / shell
├── app-shell.js
├── pwa-controller.js
├── session-controller.js
└── architecture-registry.js

Core
├── case-runtime.js
├── case-lifecycle.js
├── core-storage.js
└── session-coordination.js

Domain
├── patient-domain.js
├── or-domain.js
└── recovery-domain.js

Orchestration
├── patient-master-orchestration.js
├── or-record-orchestration.js
└── recovery-orchestration.js

Controller
├── patient-master-controller.js
├── preop-controller.js
├── recovery-controller.js      ← new extraction
└── dose-reference-controller.js

App composition
└── app.js
    ├── age/breed registration helpers
    ├── case/procedure composition
    ├── OR LIVE controller/rendering
    ├── medication workspace integration
    ├── shared Recovery handoff/report view-model helpers
    ├── finalization/archive UI
    └── backup/restore UI
```

## `app.js` impact
V16.18.1: 5,064 lines  
V16.18.2: 4,810 lines  
Reduction: **254 lines** without rewriting Recovery Domain/Orchestration.

The shared Recovery handoff/report builder remains in `app.js` because it is consumed by Recovery UI, Timeline and PDF/report generation. It is injected into the Recovery Controller rather than duplicated.

## Compatibility contract
Unchanged:
- `DB_VERSION = 2`
- Recovery readiness/completion semantics
- Recovery score semantics
- Recovery vital record schema
- medication administration/reconciliation semantics
- alert thresholds and alert episode logic
- Documentation Guardian
- Problem → Intervention → Response review
- Final Lock prerequisites
- Final Archive Assurance checksum semantics
- V16.17 Production Pilot storage keys

## Next extraction sequence
After real-device regression of Recovery:
1. OR LIVE controller/adapters
2. Medication workspace controller
3. Finalization + archive UI controller
4. Backup/restore UI boundary

Do not combine these extractions with major new clinical behavior in the same release.
