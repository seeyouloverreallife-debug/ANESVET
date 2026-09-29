# Known Limitations — ANESVET V16.22.0

1. **Descriptive, not causal.** Case Review counts documentation and recorded events; it does not determine whether an intervention caused an outcome or whether treatment was appropriate.
2. **No risk adjustment.** V16.22.0 does not adjust metrics for ASA status, emergency status, species, procedure complexity, anesthesia duration, comorbidity, or case mix.
3. **Alert counts depend on documentation and protocol.** A case with more recorded measurements may create more documented alert episodes; thresholds may also differ by frozen hospital protocol or case override.
4. **Older records may be less structured.** Archived cases created before some structured modules existed can show incomplete domains even when care occurred outside ANESVET.
5. **Working-copy metrics are not final records.** The dashboard defaults to non-voided Final Locked cases. If Working/All is selected, interpretation should remain documentation-focused.
6. **No external benchmarking.** The dashboard does not compare the hospital with published cohorts, other hospitals, or regulatory targets.
7. **No clinician ranking.** V16.22.0 intentionally does not rank, score, or compare individual staff members.
8. **Local dataset only.** The dashboard reviews archives available on the current ANESVET device/profile; it does not aggregate across multiple devices or cloud copies.
9. **CSV export is not a signed audit artifact.** The exported review CSV is a convenience report and is not part of Final Lock integrity.
10. **Real-device validation remains required.** Static/unit QA cannot prove long-session, orientation, keyboard, background, or force-close behavior on the actual hospital devices.
