import * as React from "react"
import { render, screen } from "@testing-library/react"

import { FormControlLabel } from "@/components/ui/form-control-label"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Legend } from "@/components/ui/legend"
import { SupportText } from "@/components/ui/support-text"

describe("FormControlLabel", () => {
  it("composes a labelled and described field without changing its associations", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <FormControlLabel ref={ref}>
        <Label htmlFor="name">氏名</Label>
        <SupportText id="help">戸籍上の氏名</SupportText>
        <Input id="name" aria-describedby="help" />
      </FormControlLabel>
    )
    expect(ref.current?.tagName).toBe("DIV")
    expect(ref.current).toHaveAttribute("data-size", "md")
    expect(
      screen.getByRole("textbox", { name: "氏名" })
    ).toHaveAccessibleDescription("戸籍上の氏名")
  })

  it("supports native disabled fieldset semantics and forwards its ref", () => {
    const ref = React.createRef<HTMLFieldSetElement>()
    render(
      <FormControlLabel
        as="fieldset"
        disabled
        name="contact"
        ref={ref}
        size="lg"
      >
        <Legend>連絡先</Legend>
        <Input aria-label="電話番号" />
      </FormControlLabel>
    )
    expect(ref.current).toBe(screen.getByRole("group", { name: "連絡先" }))
    expect(ref.current).toHaveAttribute("name", "contact")
    expect(ref.current).toHaveAttribute("data-size", "lg")
    expect(screen.getByRole("textbox")).toBeDisabled()
  })

  it("allows a horizontal layout override", () => {
    const { container } = render(
      <FormControlLabel size="sm" className="grid items-baseline" />
    )
    expect(container.firstChild).toHaveAttribute("data-size", "sm")
    expect(container.firstChild).toHaveClass("grid", "items-baseline")
    expect(container.firstChild).not.toHaveClass("flex")
  })
})
