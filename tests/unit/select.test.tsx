import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function renderSelect(
  props: React.ComponentProps<typeof SelectTrigger> = {},
  onValueChange?: (value: string) => void
) {
  return render(
    <Select onValueChange={onValueChange}>
      <SelectTrigger {...props}>
        <SelectValue placeholder="選択してください" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="1">選択肢1</SelectItem>
        <SelectItem value="2">選択肢2</SelectItem>
      </SelectContent>
    </Select>
  )
}

describe("Select", () => {
  it("renders a trigger with data-slot", () => {
    renderSelect()
    const trigger = screen.getByRole("combobox")
    expect(trigger).toBeInTheDocument()
    expect(trigger).toHaveAttribute("data-slot", "select-trigger")
  })

  it("reflects a passed className on the trigger", () => {
    renderSelect({ className: "custom-class" })
    expect(screen.getByRole("combobox")).toHaveClass("custom-class")
  })

  it("forwards ref to the trigger element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <Select>
        <SelectTrigger ref={ref}>
          <SelectValue placeholder="p" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">選択肢1</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("defaults data-size to lg", () => {
    renderSelect()
    expect(screen.getByRole("combobox")).toHaveAttribute("data-size", "lg")
  })

  it("reflects the blockSize prop via data-size", () => {
    renderSelect({ blockSize: "sm" })
    expect(screen.getByRole("combobox")).toHaveAttribute("data-size", "sm")
  })

  it("sets aria-invalid when isError is true", () => {
    renderSelect({ isError: true })
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-invalid", "true")
  })

  it("opens and calls onValueChange when an item is selected", () => {
    const onValueChange = vi.fn()
    renderSelect({}, onValueChange)
    const trigger = screen.getByRole("combobox")
    fireEvent.click(trigger)
    const option = screen.getByText("選択肢2")
    fireEvent.click(option)
    expect(onValueChange).toHaveBeenCalledWith("2")
  })
})
