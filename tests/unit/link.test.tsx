import { createRef } from "react"
import { render, screen } from "@testing-library/react"

import { Link } from "@/components/ui/link"

describe("Link", () => {
  it("renders an anchor with children", () => {
    render(<Link href="#">Example</Link>)
    const link = screen.getByRole("link", { name: "Example" })
    expect(link).toBeInTheDocument()
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("data-slot", "link")
  })

  it("reflects a passed className (merged last)", () => {
    render(
      <Link href="#" className="custom-class">
        Example
      </Link>
    )
    const link = screen.getByRole("link", { name: "Example" })
    expect(link).toHaveClass("custom-class")
    expect(link).toHaveClass("text-blue-1000")
  })

  it("forwards ref to the anchor element", () => {
    const ref = createRef<HTMLAnchorElement>()
    render(
      <Link href="#" ref={ref}>
        Example
      </Link>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("renders the external link icon when target is _blank", () => {
    render(
      <Link href="#" target="_blank">
        Example
      </Link>
    )
    expect(screen.getByRole("img")).toBeInTheDocument()
    expect(screen.getByLabelText("新規タブで開きます")).toBeInTheDocument()
  })

  it("does not render the external link icon for normal links", () => {
    render(<Link href="#">Example</Link>)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("renders as child element when asChild is set", () => {
    render(
      <Link asChild>
        <button type="button">Click</button>
      </Link>
    )
    const el = screen.getByRole("button", { name: "Click" })
    expect(el.tagName).toBe("BUTTON")
    expect(el).toHaveAttribute("data-slot", "link")
    expect(el).toHaveClass("text-blue-1000")
  })
})
