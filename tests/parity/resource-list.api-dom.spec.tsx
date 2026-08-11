import { render, screen } from "@testing-library/react"

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ResourceList,
  ResourceListBody,
  ResourceListContents,
  ResourceListControl,
  ResourceListTitle,
} from "@/components/ui/resource-list"

// upstream の ResourceList はネイティブ input 前提で、選択状態を `:has(:checked)`、
// クリック範囲を `<label for>` で作る。このプロジェクトの checkbox / radio-group は
// Radix の `<button>` なので、そこだけ意図的に乖離している。
// docs/compatibility.md の "Radixized Components" を参照。
describe("ResourceList parity", () => {
  it("keeps the upstream composition and its data attributes", () => {
    render(
      <ResourceList interaction="whole" variant="frame">
        <ResourceListBody>
          <ResourceListControl>
            <Checkbox aria-label="選択" size="md" />
          </ResourceListControl>
          <ResourceListContents>
            <ResourceListTitle as="h3">リストタイトル</ResourceListTitle>
          </ResourceListContents>
        </ResourceListBody>
      </ResourceList>
    )

    const root = document.querySelector('[data-slot="resource-list"]')
    expect(root).toHaveAttribute("data-style", "frame")
    expect(root).toHaveAttribute("data-interaction", "whole")
    expect(
      document.querySelector('[data-slot="resource-list-body"]')
    ).toBeInTheDocument()
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument()
  })

  it("styles the selected row off the Radix data-state instead of :checked", () => {
    render(
      <ResourceList variant="frame">
        <ResourceListBody>
          <ResourceListControl>
            <Checkbox aria-label="選択" defaultChecked size="md" />
          </ResourceListControl>
        </ResourceListBody>
      </ResourceList>
    )

    const root = document.querySelector('[data-slot="resource-list"]')
    const checkbox = screen.getByRole("checkbox", { name: "選択" })

    // Radix は `<input type=checkbox>` ではないので `:checked` は一致しない。
    expect(checkbox.tagName).toBe("BUTTON")
    expect(checkbox).toHaveAttribute("data-state", "checked")
    expect(root?.className).toContain("has-[[data-state=checked]:enabled]")
    expect(root?.className).not.toContain("has-[:checked")
  })

  it("renders the control slot as a div, not a label", () => {
    render(
      <ResourceListControl>
        <Checkbox aria-label="選択" size="md" />
      </ResourceListControl>
    )

    const control = document.querySelector(
      '[data-slot="resource-list-control"]'
    ) as HTMLElement

    // upstream は `<label>`。Radix の button は label で活性化できないため div にし、
    // クリック範囲はコントロール自身の ::before オーバーレイで作る。
    // オーバーレイが実際にクリックを受けるかは jsdom では検証できないため、
    // tests/visual/upstream-source-behavior.visual.spec.ts の
    // "resource list whole-row click toggles the control in both" が担当する。
    expect(control.tagName).toBe("DIV")
    // interaction=whole ではオーバーレイの基準を行全体に切り替える。
    expect(control.className).toContain(
      "group-data-[interaction=whole]/resource-list:static"
    )
  })

  it("supports a radio item in the control slot", () => {
    render(
      <RadioGroup aria-label="配送方法" defaultValue="mail">
        <ResourceList interaction="whole" variant="frame">
          <ResourceListBody>
            <ResourceListControl>
              <RadioGroupItem aria-label="郵送" size="md" value="mail" />
            </ResourceListControl>
          </ResourceListBody>
        </ResourceList>
      </RadioGroup>
    )

    const radio = screen.getByRole("radio", { name: "郵送" })
    expect(radio.tagName).toBe("BUTTON")
    expect(radio).toHaveAttribute("data-state", "checked")
    expect(radio).toHaveAttribute("data-slot", "radio-group-item")
  })

  it("keeps the disabled contract on the native button state", () => {
    render(
      <ResourceList interaction="whole" variant="frame">
        <ResourceListBody>
          <ResourceListControl>
            <Checkbox aria-label="選択" disabled size="md" />
          </ResourceListControl>
        </ResourceListBody>
      </ResourceList>
    )

    // `:disabled` は button にも一致するため、upstream のセレクタがそのまま効く。
    expect(screen.getByRole("checkbox", { name: "選択" })).toBeDisabled()
    expect(
      document.querySelector('[data-slot="resource-list"]')?.className
    ).toContain("has-[:disabled]")
  })
})
