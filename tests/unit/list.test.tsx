import * as React from "react"
import { render } from "@testing-library/react"

import { List } from "@/components/ui/list"

describe("List", () => {
  it("renders a ul with data-slot", () => {
    const { container } = render(
      <List spacing="4">
        <li>item</li>
      </List>
    )
    const ul = container.querySelector("ul")
    expect(ul).not.toBeNull()
    expect(ul).toHaveAttribute("data-slot", "list")
  })

  it("renders its children", () => {
    const { getByText } = render(
      <List spacing="8">
        <li>hello world</li>
      </List>
    )
    expect(getByText("hello world")).not.toBeNull()
  })

  it("reflects the spacing prop via data-spacing", () => {
    const { container } = render(
      <List spacing="12">
        <li>item</li>
      </List>
    )
    const ul = container.querySelector("ul")
    expect(ul).toHaveAttribute("data-spacing", "12")
  })

  it("uses the default (unordered) marker style by default", () => {
    const { container } = render(
      <List spacing="4">
        <li>item</li>
      </List>
    )
    const ul = container.querySelector("ul")
    expect(ul?.className).toContain("list-[revert]")
  })

  it("reflects the number marker via data-marker and numbered style", () => {
    const { container } = render(
      <List spacing="4" marker="number">
        <li>item</li>
      </List>
    )
    const ul = container.querySelector("ul")
    expect(ul).toHaveAttribute("data-marker", "number")
    expect(ul?.className).toContain("grid-cols-[minmax(2rem,auto)_1fr]")
  })

  it("merges a passed className", () => {
    const { container } = render(
      <List spacing="4" className="custom-class">
        <li>item</li>
      </List>
    )
    const ul = container.querySelector("ul")
    expect(ul?.className).toContain("custom-class")
  })

  it("forwards ref to the underlying ul element", () => {
    const ref = React.createRef<HTMLUListElement>()
    render(
      <List spacing="4" ref={ref}>
        <li>item</li>
      </List>
    )
    expect(ref.current).toBeInstanceOf(HTMLUListElement)
  })
})
