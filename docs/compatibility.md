# Compatibility Policy

This project is an unofficial shadcn/ui-native reimplementation of selected
components from `digital-go-jp/design-system-example-components-react`.

The goal is not byte-for-byte source compatibility. The compatibility target is
explicitly split into the levels below.

## Compatibility Levels

1. Visual/token parity: local components should use the same Digital Agency
   Design System token classes, sizing, focus treatment, disabled treatment, and
   error treatment as the upstream component where practical.
2. API parity: upstream prop names and state flags are preserved when they fit
   the shadcn/ui component model. Examples include `size`, `blockSize`,
   `isError`, `aria-disabled`, `asChild`, `captionStyle`, and `fullWidth`.
3. DOM parity: native DOM shape is preserved only for components where doing so
   does not conflict with shadcn/ui conventions or the selected primitive.
4. Documented divergence: components backed by Radix primitives, or components
   intentionally reshaped for shadcn/ui, must document the incompatible API/DOM
   surface and must have parity tests for the supported compatibility contract.

## Radixized Components

`Button` keeps the upstream `asChild` pattern and visual variants, but adds the
shadcn-friendly `solid` alias and default `variant="solid"` / `size="md"`.
The upstream variant name `solid-fill` remains supported.

`Select` is intentionally not a native `<select>`. Upstream uses a
native select element; this project exposes a Radix Select compound API:
`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and `SelectItem`.
The supported upstream-compatible props are on `SelectTrigger`: `blockSize`,
`isError`, `aria-disabled`, and normal ARIA attributes. Native `<option>`
children are not a compatibility target. The trigger defaults to content width;
use `className="w-full"` to stretch it. Radix sizes this from the selected value,
whereas a native select may reserve space for its widest option. The trigger
keeps an SVG arrow so it remains visible in forced-colors mode.

`Checkbox` is intentionally not an `<input type="checkbox">`. It is a Radix
Checkbox root that renders as an interactive element with `role="checkbox"`.
The supported upstream-compatible props are `size`, `isError`, `aria-disabled`,
`checked`, `defaultChecked`, and `onCheckedChange`. Upstream's optional
`children` label API is not supported; compose labels explicitly with local
layout or `Label`.

`RadioGroup` replaces upstream's standalone `Radio` input component with the
Radix `RadioGroup` / `RadioGroupItem` model. `RadioGroupItem` preserves the
visual props `size`, `isError`, and `aria-disabled`, but the upstream direct
`Radio` component and `children` label API are not compatibility targets.

`ResourceList` keeps the upstream composition and DOM, but its selection model
is rebuilt on the Radix controls. Upstream reads the selected row with
`:has(:checked)` and makes the row clickable with a `<label for>` inside the
title; neither works against a Radix `<button role="checkbox">`. This project
instead selects on `:has([data-state=checked]:enabled)` and renders
`ResourceListControl` as a `div` whose control child carries a `::before`
overlay — positioned against the control by default, and against the whole row
when the list has `interaction="whole"`. Consumers therefore put plain text in
`ResourceListTitle` rather than a `<label for>`. The disabled treatment is
unchanged, because `:disabled` matches the Radix button. `aria-disabled` is
supported alongside it.

## Other Intentional API Reshaping

`Image` is split for shadcn-style composition. Upstream exports `Image` as the
`figure` wrapper. This project exports `Image` as the `img` element and exposes
`ImageFigure`, `ImageArea`, `ImageAreaLink`, and `ImageCaption` for the upstream
figure structure.

`Calendar` is based on the upstream Storybook composition rather than an
upstream exported component. Upstream composes React Aria calendar primitives
directly inside `Calendar.stories.tsx`; this project exposes shadcn-style
wrappers for those primitives. `CalendarButton` and `CalendarHeading` are local
wrapper exports so registry demos can compose calendar navigation without
importing `react-aria-components` directly. The visual contract remains the
upstream grid, header, and cell token classes.

## October 2026 Upstream Sync

The pinned upstream is `e637c6820a8ceb5b1c28719e3260afdab89c2b57`.
Upstream now targets React 19 and accepts `ref` as a regular prop. This registry
continues to support React 18 and 19, retaining `forwardRef` for existing
components. The ref targets and interactions remain unchanged.

Upstream consolidated `Label`, `Legend`, `RequirementBadge`, `StatusBadge`, and
`SupportText` into `FormControlLabel`. Their existing registry items and imports
remain available. The new `form-control-label` item provides the wrapper with
`as="div"` (default) or `as="fieldset"` and `size="sm"|"md"|"lg"`. Compose it
with the separately installed label, legend, badge, and input components; the
`form` and `all-components` bundles include the wrapper.

`Textarea` now has an outer `span` to expose its first-line baseline, matching
upstream's Safari fix. Props, `className`, and refs still target the native
`textarea`; selectors that rely on it being a direct child need to account for
the wrapper. `DatePicker` uses the same zero-width-space baseline technique.

For `Checkbox` and `RadioGroupItem` label composition, use `items-baseline` on
the enclosing flex row. The size-dependent offset matches upstream's controls;
label text, wrapping, and label associations remain the consumer's responsibility.

The upstream license and copyright notice are unchanged; the existing
`THIRD_PARTY_LICENSES.md` remains applicable to the new wrapper as well.

## Out of Scope: Upstream Example Collections

Upstream ships some entries under `src/components/` that have no shared
component, only Storybook example compositions. `Card` is the first of these:
its `index.ts` is an empty `export {}` and its `component-spec.md` states that
no `Card` primitive is to be built. Such entries are not ported, because a
registry item exists to distribute a component and there is nothing to
distribute. They are also not listed in `components-map.json`.

The same rule applies to future upstream additions of the same shape. Porting
one anyway would mean inventing a primitive upstream deliberately declined to
define, which is an API divergence with no upstream contract to test against.

## Test Requirements

Every ported component must have an entry in `components-map.json`, because
`scripts/map-upstream-changes.ts` resolves upstream changes to local files
through that map alone — an unmapped component is silently reported as
unaffected by the upstream sync tooling. `tests/unit/components-map.test.ts`
enforces the coverage, so adding a `registry:ui` item without a map entry fails
CI.

For every ported component, `components-map.json` must point to at least one
unit or parity test. Components with intentional API/DOM divergence must have a
test under `tests/parity` that asserts both:

- the upstream-compatible props that remain supported
- the local DOM contract that intentionally differs from upstream

Visual regression is maintained separately from unit tests. `npm run test:visual`
uses Playwright against `visual.html`, whose fixtures mirror selected upstream
Storybook story IDs. Use `npm run test:visual:update` when the intended visual
baseline changes.
