import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  MenuListBox,
  MenuListBoxOpener,
  MenuListBoxPopup,
} from "@/components/ui/menu-list-box"

describe("MenuListBox accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <MenuListBox>
        <MenuListBoxOpener
          id="opener"
          aria-controls="menu"
          aria-expanded={true}
          size="sm"
          buttonStyle="text"
        >
          メニュー
        </MenuListBoxOpener>
        <MenuListBoxPopup>
          <ul id="menu" role="menu" aria-labelledby="opener">
            <li role="presentation">
              <button type="button" role="menuitem" tabIndex={-1}>
                項目1
              </button>
            </li>
            <li role="presentation">
              <button type="button" role="menuitem" tabIndex={-1}>
                項目2
              </button>
            </li>
          </ul>
        </MenuListBoxPopup>
      </MenuListBox>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the opener as a button with a menu popup", () => {
    render(
      <MenuListBoxOpener size="sm" buttonStyle="text">
        メニュー
      </MenuListBoxOpener>
    )
    const opener = screen.getByRole("button", { name: /メニュー/ })
    expect(opener).toHaveAttribute("aria-haspopup", "menu")
  })
})
