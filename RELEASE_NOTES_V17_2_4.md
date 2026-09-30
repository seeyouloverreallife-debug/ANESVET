# ANESVET V17.2.4 — Global Interaction Gate Repair

## Why this hotfix exists
A real-device report on iPad showed that a fresh device with no running case could type into text fields but could not activate ASA cards or most buttons/navigation. This falsified the earlier assumption that the defect was limited to active-case restoration.

Source review identified a global interaction-gate failure mode:

1. `SESSION_CONTROLLER.bind()` installed capture-phase interaction guards while session mode was still `initializing`.
2. The old guard blocked any mode that was not `active`; therefore `initializing` behaved like `VIEW ONLY`.
3. `initSessionCoordination()` ran only near the end of startup, after asynchronous sync/IndexedDB hydration.
4. If startup was delayed or interrupted before session initialization, buttons/selects/actions could remain globally blocked. Text fields could still appear editable because preventing the later `input` event does not revert text already entered.

## Changes
- Initialize session ownership before binding the global interaction guard.
- Interaction guard now blocks only explicit `mode === "view"`.
- `render()` applies `session-readonly` only for explicit view-only state.
- Session `init()` is idempotent.
- Failed initialization without a fresh competing writer lock recovers to local active control instead of leaving a silent frozen UI.
- If a fresh competing writer lock exists, failure remains explicit VIEW ONLY.
- Add `beforeinput` and keyboard/change protection for true view-only mode.
- Service-worker cache and asset query version bumped to V17.2.4.

## Not changed
- Dose calculations
- Medication administration/reconciliation semantics
- OR alert thresholds/classification
- Recovery readiness/completion rules
- Documentation Guardian
- Final Sign-off / Final Lock / Archive Assurance
- Database schema and backup schema

## Production validation
Static/unit regression is PASS. Real iPad/Android validation remains required; this release should not be considered device-validated until the reported devices can select ASA, navigate tabs, and resume OR LIVE normally.
