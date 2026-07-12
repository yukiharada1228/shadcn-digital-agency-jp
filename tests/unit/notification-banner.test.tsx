import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  NotificationBanner,
  NotificationBannerBody,
  NotificationBannerClose,
  NotificationBannerMobileClose,
} from "@/components/ui/notification-banner"

describe("NotificationBanner", () => {
  it("renders the root with data-slot and the title", () => {
    render(
      <NotificationBanner bannerStyle="standard" type="info1" title="お知らせ">
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    const root = screen.getByText("お知らせ").closest("[data-slot]")
    expect(root).toHaveAttribute("data-slot", "notification-banner")
  })

  it("reflects type and bannerStyle via data attributes", () => {
    const { container } = render(
      <NotificationBanner bannerStyle="color-chip" type="error" title="エラー">
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    const root = container.querySelector('[data-slot="notification-banner"]')
    expect(root).toHaveAttribute("data-type", "error")
    expect(root).toHaveAttribute("data-style", "color-chip")
  })

  it("uses a div wrapper by default and the heading tag when headingLevel is set", () => {
    const { rerender } = render(
      <NotificationBanner bannerStyle="standard" type="info2" title="タイトル">
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    expect(screen.queryByRole("heading")).toBeNull()

    rerender(
      <NotificationBanner
        bannerStyle="standard"
        type="info2"
        title="タイトル"
        headingLevel="h2"
      >
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
  })

  it("renders the correct icon per type", () => {
    const { rerender } = render(
      <NotificationBanner bannerStyle="standard" type="warning" title="警告">
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    expect(screen.getByLabelText("警告")).toBeInTheDocument()

    rerender(
      <NotificationBanner bannerStyle="standard" type="success" title="成功">
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    expect(screen.getByLabelText("成功")).toBeInTheDocument()
  })

  it("merges className last onto the root", () => {
    const { container } = render(
      <NotificationBanner
        bannerStyle="standard"
        type="info1"
        title="タイトル"
        className="custom-class"
      >
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    const root = container.querySelector('[data-slot="notification-banner"]')
    expect(root?.className).toContain("custom-class")
  })

  it("forwards ref to the root div", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <NotificationBanner
        ref={ref}
        bannerStyle="standard"
        type="info1"
        title="タイトル"
      >
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("NotificationBannerBody", () => {
  it("renders with data-slot and passes through props", () => {
    const { container } = render(
      <NotificationBannerBody id="body-id">本文</NotificationBannerBody>
    )
    const body = container.querySelector(
      '[data-slot="notification-banner-body"]'
    )
    expect(body).toHaveAttribute("id", "body-id")
    expect(body).toHaveTextContent("本文")
  })

  it("merges className and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    const { container } = render(
      <NotificationBannerBody ref={ref} className="body-extra">
        本文
      </NotificationBannerBody>
    )
    const body = container.querySelector(
      '[data-slot="notification-banner-body"]'
    )
    expect(body?.className).toContain("body-extra")
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("NotificationBannerClose", () => {
  it("renders a button with data-slot and default label", () => {
    render(<NotificationBannerClose />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute("data-slot", "notification-banner-close")
    expect(button).toHaveAttribute("type", "button")
    expect(button).toHaveTextContent("閉じる")
  })

  it("uses a custom label", () => {
    render(<NotificationBannerClose label="close" />)
    expect(screen.getByRole("button")).toHaveTextContent("close")
  })

  it("fires onClick", () => {
    const onClick = vi.fn()
    render(<NotificationBannerClose onClick={onClick} />)
    fireEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("merges className and forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<NotificationBannerClose ref={ref} className="close-extra" />)
    expect(screen.getByRole("button").className).toContain("close-extra")
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})

describe("NotificationBannerMobileClose", () => {
  it("renders a button with data-slot and fires onClick", () => {
    const onClick = vi.fn()
    render(<NotificationBannerMobileClose onClick={onClick} />)
    const button = screen.getByRole("button")
    expect(button).toHaveAttribute(
      "data-slot",
      "notification-banner-mobile-close"
    )
    expect(button).toHaveAttribute("type", "button")
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("merges className and forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<NotificationBannerMobileClose ref={ref} className="mobile-extra" />)
    expect(screen.getByRole("button").className).toContain("mobile-extra")
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
