import { fireEvent, render, screen } from "@testing-library/react"
import { axe } from "vitest-axe"

import { Button } from "@/components/ui/button"

describe("Button accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Button>送信</Button>)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=button by default", () => {
    render(<Button>送信</Button>)
    expect(screen.getByRole("button", { name: "送信" })).toBeInTheDocument()
  })

  it("suppresses navigation/click when asChild link is aria-disabled", () => {
    const onClick = vi.fn()
    render(
      <Button asChild aria-disabled onClick={onClick}>
        <a href="/x">x</a>
      </Button>
    )
    const link = screen.getByRole("link", { name: "x" })
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    fireEvent(link, event)
    expect(onClick).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })

  it("suppresses click when a button is aria-disabled", () => {
    const onClick = vi.fn()
    render(
      <Button aria-disabled onClick={onClick}>
        送信
      </Button>
    )
    const button = screen.getByRole("button", { name: "送信" })
    const event = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
    })
    fireEvent(button, event)
    expect(onClick).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(true)
  })
})
