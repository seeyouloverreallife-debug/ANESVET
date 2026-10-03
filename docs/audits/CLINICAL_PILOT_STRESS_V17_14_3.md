# ANESVET V17.14.3 — Clinical Pilot Simulation II: Stress & Edge Cases

## Purpose
Stress the current production runtime with deterministic software-level edge cases before changing clinical workflow or UX again. The goal is to expose data-integrity, recovery, session, persistence and finalization failures using production modules rather than jump shortcuts.

## Stress scenarios
The automated harness exercises production domain/controller/orchestration code across these failure modes:

1. **Long-case / high-volume monitoring proxy** — 720 serial OR vital records remain chronological.
2. **Vital duplicate protection** — an exact duplicate inside the 12-second guard is rejected; a clinically changed set is accepted; correction updates the targeted record and preserves immutable correction evidence.
3. **Medication repeat / retrospective / void** — near-duplicate administration requires explicit confirmation, confirmed repeat is retained, retrospective administration sorts chronologically, and void preserves the original administration while appending audit/event evidence.
4. **Repeated Emergency Return** — 10 Recovery → OR → Recovery cycles preserve the original recovery start and return to Recovery correctly; completion remains blocked while Emergency Return is active.
5. **Active-case freshness / session collision** — an external case change blocks a stale writer; a second fresh tab begins view-only, explicit takeover transfers ownership, and stale ownership can recover after TTL.
6. **Lifecycle freeze / BFCache** — freeze flush and persisted pageshow restore callbacks both execute.
7. **Large backup integrity** — a payload containing 1200 vital records, 200 events and 80 drug administrations passes payload and clinical-digest verification; one-field tampering is detected by both layers.
8. **Final Lock** — an eligible simulation seals once with checksum; a second finalize call is blocked by sealed-state write protection; unresolved alerts block finalization.

## Findings
- The full stress harness passes without a new clinical production-flow defect.
- Long-case data volume, repeated emergency transitions, duplicate/correction handling, medication audit preservation, session ownership and finalization guards remained coherent in deterministic execution.
- No change was made to dose calculation, route/concentration handling, alert thresholds, protocol snapshot behavior, persistence schema, induction semantics, intubation semantics or recovery criteria.

## Defect found and fixed
`production-pilot.js` still checked for the historical cache name `anesvet-v16-21-0`, even though V17.14.2 had already moved pilot version labels to current-build authority. This could produce a false Offline app cache warning on a correctly installed current build.

V17.14.3 adds `expectedCacheName()` derived from `AnesvetApp.version` and requires an exact current-generation cache match. The cache-readiness check is now version-consistent with the rest of Production Pilot evidence.

This is a pilot-readiness/diagnostic fix only. It does not change clinical case state or medication/vital workflow.

## Deterministic QA
`qa/current/QA_V17_14_3_STRESS_EDGE_CASES.js` covers the stress scenarios above and current-build Production Pilot cache authority.

## Scope limitation
This remains software-level deterministic simulation. The 720-record test is a **high-volume/long-case dataset proxy**, not a two-hour wall-clock device run. It does not prove Android/iPad/PWA touch ergonomics, IME behavior, screen-lock recovery, real browser rendering/frame rate, device thermal behavior, storage eviction or multi-hour memory stability. Those require physical-device qualification.
