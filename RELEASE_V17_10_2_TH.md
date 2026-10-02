# ANESVET V17.10.2 — Drug Plan & Start Case Simplification

Adds a single Medication Next Step surface above the drug workflow.

- No confirmed Current BW → return to Patient; no default BW.
- No Case Drug Plan → delegates to existing From hospital protocol action.
- Existing plan not reviewed → delegates to native Save / Review plan.
- Reviewed plan → delegates to existing OR readiness / briefing gate.
- Active case → resumes OR LIVE.
- Frozen-plan provenance remains visible and unchanged.
- Controller does not Start Case, freeze protocol, administer medication, or bypass readiness itself.

Geno V hospital-specific Cefazolin/Convenia preparation profiles and Calculated-as-Given remain unchanged.
