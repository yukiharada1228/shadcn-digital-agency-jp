// The manifest is authoritative; discovery produces a reviewable plan only.
const fs = require("node:fs")
const path = require("node:path")
const managers = require("./package-managers.cjs")
const ROOT = path.resolve(__dirname, "../..")
const MANIFEST = ".github/runtime-versions.json"
function version(value) {
  if (typeof value !== "string" || !/^\d+\.\d+\.\d+$/.test(value))
    throw Error("An exact stable version is required")
  return value.split(".").map(Number)
}
function compare(a, b) {
  const x = version(a),
    y = version(b)
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2]
}
function latest(current, runtime, upgrade, releases) {
  version(current)
  const candidates = releases
    .filter((r) => /^v?\d+\.\d+\.\d+$/.test(r.version))
    .filter((r) => {
      const candidate = r.version.replace(/^v/, "")
      if (compare(candidate, current) <= 0) return false
      const major = version(candidate)[0],
        previous = version(current)[0]
      return upgrade
        ? major > previous && (runtime !== "node" || Boolean(r.lts))
        : major === previous
    })
    .map((r) => r.version.replace(/^v/, ""))
    .sort(compare)
  return candidates.at(-1) || current
}
function validate(data) {
  if (
    Object.keys(data).some(
      (key) => !["node", "npm", "tool_downloads"].includes(key)
    ) ||
    Object.keys(data.tool_downloads || {}).some((key) => key !== "npm")
  )
    throw Error("Unknown runtime manifest field")
  version(data.node)
  managers.validate(data)
}
function rendered(root, data) {
  validate(data)
  const pkg = JSON.parse(
    fs.readFileSync(path.join(root, "package.json"), "utf8")
  )
  pkg.packageManager = `npm@${data.npm}`
  return {
    ".node-version": `${data.node}\n`,
    ".nvmrc": `${data.node}\n`,
    "package.json": `${JSON.stringify(pkg, null, 2)}\n`,
  }
}
async function request(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "shadcn-digital-agency-jp-runtime-updates",
      ...headers,
    },
    signal: AbortSignal.timeout(45000),
  })
  if (!response.ok) throw Error("Runtime release discovery failed")
  return response.json()
}
async function discover(data, runtime, upgrade, query = request) {
  if (!["node", "npm"].includes(runtime)) throw Error("Unsupported runtime")
  const next = structuredClone(data)
  if (runtime === "node")
    next.node = latest(
      data.node,
      runtime,
      upgrade,
      await query("https://nodejs.org/dist/index.json")
    )
  else {
    const { versions } = await query("https://registry.npmjs.org/npm", {
      Accept: "application/vnd.npm.install-v1+json",
    })
    next.npm = latest(
      data.npm,
      runtime,
      upgrade,
      Object.keys(versions).map((version) => ({ version }))
    )
    if (!upgrade || next.npm !== data.npm) {
      const dist = versions[next.npm]?.dist
      if (!dist) throw Error("Missing npm release metadata")
      next.tool_downloads.npm = { url: dist.tarball, integrity: dist.integrity }
    }
  }
  validate(next)
  return next
}
async function main() {
  const args = process.argv.slice(2),
    command = args[0]
  if (!["check", "sync", "plan"].includes(command))
    throw Error("Expected check, sync or plan")
  const option = (name) =>
    args.includes(name) ? args[args.indexOf(name) + 1] : undefined
  let data = JSON.parse(fs.readFileSync(path.join(ROOT, MANIFEST), "utf8"))
  const runtime = option("--runtime"),
    output = option("--output")
  if (command === "plan") {
    if (!runtime || !output) throw Error("plan requires --runtime and --output")
    data = await discover(data, runtime, args.includes("--upgrade"))
  }
  const files = {
    ...rendered(ROOT, data),
    [MANIFEST]: `${JSON.stringify(data, null, 2)}\n`,
  }
  const changed = Object.fromEntries(
    Object.entries(files).filter(
      ([file, text]) =>
        !fs.existsSync(path.join(ROOT, file)) ||
        fs.readFileSync(path.join(ROOT, file), "utf8") !== text
    )
  )
  if (command === "check") {
    if (Object.keys(changed).length)
      throw Error(
        `Runtime pins differ from the manifest: ${Object.keys(changed).join(", ")}; run node .github/scripts/runtime-versions.cjs sync`
      )
    for (const file of fs
      .readdirSync(path.join(ROOT, ".github/workflows"))
      .filter((f) => f.endsWith(".yml")))
      if (
        /^\s+node-version:\s*['"]?\d/m.test(
          fs.readFileSync(path.join(ROOT, ".github/workflows", file), "utf8")
        )
      )
        throw Error(`${file}: use the canonical version file`)
    console.log("Runtime versions and generated pins are consistent")
  } else if (command === "sync") {
    for (const [file, text] of Object.entries(changed))
      fs.writeFileSync(path.join(ROOT, file), text)
    console.log(`Synchronized ${Object.keys(changed).length} runtime files`)
  } else {
    const plan = {
      changed: Object.keys(changed).length > 0,
      runtime,
      channel: args.includes("--upgrade") ? "next" : "current",
      version: data[runtime],
      files: changed,
    }
    fs.writeFileSync(output, `${JSON.stringify(plan, null, 2)}\n`)
    if (process.env.GITHUB_OUTPUT)
      fs.appendFileSync(process.env.GITHUB_OUTPUT, `changed=${plan.changed}\n`)
    console.log(
      `${runtime} ${plan.version}: ${Object.keys(changed).length} proposed file changes`
    )
  }
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
module.exports = { version, latest, validate, rendered, discover }
