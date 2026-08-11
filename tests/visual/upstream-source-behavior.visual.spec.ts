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

  test("disabled checkbox and radio use the upstream disabled treatment", async ({
    page,
  }) => {
    // Upstream renders the visible box as the <input> itself; our Radix ports
    // render it as the first <span> inside the root.
    const boxStyles = (
      locator: ReturnType<Page["getByRole"]>,
      source: Source
    ) =>
      locator.evaluate((element, currentSource) => {
        const box =
          currentSource === "upstream" ? element : element.querySelector("span")

        if (!box) throw new Error("visible box not found")

        const style = getComputedStyle(box)
        return {
          backgroundColor: style.backgroundColor,
          borderColor: style.borderTopColor,
        }
      }, source)

    const stylesBySource: Record<Source, unknown> = {
      upstream: undefined,
      ours: undefined,
    }

    for (const source of sources) {
      await gotoSource(page, "source-parity-checkbox", source)
      const checkboxOff = page.getByRole("checkbox", { name: "選択肢4" })
      const checkboxOn = page.getByRole("checkbox", { name: "選択肢5" })
      await expect(checkboxOff).toBeDisabled()
      await expect(checkboxOn).toBeDisabled()
      await expect(checkboxOn).toBeChecked()

      const checkbox = {
        unchecked: await boxStyles(checkboxOff, source),
        checked: await boxStyles(checkboxOn, source),
      }

      await gotoSource(page, "source-parity-radio", source)
      const radioOff = page.getByRole("radio", { name: "選択肢4" })
      const radioOn = page.getByRole("radio", { name: "選択肢5" })
      await expect(radioOff).toBeDisabled()
      await expect(radioOn).toBeDisabled()
      await expect(radioOn).toBeChecked()

      stylesBySource[source] = {
        checkbox,
        radio: {
          unchecked: await boxStyles(radioOff, source),
          checked: await boxStyles(radioOn, source),
        },
      }
    }

    // solid-gray-50 background with a solid-gray-300 border, per upstream.
    expect(stylesBySource.upstream).toEqual({
      checkbox: {
        unchecked: {
          backgroundColor: "rgb(242, 242, 242)",
          borderColor: "rgb(179, 179, 179)",
        },
        checked: {
          backgroundColor: "rgb(179, 179, 179)",
          borderColor: "rgb(179, 179, 179)",
        },
      },
      radio: {
        unchecked: {
          backgroundColor: "rgb(242, 242, 242)",
          borderColor: "rgb(179, 179, 179)",
        },
        checked: {
          backgroundColor: "rgb(242, 242, 242)",
          borderColor: "rgb(179, 179, 179)",
        },
      },
    })
    expect(stylesBySource.ours).toEqual(stylesBySource.upstream)
  })

  test("step navigation renders the same treatment per step state", async ({
    page,
  }) => {
    const states = ["completed", "editing", "error", "skipped", "reached"]

    const stylesBySource: Record<Source, Record<string, unknown>> = {
      upstream: {},
      ours: {},
    }

    for (const source of sources) {
      await gotoSource(page, "source-parity-step-navigation-horizontal", source)

      for (const state of states) {
        stylesBySource[source][state] = await page
          .getByTestId(`step-number-${state}`)
          .evaluate((element) => {
            const style = getComputedStyle(element)
            return {
              backgroundColor: style.backgroundColor,
              borderColor: style.borderTopColor,
              borderStyle: style.borderTopStyle,
              color: style.color,
            }
          })
      }
    }

    // 到達済みは solid-gray-800 の塗り、エラーは error-1 の文字色、
    // 完了は solid-gray-50 の塗り、スキップは破線。
    expect(stylesBySource.upstream.reached).toMatchObject({
      backgroundColor: "rgb(51, 51, 51)",
      color: "rgb(255, 255, 255)",
    })
    expect(stylesBySource.upstream.completed).toMatchObject({
      backgroundColor: "rgb(242, 242, 242)",
    })
    expect(stylesBySource.upstream.error).toMatchObject({
      color: "rgb(236, 0, 0)",
    })
    expect(stylesBySource.upstream.skipped).toMatchObject({
      borderStyle: "dashed",
    })
    expect(stylesBySource.ours).toEqual(stylesBySource.upstream)
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
