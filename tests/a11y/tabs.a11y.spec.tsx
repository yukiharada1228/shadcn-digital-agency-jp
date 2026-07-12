import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Tab,
  TabItem,
  TabList,
  TabPanel,
  useTabAria,
} from "@/components/ui/tabs"

const AriaTabs = () => {
  const { getListProps, getTabProps, getPanelProps } = useTabAria()
  return (
    <Tab>
      <TabList {...getListProps()} aria-label="タブ">
        <TabItem {...getTabProps(0)}>タブ1</TabItem>
        <TabItem {...getTabProps(1)}>タブ2</TabItem>
      </TabList>
      <TabPanel {...getPanelProps(0)}>パネル1</TabPanel>
      <TabPanel {...getPanelProps(1)}>パネル2</TabPanel>
    </Tab>
  )
}

describe("Tabs accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<AriaTabs />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes tablist, tab and tabpanel roles", () => {
    render(<AriaTabs />)
    expect(screen.getByRole("tablist", { name: "タブ" })).toBeInTheDocument()
    expect(screen.getAllByRole("tab")).toHaveLength(2)
    expect(
      screen.getAllByRole("tabpanel", { hidden: true }).length
    ).toBeGreaterThan(0)
  })
})
