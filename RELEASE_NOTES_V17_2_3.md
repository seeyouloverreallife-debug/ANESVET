# ANESVET V17.2.3 — Active Case State Repair

## Why this hotfix exists
A real Android/PWA case reproduced a contradictory persisted state after upgrade:
- the case had already started and an elapsed case clock remained available,
- the floating shortcut correctly recognized an active case,
- but the header still showed `SETUP`, Patient Setup showed `NOT SAVED`, and navigation back to OR LIVE failed.

V17.2.3 treats this as an active-case runtime/navigation consistency problem rather than an updater-only problem.

## Changes
1. Added `active-case-rescue.js`, a small provider-independent state repair helper.
2. If a case has concrete progress (`caseStartedAt`, running timer, or positive elapsed timer) but `casePhase` is still `setup`, runtime phase is repaired to generic `intraop`.
3. Existing recovery/completion evidence takes precedence and routes to Recovery/End Case rather than OR LIVE.
4. Patient Setup is **not** automatically marked saved. `NOT SAVED` remains visible for later review.
5. Missing current BW/name/HN/Visit/Species/Microchip may be filled only from the already-recorded frozen `caseIdentitySnapshot`, and only when the current field is blank.
6. Startup prioritizes an already-progressed active case over `patientSaved=false`, so an active anesthetic case resumes its clinical workspace instead of being trapped on Patient.
7. Added `resumeActiveCase()` with a direct DOM activation fallback after the normal navigation call.
8. If Identity is not actually locked, stale `inert` attributes are removed before clinical resume.
9. Restored open dialogs are closed before resume unless Identity is genuinely locked.
10. The floating Return shortcut now uses the rescue API and includes an Android PointerEvent coordinate fallback for cases where a restored top-layer/backdrop retargets the tap.
11. Service-worker cache/version advanced to V17.2.3 so the hotfix is fetched as a new application shell.

## Safety boundaries retained
- No dose calculation behavior changed.
- No medication administration semantics changed.
- `administeredBy` remains separate from `documentedBy`.
- No missing clinical action is inferred from missing documentation.
- Patient Setup is never silently marked saved by this repair.
- Recovery/Final Lock/Archive semantics are unchanged.
- `DB_VERSION = 2`.
- `backupSchema = 3`.

## Validation
- Active-case state rescue unit regression: 7/7 PASS.
- V17.1 Sync Foundation regression: 17/17 PASS.
- V17.2 Sync Safety regression: 19/19 PASS.
- V17.2.2 mobile updater/session rescue regression: 3/3 PASS.
- Static/package source QA: 32/32 PASS before packaging.
- Selected critical clinical/runtime parity: 18/18 byte-identical to V17.2.2.
- Real Android/PWA reproduction test remains required on the affected device.
