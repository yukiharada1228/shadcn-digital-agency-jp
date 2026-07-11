import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Heading, HeadingShoulder, HeadingTitle } from "@/components/ui/heading"

describe("Heading", () => {
  it("renders children", () => {
    render(<Heading size="32">Title</Heading>)
    expect(screen.getByText("Title")).toBeInTheDocument()
  })

  it("renders a div when there is no shoulder", () => {
    const { container } = render(<Heading size="32">Title</Heading>)
    const root = container.querySelector('[data-slot="heading"]')
    expect(root?.tagName).toBe("DIV")
  })

  it("renders an hgroup when a HeadingShoulder is present", () => {
    const { container } = render(
      <Heading size="32">
        <HeadingShoulder>Shoulder</HeadingShoulder>
        <HeadingTitle level="h2">Title</HeadingTitle>
      </Heading>
    )
    const root = container.querySelector('[data-slot="heading"]')
    expect(root?.tagName).toBe("HGROUP")
  })

  it("reflects the size variant in className", () => {
    const { container } = render(<Heading size="64">Big</Heading>)
    const root = container.querySelector('[data-slot="heading"]')
    expect(root).toHaveClass("text-dsp-64B-140")
  })

  it("applies chip classes when hasChip is set", () => {
    const { container } = render(
      <Heading size="24" hasChip>
        Chip
      </Heading>
    )
    const root = container.querySelector('[data-slot="heading"]')
    expect(root).toHaveClass("relative")
  })

  it("applies rule classes when rule is set", () => {
    const { container } = render(
      <Heading size="24" rule="4">
        Rule
      </Heading>
    )
    const root = container.querySelector('[data-slot="heading"]')
    expect(root).toHaveClass("border-key-900", "pb-4")
  })

  it("merges a passed className last", () => {
    const { container } = render(
      <Heading size="24" className="custom-class">
        Title
      </Heading>
    )
    const root = container.querySelector('[data-slot="heading"]')
    expect(root).toHaveClass("custom-class")
  })

  it("forwards the ref to the root element", () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Heading size="24" ref={ref}>
        Title
      </Heading>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute("data-slot", "heading")
  })
})

describe("HeadingTitle", () => {
  it("renders the requested heading level", () => {
    render(<HeadingTitle level="h3">Title</HeadingTitle>)
    const el = screen.getByRole("heading", { level: 3, name: "Title" })
    expect(el.tagName).toBe("H3")
  })

  it("forwards its ref", () => {
    const ref = React.createRef<HTMLHeadingElement>()
    render(
      <HeadingTitle level="h2" ref={ref}>
        Title
      </HeadingTitle>
    )
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement)
  })
})

describe("HeadingShoulder", () => {
  it("renders children and forwards its ref", () => {
    const ref = React.createRef<HTMLParagraphElement>()
    render(<HeadingShoulder ref={ref}>Shoulder</HeadingShoulder>)
    expect(screen.getByText("Shoulder")).toBeInTheDocument()
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement)
  })
})
