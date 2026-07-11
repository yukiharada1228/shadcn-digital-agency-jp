/**
 * Verifies the upstream submodule is present and checked out (TR-007 / AC-009).
 */
import { existsSync, readdirSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const SUBMODULE = join(
  __dirname,
  "..",
  "upstream",
  "design-system-example-components-react"
)

if (!existsSync(SUBMODULE) || readdirSync(SUBMODULE).length === 0) {
  console.error(
    "upstream submodule is not checked out.\n" +
      "Run: git submodule update --init --recursive"
  )
  process.exit(1)
}

console.log("upstream submodule is present.")
