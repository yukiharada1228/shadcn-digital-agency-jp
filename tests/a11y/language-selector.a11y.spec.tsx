import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  LanguageSelector,
  LanguageSelectorButton,
  LanguageSelectorMenu,
  LanguageSelectorMenuItem,
  LanguageSelectorGlobeIcon,
  LanguageSelectorArrowIcon,
} from "@/components/ui/language-selector"

describe("LanguageSelector accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <LanguageSelector>
        <LanguageSelectorButton aria-controls="menu" aria-expanded={true}>
          <LanguageSelectorGlobeIcon />
          <span>Language</span>
          <LanguageSelectorArrowIcon />
        </LanguageSelectorButton>
        <LanguageSelectorMenu id="menu">
          <LanguageSelectorMenuItem href="#ja" isCurrent lang="ja">
            日本語
          </LanguageSelectorMenuItem>
          <LanguageSelectorMenuItem href="#en" lang="en">
            English
          </LanguageSelectorMenuItem>
        </LanguageSelectorMenu>
      </LanguageSelector>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes the button and language links by role", () => {
    render(
      <LanguageSelector>
        <LanguageSelectorButton>
          <span>Language</span>
        </LanguageSelectorButton>
        <LanguageSelectorMenu>
          <LanguageSelectorMenuItem href="#en" lang="en">
            English
          </LanguageSelectorMenuItem>
        </LanguageSelectorMenu>
      </LanguageSelector>
    )
    expect(screen.getByRole("button", { name: "Language" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "English" })).toBeInTheDocument()
  })
})
