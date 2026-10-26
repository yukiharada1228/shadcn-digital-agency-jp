const { test } = require("node:test")
const assert = require("node:assert/strict")
const {
  npmPackages,
  checkChanges,
  scan,
  readBase,
} = require("./supply-chain.cjs")
function fixture() {
  return {
    lockfileVersion: 3,
    packages: {
      "": {},
      "node_modules/example": {
        version: "1.0.0",
        resolved: "https://registry.npmjs.org/example/-/example-1.0.0.tgz",
        integrity: "sha512-" + "A".repeat(86) + "==",
      },
    },
  }
}
test("registry packages and unchanged versions pass", () => {
  const packages = npmPackages(fixture(), [])
  assert.equal(packages.size, 1)
  assert.deepEqual(checkChanges(packages, packages), [])
})
test("registry spoofing, missing hashes, lifecycle scripts, unsafe links and integrity replacement fail", () => {
  for (const source of [
    "http://registry.npmjs.org/pkg",
    "https://registry.npmjs.org.evil.test/pkg",
    "https://evil@registry.npmjs.org/pkg",
    "git+https://github.com/evil/pkg",
    "file:../evil",
  ]) {
    const lock = fixture()
    lock.packages["node_modules/example"].resolved = source
    assert.throws(() => npmPackages(lock, []))
  }
  const lock = fixture(),
    entry = lock.packages["node_modules/example"]
  entry.hasInstallScript = true
  assert.throws(() => npmPackages(lock, []))
  assert.equal(npmPackages(lock, ["example"]).size, 1)
  delete entry.hasInstallScript
  const before = npmPackages(lock, [])
  entry.integrity = "sha512-" + "B".repeat(86) + "=="
  assert.throws(() => checkChanges(before, npmPackages(lock, [])))
  delete entry.integrity
  assert.throws(() => npmPackages(lock, []))
  for (const target of [
    "../escape",
    "/tmp/escape",
    "node_modules/example",
    "missing",
  ]) {
    const lock = fixture()
    lock.packages["node_modules/link"] = { link: true, resolved: target }
    assert.throws(() => npmPackages(lock, []))
  }
})
test("introduced versions require SHA512 and conflicting copies fail", () => {
  const lock = fixture()
  lock.packages["node_modules/example"].integrity =
    "sha1-" + "A".repeat(27) + "="
  assert.throws(() => checkChanges(new Map(), npmPackages(lock, [])))
  const conflict = fixture()
  conflict.packages["node_modules/parent/node_modules/example"] = {
    ...conflict.packages["node_modules/example"],
    integrity: "sha512-" + "B".repeat(86) + "==",
  }
  assert.throws(() => npmPackages(conflict, []))
})
test("all vulnerability batches and advisories are reported", async () => {
  const packages = Array.from({ length: 201 }, (_, i) => [
      "npm",
      "package",
      String(i),
    ]),
    calls = []
  const report = await scan(packages, async (payload) => {
    calls.push(payload.queries.length)
    return {
      results: payload.queries.map(() => ({ vulns: [{ id: "GHSA-test" }] })),
    }
  })
  assert.deepEqual(calls, [100, 100, 1])
  assert.equal(report.status, "findings")
  assert.equal(report.details.length, 201)
})
test("incomplete, paginated, malformed results and network failures fail closed", async () => {
  for (const response of [
    {},
    { results: [] },
    { results: [{ next_page_token: "more" }] },
    { results: [{ vulns: {} }] },
    { results: [{ vulns: [{ id: "bad/link" }] }] },
  ])
    await assert.rejects(
      scan([["npm", "example", "1.0.0"]], async () => response)
    )
  await assert.rejects(
    scan([["npm", "example", "1.0.0"]], async () => {
      throw Error("timeout")
    })
  )
  assert.equal(
    (await scan([["npm", "example", "1.0.0"]], async () => ({ results: [{}] })))
      .status,
    "ok"
  )
  assert.equal(
    (
      await scan([], async () => {
        throw Error("should not query")
      })
    ).status,
    "ok"
  )
})
test("invalid or unfetched base cannot become an empty baseline", () => {
  assert.throws(() => readBase("main", "package-lock.json"))
  assert.throws(() => readBase("0".repeat(40), "package-lock.json"))
})
