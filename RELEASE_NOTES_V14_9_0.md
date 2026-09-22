# ANESVET V14.9.0 — Mobile/iPad OR Reliability

## Goal
Make OR LIVE practical on phones and iPad carried into the operating room, while preserving the V14.8.2 clinical workflow and clinical values.

## Added / changed
- Mobile-only bottom OR dock: **NEXT / RECORD / MEDS / FLUID / EVENT** with large touch targets.
- Sticky OR glance bar now includes **patient name + current body weight**, phase, case time and due state.
- Phone layout reduces nonessential chrome and keeps primary actions reachable by thumb.
- iPad/tablet layout increases touch target sizes and preserves a dense OR cockpit; landscape layout keeps vitals and secondary panels usable side by side.
- iPhone/iPad safe-area handling for the bottom dock and dialogs.
- Debounced autosave of structured case fields after edits.
- Active-case checkpoint save every 15 seconds while a case is active / recoverable.
- LocalStorage save now performs read-after-write verification before reporting **Saved locally**.
- Online/offline indicator explicitly states that OR documentation is **local-first** and continues saving offline.
- Existing Wake Lock behavior remains enabled by default during active anesthesia/recovery when supported.
- PWA/iOS standalone metadata added.

## Safety / scope
- No drug dose, concentration default, alert threshold, ASA logic, BOAS logic or clinical recommendation was changed.
- Current data keys remain unchanged for backward compatibility.
- IndexedDB current-case mirror and restore path remain intact.

## Validation
Static syntax/regression/workflow tests are run as part of this release. Browser/DOM tests are reported separately if the required test dependencies/runtime are unavailable.
