import { render } from "@testing-library/react"
import { axe } from "../axe"

import { FormControlLabel } from "@/components/ui/form-control-label"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Legend } from "@/components/ui/legend"
import { RequirementBadge } from "@/components/ui/requirement-badge"
import { SupportText } from "@/components/ui/support-text"

it("has accessible single-field and grouped-field compositions", async () => {
  const { container } = render(
    <FormControlLabel as="fieldset">
      <Legend>連絡先</Legend>
      <FormControlLabel>
        <Label htmlFor="email">
          メールアドレス<RequirementBadge>必須</RequirementBadge>
        </Label>
        <SupportText id="email-help">連絡可能なアドレス</SupportText>
        <Input id="email" type="email" required aria-describedby="email-help" />
      </FormControlLabel>
    </FormControlLabel>
  )
  expect(await axe(container)).toHaveNoViolations()
})
