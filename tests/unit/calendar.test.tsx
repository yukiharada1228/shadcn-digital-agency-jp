import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { parseDate } from "@internationalized/date"

import {
  Calendar,
  CalendarButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeading,
  CalendarHeaderCell,
} from "@/components/ui/calendar"

function renderCalendar(
  props: React.ComponentProps<typeof Calendar> = {},
  onChange?: NonNullable<React.ComponentProps<typeof Calendar>["onChange"]>
) {
  return render(
    <Calendar
      aria-label="カレンダー"
      value={parseDate("2025-02-18")}
      onChange={onChange}
      {...props}
    >
      <CalendarGrid>
        <CalendarGridHeader>
          {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => <CalendarCell date={date} />}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  )
}

describe("Calendar", () => {
  it("renders the calendar with data-slot", () => {
    renderCalendar()
    const grid = screen.getByRole("application")
    expect(grid).toHaveAttribute("data-slot", "calendar")
  })

  it("reflects a passed className on the calendar", () => {
    const { container } = renderCalendar({ className: "custom-class" })
    expect(container.querySelector('[data-slot="calendar"]')).toHaveClass(
      "custom-class"
    )
  })

  it("keeps the base layout classes when merging className", () => {
    const { container } = renderCalendar({ className: "custom-class" })
    expect(container.querySelector('[data-slot="calendar"]')).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "w-max"
    )
  })

  it("forwards ref to the calendar element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Calendar
        ref={ref}
        aria-label="カレンダー"
        value={parseDate("2025-02-18")}
      >
        <CalendarGrid>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("sets data-slot on each part", () => {
    const { container } = renderCalendar()
    expect(
      container.querySelector('[data-slot="calendar-grid"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="calendar-grid-header"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="calendar-header-cell"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="calendar-grid-body"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="calendar-cell"]')
    ).toBeInTheDocument()
  })

  it("renders navigation button and heading parts with data-slot", () => {
    const { container } = render(
      <Calendar aria-label="カレンダー" value={parseDate("2025-02-18")}>
        <header>
          <CalendarButton slot="previous">前へ</CalendarButton>
          <CalendarHeading />
          <CalendarButton slot="next">次へ</CalendarButton>
        </header>
        <CalendarGrid>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    )

    expect(
      container.querySelectorAll('[data-slot="calendar-button"]')
    ).toHaveLength(2)
    expect(
      container.querySelector('[data-slot="calendar-heading"]')
    ).toBeInTheDocument()
  })

  it("marks the selected date cell with data-selected", () => {
    renderCalendar()
    const selected = screen.getByRole("button", {
      name: /February 18, 2025/,
    })
    expect(selected).toHaveAttribute("data-selected", "true")
  })

  it("calls onChange when a day is selected", () => {
    const onChange = vi.fn()
    renderCalendar({}, onChange)
    const cell = screen.getByRole("button", { name: /February 20, 2025/ })
    fireEvent.click(cell)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].toString()).toBe("2025-02-20")
  })

  it("passes className through to the grid cell", () => {
    const { container } = render(
      <Calendar aria-label="カレンダー" value={parseDate("2025-02-18")}>
        <CalendarGrid className="custom-grid">
          <CalendarGridBody>
            {(date) => <CalendarCell className="custom-cell" date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    )
    expect(container.querySelector('[data-slot="calendar-grid"]')).toHaveClass(
      "custom-grid"
    )
    expect(container.querySelector('[data-slot="calendar-cell"]')).toHaveClass(
      "custom-cell"
    )
  })
})
