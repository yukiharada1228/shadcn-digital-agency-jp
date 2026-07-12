import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  DatePicker,
  DatePickerCalendarButton,
  DatePickerDate,
  DatePickerMonth,
  DatePickerYear,
} from "@/components/ui/date-picker"

function renderDatePicker(
  props: Partial<React.ComponentProps<typeof DatePicker>> = {}
) {
  return render(
    <DatePicker {...props}>
      {({ yearRef, monthRef, dateRef, ...rest }) => (
        <>
          <DatePickerYear ref={yearRef} aria-label="年" {...rest} />
          <DatePickerMonth ref={monthRef} aria-label="月" {...rest} />
          <DatePickerDate ref={dateRef} aria-label="日" {...rest} />
        </>
      )}
    </DatePicker>
  )
}

describe("DatePicker", () => {
  it("renders the root with data-slot and the three fields", () => {
    const { container } = renderDatePicker()
    const root = container.querySelector('[data-slot="date-picker"]')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute("data-size", "lg")
    expect(screen.getByLabelText("年")).toBeInTheDocument()
    expect(screen.getByLabelText("月")).toBeInTheDocument()
    expect(screen.getByLabelText("日")).toBeInTheDocument()
  })

  it("passes className through to the root, merged last", () => {
    const { container } = renderDatePicker({ className: "custom-root" })
    const root = container.querySelector('[data-slot="date-picker"]')
    expect(root).toHaveClass("custom-root")
    expect(root).toHaveClass("inline-flex")
  })

  it("reflects the size variant via data-size", () => {
    const { container } = renderDatePicker({ size: "sm" })
    expect(
      container.querySelector('[data-slot="date-picker"]')
    ).toHaveAttribute("data-size", "sm")
  })

  it("sets data-error, data-readonly, data-disabled from props", () => {
    const { container } = renderDatePicker({
      isError: true,
      isReadonly: true,
      isDisabled: true,
    })
    const root = container.querySelector('[data-slot="date-picker"]')
    expect(root).toHaveAttribute("data-error", "true")
    expect(root).toHaveAttribute("data-readonly", "true")
    expect(root).toHaveAttribute("data-disabled", "true")
  })

  it("omits state data attributes when the corresponding prop is false", () => {
    const { container } = renderDatePicker()
    const root = container.querySelector('[data-slot="date-picker"]')
    expect(root).not.toHaveAttribute("data-error")
    expect(root).not.toHaveAttribute("data-readonly")
    expect(root).not.toHaveAttribute("data-disabled")
  })

  it("forwards aria-disabled and aria-invalid to the fields", () => {
    renderDatePicker({ isDisabled: true, isError: true })
    const year = screen.getByLabelText("年")
    expect(year).toHaveAttribute("aria-disabled", "true")
    expect(year).toHaveAttribute("aria-invalid", "true")
  })

  it("makes fields read only when isReadonly is set", () => {
    renderDatePicker({ isReadonly: true })
    expect(screen.getByLabelText("年")).toHaveAttribute("readonly")
  })

  it("moves focus from year to month on ArrowRight at the end of the value", () => {
    renderDatePicker()
    const year = screen.getByLabelText("年") as HTMLInputElement
    const month = screen.getByLabelText("月")
    year.value = "2025"
    year.focus()
    year.setSelectionRange(4, 4)
    fireEvent.keyDown(year, { key: "ArrowRight" })
    expect(month).toHaveFocus()
  })

  it("moves focus from month to year on ArrowLeft at the start of the value", () => {
    renderDatePicker()
    const year = screen.getByLabelText("年")
    const month = screen.getByLabelText("月") as HTMLInputElement
    month.value = "10"
    month.focus()
    month.setSelectionRange(0, 0)
    fireEvent.keyDown(month, { key: "ArrowLeft" })
    expect(year).toHaveFocus()
  })

  it("prevents non-numeric key input", () => {
    renderDatePicker()
    const year = screen.getByLabelText("年")
    const event = fireEvent.keyDown(year, { key: "a" })
    expect(event).toBe(false)
  })

  it("forwards refs to the field inputs", () => {
    const yearRef = React.createRef<HTMLInputElement>()
    render(
      <DatePicker>
        {({ monthRef, dateRef }) => (
          <>
            <DatePickerYear ref={yearRef} aria-label="年" />
            <DatePickerMonth ref={monthRef} aria-label="月" />
            <DatePickerDate ref={dateRef} aria-label="日" />
          </>
        )}
      </DatePicker>
    )
    expect(yearRef.current).toBeInstanceOf(HTMLInputElement)
  })

  it("sets data-slot on each field label", () => {
    const { container } = renderDatePicker()
    expect(
      container.querySelector('[data-slot="date-picker-year"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="date-picker-month"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="date-picker-date"]')
    ).toBeInTheDocument()
  })

  it("passes className through to a field input", () => {
    render(
      <DatePicker>
        {({ yearRef }) => (
          <DatePickerYear
            ref={yearRef}
            aria-label="年"
            className="custom-field"
          />
        )}
      </DatePicker>
    )
    expect(screen.getByLabelText("年")).toHaveClass("custom-field")
  })
})

describe("DatePickerCalendarButton", () => {
  it("renders a button with data-slot and default size", () => {
    render(<DatePickerCalendarButton />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-slot", "date-picker-calendar-button")
    expect(button).toHaveAttribute("data-size", "lg")
    expect(button).toHaveAttribute("type", "button")
  })

  it("reflects the size variant via data-size", () => {
    render(<DatePickerCalendarButton size="md" />)
    expect(screen.getByRole("button")).toHaveAttribute("data-size", "md")
  })

  it("passes className through, merged last", () => {
    render(<DatePickerCalendarButton className="custom-button" />)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-button")
    expect(button).toHaveClass("group")
  })

  it("forwards ref to the button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DatePickerCalendarButton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("calls onClick when clicked", () => {
    const onClick = vi.fn()
    render(<DatePickerCalendarButton onClick={onClick} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
