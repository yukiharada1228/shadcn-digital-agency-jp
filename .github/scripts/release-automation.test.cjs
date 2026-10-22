const test = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const { join } = require("node:path")
const policy = require("./release-automation.cjs")
const { REPOSITORY, BRANCH } = policy
const BOT = "project-automation[bot]"
const registry = (names = ["button"]) => ({
  items: names.map((name) => ({ name, type: "registry:ui" })),
})
const commit = (message) => ({
  commit: { message },
  parents: [{ sha: "0".repeat(40) }],
  sha: "a".repeat(40),
})
const json = (value) => `${JSON.stringify(value, null, 2)}\n`

function fixture() {
  let id = 0
  const sha = () => (++id).toString(16).padStart(40, "0")
  const commits = new Map()
  const trees = new Map()
  const refs = new Map()
  const releases = new Map()
  const pulls = []
  const runs = []
  const mutations = []
  const upstream = "e".repeat(40)
  const addCommit = (message, parent, files) => {
    const hash = sha()
    const value = {
      sha: hash,
      commit: { message, tree: { sha: hash } },
      tree: { sha: hash },
      parents: parent ? [{ sha: parent }] : [],
      files: { ...(parent ? commits.get(parent).files : {}), ...files },
    }
    commits.set(hash, value)
    trees.set(hash, value.files)
    return hash
  }
  const baseline = addCommit("chore(release): v0.8.0", null, {
    "package.json": json({
      name: "example",
      version: "0.8.0",
      private: true,
      dependencies: { example: "^1.0.0" },
    }),
    "package-lock.json": json({
      version: "0.8.0",
      packages: {
        "": { version: "0.8.0", dependencies: { example: "^1.0.0" } },
        "node_modules/example": { version: "1.0.0", integrity: "sha512-test" },
      },
    }),
    "registry.json": json(registry()),
    "CHANGELOG.md":
      "# Changelog\n\n## Unreleased\n\n## v0.8.0\n\nPrevious release.\n",
    "src/components/ui/button.tsx": "before",
  })
  const source = addCommit("fix: align the button baseline", baseline, {
    "src/components/ui/button.tsx": "after",
  })
  refs.set("heads/main", source)
  refs.set("tags/v0.8.0", baseline)
  releases.set("v0.8.0", {
    tag_name: "v0.8.0",
    draft: false,
    prerelease: false,
  })
  let latestTag = "v0.8.0"
  const resolve = (ref) =>
    refs.get(ref) || refs.get(`tags/${ref}`) || refs.get(`heads/${ref}`) || ref
  const getCommit = (ref) => {
    const value = commits.get(resolve(ref))
    if (!value)
      throw Object.assign(new Error(`missing commit ${ref}`), { status: 404 })
    return value
  }
  const missing = () => {
    throw Object.assign(new Error("not found"), { status: 404 })
  }
  const success = (hash, event = "push", branch = "main", overrides = {}) => {
    runs.push({
      id: runs.length + 1,
      head_sha: hash,
      head_branch: branch,
      event,
      repository: { full_name: REPOSITORY },
      head_repository: { full_name: REPOSITORY },
      status: "completed",
      conclusion: "success",
      ...overrides,
    })
  }
  success(source)
  const github = {
    paginate: async (method, args) => (await method(args)).data,
    rest: {
      actions: {
        listWorkflowRuns: async ({ head_sha, event }) => ({
          data: {
            workflow_runs: runs.filter(
              (run) => run.head_sha === head_sha && run.event === event
            ),
          },
        }),
      },
      repos: {
        getBranch: async () => ({
          data: { commit: { sha: refs.get("heads/main") } },
        }),
        getBranchProtection: async () => ({
          data: {
            required_status_checks: {
              strict: true,
              checks: ["CI Success", "Supply Chain Security"].map(
                (context) => ({ context, app_id: 15368 })
              ),
            },
          },
        }),
        getContent: async ({ ref, path }) => {
          if (path.startsWith("upstream/")) return { data: { sha: upstream } }
          const text = getCommit(ref).files[path]
          if (text === undefined) return missing()
          return {
            data: {
              content: Buffer.from(text).toString("base64"),
              encoding: "base64",
            },
          }
        },
        getCommit: async ({ ref }) => ({ data: getCommit(ref) }),
        compareCommitsWithBasehead: async ({
          basehead,
          page = 1,
          per_page = 100,
        }) => {
          const [baseRef, headRef] = basehead.split("...")
          const base = getCommit(baseRef)
          const head = getCommit(headRef)
          let at = head
          const items = []
          while (at.sha !== base.sha && at.parents.length) {
            items.unshift(at)
            at = getCommit(at.parents[0].sha)
          }
          const paths = new Set([
            ...Object.keys(base.files),
            ...Object.keys(head.files),
          ])
          const files = [...paths]
            .filter((path) => base.files[path] !== head.files[path])
            .map((filename) => ({
              filename,
              status:
                base.files[filename] === undefined
                  ? "added"
                  : head.files[filename] === undefined
                    ? "removed"
                    : "modified",
            }))
          return {
            data: {
              status:
                at.sha !== base.sha
                  ? "diverged"
                  : base.sha === head.sha
                    ? "identical"
                    : "ahead",
              total_commits: items.length,
              commits: items.slice((page - 1) * per_page, page * per_page),
              files,
            },
          }
        },
        getReleaseByTag: async ({ tag }) =>
          releases.has(tag) ? { data: releases.get(tag) } : missing(),
        getLatestRelease: async () => ({ data: releases.get(latestTag) }),
        listCommits: async ({ sha: hash, path }) => {
          let at = getCommit(hash)
          while (at.parents.length) {
            const parent = getCommit(at.parents[0].sha)
            if (at.files[path] !== parent.files[path]) return { data: [at] }
            at = parent
          }
          return { data: [] }
        },
        listPullRequestsAssociatedWithCommit: async ({ commit_sha }) => ({
          data: pulls.filter((pr) => pr.merge_commit_sha === commit_sha),
        }),
        createRelease: async (args) => {
          mutations.push(["release", args])
          releases.set(args.tag_name, args)
          latestTag = args.tag_name
          return { data: args }
        },
      },
      git: {
        getCommit: async ({ commit_sha }) => ({ data: getCommit(commit_sha) }),
        getRef: async ({ ref }) =>
          refs.has(ref)
            ? { data: { object: { sha: refs.get(ref) } } }
            : missing(),
        createTree: async ({ base_tree, tree }) => {
          mutations.push(["tree"])
          const hash = sha()
          trees.set(hash, {
            ...trees.get(base_tree),
            ...Object.fromEntries(
              tree.map((item) => [item.path, item.content])
            ),
          })
          return { data: { sha: hash } }
        },
        createCommit: async ({ message, tree, parents }) => {
          mutations.push(["commit"])
          return {
            data: { sha: addCommit(message, parents[0], trees.get(tree)) },
          }
        },
        createRef: async ({ ref, sha: hash }) => {
          mutations.push(["ref", ref])
          refs.set(ref.replace(/^refs\//, ""), hash)
          return { data: {} }
        },
        updateRef: async ({ ref, sha: hash }) => {
          mutations.push(["update-ref", ref])
          refs.set(ref, hash)
          for (const pr of pulls.filter((p) => p.state === "open"))
            pr.head.sha = hash
          return { data: {} }
        },
      },
      pulls: {
        list: async ({ state }) => ({
          data: pulls.filter((pr) => pr.state === state),
        }),
        get: async ({ pull_number }) => ({ data: pulls[pull_number - 1] }),
        create: async ({ title, body }) => {
          mutations.push(["pr"])
          const pr = {
            number: pulls.length + 1,
            title,
            body,
            state: "open",
            draft: false,
            user: { login: BOT },
            head: {
              ref: BRANCH,
              sha: refs.get(`heads/${BRANCH}`),
              repo: { full_name: REPOSITORY },
            },
            base: { ref: "main", repo: { full_name: REPOSITORY } },
          }
          pulls.push(pr)
          return { data: pr }
        },
        update: async ({ pull_number, title, body }) => {
          mutations.push(["update-pr"])
          Object.assign(pulls[pull_number - 1], { title, body })
          return { data: pulls[pull_number - 1] }
        },
        merge: async ({ pull_number, sha: hash, commit_title }) => {
          mutations.push(["merge"])
          const pr = pulls[pull_number - 1]
          assert.equal(hash, pr.head.sha)
          const merged = addCommit(
            commit_title,
            refs.get("heads/main"),
            getCommit(hash).files
          )
          refs.set("heads/main", merged)
          Object.assign(pr, {
            state: "closed",
            merged_at: "2026-10-22T00:00:00Z",
            merge_commit_sha: merged,
          })
          return { data: { merged: true, sha: merged } }
        },
      },
    },
  }
  const f = {
    github,
    context: {
      repo: { owner: "yukiharada1228", repo: "shadcn-digital-agency-jp" },
      ref: "refs/heads/main",
    },
    botLogin: BOT,
    commits,
    refs,
    releases,
    pulls,
    runs,
    mutations,
    baseline,
    source,
    addCommit,
    success,
  }
  f.run = () => policy.runRelease(f)
  f.prepareAndMerge = async () => {
    await f.run()
    success(pulls[0].head.sha, "pull_request", BRANCH)
    await f.run()
    return refs.get("heads/main")
  }
  return f
}

test("versions features, fixes, maintenance, untyped commits and breaking changes", () => {
  const cases = [
    ["0.8.0", "feat: add an option", "0.9.0"],
    ["0.8.0", "fix: repair sizing", "0.8.1"],
    ["0.8.0", "docs: explain usage", "0.8.1"],
    ["0.8.0", "ci: automate releases", "0.8.1"],
    ["0.8.0", "日本語の変更説明", "0.8.1"],
    ["0.8.0", "refactor!: remove a prop", "0.9.0"],
    ["1.2.3", "feat(button)!: change API", "2.0.0"],
    ["1.2.3", "fix: change API\n\nBREAKING CHANGE: old prop removed", "2.0.0"],
    ["1.2.3", "refactor: API\n\nBREAKING-CHANGE: old prop removed", "2.0.0"],
    ["1.2.3", "feat: add a component", "1.3.0"],
  ]
  for (const [before, message, after] of cases)
    assert.equal(
      policy.nextVersion(before, [commit(message)], registry(), registry())
        .version,
      after
    )
  assert.equal(
    policy.nextVersion(
      "0.8.0",
      [commit("fix: add wrapper")],
      registry(),
      registry(["button", "form-control-label"])
    ).version,
    "0.9.0"
  )
  assert.equal(
    policy.nextVersion(
      "1.2.3",
      [commit("chore: remove old item")],
      registry(["button", "old"]),
      registry()
    ).version,
    "2.0.0"
  )
  assert.equal(
    policy.nextVersion(
      "1.2.3",
      [commit("feat: option"), commit("fix!: remove API")],
      registry(),
      registry()
    ).version,
    "2.0.0"
  )
  for (const version of [
    "v1.0.0",
    "01.0.0",
    "1.0.0-beta",
    "9007199254740992.0.0",
  ])
    assert.throws(() => policy.nextVersion(version, [], registry(), registry()))
})

test("automatically prepares, checks, merges and publishes once with matching versions", async () => {
  const f = fixture()
  assert.equal((await f.run()).status, "waiting-for-pr-ci")
  assert.equal(f.pulls.length, 1)
  const releaseHead = f.pulls[0].head.sha
  const files = f.commits.get(releaseHead).files
  assert.equal(JSON.parse(files["package.json"]).version, "0.8.1")
  assert.equal(
    JSON.parse(files["package-lock.json"]).packages[""].version,
    "0.8.1"
  )
  assert.equal(
    JSON.parse(files["package-lock.json"]).packages["node_modules/example"]
      .integrity,
    "sha512-test"
  )
  assert.match(files["CHANGELOG.md"], /## Unreleased\n\n## v0\.8\.1/)
  assert.match(files["CHANGELOG.md"], /fix: align the button baseline/)
  assert.match(files["CHANGELOG.md"], /## v0\.8\.0\n\nPrevious release\./)
  f.mutations.length = 0
  await f.run()
  assert.equal(f.mutations.length, 0)
  f.success(releaseHead, "pull_request", BRANCH)
  assert.equal((await f.run()).status, "waiting-for-release-ci")
  const merged = f.refs.get("heads/main")
  assert.equal(f.releases.size, 1)
  f.success(merged)
  const result = await f.run()
  assert.deepEqual(result, {
    status: "up-to-date",
    actions: ["published v0.8.1"],
  })
  assert.equal(f.refs.get("tags/v0.8.1"), merged)
  assert.equal(f.releases.get("v0.8.1").target_commitish, merged)
  f.mutations.length = 0
  assert.equal((await f.run()).status, "up-to-date")
  assert.equal(f.mutations.length, 0)
})

test("failed, queued, cancelled, stale and foreign CI cannot release or merge", async () => {
  for (const overrides of [
    { conclusion: "failure" },
    { conclusion: "cancelled" },
    { status: "queued", conclusion: null },
    { repository: { full_name: "other/repo" } },
    { head_repository: { full_name: "other/repo" } },
    { head_branch: "other" },
  ]) {
    const f = fixture()
    f.success(f.source, "push", "main", overrides)
    assert.equal((await f.run()).status, "waiting-for-main-ci")
    assert.equal(f.mutations.length, 0)
  }
  const f = fixture()
  await f.run()
  f.success(f.pulls[0].head.sha, "pull_request", BRANCH)
  f.success(f.pulls[0].head.sha, "pull_request", BRANCH, {
    conclusion: "failure",
  })
  f.mutations.length = 0
  assert.equal((await f.run()).status, "waiting-for-pr-ci")
  assert.equal(f.mutations.length, 0)
})

test("branch protection, untrusted PRs and modified release content fail closed", async () => {
  const f = fixture()
  f.github.rest.repos.getBranchProtection = async () => ({ data: {} })
  await assert.rejects(f.run(), /branch protection/)
  assert.equal(f.mutations.length, 0)
  for (const mutation of [
    (g) => {
      g.pulls[0].user.login = "intruder"
    },
    (g) => {
      g.pulls[0].draft = true
    },
    (g) => {
      g.commits.get(g.pulls[0].head.sha).files["src/components/ui/button.tsx"] =
        "unreviewed"
    },
    (g) => {
      g.commits.get(g.pulls[0].head.sha).files["package.json"] = "{}"
    },
  ]) {
    const g = fixture()
    await g.run()
    mutation(g)
    g.mutations.length = 0
    await assert.rejects(g.run())
    assert.equal(g.mutations.length, 0)
  }
})

test("an outdated release PR is regenerated and must pass CI again", async () => {
  const f = fixture()
  await f.run()
  const oldHead = f.pulls[0].head.sha
  f.success(oldHead, "pull_request", BRANCH)
  const next = f.addCommit("feat: add a wrapper", f.source, {
    "registry.json": json(registry(["button", "wrapper"])),
  })
  f.refs.set("heads/main", next)
  f.success(next)
  assert.equal((await f.run()).status, "waiting-for-pr-ci")
  assert.notEqual(f.pulls[0].head.sha, oldHead)
  assert.equal(f.pulls[0].title, "chore(release): v0.9.0")
  assert.equal(f.pulls[0].state, "open")
})

test("publishes the tested release commit when main has advanced and prepares the next release", async () => {
  const f = fixture()
  const merged = await f.prepareAndMerge()
  f.success(merged)
  const next = f.addCommit("docs: improve examples", merged, {
    "README.md": "new docs",
  })
  f.refs.set("heads/main", next)
  f.success(next)
  const result = await f.run()
  assert.equal(f.refs.get("tags/v0.8.1"), merged)
  assert.ok(result.actions.includes("published v0.8.1"))
  assert.equal(f.pulls[1].title, "chore(release): v0.8.2")
})

test("tag conflicts cannot be overwritten and release API retries reuse the correct tag", async () => {
  const f = fixture()
  const merged = await f.prepareAndMerge()
  f.success(merged)
  f.refs.set("tags/v0.8.1", f.baseline)
  f.mutations.length = 0
  await assert.rejects(f.run(), /another commit/)
  assert.equal(f.mutations.length, 0)
  f.refs.delete("tags/v0.8.1")
  const create = f.github.rest.repos.createRelease
  f.github.rest.repos.createRelease = async () => {
    throw new Error("API unavailable")
  }
  await assert.rejects(f.run(), /API unavailable/)
  assert.equal(f.refs.get("tags/v0.8.1"), merged)
  f.github.rest.repos.createRelease = create
  f.mutations.length = 0
  assert.equal((await f.run()).status, "up-to-date")
  assert.equal(f.mutations.filter(([kind]) => kind === "ref").length, 0)
  assert.equal(f.mutations.filter(([kind]) => kind === "release").length, 1)
})

test("recovers a branch created before a failed PR request", async () => {
  const f = fixture()
  const create = f.github.rest.pulls.create
  f.github.rest.pulls.create = async () => {
    throw new Error("API unavailable")
  }
  await assert.rejects(f.run(), /API unavailable/)
  const head = f.refs.get(`heads/${BRANCH}`)
  f.github.rest.pulls.create = create
  f.mutations.length = 0
  await f.run()
  assert.equal(f.pulls[0].head.sha, head)
  assert.deepEqual(
    f.mutations.map(([kind]) => kind),
    ["pr"]
  )
})

test("recovers an updated branch before a failed PR body update", async () => {
  const f = fixture()
  await f.run()
  const next = f.addCommit("feat: more examples", f.source, {
    "README.md": "examples",
  })
  f.refs.set("heads/main", next)
  f.success(next)
  const update = f.github.rest.pulls.update
  f.github.rest.pulls.update = async () => {
    throw new Error("API unavailable")
  }
  await assert.rejects(f.run(), /API unavailable/)
  f.github.rest.pulls.update = update
  assert.equal((await f.run()).status, "waiting-for-pr-ci")
  assert.equal(f.pulls[0].title, "chore(release): v0.9.0")
})

test("main moving during planning prevents branch writes", async () => {
  const f = fixture()
  let reads = 0
  f.github.rest.repos.getBranch = async () => ({
    data: { commit: { sha: ++reads === 1 ? f.source : "f".repeat(40) } },
  })
  assert.equal((await f.run()).status, "main-moved")
  assert.equal(f.mutations.length, 0)
})

test("release planning preserves manual notes and reads all commit pages", async () => {
  const f = fixture()
  let current = f.source
  for (let i = 0; i < 105; i++)
    current = f.addCommit(
      i === 0 ? "feat: paginated feature" : `fix: item ${i}`,
      current,
      { "README.md": String(i) }
    )
  f.commits.get(current).files["CHANGELOG.md"] =
    "# Changelog\n\n## Unreleased\n\nMigration details.\n\n## v0.8.0\n\nOld.\n"
  f.refs.set("heads/main", current)
  f.success(current)
  await f.run()
  assert.equal(f.pulls[0].title, "chore(release): v0.9.0")
  const changelog = f.commits.get(f.pulls[0].head.sha).files["CHANGELOG.md"]
  assert.match(changelog, /Migration details\./)
  assert.match(changelog, /fix: item 104/)
  assert.match(changelog, /feat: paginated feature/)
})

test("workflow uses trusted code, scoped tokens, serialized recovery and pinned actions", () => {
  const workflow = readFileSync(
    join(__dirname, "../workflows/release.yml"),
    "utf8"
  )
  assert.match(workflow, /ref: \$\{\{ github\.workflow_sha \}\}/)
  assert.match(workflow, /group: automatic-release-main/)
  assert.match(workflow, /cancel-in-progress: false/)
  assert.match(workflow, /schedule:/)
  assert.match(workflow, /workflow_dispatch:/)
  assert.match(workflow, /RELEASE_AUTOMATION_ENABLED != 'false'/)
  assert.match(workflow, /permission-contents: write/)
  assert.match(workflow, /permission-pull-requests: write/)
  assert.doesNotMatch(
    workflow,
    /npm (ci|install)|ref:.*head_sha|pull_request_target|secrets\.OPENAI|persist-credentials: true/
  )
  for (const action of workflow.matchAll(/uses: ([^\s]+)/g))
    assert.match(action[1], /@[a-f0-9]{40}$/)
})
