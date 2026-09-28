# UX System V16.4 — Adaptive Workspace

## Goal
Use screen size to reduce cognitive load rather than simply enlarge cards.

## Breakpoints
- `< 760 px`: phone / Progressive Clinical Flow
- `760–1179 px`: tablet workspace
- `≥ 1180 px`: wide clinical workspace

## Principles
1. **Primary task owns the larger column.** Supporting/reference material moves to the smaller rail.
2. **Clinical order is preserved.** Visual placement must not imply a different safety gate or record sequence.
3. **One fixed action surface on tablet.** Avoid stacked navigation + clinical docks.
4. **Balanced vital scanning.** OR vitals use a 3 × 2 matrix on tablet/wide screens.
5. **Motion is feedback, not decoration.** Hover/press/save feedback is short and disabled with Reduce Motion.
6. **No presentation-driven data mutation.** Adaptive layout code may mirror state for accessibility/presentation only; it does not write clinical values.

## Wide-screen page model
### Patient
Core case form → main column
Patient identity/history + ASA context → support rail

### Pre-check
Physical examination → main column
Risk flags → support rail
Checklist → full width

### Medications
Frozen/actual case plan → main column
Quick presets/reference/emergency support → rail

### OR LIVE
Action/vitals/maintenance → main column
Medication queue/workflow/phase/watch context → rail

### Recovery
Recovery observations/history → main column
Handoff/problems/readiness score → rail
