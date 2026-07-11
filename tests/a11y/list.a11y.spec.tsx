import { render } from "@testing-library/react"
import { axe } from "../axe"

import { List } from "@/components/ui/list"

describe("List accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <List spacing="8">
        <li>本人確認書類</li>
        <li>申請書</li>
      </List>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
