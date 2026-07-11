import * as React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"

import { ErrorText } from "@/components/ui/error-text"

describe("ErrorText", () => {
  it("renders its children", () => {
    render(<ErrorText>Something went wrong</ErrorText>)
    expect(screen.getByText("Something went wrong")).toBeInTheDocument()
  })

  it("renders as a p element with data-slot", () => {
    render(<ErrorText>Error</ErrorText>)
    const el = screen.getByText("Error")
    expect(el.tagName).toBe("P")
    expect(el).toHaveAttribute("data-slot", "error-text")
  })

  it("applies the DADS token classes", () => {
    render(<ErrorText>Error</ErrorText>)
    expect(screen.getByText("Error")).toHaveClass(
      "text-dns-16N-130",
      "text-error-1"
    )
  })

  it("reflects a passed className", () => {
    render(<ErrorText className="custom-class">Error</ErrorText>)
    expect(screen.getByText("Error")).toHaveClass("custom-class")
  })

  it("reflects a passed prop", () => {
    render(<ErrorText id="err-1">Error</ErrorText>)
    expect(screen.getByText("Error")).toHaveAttribute("id", "err-1")
  })

  it("forwards ref to the p element", () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(<ErrorText ref={ref}>Ref</ErrorText>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<ErrorText>Error message</ErrorText>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
