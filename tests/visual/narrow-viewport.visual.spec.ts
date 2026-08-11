import { expect, test } from "@playwright/test"

import {
  attachImages,
  comparePngs,
  screenshotStory,
  type StoryConfig,
} from "./parity-helpers"

// 狭い画面幅でのはみ出し・折り返しは upstream の実装依存。ここでは
// 「upstream と同じように折り返しているか」だけを見る（狭い幅で upstream 自身が
// どう振る舞うかは upstream の設計判断）。
const width = 375

const stories: StoryConfig[] = [
  { id: "source-parity-button", viewport: { width, height: 700 } },
  { id: "source-parity-checkbox", viewport: { width, height: 700 } },
  { id: "source-parity-input", viewport: { width, height: 700 } },
  { id: "source-parity-search-box", viewport: { width, height: 900 } },
  { id: "source-parity-resource-list", viewport: { width, height: 900 } },
  {
    id: "source-parity-step-navigation-vertical",
    viewport: { width, height: 900 },
  },
  {
    id: "source-parity-step-navigation-horizontal",
    viewport: { width, height: 500 },
  },
]

test.describe("Upstream source visual parity (narrow viewport)", () => {
  for (const story of stories) {
    test(story.id, async ({ page }, testInfo) => {
      const upstream = await screenshotStory(page, story, "upstream")
      const ours = await screenshotStory(page, story, "ours")
      const result = comparePngs(upstream, ours)
      const maxDiffPixelRatio = story.maxDiffPixelRatio ?? 0.0005

      if (result.diffPixelRatio > maxDiffPixelRatio) {
        await attachImages(testInfo, story.id, upstream, ours)
      }

      expect(
        result.diffPixelRatio,
        `${story.id}: ${result.message}; max ratio ${maxDiffPixelRatio}`
      ).toBeLessThanOrEqual(maxDiffPixelRatio)
    })
  }
})
