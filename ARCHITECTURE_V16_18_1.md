# ANESVET V16.18.1 — Architecture Hardening Phase 5

## Goal
Continue the incremental extraction started in V16.18.0 without changing clinical rules or persisted data. This phase moves two DOM-heavy ownership areas out of `app.js`:

1. Patient Master controller/rendering
2. Pre-op structured examination/risk/checklist controller

The release deliberately avoids a broad rewrite.

## New ownership boundaries

### `patient-master-controller.js`
Owns Patient Master UI/controller behavior:
- Patient Master search and result rendering
- linked-patient banner and previous anesthesia history
- use/new/unlink patient interactions
- retire/restore/merge duplicate workflows
- Patient Master upsert from the current form
- ASA card presentation and Patient Save status
- patient-level allergy/comorbidity/precaution + structured-risk banner

It receives Patient Domain, Patient Master Orchestration, storage writes, date helpers and app callbacks through dependency injection. It does not own IndexedDB schema or anesthesia case state creation.

### `preop-controller.js`
Owns:
- structured pre-anesthetic physical examination UI
- structured anesthetic risk flags and BOAS detail UI
- save/review timestamps and audit callbacks
- Pre-op Done/N/A checklist interaction
- Pre-op physical exam and risk report HTML
- Pre-op navigation bindings

Clinical write permission, audit, save, OR render and workflow-lock behavior are injected from the app composition layer.

## Layer model after V16.18.1

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
├── patient-master-controller.js   ← new extraction
├── preop-controller.js            ← new extraction
├── dose-reference-controller.js
└── other feature controllers

App composition
└── app.js
    ├── age/breed registration helpers
    ├── case/procedure composition
    ├── OR LIVE controller/rendering
    ├── medication workspace integration
    ├── Recovery controller/rendering
    ├── Finalization/archive UI
    └── backup/restore UI
```

## `app.js` impact
V16.18.0: 5,319 lines  
V16.18.1: 5,064 lines  
Reduction: **255 lines** while preserving the existing IIFE composition model.

Line count is not the primary quality metric; the important change is explicit ownership of Patient Master and Pre-op UI behavior.

## Compatibility contract
Unchanged:
- `DB_VERSION = 2`
- Patient Domain and Patient Master Orchestration semantics
- dose calculations and medication safety
- alert thresholds and alert episode logic
- Recovery readiness/completion
- Documentation Guardian
- Final Lock prerequisites
- Final Archive Assurance checksum semantics
- V16.17 Production Pilot storage keys

## Next extraction sequence
After real-device regression of Patient Master and Pre-op:
1. Recovery controller
2. OR record/controller adapters
3. Medication workspace controller
4. Finalization + archive UI controller
5. Backup/restore UI boundary

Do not combine these extractions with major new clinical behavior in the same release.
