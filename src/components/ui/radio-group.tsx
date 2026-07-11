// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

export type RadioGroupItemSize = "lg" | "md" | "sm"

export const radioGroupItemVariants = cva(
  "appearance-none aspect-square rounded-full border-solid-gray-600 bg-white outline-none hover:border-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-black focus-visible:outline-offset-[calc(2/16*1rem)] focus-visible:ring-[calc(2/16*1rem)] focus-visible:ring-yellow-300 data-[state=checked]:border-key-900 data-[state=checked]:hover:border-key-1100 data-[size=sm]:size-5 data-[size=sm]:border-[calc(2/16*1rem)] data-[size=md]:size-[1.6667rem] data-[size=md]:border-[calc(2/16*1rem)] data-[size=lg]:size-[2.2917rem] data-[size=lg]:border-[calc(3/16*1rem)] data-[error]:border-error-1 data-[error]:hover:border-red-1000 data-[error]:data-[state=checked]:border-error-1 aria-disabled:!border-solid-gray-300 aria-disabled:!bg-solid-gray-50 aria-disabled:pointer-events-none forced-colors:!border-[ButtonText] forced-colors:data-[state=checked]:!border-[Highlight] forced-colors:aria-disabled:!border-[GrayText]",
  {
    variants: {
      size: {
        lg: "",
        md: "",
        sm: "",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
)

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      ref={ref}
      data-slot="radio-group"
      className={cn("grid gap-1", className)}
      {...props}
    />
  )
})
RadioGroup.displayName = "RadioGroup"

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> &
  VariantProps<typeof radioGroupItemVariants> & {
    isError?: boolean
  }

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, isError, size = "sm", ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      data-slot="radio-group-item"
      data-size={size}
      data-error={isError || undefined}
      className={cn(radioGroupItemVariants({ size }), className)}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <span
          className="rounded-full bg-key-900 data-[error]:bg-error-1 aria-disabled:!bg-solid-gray-300 forced-colors:!bg-[Highlight] size-[calc(5/8*100%)]"
          data-error={isError || undefined}
        />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }
