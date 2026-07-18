/**
 * Builds registry.json (shadcn registry manifest) by aggregating every registry
 * item under src/registry/items/*.json.
 *
 * Usage:
 *   tsx scripts/generate-registry.ts          # write registry.json
 *   tsx scripts/generate-registry.ts --check  # fail if registry.json is stale
 *
 * Implements FR-023 / CI-004.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const ITEMS_DIR = join(ROOT, "src", "registry", "items")
const OUTPUT = join(ROOT, "registry.json")

const HOMEPAGE = "https://github.com/yukiharada1228/shadcn-digital-agency-jp"

function loadItems() {
  const files = readdirSync(ITEMS_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
  return files.map((f) => JSON.parse(readFileSync(join(ITEMS_DIR, f), "utf8")))
}

function build() {
  const items = loadItems()
  const registry = {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "shadcn-digital-agency-jp",
    homepage: HOMEPAGE,
    items,
  }
  return JSON.stringify(registry, null, 2) + "\n"
}

function main() {
  const check = process.argv.includes("--check")
  const next = build()

  if (check) {
    let current = ""
    try {
      current = readFileSync(OUTPUT, "utf8")
    } catch {
      current = ""
    }
    if (current !== next) {
      console.error(
        "registry.json is out of date. Run `npm run registry:generate` and commit the result."
      )
      process.exit(1)
    }
    console.log("registry.json is up to date.")
    return
  }

  writeFileSync(OUTPUT, next)
  console.log(`Wrote registry.json (${JSON.parse(next).items.length} items).`)
}

main()
