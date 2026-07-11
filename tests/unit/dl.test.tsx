import * as React from "react"
import { render } from "@testing-library/react"

import { Dl, Dt, Dd } from "@/components/ui/dl"

describe("Dl", () => {
  it("renders a dl/dt/dd structure", () => {
    const { container } = render(
      <Dl>
        <Dt>Term</Dt>
        <Dd>Definition</Dd>
      </Dl>
    )
    const dl = container.querySelector("dl")
    expect(dl).not.toBeNull()
    expect(dl).toHaveAttribute("data-slot", "dl")
    expect(container.querySelector("dt")).toHaveAttribute("data-slot", "dt")
    expect(container.querySelector("dd")).toHaveAttribute("data-slot", "dd")
  })

  it("reflects children and className", () => {
    const { container } = render(<Dl className="custom-class">content</Dl>)
    const dl = container.querySelector("dl")
    expect(dl).toHaveClass("custom-class")
    expect(dl).toHaveClass("group/dl")
    expect(dl?.textContent).toBe("content")
  })

  it("reflects the marker prop via data-marker", () => {
    const { container } = render(
      <Dl marker="bullet">
        <Dt>Term</Dt>
      </Dl>
    )
    expect(container.querySelector("dl")).toHaveAttribute(
      "data-marker",
      "bullet"
    )
  })

  it("applies bullet marker classes to Dt", () => {
    const { container } = render(<Dt>Term</Dt>)
    expect(container.querySelector("dt")).toHaveClass(
      "group-data-[marker=bullet]/dl:list-disc"
    )
  })

  it("forwards refs", () => {
    const dlRef = React.createRef<HTMLDListElement>()
    const dtRef = React.createRef<HTMLElement>()
    const ddRef = React.createRef<HTMLElement>()
    render(
      <Dl ref={dlRef}>
        <Dt ref={dtRef}>Term</Dt>
        <Dd ref={ddRef}>Definition</Dd>
      </Dl>
    )
    expect(dlRef.current).toBeInstanceOf(HTMLDListElement)
    expect(dtRef.current?.tagName).toBe("DT")
    expect(ddRef.current?.tagName).toBe("DD")
  })
})
