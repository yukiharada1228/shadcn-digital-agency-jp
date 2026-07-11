import * as React from "react"
import { render } from "@testing-library/react"
import { axe } from "../axe"

import { ChipLabel } from "@/components/ui/chip-label"

describe("ChipLabel", () => {
  it("renders a span element with children", () => {
    const { getByText } = render(<ChipLabel>ラベル</ChipLabel>)
    const el = getByText("ラベル")
    expect(el.tagName).toBe("SPAN")
    expect(el).toHaveAttribute("data-slot", "chip-label")
  })

  it("reflects a passed prop", () => {
    const { getByText } = render(<ChipLabel id="chip-1">ラベル</ChipLabel>)
    expect(getByText("ラベル")).toHaveAttribute("id", "chip-1")
  })

  it("merges a passed className", () => {
    const { getByText } = render(
      <ChipLabel className="custom-class">ラベル</ChipLabel>
    )
    const el = getByText("ラベル")
    expect(el).toHaveClass("custom-class")
    expect(el).toHaveClass("rounded-8")
  })

  it("forwards ref to the underlying span element", () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<ChipLabel ref={ref}>ラベル</ChipLabel>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current?.tagName).toBe("SPAN")
  })

  it("defaults to the text variant and gray color", () => {
    const { getByText } = render(<ChipLabel>ラベル</ChipLabel>)
    const el = getByText("ラベル")
    expect(el).toHaveAttribute("data-variant", "text")
    expect(el).toHaveAttribute("data-color", "gray")
    expect(el).toHaveClass("text-solid-gray-800")
  })

  it("reflects the variant in className and data attributes", () => {
    const { getByText } = render(
      <ChipLabel variant="outlined" color="blue">
        ラベル
      </ChipLabel>
    )
    const el = getByText("ラベル")
    expect(el).toHaveAttribute("data-variant", "outlined")
    expect(el).toHaveAttribute("data-color", "blue")
    expect(el).toHaveClass("border")
    expect(el).toHaveClass("border-blue-700")
    expect(el).toHaveClass("text-blue-700")
  })

  it("applies filled-2 white text styling", () => {
    const { getByText } = render(
      <ChipLabel variant="filled-2" color="red">
        ラベル
      </ChipLabel>
    )
    const el = getByText("ラベル")
    expect(el).toHaveClass("text-white")
    expect(el).toHaveClass("bg-red-900")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<ChipLabel>ラベル</ChipLabel>)
    expect(await axe(container)).toHaveNoViolations()
  })
})
