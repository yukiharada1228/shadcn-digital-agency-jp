import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"

import { Checkbox } from "@/components/ui/checkbox"

describe("Checkbox accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Checkbox aria-label="同意する" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=checkbox", () => {
    render(<Checkbox aria-label="同意する" />)
    expect(
      screen.getByRole("checkbox", { name: "同意する" })
    ).toBeInTheDocument()
  })
})
