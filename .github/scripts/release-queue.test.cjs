const { test } = require("node:test")
const assert = require("node:assert/strict")
const { enqueue } = require("./release-queue.cjs")
const context = { repo: { owner: "videoq-jp", repo: "library" } }
const pr = { number: 7, node_id: "PR_7", head: { sha: "a".repeat(40) } }
function fixture({ queued = false, error } = {}) {
  const calls = []
  return {
    calls,
    github: {
      graphql: async (query, values) => {
        if (query.startsWith("query"))
          return {
            repository: {
              pullRequest: { mergeQueueEntry: queued ? { id: "entry" } : null },
            },
          }
        calls.push({ query, values })
        if (error) throw error
        return {}
      },
    },
  }
}
test("release enqueue is idempotent and binds the exact verified head", async () => {
  const f = fixture()
  assert.equal(await enqueue({ ...f, context, pr }), true)
  assert.deepEqual(f.calls[0].values, { id: pr.node_id, sha: pr.head.sha })
  assert.match(f.calls[0].query, /expectedHeadOid/)
  const queued = fixture({ queued: true })
  assert.equal(await enqueue({ ...queued, context, pr }), true)
  assert.equal(queued.calls.length, 0)
})
test("pending required checks wait without bypassing the queue", async () => {
  const error = {
    errors: [
      {
        type: "UNPROCESSABLE",
        message:
          "Pull request 2 of 2 required status checks have not succeeded: 1 expected.",
      },
    ],
  }
  const f = fixture({ error })
  assert.equal(await enqueue({ ...f, context, pr }), false)
  assert.equal(f.calls.length, 1)
})
test("permissions, changed heads, mixed errors and transport failures remain fatal", async () => {
  for (const error of [
    new Error("network unavailable"),
    { errors: [] },
    {
      errors: [
        {
          type: "FORBIDDEN",
          message: "required status checks have not succeeded",
        },
      ],
    },
    { errors: [{ type: "UNPROCESSABLE", message: "Head changed" }] },
    {
      errors: [
        {
          type: "UNPROCESSABLE",
          message: "required status checks have not succeeded",
        },
        { type: "FORBIDDEN", message: "Denied" },
      ],
    },
  ]) {
    await assert.rejects(enqueue({ ...fixture({ error }), context, pr }))
  }
})
