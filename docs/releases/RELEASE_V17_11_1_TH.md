# ANESVET V17.11.1 — Induction Timestamp + Prepared Drug Quick Taps

## Workflow
- **Induction** remains its own workflow timestamp.
- Pressing Induction does **not** mark any medication as administered.
- After Induction, OR LIVE shows only medications from the frozen Case Drug Plan whose phase is `induction`.
- Each prepared induction medication is a separate quick button.

## Medication time
- The administration timestamp is captured **when that drug button is tapped**.
- It is no longer assumed that every induction drug was given at the Induction milestone time.
- If the frozen plan has a complete calculated volume + route + concentration + anesthetist, tapping records it immediately using **Calculated-as-Given**.
- If required preparation information is incomplete, ANESVET captures the tap time first, then opens the existing medication editor. Saving later preserves the captured tap time.

## Safety
- Only frozen planned `induction` medications appear in this quick set.
- Buttons are disabled until Induction has started.
- Already documented drugs are shown as Given with their actual clock time and cannot be silently recorded twice from the quick strip.
- Existing medication audit/void workflow remains authoritative.
- Intubation remains timestamp-only and does not open Airway/Support forms.

No changes to End Surgery, Emergency Return, Recovery, Final Lock, or archive verification.
