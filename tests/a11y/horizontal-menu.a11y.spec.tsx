import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  HorizontalMenu,
  HorizontalMenuItem,
  HorizontalMenuItemLink,
  HorizontalMenuItemButton,
} from "@/components/ui/horizontal-menu"

describe("HorizontalMenu accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <nav aria-label="メインナビゲーション">
        <HorizontalMenu>
          <HorizontalMenuItem>
            <HorizontalMenuItemLink href="#" aria-current="true">
              メニュー1
            </HorizontalMenuItemLink>
          </HorizontalMenuItem>
          <HorizontalMenuItem>
            <HorizontalMenuItemLink href="#">メニュー2</HorizontalMenuItemLink>
          </HorizontalMenuItem>
          <HorizontalMenuItem>
            <HorizontalMenuItemButton aria-expanded={false}>
              メニュー3
            </HorizontalMenuItemButton>
          </HorizontalMenuItem>
        </HorizontalMenu>
      </nav>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes link and button roles", () => {
    render(
      <nav aria-label="メインナビゲーション">
        <HorizontalMenu>
          <HorizontalMenuItem>
            <HorizontalMenuItemLink href="#">メニュー1</HorizontalMenuItemLink>
          </HorizontalMenuItem>
          <HorizontalMenuItem>
            <HorizontalMenuItemButton>メニュー2</HorizontalMenuItemButton>
          </HorizontalMenuItem>
        </HorizontalMenu>
      </nav>
    )
    expect(screen.getByRole("link", { name: "メニュー1" })).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "メニュー2" })
    ).toBeInTheDocument()
  })
})
