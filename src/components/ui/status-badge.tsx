// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"
import { cva } from "class-variance-authority"

import { cn } from "@/lib/digital-agency/cn"

const statusBadgeVariants = cva(
  "ml-1 inline-block rounded-8 bg-solid-gray-536 p-2 text-oln-16N-100 text-white outline outline-1 outline-transparent"
)

const StatusBadge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      data-slot="status-badge"
      className={cn(statusBadgeVariants(), className)}
      {...props}
    >
      {children}
    </span>
  )
})
StatusBadge.displayName = "StatusBadge"

export { StatusBadge, statusBadgeVariants }
