import { render } from "@testing-library/react"
import { axe } from "../axe"

import { Dd, Dl, Dt } from "@/components/ui/dl"

describe("Dl accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Dl marker="bullet">
        <Dt>申請期限</Dt>
        <Dd>2026年7月31日</Dd>
        <Dt>対象者</Dt>
        <Dd>日本国内に居住する申請者</Dd>
      </Dl>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
