import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  HorizontalMenu,
  HorizontalMenuItem,
  HorizontalMenuItemLink,
  HorizontalMenuItemButton,
} from "@/components/ui/horizontal-menu"

describe("HorizontalMenu", () => {
  it("renders a ul with data-slot", () => {
    const { container } = render(
      <HorizontalMenu>
        <li>item</li>
      </HorizontalMenu>
    )
    const ul = container.querySelector("ul")
    expect(ul).not.toBeNull()
    expect(ul).toHaveAttribute("data-slot", "horizontal-menu")
  })

  it("renders its children", () => {
    render(
      <HorizontalMenu>
        <li>hello world</li>
      </HorizontalMenu>
    )
    expect(screen.getByText("hello world")).not.toBeNull()
  })

  it("merges a passed className", () => {
    const { container } = render(
      <HorizontalMenu className="custom-class">
        <li>item</li>
      </HorizontalMenu>
    )
    expect(container.querySelector("ul")?.className).toContain("custom-class")
  })

  it("forwards ref to the underlying ul element", () => {
    const ref = React.createRef<HTMLUListElement>()
    render(
      <HorizontalMenu ref={ref}>
        <li>item</li>
      </HorizontalMenu>
    )
    expect(ref.current).toBeInstanceOf(HTMLUListElement)
  })
})

describe("HorizontalMenuItem", () => {
  it("renders a li with data-slot", () => {
    const { container } = render(<HorizontalMenuItem>item</HorizontalMenuItem>)
    const li = container.querySelector("li")
    expect(li).not.toBeNull()
    expect(li).toHaveAttribute("data-slot", "horizontal-menu-item")
  })

  it("merges a passed className", () => {
    const { container } = render(
      <HorizontalMenuItem className="custom-class">item</HorizontalMenuItem>
    )
    expect(container.querySelector("li")?.className).toContain("custom-class")
  })

  it("forwards ref to the underlying li element", () => {
    const ref = React.createRef<HTMLLIElement>()
    render(<HorizontalMenuItem ref={ref}>item</HorizontalMenuItem>)
    expect(ref.current).toBeInstanceOf(HTMLLIElement)
  })
})

describe("HorizontalMenuItemLink", () => {
  it("renders an anchor with data-slot and href", () => {
    render(
      <HorizontalMenuItemLink href="#target">メニュー1</HorizontalMenuItemLink>
    )
    const link = screen.getByRole("link", { name: "メニュー1" })
    expect(link).toHaveAttribute("data-slot", "horizontal-menu-item-link")
    expect(link).toHaveAttribute("href", "#target")
  })

  it("reflects aria-current for the current page", () => {
    render(
      <HorizontalMenuItemLink href="#" aria-current="true">
        現在
      </HorizontalMenuItemLink>
    )
    expect(screen.getByRole("link")).toHaveAttribute("aria-current", "true")
  })

  it("merges a passed className", () => {
    render(
      <HorizontalMenuItemLink href="#" className="custom-class">
        item
      </HorizontalMenuItemLink>
    )
    expect(screen.getByRole("link").className).toContain("custom-class")
  })

  it("forwards ref to the underlying anchor element", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <HorizontalMenuItemLink href="#" ref={ref}>
        item
      </HorizontalMenuItemLink>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })
})

describe("HorizontalMenuItemButton", () => {
  it("renders a button of type button with data-slot", () => {
    render(<HorizontalMenuItemButton>メニュー</HorizontalMenuItemButton>)
    const button = screen.getByRole("button", { name: "メニュー" })
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveAttribute("data-slot", "horizontal-menu-item-button")
  })

  it("reflects aria-expanded for submenu state", () => {
    render(
      <HorizontalMenuItemButton aria-expanded={true}>
        メニュー
      </HorizontalMenuItemButton>
    )
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true")
  })

  it("fires onClick when clicked", () => {
    const onClick = vi.fn()
    render(
      <HorizontalMenuItemButton onClick={onClick}>
        メニュー
      </HorizontalMenuItemButton>
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("merges a passed className", () => {
    render(
      <HorizontalMenuItemButton className="custom-class">
        item
      </HorizontalMenuItemButton>
    )
    expect(screen.getByRole("button").className).toContain("custom-class")
  })

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<HorizontalMenuItemButton ref={ref}>item</HorizontalMenuItemButton>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
