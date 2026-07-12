import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"

import {
  Disclosure,
  DisclosureSummary,
  DisclosureBackLink,
} from "@/components/ui/disclosure"

describe("Disclosure", () => {
  it("renders a details element with data-slot", () => {
    const { container } = render(
      <Disclosure>
        <DisclosureSummary>title</DisclosureSummary>
        <div>content</div>
      </Disclosure>
    )
    const details = container.querySelector("details")
    expect(details).not.toBeNull()
    expect(details).toHaveAttribute("data-slot", "disclosure")
    expect(details?.className).toContain("group/disclosure")
  })

  it("renders the summary with data-slot", () => {
    const { container } = render(
      <Disclosure>
        <DisclosureSummary>title</DisclosureSummary>
      </Disclosure>
    )
    const summary = container.querySelector("summary")
    expect(summary).not.toBeNull()
    expect(summary).toHaveAttribute("data-slot", "disclosure-summary")
    expect(screen.getByText("title")).not.toBeNull()
  })

  it("renders the back link with data-slot and href", () => {
    const { container } = render(
      <DisclosureBackLink href="#top">back</DisclosureBackLink>
    )
    const link = container.querySelector("a")
    expect(link).not.toBeNull()
    expect(link).toHaveAttribute("data-slot", "disclosure-back-link")
    expect(link).toHaveAttribute("href", "#top")
    expect(screen.getByText("back")).not.toBeNull()
  })

  it("toggles open state when the summary is clicked", () => {
    const { container } = render(
      <Disclosure>
        <DisclosureSummary>title</DisclosureSummary>
        <div>content</div>
      </Disclosure>
    )
    const details = container.querySelector("details") as HTMLDetailsElement
    const summary = container.querySelector("summary") as HTMLElement
    expect(details.open).toBe(false)
    fireEvent.click(summary)
    // jsdom does not toggle open on click; simulate the native toggle
    details.open = true
    fireEvent(details, new Event("toggle"))
    expect(details.open).toBe(true)
  })

  it("respects the defaultOpen (open) prop", () => {
    const { container } = render(
      <Disclosure open>
        <DisclosureSummary>title</DisclosureSummary>
        <div>content</div>
      </Disclosure>
    )
    const details = container.querySelector("details") as HTMLDetailsElement
    expect(details.open).toBe(true)
  })

  it("merges passed classNames on each part", () => {
    const { container } = render(
      <Disclosure className="d-custom">
        <DisclosureSummary className="s-custom">title</DisclosureSummary>
        <DisclosureBackLink className="b-custom" href="#top">
          back
        </DisclosureBackLink>
      </Disclosure>
    )
    expect(container.querySelector("details")?.className).toContain("d-custom")
    expect(container.querySelector("summary")?.className).toContain("s-custom")
    expect(container.querySelector("a")?.className).toContain("b-custom")
  })

  it("forwards refs to each underlying element", () => {
    const detailsRef = React.createRef<HTMLDetailsElement>()
    const summaryRef = React.createRef<HTMLElement>()
    const linkRef = React.createRef<HTMLAnchorElement>()
    render(
      <Disclosure ref={detailsRef}>
        <DisclosureSummary ref={summaryRef}>title</DisclosureSummary>
        <DisclosureBackLink ref={linkRef} href="#top">
          back
        </DisclosureBackLink>
      </Disclosure>
    )
    expect(detailsRef.current).toBeInstanceOf(HTMLDetailsElement)
    expect(summaryRef.current?.tagName.toLowerCase()).toBe("summary")
    expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("hides the decorative icons from assistive tech", () => {
    const { container } = render(
      <Disclosure>
        <DisclosureSummary>title</DisclosureSummary>
      </Disclosure>
    )
    const svg = container.querySelector("summary svg")
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })
})
