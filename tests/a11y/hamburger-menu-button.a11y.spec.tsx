import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  HamburgerMenuButton,
  HamburgerIcon,
} from "@/components/ui/hamburger-menu-button"

describe("HamburgerMenuButton accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <HamburgerMenuButton aria-controls="menu" aria-expanded={false}>
        <HamburgerIcon className="mt-0.5 flex-none" />
        メニュー
      </HamburgerMenuButton>
    )
    expect(screen.getByRole("button", { name: "メニュー" })).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
