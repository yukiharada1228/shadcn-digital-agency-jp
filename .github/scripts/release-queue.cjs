const native = require("./native-dependency-queue.cjs")
async function requireProtection({ github, context }) {
  const { data: protection } = await github.rest.repos.getBranchProtection({
    ...context.repo,
    branch: "main",
  })
  const { data: rules } = await github.request(
    "GET /repos/{owner}/{repo}/rules/branches/{branch}",
    { ...context.repo, branch: "main" }
  )
  native.requireProtection(protection, rules)
}
async function enqueue({ github, context, pr }) {
  const data = await github.graphql(
    "query($owner:String!,$name:String!,$number:Int!){repository(owner:$owner,name:$name){pullRequest(number:$number){mergeQueueEntry{id}}}}",
    { owner: context.repo.owner, name: context.repo.repo, number: pr.number }
  )
  if (data.repository.pullRequest.mergeQueueEntry) return true
  try {
    await github.graphql(
      "mutation($id:ID!,$sha:GitObjectID!){enqueuePullRequest(input:{pullRequestId:$id,expectedHeadOid:$sha}){mergeQueueEntry{id}}}",
      { id: pr.node_id, sha: pr.head.sha }
    )
    return true
  } catch (error) {
    // GitHub can observe a check transition between our CI read and enqueue.
    // Pending required checks wait for the next event; all other errors fail closed.
    if (
      error.errors?.length &&
      error.errors.every(
        (e) =>
          e.type === "UNPROCESSABLE" &&
          /required status checks (?:have not succeeded|are expected)/.test(
            e.message || ""
          )
      )
    )
      return false
    throw error
  }
}
module.exports = { requireProtection, enqueue }
