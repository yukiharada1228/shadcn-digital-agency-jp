import { expect, test, type Page } from "@playwright/test"

type Source = "upstream" | "ours"

const sources: Source[] = ["upstream", "ours"]

async function gotoSource(page: Page, id: string, source: Source) {
  await page.goto(`/visual.html?id=${encodeURIComponent(id)}&source=${source}`)
  await expect(page.getByTestId("visual-story")).toHaveAttribute(
    "data-story-id",
    id
  )
}

async function selectedSelectText(page: Page, source: Source) {
  const combobox = page.getByRole("combobox", { name: "選択肢" })

  if (source === "upstream") {
    await combobox.selectOption("2")
    return combobox.evaluate((element) => {
      const select = element as HTMLSelectElement
      return select.selectedOptions[0]?.textContent?.trim()
    })
  }

  await combobox.click()
  await page.getByRole("option", { name: "選択肢2" }).click()
  return combobox.textContent()
}

test.describe("Upstream source behavior parity", () => {
  for (const id of ["source-parity-accordion", "source-parity-disclosure"]) {
    test(`${id} toggles open state`, async ({ page }) => {
      for (const source of sources) {
        await gotoSource(page, id, source)

        const details = page.locator("details").first()
        const summary = page.locator("summary").first()

        await expect(details).toHaveJSProperty("open", true)
        await summary.click()
        await expect(details).toHaveJSProperty("open", false)
        await summary.click()
        await expect(details).toHaveJSProperty("open", true)
      }
    })
  }

  test("checkbox and radio selection states match", async ({ page }) => {
    for (const source of sources) {
      await gotoSource(page, "source-parity-checkbox", source)
      const checkbox = page.getByRole("checkbox", { name: "選択肢1" })
      await expect(checkbox).not.toBeChecked()
      await checkbox.click()
      await expect(checkbox).toBeChecked()

      await gotoSource(page, "source-parity-radio", source)
      const firstRadio = page.getByRole("radio", { name: "選択肢1" })
      const secondRadio = page.getByRole("radio", { name: "選択肢2" })
      await expect(secondRadio).toBeChecked()
      await firstRadio.click()
      await expect(firstRadio).toBeChecked()
      await expect(secondRadio).not.toBeChecked()
    }
  })

  test("selecting an option produces the same visible selection", async ({
    page,
  }) => {
    const selectedTextBySource: Record<Source, string | null | undefined> = {
      upstream: undefined,
      ours: undefined,
    }

    for (const source of sources) {
      await gotoSource(page, "source-parity-select", source)
      selectedTextBySource[source] = (
        await selectedSelectText(page, source)
      )?.trim()
    }

    expect(selectedTextBySource).toEqual({
      upstream: "選択肢2",
      ours: "選択肢2",
    })
  })

  test("dialog close request closes the modal", async ({ page }) => {
    for (const source of sources) {
      await gotoSource(page, "source-parity-dialog-basic-open", source)
      await page.waitForFunction(() =>
        document.querySelector("dialog")?.matches(":modal")
      )

      await page.getByRole("button", { name: "閉じる" }).click()
      await expect(page.locator("dialog").first()).toHaveJSProperty(
        "open",
        false
      )
    }
  })

  test("menu list box opens, selects an item, and returns status", async ({
    page,
  }) => {
    for (const source of sources) {
      await gotoSource(page, "source-parity-menu-list-box-interactive", source)

      const opener = page.getByRole("button", { name: /メニュー/ })
      await expect(opener).toHaveAttribute("aria-expanded", "false")
      await opener.press("ArrowDown")
      await expect(page.getByRole("menu")).toBeVisible()
      await expect(
        page.getByRole("menuitem", { name: /メニュー項目1/ })
      ).toBeFocused()
      await page.keyboard.press("ArrowDown")
      await expect(
        page.getByRole("menuitem", { name: /メニュー項目2/ })
      ).toBeFocused()
      await page.keyboard.press("Enter")
      await expect(page.getByRole("menu")).toBeHidden()
      await expect(page.getByTestId("behavior-status")).toHaveText(
        "メニュー項目2"
      )
      await expect(opener).toBeFocused()
    }
  })

  test("carousel next and step selection update current slide", async ({
    page,
  }) => {
    for (const source of sources) {
      await gotoSource(page, "source-parity-carousel-interactive", source)

      await expect(page.getByTestId("behavior-status")).toHaveText(
        "写真：デジタル公園の入り口"
      )
      await page.getByRole("button", { name: "次のスライド" }).click()
      await expect(page.getByTestId("behavior-status")).toHaveText(
        "写真：デジタル公園の芝生"
      )
      await page.getByRole("tab", { name: "スライド 3" }).click()
      await expect(page.getByTestId("behavior-status")).toHaveText(
        "写真：デジタル公園の木立"
      )
    }
  })
})
