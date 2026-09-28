# ANESVET V16.2 — Focused Clinical Workspace UX System

## Purpose
V16.2 continues the V16.1 Clinical Calm visual language by reducing repeated navigation, repeated case context, and long always-open recovery sections. The goal is to make the active clinical task occupy most of the screen while retaining fast access to secondary information.

## Principles
1. **One navigation system per screen size** — on phones, workflow tabs are replaced by the existing bottom quick navigation. OR LIVE and Recovery keep their dedicated clinical docks.
2. **Context appears when needed** — OR LIVE shows the full case header at the top, then a compact context bar only after the full header scrolls away.
3. **Current task first** — routine workflow overview is secondary to the next clinical action.
4. **Progressive recovery** — observations are open first; checklist, readiness score, and record history remain compact until needed.
5. **Reveal before focus** — when an existing shortcut or “next task” targets a collapsed section, ANESVET opens that section before scrolling/focusing it.
6. **No clinical behavior changes** — no dose, threshold, readiness rule, safety gate, data model, or finalization logic is changed by this release.

## Mobile navigation
- Global 6-step tab strip is hidden at <=720 px.
- Existing Mobile Quick Bar becomes the single navigation surface outside OR/Recovery.
- Report remains available from workflow/help surfaces; it no longer consumes a permanent slot in the phone quick bar.
- Case context remains compact and sticky outside focused OR/Recovery modes.

## OR LIVE
- Full OR command header remains the primary context at page entry.
- The compact OR context bar is hidden while the full header is visible.
- Once the header scrolls away, compact patient / phase / case-time context appears without taking permanent space at the top of the page.
- The detailed workflow tracker is hidden in focused mobile mode and can be opened from `MORE → Workflow status`.
- Vitals, medications, alerts, and existing clinical actions are unchanged.

## Recovery
- When Recovery is active on phone, the large command header is removed from the working view because its common actions already exist in the quick workspace and Recovery dock.
- Recovery Observations are open by default.
- Recovery Checklist is collapsed by default and displays a completion summary.
- Recovery Readiness Score and Recovery record history retain progressive disclosure; score starts collapsed for new V16.2 UI state.
- Existing shortcuts open a collapsed target before scrolling to it.

## Responsive intent
- Phone: task-focused single-column workspace, one navigation surface, floating clinical dock.
- Tablet: focused OR/Recovery modes remain compact; no horizontal overflow.
- Desktop: workflow stepper stays visible and shows past/current/future position without marking prior steps as clinically complete.
