// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"

import { cn } from "@/lib/digital-agency/cn"

export type FormControlLabelSize = "sm" | "md" | "lg"

export type FormControlLabelProps = (
  | (React.ComponentPropsWithoutRef<"div"> & { as?: "div" })
  | (React.ComponentPropsWithoutRef<"fieldset"> & { as: "fieldset" })
) & {
  size?: FormControlLabelSize
}

const FormControlLabel = React.forwardRef<
  HTMLDivElement | HTMLFieldSetElement,
  FormControlLabelProps
>(({ as = "div", className, size = "md", ...props }, ref) => {
  const sharedProps = {
    "data-slot": "form-control-label",
    "data-size": size,
    className: cn(
      "flex flex-col text-std-16N-170 text-solid-gray-800 data-[size=sm]:gap-y-1 data-[size=md]:gap-y-2 data-[size=lg]:gap-y-2 [&>legend]:mb-2",
      className
    ),
  }

  return as === "fieldset" ? (
    <fieldset
      ref={ref as React.Ref<HTMLFieldSetElement>}
      {...sharedProps}
      {...(props as React.ComponentPropsWithoutRef<"fieldset">)}
    />
  ) : (
    <div
      ref={ref as React.Ref<HTMLDivElement>}
      {...sharedProps}
      {...(props as React.ComponentPropsWithoutRef<"div">)}
    />
  )
})
FormControlLabel.displayName = "FormControlLabel"

export { FormControlLabel }
