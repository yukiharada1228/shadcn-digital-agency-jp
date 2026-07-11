import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

describe("RadioGroup", () => {
  it("renders the group and items with data-slot", () => {
    render(
      <RadioGroup aria-label="options">
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    )
    const group = screen.getByRole("radiogroup")
    expect(group).toBeInTheDocument()
    expect(group).toHaveAttribute("data-slot", "radio-group")
    const items = screen.getAllByRole("radio")
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveAttribute("data-slot", "radio-group-item")
  })

  it("reflects a passed className on an item", () => {
    render(
      <RadioGroup aria-label="options">
        <RadioGroupItem value="a" className="custom-class" />
      </RadioGroup>
    )
    expect(screen.getByRole("radio")).toHaveClass("custom-class")
  })

  it("forwards ref to the item element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <RadioGroup aria-label="options">
        <RadioGroupItem ref={ref} value="a" />
      </RadioGroup>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("reflects the size variant via data-size", () => {
    render(
      <RadioGroup aria-label="options">
        <RadioGroupItem value="a" size="lg" />
      </RadioGroup>
    )
    expect(screen.getByRole("radio")).toHaveAttribute("data-size", "lg")
  })

  it("defaults size to sm", () => {
    render(
      <RadioGroup aria-label="options">
        <RadioGroupItem value="a" />
      </RadioGroup>
    )
    expect(screen.getByRole("radio")).toHaveAttribute("data-size", "sm")
  })

  it("sets data-error when isError is true", () => {
    render(
      <RadioGroup aria-label="options">
        <RadioGroupItem value="a" isError />
      </RadioGroup>
    )
    expect(screen.getByRole("radio")).toHaveAttribute("data-error", "true")
  })

  it("selects an item and calls onValueChange", () => {
    const onValueChange = vi.fn()
    render(
      <RadioGroup aria-label="options" onValueChange={onValueChange}>
        <RadioGroupItem value="a" />
        <RadioGroupItem value="b" />
      </RadioGroup>
    )
    const items = screen.getAllByRole("radio")
    fireEvent.click(items[1])
    expect(onValueChange).toHaveBeenCalledWith("b")
    expect(items[1]).toHaveAttribute("data-state", "checked")
  })
})
