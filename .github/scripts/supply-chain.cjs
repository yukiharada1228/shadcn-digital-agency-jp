// Inspect lockfiles as data without installing the packages being checked.
const fs = require("node:fs")
const { execFileSync, spawnSync } = require("node:child_process")
function registryUrl(value) {
  try {
    const u = new URL(value)
    return (
      u.protocol === "https:" &&
      u.host === "registry.npmjs.org" &&
      !u.username &&
      !u.password &&
      !u.search &&
      !u.hash
    )
  } catch {
    return false
  }
}
function npmPackages(lock, allowedScripts) {
  if (
    lock.lockfileVersion !== 3 ||
    !lock.packages ||
    Array.isArray(lock.packages)
  )
    throw Error("Expected an npm v3 lockfile")
  const result = new Map()
  for (const [location, p] of Object.entries(lock.packages)) {
    if (!location.includes("node_modules/")) continue
    const name = location.split("node_modules/").at(-1)
    if (p.link) {
      const target = p.resolved || ""
      if (
        !target ||
        target.startsWith("/") ||
        target.split("/").some((x) => ["..", "node_modules"].includes(x)) ||
        !Object.hasOwn(lock.packages, target)
      )
        throw Error(`Unsafe workspace link: ${location}`)
      continue
    }
    if (p.inBundle) {
      const index = location.lastIndexOf("/node_modules/")
      if (index < 0 || !Object.hasOwn(lock.packages, location.slice(0, index)))
        throw Error(`Missing enclosing tarball: ${location}`)
      continue
    }
    if (!/^\d+\.\d+\.\d+(?:[-+][\w.+-]+)?$/.test(p.version || ""))
      throw Error(`Non-registry version: ${location}`)
    if (!registryUrl(p.resolved))
      throw Error(`Unapproved npm source: ${location}`)
    const match = /^(sha512|sha1)-([A-Za-z0-9+/]+={0,2})$/.exec(
      p.integrity || ""
    )
    if (
      !match ||
      Buffer.from(match[2], "base64").length !==
        (match[1] === "sha512" ? 64 : 20)
    )
      throw Error(`Invalid integrity: ${location}`)
    if (p.hasInstallScript && !allowedScripts.includes(name))
      throw Error(
        `New lifecycle-script package requires policy review: ${name}`
      )
    const key = JSON.stringify(["npm", name, p.version])
    if (result.has(key) && result.get(key) !== p.integrity)
      throw Error(`Conflicting integrity: ${name}@${p.version}`)
    result.set(key, p.integrity)
  }
  return result
}
function checkChanges(before, after) {
  for (const [key, integrity] of after)
    if (before.has(key) && before.get(key) !== integrity)
      throw Error(`An existing release changed integrity: ${key}`)
  const added = [...after.keys()].filter((key) => !before.has(key)).sort()
  for (const key of added)
    if (!after.get(key).startsWith("sha512-"))
      throw Error(`New npm versions require SHA-512: ${key}`)
  return added.map((key) => JSON.parse(key))
}
async function queryOsv(payload) {
  const response = await fetch("https://api.osv.dev/v1/querybatch", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000),
  })
  if (!response.ok) throw Error("OSV request failed")
  return response.json()
}
async function scan(packages, query = queryOsv) {
  const details = []
  for (let start = 0; start < packages.length; start += 100) {
    const batch = packages.slice(start, start + 100)
    const { results } = await query({
      queries: batch.map(([ecosystem, name, version]) => ({
        package: { ecosystem, name },
        version,
      })),
    })
    if (!Array.isArray(results) || results.length !== batch.length)
      throw Error("Incomplete OSV response")
    for (const [i, result] of results.entries()) {
      if (
        !result ||
        typeof result !== "object" ||
        Array.isArray(result) ||
        result.next_page_token ||
        (result.vulns !== undefined && !Array.isArray(result.vulns))
      )
        throw Error("Incomplete OSV result")
      for (const vuln of result.vulns || []) {
        if (!/^[A-Za-z0-9_.-]+$/.test(vuln.id || ""))
          throw Error("Invalid advisory identifier")
        const [eco, name, version] = batch[i]
        const safe = `${name}@${version}`.replace(/[^A-Za-z0-9_@./+-]/g, "?")
        details.push(
          `- ${eco}: \`${safe}\` — [${vuln.id}](https://osv.dev/vulnerability/${vuln.id})`
        )
      }
    }
  }
  return {
    status: details.length ? "findings" : "ok",
    summary: `全ロックファイルの${packages.length}バージョンを検査し、${details.length}件の脆弱性情報を検出しました。`,
    details: [...new Set(details)].sort(),
  }
}
function readBase(ref, filename) {
  if (!/^[a-f0-9]{40}$/.test(ref || ""))
    throw Error("Base must be a full commit SHA")
  if (spawnSync("git", ["cat-file", "-e", `${ref}:${filename}`]).status !== 0) {
    execFileSync("git", ["cat-file", "-e", `${ref}^{commit}`])
    return null
  }
  return execFileSync("git", ["show", `${ref}:${filename}`], {
    encoding: "utf8",
  })
}
function lockedPackages() {
  const policy = JSON.parse(
    fs.readFileSync(".github/supply-chain-policy.json", "utf8")
  )
  const packages = new Map()
  for (const file of policy.npm_lockfiles)
    for (const entry of npmPackages(
      JSON.parse(fs.readFileSync(file, "utf8")),
      policy.reviewed_install_script_packages
    ))
      packages.set(...entry)
  return [...packages.keys()].sort().map((key) => JSON.parse(key))
}
async function main() {
  const args = process.argv.slice(2)
  const base = args[args.indexOf("--base") + 1]
  if (!args.includes("--base")) throw Error("--base is required")
  const policy = JSON.parse(
    fs.readFileSync(".github/supply-chain-policy.json", "utf8")
  )
  const introduced = new Map()
  for (const file of policy.npm_lockfiles) {
    const current = npmPackages(
      JSON.parse(fs.readFileSync(file, "utf8")),
      policy.reviewed_install_script_packages
    )
    const text = readBase(base, file)
    let previous = new Map()
    if (text) {
      const old = JSON.parse(text)
      for (const [location, p] of Object.entries(old.packages))
        if (location.includes("node_modules/") && !p.resolved && !p.link)
          delete old.packages[location]
      previous = npmPackages(old, policy.reviewed_install_script_packages)
    }
    for (const item of checkChanges(previous, current))
      introduced.set(JSON.stringify(item), item)
  }
  console.log(
    `Validated lockfile sources and integrity; ${introduced.size} introduced versions`
  )
  if (
    !args.includes("--offline") &&
    (await scan([...introduced.values()])).status !== "ok"
  )
    throw Error("Known vulnerabilities in introduced versions")
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
module.exports = {
  npmPackages,
  checkChanges,
  queryOsv,
  scan,
  readBase,
  lockedPackages,
}
