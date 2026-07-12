import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  EmergencyBanner,
  EmergencyBannerHeading,
  EmergencyBannerBody,
  EmergencyBannerButton,
} from "@/components/ui/emergency-banner"

describe("EmergencyBanner accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <EmergencyBanner>
        <EmergencyBannerHeading level="h2">
          〇〇地区に避難準備情報が発令されました
        </EmergencyBannerHeading>
        <EmergencyBannerBody>
          <p className="text-std-16N-170">
            1時23分に○○地区に対して避難準備情報が発令されました。
          </p>
          <EmergencyBannerButton href="#" target="_blank">
            指定避難所を確認する
          </EmergencyBannerButton>
        </EmergencyBannerBody>
      </EmergencyBanner>
    )
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument()
    expect(screen.getByRole("link")).toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
