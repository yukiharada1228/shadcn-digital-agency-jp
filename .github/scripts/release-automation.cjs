// Loaded only from github.workflow_sha by the privileged release workflow.
const { requireProtection } = require("./dependency-automation.cjs")

const REPOSITORY = "yukiharada1228/shadcn-digital-agency-jp"
const BRANCH = "automation/release"
const STATE = ".github/release-state.json"
const FILES = ["package.json", "package-lock.json", "CHANGELOG.md", STATE]
const MARKER = "<!-- shadcn-automatic-release -->"
const SHA = /^[a-f0-9]{40}$/
const VERSION = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

function parseVersion(version) {
  if (!VERSION.test(version))
    throw new Error(`Invalid stable version: ${version}`)
  const parts = version.split(".").map(Number)
  if (!parts.every(Number.isSafeInteger))
    throw new Error("Version is too large.")
  return parts
}

function nextVersion(version, commits, beforeRegistry, afterRegistry) {
  const [major, minor, patch] = parseVersion(version)
  const names = (registry) =>
    new Set(
      registry.items
        .filter((item) => item.type === "registry:ui")
        .map((item) => item.name)
    )
  const before = names(beforeRegistry)
  const after = names(afterRegistry)
  const messages = commits.map((commit) => commit.commit.message)
  const breaking =
    [...before].some((name) => !after.has(name)) ||
    messages.some(
      (message) =>
        /^[a-z]+(?:\([^\n)]*\))?!: /i.test(message) ||
        /^BREAKING[ -]CHANGE:\s*\S/m.test(message)
    )
  const feature =
    [...after].some((name) => !before.has(name)) ||
    messages.some((message) => /^feat(?:\([^\n)]*\))?: /i.test(message))
  const bump =
    breaking && major > 0 ? "major" : breaking || feature ? "minor" : "patch"
  const next =
    bump === "major"
      ? `${major + 1}.0.0`
      : bump === "minor"
        ? `${major}.${minor + 1}.0`
        : `${major}.${minor}.${patch + 1}`
  parseVersion(next)
  return { version: next, bump, breaking }
}

function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function makePlan({
  previousTag,
  sourceSha,
  commits,
  beforeRegistry,
  snapshot,
}) {
  if (!/^v/.test(previousTag) || !SHA.test(sourceSha) || !commits.length)
    throw new Error("Missing release source.")
  const previousVersion = previousTag.slice(1)
  const pkg = JSON.parse(snapshot["package.json"])
  const lock = JSON.parse(snapshot["package-lock.json"])
  if (
    pkg.version !== previousVersion ||
    lock.version !== previousVersion ||
    lock.packages[""].version !== previousVersion
  )
    throw new Error("Release versions do not match the previous published tag.")
  const change = nextVersion(
    previousVersion,
    commits,
    beforeRegistry,
    JSON.parse(snapshot["registry.json"])
  )
  const tag = `v${change.version}`
  const title = `chore(release): ${tag}`
  const seen = new Set()
  const entries = commits
    .filter((commit) => commit.parents.length < 2)
    .flatMap((commit) => {
      const message = commit.commit.message.split("\n")[0]
      if (seen.has(message)) return []
      seen.add(message)
      // Commit text is data, never shell input or executable code.
      const text = message.replace(/[<>]/g, (char) =>
        char === "<" ? "&lt;" : "&gt;"
      )
      return [
        `- ${text} ([${commit.sha.slice(0, 7)}](https://github.com/${REPOSITORY}/commit/${commit.sha}))`,
      ]
    })
  const changelog = snapshot["CHANGELOG.md"]
  const marker = "## Unreleased\n"
  const start = changelog.indexOf(marker)
  if (start < 0)
    throw new Error("CHANGELOG.md must contain an Unreleased section.")
  const remaining = changelog.slice(start + marker.length)
  const end = remaining.search(/^## /m)
  const manual = (end < 0 ? remaining : remaining.slice(0, end)).trim()
  const history = end < 0 ? "" : remaining.slice(end)
  const notes = [
    `main の CI 成功後に自動公開する ${change.bump} リリースです。`,
    `Upstream: [\`${snapshot.upstreamSha}\`](https://github.com/digital-go-jp/design-system-example-components-react/commit/${snapshot.upstreamSha})`,
    ...(change.breaking
      ? [
          "互換性に影響する変更を含みます。変更履歴と各変更の説明を確認してください。",
        ]
      : []),
    "### 変更内容\n\n" + entries.join("\n"),
    ...(manual ? ["### 追加の変更説明\n\n" + manual] : []),
    `[全変更](https://github.com/${REPOSITORY}/compare/${previousTag}...${tag}) · [互換性](https://github.com/${REPOSITORY}/blob/${tag}/docs/compatibility.md) · [公開デモ](https://shadcn-digital-agency-jp.pages.dev/)`,
  ].join("\n\n")
  pkg.version = change.version
  lock.version = change.version
  lock.packages[""].version = change.version
  const state = { version: change.version, sourceSha, previousTag }
  const files = {
    "package.json": json(pkg),
    "package-lock.json": json(lock),
    "CHANGELOG.md":
      changelog.slice(0, start + marker.length) +
      `\n## ${tag}\n\n${notes}\n\n` +
      history,
    [STATE]: json(state),
  }
  return {
    ...change,
    tag,
    title,
    sourceSha,
    notes,
    files,
    body: `${MARKER}\n\n${notes}\n\n対象コミット: \`${sourceSha}\`\n\nバージョン・CHANGELOG・リリース状態のみを更新します。CI 成功後に自動マージし、main の CI 成功後にタグと GitHub Release を公開します。`,
  }
}

async function optional(request) {
  try {
    return (await request()).data
  } catch (error) {
    if (error.status === 404) return null
    throw error
  }
}

function trustedPull(pr, botLogin) {
  return (
    pr.user?.login === botLogin &&
    pr.head?.repo?.full_name === REPOSITORY &&
    pr.base?.repo?.full_name === REPOSITORY &&
    pr.base.ref === "main" &&
    pr.head.ref === BRANCH &&
    !pr.draft &&
    pr.body?.startsWith(MARKER)
  )
}

async function runRelease({ github, readGithub = github, context, botLogin }) {
  if (
    `${context.repo.owner}/${context.repo.repo}` !== REPOSITORY ||
    context.ref !== "refs/heads/main" ||
    !botLogin?.endsWith("[bot]")
  )
    throw new Error(
      "Run from the source repository main branch with the configured GitHub App."
    )
  const repo = context.repo
  const read = readGithub.rest
  const write = github.rest
  const actions = []
  const cache = new Map()
  const content = async (ref, path, allowMissing = false) => {
    const key = `${ref}:${path}`
    if (!cache.has(key)) {
      const file = allowMissing
        ? await optional(() => read.repos.getContent({ ...repo, ref, path }))
        : (await read.repos.getContent({ ...repo, ref, path })).data
      if (!file) return null
      if (file.encoding !== "base64" || typeof file.content !== "string")
        throw new Error(`Cannot read ${path} as data.`)
      cache.set(key, Buffer.from(file.content, "base64").toString("utf8"))
    }
    return cache.get(key)
  }
  const mainHead = async () =>
    (await read.repos.getBranch({ ...repo, branch: "main" })).data.commit.sha
  const successfulCi = async (sha, event, branch) => {
    const { data } = await read.actions.listWorkflowRuns({
      ...repo,
      workflow_id: "ci.yml",
      head_sha: sha,
      event,
      per_page: 100,
    })
    const latest = data.workflow_runs.sort((a, b) => b.id - a.id)[0]
    return Boolean(
      latest &&
      latest.head_sha === sha &&
      latest.head_branch === branch &&
      latest.event === event &&
      latest.repository?.full_name === REPOSITORY &&
      latest.head_repository?.full_name === REPOSITORY &&
      latest.status === "completed" &&
      latest.conclusion === "success"
    )
  }
  const compare = async (base, head) => {
    const commits = []
    let first
    for (let page = 1; ; page++) {
      const { data } = await read.repos.compareCommitsWithBasehead({
        ...repo,
        basehead: `${base}...${head}`,
        per_page: 100,
        page,
      })
      first ||= data
      if (!["ahead", "identical"].includes(data.status))
        throw new Error("Release source must descend from the previous tag.")
      commits.push(...data.commits)
      if (commits.length >= data.total_commits) break
      if (!data.commits.length)
        throw new Error("Incomplete comparison response.")
    }
    return { ...first, commits }
  }
  const planAt = async (sourceSha, previousTag) => {
    if (
      !SHA.test(sourceSha) ||
      !/^v(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)$/.test(previousTag)
    )
      throw new Error("Invalid release state.")
    const diff = await compare(previousTag, sourceSha)
    if (!diff.commits.length) return null
    const snapshot = Object.fromEntries(
      await Promise.all(
        [
          "package.json",
          "package-lock.json",
          "CHANGELOG.md",
          "registry.json",
        ].map(async (path) => [path, await content(sourceSha, path)])
      )
    )
    snapshot.upstreamSha = (
      await read.repos.getContent({
        ...repo,
        ref: sourceSha,
        path: "upstream/design-system-example-components-react",
      })
    ).data.sha
    if (!SHA.test(snapshot.upstreamSha))
      throw new Error("Missing pinned upstream SHA.")
    return makePlan({
      previousTag,
      sourceSha,
      commits: diff.commits,
      beforeRegistry: JSON.parse(await content(previousTag, "registry.json")),
      snapshot,
    })
  }
  const verifyCommit = async (sha, plan) => {
    const { data: commit } = await read.repos.getCommit({ ...repo, ref: sha })
    if (
      commit.parents.length !== 1 ||
      commit.parents[0].sha !== plan.sourceSha ||
      commit.commit.message.split("\n")[0] !== plan.title
    )
      throw new Error("Release commit has an unexpected parent or title.")
    const diff = await compare(plan.sourceSha, sha)
    if (
      diff.commits.length !== 1 ||
      diff.files.length !== FILES.length ||
      diff.files.some(
        (file) =>
          !FILES.includes(file.filename) ||
          !["added", "modified"].includes(file.status)
      )
    )
      throw new Error("Release commit changes unexpected files.")
    for (const path of FILES)
      if ((await content(sha, path)) !== plan.files[path])
        throw new Error(`Unexpected release content: ${path}`)
  }
  const statePlan = async (sha) => {
    const raw = await content(sha, STATE)
    const state = JSON.parse(raw)
    const plan = await planAt(state.sourceSha, state.previousTag)
    if (!plan || plan.version !== state.version || raw !== plan.files[STATE])
      throw new Error("Release state does not match the computed version.")
    await verifyCommit(sha, plan)
    return plan
  }
  const releaseFor = (tag) =>
    optional(() => read.repos.getReleaseByTag({ ...repo, tag }))
  const head = await mainHead()
  if (!(await successfulCi(head, "push", "main")))
    return { status: "waiting-for-main-ci", actions }
  requireProtection(
    (await write.repos.getBranchProtection({ ...repo, branch: "main" })).data
  )
  const stateText = await content(head, STATE, true)
  if (stateText) {
    const state = JSON.parse(stateText)
    parseVersion(state.version)
    if (
      JSON.parse(await content(head, "package.json")).version !== state.version
    )
      throw new Error("Package version was changed outside release automation.")
    const tag = `v${state.version}`
    const existing = await releaseFor(tag)
    if (!existing) {
      // Find the release metadata commit even if main advanced while its CI ran.
      const { data: history } = await read.repos.listCommits({
        ...repo,
        sha: head,
        path: STATE,
        per_page: 1,
      })
      if (!history.length) throw new Error("Cannot locate the release commit.")
      const candidate = history[0].sha
      const plan = await statePlan(candidate)
      const pulls = await readGithub.paginate(
        read.repos.listPullRequestsAssociatedWithCommit,
        { ...repo, commit_sha: candidate, per_page: 100 }
      )
      if (
        !pulls.some(
          (pr) =>
            trustedPull(pr, botLogin) &&
            pr.merged_at &&
            pr.merge_commit_sha === candidate &&
            pr.title === plan.title &&
            pr.body === plan.body
        )
      )
        throw new Error(
          "Release metadata was not merged through the bot release PR."
        )
      if (!(await successfulCi(candidate, "push", "main")))
        return { status: "waiting-for-release-ci", actions }
      if ((await mainHead()) !== head) return { status: "main-moved", actions }
      const ref = await optional(() =>
        read.git.getRef({ ...repo, ref: `tags/${tag}` })
      )
      if (ref) {
        const tagged = (await read.repos.getCommit({ ...repo, ref: tag })).data
          .sha
        if (tagged !== candidate)
          throw new Error("Existing release tag points to another commit.")
      } else {
        await write.git.createRef({
          ...repo,
          ref: `refs/tags/${tag}`,
          sha: candidate,
        })
      }
      await write.repos.createRelease({
        ...repo,
        tag_name: tag,
        target_commitish: candidate,
        name: tag,
        body: plan.notes,
        draft: false,
        prerelease: false,
        make_latest: "true",
      })
      actions.push(`published ${tag}`)
    } else if (existing.draft || existing.prerelease) {
      throw new Error("An existing draft or prerelease needs to be resolved.")
    }
  }
  const { data: latest } = await read.repos.getLatestRelease(repo)
  if (latest.draft || latest.prerelease)
    throw new Error("Expected a stable published release.")
  const plan = await planAt(head, latest.tag_name)
  if (!plan) return { status: "up-to-date", actions }
  if ((await mainHead()) !== head) return { status: "main-moved", actions }
  const { data: pulls } = await read.pulls.list({
    ...repo,
    state: "open",
    head: `${repo.owner}:${BRANCH}`,
    base: "main",
    per_page: 100,
  })
  if (pulls.length > 1) throw new Error("Multiple release PRs are open.")
  let pr = pulls[0]
  if (pr && !trustedPull(pr, botLogin))
    throw new Error("Release branch PR is not owned by the configured bot.")
  const ref = await optional(() =>
    read.git.getRef({ ...repo, ref: `heads/${BRANCH}` })
  )
  let releaseHead
  if (ref) {
    const previous = await statePlan(ref.object.sha)
    if (pr && pr.head.sha !== ref.object.sha)
      throw new Error("Release branch and PR head disagree.")
    if (previous.sourceSha === head && previous.version === plan.version)
      releaseHead = ref.object.sha
  }
  if (!releaseHead) {
    if ((await mainHead()) !== head) return { status: "main-moved", actions }
    const { data: base } = await read.git.getCommit({
      ...repo,
      commit_sha: head,
    })
    const { data: tree } = await write.git.createTree({
      ...repo,
      base_tree: base.tree.sha,
      tree: Object.entries(plan.files).map(([path, text]) => ({
        path,
        mode: "100644",
        type: "blob",
        content: text,
      })),
    })
    const { data: commit } = await write.git.createCommit({
      ...repo,
      message: plan.title,
      tree: tree.sha,
      parents: [head],
    })
    if ((await mainHead()) !== head) return { status: "main-moved", actions }
    if (ref) {
      // Only this dedicated, content-verified automation branch is rewritten.
      const current = (
        await read.git.getRef({ ...repo, ref: `heads/${BRANCH}` })
      ).data
      if (current.object.sha !== ref.object.sha)
        throw new Error("Release branch moved concurrently.")
      await write.git.updateRef({
        ...repo,
        ref: `heads/${BRANCH}`,
        sha: commit.sha,
        force: true,
      })
    } else
      await write.git.createRef({
        ...repo,
        ref: `refs/heads/${BRANCH}`,
        sha: commit.sha,
      })
    releaseHead = commit.sha
    actions.push(`prepared ${plan.tag}`)
  }
  if (!pr) {
    pr = (
      await write.pulls.create({
        ...repo,
        head: BRANCH,
        base: "main",
        title: plan.title,
        body: plan.body,
      })
    ).data
    actions.push(`created PR #${pr.number}`)
  } else if (pr.title !== plan.title || pr.body !== plan.body) {
    pr = (
      await write.pulls.update({
        ...repo,
        pull_number: pr.number,
        title: plan.title,
        body: plan.body,
      })
    ).data
  }
  if (!(await successfulCi(releaseHead, "pull_request", BRANCH)))
    return { status: "waiting-for-pr-ci", actions }
  const { data: current } = await read.pulls.get({
    ...repo,
    pull_number: pr.number,
  })
  if (
    !trustedPull(current, botLogin) ||
    current.state !== "open" ||
    current.head.sha !== releaseHead ||
    current.title !== plan.title ||
    current.body !== plan.body
  )
    throw new Error("Release PR changed before merge.")
  await verifyCommit(releaseHead, plan)
  if ((await mainHead()) !== head) return { status: "main-moved", actions }
  // GitHub enforces strict branch protection; sha additionally prevents head races.
  const { data: merged } = await write.pulls.merge({
    ...repo,
    pull_number: pr.number,
    sha: releaseHead,
    merge_method: "squash",
    commit_title: plan.title,
    commit_message: "Automatically generated release metadata.",
  })
  if (!merged.merged)
    throw new Error(`Release PR was not merged: ${merged.message}`)
  actions.push(`merged PR #${pr.number}`)
  return { status: "waiting-for-release-ci", actions }
}

module.exports = {
  nextVersion,
  makePlan,
  trustedPull,
  runRelease,
  STATE,
  FILES,
  BRANCH,
  REPOSITORY,
  MARKER,
}
