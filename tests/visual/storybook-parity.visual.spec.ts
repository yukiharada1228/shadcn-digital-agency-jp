import { expect, test } from "@playwright/test"

import { storybookVisualStories } from "./storybook-stories"

test.describe("Storybook visual parity fixtures", () => {
  for (const story of storybookVisualStories) {
    test(story.id, async ({ page }) => {
      await page.goto(`/visual.html?id=${encodeURIComponent(story.id)}`)

      const storyRoot = page.getByTestId("visual-story")
      await expect(storyRoot).toHaveAttribute("data-story-id", story.id)
      await expect(storyRoot).toHaveScreenshot(`${story.snapshot}.png`, {
        animations: "disabled",
        caret: "hide",
      })
    })
  }
})
