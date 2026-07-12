import { render, screen } from "@testing-library/react"
import { parseDate } from "@internationalized/date"
import { axe } from "../axe"

import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
} from "@/components/ui/calendar"

function renderCalendar() {
  return render(
    <Calendar aria-label="カレンダー" value={parseDate("2025-02-18")}>
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

describe("Calendar accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = renderCalendar()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=application for the calendar", () => {
    renderCalendar()
    expect(
      screen.getByRole("application", { name: /カレンダー/ })
    ).toBeInTheDocument()
  })
})
