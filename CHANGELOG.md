# Changelog

All notable changes to this project are documented here. Each release records the
upstream commit it tracks (see §10.10 / §17.3 of the requirements).

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
    `heading`, `list`, `blockquote`, `dl`, `image`
- `lib/utils.ts` (`cn()`)
- Token version: @digital-go-jp/tailwind-theme-plugin ^1.0.0 (dev-only)
- License / attribution: initial setup. Upstream attribution headers on all
  component files; `THIRD_PARTY_LICENSES.md` shipped with `theme` / `core`.
- Breaking changes: none (initial release).
