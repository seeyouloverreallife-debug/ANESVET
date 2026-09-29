# ANESVET V16.17.0 — Production Pilot & Real-device Reliability

## Goal
V16.17.0 intentionally pauses new clinical features and adds a **device-specific production-pilot harness** so ANESVET can be tested systematically on the actual Android phone/tablet, iPad and Windows PWA used in the operating room.

This release is technical/reliability instrumentation only. It does **not** change anesthesia calculations, medication semantics, alert thresholds, Recovery readiness, Final Lock requirements, archive checksum semantics, or the clinical state schema.

## What changed

### 1. Production Pilot panel in Settings
A new **Production Pilot — Real-device Reliability** panel provides:
- automated device readiness checks;
- a persistent real-device acceptance matrix;
- a lightweight lifecycle evidence log;
- exportable pilot diagnostics;
- device-local reset for pilot results only.

Pilot results are intentionally stored separately from clinical case data.

### 2. Stronger device readiness checks
The new readiness run tests or reports:
- localStorage temporary write/read;
- actual IndexedDB temporary write/read (not only API presence);
- browser storage quota/headroom;
- persistent-storage grant status;
- service-worker registration/controller status;
- V16.17 offline cache visibility;
- page-level horizontal overflow;
- retained runtime errors;
- current-case local-save freshness;
- safety checkpoint / IndexedDB current mirror availability for a mutable case;
- Final Archive Assurance state when the current case is Final Locked.

A warning is not converted into a clinical block. The panel is an acceptance/testing aid.

### 3. Real-device acceptance matrix
Eleven required scenarios are included:
1. routine case → Final Lock → VERIFIED → New case;
2. background/screen lock ≥5 min;
3. background ≥30 min;
4. force close/browser kill → reopen;
5. offline documentation → reconnect;
6. duplicate-tab/session takeover guard;
7. deferred PWA update during mutable current case;
8. Recovery → handoff → complete → Final Lock;
9. verified backup + test restore;
10. long-case endurance ≥2 h;
11. portrait/landscape + soft keyboard.

Archive-failure/retry testing is included as an optional twelfth scenario because forcing a real storage failure may not be practical on every device.

Each scenario can be marked `Not run`, `PASS`, `FAIL` or `BLOCKED`, with a local note and timestamp.

### 4. Lifecycle evidence log
V16.17 records a small technical ring buffer for events such as:
- visibility hidden / visible;
- pagehide / pageshow;
- freeze / resume where supported;
- online / offline;
- orientation change;
- Fast Vitals save;
- medication-administration change event.

The lifecycle log stores technical case state only (phase, locked state, save age and record counts). It does **not** store patient name, HN, microchip or owner information.

### 5. Pilot export added to diagnostics
`Export diagnostics` now embeds the V16.17 Production Pilot snapshot when available. The dedicated **Export pilot report** button exports the acceptance matrix, readiness checks, lifecycle evidence and device context as JSON.

## Compatibility / safety boundary
Unchanged:
- IndexedDB `DB_VERSION = 2`;
- existing current/archive clinical payload schema;
- dose calculations;
- medication confirmation / reconciliation;
- alert thresholds and clinical alert behavior;
- Recovery readiness and completion criteria;
- Documentation Guardian semantics;
- Problem → Intervention → Response semantics;
- Final Lock prerequisites;
- Final Archive Assurance checksum model.

No clinical-data migration is required.
