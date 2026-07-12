import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogHeading,
} from "@/components/ui/dialog"

describe("Dialog accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Dialog open aria-labelledby="dialog-heading">
        <DialogContent>
          <DialogHeader>
            <DialogHeading id="dialog-heading">タイトル</DialogHeading>
            <DialogClose />
          </DialogHeader>
          <DialogBody>コンテンツ</DialogBody>
        </DialogContent>
      </Dialog>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=dialog labelled by the heading", () => {
    render(
      <Dialog open aria-labelledby="dialog-heading">
        <DialogContent>
          <DialogHeader>
            <DialogHeading id="dialog-heading">タイトル</DialogHeading>
            <DialogClose />
          </DialogHeader>
          <DialogBody>コンテンツ</DialogBody>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole("dialog", { name: "タイトル" })).toBeInTheDocument()
  })
})
