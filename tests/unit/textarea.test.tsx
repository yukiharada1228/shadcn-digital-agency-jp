import * as React from "react"
import { render } from "@testing-library/react"

import { Textarea } from "@/components/ui/textarea"

describe("Textarea", () => {
  it("renders a textarea element with data-slot", () => {
    const { container } = render(<Textarea />)
    const textarea = container.querySelector("textarea")
    expect(textarea).not.toBeNull()
    expect(textarea).toHaveAttribute("data-slot", "textarea")
  })

  it("reflects a passed className", () => {
    const { container } = render(<Textarea className="custom-class" />)
    const textarea = container.querySelector("textarea")
    expect(textarea).toHaveClass("custom-class")
  })

  it("reflects passed props (value)", () => {
    const { container } = render(<Textarea defaultValue="hello" />)
    const textarea = container.querySelector("textarea")
    expect(textarea).toHaveValue("hello")
  })

  it("forwards the ref", () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it("sets aria-invalid when isError is true", () => {
    const { container } = render(<Textarea isError />)
    const textarea = container.querySelector("textarea")
    expect(textarea).toHaveAttribute("aria-invalid", "true")
  })

  it("does not set aria-invalid when isError is false", () => {
    const { container } = render(<Textarea />)
    const textarea = container.querySelector("textarea")
    expect(textarea).not.toHaveAttribute("aria-invalid")
  })

  it("forces readOnly when aria-disabled is set", () => {
    const { container } = render(<Textarea aria-disabled />)
    const textarea = container.querySelector("textarea")
    expect(textarea).toHaveAttribute("readonly")
  })

  it("does not force readOnly when aria-disabled is false", () => {
    const { container } = render(<Textarea aria-disabled="false" />)
    const textarea = container.querySelector("textarea")
    expect(textarea).not.toHaveAttribute("readonly")
  })
})
