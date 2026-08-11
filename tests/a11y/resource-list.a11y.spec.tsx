import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

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

function Row({
  interaction,
  withControl = true,
}: {
  interaction?: "whole"
  withControl?: boolean
}) {
  return (
    <ul>
      <li>
        <ResourceList interaction={interaction} variant="frame">
          <ResourceListBody>
            {withControl && (
              <ResourceListControl>
                <Checkbox aria-label="転入届を選択" size="md" />
              </ResourceListControl>
            )}
            <ResourceListContents>
              <ResourceListTitle as="h3">転入届</ResourceListTitle>
              <ResourceListLabel>
                <p>手続き</p>
              </ResourceListLabel>
              <ResourceListSupport>
                <p>引越し後 14 日以内に提出してください。</p>
              </ResourceListSupport>
            </ResourceListContents>
            <ResourceListSub>
              <p>所要 10 分</p>
            </ResourceListSub>
          </ResourceListBody>
          <ResourceListAction>
            <ResourceListActionButton aria-label="メニューを開く">
              <svg
                aria-hidden={true}
                fill="currentcolor"
                height={24}
                viewBox="0 0 24 24"
                width={24}
              >
                <circle cx="12" cy="4.5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19.5" r="1.5" />
              </svg>
            </ResourceListActionButton>
          </ResourceListAction>
        </ResourceList>
      </li>
    </ul>
  )
}

describe("ResourceList accessibility", () => {
  it("exposes the checkbox and the action button", () => {
    render(<Row interaction="whole" />)
    expect(
      screen.getByRole("checkbox", { name: "転入届を選択" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "メニューを開く" })
    ).toBeInTheDocument()
  })

  it("has no axe violations with a control", async () => {
    const { container } = render(<Row interaction="whole" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations without a control", async () => {
    const { container } = render(<Row withControl={false} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations as a link row", async () => {
    const { container } = render(
      <ul>
        <li>
          <ResourceList variant="list">
            <ResourceListBody asChild>
              <a href="#detail">
                <ResourceListContents>
                  <ResourceListTitle as="h3">転入届</ResourceListTitle>
                </ResourceListContents>
              </a>
            </ResourceListBody>
          </ResourceList>
        </li>
      </ul>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
