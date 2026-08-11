import { expect, test } from "@playwright/test"

import {
  attachImages,
  comparePngs,
  screenshotStory,
  type StoryConfig,
} from "./parity-helpers"

const stories: StoryConfig[] = [
  { id: "source-parity-accordion" },
  { id: "source-parity-blockquote" },
  { id: "source-parity-breadcrumbs" },
  { id: "source-parity-button" },
  { id: "source-parity-checkbox" },
  { id: "source-parity-chip-label" },
  { id: "source-parity-disclosure" },
  { id: "source-parity-divider" },
  { id: "source-parity-dl" },
  {
    id: "source-parity-emergency-banner",
    viewport: { width: 1280, height: 700 },
  },
  { id: "source-parity-error-text" },
  {
    id: "source-parity-file-upload",
    viewport: { width: 1100, height: 800 },
  },
  { id: "source-parity-hamburger-menu-button" },
  { id: "source-parity-heading" },
  {
    id: "source-parity-horizontal-menu",
    viewport: { width: 1100, height: 600 },
  },
  { id: "source-parity-image", viewport: { width: 900, height: 850 } },
  { id: "source-parity-input" },
  { id: "source-parity-label" },
  { id: "source-parity-language-selector" },
  { id: "source-parity-legend" },
  { id: "source-parity-link" },
  { id: "source-parity-list", viewport: { width: 900, height: 900 } },
  { id: "source-parity-menu-list" },
  {
    id: "source-parity-notification-banner",
    viewport: { width: 1280, height: 700 },
  },
  { id: "source-parity-progress-indicator" },
  { id: "source-parity-radio" },
  { id: "source-parity-requirement-badge" },
  {
    id: "source-parity-resource-list",
    maxDiffPixelRatio: 0.0005,
    viewport: { width: 700, height: 800 },
  },
  { id: "source-parity-select" },
  { id: "source-parity-separated-date-picker" },
  {
    id: "source-parity-search-box",
    maxDiffPixelRatio: 0.0005,
    viewport: { width: 800, height: 700 },
  },
  { id: "source-parity-status-badge" },
  // 状態ごとの色差は小さく、既定の 1% 許容では拾えないため厳しめにする。
  {
    id: "source-parity-step-navigation-horizontal",
    maxDiffPixelRatio: 0.0005,
    viewport: { width: 1000, height: 500 },
  },
  {
    id: "source-parity-step-navigation-vertical",
    maxDiffPixelRatio: 0.0005,
    viewport: { width: 900, height: 900 },
  },
  { id: "source-parity-support-text" },
  { id: "source-parity-tabs-static-top" },
  { id: "source-parity-tabs-static-left" },
  {
    id: "source-parity-dialog-basic-open",
    fullPage: true,
    waitsForModal: true,
  },
  {
    id: "source-parity-dialog-inner-fixed-both",
    fullPage: true,
    waitsForModal: true,
  },
  { id: "source-parity-menu-list-box-open" },
  {
    id: "source-parity-carousel-multi",
    viewport: { width: 1280, height: 850 },
  },
  {
    id: "source-parity-carousel-single",
    viewport: { width: 1280, height: 650 },
  },
  { id: "source-parity-table-row-column" },
  {
    id: "source-parity-drawer-right-open",
    fullPage: true,
    waitsForModal: true,
  },
  { id: "source-parity-calendar-grid" },
  { id: "source-parity-date-picker-errored" },
  { id: "source-parity-textarea" },
  { id: "source-parity-utility-link" },
]

test.describe("Upstream source visual parity", () => {
  for (const story of stories) {
    test(story.id, async ({ page }, testInfo) => {
      const upstream = await screenshotStory(page, story, "upstream")
      const ours = await screenshotStory(page, story, "ours")
      const result = comparePngs(upstream, ours)
      const maxDiffPixelRatio = story.maxDiffPixelRatio ?? 0.01

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
