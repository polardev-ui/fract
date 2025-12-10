import ora from "ora"
import chalk from "chalk"
import { searchPackages } from "./registry.js"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function search(query) {
  console.log("")

  const spinner = ora({
    text: chalk.cyan(`Searching for ${chalk.bold(query)}...`),
    spinner: "dots",
  }).start()

  const results = await searchPackages(query)

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
    console.log(chalk.cyan(`  Version: ${pkg.version}`))
    console.log(chalk.cyan(`  Downloads: ${pkg.downloads.toLocaleString()}`))
    console.log("")
  })
}
