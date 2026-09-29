# Known Limitations — ANESVET V16.18.2

1. **Real-device Recovery regression is still required.** Headless Chromium did not complete in the execution environment, so the extracted Recovery controller must be verified on actual Android/tablet/desktop PWA targets.
2. **`app.js` remains large (~4,810 lines).** OR LIVE, medication workspace, finalization/archive UI and backup/restore composition remain pending extraction.
3. **Recovery handoff/report view-model helpers remain in `app.js`.** This is intentional because they are shared with Timeline/PDF reporting and were not duplicated into the controller.
4. **Recovery Controller still depends on injected app services.** Alert episode synchronization, audit/events, persistence, workflow locks, screen wake lock and handoff capture remain app-owned services.
5. **Single-device/local-first limitations remain.** Final archive verification protects record integrity inside the current installation but is not external backup or multi-device sync.
6. **No authenticated multi-user identity/role system yet.** Existing actor/signoff fields remain attribution rather than centrally authenticated identities.
7. **Patient monitor values are still entered manually.** No hardware monitor bridge is included.
