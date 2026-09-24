# ANESVET V15.11.0 — Mobile UI Simplification

## Goal
Reduce screen chrome on phones and iPads without changing anesthesia workflow or clinical safety rules.

## Changes
- Workflow tabs (`Patient / Pre-check / Drug Calculator / OR LIVE / Recovery / End Case`) are no longer sticky while scrolling.
- Main ANESVET header is substantially shorter on phone/iPad; low-priority header actions are hidden on touch layouts while save/timer state remains visible.
- Global `เพิ่มเติม / More` now shows only `Case Summary`, `Cases / Archive`, and `Settings` by default.
- Record/plan/trends/timeline/events/legacy monitoring move under collapsed `Records & advanced`.
- OR LIVE MORE no longer shows menu-profile text or a customize-settings shortcut; it remains phase-contextual.
- Recovery MORE hides the redundant Handoff shortcut (handoff remains in the Recovery page itself).
- No dose, threshold, risk, briefing, readiness, medication, recovery, storage, or audit logic changed.

## Compatibility
- Based on V15.10.2.
- Existing local data and cases remain compatible.
