import { render } from "@testing-library/react"
import { axe } from "../axe"

import { Blockquote } from "@/components/ui/blockquote"

describe("Blockquote accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Blockquote>
        <p>引用文のサンプルです。</p>
      </Blockquote>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
