# ANESVET V15.26.0 — Drug Dose Reference

## Goal
Add a species-, route-, and context-aware **Typical Dose Reference** for medications already present in ANESVET without allowing reference data to silently change the Hospital Protocol or medication calculations.

## New in V15.26.0

### 1. Read-only Typical Dose Reference
- Added `drug-dose-reference.js` as a dedicated read-only clinical reference module.
- Reference entries are separated by species, clinical context, dose/range and route.
- Reference values are display-only. They do **not** populate dose inputs, choose a midpoint, change concentration, change route, or participate in `safeMedicationCalculation()`.

### 2. Reference visible where medication decisions are made
Reference summaries are now shown in:
- Built-in Drug Calculator cards
- Frozen Case Drug Plan rows
- Hospital Drug Library settings
- Custom medication calculator metadata
- OR Quick Drug workspace
- Drug Administration confirmation dialog

Selecting a reference opens a detailed dialog with:
- patient species context
- relevant dose entries
- route / infusion context
- source label
- source-specific notes
- explicit `Reference ≠ Hospital Protocol` separation

### 3. Coverage
Reference mapping covers all currently shipped medication names/presets, including:
- Diazepam
- Propofol
- Tramadol
- Carprofen / Rimadyl
- Meloxicam / Metacam
- Cefazolin
- Cefovecin / Convenia
- Epinephrine / Adrenaline
- Atropine (bradycardia and CPR contexts)
- Dopamine CRI
- Midazolam
- Alfaxalone
- Ketamine
- Etomidate
- Ampicillin-sulbactam
- Clindamycin
- Methadone
- Buprenorphine
- Fentanyl
- Butorphanol
- Robenacoxib
- Amoxicillin-clavulanate

Alias mapping also handles the names used by existing built-in cards and frozen plans.

## Reference sources
Primary source:
- **BSAVA Small Animal Formulary, Part A: Canine and Feline, 10th edition**

Context-specific/current sources used when appropriate:
- **2024 RECOVER Guidelines** — CPR epinephrine and atropine / hemodynamically significant bradycardia context
- **ENOVAT surgical antimicrobial prophylaxis guideline** — cefazolin prophylaxis context
- **Merck Veterinary Manual** — selected injectable antimicrobial / emergency induction / analgesic references
- **AAFP Feline Anesthesia Guidelines** — selected feline induction references

The source used for each reference is shown in the dose-reference dialog.

## Important protocol behavior
V15.26.0 intentionally does **not** modify existing hospital defaults. Examples retained from V15.25.0 include:
- Propofol protocol dose: 4 mg/kg
- Tramadol protocol dose: 4 mg/kg
- Atropine bradycardia protocol dose: 0.02 mg/kg

A newer or different reference may therefore appear beside an existing protocol dose. This is intentional: the difference is surfaced for clinician/protocol review rather than silently migrated.

### Example: atropine
The program's existing hospital default remains 0.02 mg/kg for the bradycardia preset. The reference panel separately shows the RECOVER 2024 recommendation for hemodynamically significant bradycardia / prevention of CPA. The user/hospital must deliberately revise and re-lock the protocol if desired.

## Files changed
- `app.js`
- `index.html`
- `style.css`
- `manifest.webmanifest`
- `service-worker.js`
- `README_TH.md`

## Files added
- `drug-dose-reference.js`
- `RELEASE_NOTES_V15_26_0.md`
- `QA_V15_26_0.md`

## Clinical safety modules intentionally unchanged
The following files remain byte-identical to V15.25.0:
- `clinical-validation.js`
- `clinical-workflow.js`
- `medication-reconciliation.js`
- `finalization.js`
- `medication-safety.css`
- `medication-reconciliation.css`
- `finalization.css`

## Upgrade / cache
Service-worker cache key is now:
`anesvet-v15-26-0-drug-dose-reference`

Open once with `?v=15.26.0` or perform a hard refresh after deployment to ensure the new reference module is cached.
