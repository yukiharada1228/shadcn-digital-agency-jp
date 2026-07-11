/**
 * Synchronizes the upstream license into THIRD_PARTY_LICENSES.md.
 *
 * Usage:
 *   tsx scripts/sync-license.ts          # write THIRD_PARTY_LICENSES.md
 *   tsx scripts/sync-license.ts --check  # fail if THIRD_PARTY_LICENSES.md is stale
 */
import { readFileSync, writeFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, "..")
const UPSTREAM_LICENSE = join(
  ROOT,
  "upstream",
  "design-system-example-components-react",
  "LICENSE"
)
const OUTPUT = join(ROOT, "THIRD_PARTY_LICENSES.md")

export function buildLicense(): string {
  let upstreamLicenseText = ""
  try {
    upstreamLicenseText = readFileSync(UPSTREAM_LICENSE, "utf8").trim()
  } catch (err) {
    console.error(`Failed to read upstream license: ${err}`)
    process.exit(1)
  }

  // Extract the copyright line to inject it into the preamble
  const copyrightLineMatch = upstreamLicenseText.match(/Copyright.*$/m)
  const copyrightText = copyrightLineMatch
    ? copyrightLineMatch[0]
    : "Copyright (c) 2025 デジタル庁"

  return `# Third-Party Licenses

This project (\`shadcn-digital-agency-jp\`) is an **unofficial** shadcn/ui native
component registry inspired by the Digital Agency Design System. It reimplements
component specifications, appearance, accessibility behavior, and implementation
structure in a shadcn/ui native form.

The following third-party projects are referenced and this project retains their
required copyright and license notices in accordance with the MIT License.

---

## digital-go-jp/design-system-example-components-react

- **Project name:** design-system-example-components-react
- **Repository:** https://github.com/digital-go-jp/design-system-example-components-react
- **License:** MIT License
- **Copyright:** ${copyrightText}
- **Usage in this project:** This project references the upstream component
  specifications, visual appearance, accessibility behavior, API, and
  implementation structure, and reimplements them as shadcn/ui native,
  source-distributed components. The upstream repository itself is included only
  as a read-only Git submodule under \`upstream/\` and is never imported at
  runtime.

\`\`\`
${upstreamLicenseText}
\`\`\`
`
}

function main() {
  const check = process.argv.includes("--check")
  const next = buildLicense()

  if (check) {
    let current = ""
    try {
      current = readFileSync(OUTPUT, "utf8")
    } catch {
      current = ""
    }
    if (current !== next) {
      console.error(
        "THIRD_PARTY_LICENSES.md is out of date. Run `pnpm license:sync` and commit the result."
      )
      process.exit(1)
    }
    console.log("THIRD_PARTY_LICENSES.md is up to date.")
    return
  }

  writeFileSync(OUTPUT, next)
  console.log("Wrote THIRD_PARTY_LICENSES.md")
}

// Only run main if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
