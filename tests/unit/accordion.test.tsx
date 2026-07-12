import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Accordion,
  AccordionBackLink,
  AccordionContent,
  AccordionSummary,
} from "@/components/ui/accordion"

function renderAccordion(props: React.ComponentProps<typeof Accordion> = {}) {
  return render(
    <Accordion {...props}>
      <AccordionSummary>
        <h3>質問</h3>
      </AccordionSummary>
      <AccordionContent>
        <p>回答</p>
        <AccordionBackLink href="#top">先頭に戻る</AccordionBackLink>
      </AccordionContent>
    </Accordion>
  )
}

describe("Accordion", () => {
  it("renders a details root with data-slot", () => {
    const { container } = renderAccordion()
    const details = container.querySelector("details")
    expect(details).not.toBeNull()
    expect(details).toHaveAttribute("data-slot", "accordion")
  })

  it("renders the summary with data-slot", () => {
    const { container } = renderAccordion()
    const summary = container.querySelector("summary")
    expect(summary).not.toBeNull()
    expect(summary).toHaveAttribute("data-slot", "accordion-summary")
  })

  it("renders the content with data-slot", () => {
    const { container } = renderAccordion()
    const content = container.querySelector('[data-slot="accordion-content"]')
    expect(content).not.toBeNull()
  })

  it("renders the back link with data-slot and href", () => {
    renderAccordion()
    const link = screen.getByRole("link", { name: "先頭に戻る" })
    expect(link).toHaveAttribute("data-slot", "accordion-back-link")
    expect(link).toHaveAttribute("href", "#top")
  })

  it("renders its children", () => {
    renderAccordion()
    expect(screen.getByText("質問")).toBeInTheDocument()
    expect(screen.getByText("回答")).toBeInTheDocument()
  })

  it("merges a passed className on each part", () => {
    const { container } = render(
      <Accordion className="root-class">
        <AccordionSummary className="summary-class">S</AccordionSummary>
        <AccordionContent className="content-class">
          <AccordionBackLink href="#x" className="link-class">
            L
          </AccordionBackLink>
        </AccordionContent>
      </Accordion>
    )
    expect(container.querySelector("details")).toHaveClass("root-class")
    expect(container.querySelector("summary")).toHaveClass("summary-class")
    expect(
      container.querySelector('[data-slot="accordion-content"]')
    ).toHaveClass("content-class")
    expect(screen.getByRole("link", { name: "L" })).toHaveClass("link-class")
  })

  it("forwards refs to the underlying elements", () => {
    const rootRef = React.createRef<HTMLDetailsElement>()
    const summaryRef = React.createRef<HTMLElement>()
    const contentRef = React.createRef<HTMLDivElement>()
    const linkRef = React.createRef<HTMLAnchorElement>()
    render(
      <Accordion ref={rootRef}>
        <AccordionSummary ref={summaryRef}>S</AccordionSummary>
        <AccordionContent ref={contentRef}>
          <AccordionBackLink ref={linkRef} href="#x">
            L
          </AccordionBackLink>
        </AccordionContent>
      </Accordion>
    )
    expect(rootRef.current).toBeInstanceOf(HTMLDetailsElement)
    expect(summaryRef.current?.tagName).toBe("SUMMARY")
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement)
    expect(linkRef.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("respects the open prop on the details element", () => {
    const { container } = renderAccordion({ open: true })
    const details = container.querySelector("details") as HTMLDetailsElement
    expect(details.open).toBe(true)
  })

  it("is closed by default", () => {
    const { container } = renderAccordion()
    const details = container.querySelector("details") as HTMLDetailsElement
    expect(details.open).toBe(false)
  })

  it("fires onToggle when the open state changes", () => {
    const onToggle = vi.fn()
    const { container } = renderAccordion({ onToggle })
    const details = container.querySelector("details") as HTMLDetailsElement
    details.open = true
    fireEvent(details, new Event("toggle", { bubbles: false }))
    expect(onToggle).toHaveBeenCalled()
  })
})
