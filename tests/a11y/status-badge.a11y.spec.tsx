import { render } from "@testing-library/react"
import { axe } from "../axe"

import { StatusBadge } from "@/components/ui/status-badge"

describe("StatusBadge accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<StatusBadge>受付済み</StatusBadge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
