import { expect, test } from "@playwright/test"

// フィクスチャではなく実際のデモ画面（src/demo/App.tsx）が壊れていないことを見る。
// パリティ系 spec は upstream との描き比べなので、アプリとして動くかは別に確認する。
test.describe("Demo app smoke", () => {
  test("renders without console errors and the components work", async ({
    page,
  }) => {
    const problems: string[] = []
    page.on("console", (message) => {
      if (message.type() === "error" || message.type() === "warning") {
        problems.push(`${message.type()}: ${message.text()}`)
      }
    })
    page.on("pageerror", (error) =>
      problems.push(`pageerror: ${error.message}`)
    )

    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible()

    await expect(
      page.getByRole("navigation", { name: "転入届の手順" })
    ).toBeVisible()
    await expect(page.getByRole("searchbox", { name: "検索" })).toBeVisible()
    await expect(page.getByRole("combobox", { name: "検索対象" })).toBeVisible()

    // ResourceList は行のどこをクリックしても選択が切り替わる。
    const control = page.getByRole("checkbox", { name: "転入届を選択" })
    const row = page.locator('[data-slot="resource-list"]').first()
    await expect(control).not.toBeChecked()
    await row.click()
    await expect(control).toBeChecked()

    // 行末のアクションボタンはオーバーレイに覆われない。
    await page.getByRole("button", { name: "転入届のメニュー" }).click()
    await expect(control).toBeChecked()

    expect(problems).toEqual([])
  })

  // 追加したセクションがページ全体を横に押し広げていないこと。
  // StepNavigation の横向きは 1 ステップ 320px 固定、SearchBox は最小幅が
  // 約 440px あるため、囲い方を間違えるとページごとはみ出す。
  for (const width of [1440, 390]) {
    test(`does not overflow horizontally at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/")
      await expect(
        page.getByRole("heading", { level: 1 }).first()
      ).toBeVisible()

      const size = await page.evaluate(() => ({
        document: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
      }))
      expect(size.document).toBeLessThanOrEqual(size.viewport)
    })
  }

  test("keeps a stacking context around the step navigation", async ({
    page,
  }) => {
    await page.goto("/")
    // コネクタ線は z-index:-10 のため、不透明な背景を持つ祖先があると隠れる
    // （upstream と同じ挙動）。デモ側は stacking context を作って回避している。
    const isolation = await page
      .getByRole("navigation", { name: "転入届の手順" })
      .evaluate((element) => getComputedStyle(element.parentElement!).isolation)
    expect(isolation).toBe("isolate")
  })
})
