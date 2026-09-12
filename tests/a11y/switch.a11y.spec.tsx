import { render } from "@testing-library/react"
import { axe } from "../axe"

import { SwitchMode, SwitchOnOff } from "@/components/ui/switch"

describe("Switch accessibility", () => {
  it("SwitchOnOff has no axe violations", async () => {
    const { container } = render(<SwitchOnOff aria-checked aria-label="通知" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("SwitchMode has no axe violations", async () => {
    const { container } = render(
      <SwitchMode
        leftLabel="オン"
        onChange={() => {}}
        rightLabel="オフ"
        value="オン"
      />
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
