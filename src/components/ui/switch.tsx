// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"

import { cn } from "@/lib/digital-agency/cn"

// SwitchOnOff

export type SwitchOnOffProps = Omit<
  React.ComponentPropsWithoutRef<"button">,
  "aria-disabled"
>

const SwitchOnOff = React.forwardRef<HTMLButtonElement, SwitchOnOffProps>(
  ({ className, "aria-checked": ariaChecked = false, ...rest }, ref) => (
    <button
      ref={ref}
      {...rest}
      aria-checked={ariaChecked}
      className={cn(
        `
        group/switch-on-off relative shrink-0 select-none [-webkit-tap-highlight-color:transparent]
        before:absolute before:-inset-y-1 before:inset-x-0
        focus-visible:rounded-full focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-2 focus-visible:ring-2 focus-visible:ring-yellow-300
      `,
        className
      )}
      data-slot="switch-on-off"
      role="switch"
      type="button"
    >
      <span
        aria-hidden="true"
        className={`
          relative block w-14 rounded-full border-2 border-solid-gray-600 bg-white p-1
          group-aria-checked/switch-on-off:border-key-900 group-aria-checked/switch-on-off:bg-key-50
          group-hover/switch-on-off:border-black group-hover/switch-on-off:ring-4 group-hover/switch-on-off:ring-solid-gray-420
          group-aria-checked/switch-on-off:group-hover/switch-on-off:border-key-1100
          group-active/switch-on-off:ring-[calc(6/16*1rem)] group-active/switch-on-off:ring-solid-gray-600
          group-disabled/switch-on-off:!border-solid-gray-300 group-disabled/switch-on-off:!bg-solid-gray-50 group-disabled/switch-on-off:!ring-0
          forced-colors:!border-[ButtonText]
          group-aria-checked/switch-on-off:forced-colors:!border-[Highlight]
          group-disabled/switch-on-off:forced-colors:!border-[GrayText]
          group-disabled/switch-on-off:group-aria-checked/switch-on-off:forced-colors:!border-[GrayText]
        `}
      >
        <span
          className={`
            block size-6 rounded-full bg-solid-gray-800
            group-aria-checked/switch-on-off:ml-auto group-aria-checked/switch-on-off:bg-key-900
            group-hover/switch-on-off:bg-black
            group-aria-checked/switch-on-off:group-hover/switch-on-off:bg-key-1100
            group-disabled/switch-on-off:!bg-solid-gray-300
            forced-colors:!bg-[ButtonText]
            group-aria-checked/switch-on-off:forced-colors:!bg-[Highlight]
            group-disabled/switch-on-off:forced-colors:!bg-[GrayText]
            group-disabled/switch-on-off:group-aria-checked/switch-on-off:forced-colors:!bg-[GrayText]
          `}
        >
          <svg
            aria-hidden="true"
            className={`
              hidden size-6 shrink-0 text-white
              group-aria-checked/switch-on-off:block
              forced-colors:text-[Canvas]
            `}
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path
              d="m10.4 16.3-4.1-4.1 1.2-1.3 2.9 2.9 6-6.1 1.3 1.2z"
              fill="currentcolor"
            />
          </svg>
        </span>
      </span>
    </button>
  )
)
SwitchOnOff.displayName = "SwitchOnOff"

// SwitchMode

export type SwitchModeProps = Omit<
  React.ComponentPropsWithoutRef<"div">,
  "onChange" | "aria-describedby"
> & {
  leftLabel: string
  rightLabel: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  "aria-describedby"?: string
}

const switchModeOptionClassName = `
  relative flex self-stretch items-center select-none [-webkit-tap-highlight-color:transparent]
  aria-checked:-z-10
  before:absolute before:-inset-y-2 before:inset-x-0
  after:absolute after:inset-0
  first:before:-right-[calc((60+16)/16*1rem)] first:after:-right-[calc((60+16)/16*1rem)]
  last:before:-left-[calc((60+16)/16*1rem)] last:after:-left-[calc((60+16)/16*1rem)]
  focus-visible:outline-none
  focus-visible:after:rounded-full focus-visible:after:outline focus-visible:after:outline-4 focus-visible:after:outline-black focus-visible:after:outline-offset-2 focus-visible:after:ring-2 focus-visible:after:ring-yellow-300
  forced-colors:focus-visible:after:outline-[Highlight]
`

const SwitchMode = React.forwardRef<HTMLDivElement, SwitchModeProps>(
  (
    {
      className,
      leftLabel,
      rightLabel,
      value,
      onChange,
      disabled,
      "aria-describedby": ariaDescribedby,
      ...rest
    },
    ref
  ) => {
    const toggledValue = value === leftLabel ? rightLabel : leftLabel

    return (
      <div
        ref={ref}
        className={cn(
          `
          group/switch-mode isolate inline-flex items-center gap-4
          text-solid-gray-800 text-oln-16N-100
          has-[:disabled]:text-solid-gray-300
          forced-colors:has-[:disabled]:text-[GrayText]
        `,
          className
        )}
        data-slot="switch-mode"
        {...rest}
      >
        <button
          aria-checked={value === leftLabel}
          aria-describedby={ariaDescribedby}
          className={switchModeOptionClassName}
          disabled={disabled}
          onClick={() => onChange(toggledValue)}
          role="switch"
          type="button"
        >
          {leftLabel}
        </button>
        <span
          aria-hidden="true"
          className={`
            relative box-border shrink-0 w-[calc(60/16*1rem)] rounded-full p-1.5 pointer-events-none
            group-hover/switch-mode:ring-4 group-hover/switch-mode:ring-solid-gray-420
            group-active/switch-mode:ring-[calc(6/16*1rem)] group-active/switch-mode:ring-solid-gray-600
            group-has-[:disabled]/switch-mode:!ring-0
          `}
        >
          <span
            className={`
              box-border block h-4 rounded-8 border-2 border-blue-900 bg-blue-100
              group-hover/switch-mode:border-blue-1100
              group-has-[:disabled]/switch-mode:!border-solid-gray-300 group-has-[:disabled]/switch-mode:!bg-solid-gray-50
              forced-colors:border-[ButtonText] forced-colors:group-hover/switch-mode:border-[ButtonText]
            `}
          />
          <span
            className={`
              absolute inset-x-0 -inset-y-full my-auto box-content size-6 rounded-full border-2 border-white bg-blue-900
              group-hover/switch-mode:bg-blue-1100
              group-has-[button:last-of-type[aria-checked=true]]/switch-mode:left-8
              group-has-[:disabled]/switch-mode:!bg-solid-gray-300
              forced-colors:bg-[ButtonText] forced-colors:border-[Canvas] forced-colors:group-hover/switch-mode:bg-[ButtonText]
              forced-colors:group-has-[:disabled]/switch-mode:!bg-[GrayText]
            `}
          />
        </span>
        <button
          aria-checked={value === rightLabel}
          aria-describedby={ariaDescribedby}
          className={switchModeOptionClassName}
          disabled={disabled}
          onClick={() => onChange(toggledValue)}
          role="switch"
          type="button"
        >
          {rightLabel}
        </button>
      </div>
    )
  }
)
SwitchMode.displayName = "SwitchMode"

export { SwitchOnOff, SwitchMode }
