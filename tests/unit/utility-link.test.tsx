import * as React from "react"
import { render, screen } from "@testing-library/react"

import { UtilityLink } from "@/components/ui/utility-link"

describe("UtilityLink", () => {
  it("renders an anchor with children", () => {
    render(<UtilityLink href="/about">About</UtilityLink>)
    const link = screen.getByRole("link", { name: "About" })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute("href", "/about")
    expect(link).toHaveAttribute("data-slot", "utility-link")
  })

  it("reflects a passed className", () => {
    render(
      <UtilityLink href="/x" className="custom-class">
        Link
      </UtilityLink>
    )
    expect(screen.getByRole("link", { name: "Link" })).toHaveClass(
      "custom-class"
    )
  })

  it("forwards ref to the underlying anchor", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <UtilityLink ref={ref} href="/y">
        Ref
      </UtilityLink>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
  })

  it("renders the external link icon when target is _blank", () => {
    render(
      <UtilityLink href="/z" target="_blank">
        External
      </UtilityLink>
    )
    expect(
      screen.getByRole("img", { name: "新規タブで開きます" })
    ).toBeInTheDocument()
  })

  it("does not render the external link icon by default", () => {
    render(<UtilityLink href="/z">Internal</UtilityLink>)
    expect(screen.queryByRole("img")).not.toBeInTheDocument()
  })

  it("renders as child element when asChild is set", () => {
    render(
      <UtilityLink asChild>
        <button type="button">As Button</button>
      </UtilityLink>
    )
    const el = screen.getByRole("button", { name: "As Button" })
    expect(el).toHaveAttribute("data-slot", "utility-link")
  })
})
