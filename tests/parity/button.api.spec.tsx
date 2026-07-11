import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Button } from "@/components/ui/button"

describe("Button API parity", () => {
  it("renders as a button by default", () => {
    render(<Button>送信</Button>)
    const button = screen.getByRole("button", { name: "送信" })
    expect(button).toBeInTheDocument()
  })

  it("applies the solid variant styles by default", () => {
    render(<Button>送信</Button>)
    const button = screen.getByRole("button", { name: "送信" })
    expect(button.className).toContain("bg-key-900")
    expect(button.className).toContain("border-double")
    expect(button.className).toContain("[color:white]")
    expect(button.className).toContain("text-oln-16B-100")
  })

  it("renders variant=solid-fill size=lg", () => {
    render(
      <Button variant="solid-fill" size="lg">
        送信
      </Button>
    )
    const button = screen.getByRole("button", { name: "送信" })
    expect(button).toBeInTheDocument()
    expect(button.className).toContain("min-h-14")
  })

  it("produces identical className for solid and solid-fill", () => {
    const { container: solidContainer } = render(
      <Button variant="solid">送信</Button>
    )
    const { container: fillContainer } = render(
      <Button variant="solid-fill">送信</Button>
    )
    const solid = solidContainer.querySelector("button")
    const fill = fillContainer.querySelector("button")
    expect(solid?.className).toBe(fill?.className)
  })

  it("maps sizes correctly", () => {
    const cases: Array<["lg" | "md" | "sm" | "xs", string]> = [
      ["lg", "min-h-14"],
      ["md", "min-h-12"],
      ["sm", "min-h-9"],
      ["xs", "min-h-7"],
    ]
    for (const [size, expected] of cases) {
      const { container } = render(<Button size={size}>x</Button>)
      const button = container.querySelector("button")
      expect(button?.className).toContain(expected)
    }
  })

  it("merges an incoming className last", () => {
    render(<Button className="custom-class">送信</Button>)
    const button = screen.getByRole("button", { name: "送信" })
    expect(button).toHaveClass("custom-class")
  })

  it("renders an <a> and forwards className with asChild", () => {
    render(
      <Button asChild className="custom-link">
        <a href="/x">link</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "link" })
    expect(link.tagName).toBe("A")
    expect(link).toHaveClass("custom-link")
  })

  it("forwards the ref", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>送信</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
