function verifiedUpdateTypes(commit, { allowMissingTypes = false } = {}) {
  if (
    commit.author?.login !== "dependabot[bot]" ||
    !commit.commit?.verification?.verified
  )
    return null
  const block = String(commit.commit?.message || "").match(
    /\n---\nupdated-dependencies:\n([\s\S]*?)\n\.\.\.(?:\n|$)/
  )
  if (!block) return null
  const dependencies = block[1].split(/^- dependency-name: /m).slice(1)
  if (!dependencies.length) return null
  const types = []
  for (const dependency of dependencies) {
    if (!dependency.split("\n")[0].trim()) return null
    const declared = [...dependency.matchAll(/^ {2}update-type:(.*)$/gm)].map(
      (match) => match[1].trim()
    )
    if (declared.length === 1) types.push(declared[0])
    else if (
      !declared.length &&
      allowMissingTypes &&
      /^ {2}dependency-version: \S[^\r\n]*$/m.test(dependency)
    ) {
      // Security updates can omit update-type. Never infer patch/minor: treat
      // unknown breadth as major, retaining Terraform production approval.
      types.push("version-update:semver-major")
    } else return null
  }
  return types
}

module.exports = { verifiedUpdateTypes }
