import * as React from "react"
import { render, screen } from "@testing-library/react"

import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

describe("Radixized component API/DOM compatibility", () => {
  it("Select preserves upstream state props on the trigger while exposing Radix DOM", () => {
    render(
      <Select defaultValue="2">
        <SelectTrigger aria-label="都道府県" blockSize="sm" isError>
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">北海道</SelectItem>
          <SelectItem value="2">東京都</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole("combobox", { name: "都道府県" })
    expect(trigger.tagName).toBe("BUTTON")
    expect(trigger).toHaveAttribute("data-slot", "select-trigger")
    expect(trigger).toHaveAttribute("data-size", "sm")
    expect(trigger).toHaveAttribute("aria-invalid", "true")
    expect(trigger.className).toContain("border-solid-gray-600")
    expect(trigger.className).toContain("aria-[invalid=true]:border-error-1")
  })

  it("Checkbox preserves upstream visual props while exposing a Radix checkbox root", () => {
    const ref = React.createRef<HTMLButtonElement>()

    render(
      <Checkbox
        ref={ref}
        aria-disabled
        aria-label="利用規約に同意"
        defaultChecked
        isError
        size="lg"
      />
    )

    const checkbox = screen.getByRole("checkbox", {
      name: "利用規約に同意",
    })
    expect(ref.current).toBe(checkbox)
    expect(checkbox.tagName).toBe("BUTTON")
    expect(checkbox).toHaveAttribute("data-slot", "checkbox")
    expect(checkbox).toHaveAttribute("data-size", "lg")
    expect(checkbox).toHaveAttribute("data-error", "true")
    expect(checkbox).toHaveAttribute("aria-disabled", "true")
    expect(checkbox).toHaveAttribute("data-state", "checked")
    expect(
      checkbox.querySelector('[data-slot="checkbox-indicator"]')
    ).toBeInTheDocument()
  })

  it("RadioGroup preserves item visual props while replacing upstream Radio input DOM", () => {
    const ref = React.createRef<HTMLButtonElement>()

    render(
      <RadioGroup aria-label="連絡方法" defaultValue="post">
        <RadioGroupItem aria-label="メール" value="mail" />
        <RadioGroupItem
          ref={ref}
          aria-disabled
          aria-label="郵送"
          isError
          size="md"
          value="post"
        />
      </RadioGroup>
    )

    const group = screen.getByRole("radiogroup", { name: "連絡方法" })
    const selected = screen.getByRole("radio", { name: "郵送" })

    expect(group).toHaveAttribute("data-slot", "radio-group")
    expect(ref.current).toBe(selected)
    expect(selected.tagName).toBe("BUTTON")
    expect(selected).toHaveAttribute("data-slot", "radio-group-item")
    expect(selected).toHaveAttribute("data-size", "md")
    expect(selected).toHaveAttribute("data-error", "true")
    expect(selected).toHaveAttribute("aria-disabled", "true")
    expect(selected).toHaveAttribute("data-state", "checked")
  })
})
