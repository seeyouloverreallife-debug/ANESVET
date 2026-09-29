# Known limitations — V16.16.0

1. Final Archive Assurance verifies consistency of the **local** locked current record and local Cases / Archive copy. It does not protect against device loss, browser-data clearing, filesystem failure, or OS reset. External Full Backup remains required.
2. Verification relies on the currently available archive backend. When IndexedDB is unavailable and ANESVET is using localStorage fallback, verification can confirm consistency of that fallback copy but cannot provide IndexedDB durability.
3. The explicit **Danger zone → Reset current case → type RESET** workflow remains an administrative/destructive override. It can intentionally clear a locked current record even if archive verification has not passed; this should only be used after preserving the record externally.
4. Verification may take longer with a very large local archive because ANESVET initializes/reads the archive store before checking the matching case.
5. Final checksum semantics remain the existing ANESVET clinical-payload checksum model; audit trail, archive timestamp, amendments/void metadata are governed separately and are not retroactively folded into the original locked clinical checksum.
6. Interactive Chromium smoke testing in this environment remains unavailable: Chromium hangs while opening the local app and times out. Static/runtime-source QA passes, but Android/iPad/Windows installed-PWA acceptance is still required before production deployment.
