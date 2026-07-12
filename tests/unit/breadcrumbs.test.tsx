import * as React from "react"
import { render, screen } from "@testing-library/react"

import {
  Breadcrumbs,
  BreadcrumbsLabel,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumbs"

describe("Breadcrumbs", () => {
  it("renders a nav with data-slot", () => {
    const { container } = render(<Breadcrumbs>content</Breadcrumbs>)
    const nav = container.querySelector("nav")
    expect(nav).not.toBeNull()
    expect(nav).toHaveAttribute("data-slot", "breadcrumbs")
  })

  it("merges a passed className on the nav", () => {
    const { container } = render(
      <Breadcrumbs className="custom-class">content</Breadcrumbs>
    )
    expect(container.querySelector("nav")?.className).toContain("custom-class")
  })

  it("forwards ref to the underlying nav element", () => {
    const ref = React.createRef<HTMLElement>()
    render(<Breadcrumbs ref={ref}>content</Breadcrumbs>)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("NAV")
  })

  it("passes through aria-labelledby", () => {
    const { container } = render(
      <Breadcrumbs aria-labelledby="label-id">content</Breadcrumbs>
    )
    expect(container.querySelector("nav")).toHaveAttribute(
      "aria-labelledby",
      "label-id"
    )
  })
})

describe("BreadcrumbsLabel", () => {
  it("renders a span with data-slot and forwards ref", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(
      <BreadcrumbsLabel ref={ref} id="x">
        現在位置
      </BreadcrumbsLabel>
    )
    const label = screen.getByText("現在位置")
    expect(label.tagName).toBe("SPAN")
    expect(label).toHaveAttribute("data-slot", "breadcrumbs-label")
    expect(label).toHaveAttribute("id", "x")
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("merges className", () => {
    render(<BreadcrumbsLabel className="sr-only">現在位置</BreadcrumbsLabel>)
    expect(screen.getByText("現在位置").className).toContain("sr-only")
  })
})

describe("BreadcrumbList", () => {
  it("renders an ol with data-slot and inline class", () => {
    const { container } = render(
      <BreadcrumbList>
        <li>item</li>
      </BreadcrumbList>
    )
    const ol = container.querySelector("ol")
    expect(ol).toHaveAttribute("data-slot", "breadcrumb-list")
    expect(ol?.className).toContain("inline")
  })

  it("forwards ref and merges className", () => {
    const ref = React.createRef<HTMLOListElement>()
    const { container } = render(
      <BreadcrumbList ref={ref} className="custom-class">
        <li>item</li>
      </BreadcrumbList>
    )
    expect(ref.current).toBeInstanceOf(HTMLOListElement)
    expect(container.querySelector("ol")?.className).toContain("custom-class")
  })
})

describe("BreadcrumbItem", () => {
  it("renders a non-current item with a separator svg and no aria-current", () => {
    const { container } = render(<BreadcrumbItem>ホーム</BreadcrumbItem>)
    const li = container.querySelector("li")
    expect(li).toHaveAttribute("data-slot", "breadcrumb-item")
    expect(li).not.toHaveAttribute("aria-current")
    expect(container.querySelector("svg")).not.toBeNull()
    expect(li?.className).toContain("break-words")
  })

  it("renders a current item with aria-current=page and no separator", () => {
    const { container } = render(
      <BreadcrumbItem isCurrent>現在のページ</BreadcrumbItem>
    )
    const li = container.querySelector("li")
    expect(li).toHaveAttribute("aria-current", "page")
    expect(li?.className).toContain("text-oln-16N-100")
    expect(container.querySelector("svg")).toBeNull()
  })

  it("forwards ref and merges className", () => {
    const ref = React.createRef<HTMLLIElement>()
    const { container } = render(
      <BreadcrumbItem ref={ref} className="custom-class">
        ホーム
      </BreadcrumbItem>
    )
    expect(ref.current).toBeInstanceOf(HTMLLIElement)
    expect(container.querySelector("li")?.className).toContain("custom-class")
  })
})

describe("BreadcrumbLink", () => {
  it("renders an anchor with data-slot and link styles by default", () => {
    render(<BreadcrumbLink href="#">ホーム</BreadcrumbLink>)
    const link = screen.getByText("ホーム")
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("data-slot", "breadcrumb-link")
    expect(link).toHaveAttribute("href", "#")
    expect(link.className).toContain("underline")
  })

  it("merges className and forwards ref", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <BreadcrumbLink ref={ref} href="#" className="custom-class">
        ホーム
      </BreadcrumbLink>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(screen.getByText("ホーム").className).toContain("custom-class")
  })

  it("renders as its child when asChild is set (Slot)", () => {
    render(
      <BreadcrumbLink asChild>
        <a href="/home" data-testid="custom-anchor">
          ホーム
        </a>
      </BreadcrumbLink>
    )
    const anchor = screen.getByTestId("custom-anchor")
    expect(anchor.tagName).toBe("A")
    expect(anchor).toHaveAttribute("href", "/home")
    expect(anchor).toHaveAttribute("data-slot", "breadcrumb-link")
    expect(anchor.className).toContain("underline")
  })
})
