# Known Limitations — V16.8.4

- Medication queue timing is **phase-aware**, not a medication scheduling engine. It uses the frozen plan phase (`pre`, `induction`, `post`) and does not infer an exact administration time.
- `NEEDS REVIEW` means the planned item lacks a matching Actual administration record for the current/earlier phase; it does not prove the drug was not administered.
- `LATER` is a display grouping only. The clinician can still open and document the medication manually if it was actually administered.
- Final medication reconciliation remains the source of truth before Final Lock.
- Static/syntax and isolated phase-semantic tests are included. Mobile PWA visual acceptance should still be performed on the actual Android device after update because browser safe-area/system-bar behavior is device-specific.
