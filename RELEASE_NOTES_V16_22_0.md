# ANESVET V16.22.0 — Case Review & Quality Dashboard

V16.22.0 adds a read-only Case Review dashboard to the Cases / Archive workspace. The release is intended to make existing anesthesia documentation easier to review across multiple archived cases without introducing automated clinical judgments.

## New Case Review dashboard
The dashboard can filter archived data by:
- date window: 30 days / 90 days / 12 months / all dates
- dataset: Final Locked / Voided / Working Copy / All archived
- species
- frozen hospital protocol version
- patient / HN / record ID / procedure text

## Descriptive metrics
The dashboard displays:
- number of cases in the current filter
- median recorded case elapsed time
- median Recovery duration
- percentage of cases with all displayed structured documentation domains complete
- documented physiologic alert episodes by category
- cases with structured complications
- Recovery completion overrides
- Problem → Intervention → Response documentation counts
- frozen protocol-version distribution

These values are descriptive documentation summaries. They are not clinician grades, clinical performance scores, causal conclusions, or determinations that care was appropriate/inappropriate.

## Case table and export
A recent-case review table shows the filtered archive records with procedure, protocol version, alert/complication counts, Recovery duration, and structured documentation-domain count. The current filtered dataset can be exported as CSV.

## Read-only design
`case-review-dashboard.js` receives archived cases through a deep-cloned read-only application bridge. It does not write clinical data or change Final Lock records.

## Compatibility
- IndexedDB `DB_VERSION = 2` unchanged.
- Full Backup `backupSchema = 3` unchanged.
- Existing clinical record schema unchanged.
- V16.21 Security Baseline remains intact.
- Existing Final Lock, Archive Assurance, medication, Recovery, alert, and dose behavior is unchanged.

## Validation status
Static and targeted regression QA pass in the build environment. Interactive real-device PWA validation remains necessary for Android/Windows/iPad production use.
