# ANESVET V17.9.0 — Architecture Consolidation I

## Scope
V17.9.0 does not change the stabilized V17.8 clinical workflow.

### Shared lifecycle coordinator
Added `lifecycle-coordinator.js` as the single browser subscription point for:
- pageshow
- online / offline connectivity
- anesvet:data-safety-changed

Migrated presentation/support subscribers:
- Data Resilience health UI
- Simulation repaint / finalized-dialog patch
- Final Archive Assurance refresh
- Usability Hardening connectivity refresh

Critical save, session lock, active-case freshness, beforeunload/pagehide and clinical workflow listeners remain owned by their existing modules.

`viewport-coordinator.js` remains the single owner for resize/orientation/visualViewport changes.

This is intentionally conservative: historical UI hardening modules are not removed in bulk until their behavior can be replaced and regression-tested independently.
