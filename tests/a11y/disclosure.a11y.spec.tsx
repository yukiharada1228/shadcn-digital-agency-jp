import { render } from "@testing-library/react"
import { axe } from "../axe"

import {
  Disclosure,
  DisclosureSummary,
  DisclosureBackLink,
} from "@/components/ui/disclosure"

describe("Disclosure accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Disclosure open>
        <DisclosureSummary id="disclosure-a11y">
          ディスクロージャータイトル
        </DisclosureSummary>
        <div className="pl-8 my-4">
          これはダミーテキストです。
          <DisclosureBackLink href="#disclosure-a11y">
            「ディスクロージャータイトル」の先頭に戻る
          </DisclosureBackLink>
        </div>
      </Disclosure>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the back link with a link role", () => {
    const { getByRole } = render(
      <DisclosureBackLink href="#top">戻る</DisclosureBackLink>
    )
    expect(getByRole("link", { name: "戻る" })).not.toBeNull()
  })
})
