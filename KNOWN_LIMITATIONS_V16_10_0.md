# Known limitations — V16.10.0

1. Recovery Handoff quick summary is a documentation view; it does not replace clinician-to-clinician verbal handoff when that is required.
2. Recovery readiness score remains an internal documentation aid and is not a validated discharge score.
3. Mobile primary action is contextual, but MEDS and MORE remain fixed secondary actions to preserve muscle memory.
4. Full handoff details can still become long in complex cases; V16.10.0 keeps them collapsed by default rather than deleting clinical/audit detail.
5. Direct browser navigation to localhost/file:// is restricted in the build environment. Chromium smoke testing therefore uses injected runtime assets with an in-memory storage shim; installed PWA testing on the target Android device remains recommended.
6. No hospital-defined Recovery template editor is added in this release.
