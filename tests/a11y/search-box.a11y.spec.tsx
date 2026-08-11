import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  SearchBox,
  SearchBoxDetail,
  SearchBoxDetailActions,
  SearchBoxFields,
  SearchBoxInput,
  SearchBoxSelect,
  SearchBoxSubmit,
} from "@/components/ui/search-box"

function Sample({
  withDetail = false,
  withSelect = true,
}: {
  withDetail?: boolean
  withSelect?: boolean
}) {
  return (
    <SearchBox>
      <SearchBoxFields>
        {withSelect && (
          <SearchBoxSelect defaultValue="all" label="カテゴリ" name="category">
            <option value="all">すべて</option>
            <option value="news">お知らせ</option>
          </SearchBoxSelect>
        )}
        <SearchBoxInput label="キーワード" name="q" type="search" />
      </SearchBoxFields>
      <SearchBoxSubmit size="lg">検索</SearchBoxSubmit>
      {withDetail && (
        <SearchBoxDetail summary="詳細条件">
          <SearchBoxDetailActions>
            <SearchBoxSubmit size="lg">この条件で検索</SearchBoxSubmit>
          </SearchBoxDetailActions>
        </SearchBoxDetail>
      )}
    </SearchBox>
  )
}

describe("SearchBox accessibility", () => {
  it("exposes an accessible name for both fields", () => {
    render(<Sample />)
    expect(
      screen.getByRole("combobox", { name: "カテゴリ" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("searchbox", { name: "キーワード" })
    ).toBeInTheDocument()
  })

  it("has no axe violations", async () => {
    const { container } = render(<Sample />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations without the select", async () => {
    const { container } = render(<Sample withSelect={false} />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with the detail disclosure", async () => {
    const { container } = render(<Sample withDetail />)
    expect(await axe(container)).toHaveNoViolations()
  })
})
