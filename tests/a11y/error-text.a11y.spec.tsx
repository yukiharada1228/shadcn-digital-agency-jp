import { render } from "@testing-library/react"
import { axe } from "../axe"

import { ErrorText } from "@/components/ui/error-text"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

describe("ErrorText accessibility", () => {
  it("has no axe violations when associated with a control", async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          aria-describedby="email-error"
          isError
          defaultValue="invalid"
        />
        <ErrorText id="email-error">
          メールアドレスの形式で入力してください。
        </ErrorText>
      </>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
