import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  HamburgerMenuButton,
  HamburgerMenuIconButton,
  HamburgerIcon,
  CloseIcon,
  HamburgerWithLabelIcon,
  CloseWithLabelIcon,
} from "@/components/ui/hamburger-menu-button"

describe("HamburgerMenuButton", () => {
  it("renders as a button with data-slot and type button", () => {
    render(<HamburgerMenuButton>メニュー</HamburgerMenuButton>)
    const button = screen.getByRole("button", { name: "メニュー" })
    expect(button.tagName).toBe("BUTTON")
    expect(button).toHaveAttribute("data-slot", "hamburger-menu-button")
    expect(button).toHaveAttribute("type", "button")
  })

  it("merges className after base classes", () => {
    render(
      <HamburgerMenuButton className="custom-class">Menu</HamburgerMenuButton>
    )
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-class")
    expect(button).toHaveClass("rounded-6")
  })

  it("forwards ref to the button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<HamburgerMenuButton ref={ref}>Ref</HamburgerMenuButton>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("fires onClick and forwards aria props", () => {
    const onClick = vi.fn()
    render(
      <HamburgerMenuButton
        aria-controls="menu-1"
        aria-expanded={false}
        onClick={onClick}
      >
        メニュー
      </HamburgerMenuButton>
    )
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("aria-controls", "menu-1")
    expect(button).toHaveAttribute("aria-expanded", "false")
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

describe("HamburgerMenuIconButton", () => {
  it("renders as a button with data-slot and type button", () => {
    render(
      <HamburgerMenuIconButton aria-label="メニュー">
        <HamburgerWithLabelIcon />
      </HamburgerMenuIconButton>
    )
    const button = screen.getByRole("button", { name: "メニュー" })
    expect(button).toHaveAttribute("data-slot", "hamburger-menu-icon-button")
    expect(button).toHaveAttribute("type", "button")
  })

  it("merges className after base classes and forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <HamburgerMenuIconButton ref={ref} className="custom-class">
        x
      </HamburgerMenuIconButton>
    )
    const button = screen.getByRole("button")
    expect(button).toHaveClass("custom-class")
    expect(button).toHaveClass("rounded-4")
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})

describe("HamburgerIcon", () => {
  it("renders an aria-hidden svg with data-slot", () => {
    const { container } = render(<HamburgerIcon />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("data-slot", "hamburger-icon")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).toHaveAttribute("width", "24")
  })

  it("passes className and forwards ref", () => {
    const ref = React.createRef<SVGSVGElement>()
    const { container } = render(
      <HamburgerIcon ref={ref} className="flex-none" />
    )
    expect(container.querySelector("svg")).toHaveClass("flex-none")
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })
})

describe("CloseIcon", () => {
  it("renders an aria-hidden svg with data-slot", () => {
    const { container } = render(<CloseIcon />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("data-slot", "close-icon")
    expect(svg).toHaveAttribute("aria-hidden", "true")
    expect(svg).toHaveAttribute("viewBox", "0 0 120 120")
  })
})

describe("HamburgerWithLabelIcon", () => {
  it("defaults to Japanese aria-label with role img", () => {
    render(<HamburgerWithLabelIcon />)
    const svg = screen.getByRole("img", { name: "メニュー" })
    expect(svg).toHaveAttribute("data-slot", "hamburger-with-label-icon")
  })

  it("uses English aria-label when isEnglish is true", () => {
    render(<HamburgerWithLabelIcon isEnglish={true} />)
    expect(screen.getByRole("img", { name: "MENU" })).toBeInTheDocument()
  })

  it("allows overriding aria-label", () => {
    render(<HamburgerWithLabelIcon aria-label="開く" />)
    expect(screen.getByRole("img", { name: "開く" })).toBeInTheDocument()
  })
})

describe("CloseWithLabelIcon", () => {
  it("defaults to Japanese aria-label with role img", () => {
    render(<CloseWithLabelIcon />)
    const svg = screen.getByRole("img", { name: "閉じる" })
    expect(svg).toHaveAttribute("data-slot", "close-with-label-icon")
  })

  it("uses English aria-label when isEnglish is true", () => {
    render(<CloseWithLabelIcon isEnglish={true} />)
    expect(screen.getByRole("img", { name: "CLOSE" })).toBeInTheDocument()
  })
})
