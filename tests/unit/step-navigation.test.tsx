import * as React from "react"
import { render, screen } from "@testing-library/react"

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

describe("StepNavigation", () => {
  it("renders the root with data-slot and the default orientation/size", () => {
    render(
      <StepNavigation>
        <StepNavigationList />
      </StepNavigation>
    )
    const root = document.querySelector('[data-slot="step-navigation"]')
    expect(root).toBeInTheDocument()
    expect(root?.tagName).toBe("DIV")
    expect(root).toHaveAttribute("data-orientation", "horizontal")
    expect(root).toHaveAttribute("data-size", "normal")
  })

  it("reflects orientation and size", () => {
    render(
      <StepNavigation orientation="vertical" size="small">
        <StepNavigationList />
      </StepNavigation>
    )
    const root = document.querySelector('[data-slot="step-navigation"]')
    expect(root).toHaveAttribute("data-orientation", "vertical")
    expect(root).toHaveAttribute("data-size", "small")
  })

  it("sets the size-dependent CSS custom properties", () => {
    const { rerender } = render(<StepNavigation />)
    const normal = document.querySelector<HTMLElement>(
      '[data-slot="step-navigation"]'
    )
    expect(normal?.style.getPropertyValue("--step-number-size")).toBe(
      "calc(44/16*1rem)"
    )

    rerender(<StepNavigation size="small" />)
    const small = document.querySelector<HTMLElement>(
      '[data-slot="step-navigation"]'
    )
    expect(small?.style.getPropertyValue("--step-number-size")).toBe(
      "calc(32/16*1rem)"
    )
  })

  it("renders as a nav with asChild", () => {
    render(
      <StepNavigation asChild>
        <nav aria-label="ステップ">
          <StepNavigationList />
        </nav>
      </StepNavigation>
    )
    const nav = screen.getByRole("navigation", { name: "ステップ" })
    expect(nav.tagName).toBe("NAV")
    expect(nav).toHaveAttribute("data-orientation", "horizontal")
  })

  it("keeps a caller className on the root", () => {
    render(<StepNavigation className="custom-class" />)
    expect(document.querySelector('[data-slot="step-navigation"]')).toHaveClass(
      "custom-class"
    )
  })

  it("marks step state, first/last and aria-current", () => {
    render(
      <StepNavigation>
        <StepNavigationList>
          <StepNavigationStep first state="completed" />
          <StepNavigationStep aria-current="step" state="editing" />
          <StepNavigationStep last state="skipped" />
        </StepNavigationList>
      </StepNavigation>
    )
    const steps = screen.getAllByRole("listitem")
    expect(steps[0]).toHaveAttribute("data-state", "completed")
    expect(steps[0]).toHaveAttribute("data-first", "")
    expect(steps[0]).not.toHaveAttribute("data-current")
    expect(steps[1]).toHaveAttribute("aria-current", "step")
    expect(steps[1]).toHaveAttribute("data-current", "")
    expect(steps[2]).toHaveAttribute("data-last", "")
  })

  it('does not mark data-current for aria-current="false"', () => {
    render(
      <StepNavigation>
        <StepNavigationList>
          <StepNavigationStep aria-current="false" />
        </StepNavigationList>
      </StepNavigation>
    )
    expect(screen.getByRole("listitem")).not.toHaveAttribute("data-current")
  })

  it("renders connector lines only between steps", () => {
    const { container } = render(
      <StepNavigation>
        <StepNavigationList>
          <StepNavigationStep first />
          <StepNavigationStep last />
        </StepNavigationList>
      </StepNavigation>
    )
    const steps = container.querySelectorAll(
      '[data-slot="step-navigation-step"]'
    )
    // first / last のステップは片側のコネクタのみ（横向き + 縦向きで 2 本）
    expect(steps[0].querySelectorAll('span[aria-hidden="true"]')).toHaveLength(
      2
    )
    expect(steps[1].querySelectorAll('span[aria-hidden="true"]')).toHaveLength(
      2
    )
  })

  it("prefixes the header with a screen-reader-only ステップ label", () => {
    render(
      <StepNavigation>
        <StepNavigationList>
          <StepNavigationStep>
            <StepNavigationStepHeader>
              <StepNavigationNumber>1</StepNavigationNumber>
              <StepNavigationTitle>申請内容の入力</StepNavigationTitle>
            </StepNavigationStepHeader>
          </StepNavigationStep>
        </StepNavigationList>
      </StepNavigation>
    )
    const header = document.querySelector(
      '[data-slot="step-navigation-step-header"]'
    )
    expect(header?.tagName).toBe("SPAN")
    expect(header?.textContent).toBe("ステップ1申請内容の入力")
    expect(header).not.toHaveAttribute("data-interactive")
  })

  it("renders an interactive header with asChild and injects the sr-only label", () => {
    render(
      <StepNavigation>
        <StepNavigationList>
          <StepNavigationStep>
            <StepNavigationStepHeader asChild>
              <a href="#step-1">
                <StepNavigationNumber>1</StepNavigationNumber>
                <StepNavigationTitle>申請内容の入力</StepNavigationTitle>
              </a>
            </StepNavigationStepHeader>
          </StepNavigationStep>
        </StepNavigationList>
      </StepNavigation>
    )
    const link = screen.getByRole("link", { name: "ステップ 1 申請内容の入力" })
    expect(link).toHaveAttribute("data-interactive", "")
    expect(link).toHaveAttribute("data-slot", "step-navigation-step-header")
  })

  it("omits data-interactive for a disabled asChild header", () => {
    render(
      <StepNavigation>
        <StepNavigationList>
          <StepNavigationStep>
            <StepNavigationStepHeader asChild>
              <button disabled type="button">
                <StepNavigationNumber>2</StepNavigationNumber>
              </button>
            </StepNavigationStepHeader>
          </StepNavigationStep>
        </StepNavigationList>
      </StepNavigation>
    )
    expect(screen.getByRole("button")).not.toHaveAttribute("data-interactive")
  })

  it("renders the state indicator text per state", () => {
    const cases: Array<
      ["completed" | "editing" | "error" | "skipped", string]
    > = [
      ["completed", "完了"],
      ["editing", "編集中"],
      ["error", "エラー"],
      ["skipped", "スキップされました"],
    ]

    for (const [state, label] of cases) {
      const { unmount } = render(<StepNavigationStateIndicator state={state} />)
      expect(screen.getByText(label)).toBeInTheDocument()
      unmount()
    }
  })

  it("renders no state indicator content without a state", () => {
    render(<StepNavigationStateIndicator />)
    const indicator = document.querySelector(
      '[data-slot="step-navigation-state-indicator"]'
    )
    expect(indicator).toBeEmptyDOMElement()
  })

  it("renders the description as a paragraph", () => {
    render(<StepNavigationDescription>説明文</StepNavigationDescription>)
    const description = screen.getByText("説明文")
    expect(description.tagName).toBe("P")
    expect(description).toHaveAttribute(
      "data-slot",
      "step-navigation-description"
    )
  })

  it("forwards refs", () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const listRef = React.createRef<HTMLUListElement>()
    const stepRef = React.createRef<HTMLLIElement>()

    render(
      <StepNavigation ref={rootRef}>
        <StepNavigationList ref={listRef}>
          <StepNavigationStep ref={stepRef} />
        </StepNavigationList>
      </StepNavigation>
    )

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
    expect(listRef.current).toBeInstanceOf(HTMLUListElement)
    expect(stepRef.current).toBeInstanceOf(HTMLLIElement)
  })
})
