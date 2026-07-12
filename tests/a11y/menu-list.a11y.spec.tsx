import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  MenuList,
  MenuListItem,
  MenuListItemButton,
  MenuListItemLink,
} from "@/components/ui/menu-list"

describe("MenuList accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <nav aria-label="メニュー">
        <MenuList>
          <MenuListItem>
            <MenuListItemLink type="standard" size="regular" href="#one">
              メニュー項目1
            </MenuListItemLink>
          </MenuListItem>
          <MenuListItem>
            <MenuListItemButton
              type="standard"
              size="regular"
              aria-expanded={true}
            >
              メニュー項目2
            </MenuListItemButton>
            <MenuList indent={1}>
              <MenuListItem>
                <MenuListItemLink
                  type="standard"
                  size="regular"
                  href="#two"
                  current
                  aria-current="page"
                >
                  メニュー項目2-1
                </MenuListItemLink>
              </MenuListItem>
            </MenuList>
          </MenuListItem>
        </MenuList>
      </nav>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes button and link roles", () => {
    render(
      <MenuList>
        <MenuListItem>
          <MenuListItemButton type="standard" size="regular">
            action
          </MenuListItemButton>
        </MenuListItem>
        <MenuListItem>
          <MenuListItemLink type="standard" size="regular" href="#">
            navigate
          </MenuListItemLink>
        </MenuListItem>
      </MenuList>
    )
    expect(screen.getByRole("button", { name: "action" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "navigate" })).toBeInTheDocument()
  })
})
