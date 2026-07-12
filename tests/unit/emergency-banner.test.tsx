import * as React from "react"
import { render, screen } from "@testing-library/react"

import {
  EmergencyBanner,
  EmergencyBannerHeading,
  EmergencyBannerBody,
  EmergencyBannerButton,
} from "@/components/ui/emergency-banner"

describe("EmergencyBanner", () => {
  it("renders as a div with data-slot and children", () => {
    render(<EmergencyBanner>content</EmergencyBanner>)
    const banner = screen.getByText("content")
    expect(banner.tagName).toBe("DIV")
    expect(banner).toHaveAttribute("data-slot", "emergency-banner")
  })

  it("merges className after base classes", () => {
    render(<EmergencyBanner className="custom-class">content</EmergencyBanner>)
    const banner = screen.getByText("content")
    expect(banner).toHaveClass("custom-class")
    expect(banner).toHaveClass("border-warning-orange-1")
  })

  it("reflects passed props", () => {
    render(<EmergencyBanner id="banner-1">content</EmergencyBanner>)
    expect(screen.getByText("content")).toHaveAttribute("id", "banner-1")
  })

  it("forwards ref to the div element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<EmergencyBanner ref={ref}>content</EmergencyBanner>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("EmergencyBannerHeading", () => {
  it("prefixes the heading with 【緊急】 and renders children", () => {
    render(<EmergencyBannerHeading level="h2">避難情報</EmergencyBannerHeading>)
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveTextContent("【緊急】避難情報")
    expect(heading).toHaveAttribute("data-slot", "emergency-banner-heading")
  })

  it("renders the heading tag according to the level prop", () => {
    const { rerender } = render(
      <EmergencyBannerHeading level="h3">見出し</EmergencyBannerHeading>
    )
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()

    rerender(<EmergencyBannerHeading level="h6">見出し</EmergencyBannerHeading>)
    expect(screen.getByRole("heading", { level: 6 })).toBeInTheDocument()
  })

  it("merges className after base classes", () => {
    render(
      <EmergencyBannerHeading level="h2" className="custom-class">
        見出し
      </EmergencyBannerHeading>
    )
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveClass("custom-class")
    expect(heading).toHaveClass("text-std-20B-150")
  })

  it("forwards ref to the heading element", () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(
      <EmergencyBannerHeading level="h2" ref={ref}>
        見出し
      </EmergencyBannerHeading>
    )
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })
})

describe("EmergencyBannerBody", () => {
  it("renders as a div with data-slot and children", () => {
    render(<EmergencyBannerBody>body</EmergencyBannerBody>)
    const body = screen.getByText("body")
    expect(body.tagName).toBe("DIV")
    expect(body).toHaveAttribute("data-slot", "emergency-banner-body")
  })

  it("merges className after base classes", () => {
    render(
      <EmergencyBannerBody className="custom-class">body</EmergencyBannerBody>
    )
    const body = screen.getByText("body")
    expect(body).toHaveClass("custom-class")
    expect(body).toHaveClass("mt-2")
  })

  it("forwards ref to the div element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<EmergencyBannerBody ref={ref}>body</EmergencyBannerBody>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("EmergencyBannerButton", () => {
  it("renders as an anchor with data-slot, children and href", () => {
    render(<EmergencyBannerButton href="#">確認する</EmergencyBannerButton>)
    const link = screen.getByRole("link", { name: /確認する/ })
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("data-slot", "emergency-banner-button")
    expect(link).toHaveAttribute("href", "#")
  })

  it("does not render the new-window icon without target=_blank", () => {
    render(<EmergencyBannerButton href="#">確認する</EmergencyBannerButton>)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("renders the new-window icon when target=_blank", () => {
    render(
      <EmergencyBannerButton href="#" target="_blank">
        確認する
      </EmergencyBannerButton>
    )
    const icon = screen.getByRole("img", { name: "新規タブで開きます" })
    expect(icon).toBeInTheDocument()
  })

  it("merges className after base classes", () => {
    render(
      <EmergencyBannerButton href="#" className="custom-class">
        確認する
      </EmergencyBannerButton>
    )
    const link = screen.getByRole("link")
    expect(link).toHaveClass("custom-class")
    expect(link).toHaveClass("bg-error-1")
  })

  it("forwards ref to the anchor element", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <EmergencyBannerButton href="#" ref={ref}>
        確認する
      </EmergencyBannerButton>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })
})
