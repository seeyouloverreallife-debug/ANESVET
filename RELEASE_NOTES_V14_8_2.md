# ANESVET V14.8.2 — Anesthetic Risk Flags

Build date: 2026-09-22  
Baseline: ANESVET V14.8.1 — Pre-anesthetic Physical Examination

## Added

- Structured **Anesthetic Risk Flags** in Pre-anesthetic Assessment.
- Separate flags for **Brachycephalic anatomy** and **Suspected / known BOAS**; the program does not diagnose BOAS from breed and does not auto-assign ASA.
- Contextual brachycephalic/BOAS detail section for stertor/snoring, stridor, exercise/heat intolerance, sleep-disordered breathing/collapse history, regurgitation/reflux, previous airway surgery, and previous difficult intubation/airway recovery events.
- Additional risk groups: aspiration/GI, cardiac, arrhythmia, respiratory reserve, dehydration/hypovolemia, anemia/bleeding, renal, hepatic, electrolyte/acid-base/metabolic, hypoglycemia, pediatric/neonatal, geriatric, obesity, pregnancy/peripartum, previous anesthetic event, emergency/critical context, and major hemorrhage/transfusion risk.
- Explicit **No additional risk flags identified** option so a zero-risk selection is distinguishable from an unreviewed form.
- **Save risk review & mark checklist Done** records reviewer, timestamp, audit event, and completes the new mandatory risk-review checklist item.
- Editing a recorded risk review invalidates the prior attestation timestamp until it is saved again.
- Structured risk flags are surfaced in the patient risk banner, Case Summary, OR LIVE, and PDF/print report.
- Airway-related flags receive stronger visual emphasis in OR LIVE without changing drug doses, thresholds, or treatment protocols.

## Safety behavior

- Risk flags are documentation/attention aids only.
- No automatic BOAS diagnosis based on breed.
- No automatic ASA assignment or escalation.
- No automatic drug/protocol/dose changes.
- No changes to alert thresholds, fluid references, recovery score, storage keys, or IndexedDB schema.

## Validation in this runtime

PASS:
- syntax + JSON
- source regression / storage contracts
- V14.7.2 UX compatibility static contracts
- V14.8 adaptive workflow static contracts
- V14.8.2 risk flag contracts
- production clinical helper tests (73 assertions)
- workflow model scenarios

NOT CLAIMED:
- jsdom/browser-dependent DOM integration tests because jsdom/fake-indexeddb are not installed in this runtime.

Clinical deployment should still be acceptance-tested on the hospital browser/device before production use.
