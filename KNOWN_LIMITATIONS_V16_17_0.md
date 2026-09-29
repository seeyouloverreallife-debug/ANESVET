# Known limitations — V16.17.0

1. **Production Pilot is an evidence/acceptance harness, not automated certification.** Manual scenarios must be observed on each device model / browser / installed-PWA configuration actually used in the OR.
2. The app cannot safely automate destructive scenarios such as force-closing the browser, rebooting the device, clearing storage, or forcing an archive failure. Those scenarios remain manual.
3. Browser `navigator.onLine` is only a connectivity hint. Offline/reconnect acceptance still requires observing actual ANESVET behavior on the target device.
4. Persistent-storage requests remain browser/OS controlled. A `Not persistent` warning does not mean current saving has failed; it means site data may be more vulnerable to eviction under storage pressure.
5. Lifecycle evidence is a small local ring buffer and is not a forensic audit trail. Clinical audit remains the case audit trail / Final Lock record.
6. Production-pilot results are **device-local** and are intentionally not restored as clinical data on another device. Export the pilot report if results need to be retained externally.
7. V16.17 does not add remote/cloud backup. Final Archive Assurance still protects local-copy consistency only; Full Backup remains required against device/browser loss.
8. Multi-device real-time sync is not introduced. Existing session coordination protects multiple tabs on the same browser/device only.
9. Interactive Chromium smoke testing in this development environment remains unavailable: headless Chromium starts but never completes page loading and times out. No browser-smoke PASS is claimed from this environment.
10. Long-case endurance (≥2 h), Android/iPad background suspension, PWA update deferral and real soft-keyboard behavior must be tested on physical devices because desktop/headless simulation is not representative of mobile OS lifecycle behavior.
