import { render } from "@testing-library/react"
import { axe } from "../axe"

import { Divider } from "@/components/ui/divider"

describe("Divider accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Divider />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
