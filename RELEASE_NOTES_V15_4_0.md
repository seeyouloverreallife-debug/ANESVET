# ANESVET V15.4.0 — Recovery UX Release

Build date: 2026-09-23
Baseline: ANESVET V15.3.0 — Intraoperative Vitals & Timeline Release

## Goal
Make post-anesthetic Recovery usable on phones and iPad with the same interaction hierarchy as OR LIVE: the repeated task (recording recovery observations) is primary, while checklist, score, handoff, problems, completion, and emergency return remain accessible without competing for attention.

## Added / changed
- Added a **Recovery quick workspace** showing patient, recovery elapsed time, next-vitals due state, latest HR/RR/SpO₂/temperature/mentation, and readiness status.
- Added **COPY LAST** for recovery observations. It prefills the latest objective observations for review/editing but **does not create a new clinical record automatically**.
- Added a large **RECORD RECOVERY VITALS** action that reuses the existing guarded recovery-record path, including plausibility checks, alert synchronization, N/A rules, audit, and timeline updates.
- Added a mobile/iPad **Recovery dock**: `RECORD VITALS / MEDS / MORE`.
- Recovery `MORE` provides Checklist, Readiness score, Problems, Handoff, Event/Intervention, Complete Recovery, audited Undo, Emergency return to OR LIVE, and leave-focus navigation.
- On mobile/iPad, Recovery content is re-prioritized to: **Observations → Recovery records → Readiness score → Handoff → Problems**.
- Recovery readiness display now uses the same completion requirements as the completion guard, including at least **one saved Recovery Readiness Score**, preventing a misleading “ready” state before the score requirement is met.
- Mobile/iPad Recovery receives a dedicated focus layout and safe-area bottom spacing.

## Safety behavior preserved
- COPY LAST is a prefill helper only; the clinician must press Record.
- Medication shortcuts reuse the existing guarded Recovery medication workflow; no automatic administration is created.
- Recovery completion still supports documented override with required reason + responsible clinician when readiness is incomplete.
- Emergency return to OR LIVE and workflow Undo remain audited.
- No changes to drug dose defaults, concentrations, alert thresholds, ASA logic, BOAS logic, fluid references, or storage schema.

## Validation
PASS: syntax + JSON
PASS: source regression / storage contracts
PASS: V14.7.2 UX compatibility
PASS: V14.8 adaptive workflow contracts
PASS: V14.8.2 risk flags contracts
PASS: V14.9 mobile/iPad compatibility contracts
PASS: V15.0 Hospital Pilot safety contracts
PASS: V15.1 OR navigation contracts
PASS: V15.2 confirmation / Undo / vitals-priority contracts
PASS: V15.3 intraoperative vitals-first / timeline contracts
PASS: V15.4 Recovery UX / mobile focus contracts
PASS: clinical helper suite — 73 assertions
PASS: workflow model scenarios — 4 scenarios

Browser/DOM automation is **not claimed as passed** in this runtime because `jsdom/fake-indexeddb/Playwright` are not installed. Direct Chromium smoke execution also did not complete within the runtime timeout.
