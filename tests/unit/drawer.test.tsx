import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerHeader,
  DrawerMenuLink,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

describe("Drawer", () => {
  it("renders the dialog with data-slot", () => {
    render(
      <Drawer open>
        <DrawerTitle>タイトル</DrawerTitle>
      </Drawer>
    )
    const dialog = screen.getByRole("dialog", { hidden: true })
    expect(dialog).toHaveAttribute("data-slot", "drawer")
  })

  it("defaults data-side to full", () => {
    render(<Drawer open />)
    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute(
      "data-side",
      "full"
    )
  })

  it("reflects the side prop via data-side and variant classes", () => {
    render(<Drawer open side="right" />)
    const dialog = screen.getByRole("dialog", { hidden: true })
    expect(dialog).toHaveAttribute("data-side", "right")
    expect(dialog).toHaveClass("w-72")
    expect(dialog).toHaveClass("shadow-2")
  })

  it("merges a passed className onto the dialog", () => {
    render(<Drawer open className="custom-class" />)
    expect(screen.getByRole("dialog", { hidden: true })).toHaveClass(
      "custom-class"
    )
  })

  it("forwards ref to the dialog element", () => {
    const ref = React.createRef<HTMLDialogElement>()
    render(<Drawer ref={ref} open />)
    expect(ref.current).toBeInstanceOf(HTMLDialogElement)
  })

  it("renders the trigger with the default label", () => {
    render(<DrawerTrigger />)
    const trigger = screen.getByRole("button")
    expect(trigger).toHaveAttribute("data-slot", "drawer-trigger")
    expect(trigger).toHaveTextContent("メニュー")
  })

  it("accepts a custom trigger label", () => {
    render(<DrawerTrigger label="開く" />)
    expect(screen.getByRole("button")).toHaveTextContent("開く")
  })

  it("forwards the trigger onClick handler", () => {
    const onClick = vi.fn()
    render(<DrawerTrigger onClick={onClick} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders the close button with the default label", () => {
    render(<DrawerClose />)
    const close = screen.getByRole("button")
    expect(close).toHaveAttribute("data-slot", "drawer-close")
    expect(close).toHaveTextContent("閉じる")
  })

  it("forwards ref to the trigger button", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<DrawerTrigger ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("renders the header with data-slot and merges className", () => {
    render(<DrawerHeader className="custom-header" data-testid="h" />)
    const header = screen.getByTestId("h")
    expect(header).toHaveAttribute("data-slot", "drawer-header")
    expect(header).toHaveClass("custom-header")
  })

  it("renders the title as an h2 with data-slot", () => {
    render(<DrawerTitle>見出し</DrawerTitle>)
    const title = screen.getByRole("heading", { level: 2 })
    expect(title).toHaveAttribute("data-slot", "drawer-title")
    expect(title).toHaveTextContent("見出し")
  })

  it("renders the body as a list with data-slot", () => {
    render(<DrawerBody data-testid="body" />)
    const body = screen.getByTestId("body")
    expect(body.tagName).toBe("UL")
    expect(body).toHaveAttribute("data-slot", "drawer-body")
  })

  it("renders a menu link as an anchor with data-slot", () => {
    render(<DrawerMenuLink href="/foo">リンク</DrawerMenuLink>)
    const link = screen.getByRole("link", { name: "リンク" })
    expect(link).toHaveAttribute("data-slot", "drawer-menu-link")
    expect(link).toHaveAttribute("href", "/foo")
  })

  it("forwards ref to the menu link element", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(<DrawerMenuLink ref={ref} href="/foo" />)
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })
})
