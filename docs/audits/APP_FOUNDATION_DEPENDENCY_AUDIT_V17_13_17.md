# App Foundation Dependency Audit — V17.13.17

## Scope
Complete the guarded migration of all 10 app-foundation startup modules.

## Canonical app-foundation layout
Startup positions 9–18 now live under `runtime/core/` in exact startup order:
1. app-shell
2. case-lifecycle
3. support
4. reliability
5. branding
6. clinical-validation
7. case-runtime
8. core-storage
9. session-coordination
10. session-controller

## Session pair closure
V17.13.17 moves positions 17–18 together after the dependency audit confirmed:
- app-shell precedes the session controller;
- session coordination precedes the session controller;
- both session files are path-insensitive;
- source bytes remain unchanged from V17.13.16.

## Safety conclusion
The app-foundation grouping is now complete. This release is a path/ownership migration only; persistence schema, IndexedDB behavior, checksum behavior, validation semantics, session semantics and clinical workflow contracts remain unchanged.
