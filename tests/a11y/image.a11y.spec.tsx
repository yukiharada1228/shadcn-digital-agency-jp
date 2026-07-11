import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import {
  Image,
  ImageArea,
  ImageAreaLink,
  ImageCaption,
  ImageFigure,
} from "@/components/ui/image"

describe("Image accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <ImageFigure>
        <ImageArea bordered>
          <ImageAreaLink href="/sample">
            <Image src="/sample.png" alt="サンプル画像" />
          </ImageAreaLink>
        </ImageArea>
        <ImageCaption captionStyle="solid">画像の説明</ImageCaption>
      </ImageFigure>
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("uses alt text as the image name", () => {
    render(<Image src="/sample.png" alt="サンプル画像" />)
    expect(
      screen.getByRole("img", { name: "サンプル画像" })
    ).toBeInTheDocument()
  })
})
