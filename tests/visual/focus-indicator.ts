import { expect, type Locator } from "@playwright/test"

// フォーカスリングが実際に見えているか（太さ 2px 以上・背景とのコントラスト 3:1 以上）
// を判定する。tests/visual の複数 spec から使う。
export async function expectVisibleFocusIndicator(locator: Locator) {
  const indicator = await locator.evaluate((element) => {
    const parseColor = (value: string) => {
      const match = value.trim().match(/^rgba?\((.*)\)$/)
      if (!match) return null

      const parts = match[1]
        .replace(/\//g, " ")
        .split(/[,\s]+/)
        .filter(Boolean)

      return {
        alpha: parts[3] === undefined ? 1 : Number(parts[3]),
        channels: parts.slice(0, 3).map(Number),
      }
    }

    const channelLuminance = (channel: number) => {
      const normalized = channel / 255
      return normalized <= 0.03928
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4
    }

    const luminance = ([red, green, blue]: number[]) =>
      0.2126 * channelLuminance(red) +
      0.7152 * channelLuminance(green) +
      0.0722 * channelLuminance(blue)

    const contrastRatio = (foreground: number[], background: number[]) => {
      const foregroundLuminance = luminance(foreground)
      const backgroundLuminance = luminance(background)
      const lighter = Math.max(foregroundLuminance, backgroundLuminance)
      const darker = Math.min(foregroundLuminance, backgroundLuminance)

      return (lighter + 0.05) / (darker + 0.05)
    }

    const backgroundFor = (node: Element) => {
      let current: Element | null = node

      while (current) {
        const background = parseColor(getComputedStyle(current).backgroundColor)
        if (background && background.alpha > 0) {
          return background.channels
        }
        current = current.parentElement
      }

      return [255, 255, 255]
    }

    const candidates = [element, ...Array.from(element.querySelectorAll("*"))]

    for (const candidate of candidates) {
      const style = getComputedStyle(candidate)
      const outlineWidth = Number.parseFloat(style.outlineWidth)
      const outlineColor = parseColor(style.outlineColor)

      if (style.outlineStyle !== "none" && outlineWidth >= 2 && outlineColor) {
        return {
          contrastRatio: contrastRatio(
            outlineColor.channels,
            backgroundFor(candidate.parentElement ?? candidate)
          ),
          outlineColor: style.outlineColor,
          outlineStyle: style.outlineStyle,
          outlineWidth,
        }
      }
    }

    return null
  })

  expect(indicator).not.toBeNull()
  expect(indicator?.outlineWidth).toBeGreaterThanOrEqual(2)
  expect(indicator?.contrastRatio).toBeGreaterThanOrEqual(3)
}
