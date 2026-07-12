import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  NotificationBanner,
  NotificationBannerBody,
  NotificationBannerClose,
} from "@/components/ui/notification-banner"

describe("NotificationBanner accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <NotificationBanner
        bannerStyle="standard"
        type="info1"
        title="登録期間が延長されました"
        headingLevel="h2"
      >
        <NotificationBannerClose onClick={() => {}} />
        <NotificationBannerBody>
          ダミーテキストは、デザインの作成時に使用される仮の文章です。
        </NotificationBannerBody>
      </NotificationBanner>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the title as a heading when headingLevel is set", () => {
    render(
      <NotificationBanner
        bannerStyle="standard"
        type="info1"
        title="登録期間が延長されました"
        headingLevel="h2"
      >
        <NotificationBannerBody>本文</NotificationBannerBody>
      </NotificationBanner>
    )
    const heading = screen.getByRole("heading", { level: 2 })
    expect(heading).toHaveTextContent("登録期間が延長されました")
  })
})
