import { render, screen } from "@testing-library/react"
import { axe } from "../axe"

import { Carousel, type CarouselSlide } from "@/components/ui/carousel"

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
]

describe("Carousel accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <Carousel
        slides={slides}
        currentIndex={0}
        isNormal={true}
        onPrev={() => {}}
        onNext={() => {}}
        onStepSelect={() => {}}
      />
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes a tablist for step navigation", () => {
    render(
      <Carousel
        slides={slides}
        currentIndex={0}
        isNormal={true}
        onPrev={() => {}}
        onNext={() => {}}
        onStepSelect={() => {}}
      />
    )
    expect(
      screen.getByRole("tablist", { name: "スライド選択" })
    ).toBeInTheDocument()
  })
})
