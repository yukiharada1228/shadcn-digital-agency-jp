/**
 * License / attribution check (TR-008 / CI-007 / R-010).
 *
 * Verifies:
 *  - LICENSE, NOTICE, THIRD_PARTY_LICENSES.md exist
 *  - THIRD_PARTY_LICENSES.md contains the upstream copyright + MIT License text
 *  - registry items include THIRD_PARTY_LICENSES.md in their files
 *  - component files that derive from upstream carry an attribution header
 */
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")

const errors: string[] = []
const req = (cond: boolean, msg: string) => {
  if (!cond) errors.push(msg)
}

// 1. Required root files
for (const f of ["LICENSE", "NOTICE", "THIRD_PARTY_LICENSES.md"]) {
  req(existsSync(join(ROOT, f)), `Missing required file: ${f}`)
}

// 2. THIRD_PARTY_LICENSES.md content
if (existsSync(join(ROOT, "THIRD_PARTY_LICENSES.md"))) {
  const tpl = readFileSync(join(ROOT, "THIRD_PARTY_LICENSES.md"), "utf8")
  req(
    tpl.includes("digital-go-jp/design-system-example-components-react"),
    "THIRD_PARTY_LICENSES.md must reference digital-go-jp/design-system-example-components-react"
  )
  req(
    tpl.includes("デジタル庁"),
    "THIRD_PARTY_LICENSES.md must contain the upstream copyright (デジタル庁)"
  )
  req(
    tpl.includes("MIT License"),
    "THIRD_PARTY_LICENSES.md must contain the MIT License text"
  )
}

// 3. Registry items must ship THIRD_PARTY_LICENSES.md
const itemsDir = join(ROOT, "src", "registry", "items")
if (existsSync(itemsDir)) {
  for (const f of readdirSync(itemsDir).filter((f) => f.endsWith(".json"))) {
    const item = JSON.parse(readFileSync(join(itemsDir, f), "utf8"))
    const files: Array<{ target?: string; path?: string }> = item.files ?? []
    const hasTpl = files.some(
      (file) =>
        (file.target ?? "").endsWith("THIRD_PARTY_LICENSES.md") ||
        (file.path ?? "").endsWith("THIRD_PARTY_LICENSES.md")
    )
    req(
      hasTpl,
      `Registry item ${item.name} must include THIRD_PARTY_LICENSES.md in files`
    )
  }
}

// 4. Attribution header on component files derived from upstream
const uiDir = join(ROOT, "src", "components", "ui")
const ATTRIBUTION = "digital-go-jp/design-system-example-components-react"
if (existsSync(uiDir)) {
  for (const f of readdirSync(uiDir).filter((f) => f.endsWith(".tsx"))) {
    const head = readFileSync(join(uiDir, f), "utf8").slice(0, 400)
    req(
      head.includes(ATTRIBUTION),
      `Component ${f} is missing the upstream attribution header`
    )
  }
}

if (errors.length) {
  console.error("License check failed:")
  for (const e of errors) console.error(`  - ${e}`)
  process.exit(1)
}
console.log("License check passed.")
