import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

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
} from "@/components/ui/file-upload"

describe("FileUpload accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <FileUpload maxFiles={3}>
        <FileUploadDropArea>
          <label htmlFor="file-input">ファイルを選択</label>
          <FileUploadInput id="file-input" aria-label="ファイルを選択" />
        </FileUploadDropArea>
        <FileUploadFileList aria-label="選択したファイル">
          <FileUploadFileItem>
            <FileUploadFileMarker />
            <FileUploadFileInfo>
              <FileUploadFileName>sample.png</FileUploadFileName>
              <FileUploadFileMeta>1KB</FileUploadFileMeta>
            </FileUploadFileInfo>
          </FileUploadFileItem>
        </FileUploadFileList>
      </FileUpload>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes role=list for the file list", () => {
    render(
      <FileUpload maxFiles={3}>
        <FileUploadFileList aria-label="選択したファイル">
          <FileUploadFileItem>
            <FileUploadFileInfo>
              <FileUploadFileName>sample.png</FileUploadFileName>
            </FileUploadFileInfo>
          </FileUploadFileItem>
        </FileUploadFileList>
      </FileUpload>
    )
    expect(
      screen.getByRole("list", { name: "選択したファイル" })
    ).toBeInTheDocument()
    expect(screen.getByRole("listitem")).toBeInTheDocument()
  })
})
