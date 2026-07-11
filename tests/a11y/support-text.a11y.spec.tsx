import { render } from "@testing-library/react"
import { axe } from "../axe"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SupportText } from "@/components/ui/support-text"

describe("SupportText accessibility", () => {
  it("has no axe violations when associated with a control", async () => {
    const { container } = render(
      <>
        <Label htmlFor="postal-code">郵便番号</Label>
        <Input id="postal-code" aria-describedby="postal-code-help" />
        <SupportText id="postal-code-help">
          ハイフンなしの7桁で入力してください。
        </SupportText>
      </>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
