# Changelog

All notable changes to this project are documented here. Each release records the
upstream commit it tracks (see §10.10 / §17.3 of the requirements).

## v0.3.0

- Synced upstream: digital-go-jp/design-system-example-components-react@f3046eb
- Registry items:
  - Added the remaining upstream-inspired UI components, bringing the registry
    to all 41 supported `registry:ui` components.
  - Added `all-components`, an installable block that copies every component
    plus a full-page usage demo.
  - Kept renamed registry item `description-list` as the canonical shadcn item
    name for the upstream description list component.
- Compatibility:
  - Documented intentional API / DOM differences in `docs/compatibility.md`.
  - Added parity coverage for Radix-backed and story-extracted components.
- Testing:
  - Added full unit, a11y, browser a11y, and Playwright visual parity coverage.
  - Updated `vitest` to `^3.2.7` to remove the vulnerable Vitest 2 / Vite 5 /
    esbuild 0.21 development dependency chain.
- Maintenance:
  - Ignore local `.claude/` settings so machine-local agent permissions are not
    accidentally committed.
- Breaking changes: none.

## v0.2.0

- Synced upstream: digital-go-jp/design-system-example-components-react@f3046eb
- Registry items (Phase 2 — form & status):
  - `form` (form/status grouping)
  - `checkbox`, `radio-group`, `select` (Radix primitives)
  - `error-text`, `support-text`, `requirement-badge`, `status-badge`,
    `chip-label`
- Dependencies: `@radix-ui/react-checkbox`, `@radix-ui/react-radio-group`,
  `@radix-ui/react-select`
- License / attribution: upstream attribution headers on all new component
  files; `THIRD_PARTY_LICENSES.md` shipped with `form`. No changes required.
- Breaking changes: none.

## v0.1.0

- Synced upstream: digital-go-jp/design-system-example-components-react@f3046eb
- Registry & license foundation:
  - `registry.json` generated from `src/registry/items/*.json`
  - `LICENSE`, `NOTICE`, `THIRD_PARTY_LICENSES.md`
  - upstream added as a read-only Git submodule under `upstream/`
- Registry items:
  - `theme` (generated `digital-agency.css` + `digital-agency.tokens.json`)
  - `core` (basic UI grouping)
  - `button`, `input`, `textarea`, `label`, `divider`, `link`, `utility-link`,
    `heading`, `list`, `blockquote`, `description-list`, `image`
- `lib/utils.ts` (`cn()`)
- Token version: @digital-go-jp/tailwind-theme-plugin ^1.0.0 (dev-only)
- License / attribution: initial setup. Upstream attribution headers on all
  component files; `THIRD_PARTY_LICENSES.md` shipped with `theme` / `core`.
- Breaking changes: none (initial release).
