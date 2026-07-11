import { render } from "@testing-library/react"
import { axe } from "../axe"

import { ChipLabel } from "@/components/ui/chip-label"

describe("ChipLabel accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<ChipLabel>受付中</ChipLabel>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
