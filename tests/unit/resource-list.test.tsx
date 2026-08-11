import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Checkbox } from "@/components/ui/checkbox"
import {
  ResourceList,
  ResourceListAction,
  ResourceListActionButton,
  ResourceListBody,
  ResourceListContents,
  ResourceListControl,
  ResourceListLabel,
  ResourceListSub,
  ResourceListSupport,
  ResourceListTitle,
} from "@/components/ui/resource-list"

describe("ResourceList", () => {
  it("marks the variant and interaction on the root", () => {
    render(<ResourceList interaction="whole" variant="frame" />)
    const root = document.querySelector('[data-slot="resource-list"]')
    expect(root).toHaveAttribute("data-style", "frame")
    expect(root).toHaveAttribute("data-interaction", "whole")
  })

  it("omits data-interaction when not given", () => {
    render(<ResourceList variant="list" />)
    expect(
      document.querySelector('[data-slot="resource-list"]')
    ).not.toHaveAttribute("data-interaction")
  })

  it("renders the body as a link with asChild", () => {
    render(
      <ResourceList variant="list">
        <ResourceListBody asChild>
          <a href="#detail">詳細</a>
        </ResourceListBody>
      </ResourceList>
    )
    const link = screen.getByRole("link", { name: "詳細" })
    expect(link.tagName).toBe("A")
    expect(link).toHaveAttribute("data-slot", "resource-list-body")
  })

  it("renders the title with the requested element", () => {
    const { rerender } = render(
      <ResourceListTitle as="h3">タイトル</ResourceListTitle>
    )
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "タイトル"
    )

    rerender(<ResourceListTitle as="p">タイトル</ResourceListTitle>)
    expect(screen.queryByRole("heading")).not.toBeInTheDocument()
    expect(screen.getByText("タイトル").tagName).toBe("P")
  })

  it("renders a control slot holding the checkbox", () => {
    render(
      <ResourceList interaction="whole" variant="frame">
        <ResourceListBody>
          <ResourceListControl>
            <Checkbox aria-label="選択" size="md" />
          </ResourceListControl>
          <ResourceListContents>
            <ResourceListTitle as="p">タイトル</ResourceListTitle>
          </ResourceListContents>
        </ResourceListBody>
      </ResourceList>
    )
    const control = document.querySelector(
      '[data-slot="resource-list-control"]'
    )
    expect(control?.tagName).toBe("DIV")
    expect(screen.getByRole("checkbox", { name: "選択" }).parentElement).toBe(
      control
    )
  })

  it("renders the action button as type=button", () => {
    render(
      <ResourceListAction>
        <ResourceListActionButton aria-label="メニュー" />
      </ResourceListAction>
    )
    const button = screen.getByRole("button", { name: "メニュー" })
    expect(button).toHaveAttribute("type", "button")
  })

  it("renders label, support and sub slots", () => {
    render(
      <ResourceListContents>
        <ResourceListLabel>ラベル</ResourceListLabel>
        <ResourceListSupport>サポート</ResourceListSupport>
        <ResourceListSub>サブ</ResourceListSub>
      </ResourceListContents>
    )
    expect(screen.getByText("ラベル")).toHaveAttribute(
      "data-slot",
      "resource-list-label"
    )
    expect(screen.getByText("サポート")).toHaveAttribute(
      "data-slot",
      "resource-list-support"
    )
    expect(screen.getByText("サブ")).toHaveAttribute(
      "data-slot",
      "resource-list-sub"
    )
  })

  it("forwards refs", () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const bodyRef = React.createRef<HTMLDivElement>()

    render(
      <ResourceList ref={rootRef} variant="list">
        <ResourceListBody ref={bodyRef} />
      </ResourceList>
    )

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
    expect(bodyRef.current).toBeInstanceOf(HTMLDivElement)
  })
})
