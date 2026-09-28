# V15.29 → V16.0 migration note

V16.0 does **not** reset the ANESVET database or change the core browser storage keys.

The new Unified Case Timeline is derived from existing case collections (`records`, `events`, `drugAdministrations`, `alertEpisodes`, `complications`, `recoveryRecords`, and selected audit entries). It does not rewrite archived case payloads simply to create a timeline.

Recommended deployment check:

1. Back up ANESVET data before replacing the deployed build.
2. Deploy the V16.0 files over the existing app files.
3. Open once with `?v=16.0.0` if the PWA/browser still serves the old service-worker cache.
4. Confirm one existing working case and one archived case can be opened.
5. Verify Timeline → Focus / Full timeline and Full Anesthesia Record export on the target device.
