import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Label } from "@/components/ui/label"

describe("Label", () => {
  it("renders its children", () => {
    render(<Label>Email</Label>)
    expect(screen.getByText("Email")).toBeInTheDocument()
  })

  it("renders as a label element with data-slot", () => {
    render(<Label>Name</Label>)
    const label = screen.getByText("Name")
    expect(label.tagName).toBe("LABEL")
    expect(label).toHaveAttribute("data-slot", "label")
  })

  it("reflects a passed className", () => {
    render(<Label className="custom-class">Label</Label>)
    expect(screen.getByText("Label")).toHaveClass("custom-class")
  })

  it("forwards ref to the label element", () => {
    const ref = React.createRef<HTMLLabelElement>()
    render(<Label ref={ref}>Ref</Label>)
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
  })

  it("defaults to size md", () => {
    render(<Label>Default</Label>)
    expect(screen.getByText("Default")).toHaveAttribute("data-size", "md")
  })

  it("reflects the size variant via data-size", () => {
    render(<Label size="lg">Large</Label>)
    expect(screen.getByText("Large")).toHaveAttribute("data-size", "lg")
  })
})
