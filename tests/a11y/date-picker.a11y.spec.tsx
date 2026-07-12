import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  DatePicker,
  DatePickerCalendarButton,
  DatePickerDate,
  DatePickerMonth,
  DatePickerYear,
} from "@/components/ui/date-picker"

describe("DatePicker accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <>
        <DatePicker>
          {({ yearRef, monthRef, dateRef, ...rest }) => (
            <>
              <DatePickerYear ref={yearRef} aria-label="年" {...rest} />
              <DatePickerMonth ref={monthRef} aria-label="月" {...rest} />
              <DatePickerDate ref={dateRef} aria-label="日" {...rest} />
            </>
          )}
        </DatePicker>
        <DatePickerCalendarButton aria-label="カレンダーを開く" />
      </>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the calendar button with role=button", () => {
    render(<DatePickerCalendarButton aria-label="カレンダーを開く" />)
    expect(
      screen.getByRole("button", { name: "カレンダーを開く" })
    ).toBeInTheDocument()
  })
})
