import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import { Checkbox } from "@/components/ui/checkbox"

describe("Checkbox", () => {
  it("renders a checkbox with data-slot", () => {
    render(<Checkbox aria-label="agree" />)
    const checkbox = screen.getByRole("checkbox", { name: "agree" })
    expect(checkbox).toBeInTheDocument()
    expect(checkbox).toHaveAttribute("data-slot", "checkbox")
  })

  it("reflects a passed className", () => {
    render(<Checkbox aria-label="cls" className="custom-class" />)
    expect(screen.getByRole("checkbox", { name: "cls" })).toHaveClass(
      "custom-class"
    )
  })

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Checkbox ref={ref} aria-label="ref" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("defaults data-size to sm", () => {
    render(<Checkbox aria-label="default" />)
    expect(screen.getByRole("checkbox", { name: "default" })).toHaveAttribute(
      "data-size",
      "sm"
    )
  })

  it("reflects the size prop via data-size", () => {
    render(<Checkbox aria-label="sized" size="lg" />)
    expect(screen.getByRole("checkbox", { name: "sized" })).toHaveAttribute(
      "data-size",
      "lg"
    )
  })

  it("sets data-error when isError is true", () => {
    render(<Checkbox aria-label="err" isError />)
    expect(screen.getByRole("checkbox", { name: "err" })).toHaveAttribute(
      "data-error"
    )
  })

  it("toggles checked state and calls onCheckedChange", () => {
    const onCheckedChange = vi.fn()
    render(<Checkbox aria-label="toggle" onCheckedChange={onCheckedChange} />)
    const checkbox = screen.getByRole("checkbox", { name: "toggle" })
    expect(checkbox).toHaveAttribute("data-state", "unchecked")
    fireEvent.click(checkbox)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
    expect(checkbox).toHaveAttribute("data-state", "checked")
  })
})
