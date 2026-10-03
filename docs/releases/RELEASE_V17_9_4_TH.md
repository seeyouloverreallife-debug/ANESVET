# ANESVET V17.9.4 — Mobile / OR Rendering Consolidation

Added `mobile-or-owner.js` as the shared owner of mobile editing / virtual-keyboard presentation state.

## Consolidated
- one shared editing-target definition
- one shared keyboard-open calculation
- one owner for `anesvet-soft-keyboard`, `r27-keyboard-open`, `av-editing`
- one owner for keyboard offset / visual-height CSS variables
- Mobile First R27 no longer runs a second keyboard detector
- Mobile Design no longer schedules a shell render for viewport changes while editing
- Usability Hardening no longer refreshes on viewport changes while editing
- OR Speed Hardening retains fast-vital rail/navigation but delegates keyboard metrics to the owner

## Intended UX effect
Typing should not trigger competing mobile-shell / usability renders during IME resize. OR vital entry remains live, while the shell catches up after editing or a non-editing viewport transition.

End Surgery and all native OR/Recovery/medication actions remain delegated to their existing clinical controllers.
