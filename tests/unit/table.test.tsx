import * as React from "react"
import { render, screen } from "@testing-library/react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function renderTable() {
  return render(
    <Table>
      <TableCaption>表1</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>ラベル</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>データ</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe("Table", () => {
  it("renders each part with its data-slot", () => {
    const { container } = renderTable()
    expect(container.querySelector('[data-slot="table"]')).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="table-caption"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="table-header"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="table-body"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="table-row"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="table-head"]')
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="table-cell"]')
    ).toBeInTheDocument()
  })

  it("merges className on each part", () => {
    const { container } = render(
      <Table className="table-cls">
        <TableCaption className="caption-cls">cap</TableCaption>
        <TableHeader className="header-cls">
          <TableRow className="row-cls">
            <TableHead className="head-cls">h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="body-cls">
          <TableRow>
            <TableCell className="cell-cls">c</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('[data-slot="table"]')).toHaveClass(
      "table-cls"
    )
    expect(container.querySelector('[data-slot="table-caption"]')).toHaveClass(
      "caption-cls"
    )
    expect(container.querySelector('[data-slot="table-header"]')).toHaveClass(
      "header-cls"
    )
    expect(container.querySelector('[data-slot="table-body"]')).toHaveClass(
      "body-cls"
    )
    expect(container.querySelector('[data-slot="table-row"]')).toHaveClass(
      "row-cls"
    )
    expect(container.querySelector('[data-slot="table-head"]')).toHaveClass(
      "head-cls"
    )
    expect(container.querySelector('[data-slot="table-cell"]')).toHaveClass(
      "cell-cls"
    )
  })

  it("keeps base classes when a className is passed", () => {
    const { container } = render(<Table className="extra" />)
    const table = container.querySelector('[data-slot="table"]')
    expect(table).toHaveClass("w-full")
    expect(table).toHaveClass("text-std-16N-170")
    expect(table).toHaveClass("extra")
  })

  it("forwards refs to the underlying elements", () => {
    const tableRef = React.createRef<HTMLTableElement>()
    const headRef = React.createRef<HTMLTableCellElement>()
    const cellRef = React.createRef<HTMLTableCellElement>()
    render(
      <Table ref={tableRef}>
        <TableHeader>
          <TableRow>
            <TableHead ref={headRef}>h</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell ref={cellRef}>c</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(tableRef.current).toBeInstanceOf(HTMLTableElement)
    expect(headRef.current).toBeInstanceOf(HTMLTableCellElement)
    expect(cellRef.current).toBeInstanceOf(HTMLTableCellElement)
  })

  it("defaults TableHead scope to col", () => {
    renderTable()
    expect(screen.getByText("ラベル")).toHaveAttribute("scope", "col")
  })

  it("allows overriding TableHead scope", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableHead scope="row">見出し</TableHead>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText("見出し")).toHaveAttribute("scope", "row")
  })
})
