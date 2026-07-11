import * as React from "react"
import { render } from "@testing-library/react"

import { Divider } from "@/components/ui/divider"

describe("Divider", () => {
  it("renders an hr with data-slot", () => {
    const { container } = render(<Divider />)
    const hr = container.querySelector("hr")
    expect(hr).not.toBeNull()
    expect(hr).toHaveAttribute("data-slot", "divider")
  })

  it("defaults to the gray-420 color", () => {
    const { container } = render(<Divider />)
    const hr = container.querySelector("hr")
    expect(hr).toHaveAttribute("data-color", "gray-420")
    expect(hr?.className).toContain(
      "data-[color=gray-420]:border-solid-gray-420"
    )
  })

  it("reflects the color variant via data-color", () => {
    const { container } = render(<Divider color="black" />)
    const hr = container.querySelector("hr")
    expect(hr).toHaveAttribute("data-color", "black")
  })

  it("merges a passed className", () => {
    const { container } = render(<Divider className="custom-class" />)
    const hr = container.querySelector("hr")
    expect(hr?.className).toContain("custom-class")
  })

  it("forwards ref to the underlying hr element", () => {
    const ref = React.createRef<HTMLHRElement>()
    render(<Divider ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLHRElement)
  })
})
