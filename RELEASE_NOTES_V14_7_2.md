# ANESVET V14.7.2 — Faster Induction & Medication Workflow

## Why this release

V14.7.1 reduced OR LIVE clutter, but real OR workflow still required dose entry at the exact moment of induction and made later medication entry too easy to miss. Recovery Handoff was also too verbose for rapid handoff.

## Changes

1. **One-tap Start Induction**
   - Starts/resumes case, freezes protocol and records the Induction milestone.
   - Does **not** force a medication dialog at that moment.

2. **Deferred multi-drug induction documentation**
   - Induction medications can be entered after airway stabilization.
   - Multiple agents/adjuncts can be saved in one review session (e.g. Diazepam + Propofol).
   - Each retrospective induction administration uses the Induction milestone as administration time and separately stores the documentation timestamp.
   - The OR bar shows `induction pending` until the medication review is explicitly completed.

3. **Medication access throughout the case**
   - Persistent `MEDS` button in OR LIVE after case start.
   - Medication button in Recovery.
   - Uses the existing frozen protocol/current BW medication calculation and structured administration audit.

4. **Compact Recovery Handoff**
   - Six visible cards: anesthesia duration/extubation, airway, latest vitals, fluids/loss, medications and open problems.
   - Full handoff text and immutable transfer snapshots remain available under collapsed details.
   - Recovery command bar is shown before the handoff summary.

## Compatibility

- Existing `anesvet_v14_3_*` storage keys retained.
- IndexedDB remains `ANESVET_DB` version 2.
- No clinical dose, concentration default, alert threshold, fluid reference or recovery score changed.
- Existing V14.7.1 cases with an `OR Induction` medication remain treated as reviewed unless they were started under the new deferred-documentation mode.

## Validation in this runtime

PASS:
- `node tests/syntax.mjs`
- `node tests/regression.mjs`
- `node tests/workflow_scenarios.mjs`
- `node tests/clinical_workflow.mjs`

BLOCKED / NOT CLAIMED:
- jsdom DOM integration: dependency installation timed out.
- Native Chromium origin/browser E2E: environment policy returned `ERR_BLOCKED_BY_ADMINISTRATOR` for localhost/file navigation.
- PWA update/offline and PDF pagination therefore require acceptance testing on the deployment machine.
