# Known Limitations — V16.18.5

1. Real-device Production Pilot testing is still required. Static/controller tests do not prove Android/iPad lifecycle behavior during Final Lock → Archive → Verify.
2. Finalization/archive UI is controller-owned, while IndexedDB initialization, report rendering, and backup/restore remain app-owned. Those injected interfaces must remain synchronized during later refactors.
3. `finalization.js` and `final-archive-assurance.js` remain separate post-load workflow modules by design; V16.18.5 does not merge them into the controller.
4. Local Final Archive verification proves consistency of the local sealed/archived copies; it is not an external/off-device backup.
5. Browser smoke is BLOCKED/PENDING in the current sandbox because system Chromium times out with environment D-Bus/service-process errors. It is not counted as PASS.
6. ANESVET is not a continuous physiologic monitor and does not replace source-monitor data or clinical judgment.
