# ANESVET V17.13.1 — Presentation Ownership Map

This release establishes one canonical presentation owner per primary workflow surface.

| Surface | Canonical owner | Legacy behavior |
| --- | --- | --- |
| Patient | `patient-preop-v17130` | progressive patient-detail layout must delegate |
| Pre-op | `patient-preop-v17130` | no secondary owner may reorder the page |
| Drug Plan | `drug-start-v17130` | legacy layers may decorate, not own the workflow layout |
| OR LIVE | `or-workspace-v17130` | legacy `clinical-simplicity` OR reordering is retired |
| Recovery | `recovery-end-v17130` | recovery refinement remains the canonical presentation layer |

The ownership registry is presentation-only. It does not modify clinical state, drug calculations, thresholds, safety gates, persistence, or audit semantics.
