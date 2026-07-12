import * as React from "react"
import { act, render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  ProgressIndicator,
  ProgressIndicatorLinear,
  ProgressIndicatorSpinner,
  ProgressIndicatorStatic,
  useProgressIndicatorAnnouncer,
} from "@/components/ui/progress-indicator"

describe("ProgressIndicator", () => {
  it("renders as a progressbar with data-slot and data-type", () => {
    render(
      <ProgressIndicator type="stacked" aria-label="読み込み中">
        <ProgressIndicatorSpinner />
      </ProgressIndicator>
    )
    const root = screen.getByRole("progressbar")
    expect(root).toHaveAttribute("data-slot", "progress-indicator")
    expect(root).toHaveAttribute("data-type", "stacked")
    expect(root.tagName).toBe("DIV")
  })

  it("renders nothing when active is false", () => {
    render(
      <ProgressIndicator type="stacked" active={false} aria-label="読み込み中">
        <ProgressIndicatorSpinner />
      </ProgressIndicator>
    )
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument()
  })

  it("is indeterminate (no aria-valuenow) when value is omitted", () => {
    render(
      <ProgressIndicator type="inlined" aria-label="読み込み中">
        <ProgressIndicatorLinear />
      </ProgressIndicator>
    )
    const root = screen.getByRole("progressbar")
    expect(root).toHaveAttribute("data-indeterminate", "")
    expect(root).not.toHaveAttribute("aria-valuenow")
  })

  it("reflects a determinate value via aria-valuenow and --value", () => {
    render(
      <ProgressIndicator type="stacked" value={42} aria-label="読み込み中">
        <ProgressIndicatorLinear />
      </ProgressIndicator>
    )
    const root = screen.getByRole("progressbar")
    expect(root).toHaveAttribute("aria-valuenow", "42")
    expect(root).not.toHaveAttribute("data-indeterminate")
    expect(root.style.getPropertyValue("--value")).toBe("42")
  })

  it("clamps value to the 0-100 range", () => {
    const { rerender } = render(
      <ProgressIndicator type="stacked" value={150} aria-label="読み込み中">
        <ProgressIndicatorLinear />
      </ProgressIndicator>
    )
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100"
    )
    rerender(
      <ProgressIndicator type="stacked" value={-20} aria-label="読み込み中">
        <ProgressIndicatorLinear />
      </ProgressIndicator>
    )
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0"
    )
  })

  it("merges className after base classes and forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <ProgressIndicator
        ref={ref}
        type="stacked"
        className="custom-class"
        aria-label="読み込み中"
      >
        <ProgressIndicatorSpinner />
      </ProgressIndicator>
    )
    const root = screen.getByRole("progressbar")
    expect(ref.current).toBe(root)
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("group/progress-indicator")
  })
})

describe("ProgressIndicatorSpinner", () => {
  it("renders lg size with 48px dimensions and data-indicator", () => {
    const { container } = render(<ProgressIndicatorSpinner size="lg" />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("data-slot", "progress-indicator-spinner")
    expect(svg).toHaveAttribute("data-indicator", "spinner")
    expect(svg).toHaveAttribute("width", "48")
    expect(svg).toHaveAttribute("aria-hidden", "true")
  })

  it("renders sm size with 24px dimensions", () => {
    const { container } = render(<ProgressIndicatorSpinner size="sm" />)
    expect(container.querySelector("svg")).toHaveAttribute("width", "24")
  })

  it("defaults to lg size", () => {
    const { container } = render(<ProgressIndicatorSpinner />)
    expect(container.querySelector("svg")).toHaveAttribute("width", "48")
  })

  it("forwards ref and merges className", () => {
    const ref = React.createRef<SVGSVGElement>()
    const { container } = render(
      <ProgressIndicatorSpinner ref={ref} className="custom-spinner" />
    )
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
    expect(container.querySelector("svg")).toHaveClass("custom-spinner")
  })
})

describe("ProgressIndicatorLinear", () => {
  it("renders lg size with 240px width", () => {
    const { container } = render(<ProgressIndicatorLinear size="lg" />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("data-slot", "progress-indicator-linear")
    expect(svg).toHaveAttribute("data-indicator", "linear")
    expect(svg).toHaveAttribute("width", "240")
  })

  it("renders sm size with 80px width", () => {
    const { container } = render(<ProgressIndicatorLinear size="sm" />)
    expect(container.querySelector("svg")).toHaveAttribute("width", "80")
  })

  it("forwards ref", () => {
    const ref = React.createRef<SVGSVGElement>()
    render(<ProgressIndicatorLinear ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })
})

describe("ProgressIndicatorStatic", () => {
  it("renders lg size with 48px viewBox", () => {
    const { container } = render(<ProgressIndicatorStatic size="lg" />)
    const svg = container.querySelector("svg")!
    expect(svg).toHaveAttribute("data-slot", "progress-indicator-static")
    expect(svg).toHaveAttribute("data-indicator", "static")
    expect(svg).toHaveAttribute("width", "48")
  })

  it("renders sm size with 24px viewBox", () => {
    const { container } = render(<ProgressIndicatorStatic size="sm" />)
    expect(container.querySelector("svg")).toHaveAttribute("width", "24")
  })

  it("forwards ref and merges className", () => {
    const ref = React.createRef<SVGSVGElement>()
    const { container } = render(
      <ProgressIndicatorStatic ref={ref} className="custom-static" />
    )
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
    expect(container.querySelector("svg")).toHaveClass("custom-static")
    expect(container.querySelector("svg")).toHaveClass("text-key-1200")
  })
})

describe("useProgressIndicatorAnnouncer", () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  const Harness = (props: {
    active: boolean
    value?: number
    messages?: Parameters<typeof useProgressIndicatorAnnouncer>[0]["messages"]
  }) => {
    const text = useProgressIndicatorAnnouncer(props)
    return (
      <span role="status" data-testid="announce">
        {text}
      </span>
    )
  }

  it("announces start when becoming active", () => {
    render(<Harness active={true} />)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId("announce")).toHaveTextContent(
      "読み込みを開始しました"
    )
  })

  it("announces end when going inactive after being active", () => {
    const { rerender } = render(<Harness active={true} />)
    act(() => {
      vi.advanceTimersByTime(1200)
    })
    rerender(<Harness active={false} />)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId("announce")).toHaveTextContent(
      "読み込みが完了しました"
    )
  })

  it("announces progress percentage after the interval when a value is set", () => {
    render(<Harness active={true} value={30} />)
    act(() => {
      vi.advanceTimersByTime(5000 + 150)
    })
    expect(screen.getByTestId("announce")).toHaveTextContent(
      "30% 読み込みました。"
    )
  })

  it("supports custom messages", () => {
    render(<Harness active={true} messages={{ start: "Loading started" }} />)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId("announce")).toHaveTextContent("Loading started")
  })
})

describe("ProgressIndicator accessibility", () => {
  it("has no accessibility violations", async () => {
    const labelId = "pi-label"
    const { container } = render(
      <ProgressIndicator type="stacked" aria-labelledby={labelId}>
        <ProgressIndicatorSpinner size="lg" />
        <span id={labelId}>読み込み中</span>
      </ProgressIndicator>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
