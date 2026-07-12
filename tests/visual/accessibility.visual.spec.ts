import { expect, test, type Locator, type Page } from "@playwright/test"

type ContrastFailure = {
  background: string
  foreground: string
  label: string
  ratio: number
  required: number
  text: string
}

async function expectNoContrastFailures(page: Page) {
  const failures = await page
    .locator("[data-a11y-contrast]")
    .evaluateAll((elements): ContrastFailure[] => {
      type Rgba = [number, number, number, number]

      const parseColor = (value: string): Rgba | null => {
        const normalized = value.trim()

        if (normalized === "transparent") {
          return [0, 0, 0, 0]
        }

        const match = normalized.match(/^rgba?\((.*)\)$/)
        if (!match) {
          return null
        }

        const parts = match[1]
          .replace(/\//g, " ")
          .split(/[,\s]+/)
          .filter(Boolean)

        const parseChannel = (part: string) =>
          part.endsWith("%")
            ? (Number.parseFloat(part) / 100) * 255
            : Number.parseFloat(part)
        const parseAlpha = (part: string | undefined) => {
          if (!part) return 1
          return part.endsWith("%")
            ? Number.parseFloat(part) / 100
            : Number.parseFloat(part)
        }

        return [
          parseChannel(parts[0]),
          parseChannel(parts[1]),
          parseChannel(parts[2]),
          parseAlpha(parts[3]),
        ]
      }

      const effectiveBackground = (element: Element): Rgba => {
        let current: Element | null = element

        while (current) {
          const background = parseColor(
            getComputedStyle(current).backgroundColor
          )
          if (background && background[3] > 0) {
            return background
          }
          current = current.parentElement
        }

        return [255, 255, 255, 1]
      }

      const flatten = (foreground: Rgba, background: Rgba): Rgba => {
        const alpha = foreground[3]
        return [
          foreground[0] * alpha + background[0] * (1 - alpha),
          foreground[1] * alpha + background[1] * (1 - alpha),
          foreground[2] * alpha + background[2] * (1 - alpha),
          1,
        ]
      }

      const channelLuminance = (channel: number) => {
        const normalized = channel / 255
        return normalized <= 0.03928
          ? normalized / 12.92
          : ((normalized + 0.055) / 1.055) ** 2.4
      }

      const luminance = ([red, green, blue]: Rgba) =>
        0.2126 * channelLuminance(red) +
        0.7152 * channelLuminance(green) +
        0.0722 * channelLuminance(blue)

      const ratio = (foreground: Rgba, background: Rgba) => {
        const foregroundLuminance = luminance(foreground)
        const backgroundLuminance = luminance(background)
        const lighter = Math.max(foregroundLuminance, backgroundLuminance)
        const darker = Math.min(foregroundLuminance, backgroundLuminance)

        return (lighter + 0.05) / (darker + 0.05)
      }

      return elements.flatMap((element) => {
        const htmlElement = element as HTMLElement
        const rect = htmlElement.getBoundingClientRect()
        const style = getComputedStyle(htmlElement)
        const text =
          htmlElement instanceof HTMLInputElement ||
          htmlElement instanceof HTMLTextAreaElement
            ? htmlElement.value
            : htmlElement.textContent?.trim()

        if (
          !text ||
          rect.width === 0 ||
          rect.height === 0 ||
          style.display === "none" ||
          style.visibility === "hidden"
        ) {
          return []
        }

        const foreground = parseColor(style.color)
        const background = effectiveBackground(htmlElement)

        if (!foreground) {
          return []
        }

        const computedRatio = ratio(flatten(foreground, background), background)
        const required = Number.parseFloat(
          htmlElement.getAttribute("data-a11y-min-contrast") ?? "4.5"
        )

        if (computedRatio >= required) {
          return []
        }

        return [
          {
            background: getComputedStyle(htmlElement).backgroundColor,
            foreground: style.color,
            label:
              htmlElement.getAttribute("data-slot") ??
              htmlElement.getAttribute("data-testid") ??
              htmlElement.tagName.toLowerCase(),
            ratio: Number(computedRatio.toFixed(2)),
            required,
            text,
          },
        ]
      })
    })

  expect(failures).toEqual([])
}

async function expectVisibleFocusIndicator(locator: Locator) {
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

test.describe("Browser accessibility checks", () => {
  test("browser-computed text contrast meets WCAG AA thresholds", async ({
    page,
  }) => {
    await page.goto("/visual.html?id=component-dads-v2-a11y--showcase")

    await expectNoContrastFailures(page)
  })

  test("screen-reader-facing roles and names are exposed", async ({ page }) => {
    await page.goto("/visual.html?id=component-dads-v2-a11y--showcase")

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "アクセシビリティ検証",
      })
    ).toBeVisible()
    await expect(page.getByRole("textbox", { name: /氏名.*必須/ })).toHaveValue(
      "デジタル 太郎"
    )
    await expect(page.getByRole("textbox", { name: "補足事項" })).toHaveValue(
      "申請に関する補足事項を入力します。"
    )
    await expect(
      page.getByRole("combobox", { name: "都道府県" })
    ).toContainText("東京都")
    await expect(
      page.getByRole("checkbox", { name: "メールで通知する" })
    ).toBeChecked()
    await expect(page.getByRole("radio", { name: "メール" })).toBeChecked()
    await expect(page.getByRole("button", { name: "申請する" })).toBeVisible()
    await expect(page.getByRole("link", { name: "ヘルプ" })).toBeVisible()
    await expect(page.getByRole("link", { name: "関連情報" })).toBeVisible()
    await expect(
      page.getByRole("link", { name: "サンプル画像の詳細" })
    ).toBeVisible()
    await expect(
      page.getByRole("img", { name: "行政手続きのサンプル画像" })
    ).toBeVisible()
    await expect(
      page.getByText("メールアドレスの形式で入力してください。")
    ).toBeVisible()
  })

  test("keyboard operation covers primary interactive components", async ({
    page,
  }) => {
    await page.goto("/visual.html?id=component-dads-v2-a11y--interactive")

    const button = page.getByRole("button", { name: "実行" })
    const checkbox = page.getByRole("checkbox", {
      name: "メールで通知する",
    })
    const selectedRadio = page.getByRole("radio", { name: "メール" })
    const nextRadio = page.getByRole("radio", { name: "郵送" })
    const select = page.getByRole("combobox", { name: "都道府県" })

    await page.keyboard.press("Tab")
    await expect(button).toBeFocused()
    await expectVisibleFocusIndicator(button)
    await page.keyboard.press("Enter")
    await expect(page.getByTestId("keyboard-status")).toHaveText(
      "ボタンを実行しました"
    )

    await page.keyboard.press("Tab")
    await expect(checkbox).toBeFocused()
    await expectVisibleFocusIndicator(checkbox)
    await page.keyboard.press("Space")
    await expect(checkbox).toBeChecked()

    await page.keyboard.press("Tab")
    await expect(selectedRadio).toBeFocused()
    await expectVisibleFocusIndicator(selectedRadio)
    await page.keyboard.press("ArrowDown")
    await expect(nextRadio).toBeFocused()
    await page.keyboard.press("Space")
    await expect(nextRadio).toBeChecked()

    await page.keyboard.press("Tab")
    await expect(select).toBeFocused()
    await expectVisibleFocusIndicator(select)
    await page.keyboard.press("Enter")
    await expect(page.getByRole("option", { name: "東京都" })).toBeVisible()
    await page.keyboard.press("Home")
    await page.keyboard.press("Enter")
    await expect(select).toContainText("東京都")
  })
})
