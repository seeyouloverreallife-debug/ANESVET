# ANESVET V17.14.5 — UX ownership map

## Scope
Ownership map for the physical-pilot UX fixes introduced after V17.14.4. Clinical calculation and persistence ownership remain unchanged.

## OR ventilation
- Authoritative ventilation state / select: existing OR workflow state in `index.html` + production OR model.
- Physical mobile mode strip presentation and direct button binding: `or-workspace-restructure.js`.
- Vent strip styling/touch target: `assets/css/or-workspace-restructure.css`.
- Contract: selecting Spontaneous / Manual PPV / Mechanical must update authoritative state; no dose or monitoring state mutation.

## Medication workspace
- Medication workspace / actual administration editor: `runtime/controllers/medication-workspace-controller.js`.
- Current-phase queue presentation: `runtime/controllers/or-live-controller.js`.
- Tramadol SC site default: built-in plan defaults in `app.js` plus legacy/frozen blank-route fallback in `medication-workspace-controller.js`.
- Standby/emergency drugs: excluded from automatic next/quick suggestions unless the context is explicitly emergency; retained in All medications/manual selection.

## Mobile shell and keyboard
- Canonical mobile presentation: `src/styles/canonical/mobile-design.css` bundled into `assets/css/anesvet-ui-bundle.css`.
- Mobile state owner remains `runtime/platform/mobile-or-owner.js`.
- V17.14.5 contract: bottom action dock remains visible while editing; it may compact but must not disappear solely because an input has focus.

## Undo / audit safety
- Workflow transition undo: existing `orLastTransition`/`orUndoStepBtn` path; V17.14.5 changes mobile visibility only.
- Vital/drug correction: existing correction/void audit trail remains authoritative. V17.14.5 does not add destructive undo for clinical records.

## Recovery
- Recovery state/criteria/controller: `runtime/controllers/recovery-controller.js`.
- V17.14.5 primary ordering: Observations → Vital records → Recovery Score → Checklist.
- Score values remain backed by existing select fields/calculation semantics.
- Tap controls 0/1/2/N/A are presentation/input helpers that dispatch through the existing select/change path.
- Mobile recovery presentation: `src/styles/canonical/mobile-design.css`.

## Physical-device evidence
- User-provided V17.14.4 screenshots/feedback are the acceptance basis for this release.
- Automated QA protects the new source contracts.
- The V17.14.5 artifact still requires re-validation on the same physical device before claiming physical acceptance.
