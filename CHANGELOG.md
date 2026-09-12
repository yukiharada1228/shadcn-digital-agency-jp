# Changelog

All notable changes to this project are documented here. Each release records the
upstream commit it tracks (see §10.10 / §17.3 of the requirements).

## Unreleased

- Synced upstream: digital-go-jp/design-system-example-components-react@68b452e
  (was `2166f11`). No API or behavior change for any of the 44 ported
  components: upstream's commits in this range only touch Storybook docs pages
  (a DADS-site link added to nearly every `.stories.tsx`/`.mdx`), two
  story-only example tweaks (`Table`'s `SelectableTable` highlight CSS,
  `ModalDialog`'s `FixedWidth` placeholder copy), its own devDependency bumps,
  and the removal of the legacy `v1/Dialog` / `v1/Pagination` examples (never
  ported here, so no impact). Confirmed via a full local run — typecheck,
  lint, format, unit/a11y (610 tests), visual parity (92 tests), and browser
  a11y all pass unchanged.
- New component: `switch` (upstream `Switch`), with `SwitchOnOff` (single
  `role="switch"` button) and `SwitchMode` (two-option `role="switch"` toggle
  taking `leftLabel` / `rightLabel` / `value` / `onChange`). Both are
  non-controlled, presentation-only components — the caller owns
  `aria-checked` / `value` and passes `onClick` / `onChange`, matching
  upstream's own design. `aria-disabled` is intentionally not supported (typed
  out of `SwitchOnOffProps`), matching upstream.
- Not ported: upstream's new `PageNavigation` component (tracked separately in
  #42).

## v0.7.0

- Synced upstream: digital-go-jp/design-system-example-components-react@2166f11
  (was `22cda0d`).
- `breadcrumbs`: the trail is no longer a list. `BreadcrumbList` renders a `<p>`
  and `BreadcrumbItem` renders a `<span>` (upstream dropped `ol`/`li` so screen
  readers announce the trail as running text). The props of both now extend
  `<p>` / `<span>`, and their refs are `HTMLParagraphElement` /
  `HTMLSpanElement`. Breaking for consumers that styled or queried `ol`/`li`.
- `list`: renamed the spacing custom property from `--spacing` to
  `--list-spacing`. `--spacing` is Tailwind v4's own spacing scale variable, so
  the old name rescaled every spacing utility used inside a list — `p-4` inside
  a `spacing="12"` list resolved to 48px instead of 16px.
  `tests/visual/upstream-source-behavior.visual.spec.ts` now asserts this in the
  browser for both sources.

## v0.6.0

- Synced upstream: digital-go-jp/design-system-example-components-react@22cda0d
  (was `88110f7`).
- New component: `resource-list` (upstream `ResourceList`), with `Body` /
  `Control` / `Contents` / `Title` / `Label` / `Support` / `Sub` / `Action` /
  `ActionButton`. The selected-row styling and the whole-row click target are
  rebuilt on the Radix controls (`:has([data-state=checked]:enabled)` and a
  `::before` overlay instead of `:has(:checked)` and `<label for>`); see
  `docs/compatibility.md`.
- New component: `search-box` (upstream `SearchBox`), with `SearchBoxFields` /
  `SearchBoxSelect` / `SearchBoxInput` / `SearchBoxSubmit` / `SearchBoxDetail` /
  `SearchBoxDetailActions`. Ships `styles/digital-agency-search-box.css` as an
  optional import for `appearance: base-select` browsers, mirroring upstream's
  own progressive-enhancement split.
- New component: `step-navigation` (upstream `StepNavigation`), with
  `StepNavigationList` / `Step` / `StepHeader` / `Number` / `StateIndicator` /
  `Title` / `Description`. Supports both orientations, both sizes, the five
  step states, and `asChild` on the root and the step header.
- Upstream sync tooling:
  - Added the 20 missing `components-map.json` entries. Only 22 of the 42 ported
    components were mapped, and `scripts/map-upstream-changes.ts` silently
    reports unmapped components as unaffected, so upstream changes to them were
    never surfaced by `npm run diff:upstream` or the sync workflow.
  - `mapChanges()` now matches on directory boundaries: a change under
    `src/components/Table` no longer also resolves to `Tab` (`tabs`).
  - New `tests/unit/components-map.test.ts` enforces map coverage and path
    validity so a new component cannot be added without an entry.
- Components:
  - `checkbox`, `radio-group`: apply the disabled treatment to the native
    `disabled` state as well, not only `aria-disabled` (the Radix roots render
    a `<button disabled>`), including the forced-colors fallbacks.
  - `button`: add `gap-x-1` / `max-w-full` to the base style and drop
    `whitespace-nowrap`, matching upstream's centered, content-sized button.
  - `status-badge`: use the DADS `rounded-8` token instead of `rounded-lg`.
- Demo:
  - The demo page showed the stale component count (41) in its hero; it is 44.
  - The new sections pushed the whole page sideways: the horizontal step
    navigation is 320px per step and its grid item defaulted to
    `min-width: auto`, and the search box has a ~440px minimum. Fixed with
    `min-w-0` and a scroll container, and the smoke spec now asserts the
    document never exceeds the viewport width at 1440px and 390px.
  - Wrap the step navigation in a stacking context so its connector lines stay
    visible on a background (they are drawn at `z-index: -10`, as upstream).
- Tests:
  - Keyboard spec for the later ports (`search-box`, `step-navigation`,
    `resource-list`): focus order, visible focus indicators, `Space` on the
    resource-list control, and the details disclosure. The existing a11y spec
    only covered the first wave of components.
  - Narrow-viewport (375px) parity suite, so a layout that only breaks on small
    screens is caught against upstream.
  - New demo smoke spec: the real demo screen renders with no console errors,
    and the ported components work there (not just in the parity fixtures).
  - `checkbox`, `radio-group`: a checked + disabled control kept the
    `Highlight` border in forced-colors mode instead of `GrayText`, because the
    checked rule outranks the disabled one. Found by the new forced-colors
    parity suite.
  - New forced-colors parity suite comparing upstream and ours with
    `forced-colors: active`. Note `test.use({ forcedColors })` does not reach
    the media query in this setup, so the suite calls `page.emulateMedia()` and
    asserts the emulation is actually active.
  - CI now runs the upstream-vs-ours parity specs (`npm run
test:visual:parity`). Previously only the browser a11y spec ran, so none of
    the source-parity comparisons were enforced.
  - ResourceList fixtures cover radio rows, and the whole-row click test now
    covers the radio path.
  - New test asserting the optional `search-box` stylesheet actually reaches the
    select options.
  - The upstream-vs-ours pixel comparator now flags a per-channel difference
    above 12 instead of 51. At 51 a wrong background (`#f2f2f2` vs `#ffffff`)
    counted as zero differing pixels; all 47 parity stories pass at 12.
  - Source-parity fixtures now cover disabled (and disabled + checked)
    checkbox / radio states.
  - New upstream-vs-ours behavior test asserting the computed disabled
    border/background of both components.
- `Card` is out of scope by policy — see
  "Out of Scope: Upstream Example Collections" in `docs/compatibility.md`.

## v0.5.0

- Registry:
  - Split the Digital Agency-specific `cn()` utility from `theme` into the new
    `digital-agency-cn` registry item at `lib/digital-agency/cn.ts`.
  - Updated every component to depend on both `theme` and
    `digital-agency-cn`, and to import `cn()` from its registry-owned path.
  - Stopped distributing the generic `lib/utils.ts` path so installs cannot
    overwrite a consumer's existing utility module.
- Breaking changes:
  - The registry-owned `cn()` import path changed from `@/lib/utils` to
    `@/lib/digital-agency/cn`. Reinstalling a component adds the new dependency
    automatically; custom imports must be updated manually.

## v0.4.0

- Synced upstream: digital-go-jp/design-system-example-components-react@88110f7
  (was `f3046eb`).
- Components:
  - `input`, `textarea`: forbid the `placeholder` prop (`placeholder?: never`)
    to match the upstream accessibility guidance against placeholder text.
  - `list`: replace the grid/subgrid numbered-marker layout with the upstream
    padding + negative-margin approach for the `number` marker.
- Fixes:
  - `dialog`: ignore bubbled `cancel` events from nested file inputs so the
    dialog no longer closes unexpectedly.
  - `progress-indicator`: avoid ref writes during render.
- License / attribution: no changes required (upstream `LICENSE` unchanged;
  `license:check` passes).
- Breaking changes: `Input` / `Textarea` no longer accept `placeholder`. Provide
  an accessible label (`<Label>` or `aria-label`) instead.

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
