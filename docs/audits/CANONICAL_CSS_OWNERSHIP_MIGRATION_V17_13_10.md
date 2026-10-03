# Canonical CSS Ownership Migration II — V17.13.10

## Source of truth
V17.13.9 package.

## Migration rule
This milestone uses declaration-preserving source migration. It does not reorder selectors, declarations, media queries or bundle chunks.

## Migrated sources
### 1. workflow-assist-presentation.css
Old identity: `usability-hardening.css`

- exact source bytes preserved from V17.13.9
- source moved to `src/styles/canonical/`
- active contracts retained: save assist, inline fix actions, actionable finalization blockers, return-to-case shortcut, mobile focus/scroll assists

SHA-256 source bytes retained from V17.13.9:
`dc6766da917dda950ae95b86d84a28492ccdd6e6096fa2943e0ab1aa1e883b44`

### 2. mobile-workspace-presentation.css
Old identity: `mobile-first-r27.css`

- exact source bytes preserved from V17.13.9
- source moved to `src/styles/canonical/`
- active contracts retained: mobile topbar, touch targets, mobile identity bridge, dialog sizing, keyboard-open state, responsive patient/workflow layout

SHA-256 source bytes retained from V17.13.9:
`2bf5de483284565c6b1007720de532e17172d2bad7a8e881e94a69d6f2acea0e`

## Bundle equivalence
`anesvet-ui-bundle.css` source-marker comments now use structured paths under `src/styles/`.

After normalizing only `/* === SOURCE: ... === */` marker comments, V17.13.10 bundle SHA-256 equals normalized V17.13.9 bundle:
`3c82d09a573a1992a91aa0508b8fe8d7a49e39dab84b5172d393e85f43ff8c2d`

Therefore CSS declaration content and cascade order are unchanged by this migration.

## Remaining debt
Legacy-active CSS source identities: **9**. These remain active visual dependencies and are not safe for blanket deletion.
