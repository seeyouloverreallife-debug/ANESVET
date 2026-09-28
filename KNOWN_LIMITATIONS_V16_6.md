# KNOWN LIMITATIONS — V16.6 RC1

1. ANESVET remains local-first/browser-storage based; it is not yet a centralized multi-device hospital database.
2. True service-worker update/install lifecycle cannot be validated in the current build environment; hospital-device acceptance is required.
3. Storage quota/eviction behavior varies by browser/OS and needs device testing.
4. Session coordination protects against ordinary two-tab overwrite, but it is not a network/distributed locking system.
5. Clinical reference information and decision-support do not replace source monitor data or veterinarian clinical judgment.
6. V16.6 intentionally does not add new drug doses, alert thresholds, clinical recommendations, or automated treatment decisions.
