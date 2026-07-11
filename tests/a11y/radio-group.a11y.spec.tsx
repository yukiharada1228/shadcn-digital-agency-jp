import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

describe("RadioGroup accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <RadioGroup aria-label="選択肢">
        <RadioGroupItem value="a" aria-label="選択肢1" />
        <RadioGroupItem value="b" aria-label="選択肢2" />
      </RadioGroup>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=radiogroup", () => {
    render(
      <RadioGroup aria-label="選択肢">
        <RadioGroupItem value="a" aria-label="選択肢1" />
      </RadioGroup>
    )
    expect(
      screen.getByRole("radiogroup", { name: "選択肢" })
    ).toBeInTheDocument()
  })
})
