import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

describe("Input accessibility", () => {
  it("has no axe violations when labelled", async () => {
    const { container } = render(
      <>
        <Label htmlFor="full-name">氏名</Label>
        <Input id="full-name" />
      </>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=textbox with its label", () => {
    render(
      <>
        <Label htmlFor="full-name">氏名</Label>
        <Input id="full-name" />
      </>
    )
    expect(screen.getByRole("textbox", { name: "氏名" })).toBeInTheDocument()
  })
})
