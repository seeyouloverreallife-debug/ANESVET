# Known Limitations — ANESVET V16.18.3

1. **Real-device OR LIVE regression is still required.** Headless Chromium did not complete in the execution environment, so induction → airway → surgery → vitals → medications → emergence must be verified on actual Android/tablet/desktop PWA targets.
2. **`app.js` remains large (~4,350 lines).** Medication workspace, finalization/archive UI, backup/restore, report composition and several shared services remain pending extraction.
3. **The OR LIVE controller still depends on injected app services.** Fluid rendering, alert/problem services, medication workspace, timer persistence, Procedure Template state, Recovery transition and audit/event persistence remain app-owned services by design.
4. **Compatibility wrappers remain in `app.js`.** This is intentional to avoid a high-risk rewrite; they can be removed only after downstream consumers are moved to explicit controller/service APIs.
5. **Browser smoke remains BLOCKED/PENDING in this environment.** Static QA and targeted controller tests do not replace real-device PWA testing.
6. **Single-device/local-first limitations remain.** Final archive verification protects record integrity inside the current installation but is not external backup or multi-device sync.
7. **No authenticated multi-user identity/role system yet.** Existing actor/signoff fields remain attribution rather than centrally authenticated identities.
8. **Patient monitor values are still entered manually.** No hardware monitor bridge is included.
