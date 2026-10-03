# Session Ownership Migration — V17.13.17

## Scope
Migrate the app-foundation session ownership pair from package root to `runtime/core/` without changing session semantics.

## Moved modules
Startup positions 17–18 remain unchanged:
- `session-coordination.js` → `runtime/core/session-coordination.js`
- `session-controller.js` → `runtime/core/session-controller.js`

## Dependency evidence
- `session-controller.js` explicitly requires `ANESVET_APP_SHELL`.
- `session-controller.js` explicitly requires `ANESVET_SESSION_COORDINATION`.
- `session-coordination.js` remains before `session-controller.js` in startup order.
- Both modules contain no relative fetch/import/new-URL/currentScript dependency that would change behavior after a directory move.

## Session safety preserved
- localStorage shared lock ownership remains unchanged.
- sessionStorage tab identity remains unchanged.
- BroadcastChannel takeover/heartbeat coordination remains unchanged.
- stale owner `verifyOwnership()` demotion remains unchanged.
- VIEW ONLY interaction blocking remains unchanged.
- `pageshow` wake verification and orphaned-session recovery remain unchanged.

## Source preservation
The two moved source files are byte-identical to V17.13.16:
- session-coordination SHA-256: `f1d15a074b7aaebeab12868bfe3d81e7e88eb7545a24c8dc7a586cab87b0f7db`
- session-controller SHA-256: `f9ff0ead81e99d68f314dd98f4df1e1f2ecf9f856b58e839f113d9f191c9f51d`

## Conclusion
V17.13.17 completes app-foundation grouping: startup positions 9–18 now live under `runtime/core/`. No session lock, takeover, persistence, clinical workflow, medication calculation, alert threshold, recovery, End Surgery, Emergency Return or Final Lock semantics were intentionally changed.
