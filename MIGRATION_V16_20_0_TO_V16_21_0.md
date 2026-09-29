# Migration — V16.20.0 → V16.21.0

## Automatic compatibility
No IndexedDB migration is required.

- `DB_VERSION` remains 2.
- Full Backup schema remains 3.
- Existing current case, archive, Patient Master, Hospital Protocol Governance and Data Safety metadata remain compatible.

## Security activation
V16.21 does **not** automatically lock an existing V16.20 installation.

After upgrade:
1. Open **Settings → Staff Identity & Local Security**.
2. Enter the first local Administrator name.
3. Create a numeric 6–12 digit PIN and confirm it.
4. Select **Enable local security**.
5. Add other staff profiles as needed.
6. Set the background lock interval.

After local security has been enabled, future app reloads/restarts require staff PIN unlock.

## Existing cases
Existing working and archived clinical records are not rewritten during upgrade. New authenticated metadata is added only to new audit/sign-off actions performed after security is enabled.

Already locked/checksummed cases are not modified.

## Full Backup / Restore
The V16.21 local security credential registry is intentionally not included in Full Backup / Restore. Restoring a clinical backup to another browser/device therefore requires separate local staff enrollment on that device.

## Rollback to V16.20
V16.20 does not understand or enforce the V16.21 local security registry. If the app files are rolled back, the V16.21 security metadata can remain in localStorage but is ignored by V16.20.

Do not treat rollback as a security-preserving workflow.
