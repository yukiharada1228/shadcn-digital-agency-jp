import { existsSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

import { mapChanges } from "../../scripts/map-upstream-changes"

type MapEntry = {
  upstreamPath: string
  localFiles: string[]
  registryItem: string
  parityTests: string[]
  status: string
}

const root = process.cwd()
const itemDir = join(root, "src", "registry", "items")
const upstreamRoot = join(
  root,
  "upstream",
  "design-system-example-components-react"
)

const componentsMap: Record<string, MapEntry> = JSON.parse(
  readFileSync(join(root, "components-map.json"), "utf8")
)

const entries = Object.entries(componentsMap)

const registryUiItems = readdirSync(itemDir)
  .filter((name) => name.endsWith(".json"))
  .map(
    (name) =>
      JSON.parse(readFileSync(join(itemDir, name), "utf8")) as {
        name: string
        type: string
      }
  )
  .filter((item) => item.type === "registry:ui")
  .map((item) => item.name)

describe("components-map.json", () => {
  // scripts/map-upstream-changes.ts はこのマップに載っているものしか
  // upstream 差分と突き合わせない。未登録のコンポーネントは警告もなく
  // 「影響なし」と報告されるため、網羅性そのものをテストで守る。
  it("covers every registry:ui item", () => {
    const mapped = new Set(entries.map(([, entry]) => entry.registryItem))
    const missing = registryUiItems.filter((name) => !mapped.has(name))
    expect(missing).toEqual([])
  })

  it("has no entry pointing at an unknown registry item", () => {
    const known = new Set(registryUiItems)
    const unknown = entries
      .filter(([, entry]) => !known.has(entry.registryItem))
      .map(([name]) => name)
    expect(unknown).toEqual([])
  })

  it("points at an existing upstream directory", () => {
    const missing = entries
      .filter(
        ([, entry]) => !existsSync(join(upstreamRoot, entry.upstreamPath))
      )
      .map(([name, entry]) => `${name}: ${entry.upstreamPath}`)
    expect(missing).toEqual([])
  })

  it("points at existing local files and parity tests", () => {
    const missing = entries.flatMap(([name, entry]) =>
      [...entry.localFiles, ...entry.parityTests]
        .filter((file) => !existsSync(join(root, file)))
        .map((file) => `${name}: ${file}`)
    )
    expect(missing).toEqual([])
  })

  it("requires at least one unit or parity test per component", () => {
    const withoutTests = entries
      .filter(([, entry]) => entry.parityTests.length === 0)
      .map(([name]) => name)
    expect(withoutTests).toEqual([])
  })
})

describe("mapChanges", () => {
  it("resolves a changed upstream file to its local files and tests", () => {
    const result = mapChanges(["src/components/Accordion/Accordion.tsx"])
    expect(result.components).toEqual(["Accordion"])
    expect(result.registryItems).toEqual(["accordion"])
    expect(result.localFiles).toContain("src/components/ui/accordion.tsx")
    expect(result.parityTests).toContain("tests/unit/accordion.test.tsx")
  })

  it("matches on directory boundaries, not bare prefixes", () => {
    // `src/components/Table` は `Tab`（tabs）にマッチしてはいけない。
    expect(mapChanges(["src/components/Table/Table.tsx"]).components).toEqual([
      "Table",
    ])
    expect(mapChanges(["src/components/Tab/Tab.tsx"]).components).toEqual([
      "Tab",
    ])
  })

  it("reports nothing for an unported upstream component", () => {
    expect(
      mapChanges(["src/components/SearchBox/SearchBox.tsx"]).components
    ).toEqual([])
  })
})
