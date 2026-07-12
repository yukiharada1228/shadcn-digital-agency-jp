import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

type RegistryFile = {
  path: string
  type: string
  target?: string
}

type RegistryItem = {
  name: string
  dependencies?: string[]
  files?: RegistryFile[]
}

const itemDir = join(process.cwd(), "src", "registry", "items")

const readItem = (name: string): RegistryItem =>
  JSON.parse(readFileSync(join(itemDir, `${name}.json`), "utf8"))

describe("registry install payload", () => {
  it("ships cn() utilities from the theme dependency", () => {
    const theme = readItem("theme")

    expect(theme.dependencies).toEqual(
      expect.arrayContaining(["clsx", "tailwind-merge"])
    )
    expect(theme.files).toEqual(
      expect.arrayContaining([
        {
          path: "src/lib/utils.ts",
          type: "registry:lib",
          target: "@lib/utils.ts",
        },
      ])
    )
  })

  it("installs the third-party license file at the project root", () => {
    for (const file of readdirSync(itemDir).filter((name) =>
      name.endsWith(".json")
    )) {
      const item = readItem(file.replace(/\.json$/, ""))
      const licenseFile = item.files?.find(
        (entry) => entry.path === "THIRD_PARTY_LICENSES.md"
      )

      if (licenseFile) {
        expect(licenseFile.target).toBe("~/THIRD_PARTY_LICENSES.md")
      }
    }
  })

  it("uses shadcn target placeholders for ui components", () => {
    for (const file of readdirSync(itemDir).filter((name) =>
      name.endsWith(".json")
    )) {
      const item = readItem(file.replace(/\.json$/, ""))

      for (const registryFile of item.files ?? []) {
        expect(registryFile.target).not.toMatch(/^components\/ui\//)

        if (registryFile.type === "registry:ui") {
          expect(registryFile.target).toMatch(/^@ui\//)
        }
      }
    }
  })
})
