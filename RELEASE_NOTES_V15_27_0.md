# ANESVET V15.27.0 — Protocol Review & Dose Conflict

## Purpose
V15.27.0 adds a read-only protocol review layer that compares the currently configured Hospital Protocol and saved Drug Library doses with the dose-reference dataset already loaded in V15.26.0.

The review engine does **not** change a dose, route, concentration, formula, or protocol automatically. Its role is to identify configurations that deserve clinician review.

## New: Protocol Dose Review
The Settings page now contains a **Protocol Dose Review** panel.

For each supported species/context, ANESVET can report:

- **WITHIN PRIMARY** — the configured dose and route are supported by the primary loaded reference context.
- **SUPPORTED — CHECK CONTEXT** — the configured dose is supported by another loaded reference context, but not the primary context shown for that protocol item.
- **OUTSIDE LOADED REFERENCE** — the configured direct dose is outside all comparable dose segments loaded for that drug/species/route.
- **ROUTE MISMATCH** — comparable dose information exists, but the configured route is not represented by the loaded reference segments.
- **NOT COMPARABLE** — the protocol uses a formula or dose form that should not be converted into a direct mg/kg or mcg/kg comparison automatically (for example legacy BW ÷ factor formulas or rate-vs-bolus mismatches).
- **NO REFERENCE** — no matching loaded dose-reference record is available.
- **DOSE NOT SET** — no direct dose is currently configured for comparison.

The labels are deliberately conservative. A status other than WITHIN PRIMARY is not treated as an automatic prescribing error.

## Species-aware review
Built-in protocol checks are evaluated separately where dog and cat reference contexts differ.

Blank user Drug Library dose rows are not counted as review conflicts, preventing unused placeholder rows from cluttering the review.

## Review sign-off
A clinician can mark the current configuration as reviewed by recording:

- reviewer name/initials
- review note when a warning or context-check item exists
- timestamp
- current reference version
- review-engine version
- protocol version
- configuration fingerprint

The review cannot be signed off while unsaved Hospital Settings / Drug Library changes are visible. Save the configuration first, then review the persisted values.

## Changed Since Review
The stored sign-off is tied to a fingerprint of the reviewed dose/route/formula configuration.

If a relevant configuration changes later, the review panel automatically changes to **CHANGED SINCE REVIEW**. The previous sign-off remains in history but is no longer treated as current for the modified configuration.

## Protocol Lock integration
Locking a protocol whose current configuration does not have a matching current review produces an explicit warning.

ANESVET does not hard-block the clinician from locking. If the clinician proceeds, the event is recorded separately in the audit trail as `PROTOCOL_LOCK_WITH_UNREVIEWED_DOSE_CHECK`, followed by the normal protocol-lock audit.

## Audit events
New events include:

- `PROTOCOL_DOSE_REVIEWED`
- `PROTOCOL_LOCK_WITH_UNREVIEWED_DOSE_CHECK`

## Safety boundaries
V15.27.0 does not:

- modify Hospital Protocol doses automatically
- select a midpoint from a reference range
- change route or concentration
- convert non-comparable formulas into guessed mg/kg values
- replace clinician judgment

The dose-reference dataset itself is unchanged from V15.26.0.

## Unchanged clinical modules
The following files are byte-identical to V15.26.0:

- `clinical-validation.js`
- `clinical-workflow.js`
- `medication-reconciliation.js`
- `finalization.js`
- `drug-dose-reference.js`

Medication calculations, ETT formulas/tables, finalization, medication reconciliation, and the loaded dose references were not changed by this release.
