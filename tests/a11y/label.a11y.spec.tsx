import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { Label } from "@/components/ui/label"

describe("Label accessibility", () => {
  it("has no axe violations when associated with a control", async () => {
    const { container } = render(
      <>
        <Label htmlFor="search">検索キーワード</Label>
        <input id="search" type="search" />
      </>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("names its associated control", () => {
    render(
      <>
        <Label htmlFor="search">検索キーワード</Label>
        <input id="search" type="search" />
      </>
    )
    expect(
      screen.getByRole("searchbox", { name: "検索キーワード" })
    ).toBeInTheDocument()
  })
})
