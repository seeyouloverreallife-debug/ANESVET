# ANESVET V17.10.6 — Release Candidate / Runtime Hardening

No new clinical feature is introduced.

- Moves Workspace Owner earlier in the runtime order so V17.10 workflow controllers and mobile presentation use one disclosure/focus owner from startup.
- Mobile/OR Owner now safely tolerates an early runtime call before `document.body` exists.
- Mobile/OR sync returns its snapshot for deterministic smoke checks.
- Workspace presentation re-synchronizes after `pageshow` / BFCache restoration.
- Existing lifecycle, viewport, Patient, Pre-op, Drug Plan, OR LIVE, Recovery, End Case and Final Lock behavior is retained.
