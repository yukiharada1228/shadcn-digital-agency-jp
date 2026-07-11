import { cn } from "@/lib/utils"

const classes = (result: string) => new Set(result.split(/\s+/).filter(Boolean))

describe("cn() with Digital Agency scales", () => {
  describe("color vs font-size collision (must coexist)", () => {
    it("keeps a text color and a DA font size together", () => {
      const c = classes(cn("text-key-900", "text-oln-16B-100"))
      expect(c.has("text-key-900")).toBe(true)
      expect(c.has("text-oln-16B-100")).toBe(true)
    })

    it("is order-independent", () => {
      const c = classes(cn("text-oln-16B-100", "text-key-900"))
      expect(c.has("text-key-900")).toBe(true)
      expect(c.has("text-oln-16B-100")).toBe(true)
    })

    it("covers every DA font-size prefix (dsp/std/dns/oln/mono)", () => {
      for (const fs of [
        "text-dsp-64B-140",
        "text-std-16N-170",
        "text-dns-16N-130",
        "text-oln-16B-100",
        "text-mono-16N-140",
      ]) {
        const c = classes(cn("text-solid-gray-800", fs))
        expect(c.has("text-solid-gray-800")).toBe(true)
        expect(c.has(fs)).toBe(true)
      }
    })

    it("still dedupes two DA font sizes (last wins)", () => {
      const c = classes(cn("text-std-16N-170", "text-oln-16B-100"))
      expect(c.has("text-oln-16B-100")).toBe(true)
      expect(c.has("text-std-16N-170")).toBe(false)
    })

    it("still dedupes two text colors (last wins)", () => {
      const c = classes(cn("text-key-900", "text-error-1"))
      expect(c.has("text-error-1")).toBe(true)
      expect(c.has("text-key-900")).toBe(false)
    })
  })

  describe("numeric DA scales must override (last wins)", () => {
    it("rounded: rounded-8 overrides rounded-full", () => {
      const c = classes(cn("rounded-full", "rounded-8"))
      expect(c.has("rounded-8")).toBe(true)
      expect(c.has("rounded-full")).toBe(false)
    })

    it("rounded: numeric DA radii dedupe", () => {
      const c = classes(cn("rounded-4", "rounded-12"))
      expect(c.has("rounded-12")).toBe(true)
      expect(c.has("rounded-4")).toBe(false)
    })

    it("shadow: shadow-1 overrides shadow-4", () => {
      const c = classes(cn("shadow-4", "shadow-1"))
      expect(c.has("shadow-1")).toBe(true)
      expect(c.has("shadow-4")).toBe(false)
    })

    it("leading: DA line-heights dedupe", () => {
      const c = classes(cn("leading-150", "leading-170"))
      expect(c.has("leading-170")).toBe(true)
      expect(c.has("leading-150")).toBe(false)
    })
  })

  describe("standard tailwind-merge behavior is preserved", () => {
    it("dedupes padding", () => {
      expect(cn("px-2", "px-4")).toBe("px-4")
    })

    it("dedupes DA background color shades", () => {
      const c = classes(cn("bg-key-900", "bg-key-1100"))
      expect(c.has("bg-key-1100")).toBe(true)
      expect(c.has("bg-key-900")).toBe(false)
    })

    it("keeps different properties", () => {
      const c = classes(cn("rounded-8", "shadow-1", "text-oln-16B-100"))
      expect(c.has("rounded-8")).toBe(true)
      expect(c.has("shadow-1")).toBe(true)
      expect(c.has("text-oln-16B-100")).toBe(true)
    })

    it("supports conditional/false values via clsx", () => {
      expect(cn("px-4", false, null, undefined, "py-2")).toBe("px-4 py-2")
    })
  })
})
