# ANESVET V17.10.5 — Full Workflow UX Regression & Cleanup

This release consolidates UX ownership after the V17.10 workflow simplification series.

## Fixed
- Retires the legacy Patient optional-details owner whenever the V17.10 Patient/Pre-op owner is present.
- Patient secondary fields now use the shared Workspace Owner for focus/invalid reveal.
- Focus-triggered Patient detail reveal is transient and no longer overwrites the user's saved open/closed preference.
- Workspace Owner now opens all closed ancestor `<details>` containers, not only the nearest one.
- Workspace Owner avoids forced scrolling while an input/soft keyboard is active.
- Pilot next-task navigation now delegates reveal/scroll behavior to Workspace Owner instead of independently centering panels.

## Preserved
Patient → Pre-op → Drug Plan → OR LIVE → Recovery → End Case, End Surgery confirmation/undo, Emergency Return, Calculated-as-Given, Geno V hospital preparations, Final Lock and archive verification.
