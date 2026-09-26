# ANESVET V15.28.0 — Resilient Autosave & OR Performance

## Goal
Reduce OR/mobile typing latency and unnecessary synchronous storage writes without weakening data durability or changing clinical logic.

## Changes

### 1. Debounced continuous-input persistence
V15.27 called the full `save()` path from `updateDashboard()` on every generic field input, while also scheduling the existing 450 ms autosave. V15.28 allows continuous-input callers to render immediately with `persist:false` and performs one debounced save after the user pauses.

### 2. Critical actions remain immediate
The save path used by vital recording, medication administration, phase/workflow transitions, recovery actions and finalization remains synchronous/immediate at the action boundary.

### 3. Exit/background flush
Pending state is flushed immediately on `visibilitychange` to hidden, `pagehide`, and active-case `beforeunload`. This preserves the latest draft if the mobile app is backgrounded before the 450 ms debounce expires.

### 4. High-frequency draft fields
Continuous numeric/text editing was changed to debounced persistence for:
- airway numeric/text inputs
- drug calculator / concentration text-number inputs
- fluid balance and actual total
- recovery vital/text inputs
- recovery score free-text input

Selects and explicit discrete decisions continue to save immediately where the previous workflow did so.

### 5. Reset / New Case stale-write race fixed
V15.27 could leave a pending autosave or IndexedDB mirror timer alive when `resetCurrent()` created a blank case. In the race window, the old on-screen values could be sampled after Reset and written back over the fresh state.

V15.28 now:
- cancels pending autosave before Reset
- cancels pending current-case mirror writes before Reset
- refuses `save()` while reset navigation is in progress
- prevents queued mirror callbacks from writing during Reset

This closes the reproduced case where old patient/form data returned shortly after New/Reset.

## Clinical scope
No changes to drug dose values, dose-reference dataset, alert thresholds, clinical validation formulas, medication reconciliation, finalization, or protocol-review classification.

## Compatibility
Current-case key, safety-checkpoint key, archive schema and IndexedDB schema remain unchanged. Existing V15.27 data can be opened without migration.
