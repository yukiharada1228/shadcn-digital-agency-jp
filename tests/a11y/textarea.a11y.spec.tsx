import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

describe("Textarea accessibility", () => {
  it("has no axe violations when labelled", async () => {
    const { container } = render(
      <>
        <Label htmlFor="message">お問い合わせ内容</Label>
        <Textarea id="message" />
      </>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=textbox with its label", () => {
    render(
      <>
        <Label htmlFor="message">お問い合わせ内容</Label>
        <Textarea id="message" />
      </>
    )
    expect(
      screen.getByRole("textbox", { name: "お問い合わせ内容" })
    ).toBeInTheDocument()
  })
})
