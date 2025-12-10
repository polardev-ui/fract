import ora from "ora"
import chalk from "chalk"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Mock package registry
const mockPackages = [
  { name: "express", description: "Fast, unopinionated web framework", downloads: "50M" },
  { name: "react", description: "JavaScript library for building UIs", downloads: "45M" },
  { name: "lodash", description: "JavaScript utility library", downloads: "40M" },
  { name: "axios", description: "Promise based HTTP client", downloads: "35M" },
  { name: "typescript", description: "TypeScript language", downloads: "30M" },
  { name: "webpack", description: "Module bundler", downloads: "25M" },
  { name: "eslint", description: "Linting utility for JavaScript", downloads: "28M" },
  { name: "prettier", description: "Code formatter", downloads: "22M" },
]

export async function search(query) {
  console.log("")

  const spinner = ora({
    text: chalk.cyan(`Searching for ${chalk.bold(query)}...`),
    spinner: "dots",
  }).start()

  await sleep(1200)

  const results = mockPackages.filter(
    (pkg) => pkg.name.includes(query.toLowerCase()) || pkg.description.toLowerCase().includes(query.toLowerCase()),
  )

  spinner.stop()

  if (results.length === 0) {
    console.log(chalk.yellow(`No packages found matching "${query}"`))
    console.log("")
    return
  }

  console.log(chalk.cyan.bold(`Found ${results.length} package(s):`))
  console.log(chalk.gray("━".repeat(60)))
  console.log("")

  results.forEach((pkg) => {
    console.log(chalk.white.bold(pkg.name))
    console.log(chalk.gray(`  ${pkg.description}`))
    console.log(chalk.cyan(`  Downloads: ${pkg.downloads}/week`))
    console.log("")
  })
}
