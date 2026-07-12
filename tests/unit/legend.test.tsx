import * as React from "react"
import { render } from "@testing-library/react"

import { Legend } from "@/components/ui/legend"

describe("Legend", () => {
  it("renders a legend element with children and data-slot", () => {
    const { getByText } = render(
      <fieldset>
        <Legend>凡例</Legend>
      </fieldset>
    )
    const el = getByText("凡例")
    expect(el.tagName).toBe("LEGEND")
    expect(el).toHaveAttribute("data-slot", "legend")
  })

  it("reflects a passed prop", () => {
    const { getByText } = render(
      <fieldset>
        <Legend id="legend-1">凡例</Legend>
      </fieldset>
    )
    expect(getByText("凡例")).toHaveAttribute("id", "legend-1")
  })

  it("merges a passed className last", () => {
    const { getByText } = render(
      <fieldset>
        <Legend className="custom-class">凡例</Legend>
      </fieldset>
    )
    const el = getByText("凡例")
    expect(el).toHaveClass("custom-class")
    expect(el).toHaveClass("text-solid-gray-800")
  })

  it("forwards ref to the underlying legend element", () => {
    const ref = React.createRef<HTMLLegendElement>()
    render(
      <fieldset>
        <Legend ref={ref}>凡例</Legend>
      </fieldset>
    )
    expect(ref.current).toBeInstanceOf(HTMLLegendElement)
    expect(ref.current?.tagName).toBe("LEGEND")
  })

  it("defaults to the md size", () => {
    const { getByText } = render(
      <fieldset>
        <Legend>凡例</Legend>
      </fieldset>
    )
    const el = getByText("凡例")
    expect(el).toHaveAttribute("data-size", "md")
    expect(el).toHaveClass("data-[size=md]:text-std-17B-170")
  })

  it("reflects the sm size", () => {
    const { getByText } = render(
      <fieldset>
        <Legend size="sm">凡例</Legend>
      </fieldset>
    )
    const el = getByText("凡例")
    expect(el).toHaveAttribute("data-size", "sm")
    expect(el).toHaveClass("data-[size=sm]:text-std-16B-170")
  })

  it("reflects the lg size", () => {
    const { getByText } = render(
      <fieldset>
        <Legend size="lg">凡例</Legend>
      </fieldset>
    )
    const el = getByText("凡例")
    expect(el).toHaveAttribute("data-size", "lg")
    expect(el).toHaveClass("data-[size=lg]:text-std-18B-160")
  })
})
