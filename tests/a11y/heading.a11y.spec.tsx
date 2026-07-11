import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { Heading, HeadingShoulder, HeadingTitle } from "@/components/ui/heading"

describe("Heading accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Heading size="32" hasChip rule="4">
        <HeadingShoulder>手続き情報</HeadingShoulder>
        <HeadingTitle level="h2">申請に必要なもの</HeadingTitle>
      </Heading>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the requested heading level", () => {
    render(
      <Heading size="32">
        <HeadingTitle level="h3">見出し</HeadingTitle>
      </Heading>
    )
    expect(
      screen.getByRole("heading", { level: 3, name: "見出し" })
    ).toBeInTheDocument()
  })
})
