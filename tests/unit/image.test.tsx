import * as React from "react"
import { render } from "@testing-library/react"

import {
  Image,
  ImageArea,
  ImageAreaLink,
  ImageCaption,
  ImageFigure,
} from "@/components/ui/image"

describe("Image", () => {
  it("renders an img element with data-slot", () => {
    const { getByRole } = render(<Image src="/sample.png" alt="Sample" />)
    const el = getByRole("img")
    expect(el.tagName).toBe("IMG")
    expect(el).toHaveAttribute("data-slot", "image")
    expect(el).toHaveAttribute("src", "/sample.png")
    expect(el).toHaveAttribute("alt", "Sample")
  })

  it("applies upstream responsive classes and merges className", () => {
    const { getByRole } = render(
      <Image src="/sample.png" alt="Sample" className="custom-class" />
    )
    const el = getByRole("img")
    expect(el).toHaveClass("custom-class")
    expect(el).toHaveClass("block")
    expect(el).toHaveClass("max-w-full")
    expect(el).toHaveClass("h-auto")
  })

  it("forwards ref to the underlying img element", () => {
    const ref = React.createRef<HTMLImageElement>()
    render(<Image ref={ref} src="/sample.png" alt="Sample" />)
    expect(ref.current).toBeInstanceOf(HTMLImageElement)
    expect(ref.current?.tagName).toBe("IMG")
  })

  it("renders ImageFigure and reflects fullWidth via data attribute", () => {
    const { getByTestId } = render(
      <ImageFigure data-testid="figure" fullWidth />
    )
    const el = getByTestId("figure")
    expect(el.tagName).toBe("FIGURE")
    expect(el).toHaveAttribute("data-slot", "image-figure")
    expect(el).toHaveAttribute("data-full-width", "")
  })

  it("reflects bordered on ImageArea", () => {
    const { getByTestId } = render(<ImageArea data-testid="area" bordered />)
    const el = getByTestId("area")
    expect(el).toHaveAttribute("data-slot", "image-area")
    expect(el).toHaveAttribute("data-bordered", "")
  })

  it("renders ImageAreaLink with href", () => {
    const { getByRole } = render(
      <ImageAreaLink href="/target">link</ImageAreaLink>
    )
    const el = getByRole("link")
    expect(el).toHaveAttribute("href", "/target")
    expect(el).toHaveAttribute("data-slot", "image-area-link")
  })

  it("reflects captionStyle on ImageCaption", () => {
    const { getByText } = render(
      <ImageCaption captionStyle="dashed">Caption</ImageCaption>
    )
    const el = getByText("Caption")
    expect(el.tagName).toBe("FIGCAPTION")
    expect(el).toHaveAttribute("data-slot", "image-caption")
    expect(el).toHaveAttribute("data-style", "dashed")
  })
})
