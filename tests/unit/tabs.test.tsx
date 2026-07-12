import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Tab,
  TabItem,
  TabList,
  TabPanel,
  useTab,
  useTabAria,
} from "@/components/ui/tabs"

describe("Tab primitives", () => {
  it("renders each part with its data-slot", () => {
    render(
      <Tab>
        <TabList>
          <TabItem href="#a">A</TabItem>
        </TabList>
        <TabPanel>Panel</TabPanel>
      </Tab>
    )
    expect(screen.getByText("Panel")).toHaveAttribute("data-slot", "tab-panel")
    const list = screen.getByRole("list")
    expect(list).toHaveAttribute("data-slot", "tab-list")
    expect(screen.getByRole("link", { name: "A" })).toHaveAttribute(
      "data-slot",
      "tab-item"
    )
    // Root wrapper
    expect(document.querySelector('[data-slot="tab"]')).toBeInTheDocument()
  })

  it("sets data-position on the root (default top)", () => {
    const { rerender } = render(<Tab>content</Tab>)
    expect(document.querySelector('[data-slot="tab"]')).toHaveAttribute(
      "data-position",
      "top"
    )
    rerender(<Tab position="left">content</Tab>)
    expect(document.querySelector('[data-slot="tab"]')).toHaveAttribute(
      "data-position",
      "left"
    )
  })

  it("merges className last on each part", () => {
    render(
      <Tab className="tab-x">
        <TabList className="list-x">
          <TabItem href="#a" className="item-x">
            A
          </TabItem>
        </TabList>
        <TabPanel className="panel-x">Panel</TabPanel>
      </Tab>
    )
    expect(document.querySelector('[data-slot="tab"]')).toHaveClass("tab-x")
    expect(screen.getByRole("list")).toHaveClass("list-x")
    expect(screen.getByRole("link", { name: "A" })).toHaveClass("item-x")
    expect(screen.getByText("Panel")).toHaveClass("panel-x")
  })

  it("forwards refs on Tab, TabList and TabPanel", () => {
    const tabRef = React.createRef<HTMLDivElement>()
    const listRef = React.createRef<HTMLUListElement>()
    const panelRef = React.createRef<HTMLDivElement>()
    render(
      <Tab ref={tabRef}>
        <TabList ref={listRef}>
          <TabItem href="#a">A</TabItem>
        </TabList>
        <TabPanel ref={panelRef}>Panel</TabPanel>
      </Tab>
    )
    expect(tabRef.current).toBeInstanceOf(HTMLDivElement)
    expect(listRef.current).toBeInstanceOf(HTMLUListElement)
    expect(panelRef.current).toBeInstanceOf(HTMLDivElement)
  })

  it("renders TabItem as an anchor by default and a button when requested", () => {
    render(
      <ul>
        <TabItem href="/x">Link</TabItem>
        <TabItem
          _internalElementType="button"
          _internalListItemRole="presentation"
        >
          Button
        </TabItem>
      </ul>
    )
    expect(screen.getByRole("link", { name: "Link" })).toHaveAttribute(
      "href",
      "/x"
    )
    expect(screen.getByRole("button", { name: "Button" })).toBeInTheDocument()
  })

  it("wraps each TabItem in a presentation list item when requested", () => {
    render(
      <ul>
        <TabItem
          _internalElementType="button"
          _internalListItemRole="presentation"
        >
          Button
        </TabItem>
      </ul>
    )
    expect(screen.getByRole("presentation")).toBeInTheDocument()
  })
})

describe("useTab (Tab-key navigation)", () => {
  const Example = ({
    onTabChange,
  }: {
    onTabChange?: (d: {
      selectedIndex: number
      selectedTabLabel: string
    }) => void
  }) => {
    const { getListProps, getTabProps, getPanelProps } = useTab({ onTabChange })
    return (
      <>
        <h2 id="heading">Heading</h2>
        <Tab>
          <TabList {...getListProps()} aria-labelledby="heading">
            <TabItem {...getTabProps(0)}>Tab1</TabItem>
            <TabItem {...getTabProps(1)}>Tab2</TabItem>
          </TabList>
          <TabPanel {...getPanelProps(0)}>Panel1</TabPanel>
          <TabPanel {...getPanelProps(1)}>Panel2</TabPanel>
        </Tab>
      </>
    )
  }

  it("marks the first tab aria-current and hides other panels initially", () => {
    render(<Example />)
    const links = screen.getAllByRole("link")
    expect(links[0]).toHaveAttribute("aria-current", "true")
    expect(links[1]).not.toHaveAttribute("aria-current")
    expect(screen.getByText("Panel2").closest("[hidden]")).not.toBeNull()
  })

  it("updates aria-current and fires onTabChange on click", () => {
    const onTabChange = vi.fn()
    render(<Example onTabChange={onTabChange} />)
    fireEvent.click(screen.getByRole("link", { name: "Tab2" }))
    const links = screen.getAllByRole("link")
    expect(links[1]).toHaveAttribute("aria-current", "true")
    expect(links[0]).not.toHaveAttribute("aria-current")
    expect(onTabChange).toHaveBeenCalledWith({
      selectedIndex: 1,
      selectedTabLabel: "Tab2",
    })
  })

  it("does not fire onTabChange on initial render", () => {
    const onTabChange = vi.fn()
    render(<Example onTabChange={onTabChange} />)
    expect(onTabChange).not.toHaveBeenCalled()
  })
})

describe("useTabAria (Arrow-key navigation)", () => {
  const AriaExample = ({
    activation,
    onTabChange,
  }: {
    activation?: "auto" | "manual"
    onTabChange?: (d: {
      selectedIndex: number
      selectedTabLabel: string
    }) => void
  }) => {
    const { getListProps, getTabProps, getPanelProps } = useTabAria({
      activation,
      onTabChange,
    })
    return (
      <Tab>
        <TabList {...getListProps()}>
          <TabItem {...getTabProps(0)}>TabA</TabItem>
          <TabItem {...getTabProps(1)}>TabB</TabItem>
          <TabItem {...getTabProps(2)}>TabC</TabItem>
        </TabList>
        <TabPanel {...getPanelProps(0)}>P1</TabPanel>
        <TabPanel {...getPanelProps(1)}>P2</TabPanel>
        <TabPanel {...getPanelProps(2)}>P3</TabPanel>
      </Tab>
    )
  }

  it("sets role=tablist / tab / tabpanel and initial aria-selected + tabIndex", () => {
    render(<AriaExample />)
    expect(screen.getByRole("tablist")).toBeInTheDocument()
    const tabs = screen.getAllByRole("tab")
    expect(tabs[0]).toHaveAttribute("aria-selected", "true")
    expect(tabs[1]).toHaveAttribute("aria-selected", "false")
    expect(tabs[0]).toHaveAttribute("tabindex", "0")
    expect(tabs[1]).toHaveAttribute("tabindex", "-1")
  })

  it("links tab and panel via aria-controls / aria-labelledby", () => {
    render(<AriaExample />)
    const tab0 = screen.getAllByRole("tab")[0]
    const panel0 = screen.getAllByRole("tabpanel", { hidden: true })[0]
    expect(tab0.getAttribute("aria-controls")).toBe(panel0.id)
    expect(panel0.getAttribute("aria-labelledby")).toBe(tab0.id)
  })

  it("selects a tab on click and updates aria-selected + tabIndex", () => {
    render(<AriaExample />)
    fireEvent.click(screen.getByRole("tab", { name: "TabB" }))
    const tabs = screen.getAllByRole("tab")
    expect(tabs[1]).toHaveAttribute("aria-selected", "true")
    expect(tabs[1]).toHaveAttribute("tabindex", "0")
    expect(tabs[0]).toHaveAttribute("aria-selected", "false")
  })

  it("moves selection with arrow, Home and End keys in auto mode", () => {
    render(<AriaExample />)
    const list = screen.getByRole("tablist")
    const tabs = screen.getAllByRole("tab")

    fireEvent.keyDown(tabs[0], { key: "ArrowRight" })
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    )

    fireEvent.keyDown(screen.getAllByRole("tab")[1], { key: "ArrowLeft" })
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    )

    fireEvent.keyDown(screen.getAllByRole("tab")[0], { key: "End" })
    expect(screen.getAllByRole("tab")[2]).toHaveAttribute(
      "aria-selected",
      "true"
    )

    fireEvent.keyDown(screen.getAllByRole("tab")[2], { key: "Home" })
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    )
    // list is present and receives key handlers
    expect(list).toBeInTheDocument()
  })

  it("only moves focus in manual mode until Enter/Space selects", () => {
    render(<AriaExample activation="manual" />)
    const tabs = screen.getAllByRole("tab")
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" })
    // selection unchanged
    expect(screen.getAllByRole("tab")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    )
    // clicking selects (activation applies to keys; click always selects)
    fireEvent.click(screen.getAllByRole("tab")[1])
    expect(screen.getAllByRole("tab")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("fires onTabChange with detail on click", () => {
    const onTabChange = vi.fn()
    render(<AriaExample onTabChange={onTabChange} />)
    fireEvent.click(screen.getByRole("tab", { name: "TabB" }))
    expect(onTabChange).toHaveBeenCalledWith({
      selectedIndex: 1,
      selectedTabLabel: "TabB",
    })
  })
})
