# Known Limitations — ANESVET V16.20.0

1. Governance attribution is **not authenticated identity**. Reviewer/publisher names are entered by the user; Users/Roles/authenticated sign-off are planned for a later release.
2. The displayed protocol content fingerprint is a deterministic FNV-1a change label, not a cryptographic signature and not proof of authorship. Start/publish safety gates compare the canonical configuration payload itself, so they do not rely only on the 32-bit fingerprint.
3. A legacy locked V16.19.x protocol can be imported as PUBLISHED for continuity, but that migration does not constitute a new formal clinical review.
4. While a DRAFT or REVIEWED working protocol exists, new case start is intentionally blocked. This is conservative and may require hospitals to finish/discard protocol work before starting another case on that device.
5. Protocol governance is local-first. It is not synchronized between multiple devices; independently configured devices can have different registries.
6. V16.20 does not implement central approval, role-based permission, electronic signature, or remote policy deployment.
7. Procedure Templates remain a separate documentation/workflow template system and are not part of the Hospital Protocol Governance fingerprint in this release.
8. Existing active cases keep their frozen case protocol snapshot; publishing a new hospital protocol does not update a case already started.
9. Full Backup protects the registry using the whole-file SHA-256 manifest, but local registry data can still be lost if the device/browser profile is lost before an external backup is made.
10. Interactive browser/PWA smoke remains pending because system Chromium in the build environment times out with D-Bus/service-process errors. Actual Android/Windows/iPad acceptance remains required.
