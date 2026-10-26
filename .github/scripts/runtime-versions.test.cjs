const { test } = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const os = require("node:os")
const path = require("node:path")
const { createHash } = require("node:crypto")
const runtime = require("./runtime-versions.cjs")
const managers = require("./package-managers.cjs")
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../runtime-versions.json"))
)
test("Node discovery separates current series and future LTS and rejects prereleases/downgrades", () => {
  const releases = [
    { version: "v26.12.2" },
    { version: "v28.0.0", lts: false },
    { version: "v27.0.0", lts: "LTS" },
    { version: "v29.0.0-rc.1", lts: true },
    { version: "v24.0.0", lts: true },
  ]
  assert.equal(runtime.latest("26.12.1", "node", false, releases), "26.12.2")
  assert.equal(runtime.latest("26.12.1", "node", true, releases), "27.0.0")
})
test("npm discovery preserves reviewed hashes and rejects spoofed distribution URLs", async () => {
  const original = data.npm
  const parts = original.split(".").map(Number)
  parts[2]++
  const next = parts.join("."),
    pin = {
      tarball: `https://registry.npmjs.org/npm/-/npm-${next}.tgz`,
      integrity: data.tool_downloads.npm.integrity,
    }
  const query = async () => ({
    versions: { [next]: { dist: pin }, "13.0.0-beta.1": {} },
  })
  const found = await runtime.discover(data, "npm", false, query)
  assert.equal(found.npm, next)
  assert.equal(found.tool_downloads.npm.url, pin.tarball)
  pin.tarball = "https://evil.test/npm.tgz"
  await assert.rejects(runtime.discover(data, "npm", false, query))
  assert.equal(data.npm, original)
})
test("manifest rejects unsupported runtimes and generates only project pins", () => {
  for (const key of ["python", "pip", "uv", "images"])
    assert.throws(() => runtime.validate({ ...data, [key]: "1.0.0" }))
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "runtime-test-"))
  try {
    fs.writeFileSync(
      path.join(root, "package.json"),
      JSON.stringify({ name: "test" })
    )
    const files = runtime.rendered(root, data)
    assert.deepEqual(Object.keys(files).sort(), [
      ".node-version",
      ".nvmrc",
      "package.json",
    ])
    assert.equal(
      JSON.parse(files["package.json"]).packageManager,
      `npm@${data.npm}`
    )
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
test("npm bootstrap checks hashes before use and rejects failed/oversized downloads", async () => {
  const body = Buffer.from("reviewed archive")
  const pin = {
    url: "https://registry.npmjs.org/npm/test.tgz",
    integrity: "sha512-" + createHash("sha512").update(body).digest("base64"),
  }
  assert.deepEqual(
    await managers.verified(pin, async () => new Response(body)),
    body
  )
  await assert.rejects(
    managers.verified(
      { ...pin, integrity: data.tool_downloads.npm.integrity },
      async () => new Response(body)
    ),
    /hash mismatch/
  )
  await assert.rejects(
    managers.verified(pin, async () => new Response("", { status: 500 })),
    /download failed/
  )
  const response = {
    ok: true,
    body: (async function* () {
      yield Buffer.alloc(64 * 1024 * 1024 + 1)
    })(),
  }
  await assert.rejects(
    managers.verified(pin, async () => response),
    /size limit/
  )
})
test("verified npm bootstrap extracts and runs both entry points, including paths with quotes", async () => {
  const { execFileSync } = require("node:child_process")
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "npm bootstrap's test-"))
  try {
    const source = path.join(root, "source")
    fs.mkdirSync(path.join(source, "package/bin"), { recursive: true })
    for (const name of ["npm", "npx"])
      fs.writeFileSync(
        path.join(source, `package/bin/${name}-cli.js`),
        `console.log('${data.npm}')`
      )
    const archive = path.join(root, "fixture.tgz")
    execFileSync("tar", ["-czf", archive, "-C", source, "package/"])
    const body = fs.readFileSync(archive),
      fixture = structuredClone(data)
    fixture.tool_downloads.npm.integrity =
      "sha512-" + createHash("sha512").update(body).digest("base64")
    const prefix = path.join(root, "installed")
    await managers.install(fixture, prefix, async () => new Response(body))
    assert.equal(
      execFileSync(path.join(prefix, "bin/npx"), ["--version"], {
        encoding: "utf8",
      }).trim(),
      data.npm
    )
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
})
test("workflows execute Node scripts and configure only Node.js and npm runtimes", () => {
  for (const file of fs
    .readdirSync(path.join(__dirname, "../workflows"))
    .filter((f) => f.endsWith(".yml"))) {
    const text = fs.readFileSync(
      path.join(__dirname, "../workflows", file),
      "utf8"
    )
    assert.doesNotMatch(
      text,
      /setup-python|python-version|\bpython3?\s|manager: (pip|uv)\b/
    )
    for (const match of text.matchAll(
      /node (\.github\/scripts\/[^\s"']+\.cjs)/g
    ))
      assert.ok(
        fs.existsSync(path.resolve(__dirname, "../..", match[1])),
        match[1]
      )
  }
  assert.match(
    fs.readFileSync(
      path.join(__dirname, "../workflows/runtime-updates.yml"),
      "utf8"
    ),
    /runtime: \[node, npm\]/
  )
  assert.ok(!fs.existsSync(path.join(__dirname, "../../.python-version")))
})
