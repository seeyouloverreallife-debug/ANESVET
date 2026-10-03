# ANESVET V17.14.2 — Clinical Pilot Simulation I

## Purpose
Validate the current production workflow with deterministic software-level simulation before making further clinical UX changes. The pilot uses production controller/domain code for state transitions and clinical classification; browser/device surfaces are mocked only where needed to execute deterministically.

## Simulated workflow
Routine canine anesthesia was walked without using Simulation Mode jump shortcuts:

1. Start case / induction
2. Prepared Diazepam + Propofol become Given / details pending
3. Intubation timestamp
4. Surgery start / intra-operative phase
5. Record complete vital set
6. Record MAP 45 mmHg — classified danger by the frozen protocol
7. Record an actual intra-operative Cefazolin administration while induction details remain pending
8. Record MAP 72 mmHg — classified good
9. End Surgery / emergence
10. Extubation / Recovery
11. Recovery readiness with complete evidence
12. Emergency Return blocks completion
13. Normal recovery completion produces casePhase=complete

## Findings
- No new production clinical-flow regression was found in the deterministic routine/hypotension/recovery path.
- Event order remained coherent: Case started → Induction → Intubation → Surgery start → Surgery end → Extubation.
- Prepared induction medications retained deferred-detail behavior.
- MAP 45 and MAP 72 were classified through production protocol logic as danger and good respectively.
- Recovery gating correctly blocks completion while Emergency Return is active.
- Production transition audit evidence remained present.

## Bugs found in pilot infrastructure
Three testing/qualification surfaces carried stale hard-coded build versions:
- Simulation Mode: V17.3.1
- Production Pilot: V16.21.0
- Validation Center: V16.21.0

V17.14.2 makes all three read the current application version through `AnesvetApp.version`, with a V17.14.2 fallback. Production Pilot readiness and Validation Center active runs are also scoped to the current build, so stale qualification evidence is not presented as evidence for a newer build. Existing storage keys are preserved.

## Deterministic QA
`qa/current/QA_V17_14_2_CLINICAL_PILOT_SIMULATION.js` covers the production-controller pilot, recovery gating, build-scoped evidence authority, scenario availability and simulation sandboxing.

## Scope limitation
This is software-level deterministic simulation. It does **not** prove physical Android/iPad/PWA behavior, IME/touch interactions, screen-lock recovery, browser rendering, frame rate, long-duration memory use, storage eviction or real operating-room ergonomics. Those require physical-device qualification.

## Release-generation mismatch found during hardening
The final full-suite pass found 78 V17.14.1 references still present in `index.html` while the application core, manifest and Service Worker were already V17.14.2. This could produce mixed cache-busting generations and misleading visible build labels. All active index references were aligned to V17.14.2, then the complete QA set was rerun successfully.
