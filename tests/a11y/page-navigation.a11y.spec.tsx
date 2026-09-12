import { render } from "@testing-library/react"
import { axe } from "../axe"

import {
  PageNavigation,
  PageNavigationButton,
  PageNavigationCounter,
} from "@/components/ui/page-navigation"

describe("PageNavigation accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <PageNavigation aria-label="ページ">
        <PageNavigationButton control="prev" variant="text">
          前のページ
        </PageNavigationButton>
        <PageNavigationCounter>5 / 9</PageNavigationCounter>
        <PageNavigationButton control="next" variant="text">
          次のページ
        </PageNavigationButton>
      </PageNavigation>
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
