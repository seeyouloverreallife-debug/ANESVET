# UX System V16.5 — Hardening Rules

## Principle
Normal state stays quiet. Problems appear only when they require attention, and every actionable problem should offer the shortest safe route to resolution.

## Persistence feedback
- Saved + online: no extra banner.
- Offline: informational local-first banner.
- Dirty beyond expected autosave window: warning + retry.
- Save error: persistent danger + retry.

## Blockers
- A blocker must never bypass its clinical gate.
- If the app knows exactly where the missing item is edited, expose a direct-fix action.
- Direct-fix actions reveal collapsed UI before focusing the target.

## Active case orientation
- If an active case exists and the user navigates away from the active clinical workspace, expose a one-tap return path.
- Recovery phase always returns to Recovery; other active intraoperative phases return to OR LIVE.

## Mobile ergonomics
- Primary touch targets aim for >=44 px, with common workflow actions around 48–52 px.
- Fixed helpers must not overlap clinical docks or device safe areas.
- Keyboard focus uses scroll margins so inputs are not placed under fixed controls.
