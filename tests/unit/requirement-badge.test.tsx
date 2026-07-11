import { createRef } from "react"
import { render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"

import { RequirementBadge } from "@/components/ui/requirement-badge"

describe("RequirementBadge", () => {
  it("renders children", () => {
    render(<RequirementBadge>※必須</RequirementBadge>)
    expect(screen.getByText("※必須")).toBeInTheDocument()
  })

  it("reflects a passed prop", () => {
    render(<RequirementBadge id="badge">※必須</RequirementBadge>)
    expect(screen.getByText("※必須")).toHaveAttribute("id", "badge")
  })

  it("forwards ref", () => {
    const ref = createRef<HTMLSpanElement>()
    render(<RequirementBadge ref={ref}>※必須</RequirementBadge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it("has data-slot", () => {
    render(<RequirementBadge>※必須</RequirementBadge>)
    expect(screen.getByText("※必須")).toHaveAttribute(
      "data-slot",
      "requirement-badge"
    )
  })

  it("required variant does not set data-is-optional", () => {
    render(<RequirementBadge>※必須</RequirementBadge>)
    expect(screen.getByText("※必須")).not.toHaveAttribute("data-is-optional")
  })

  it("optional variant sets data-is-optional and optional class", () => {
    render(<RequirementBadge isOptional>※任意</RequirementBadge>)
    const badge = screen.getByText("※任意")
    expect(badge).toHaveAttribute("data-is-optional", "true")
    expect(badge).toHaveClass("data-[is-optional]:text-solid-gray-800")
  })

  it("merges className last", () => {
    render(<RequirementBadge className="custom-class">※必須</RequirementBadge>)
    expect(screen.getByText("※必須")).toHaveClass("custom-class")
  })

  it("has no a11y violations", async () => {
    const { container } = render(<RequirementBadge>※必須</RequirementBadge>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
