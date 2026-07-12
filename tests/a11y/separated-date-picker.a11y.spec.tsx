import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  SeparatedDatePicker,
  SeparatedDatePickerYear,
  SeparatedDatePickerMonth,
  SeparatedDatePickerDate,
  SeparatedDatePickerCalendarButton,
} from "@/components/ui/separated-date-picker"

describe("SeparatedDatePicker accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <SeparatedDatePicker>
        {(rest) => (
          <>
            <SeparatedDatePickerYear aria-label="年" {...rest} />
            <SeparatedDatePickerMonth aria-label="月" {...rest} />
            <SeparatedDatePickerDate aria-label="日" {...rest} />
            <SeparatedDatePickerCalendarButton />
          </>
        )}
      </SeparatedDatePicker>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations when disabled", async () => {
    const { container } = render(
      <SeparatedDatePicker isDisabled>
        {(rest) => (
          <>
            <SeparatedDatePickerYear aria-label="年" {...rest} />
            <SeparatedDatePickerMonth aria-label="月" {...rest} />
            <SeparatedDatePickerDate aria-label="日" {...rest} />
          </>
        )}
      </SeparatedDatePicker>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes textbox roles for the date fields", () => {
    render(
      <SeparatedDatePicker>
        {(rest) => (
          <>
            <SeparatedDatePickerYear aria-label="年" {...rest} />
            <SeparatedDatePickerMonth aria-label="月" {...rest} />
            <SeparatedDatePickerDate aria-label="日" {...rest} />
          </>
        )}
      </SeparatedDatePicker>
    )
    expect(screen.getByRole("textbox", { name: "年" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "月" })).toBeInTheDocument()
    expect(screen.getByRole("textbox", { name: "日" })).toBeInTheDocument()
  })

  it("exposes role=button for the calendar button", () => {
    render(<SeparatedDatePickerCalendarButton />)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })
})
