import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

const repoAddress = "yukiharada1228/shadcn-digital-agency-jp/"

type RegistryFile = {
  path: string
  type: string
  target?: string
}

type RegistryItem = {
  name: string
  type: string
  dependencies?: string[]
  registryDependencies?: string[]
  files?: RegistryFile[]
}

const itemDir = join(process.cwd(), "src", "registry", "items")

const readItem = (name: string): RegistryItem =>
  JSON.parse(readFileSync(join(itemDir, `${name}.json`), "utf8"))

const itemNames = () =>
  readdirSync(itemDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => name.replace(/\.json$/, ""))

const readItems = () => itemNames().map(readItem)

const dependencyItemName = (dependency: string) =>
  dependency.startsWith(repoAddress)
    ? dependency.slice(repoAddress.length).split("#")[0]
    : null

describe("registry install payload", () => {
  it("keeps the theme payload isolated from application utilities", () => {
    const theme = readItem("theme")

    expect(theme.dependencies).toEqual([])
    expect(theme.files?.map((file) => file.target)).not.toContain(
      "@lib/utils.ts"
    )
    expect(theme.files?.map((file) => file.path)).not.toContain(
      "src/lib/utils.ts"
    )
  })

  it("ships Digital Agency cn() from a collision-free library path", () => {
    const utility = readItem("digital-agency-cn")

    expect(utility.dependencies).toEqual(
      expect.arrayContaining(["clsx", "tailwind-merge"])
    )
    expect(utility.files).toEqual(
      expect.arrayContaining([
        {
          path: "src/lib/digital-agency/cn.ts",
          type: "registry:lib",
          target: "@lib/digital-agency/cn.ts",
        },
      ])
    )
  })

  it("uses resolvable same-repository registry dependencies", () => {
    const names = new Set(itemNames())

    for (const item of readItems()) {
      for (const dependency of item.registryDependencies ?? []) {
        const dependencyName = dependencyItemName(dependency)

        if (!dependencyName) {
          continue
        }

        expect(names.has(dependencyName)).toBe(true)
      }
    }
  })

  it("wires theme and Digital Agency cn() into installable items", () => {
    for (const item of readItems()) {
      if (item.type !== "registry:ui" && item.type !== "registry:block") {
        continue
      }

      expect(item.registryDependencies).toContain(`${repoAddress}theme`)
      expect(item.registryDependencies).toContain(
        `${repoAddress}digital-agency-cn`
      )
    }
  })

  it("does not distribute a generic lib/utils file from any item", () => {
    for (const item of readItems()) {
      for (const file of item.files ?? []) {
        expect(file.target).not.toMatch(/^@lib\/utils(?:\.ts)?$/)
        expect(file.path).not.toMatch(/(?:^|\/)lib\/utils\.ts$/)
      }
    }
  })

  it("imports the registry-owned cn() utility from its collision-free path", () => {
    for (const item of readItems()) {
      for (const file of item.files ?? []) {
        if (!file.path.endsWith(".tsx") && !file.path.endsWith(".ts")) {
          continue
        }

        const source = readFileSync(join(process.cwd(), file.path), "utf8")
        expect(source).not.toMatch(/["']@\/lib\/utils["']/)
      }
    }
  })

  it("declares registry dependencies for local component imports", () => {
    for (const item of readItems()) {
      const dependencyNames = new Set(
        (item.registryDependencies ?? [])
          .map(dependencyItemName)
          .filter((name): name is string => Boolean(name))
      )

      for (const file of item.files ?? []) {
        if (!file.path.endsWith(".tsx") && !file.path.endsWith(".ts")) {
          continue
        }

        const source = readFileSync(join(process.cwd(), file.path), "utf8")
        const imports = source.matchAll(
          /from\s+["']@\/components\/ui\/([^"']+)["']/g
        )

        for (const match of imports) {
          expect(dependencyNames.has(match[1])).toBe(true)
        }
      }
    }
  })

  it("installs the third-party license file at the project root", () => {
    for (const item of readItems()) {
      const licenseFile = item.files?.find(
        (entry) => entry.path === "THIRD_PARTY_LICENSES.md"
      )

      if (licenseFile) {
        expect(licenseFile.target).toBe("~/THIRD_PARTY_LICENSES.md")
      }
    }
  })

  it("uses shadcn target placeholders for ui components", () => {
    for (const item of readItems()) {
      for (const registryFile of item.files ?? []) {
        expect(registryFile.target).not.toMatch(/^components\/ui\//)

        if (registryFile.type === "registry:ui") {
          expect(registryFile.target).toMatch(/^@ui\//)
        }
      }
    }
  })
})
