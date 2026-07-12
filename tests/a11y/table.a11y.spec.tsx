import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

describe("Table accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Table>
        <TableCaption>表1: テーブルキャプション</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ラベル</TableHead>
            <TableHead>ラベル</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>データ</TableCell>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=table", () => {
    render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>データ</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole("table")).toBeInTheDocument()
  })
})
