import { render } from "@testing-library/react"
import { axe } from "../axe"

import { Legend } from "@/components/ui/legend"

describe("Legend accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <fieldset>
        <Legend>凡例</Legend>
      </fieldset>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("renders a legend element", () => {
    const { getByText } = render(
      <fieldset>
        <Legend>凡例</Legend>
      </fieldset>
    )
    expect(getByText("凡例").tagName).toBe("LEGEND")
  })
})
