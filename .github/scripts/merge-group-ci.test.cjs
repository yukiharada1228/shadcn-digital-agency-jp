const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const { join } = require("node:path")
test("merge-group security review receives GitHub's exact integration base", () => {
  const ci = readFileSync(join(__dirname, "../workflows/ci.yml"), "utf8")
  assert.match(ci, /merge_group:\s*\n\s*types: \[checks_requested\]/)
  assert.match(ci, /BASE_SHA:.*github\.event\.merge_group\.base_sha/)
})
