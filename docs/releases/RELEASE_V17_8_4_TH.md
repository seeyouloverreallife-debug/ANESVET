# ANESVET V17.8.4 — Recovery Simplification

## Core Recovery surface
Default Recovery now prioritizes:
1. Recovery focus / latest observations / Record vitals
2. Compact Recovery Handoff
3. Unresolved alerts / problems
4. Recovery observations
5. Recovery checklist / readiness

## Progressive disclosure
Supporting documentation is preserved under `Recovery details`:
- recovery trends
- post-anesthetic medication reconciliation
- Recovery Readiness Score
- full recovery vital-sign record history
- transfer / ward handoff

The compact Handoff remains visible in the core surface. Its existing `Open handoff details` control still exposes full medication, timeline, handoff note, text and snapshots.

## Safety / behavior
No recovery criteria, emergency return, recovery-complete guard, medication recording, problem tracking, handoff derivation, state mutation, audit or finalization behavior was removed.
This release changes presentation hierarchy only.
