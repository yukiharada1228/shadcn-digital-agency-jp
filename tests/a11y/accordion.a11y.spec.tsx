import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Accordion,
  AccordionBackLink,
  AccordionContent,
  AccordionSummary,
} from "@/components/ui/accordion"

describe("Accordion accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Accordion open>
        <AccordionSummary>
          <h3>ダミーテキストとは何ですか？</h3>
        </AccordionSummary>
        <AccordionContent>
          <p>これはダミーテキストです。</p>
          <AccordionBackLink href="#top">先頭に戻る</AccordionBackLink>
        </AccordionContent>
      </Accordion>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the back link with role=link", () => {
    render(
      <Accordion open>
        <AccordionSummary>
          <h3>質問</h3>
        </AccordionSummary>
        <AccordionContent>
          <AccordionBackLink href="#top">先頭に戻る</AccordionBackLink>
        </AccordionContent>
      </Accordion>
    )
    expect(screen.getByRole("link", { name: "先頭に戻る" })).toBeInTheDocument()
  })
})
