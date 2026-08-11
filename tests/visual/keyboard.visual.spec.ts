import { expect, test } from "@playwright/test"

import { expectVisibleFocusIndicator } from "./focus-indicator"

// 既存の a11y spec は初期の主要コンポーネントしか触っていないため、
// 後から移植した search-box / step-navigation / resource-list を別途確認する。
test.describe("Keyboard operation for the later ports", () => {
  test("search box: select → input → submit の順に進み、フォーカスが見える", async ({
    page,
  }) => {
    await page.goto("/")

    // デモのヘッダーにも「検索」ボタンがあるので SearchBox 内に絞る。
    const searchBox = page.locator('[data-slot="search-box"]')
    const select = searchBox.getByRole("combobox", { name: "検索対象" })
    const input = searchBox.getByRole("searchbox", { name: "検索" })
    const submit = searchBox.getByRole("button", { name: "検索" })

    await select.focus()
    await expect(select).toBeFocused()
    await expectVisibleFocusIndicator(select)

    await page.keyboard.press("Tab")
    await expect(input).toBeFocused()
    await expectVisibleFocusIndicator(input)
    await page.keyboard.type("転入")
    await expect(input).toHaveValue("転入")

    await page.keyboard.press("Tab")
    await expect(submit).toBeFocused()
    await expectVisibleFocusIndicator(submit)
  })

  test("search box: 詳細条件の details をキーボードで開閉できる", async ({
    page,
  }) => {
    await page.goto("/visual.html?id=source-parity-search-box&source=ours")

    const summary = page.getByText("詳細条件を指定する")
    const details = page.locator("details").first()

    await summary.focus()
    await expectVisibleFocusIndicator(summary)
    await page.keyboard.press("Enter")
    await expect(details).toHaveJSProperty("open", true)
    await page.keyboard.press("Enter")
    await expect(details).toHaveJSProperty("open", false)
  })

  test("step navigation: asChild のステップリンクを順に辿れる", async ({
    page,
  }) => {
    await page.goto(
      "/visual.html?id=source-parity-step-navigation-horizontal&source=ours"
    )

    const links = page.getByRole("link")
    await expect(links).toHaveCount(5)

    await links.first().focus()
    await expect(links.first()).toBeFocused()
    await expectVisibleFocusIndicator(links.first())

    await page.keyboard.press("Tab")
    await expect(links.nth(1)).toBeFocused()
    await expectVisibleFocusIndicator(links.nth(1))

    // リンクの読み上げには sr-only の「ステップ」が含まれる。
    await expect(links.first()).toHaveAccessibleName(/ステップ/)
  })

  test("resource list: コントロールとアクションボタンに順に到達し、Space で選択できる", async ({
    page,
  }) => {
    await page.goto("/")

    const control = page.getByRole("checkbox", { name: "転入届を選択" })
    const action = page.getByRole("button", { name: "転入届のメニュー" })

    await control.focus()
    await expect(control).toBeFocused()
    await expectVisibleFocusIndicator(control)
    await expect(control).not.toBeChecked()
    await page.keyboard.press("Space")
    await expect(control).toBeChecked()

    // 行全体を覆う ::before オーバーレイがタブ順を壊していないこと。
    await page.keyboard.press("Tab")
    await expect(action).toBeFocused()
    await expectVisibleFocusIndicator(action)
  })
})
