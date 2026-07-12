import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Breadcrumbs,
  BreadcrumbsLabel,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@/components/ui/breadcrumbs"

describe("Breadcrumbs accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Breadcrumbs aria-labelledby="breadcrumbs-label">
        <BreadcrumbsLabel className="sr-only" id="breadcrumbs-label">
          現在位置
        </BreadcrumbsLabel>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">ホーム</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">組織情報</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrent>現在のページ</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumbs>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes a navigation landmark", () => {
    render(
      <Breadcrumbs aria-labelledby="breadcrumbs-label">
        <BreadcrumbsLabel className="sr-only" id="breadcrumbs-label">
          現在位置
        </BreadcrumbsLabel>
        <BreadcrumbList>
          <BreadcrumbItem isCurrent>現在のページ</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumbs>
    )
    expect(screen.getByRole("navigation")).toBeInTheDocument()
  })
})
