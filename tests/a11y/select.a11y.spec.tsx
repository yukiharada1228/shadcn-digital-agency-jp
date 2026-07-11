import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

describe("Select accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Select>
        <SelectTrigger aria-label="ラベル">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">選択肢1</SelectItem>
          <SelectItem value="2">選択肢2</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=combobox for the trigger", () => {
    render(
      <Select>
        <SelectTrigger aria-label="ラベル">
          <SelectValue placeholder="選択してください" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">選択肢1</SelectItem>
        </SelectContent>
      </Select>
    )
    expect(screen.getByRole("combobox", { name: "ラベル" })).toBeInTheDocument()
  })
})
