/**
 * Detects changes between the currently pinned upstream submodule commit and the
 * latest upstream commit, then maps changed files to affected components,
 * registry items, local files and parity tests via components-map.json.
 *
 * Implements FR-013 / CI-006 / 10.6. Requires the upstream submodule to be
 * checked out (git submodule update --init --recursive).
 */
import { execSync } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const SUBMODULE = join(
  ROOT,
  "upstream",
  "design-system-example-components-react"
)
const MAP = join(ROOT, "components-map.json")

type Mapping = Record<
  string,
  {
    upstreamPath: string
    localFiles: string[]
    registryItem: string
    parityTests: string[]
    status: string
  }
>

function git(args: string, cwd = SUBMODULE): string {
  return execSync(`git ${args}`, { cwd, encoding: "utf8" }).trim()
}

function main() {
  if (!existsSync(SUBMODULE)) {
    console.error(
      "upstream submodule not found. Run: git submodule update --init --recursive"
    )
    process.exit(1)
  }

  const current = git("rev-parse HEAD")
  git("fetch origin --quiet")
  const defaultBranch = git("rev-parse --abbrev-ref origin/HEAD").replace(
    "origin/",
    ""
  )
  const latest = git(`rev-parse origin/${defaultBranch}`)

  console.log("Upstream update check.\n")
  console.log(`Current upstream:\n${current}\n`)
  console.log(`Latest upstream:\n${latest}\n`)

  if (current === latest) {
    console.log("Upstream is up to date. Nothing to sync.")
    return
  }

  const changed = git(`diff --name-only ${current} ${latest}`)
    .split("\n")
    .filter(Boolean)
  console.log("Changed upstream files:")
  for (const f of changed) console.log(`- ${f}`)
  console.log("")

  const map: Mapping = JSON.parse(readFileSync(MAP, "utf8"))
  const affected = Object.entries(map).filter(([, m]) =>
    changed.some((f) => f.startsWith(m.upstreamPath))
  )

  const items = [...new Set(affected.map(([, m]) => m.registryItem))]
  const localFiles = affected.flatMap(([, m]) => m.localFiles)
  const parityTests = affected.flatMap(([, m]) => m.parityTests)

  console.log("Affected registry items:")
  for (const i of items) console.log(`- ${i}`)
  console.log("\nLocal files to review:")
  for (const f of localFiles) console.log(`- ${f}`)
  console.log("\nParity tests to run:")
  for (const t of parityTests) console.log(`- ${t}`)
  console.log("\nLicense / attribution review:")
  console.log("- Check whether THIRD_PARTY_LICENSES.md requires updates.")
}

main()
