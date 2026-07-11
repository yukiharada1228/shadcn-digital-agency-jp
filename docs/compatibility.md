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

`Select` is intentionally not a native `<select>`. Upstream uses a wrapped
native select element; this project exposes a Radix Select compound API:
`Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, and `SelectItem`.
The supported upstream-compatible props are on `SelectTrigger`: `blockSize`,
`isError`, `aria-disabled`, and normal ARIA attributes. Native `<option>`
children are not a compatibility target.

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

## Other Intentional API Reshaping

`Image` is split for shadcn-style composition. Upstream exports `Image` as the
`figure` wrapper. This project exports `Image` as the `img` element and exposes
`ImageFigure`, `ImageArea`, `ImageAreaLink`, and `ImageCaption` for the upstream
figure structure.

## Test Requirements

For every ported component, `components-map.json` must point to at least one
unit or parity test. Components with intentional API/DOM divergence must have a
test under `tests/parity` that asserts both:

- the upstream-compatible props that remain supported
- the local DOM contract that intentionally differs from upstream

Visual regression is maintained separately from unit tests. `pnpm test:visual`
uses Playwright against `visual.html`, whose fixtures mirror selected upstream
Storybook story IDs. Use `pnpm test:visual:update` when the intended visual
baseline changes.
