import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  LanguageSelector,
  LanguageSelectorButton,
  LanguageSelectorMenu,
  LanguageSelectorMenuItem,
  LanguageSelectorArrowIcon,
  LanguageSelectorGlobeIcon,
  LanguageSelectorGlobeWithLabelIcon,
} from "@/components/ui/language-selector"

describe("LanguageSelector", () => {
  it("renders a div with data-slot and the group/relative base classes", () => {
    const { container } = render(<LanguageSelector>content</LanguageSelector>)
    const root = container.querySelector('[data-slot="language-selector"]')
    expect(root).not.toBeNull()
    expect(root?.tagName).toBe("DIV")
    expect(root?.className).toContain("group")
    expect(root?.className).toContain("relative")
  })

  it("merges a passed className last", () => {
    const { container } = render(
      <LanguageSelector className="custom-class">x</LanguageSelector>
    )
    const root = container.querySelector('[data-slot="language-selector"]')
    expect(root?.className).toContain("custom-class")
    expect(root?.className).toContain("group")
  })

  it("forwards ref to the underlying div", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<LanguageSelector ref={ref}>x</LanguageSelector>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("LanguageSelectorButton", () => {
  it("renders a type=button with data-slot", () => {
    render(<LanguageSelectorButton>Language</LanguageSelectorButton>)
    const button = screen.getByRole("button", { name: "Language" })
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveAttribute("data-slot", "language-selector-button")
  })

  it("fires onClick", () => {
    const onClick = vi.fn()
    render(<LanguageSelectorButton onClick={onClick}>L</LanguageSelectorButton>)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("forwards ref and merges className", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <LanguageSelectorButton ref={ref} className="custom-class">
        L
      </LanguageSelectorButton>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
    expect(ref.current?.className).toContain("custom-class")
  })
})

describe("LanguageSelectorMenu", () => {
  it("renders a ul with data-slot and the default max-height", () => {
    const { container } = render(
      <LanguageSelectorMenu>
        <li>a</li>
      </LanguageSelectorMenu>
    )
    const ul = container.querySelector('[data-slot="language-selector-menu"]')
    expect(ul?.tagName).toBe("UL")
    expect(ul?.className).toContain("max-h-[calc((44*6.5+16)/16*1rem)]")
  })

  it("applies the condensed max-height when isCondensed is set", () => {
    const { container } = render(
      <LanguageSelectorMenu isCondensed>
        <li>a</li>
      </LanguageSelectorMenu>
    )
    const ul = container.querySelector('[data-slot="language-selector-menu"]')
    expect(ul?.className).toContain("max-h-[calc((36*6.5+16)/16*1rem)]")
  })

  it("does not leak isCondensed onto the DOM element", () => {
    const { container } = render(
      <LanguageSelectorMenu isCondensed>
        <li>a</li>
      </LanguageSelectorMenu>
    )
    const ul = container.querySelector('[data-slot="language-selector-menu"]')
    expect(ul?.hasAttribute("iscondensed")).toBe(false)
  })

  it("forwards ref and merges className", () => {
    const ref = React.createRef<HTMLUListElement>()
    render(
      <LanguageSelectorMenu ref={ref} className="custom-class">
        <li>a</li>
      </LanguageSelectorMenu>
    )
    expect(ref.current).toBeInstanceOf(HTMLUListElement)
    expect(ref.current?.className).toContain("custom-class")
  })
})

describe("LanguageSelectorMenuItem", () => {
  it("renders an anchor with data-slot inside an li", () => {
    render(
      <LanguageSelectorMenuItem href="#en">English</LanguageSelectorMenuItem>
    )
    const link = screen.getByRole("link", { name: "English" })
    expect(link).toHaveAttribute("data-slot", "language-selector-menu-item")
    expect(link).toHaveAttribute("href", "#en")
    expect(link.parentElement?.tagName).toBe("LI")
  })

  it("marks the current item with aria-current and data-current", () => {
    render(
      <LanguageSelectorMenuItem href="#ja" isCurrent>
        日本語
      </LanguageSelectorMenuItem>
    )
    const link = screen.getByRole("link", { name: "日本語" })
    expect(link).toHaveAttribute("aria-current", "true")
    expect(link).toHaveAttribute("data-current", "true")
  })

  it("omits data-current when not current", () => {
    render(
      <LanguageSelectorMenuItem href="#en">English</LanguageSelectorMenuItem>
    )
    const link = screen.getByRole("link", { name: "English" })
    expect(link).not.toHaveAttribute("data-current")
  })

  it("sets data-condensed when isCondensed is set", () => {
    render(
      <LanguageSelectorMenuItem href="#en" isCondensed>
        English
      </LanguageSelectorMenuItem>
    )
    const link = screen.getByRole("link", { name: "English" })
    expect(link).toHaveAttribute("data-condensed", "true")
  })

  it("fires onKeyDown", () => {
    const onKeyDown = vi.fn()
    render(
      <LanguageSelectorMenuItem href="#en" onKeyDown={onKeyDown}>
        English
      </LanguageSelectorMenuItem>
    )
    fireEvent.keyDown(screen.getByRole("link"), { key: "Escape" })
    expect(onKeyDown).toHaveBeenCalledTimes(1)
  })

  it("forwards ref to the anchor and merges className", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <LanguageSelectorMenuItem ref={ref} href="#en" className="custom-class">
        English
      </LanguageSelectorMenuItem>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(ref.current?.className).toContain("custom-class")
  })
})

describe("LanguageSelector icons", () => {
  it("renders the arrow icon with data-slot and merges className", () => {
    const { container } = render(
      <LanguageSelectorArrowIcon className="rotate-180" />
    )
    const svg = container.querySelector(
      '[data-slot="language-selector-arrow-icon"]'
    )
    expect(svg?.tagName.toLowerCase()).toBe("svg")
    expect(svg?.getAttribute("aria-hidden")).toBe("true")
    expect(svg?.getAttribute("class")).toContain("rotate-180")
  })

  it("renders the globe icon with data-slot", () => {
    const { container } = render(<LanguageSelectorGlobeIcon />)
    const svg = container.querySelector(
      '[data-slot="language-selector-globe-icon"]'
    )
    expect(svg?.getAttribute("aria-hidden")).toBe("true")
  })

  it("renders the globe-with-label icon with an accessible default label", () => {
    render(<LanguageSelectorGlobeWithLabelIcon />)
    expect(screen.getByRole("img", { name: "Language" })).toBeInTheDocument()
  })

  it("allows overriding the globe-with-label aria-label", () => {
    render(<LanguageSelectorGlobeWithLabelIcon aria-label="言語" />)
    expect(screen.getByRole("img", { name: "言語" })).toBeInTheDocument()
  })
})
