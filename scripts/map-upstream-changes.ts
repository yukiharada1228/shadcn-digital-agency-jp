/**
 * Given a list of changed upstream files (passed as args or piped), resolves the
 * affected components / registry items / local files / parity tests using
 * components-map.json. Used by diff-upstream.ts and the upstream-sync workflow.
 *
 * Implements 10.7 / FR-012.
 */
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const MAP = join(__dirname, "..", "components-map.json")

type Entry = {
  upstreamPath: string
  localFiles: string[]
  registryItem: string
  parityTests: string[]
  status: string
}

export function mapChanges(changedFiles: string[]) {
  const map: Record<string, Entry> = JSON.parse(readFileSync(MAP, "utf8"))
  const affected = Object.entries(map).filter(([, m]) =>
    changedFiles.some((f) => f.startsWith(m.upstreamPath))
  )
  return {
    components: affected.map(([name]) => name),
    registryItems: [...new Set(affected.map(([, m]) => m.registryItem))],
    localFiles: affected.flatMap(([, m]) => m.localFiles),
    parityTests: affected.flatMap(([, m]) => m.parityTests),
  }
}

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const files = process.argv.slice(2)
  console.log(JSON.stringify(mapChanges(files), null, 2))
}
