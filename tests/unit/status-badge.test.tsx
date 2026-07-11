import * as React from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { StatusBadge } from "@/components/ui/status-badge"

describe("StatusBadge", () => {
  it("renders its children", () => {
    render(<StatusBadge>編集不可</StatusBadge>)
    expect(screen.getByText("編集不可")).toBeInTheDocument()
  })

  it("renders as a span element with data-slot", () => {
    render(<StatusBadge>無効</StatusBadge>)
    const badge = screen.getByText("無効")
    expect(badge.tagName).toBe("SPAN")
    expect(badge).toHaveAttribute("data-slot", "status-badge")
  })

  it("reflects a passed className merged after base classes", () => {
    render(<StatusBadge className="custom-class">Status</StatusBadge>)
    const badge = screen.getByText("Status")
    expect(badge).toHaveClass("custom-class")
    expect(badge).toHaveClass("bg-solid-gray-536")
  })

  it("reflects passed props", () => {
    render(<StatusBadge id="badge-1">Status</StatusBadge>)
    expect(screen.getByText("Status")).toHaveAttribute("id", "badge-1")
  })

  it("forwards ref to the span element", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<StatusBadge ref={ref}>Ref</StatusBadge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<StatusBadge>編集不可</StatusBadge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
