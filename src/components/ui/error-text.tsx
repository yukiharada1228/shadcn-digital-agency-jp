// Portions derived from or inspired by digital-go-jp/design-system-example-components-react.
// Original code licensed under the MIT License.
// See THIRD_PARTY_LICENSES.md for details.
import * as React from "react"

import { cn } from "@/lib/utils"

const ErrorText = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="error-text"
      className={cn("text-dns-16N-130 text-error-1", className)}
      {...props}
    >
      {children}
    </p>
  )
})
ErrorText.displayName = "ErrorText"

export { ErrorText }
