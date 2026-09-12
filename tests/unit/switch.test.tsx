import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { SwitchMode, SwitchOnOff } from "@/components/ui/switch"

describe("SwitchOnOff", () => {
  it("renders a button with role switch and type button", () => {
    render(<SwitchOnOff aria-label="通知" />)
    const el = screen.getByRole("switch", { name: "通知" })
    expect(el.tagName).toBe("BUTTON")
    expect(el).toHaveAttribute("type", "button")
    expect(el).toHaveAttribute("data-slot", "switch-on-off")
  })

  it("defaults aria-checked to false", () => {
    render(<SwitchOnOff aria-label="通知" />)
    expect(screen.getByRole("switch", { name: "通知" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
  })

  it("reflects a passed aria-checked value", () => {
    render(<SwitchOnOff aria-checked aria-label="通知" />)
    expect(screen.getByRole("switch", { name: "通知" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
  })

  it("reflects the disabled prop", () => {
    render(<SwitchOnOff aria-label="通知" disabled />)
    expect(screen.getByRole("switch", { name: "通知" })).toBeDisabled()
  })

  it("fires onClick when clicked", () => {
    const onClick = vi.fn()
    render(<SwitchOnOff aria-label="通知" onClick={onClick} />)
    fireEvent.click(screen.getByRole("switch", { name: "通知" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("merges a passed className", () => {
    render(<SwitchOnOff aria-label="通知" className="custom-class" />)
    const el = screen.getByRole("switch", { name: "通知" })
    expect(el).toHaveClass("custom-class")
    expect(el).toHaveClass("group/switch-on-off")
  })

  it("forwards ref to the underlying button element", () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<SwitchOnOff aria-label="通知" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<SwitchOnOff aria-label="通知" />)
    expect(await axe(container)).toHaveNoViolations()
  })
})

describe("SwitchMode", () => {
  function ControlledSwitchMode(
    props: Partial<React.ComponentProps<typeof SwitchMode>> = {}
  ) {
    const [value, setValue] = React.useState(props.value ?? "オン")
    return (
      <SwitchMode
        leftLabel="オン"
        rightLabel="オフ"
        {...props}
        value={props.value ?? value}
        onChange={props.onChange ?? setValue}
      />
    )
  }

  it("renders a container with two role switch buttons", () => {
    render(<ControlledSwitchMode />)
    const el = screen.getByText("オン").closest('[data-slot="switch-mode"]')
    expect(el).toBeInTheDocument()
    expect(screen.getAllByRole("switch")).toHaveLength(2)
  })

  it("reflects the selected value via aria-checked", () => {
    render(<ControlledSwitchMode value="オン" />)
    expect(screen.getByRole("switch", { name: "オン" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    expect(screen.getByRole("switch", { name: "オフ" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
  })

  it("calls onChange with the toggled label when either button is clicked", () => {
    const onChange = vi.fn()
    render(
      <SwitchMode
        leftLabel="オン"
        onChange={onChange}
        rightLabel="オフ"
        value="オン"
      />
    )
    fireEvent.click(screen.getByRole("switch", { name: "オフ" }))
    expect(onChange).toHaveBeenCalledWith("オフ")

    fireEvent.click(screen.getByRole("switch", { name: "オン" }))
    expect(onChange).toHaveBeenCalledWith("オフ")
  })

  it("applies disabled to both buttons", () => {
    render(<ControlledSwitchMode disabled />)
    expect(screen.getByRole("switch", { name: "オン" })).toBeDisabled()
    expect(screen.getByRole("switch", { name: "オフ" })).toBeDisabled()
  })

  it("applies aria-describedby to both buttons", () => {
    render(<ControlledSwitchMode aria-describedby="support" />)
    expect(screen.getByRole("switch", { name: "オン" })).toHaveAttribute(
      "aria-describedby",
      "support"
    )
    expect(screen.getByRole("switch", { name: "オフ" })).toHaveAttribute(
      "aria-describedby",
      "support"
    )
  })

  it("merges a passed className on the root", () => {
    render(<ControlledSwitchMode className="custom-class" />)
    const el = screen.getByText("オン").closest('[data-slot="switch-mode"]')
    expect(el).toHaveClass("custom-class")
  })

  it("has no accessibility violations", async () => {
    const { container } = render(<ControlledSwitchMode />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
