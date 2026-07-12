import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  FileUpload,
  FileUploadInput,
  FileUploadDropArea,
  FileUploadFileList,
  FileUploadFileItem,
  FileUploadFileMarker,
  FileUploadFileInfo,
  FileUploadFileName,
  FileUploadFileMeta,
  FileUploadViewportOverlay,
  FileUploadViewportOverlayMessage,
  formatSize,
  parseSize,
  parseAcceptAttribute,
  isFileTypeAllowed,
} from "@/components/ui/file-upload"

describe("FileUpload", () => {
  it("renders the root with data-slot", () => {
    render(<FileUpload data-testid="root">content</FileUpload>)
    const root = screen.getByTestId("root")
    expect(root).toBeInTheDocument()
    expect(root).toHaveAttribute("data-slot", "file-upload")
  })

  it("merges a passed className last", () => {
    render(
      <FileUpload data-testid="root" className="custom-class">
        content
      </FileUpload>
    )
    const root = screen.getByTestId("root")
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("group/file-upload")
  })

  it("forwards ref to the root element", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<FileUpload ref={ref}>content</FileUpload>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it("sets data-multiple based on maxFiles", () => {
    const { rerender } = render(
      <FileUpload data-testid="root" maxFiles={1}>
        content
      </FileUpload>
    )
    expect(screen.getByTestId("root")).toHaveAttribute("data-multiple", "false")

    rerender(
      <FileUpload data-testid="root" maxFiles={3}>
        content
      </FileUpload>
    )
    expect(screen.getByTestId("root")).toHaveAttribute("data-multiple", "true")
  })

  it("sets data-has-error and data-droppable only when enabled", () => {
    const { rerender } = render(
      <FileUpload data-testid="root">content</FileUpload>
    )
    let root = screen.getByTestId("root")
    expect(root).not.toHaveAttribute("data-has-error")
    expect(root).not.toHaveAttribute("data-droppable")

    rerender(
      <FileUpload data-testid="root" hasError droppable>
        content
      </FileUpload>
    )
    root = screen.getByTestId("root")
    expect(root).toHaveAttribute("data-has-error", "true")
    expect(root).toHaveAttribute("data-droppable", "true")
  })
})

describe("FileUploadInput", () => {
  it("renders a hidden file input with data-slot and forwards ref", () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<FileUploadInput ref={ref} data-testid="input" />)
    const input = screen.getByTestId("input")
    expect(input).toHaveAttribute("type", "file")
    expect(input).toHaveAttribute("data-slot", "file-upload-input")
    expect(input).toHaveClass("hidden")
    expect(ref.current).toBe(input)
  })

  it("fires onChange when a file is selected", () => {
    const onChange = vi.fn()
    render(<FileUploadInput data-testid="input" onChange={onChange} />)
    const input = screen.getByTestId("input") as HTMLInputElement
    const file = new File(["hello"], "hello.png", { type: "image/png" })
    fireEvent.change(input, { target: { files: [file] } })
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})

describe("FileUploadDropArea", () => {
  it("renders with data-slot and toggles data-dragover", () => {
    const { rerender } = render(
      <FileUploadDropArea data-testid="area">drop</FileUploadDropArea>
    )
    let area = screen.getByTestId("area")
    expect(area).toHaveAttribute("data-slot", "file-upload-drop-area")
    expect(area).not.toHaveAttribute("data-dragover")

    rerender(
      <FileUploadDropArea data-testid="area" isDragOver>
        drop
      </FileUploadDropArea>
    )
    area = screen.getByTestId("area")
    expect(area).toHaveAttribute("data-dragover", "true")
  })
})

describe("FileUpload list parts", () => {
  it("renders list, item, marker, info, name and meta with data-slots", () => {
    render(
      <FileUpload maxFiles={3}>
        <FileUploadFileList data-testid="list">
          <FileUploadFileItem data-testid="item" hasError>
            <FileUploadFileMarker data-testid="marker" />
            <FileUploadFileInfo data-testid="info">
              <FileUploadFileName data-testid="name">a.png</FileUploadFileName>
              <FileUploadFileMeta data-testid="meta">1KB</FileUploadFileMeta>
            </FileUploadFileInfo>
          </FileUploadFileItem>
        </FileUploadFileList>
      </FileUpload>
    )
    expect(screen.getByTestId("list")).toHaveAttribute(
      "data-slot",
      "file-upload-file-list"
    )
    const item = screen.getByTestId("item")
    expect(item).toHaveAttribute("data-slot", "file-upload-file-item")
    expect(item).toHaveAttribute("data-error", "true")
    expect(screen.getByTestId("marker")).toHaveAttribute(
      "data-slot",
      "file-upload-file-marker"
    )
    expect(screen.getByTestId("info")).toHaveAttribute(
      "data-slot",
      "file-upload-file-info"
    )
    expect(screen.getByTestId("name")).toHaveTextContent("a.png")
    expect(screen.getByTestId("meta")).toHaveTextContent("1KB")
  })

  it("does not set data-error on item without hasError", () => {
    render(
      <FileUploadFileList>
        <FileUploadFileItem data-testid="item">x</FileUploadFileItem>
      </FileUploadFileList>
    )
    expect(screen.getByTestId("item")).not.toHaveAttribute("data-error")
  })
})

describe("FileUploadViewportOverlay", () => {
  it("portals into document.body with its message", () => {
    render(
      <FileUploadViewportOverlay data-testid="overlay">
        <FileUploadViewportOverlayMessage data-testid="message">
          drop here
        </FileUploadViewportOverlayMessage>
      </FileUploadViewportOverlay>
    )
    const overlay = screen.getByTestId("overlay")
    expect(overlay).toHaveAttribute("data-slot", "file-upload-viewport-overlay")
    expect(overlay.parentElement).toBe(document.body)
    expect(screen.getByTestId("message")).toHaveTextContent("drop here")
  })
})

describe("FileUpload utils", () => {
  it("parseSize converts size strings to bytes", () => {
    expect(parseSize("5MB")).toBe(5 * 1024 * 1024)
    expect(parseSize("1kb")).toBe(1024)
    expect(parseSize(null)).toBeNull()
    expect(parseSize("bad")).toBeNull()
  })

  it("formatSize formats bytes into a readable string", () => {
    expect(formatSize(0)).toBe("0B")
    expect(formatSize(1024)).toBe("1KB")
    expect(formatSize(1536)).toBe("1.5KB")
  })

  it("parseAcceptAttribute splits and normalizes accept values", () => {
    expect(parseAcceptAttribute("")).toEqual([])
    expect(parseAcceptAttribute(".PNG, .Jpg")).toEqual([".png", ".jpg"])
  })

  it("isFileTypeAllowed matches extensions, mime types and wildcards", () => {
    expect(isFileTypeAllowed("a.png", "image/png", [".png"])).toBe(true)
    expect(isFileTypeAllowed("a.png", "image/png", [".jpg"])).toBe(false)
    expect(isFileTypeAllowed("a.png", "image/png", ["image/*"])).toBe(true)
    expect(isFileTypeAllowed("a.png", "image/png", ["image/png"])).toBe(true)
  })
})
