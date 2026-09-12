import * as React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  PageNavigation,
  PageNavigationArrowButton,
  PageNavigationButton,
  PageNavigationCounter,
} from "@/components/ui/page-navigation"

describe("PageNavigation", () => {
  it("renders a nav element with the base layout classes", () => {
    render(<PageNavigation aria-label="ページ" data-testid="nav" />)
    const nav = screen.getByTestId("nav")
    expect(nav.tagName).toBe("NAV")
    expect(nav).toHaveAttribute("data-slot", "page-navigation")
    expect(nav).toHaveAttribute("aria-label", "ページ")
    expect(nav).toHaveClass("flex")
    expect(nav).toHaveClass("items-center")
  })

  it("merges a passed className", () => {
    render(<PageNavigation className="custom-class" data-testid="nav" />)
    expect(screen.getByTestId("nav")).toHaveClass("custom-class")
  })

  it("forwards ref to the underlying nav element", () => {
    const ref = React.createRef<HTMLElement>()
    render(<PageNavigation ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("NAV")
  })
})

describe("PageNavigationCounter", () => {
  it("renders a span with children as-is", () => {
    render(<PageNavigationCounter>5 / 9</PageNavigationCounter>)
    const el = screen.getByText("5 / 9")
    expect(el.tagName).toBe("SPAN")
    expect(el).toHaveAttribute("data-slot", "page-navigation-counter")
  })
})

describe("PageNavigationButton", () => {
  it("renders a Button with the control data attribute", () => {
    render(
      <PageNavigationButton control="prev" variant="text">
        前のページ
      </PageNavigationButton>
    )
    const el = screen.getByRole("button", { name: "前のページ" })
    expect(el).toHaveAttribute("data-slot", "page-navigation-button")
    expect(el).toHaveAttribute("data-control", "prev")
  })

  it("applies the text-variant control padding override", () => {
    render(
      <>
        <PageNavigationButton control="prev" variant="text">
          前
        </PageNavigationButton>
        <PageNavigationButton control="next" variant="text">
          次
        </PageNavigationButton>
      </>
    )
    expect(screen.getByRole("button", { name: "前" })).toHaveClass(
      "data-[control=prev]:pl-2"
    )
    expect(screen.getByRole("button", { name: "次" })).toHaveClass(
      "data-[control=next]:pr-2"
    )
  })

  it("applies the outline-variant control padding override", () => {
    render(
      <>
        <PageNavigationButton control="prev" variant="outline">
          前
        </PageNavigationButton>
        <PageNavigationButton control="next" variant="outline">
          次
        </PageNavigationButton>
      </>
    )
    expect(screen.getByRole("button", { name: "前" })).toHaveClass(
      "data-[control=prev]:pr-6"
    )
    expect(screen.getByRole("button", { name: "次" })).toHaveClass(
      "data-[control=next]:pl-6"
    )
  })

  it("applies no control override for variants without one", () => {
    render(
      <PageNavigationButton control="prev" variant="solid">
        前
      </PageNavigationButton>
    )
    const el = screen.getByRole("button", { name: "前" })
    expect(el.className).not.toContain("data-[control=prev]:pl-2")
    expect(el.className).not.toContain("data-[control=prev]:pr-6")
  })

  it("renders as an anchor via asChild", () => {
    render(
      <PageNavigationButton asChild control="next" variant="text">
        <a href="#next">次のページ</a>
      </PageNavigationButton>
    )
    const el = screen.getByRole("link", { name: "次のページ" })
    expect(el.tagName).toBe("A")
    expect(el).toHaveAttribute("data-control", "next")
  })

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(
      <PageNavigationButton control="prev" ref={ref} variant="text">
        前
      </PageNavigationButton>
    )
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})

describe("PageNavigationArrowButton", () => {
  it("renders a button with type button and an sr-only label", () => {
    render(<PageNavigationArrowButton label="前のページ" size="lg" />)
    const el = screen.getByRole("button", { name: "前のページ" })
    expect(el).toHaveAttribute("type", "button")
    expect(el).toHaveAttribute("data-slot", "page-navigation-arrow-button")
  })

  it("renders children alongside the sr-only label", () => {
    render(
      <PageNavigationArrowButton label="前のページ" size="lg">
        <span data-testid="icon" />
      </PageNavigationArrowButton>
    )
    expect(screen.getByTestId("icon")).toBeInTheDocument()
    expect(screen.getByText("前のページ")).toHaveClass("sr-only")
  })

  it("reflects the size prop in className", () => {
    render(<PageNavigationArrowButton label="前のページ" size="lg" />)
    expect(screen.getByRole("button", { name: "前のページ" })).toHaveClass(
      "size-11"
    )
  })

  it("renders as an anchor via asChild without adding its own sr-only label", () => {
    render(
      <PageNavigationArrowButton asChild size="lg">
        <a href="#prev">
          <span data-testid="icon" />
          <span className="sr-only">前のページ</span>
        </a>
      </PageNavigationArrowButton>
    )
    const el = screen.getByRole("link", { name: "前のページ" })
    expect(el.tagName).toBe("A")
    expect(screen.getAllByText("前のページ")).toHaveLength(1)
  })

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<PageNavigationArrowButton label="前のページ" ref={ref} size="lg" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(
      <PageNavigation aria-label="ページ">
        <PageNavigationArrowButton label="前のページ" size="lg" />
        <PageNavigationCounter>5 / 9</PageNavigationCounter>
        <PageNavigationArrowButton label="次のページ" size="lg" />
      </PageNavigation>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
