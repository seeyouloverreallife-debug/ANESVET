# Migration — ANESVET V16.0 → V16.1

V16.1 is a presentation/UX update and does not require a data migration.

1. Replace deployed application files with the V16.1 package.
2. Keep existing browser/PWA storage; do not clear case data.
3. Reload with `?v=16.1.0` once if an older service-worker asset remains visible.
4. Confirm header shows `V16.1.0`.
5. On the real device, visually confirm OR LIVE and Recovery at the device's normal zoom level.

The service-worker cache name changed to `anesvet-v16-1-0-clinical-calm`, so updated assets can be installed without changing case storage keys.
