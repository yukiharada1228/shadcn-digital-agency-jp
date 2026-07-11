import * as React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { SupportText } from "@/components/ui/support-text"

describe("SupportText", () => {
  it("renders its children", () => {
    render(<SupportText>Helper text</SupportText>)
    expect(screen.getByText("Helper text")).toBeInTheDocument()
  })

  it("renders as a p element with data-slot", () => {
    render(<SupportText>Info</SupportText>)
    const text = screen.getByText("Info")
    expect(text.tagName).toBe("P")
    expect(text).toHaveAttribute("data-slot", "support-text")
  })

  it("applies DADS token classes", () => {
    render(<SupportText>Tokens</SupportText>)
    const text = screen.getByText("Tokens")
    expect(text).toHaveClass("text-std-16N-170")
    expect(text).toHaveClass("text-solid-gray-600")
  })

  it("reflects a passed className", () => {
    render(<SupportText className="custom-class">Custom</SupportText>)
    expect(screen.getByText("Custom")).toHaveClass("custom-class")
  })

  it("forwards ref to the p element", () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(<SupportText ref={ref}>Ref</SupportText>)
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SupportText>Accessible</SupportText>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
