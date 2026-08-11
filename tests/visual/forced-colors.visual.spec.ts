import { expect, test } from "@playwright/test"

import {
  attachImages,
  comparePngs,
  screenshotStory,
  type StoryConfig,
} from "./parity-helpers"

// forced-colors（Windows ハイコントラスト等）は upstream が `forced-colors:` 系の
// クラスで明示的に扱っている領域。通常表示では同じでも、ここだけずれる移植ミスを
// 拾えるように、強制カラーを有効にした状態でも upstream と突き合わせる。
const stories: StoryConfig[] = [
  { id: "source-parity-button" },
  { id: "source-parity-checkbox" },
  { id: "source-parity-radio" },
  { id: "source-parity-progress-indicator" },
  { id: "source-parity-search-box", viewport: { width: 800, height: 700 } },
  {
    id: "source-parity-step-navigation-horizontal",
    viewport: { width: 1000, height: 500 },
  },
  { id: "source-parity-resource-list", viewport: { width: 700, height: 900 } },
]

test.describe("Upstream source visual parity (forced colors)", () => {
  for (const story of stories) {
    test(story.id, async ({ page }, testInfo) => {
      // `test.use({ forcedColors })` はこの構成ではメディアクエリに反映されず、
      // 強制カラー無しの比較を 2 回するだけになる。実行時 API を使い、
      // 実際に有効になったことを必ず確かめる。
      await page.emulateMedia({ forcedColors: "active" })
      await page.goto("/visual.html?id=source-parity-button&source=ours")
      expect(
        await page.evaluate(
          () => matchMedia("(forced-colors: active)").matches
        ),
        "forced-colors emulation is not active"
      ).toBe(true)

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
