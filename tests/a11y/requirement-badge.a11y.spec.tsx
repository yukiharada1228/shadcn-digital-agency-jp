import { render } from "@testing-library/react"
import { axe } from "../axe"

import { RequirementBadge } from "@/components/ui/requirement-badge"

describe("RequirementBadge accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<RequirementBadge>※必須</RequirementBadge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
