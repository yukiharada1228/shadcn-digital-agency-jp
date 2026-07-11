import * as React from "react"
import { render } from "@testing-library/react"

import { Blockquote } from "@/components/ui/blockquote"

describe("Blockquote", () => {
  it("renders a blockquote element with children", () => {
    const { getByText } = render(<Blockquote>Quoted text</Blockquote>)
    const el = getByText("Quoted text")
    expect(el.tagName).toBe("BLOCKQUOTE")
    expect(el).toHaveAttribute("data-slot", "blockquote")
  })

  it("merges a passed className", () => {
    const { getByText } = render(
      <Blockquote className="custom-class">Content</Blockquote>
    )
    const el = getByText("Content")
    expect(el).toHaveClass("custom-class")
    expect(el).toHaveClass("border-solid-gray-536")
  })

  it("forwards ref to the underlying blockquote element", () => {
    const ref = React.createRef<HTMLQuoteElement>()
    render(<Blockquote ref={ref}>Ref content</Blockquote>)
    expect(ref.current).toBeInstanceOf(HTMLQuoteElement)
    expect(ref.current?.tagName).toBe("BLOCKQUOTE")
  })
})
