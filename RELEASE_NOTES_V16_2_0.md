# Release Notes — ANESVET V16.2.0
## Focused Clinical Workspace

V16.2 is a UX-structure release built on V16.1 Clinical Calm. It reduces repeated navigation and repeated case context, and converts Recovery into a more progressive, task-first workspace.

## Highlights

### 1. Single mobile navigation system
- At phone width (<=720 px), the global workflow tab strip is no longer shown in addition to the Mobile Quick Bar.
- Outside OR LIVE / Recovery, the Mobile Quick Bar is the primary phone navigation surface.
- The permanent Report button is removed from the phone quick bar to reduce crowding; reporting/support remains available through existing menus/help surfaces.

### 2. Smarter OR context
- `orStickyMini` is no longer visible at the top of OR LIVE when the full OR header is already on screen.
- After the full OR command header scrolls away, a compact patient / phase / case-time context bar appears automatically.
- This removes the previous duplicate “full header + mini case header” stack at page entry.

### 3. Workflow tracker on demand
- In focused phone/tablet OR mode, the detailed phase tracker is hidden by default because `NEXT CLINICAL STEP` already drives the active task.
- `MORE → Workflow status` reveals and opens the full phase tracker when needed.
- No phase-transition or safety-gate logic is changed.

### 4. Progressive Recovery workspace
- Recovery Observations stay open first.
- Recovery Checklist starts collapsed and shows a compact completion summary.
- Recovery Readiness Score starts collapsed for new V16.2 progressive-disclosure state.
- Recovery record history remains compact until requested.
- Existing More/Next-task actions reveal the target section before scroll/focus.

### 5. Active Recovery chrome reduction
- On phone, once Recovery is active, the large Recovery command header is hidden because the Recovery workspace + bottom dock already provide common actions.
- Before Recovery starts and after Recovery is complete, the command header remains available.

### 6. Desktop workflow position
- Desktop workflow steps receive visual `past / current / future` position states.
- These are navigation-position cues only; they do **not** represent clinical completion.

## Clinical / data behavior
No intentional change to:
- medication calculation
- drug dose reference
- clinical alert thresholds
- clinical validation rules
- medication safety / reconciliation
- finalization / Final Lock
- recovery readiness criteria
- storage schema

## Files added
- `focused-workspace.css`
- `focused-workspace.js`
- `UX_SYSTEM_V16_2.md`
- `MIGRATION_V16_1_TO_V16_2.md`
- `QA_V16_2_0.md`
