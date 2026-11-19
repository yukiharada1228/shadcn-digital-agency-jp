const { test } = require("node:test")
const assert = require("node:assert/strict")
const { requireCiSuccess } = require("./dependency-automation.cjs")
test("CI aggregate fails closed for missing, failed, skipped and additional jobs", () => {
  const jobs = ["ci", "workflow-security", "supply-chain"]
  const good = Object.fromEntries(jobs.map((j) => [j, { result: "success" }]))
  assert.doesNotThrow(() => requireCiSuccess(good))
  for (const job of jobs) {
    for (const result of ["failure", "skipped", "cancelled"])
      assert.throws(() => requireCiSuccess({ ...good, [job]: { result } }))
    const missing = { ...good }
    delete missing[job]
    assert.throws(() => requireCiSuccess(missing))
  }
  assert.throws(() =>
    requireCiSuccess({ ...good, extra: { result: "success" } })
  )
})
