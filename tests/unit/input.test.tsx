import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Input } from "@/components/ui/input"

describe("Input", () => {
  it("renders an input element with data-slot", () => {
    render(<Input aria-label="name" />)
    const input = screen.getByLabelText("name")
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe("INPUT")
    expect(input).toHaveAttribute("data-slot", "input")
  })

  it("reflects a passed className", () => {
    render(<Input aria-label="cls" className="custom-class" />)
    expect(screen.getByLabelText("cls")).toHaveClass("custom-class")
  })

  it("forwards ref to the input element", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} aria-label="ref" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("defaults data-size to lg", () => {
    render(<Input aria-label="default" />)
    expect(screen.getByLabelText("default")).toHaveAttribute("data-size", "lg")
  })

  it("reflects the blockSize prop via data-size", () => {
    render(<Input aria-label="sized" blockSize="sm" />)
    expect(screen.getByLabelText("sized")).toHaveAttribute("data-size", "sm")
  })

  it("sets aria-invalid when isError is true", () => {
    render(<Input aria-label="err" isError />)
    expect(screen.getByLabelText("err")).toHaveAttribute("aria-invalid", "true")
  })

  it("forces readOnly when aria-disabled is set", () => {
    render(<Input aria-label="dis" aria-disabled />)
    const input = screen.getByLabelText("dis") as HTMLInputElement
    expect(input.readOnly).toBe(true)
  })

  it("does not force readOnly when aria-disabled is false", () => {
    render(<Input aria-label="enabled" aria-disabled="false" />)
    const input = screen.getByLabelText("enabled") as HTMLInputElement
    expect(input.readOnly).toBe(false)
  })
})
