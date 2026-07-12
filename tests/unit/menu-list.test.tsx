import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  MenuList,
  MenuListItem,
  MenuListItemButton,
  MenuListItemLink,
} from "@/components/ui/menu-list"

describe("MenuList", () => {
  it("renders a ul with data-slot", () => {
    const { container } = render(
      <MenuList>
        <MenuListItem>item</MenuListItem>
      </MenuList>
    )
    const ul = container.querySelector("ul")
    expect(ul).not.toBeNull()
    expect(ul).toHaveAttribute("data-slot", "menu-list")
  })

  it("renders its children", () => {
    render(
      <MenuList>
        <MenuListItem>hello world</MenuListItem>
      </MenuList>
    )
    expect(screen.getByText("hello world")).not.toBeNull()
  })

  it("sets the --menu-list-indentation custom property when indent is passed", () => {
    const { container } = render(
      <MenuList indent={2}>
        <MenuListItem>item</MenuListItem>
      </MenuList>
    )
    const ul = container.querySelector("ul")
    expect(ul?.style.getPropertyValue("--menu-list-indentation")).toBe("2")
  })

  it("does not set the custom property when indent is undefined", () => {
    const { container } = render(
      <MenuList>
        <MenuListItem>item</MenuListItem>
      </MenuList>
    )
    const ul = container.querySelector("ul")
    expect(ul?.style.getPropertyValue("--menu-list-indentation")).toBe("")
  })

  it("merges a passed className", () => {
    const { container } = render(
      <MenuList className="custom-class">
        <MenuListItem>item</MenuListItem>
      </MenuList>
    )
    const ul = container.querySelector("ul")
    expect(ul?.className).toContain("custom-class")
  })

  it("forwards ref to the underlying ul element", () => {
    const ref = React.createRef<HTMLUListElement>()
    render(
      <MenuList ref={ref}>
        <MenuListItem>item</MenuListItem>
      </MenuList>
    )
    expect(ref.current).toBeInstanceOf(HTMLUListElement)
  })
})

describe("MenuListItem", () => {
  it("renders an li with data-slot and forwards ref", () => {
    const ref = React.createRef<HTMLLIElement>()
    const { container } = render(<MenuListItem ref={ref}>content</MenuListItem>)
    const li = container.querySelector("li")
    expect(li).toHaveAttribute("data-slot", "menu-list-item")
    expect(ref.current).toBeInstanceOf(HTMLLIElement)
  })

  it("merges a passed className", () => {
    const { container } = render(
      <MenuListItem className="custom-class">content</MenuListItem>
    )
    expect(container.querySelector("li")?.className).toContain("custom-class")
  })
})

describe("MenuListItemButton", () => {
  it("renders a button with data-slot and type=button", () => {
    render(
      <MenuListItemButton type="standard" size="regular">
        label
      </MenuListItemButton>
    )
    const button = screen.getByRole("button", { name: "label" })
    expect(button).toHaveAttribute("data-slot", "menu-list-item-button")
    expect(button).toHaveAttribute("type", "button")
  })

  it("reflects the type and size props via data attributes", () => {
    render(
      <MenuListItemButton type="box" size="small">
        label
      </MenuListItemButton>
    )
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-type", "box")
    expect(button).toHaveAttribute("data-size", "small")
  })

  it("sets data-current when current is true", () => {
    render(
      <MenuListItemButton type="standard" size="regular" current>
        label
      </MenuListItemButton>
    )
    expect(screen.getByRole("button")).toHaveAttribute("data-current", "")
  })

  it("omits data-current when current is false", () => {
    render(
      <MenuListItemButton type="standard" size="regular" current={false}>
        label
      </MenuListItemButton>
    )
    expect(screen.getByRole("button")).not.toHaveAttribute("data-current")
  })

  it("fires onClick when clicked", () => {
    const onClick = vi.fn()
    render(
      <MenuListItemButton type="standard" size="regular" onClick={onClick}>
        label
      </MenuListItemButton>
    )
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("merges a passed className and forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <MenuListItemButton
        type="standard"
        size="regular"
        className="custom-class"
        ref={ref}
      >
        label
      </MenuListItemButton>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(screen.getByRole("button").className).toContain("custom-class")
  })
})

describe("MenuListItemLink", () => {
  it("renders an anchor with data-slot and data attributes", () => {
    render(
      <MenuListItemLink type="box" size="small" href="#target">
        link
      </MenuListItemLink>
    )
    const link = screen.getByRole("link", { name: "link" })
    expect(link).toHaveAttribute("data-slot", "menu-list-item-link")
    expect(link).toHaveAttribute("data-type", "box")
    expect(link).toHaveAttribute("data-size", "small")
    expect(link).toHaveAttribute("href", "#target")
  })

  it("sets data-current when current is true", () => {
    render(
      <MenuListItemLink type="standard" size="regular" current href="#">
        link
      </MenuListItemLink>
    )
    expect(screen.getByRole("link")).toHaveAttribute("data-current", "")
  })

  it("merges a passed className and forwards ref", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <MenuListItemLink
        type="standard"
        size="regular"
        href="#"
        className="custom-class"
        ref={ref}
      >
        link
      </MenuListItemLink>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(screen.getByRole("link").className).toContain("custom-class")
  })
})
