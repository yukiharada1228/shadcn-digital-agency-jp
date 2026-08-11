import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  StepNavigation,
  StepNavigationDescription,
  StepNavigationList,
  StepNavigationNumber,
  StepNavigationStateIndicator,
  StepNavigationStep,
  StepNavigationStepHeader,
  StepNavigationTitle,
} from "@/components/ui/step-navigation"

const steps = [
  { title: "申請内容の入力", state: "completed" as const },
  { title: "本人確認", state: "editing" as const },
  { title: "内容の確認", state: undefined },
]

function Sample({
  orientation = "horizontal" as const,
  interactive = false,
}: {
  orientation?: "horizontal" | "vertical"
  interactive?: boolean
}) {
  return (
    <StepNavigation asChild orientation={orientation}>
      <nav aria-label="申請の手順">
        <p className="sr-only">全3ステップ中、2ステップ目まで到達済み</p>
        <StepNavigationList>
          {steps.map((step, index) => {
            const header = (
              <>
                <StepNavigationNumber>
                  {index + 1}
                  <StepNavigationStateIndicator state={step.state} />
                </StepNavigationNumber>
                <StepNavigationTitle>{step.title}</StepNavigationTitle>
              </>
            )

            return (
              <StepNavigationStep
                aria-current={step.state === "editing" ? "step" : undefined}
                first={index === 0}
                key={step.title}
                last={index === steps.length - 1}
                state={step.state}
              >
                <StepNavigationStepHeader asChild={interactive}>
                  {interactive ? (
                    <a href={`#step-${index + 1}`}>{header}</a>
                  ) : (
                    header
                  )}
                </StepNavigationStepHeader>
                <StepNavigationDescription>
                  {step.title}の説明
                </StepNavigationDescription>
              </StepNavigationStep>
            )
          })}
        </StepNavigationList>
      </nav>
    </StepNavigation>
  )
}

describe("StepNavigation accessibility", () => {
  it("exposes the navigation landmark and the step list", () => {
    render(<Sample />)
    expect(
      screen.getByRole("navigation", { name: "申請の手順" })
    ).toBeInTheDocument()
    expect(screen.getAllByRole("listitem")).toHaveLength(3)
  })

  it("marks the step in progress with aria-current", () => {
    render(<Sample />)
    const current = screen
      .getAllByRole("listitem")
      .filter((step) => step.getAttribute("aria-current") === "step")
    expect(current).toHaveLength(1)
    expect(current[0]).toHaveTextContent("本人確認")
  })

  it("announces the step state as text", () => {
    render(<Sample />)
    expect(screen.getByText("完了")).toBeInTheDocument()
    expect(screen.getByText("編集中")).toBeInTheDocument()
  })

  it("has no axe violations (horizontal, static)", async () => {
    const { container } = render(<Sample />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations (vertical, interactive)", async () => {
    const { container } = render(<Sample orientation="vertical" interactive />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
