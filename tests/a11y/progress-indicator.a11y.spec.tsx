import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  ProgressIndicator,
  ProgressIndicatorLinear,
  ProgressIndicatorSpinner,
} from "@/components/ui/progress-indicator"

describe("ProgressIndicator accessibility", () => {
  it("exposes a progressbar role", () => {
    render(
      <ProgressIndicator type="inlined" aria-label="読み込み中">
        <ProgressIndicatorSpinner size="sm" />
      </ProgressIndicator>
    )
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("has no axe violations (indeterminate)", async () => {
    const labelId = "pi-a11y-loop"
    const { container } = render(
      <ProgressIndicator type="stacked" aria-labelledby={labelId}>
        <ProgressIndicatorSpinner size="lg" />
        <span id={labelId}>読み込み中</span>
      </ProgressIndicator>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (determinate)", async () => {
    const labelId = "pi-a11y-fill"
    const { container } = render(
      <ProgressIndicator
        type="stacked-underlay"
        value={35}
        aria-labelledby={labelId}
      >
        <ProgressIndicatorLinear size="lg" />
        <span id={labelId}>読み込み中 (35%)</span>
      </ProgressIndicator>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
