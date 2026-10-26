// Bootstrap npm using only Node builtins and a reviewed distribution hash.
const fs = require("node:fs")
const path = require("node:path")
const os = require("node:os")
const { createHash } = require("node:crypto")
const { execFileSync } = require("node:child_process")
function validate(data) {
  const pin = data.tool_downloads?.npm
  if (
    !/^\d+\.\d+\.\d+$/.test(data.npm || "") ||
    !pin ||
    pin.url !== `https://registry.npmjs.org/npm/-/npm-${data.npm}.tgz` ||
    !/^sha512-[A-Za-z0-9+/]{86}==$/.test(pin.integrity)
  )
    throw Error("npm must be a hash-pinned official distribution")
}
async function verified(pin, request = fetch) {
  const response = await request(pin.url, {
    signal: AbortSignal.timeout(60000),
  })
  if (!response.ok) throw Error("npm download failed")
  const chunks = []
  let size = 0
  for await (const chunk of response.body) {
    size += chunk.length
    if (size > 64 * 1024 * 1024)
      throw Error("Package manager distribution exceeds the size limit")
    chunks.push(chunk)
  }
  const body = Buffer.concat(chunks)
  if (
    `sha512-${createHash("sha512").update(body).digest("base64")}` !==
    pin.integrity
  )
    throw Error(
      "Package manager distribution hash mismatch; nothing was executed"
    )
  return body
}
async function install(data, prefix, request = fetch) {
  validate(data)
  const body = await verified(data.tool_downloads.npm, request)
  fs.mkdirSync(prefix, { recursive: true })
  const archive = path.join(prefix, "npm.tgz")
  fs.writeFileSync(archive, body)
  const entries = execFileSync("tar", ["-tzf", archive], { encoding: "utf8" })
    .trim()
    .split("\n")
  if (
    entries.some(
      (entry) =>
        !entry.startsWith("package/") || entry.split("/").includes("..")
    )
  )
    throw Error("Unsafe npm archive path")
  execFileSync("tar", ["-xzf", archive, "-C", prefix])
  const bin = path.join(prefix, "bin")
  fs.mkdirSync(bin, { recursive: true })
  for (const name of ["npm", "npx"]) {
    const entry = path.join(prefix, "package", "bin", `${name}-cli.js`)
    fs.writeFileSync(
      path.join(bin, name),
      `#!/bin/sh\nexec '${process.execPath.replaceAll("'", "'\\''")}' '${entry.replaceAll("'", "'\\''")}' "$@"\n`,
      { mode: 0o755 }
    )
  }
  const version = execFileSync(path.join(bin, "npm"), ["--version"], {
    encoding: "utf8",
  }).trim()
  if (version !== data.npm)
    throw Error("Installed npm differs from the reviewed pin")
  if (process.env.GITHUB_PATH)
    fs.appendFileSync(process.env.GITHUB_PATH, `${bin}\n`)
  console.log(`npm: ${version}`)
}
async function main() {
  const args = process.argv.slice(2)
  if (args[0] !== "npm") throw Error("Only npm is supported")
  const option = (name, fallback) =>
    args.includes(name) ? args[args.indexOf(name) + 1] : fallback
  const manifest = option(
    "--manifest",
    path.resolve(__dirname, "../runtime-versions.json")
  )
  const prefix = option(
    "--prefix",
    fs.mkdtempSync(
      path.join(process.env.RUNNER_TEMP || os.tmpdir(), "verified-npm-")
    )
  )
  await install(
    JSON.parse(fs.readFileSync(manifest, "utf8")),
    path.resolve(prefix)
  )
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
module.exports = { validate, verified, install }
