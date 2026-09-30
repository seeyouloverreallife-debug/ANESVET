# Migration — ANESVET V17.2.3 → V17.2.4

## Data migration
None.

- `DB_VERSION` remains 2.
- `backupSchema` remains 3.
- Existing current case, archive, patient master, identity/PIN, protocol, recovery, medication and sync data are retained.
- Do not clear site/app data to install this hotfix.

## Runtime change
V17.2.4 changes the session interaction invariant so only an explicit VIEW ONLY state can block clinical controls. Transitional `initializing` state is no longer allowed to act as a global click shield. Session ownership is initialized before the interaction guard is bound.

## Recommended upgrade validation
1. Confirm header shows V17.2.4.
2. On a device with no active case, select ASA I–V and switch tabs.
3. Enter patient text, then use selects/buttons and save Patient Setup.
4. Start a test case and enter OR LIVE.
5. Return to Patient and resume OR LIVE.
6. Open the same app in a second tab on the same device and verify VIEW ONLY is explicit, with Take control available.
7. Do not Reset/Clear App Data as part of the test.
