// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type CheckboxSize = "sm" | "md" | "lg"

const checkboxVariants = cva(
  "flex items-center justify-center shrink-0 appearance-none rounded-[calc(2/18*100%)] border-solid-gray-600 bg-white bg-clip-padding hover:border-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300 data-[state=checked]:border-key-900 data-[state=checked]:bg-key-900 data-[state=checked]:hover:border-key-1100 data-[state=checked]:hover:bg-key-1100 data-[state=indeterminate]:border-key-900 data-[state=indeterminate]:bg-key-900 data-[state=indeterminate]:hover:border-key-1100 data-[state=indeterminate]:hover:bg-key-1100 data-[size=sm]:size-6 data-[size=sm]:border-[calc(2/16*1rem)] data-[size=md]:size-8 data-[size=md]:border-[calc(2/16*1rem)] data-[size=lg]:size-11 data-[size=lg]:border-[calc(3/16*1rem)] data-[error]:border-error-1 data-[error]:hover:border-red-1000 data-[error]:data-[state=checked]:bg-error-1 data-[error]:data-[state=checked]:hover:bg-red-1000 data-[error]:data-[state=indeterminate]:bg-error-1 data-[error]:data-[state=indeterminate]:hover:bg-red-1000 aria-disabled:!border-solid-gray-300 aria-disabled:!bg-solid-gray-50 aria-disabled:data-[state=checked]:!bg-solid-gray-300 aria-disabled:data-[state=indeterminate]:!bg-solid-gray-300 aria-disabled:pointer-events-none forced-colors:!border-[ButtonText] forced-colors:data-[state=checked]:!bg-[Highlight] forced-colors:data-[state=checked]:!border-[Highlight] forced-colors:data-[state=indeterminate]:!bg-[Highlight] forced-colors:data-[state=indeterminate]:!border-[Highlight] forced-colors:aria-disabled:!border-[GrayText] forced-colors:aria-disabled:data-[state=checked]:!bg-[GrayText]",
  {
    variants: {
      size: {
        sm: "",
        md: "",
        lg: "",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

export type CheckboxProps = Omit<
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  "children"
> &
  VariantProps<typeof checkboxVariants> & {
    isError?: boolean
  }

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, size = "sm", isError, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    data-slot="checkbox"
    data-size={size}
    data-error={isError || undefined}
    className={cn(checkboxVariants({ size }), className)}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      data-slot="checkbox-indicator"
      data-size={size}
      className={cn(
        "block size-3.5 bg-white",
        "data-[state=checked]:[clip-path:path('M5.6,11.2L12.65,4.15L11.25,2.75L5.6,8.4L2.75,5.55L1.35,6.95L5.6,11.2Z')]",
        "data-[state=indeterminate]:[clip-path:path('M3.25,7.75H10.75V6.25H3.25V7.75Z')]",
        "data-[size=md]:origin-top-left data-[size=md]:scale-[calc(20/14)]",
        "data-[size=lg]:origin-top-left data-[size=lg]:scale-[calc(27/14)]"
      )}
    />
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = "Checkbox"

export { Checkbox, checkboxVariants }
