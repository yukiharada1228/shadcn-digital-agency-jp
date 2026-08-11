import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  SearchBox,
  SearchBoxDetail,
  SearchBoxDetailActions,
  SearchBoxFields,
  SearchBoxInput,
  SearchBoxSelect,
  SearchBoxSubmit,
} from "@/components/ui/search-box"

describe("SearchBox", () => {
  it("renders the root with data-slot and defaults to size lg", () => {
    render(<SearchBox />)
    const root = document.querySelector('[data-slot="search-box"]')
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute("data-size", "lg")
  })

  it("reflects the size prop", () => {
    render(<SearchBox size="sm" />)
    expect(document.querySelector('[data-slot="search-box"]')).toHaveAttribute(
      "data-size",
      "sm"
    )
  })

  it("renders a labelled select with its options", () => {
    render(
      <SearchBox>
        <SearchBoxFields>
          <SearchBoxSelect label="カテゴリ" defaultValue="all">
            <option value="all">すべて</option>
            <option value="news">お知らせ</option>
          </SearchBoxSelect>
        </SearchBoxFields>
      </SearchBox>
    )
    const select = screen.getByRole("combobox", { name: "カテゴリ" })
    expect(select.tagName).toBe("SELECT")
    expect(screen.getAllByRole("option")).toHaveLength(2)
    fireEvent.change(select, { target: { value: "news" } })
    expect((select as HTMLSelectElement).value).toBe("news")
  })

  it("keeps the CSS hook class the optional stylesheet targets", () => {
    render(
      <SearchBoxSelect label="カテゴリ">
        <option value="all">すべて</option>
      </SearchBoxSelect>
    )
    expect(
      document.querySelector('[data-slot="search-box-select"]')
    ).toHaveClass("dads-search-box__select")
  })

  it("labels the input with a visually hidden label", () => {
    render(<SearchBoxInput label="キーワード" type="search" />)
    const input = screen.getByRole("searchbox", { name: "キーワード" })
    expect(input).toBeInTheDocument()
    expect(screen.getByText("キーワード")).toHaveClass("sr-only")
  })

  it("labels the input via aria-labelledby without rendering a label span", () => {
    render(
      <>
        <span id="sb-label">キーワード</span>
        <SearchBoxInput aria-labelledby="sb-label" type="search" />
      </>
    )
    expect(
      screen.getByRole("searchbox", { name: "キーワード" })
    ).toBeInTheDocument()
    expect(screen.getByText("キーワード")).not.toHaveClass("sr-only")
  })

  it("renders the submit button as solid-fill by default and keeps overrides", () => {
    const { rerender } = render(
      <SearchBoxSubmit size="lg">検索</SearchBoxSubmit>
    )
    const button = screen.getByRole("button", { name: "検索" })
    expect(button).toHaveAttribute("data-slot", "search-box-submit")
    expect(button.className).toContain("bg-key-900")

    rerender(
      <SearchBoxSubmit size="lg" variant="outline">
        検索
      </SearchBoxSubmit>
    )
    expect(screen.getByRole("button", { name: "検索" }).className).toContain(
      "bg-white"
    )
  })

  it("calls onClick on the submit button", () => {
    const onClick = vi.fn()
    render(
      <SearchBoxSubmit size="lg" onClick={onClick}>
        検索
      </SearchBoxSubmit>
    )
    fireEvent.click(screen.getByRole("button", { name: "検索" }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it("renders the detail disclosure with its summary and toggles open", () => {
    render(
      <SearchBoxDetail summary="詳細条件">
        <SearchBoxDetailActions>
          <SearchBoxSubmit size="lg">この条件で検索</SearchBoxSubmit>
        </SearchBoxDetailActions>
      </SearchBoxDetail>
    )
    const details = document.querySelector("details") as HTMLDetailsElement
    const summary = screen.getByText("詳細条件")
    expect(details.open).toBe(false)
    fireEvent.click(summary)
    expect(details.open).toBe(true)
  })

  it("forwards refs", () => {
    const rootRef = React.createRef<HTMLDivElement>()
    const selectRef = React.createRef<HTMLSelectElement>()
    const inputRef = React.createRef<HTMLInputElement>()

    render(
      <SearchBox ref={rootRef}>
        <SearchBoxFields>
          <SearchBoxSelect label="カテゴリ" ref={selectRef}>
            <option value="all">すべて</option>
          </SearchBoxSelect>
          <SearchBoxInput label="キーワード" ref={inputRef} type="search" />
        </SearchBoxFields>
      </SearchBox>
    )

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement)
    expect(selectRef.current).toBeInstanceOf(HTMLSelectElement)
    expect(inputRef.current).toBeInstanceOf(HTMLInputElement)
  })
})
