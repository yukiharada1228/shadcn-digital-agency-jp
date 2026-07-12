import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  SeparatedDatePicker,
  SeparatedDatePickerYear,
  SeparatedDatePickerMonth,
  SeparatedDatePickerDate,
  SeparatedDatePickerCalendarButton,
} from "@/components/ui/separated-date-picker"

describe("SeparatedDatePicker", () => {
  it("renders the root with data-slot and passes render-prop children", () => {
    const { container } = render(
      <SeparatedDatePicker>
        {(rest) => (
          <>
            <SeparatedDatePickerYear {...rest} />
            <SeparatedDatePickerMonth {...rest} />
            <SeparatedDatePickerDate {...rest} />
          </>
        )}
      </SeparatedDatePicker>
    )
    const root = container.querySelector('[data-slot="separated-date-picker"]')
    expect(root).toBeInTheDocument()
    expect(screen.getByText("年")).toBeInTheDocument()
    expect(screen.getByText("月")).toBeInTheDocument()
    expect(screen.getByText("日")).toBeInTheDocument()
  })

  it("applies the default lg size via data-size", () => {
    const { container } = render(
      <SeparatedDatePicker>
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    const root = container.querySelector('[data-slot="separated-date-picker"]')
    expect(root).toHaveAttribute("data-size", "lg")
    expect(root).toHaveClass("h-14")
  })

  it("reflects the size prop on the root", () => {
    const { container } = render(
      <SeparatedDatePicker size="sm">
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    const root = container.querySelector('[data-slot="separated-date-picker"]')
    expect(root).toHaveAttribute("data-size", "sm")
  })

  it("merges className after base classes on the root", () => {
    const { container } = render(
      <SeparatedDatePicker className="custom-root">
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    const root = container.querySelector('[data-slot="separated-date-picker"]')
    expect(root).toHaveClass("custom-root")
    expect(root).toHaveClass("flex")
  })

  it("forwards the root ref to the inner div", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <SeparatedDatePicker ref={ref}>
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute("data-slot", "separated-date-picker")
  })

  it("passes isError as aria-invalid to fields", () => {
    render(
      <SeparatedDatePicker isError>
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true")
  })

  it("passes isReadonly as readOnly to fields", () => {
    render(
      <SeparatedDatePicker isReadonly>
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
  })

  it("passes isDisabled as aria-disabled and forces readOnly on fields", () => {
    render(
      <SeparatedDatePicker isDisabled>
        {(rest) => <SeparatedDatePickerYear {...rest} />}
      </SeparatedDatePicker>
    )
    const input = screen.getByRole("textbox")
    expect(input).toHaveAttribute("aria-disabled", "true")
    expect(input).toHaveAttribute("readonly")
  })
})

describe("SeparatedDatePicker fields", () => {
  it.each([
    ["year", SeparatedDatePickerYear, "separated-date-picker-year", "年"],
    ["month", SeparatedDatePickerMonth, "separated-date-picker-month", "月"],
    ["date", SeparatedDatePickerDate, "separated-date-picker-date", "日"],
  ] as const)(
    "renders the %s field with data-slot, label and numeric input",
    (_name, Field, slot, label) => {
      const { container } = render(<Field />)
      const wrapper = container.querySelector(`[data-slot="${slot}"]`)
      expect(wrapper).toBeInTheDocument()
      expect(wrapper?.tagName).toBe("LABEL")
      expect(screen.getByText(label)).toBeInTheDocument()
      const input = screen.getByRole("textbox")
      expect(input).toHaveAttribute("type", "text")
      expect(input).toHaveAttribute("inputmode", "numeric")
      expect(input).toHaveAttribute("pattern", "\\d+")
    }
  )

  it("merges className after base classes on the input", () => {
    render(<SeparatedDatePickerMonth className="custom-input" />)
    const input = screen.getByRole("textbox")
    expect(input).toHaveClass("custom-input")
    expect(input).toHaveClass("rounded-8")
  })

  it("forwards the input ref", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<SeparatedDatePickerDate ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it("fires onChange when typing", () => {
    const handleChange = vi.fn()
    render(<SeparatedDatePickerYear onChange={handleChange} />)
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "2025" } })
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it("forces readOnly when aria-disabled is true", () => {
    render(<SeparatedDatePickerYear aria-disabled />)
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly")
  })
})

describe("SeparatedDatePickerCalendarButton", () => {
  it("renders a button with data-slot and default size", () => {
    render(<SeparatedDatePickerCalendarButton />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute(
      "data-slot",
      "separated-date-picker-calendar-button"
    )
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveAttribute("data-size", "lg")
  })

  it("reflects the size prop", () => {
    render(<SeparatedDatePickerCalendarButton size="md" />)
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "md")
  })

  it("merges className after base classes", () => {
    render(<SeparatedDatePickerCalendarButton className="custom-btn" />)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-btn")
    expect(button).toHaveClass("rounded-6")
  })

  it("forwards the ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<SeparatedDatePickerCalendarButton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("fires onClick", () => {
    const handleClick = vi.fn()
    render(<SeparatedDatePickerCalendarButton onClick={handleClick} />)
    fireEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
