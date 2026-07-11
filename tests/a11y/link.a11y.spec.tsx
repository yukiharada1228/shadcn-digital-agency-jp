import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { Link } from "@/components/ui/link"

describe("Link accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Link href="https://www.digital.go.jp/" target="_blank">
        デジタル庁
      </Link>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=link", () => {
    render(<Link href="/about">概要</Link>)
    expect(screen.getByRole("link", { name: "概要" })).toBeInTheDocument()
  })
})
