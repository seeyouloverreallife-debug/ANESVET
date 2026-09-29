# Architecture — ANESVET V16.22.0 Case Review & Quality Dashboard

## Release intent
V16.22.0 adds a read-only descriptive review layer over archived anesthesia records. It does not create or modify clinical records, alter dose calculations, change alert thresholds, change Recovery readiness, or alter Final Lock / Archive Assurance rules.

## New module: `case-review-dashboard.js`
The module reads archived-case clones through `AnesvetApp.caseReview.archives()` and builds aggregate review models from existing documentation.

It provides:
- final/voided/working/all archive dataset filters
- 30-day / 90-day / 12-month / all-date review windows
- species, protocol-version, and free-text filters
- median recorded case elapsed time
- median documented Recovery duration
- descriptive alert-episode counts by MAP / SpO₂ / ETCO₂ / Temperature category
- Documentation Guardian domain completeness summaries
- Problem → Intervention → Response documentation counts
- frozen protocol-version usage
- Recovery completion-override count
- recent case-review table
- CSV export of the currently filtered review dataset

## Read-only boundary
The dashboard does not receive a clinical write API. `AnesvetApp.caseReview.archives()` returns a deep clone of the in-memory archive dataset. The module does not reference `save()`, IndexedDB write methods, audit writers, medication actions, Final Lock actions, or protocol mutators.

## Existing modules reused for interpretation
When available, V16.22.0 reuses the existing read-only semantics from:
- `documentation-guardian.js` for structured documentation domains
- `problem-response-review.js` for Problem → Intervention → Response models
- `medication-reconciliation.js` for reconciliation completion

Fallback calculations are descriptive only and do not change archived records.

## Archive refresh
The existing `renderArchives()` wrapper dispatches `anesvet:archive-changed` after archive rendering. The dashboard listens for this event and refreshes its aggregate view.

## Persisted schema
- IndexedDB `DB_VERSION = 2` unchanged.
- Full backup `backupSchema = 3` unchanged.
- Clinical record schema unchanged.
- No Case Review metric is written into the clinical record or Final Lock checksum.

## Interpretation boundary
The dashboard reports documentation patterns, not clinical quality grades. Alert counts depend on what was documented and on the configured/frozen alert protocol. Differences between cases can reflect case mix, duration, monitoring/documentation frequency, protocol versions, or workflow changes. V16.22.0 does not infer causality or treatment effectiveness.
