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
  if (data.repository.pullRequest.mergeQueueEntry) return
  await github.graphql(
    "mutation($id:ID!,$sha:GitObjectID!){enqueuePullRequest(input:{pullRequestId:$id,expectedHeadOid:$sha}){mergeQueueEntry{id}}}",
    { id: pr.node_id, sha: pr.head.sha }
  )
}
module.exports = { requireProtection, enqueue }
