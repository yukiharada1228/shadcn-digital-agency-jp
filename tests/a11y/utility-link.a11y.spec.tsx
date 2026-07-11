import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { UtilityLink } from "@/components/ui/utility-link"

describe("UtilityLink accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <UtilityLink href="https://www.digital.go.jp/" target="_blank">
        関連情報
      </UtilityLink>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=link", () => {
    render(<UtilityLink href="/help">ヘルプ</UtilityLink>)
    expect(screen.getByRole("link", { name: "ヘルプ" })).toBeInTheDocument()
  })
})
