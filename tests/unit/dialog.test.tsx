import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"
import { beforeAll } from "vitest"

import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogHeading,
  DialogScrollArea,
  useDialog,
} from "@/components/ui/dialog"

beforeAll(() => {
  // jsdom does not implement the native <dialog> modal API.
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.open = true
    }
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.open = false
    }
  }
})

describe("Dialog", () => {
  it("renders the dialog with data-slot", () => {
    render(
      <Dialog open data-testid="dialog">
        <DialogContent>content</DialogContent>
      </Dialog>
    )
    const dialog = screen.getByTestId("dialog")
    expect(dialog).toBeInTheDocument()
    expect(dialog).toHaveAttribute("data-slot", "dialog")
    expect(dialog.tagName).toBe("DIALOG")
  })

  it("passes className through on the root while keeping base classes", () => {
    render(
      <Dialog data-testid="dialog" className="custom-class">
        <DialogContent>content</DialogContent>
      </Dialog>
    )
    const dialog = screen.getByTestId("dialog")
    expect(dialog).toHaveClass("custom-class")
    expect(dialog).toHaveClass("group/modal-dialog")
  })

  it("forwards ref to the underlying dialog element", () => {
    const ref = React.createRef<HTMLDialogElement>()
    render(
      <Dialog ref={ref}>
        <DialogContent>content</DialogContent>
      </Dialog>
    )
    expect(ref.current).toBeInstanceOf(HTMLDialogElement)
  })

  it("reflects the scroll prop via data-scroll", () => {
    render(
      <Dialog data-testid="dialog" scroll="inner">
        <DialogContent>content</DialogContent>
      </Dialog>
    )
    expect(screen.getByTestId("dialog")).toHaveAttribute("data-scroll", "inner")
  })

  it("defaults the content width CSS variable to fit-content", () => {
    render(
      <Dialog data-testid="dialog">
        <DialogContent>content</DialogContent>
      </Dialog>
    )
    expect(
      screen
        .getByTestId("dialog")
        .style.getPropertyValue("--modal-dialog-width")
    ).toBe("fit-content")
  })

  it("applies the width prop via the content width CSS variable", () => {
    render(
      <Dialog data-testid="dialog" width="800px">
        <DialogContent>content</DialogContent>
      </Dialog>
    )
    expect(
      screen
        .getByTestId("dialog")
        .style.getPropertyValue("--modal-dialog-width")
    ).toBe("800px")
  })

  it("renders each compound part with its data-slot", () => {
    render(
      <Dialog open>
        <DialogContent data-testid="content">
          <DialogHeader data-testid="header">
            <DialogHeading data-testid="heading">タイトル</DialogHeading>
            <DialogClose data-testid="close" />
          </DialogHeader>
          <DialogScrollArea data-testid="scroll-area">
            <DialogBody data-testid="body">本文</DialogBody>
          </DialogScrollArea>
          <DialogActions data-testid="actions">アクション</DialogActions>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByTestId("content")).toHaveAttribute(
      "data-slot",
      "dialog-content"
    )
    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-slot",
      "dialog-header"
    )
    expect(screen.getByTestId("heading")).toHaveAttribute(
      "data-slot",
      "dialog-heading"
    )
    expect(screen.getByTestId("close")).toHaveAttribute(
      "data-slot",
      "dialog-close"
    )
    expect(screen.getByTestId("scroll-area")).toHaveAttribute(
      "data-slot",
      "dialog-scroll-area"
    )
    expect(screen.getByTestId("body")).toHaveAttribute(
      "data-slot",
      "dialog-body"
    )
    expect(screen.getByTestId("actions")).toHaveAttribute(
      "data-slot",
      "dialog-actions"
    )
  })

  it("renders the heading as an h2 with default tabIndex -1", () => {
    render(<DialogHeading>見出し</DialogHeading>)
    const heading = screen.getByRole("heading", { name: "見出し", level: 2 })
    expect(heading).toHaveAttribute("tabindex", "-1")
  })

  it("renders the close button with fixed 閉じる label and no children override", () => {
    render(<DialogClose />)
    const button = screen.getByRole("button", { name: "閉じる" })
    expect(button).toHaveAttribute("type", "button")
  })

  it("forwards ref on a compound part", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<DialogBody ref={ref}>本文</DialogBody>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

function DialogHarness({
  onRequestClose,
}: {
  onRequestClose?: (e: { preventDefault: () => void }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const { dialogProps, headingProps, closeButtonProps } = useDialog({
    open,
    onOpenChange: setOpen,
    onRequestClose,
  })
  return (
    <>
      <button onClick={() => setOpen(true)}>開く</button>
      <Dialog {...dialogProps} data-testid="dialog">
        <DialogContent>
          <DialogHeader>
            <DialogHeading {...headingProps}>タイトル</DialogHeading>
            <DialogClose {...closeButtonProps} />
          </DialogHeader>
          <DialogBody>本文</DialogBody>
        </DialogContent>
      </Dialog>
    </>
  )
}

describe("useDialog", () => {
  it("wires aria-labelledby on the dialog to the heading id", () => {
    render(<DialogHarness />)
    const dialog = screen.getByTestId("dialog")
    const heading = screen.getByText("タイトル")
    expect(dialog.getAttribute("aria-labelledby")).toBe(heading.id)
    expect(heading.id).toBeTruthy()
  })

  it("opens the dialog when open becomes true", () => {
    render(<DialogHarness />)
    const dialog = screen.getByTestId("dialog") as HTMLDialogElement
    expect(dialog.open).toBe(false)
    fireEvent.click(screen.getByRole("button", { name: "開く" }))
    expect(dialog.open).toBe(true)
  })

  it("closes the dialog when the close button is clicked", () => {
    render(<DialogHarness />)
    const dialog = screen.getByTestId("dialog") as HTMLDialogElement
    fireEvent.click(screen.getByRole("button", { name: "開く" }))
    expect(dialog.open).toBe(true)
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }))
    expect(dialog.open).toBe(false)
  })

  it("keeps the dialog open when onRequestClose prevents default", () => {
    render(<DialogHarness onRequestClose={(e) => e.preventDefault()} />)
    const dialog = screen.getByTestId("dialog") as HTMLDialogElement
    fireEvent.click(screen.getByRole("button", { name: "開く" }))
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }))
    expect(dialog.open).toBe(true)
  })
})
