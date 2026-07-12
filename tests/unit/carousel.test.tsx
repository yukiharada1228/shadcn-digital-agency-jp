import * as React from "react"
import { fireEvent, render, screen } from "@testing-library/react"

import {
  Carousel,
  CarouselSingle,
  CarouselSingleImage,
  CarouselSingleLink,
  type CarouselSlide,
} from "@/components/ui/carousel"

const slides: CarouselSlide[] = [
  {
    id: "a",
    label: "スライドA",
    href: "https://example.com/a",
    image: { src: "/a.png", alt: "画像A", width: 100, height: 100 },
  },
  {
    id: "b",
    label: "スライドB",
    image: { src: "/b.png", alt: "画像B", width: 100, height: 100 },
  },
  {
    id: "c",
    label: "スライドC",
    image: { src: "/c.png", alt: "画像C", width: 100, height: 100 },
  },
]

function renderCarousel(
  props: Partial<React.ComponentProps<typeof Carousel>> = {}
) {
  const onPrev = vi.fn()
  const onNext = vi.fn()
  const onStepSelect = vi.fn()

  const utils = render(
    <Carousel
      slides={slides}
      currentIndex={0}
      isNormal={true}
      onPrev={onPrev}
      onNext={onNext}
      onStepSelect={onStepSelect}
      {...props}
    />
  )

  return { ...utils, onPrev, onNext, onStepSelect }
}

describe("Carousel", () => {
  it("renders the section with data-slot", () => {
    const { container } = renderCarousel()
    const section = container.querySelector('[data-slot="carousel"]')
    expect(section).toBeInTheDocument()
    expect(section?.tagName).toBe("SECTION")
  })

  it("merges a passed className", () => {
    const { container } = renderCarousel({ className: "custom-class" })
    expect(container.querySelector('[data-slot="carousel"]')).toHaveClass(
      "custom-class"
    )
  })

  it("forwards ref to the section element", () => {
    const ref = React.createRef<HTMLElement>()
    render(
      <Carousel
        ref={ref}
        slides={slides}
        currentIndex={0}
        isNormal={true}
        onPrev={vi.fn()}
        onNext={vi.fn()}
        onStepSelect={vi.fn()}
      />
    )
    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe("SECTION")
  })

  it("renders nothing when slides are empty", () => {
    const { container } = renderCarousel({ slides: [] })
    expect(
      container.querySelector('[data-slot="carousel"]')
    ).not.toBeInTheDocument()
  })

  it("renders a tablist step nav with one tab per slide", () => {
    renderCarousel()
    const tabs = screen.getAllByRole("tab")
    expect(tabs).toHaveLength(slides.length)
    expect(tabs[0]).toHaveAttribute("aria-selected", "true")
    expect(tabs[1]).toHaveAttribute("aria-selected", "false")
  })

  it("normalizes an out-of-range currentIndex", () => {
    renderCarousel({ currentIndex: slides.length })
    const tabs = screen.getAllByRole("tab")
    expect(tabs[0]).toHaveAttribute("aria-selected", "true")
  })

  it("calls onStepSelect when a step is clicked", () => {
    const { onStepSelect } = renderCarousel()
    fireEvent.click(screen.getAllByRole("tab")[2])
    expect(onStepSelect).toHaveBeenCalledWith(2)
  })

  it("moves selection with arrow keys via onStepSelect", () => {
    const { onStepSelect } = renderCarousel()
    const tabs = screen.getAllByRole("tab")
    fireEvent.keyDown(tabs[0], { key: "ArrowRight" })
    expect(onStepSelect).toHaveBeenCalledWith(1)
    fireEvent.keyDown(tabs[0], { key: "ArrowLeft" })
    expect(onStepSelect).toHaveBeenCalledWith(slides.length - 1)
  })

  it("calls onNext and onPrev from the page nav", () => {
    const { onPrev, onNext } = renderCarousel()
    fireEvent.click(screen.getByText(`前のスライド`))
    expect(onPrev).toHaveBeenCalled()
    fireEvent.click(screen.getAllByText(`次のスライド`)[0])
    expect(onNext).toHaveBeenCalled()
  })

  it("uses a custom unit label", () => {
    renderCarousel({ unit: "ページ" })
    expect(screen.getByText("前のページ")).toBeInTheDocument()
    expect(screen.getByText("すべてのページ")).toBeInTheDocument()
  })

  it("renders a tabpanel when isNormal is true", () => {
    renderCarousel({ isNormal: true })
    expect(
      screen.getByRole("tabpanel", { name: "スライドA" })
    ).toBeInTheDocument()
  })

  it("renders children inside the carousel", () => {
    renderCarousel({ children: <p>caption</p> })
    expect(screen.getByText("caption")).toBeInTheDocument()
  })
})

describe("CarouselSingle", () => {
  it("renders with data-slot and merges className", () => {
    render(<CarouselSingle className="custom-class">content</CarouselSingle>)
    const el = screen.getByText("content")
    expect(el).toHaveAttribute("data-slot", "carousel-single")
    expect(el).toHaveClass("custom-class")
  })

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<CarouselSingle ref={ref}>content</CarouselSingle>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe("CarouselSingleLink", () => {
  it("renders an anchor when href is provided", () => {
    render(
      <CarouselSingleLink href="https://example.com">go</CarouselSingleLink>
    )
    const link = screen.getByRole("link", { name: "go" })
    expect(link).toHaveAttribute("data-slot", "carousel-single-link")
    expect(link).toHaveAttribute("href", "https://example.com")
  })

  it("renders a span when href is absent", () => {
    render(<CarouselSingleLink>text</CarouselSingleLink>)
    const el = screen.getByText("text")
    expect(el.tagName).toBe("SPAN")
    expect(el).toHaveAttribute("data-slot", "carousel-single-link")
  })

  it("forwards ref and merges className on the anchor", () => {
    const ref = React.createRef<HTMLAnchorElement>()
    render(
      <CarouselSingleLink ref={ref} href="#" className="custom-class">
        go
      </CarouselSingleLink>
    )
    expect(ref.current).toBeInstanceOf(HTMLAnchorElement)
    expect(ref.current).toHaveClass("custom-class")
  })
})

describe("CarouselSingleImage", () => {
  it("renders an image with data-slot and merges className", () => {
    render(
      <CarouselSingleImage src="/x.png" alt="画像" className="custom-class" />
    )
    const img = screen.getByRole("img", { name: "画像" })
    expect(img).toHaveAttribute("data-slot", "carousel-single-image")
    expect(img).toHaveClass("custom-class")
  })

  it("forwards ref", () => {
    const ref = React.createRef<HTMLImageElement>()
    render(<CarouselSingleImage ref={ref} src="/x.png" alt="画像" />)
    expect(ref.current).toBeInstanceOf(HTMLImageElement)
  })
})
