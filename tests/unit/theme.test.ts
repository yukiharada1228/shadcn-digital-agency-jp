import { readFileSync } from "node:fs"

describe("Digital Agency theme compatibility", () => {
  it("preserves the breakpoints used by responsive components after the v2 upgrade", () => {
    const css = readFileSync("src/styles/digital-agency.css", "utf8")

    expect(css).toContain("--breakpoint-desktop: 48em;")
    expect(css).toContain("--breakpoint-desktop-admin: 62em;")
  })
})
