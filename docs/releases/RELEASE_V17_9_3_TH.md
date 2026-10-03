# ANESVET V17.9.3 — Workspace Ownership Consolidation

Added `workspace-owner.js` as the shared owner for cross-workspace reveal/focus behavior.

## Consolidated
- Focus/invalid auto-reveal now enters through one owner.
- Cross-layer `openForElement` coordinates Progressive Disclosure + Focused Recovery workspace.
- OR Workflow Status reveal routes through the owner.
- phone workspace class sync is owned by the shared workspace/viewport path.
- Adaptive Workspace no longer adds independent matchMedia change listeners; it follows `anesvet:viewportchange`.
- Progressive Disclosure and Progressive Clinical Flow now use the shared lifecycle ready helper.

## Preserved
Panel-specific toggles, Settings search/collapse controls, Recovery panel summaries, patient optional details, drug-support disclosure and clinical completion indicators remain in their specialized modules.

No clinical state, safety gate, medication, vital recording, OR/Recovery transition or finalization behavior is changed.
