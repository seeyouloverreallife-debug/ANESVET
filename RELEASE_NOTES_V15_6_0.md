# ANESVET V15.6.0 — Drug Administration & Recovery Transition Release

## Why this release
V15.5 introduced a frozen Case Drug Plan, but real mobile/iPad testing exposed friction during medication documentation: users were returned to OR LIVE after each administration, some medications without complete route/concentration defaults could not be documented, planned induction medications still required repetitive entry, OR full-screen could visually remain on OR LIVE after starting Recovery, and the Vitals saved confirmation could sit under fixed OR controls.

## What changed

### 1. Continuous medication workspace
- Saving one medication no longer closes the medication dialog for ordinary OR or Recovery medication entry.
- The workspace remains open so the next medication can be selected immediately.
- Added an always-visible top-right close button and sticky action footer for mobile/iPad.
- `Done / back` returns to the clinical screen when medication entry is complete.

### 2. Planned induction batch administration
- Added `Record all planned induction meds`.
- Planned induction drugs from the frozen Case Drug Plan are displayed together.
- `Use calculated amounts` fills calculated planned volumes where a valid calculation exists.
- Actual mL, route and preparation/concentration remain editable before confirmation.
- Already-recorded induction drugs are shown as completed and are not duplicated by the batch workflow.
- Batch confirmation records actual administrations; being in the plan alone never means a drug was administered.

### 3. Route and preparation entry improvements
- Added touch-friendly quick route choices: IV, IM, SC, PO, IV/IO and CRI, while retaining free-text entry for other routes.
- Added concentration/preparation presets when available from the frozen protocol/drug library plus `Manual / other concentration`.
- Manual Hospital Drug Library and Case Drug Plan items remain available in OR medication entry.
- A missing calculated volume no longer disables medication documentation. The user may record actual mL after explicitly entering route and preparation/concentration.
- No new clinical concentrations were invented by the application.

### 4. Recovery transition / Full Screen bug fix
- Navigating away from OR LIVE now exits OR-specific full-screen presentation state.
- Native browser fullscreen is also exited when possible.
- Full-screen CSS only forces OR LIVE visible when OR LIVE is actually the active tab.
- Starting Recovery now opens the Recovery page and gives explicit `Recovery mode opened` feedback.

### 5. Vitals saved feedback visibility
- `✓ SAVED` feedback is now fixed above OR chrome with a high z-index and safe-area-aware positioning.
- It can no longer be hidden underneath the bottom action dock.

## Safety / compatibility
- No dose defaults, ASA logic, BOAS logic, alert thresholds, fluid references or recovery readiness rules were changed.
- Calculated dose/volume remains a reference; actual administration still requires explicit confirmation.
- Manual medication documentation requires actual amount, route, administered-by and preparation/concentration.
- Existing V15.0–V15.5 safety contracts remain in place.

## Tests
Passed in this runtime:
- JavaScript / JSON syntax
- full static regression suite including V15.0–V15.5 compatibility contracts
- V15.6 Drug Administration / Recovery Transition contracts
- clinical helper suite: 73 assertions
- workflow model scenarios: 4 scenarios

Not claimed in this runtime:
- DOM/browser automated suites requiring `jsdom`, `fake-indexeddb` or Playwright (dependency unavailable here)
