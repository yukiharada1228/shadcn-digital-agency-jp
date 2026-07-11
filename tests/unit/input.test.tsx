import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renders an input element with data-slot", () => {
    render(<Input placeholder="name" />)
    const input = screen.getByPlaceholderText("name")
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe("INPUT")
    expect(input).toHaveAttribute("data-slot", "input")
  })

  it("reflects a passed className", () => {
    render(<Input placeholder="cls" className="custom-class" />)
    expect(screen.getByPlaceholderText("cls")).toHaveClass("custom-class")
  })

  it("forwards ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} placeholder="ref" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("defaults data-size to lg", () => {
    render(<Input placeholder="default" />)
    expect(screen.getByPlaceholderText("default")).toHaveAttribute(
      "data-size",
      "lg"
    )
  })

  it("reflects the blockSize prop via data-size", () => {
    render(<Input placeholder="sized" blockSize="sm" />)
    expect(screen.getByPlaceholderText("sized")).toHaveAttribute(
      "data-size",
      "sm"
    )
  })

  it("sets aria-invalid when isError is true", () => {
    render(<Input placeholder="err" isError />)
    expect(screen.getByPlaceholderText("err")).toHaveAttribute(
      "aria-invalid",
      "true"
    )
  })

  it("forces readOnly when aria-disabled is set", () => {
    render(<Input placeholder="dis" aria-disabled />)
    const input = screen.getByPlaceholderText("dis") as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })
})
