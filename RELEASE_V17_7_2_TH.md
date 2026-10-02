# ANESVET V17.7.2 — Startup / Installed PWA Identity Hardening

## Root cause addressed
- HTML first paint was already the new dark ANESVET startup, but the installed-PWA manifest still launched with `v=17.5.3`.
- Android native splash is generated from manifest background/theme + installed icon, not from the HTML boot screen.
- The manifest icons and HTML startup logo are now generated from the same `assets/startup/logo.png` identity source.

## Changes
- `start_url` updated to `./?launch=home&v=17.7.2`.
- Manifest background/theme remain `#0b2d31`, matching critical first-paint HTML.
- `icon-192.png` and `icon-512.png` regenerated from the startup logo.
- `icon-maskable-512.png` regenerated with safe-zone padding on the same dark background.
- Startup logo/glow are preloaded before the external UI stylesheet.
- Service-worker/cache version moved to V17.7.2.

## Important Android note
An already-installed PWA may retain its old OS-generated splash/icon until Android refreshes the Web App Manifest; in some launchers this can require reinstalling the PWA. The in-page HTML startup does not require reinstall once the new service worker/assets are active.
