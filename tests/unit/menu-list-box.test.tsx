import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  MenuListBox,
  MenuListBoxOpener,
  MenuListBoxPopup,
  useMenuListBox,
  type MenuItemSelectDetail,
} from "@/components/ui/menu-list-box"

function Menu({
  onMenuItemSelect,
  labels = ["項目1", "項目2", "項目3"],
}: {
  onMenuItemSelect?: (detail: MenuItemSelectDetail) => void
  labels?: string[]
}) {
  const { isOpen, rootProps, openerProps, popupProps } = useMenuListBox({
    onMenuItemSelect,
  })

  return (
    <MenuListBox {...rootProps}>
      <MenuListBoxOpener
        {...openerProps}
        id="opener"
        aria-controls="menu"
        size="sm"
        buttonStyle="text"
      >
        メニュー
      </MenuListBoxOpener>
      {isOpen && (
        <MenuListBoxPopup {...popupProps}>
          <ul id="menu" role="menu" aria-labelledby="opener">
            {labels.map((label) => (
              <li key={label} role="presentation">
                <button type="button" role="menuitem" tabIndex={-1}>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </MenuListBoxPopup>
      )}
    </MenuListBox>
  )
}

describe("MenuListBox", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(
      <MenuListBox>
        <span>child</span>
      </MenuListBox>
    )
    expect(
      container.querySelector('[data-slot="menu-list-box"]')
    ).toBeInTheDocument()
  })

  it("passes className through on the root", () => {
    const { container } = render(<MenuListBox className="custom-root" />)
    expect(container.querySelector('[data-slot="menu-list-box"]')).toHaveClass(
      "custom-root"
    )
  })

  it("forwards ref on the root", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<MenuListBox ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("renders the opener as a button with data-slot and haspopup", () => {
    render(
      <MenuListBoxOpener size="sm" buttonStyle="text">
        メニュー
      </MenuListBoxOpener>
    )
    const opener = screen.getByRole("button")
    expect(opener).toHaveAttribute("data-slot", "menu-list-box-opener")
    expect(opener).toHaveAttribute("type", "button")
    expect(opener).toHaveAttribute("aria-haspopup", "menu")
  })

  it("reflects size, buttonStyle and fontWeight via data attributes", () => {
    render(
      <MenuListBoxOpener size="md" buttonStyle="filled" fontWeight="bold">
        メニュー
      </MenuListBoxOpener>
    )
    const opener = screen.getByRole("button")
    expect(opener).toHaveAttribute("data-size", "md")
    expect(opener).toHaveAttribute("data-style", "filled")
    expect(opener).toHaveAttribute("data-text-weight", "bold")
  })

  it("defaults fontWeight to normal", () => {
    render(
      <MenuListBoxOpener size="sm" buttonStyle="outlined">
        メニュー
      </MenuListBoxOpener>
    )
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-text-weight",
      "normal"
    )
  })

  it("passes className through and forwards ref on the opener", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <MenuListBoxOpener
        ref={ref}
        size="sm"
        buttonStyle="text"
        className="custom-opener"
      >
        メニュー
      </MenuListBoxOpener>
    )
    const opener = screen.getByRole("button")
    expect(opener).toHaveClass("custom-opener")
    expect(ref.current).toBe(opener)
  })

  it("renders the popup with data-slot, className and forwarded ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <MenuListBoxPopup ref={ref} className="custom-popup">
        <span>content</span>
      </MenuListBoxPopup>
    )
    const popup = container.querySelector('[data-slot="menu-list-box-popup"]')
    expect(popup).toBeInTheDocument()
    expect(popup).toHaveClass("custom-popup")
    expect(ref.current).toBe(popup)
  })

  it("toggles the popup open and closed via the opener", () => {
    render(<Menu />)
    const opener = screen.getByRole("button", { name: /メニュー/ })
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    expect(opener).toHaveAttribute("aria-expanded", "false")

    fireEvent.click(opener)
    expect(screen.getByRole("menu")).toBeInTheDocument()
    expect(opener).toHaveAttribute("aria-expanded", "true")

    fireEvent.click(opener)
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("opens on ArrowDown and focuses the first item", () => {
    render(<Menu />)
    const opener = screen.getByRole("button", { name: /メニュー/ })
    fireEvent.keyDown(opener, { key: "ArrowDown" })
    const items = screen.getAllByRole("menuitem")
    expect(document.activeElement).toBe(items[0])
  })

  it("opens on ArrowUp and focuses the last item", () => {
    render(<Menu />)
    const opener = screen.getByRole("button", { name: /メニュー/ })
    fireEvent.keyDown(opener, { key: "ArrowUp" })
    const items = screen.getAllByRole("menuitem")
    expect(document.activeElement).toBe(items[items.length - 1])
  })

  it("calls onMenuItemSelect with value and index and closes", () => {
    const onMenuItemSelect = vi.fn()
    render(<Menu onMenuItemSelect={onMenuItemSelect} />)
    fireEvent.click(screen.getByRole("button", { name: /メニュー/ }))
    fireEvent.click(screen.getByText("項目2"))
    expect(onMenuItemSelect).toHaveBeenCalledWith({
      selectedValue: "項目2",
      selectedIndex: 1,
    })
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
  })

  it("navigates items with ArrowDown/ArrowUp/Home/End", () => {
    render(<Menu />)
    fireEvent.click(screen.getByRole("button", { name: /メニュー/ }))
    const items = screen.getAllByRole("menuitem")
    const menu = screen.getByRole("menu")

    expect(document.activeElement).toBe(items[0])
    fireEvent.keyDown(menu, { key: "ArrowDown" })
    expect(document.activeElement).toBe(items[1])
    fireEvent.keyDown(menu, { key: "End" })
    expect(document.activeElement).toBe(items[items.length - 1])
    fireEvent.keyDown(menu, { key: "ArrowUp" })
    expect(document.activeElement).toBe(items[items.length - 2])
    fireEvent.keyDown(menu, { key: "Home" })
    expect(document.activeElement).toBe(items[0])
  })

  it("closes on Escape and returns focus to the opener", () => {
    render(<Menu />)
    const opener = screen.getByRole("button", { name: /メニュー/ })
    fireEvent.click(opener)
    expect(screen.getByRole("menu")).toBeInTheDocument()
    fireEvent.keyDown(document, { key: "Escape" })
    expect(screen.queryByRole("menu")).not.toBeInTheDocument()
    expect(document.activeElement).toBe(opener)
  })
})
