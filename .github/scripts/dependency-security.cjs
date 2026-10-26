const fs = require("node:fs")
const { setTimeout: delay } = require("node:timers/promises")
const { scan, queryOsv, lockedPackages } = require("./supply-chain.cjs")
async function queryWithRetry(payload) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await queryOsv(payload)
    } catch (error) {
      if (attempt === 2) throw error
      await delay(1000 * 2 ** attempt)
    }
  }
}
async function main() {
  let report
  try {
    report = await scan(lockedPackages(), queryWithRetry)
  } catch {
    report = {
      status: "error",
      summary: "依存関係の定期検査を完了できませんでした。",
      details: [],
    }
  }
  fs.writeFileSync("operations-report.json", JSON.stringify(report))
}
if (require.main === module)
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
module.exports = { scan, queryWithRetry }
