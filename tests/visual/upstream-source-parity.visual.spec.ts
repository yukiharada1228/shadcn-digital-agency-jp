import { expect, test, type Page, type TestInfo } from "@playwright/test"
import { inflateSync } from "node:zlib"

type StoryConfig = {
  id: string
  fullPage?: boolean
  maxDiffPixelRatio?: number
  viewport?: { width: number; height: number }
  waitsForModal?: boolean
}

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
  { id: "source-parity-select" },
  { id: "source-parity-separated-date-picker" },
  { id: "source-parity-status-badge" },
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

type DecodedPng = {
  data: Uint8Array
  height: number
  width: number
}

const pngSignature = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
])

function paeth(left: number, up: number, upLeft: number) {
  const p = left + up - upLeft
  const pa = Math.abs(p - left)
  const pb = Math.abs(p - up)
  const pc = Math.abs(p - upLeft)

  if (pa <= pb && pa <= pc) return left
  if (pb <= pc) return up
  return upLeft
}

function decodePng(buffer: Buffer): DecodedPng {
  if (!buffer.subarray(0, 8).equals(pngSignature)) {
    throw new Error("Invalid PNG signature")
  }

  let offset = 8
  let width = 0
  let height = 0
  let bitDepth = 0
  let colorType = 0
  const idatChunks: Buffer[] = []

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset)
    const type = buffer.toString("ascii", offset + 4, offset + 8)
    const dataStart = offset + 8
    const dataEnd = dataStart + length
    const chunk = buffer.subarray(dataStart, dataEnd)

    if (type === "IHDR") {
      width = chunk.readUInt32BE(0)
      height = chunk.readUInt32BE(4)
      bitDepth = chunk[8]
      colorType = chunk[9]
    } else if (type === "IDAT") {
      idatChunks.push(chunk)
    } else if (type === "IEND") {
      break
    }

    offset = dataEnd + 4
  }

  if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
    throw new Error(
      `Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}`
    )
  }

  const channels = colorType === 6 ? 4 : 3
  const bytesPerPixel = channels
  const scanlineLength = width * channels
  const inflated = inflateSync(Buffer.concat(idatChunks))
  const raw = new Uint8Array(height * scanlineLength)

  let srcOffset = 0
  for (let y = 0; y < height; y += 1) {
    const filter = inflated[srcOffset]
    srcOffset += 1
    const rowOffset = y * scanlineLength
    const prevRowOffset = rowOffset - scanlineLength

    for (let x = 0; x < scanlineLength; x += 1) {
      const value = inflated[srcOffset]
      srcOffset += 1

      const left = x >= bytesPerPixel ? raw[rowOffset + x - bytesPerPixel] : 0
      const up = y > 0 ? raw[prevRowOffset + x] : 0
      const upLeft =
        y > 0 && x >= bytesPerPixel ? raw[prevRowOffset + x - bytesPerPixel] : 0

      switch (filter) {
        case 0:
          raw[rowOffset + x] = value
          break
        case 1:
          raw[rowOffset + x] = (value + left) & 0xff
          break
        case 2:
          raw[rowOffset + x] = (value + up) & 0xff
          break
        case 3:
          raw[rowOffset + x] = (value + Math.floor((left + up) / 2)) & 0xff
          break
        case 4:
          raw[rowOffset + x] = (value + paeth(left, up, upLeft)) & 0xff
          break
        default:
          throw new Error(`Unsupported PNG filter: ${filter}`)
      }
    }
  }

  if (colorType === 6) {
    return { data: raw, height, width }
  }

  const rgba = new Uint8Array(width * height * 4)
  for (let i = 0, j = 0; i < raw.length; i += 3, j += 4) {
    rgba[j] = raw[i]
    rgba[j + 1] = raw[i + 1]
    rgba[j + 2] = raw[i + 2]
    rgba[j + 3] = 255
  }

  return { data: rgba, height, width }
}

function comparePngs(expected: Buffer, actual: Buffer, channelThreshold = 51) {
  const expectedPng = decodePng(expected)
  const actualPng = decodePng(actual)

  if (
    expectedPng.width !== actualPng.width ||
    expectedPng.height !== actualPng.height
  ) {
    return {
      diffPixelCount: Number.POSITIVE_INFINITY,
      diffPixelRatio: 1,
      message: `size mismatch: upstream=${expectedPng.width}x${expectedPng.height}, ours=${actualPng.width}x${actualPng.height}`,
    }
  }

  let diffPixelCount = 0
  const totalPixels = expectedPng.width * expectedPng.height

  for (let index = 0; index < expectedPng.data.length; index += 4) {
    const redDiff = Math.abs(expectedPng.data[index] - actualPng.data[index])
    const greenDiff = Math.abs(
      expectedPng.data[index + 1] - actualPng.data[index + 1]
    )
    const blueDiff = Math.abs(
      expectedPng.data[index + 2] - actualPng.data[index + 2]
    )
    const alphaDiff = Math.abs(
      expectedPng.data[index + 3] - actualPng.data[index + 3]
    )

    if (
      redDiff > channelThreshold ||
      greenDiff > channelThreshold ||
      blueDiff > channelThreshold ||
      alphaDiff > channelThreshold
    ) {
      diffPixelCount += 1
    }
  }

  return {
    diffPixelCount,
    diffPixelRatio: diffPixelCount / totalPixels,
    message: `${diffPixelCount}/${totalPixels} pixels differ`,
  }
}

async function waitForImages(page: Page) {
  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.images).map((image) => {
        if (image.complete) return Promise.resolve()

        return new Promise<void>((resolve) => {
          image.addEventListener("load", () => resolve(), { once: true })
          image.addEventListener("error", () => resolve(), { once: true })
        })
      })
    )
  })
}

async function screenshotStory(page: Page, story: StoryConfig, source: string) {
  await page.setViewportSize(story.viewport ?? { width: 900, height: 700 })
  await page.goto(
    `/visual.html?id=${encodeURIComponent(story.id)}&source=${source}`
  )
  await expect(page.getByTestId("visual-story")).toHaveAttribute(
    "data-story-id",
    story.id
  )

  if (story.waitsForModal) {
    await page.waitForFunction(() =>
      document.querySelector("dialog")?.matches(":modal")
    )
  }

  await waitForImages(page)
  await page.waitForTimeout(100)

  if (story.fullPage) {
    return page.screenshot({
      animations: "disabled",
      caret: "hide",
      fullPage: false,
    })
  }

  return page.getByTestId("visual-story").screenshot({
    animations: "disabled",
    caret: "hide",
  })
}

async function attachImages(
  testInfo: TestInfo,
  storyId: string,
  upstream: Buffer,
  ours: Buffer
) {
  await testInfo.attach(`${storyId}-upstream`, {
    body: upstream,
    contentType: "image/png",
  })
  await testInfo.attach(`${storyId}-ours`, {
    body: ours,
    contentType: "image/png",
  })
}

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
