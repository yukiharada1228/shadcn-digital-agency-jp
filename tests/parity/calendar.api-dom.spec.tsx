import { render, screen } from "@testing-library/react"
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

describe("Calendar API/DOM compatibility", () => {
  it("keeps the upstream React Aria primitive mapping and token classes", () => {
    const { container } = render(
      <Calendar aria-label="カレンダー" value={parseDate("2025-02-18")}>
        <CalendarGrid aria-label="2025年2月">
          <CalendarGridHeader>
            {(day) => <CalendarHeaderCell>{day}</CalendarHeaderCell>}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} />}
          </CalendarGridBody>
        </CalendarGrid>
      </Calendar>
    )

    const calendar = screen.getByRole("application", { name: /カレンダー/ })
    const grid = container.querySelector('[data-slot="calendar-grid"]')
    const headerCell = container.querySelector(
      '[data-slot="calendar-header-cell"]'
    )
    const selectedCell = screen.getByRole("button", {
      name: /February 18, 2025/,
    })

    expect(calendar).toHaveAttribute("data-slot", "calendar")
    expect(calendar).toHaveClass("flex", "flex-col", "items-center", "w-max")

    expect(grid?.tagName).toBe("TABLE")
    expect(grid).toHaveClass("mx-3", "mb-2")

    expect(headerCell?.tagName).toBe("TH")
    expect(headerCell).toHaveClass("size-12", "text-center", "font-bold")

    expect(selectedCell).toHaveAttribute("data-slot", "calendar-cell")
    expect(selectedCell).toHaveAttribute("data-selected", "true")
    expect(selectedCell).toHaveClass("size-10", "rounded-full")
  })

  it("documents local navigation wrappers around React Aria primitives", () => {
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

    const buttons = container.querySelectorAll('[data-slot="calendar-button"]')
    const heading = container.querySelector('[data-slot="calendar-heading"]')

    expect(buttons).toHaveLength(2)
    expect(buttons[0]?.tagName).toBe("BUTTON")
    expect(buttons[0]).toHaveClass("rounded-4", "px-2", "py-1")
    expect(buttons[0]?.className).toContain("hover:bg-solid-gray-50")

    expect(heading?.tagName).toMatch(/^H[1-6]$/)
    expect(heading).toHaveClass("font-bold")
  })
})
