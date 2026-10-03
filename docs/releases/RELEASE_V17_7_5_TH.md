# ANESVET V17.7.5 — Geno V Medication Profile Hardening

- OR LIVE medication queue now labels hospital-specific medications as `Geno V Pet Care protocol`.
- Medication workspace shows hospital-protocol provenance beside the frozen protocol/BW context.
- Frozen Case Drug Plan explicitly preserves `hospitalProtocol` and structured `preparation`.
- Cefazolin remains Geno V 1000 mg vial + sterile water 4 mL → 250 mg/mL, BW ÷ 10 mL, IV default.
- Convenia remains Geno V 80 mg/mL, BW ÷ 10 mL, SC default.
- These values are not added to the general drug-dose reference.
- Existing preparation-missing safety remains active for all medications that genuinely lack concentration/preparation.
