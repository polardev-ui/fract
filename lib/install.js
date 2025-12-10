import ora from "ora"
import chalk from "chalk"
import cliProgress from "cli-progress"
import fs from "fs-extra"
import path from "path"
import os from "os"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function install(packageName, options) {
  console.log("")

  // Step 1: Resolving dependencies
  const resolveSpinner = ora({
    text: chalk.cyan("Resolving dependencies..."),
    spinner: "dots",
  }).start()

  await sleep(800)
  resolveSpinner.succeed(chalk.green("Dependencies resolved"))

  // Step 2: Fetching package
  console.log("")
  const fetchSpinner = ora({
    text: chalk.cyan(`Fetching ${chalk.bold(packageName)}...`),
    spinner: "bouncingBar",
  }).start()

  await sleep(1500)
  fetchSpinner.succeed(chalk.green(`Fetched ${chalk.bold(packageName)}`))

  // Step 3: Download progress bar
  console.log("")
  const progressBar = new cliProgress.SingleBar({
    format: chalk.cyan("Downloading") + " |" + chalk.cyan("{bar}") + "| {percentage}% | {value}/{total} KB",
    barCompleteChar: "\u2588",
    barIncompleteChar: "\u2591",
    hideCursor: true,
  })

  const totalSize = Math.floor(Math.random() * 5000) + 1000
  progressBar.start(totalSize, 0)

  for (let i = 0; i <= totalSize; i += Math.floor(Math.random() * 200) + 50) {
    await sleep(50)
    progressBar.update(Math.min(i, totalSize))
  }
  progressBar.update(totalSize)
  progressBar.stop()

  // Step 4: Compiling
  console.log("")
  const compileSpinner = ora({
    text: chalk.cyan("Compiling package..."),
    spinner: "arc",
  }).start()

  await sleep(1200)
  compileSpinner.succeed(chalk.green("Package compiled"))

  // Step 5: Installing
  console.log("")
  const installSpinner = ora({
    text: chalk.cyan("Installing to system..."),
    spinner: "dots12",
  }).start()

  await sleep(1000)

  // Create a mock installation directory
  const installDir = options.global
    ? path.join(os.homedir(), ".fract", "packages")
    : path.join(process.cwd(), "fract_modules")

  await fs.ensureDir(path.join(installDir, packageName))

  // Create a simple package manifest
  const manifest = {
    name: packageName,
    version: "1.0.0",
    installedAt: new Date().toISOString(),
    global: options.global || false,
  }

  await fs.writeJson(path.join(installDir, packageName, "package.json"), manifest, { spaces: 2 })

  installSpinner.succeed(chalk.green(`${chalk.bold("Installed")} ${chalk.bold(packageName)}`))

  // Summary
  console.log("")
  console.log(chalk.gray("━".repeat(50)))
  console.log(chalk.green("✓") + " " + chalk.white(`Successfully installed ${chalk.bold(packageName)}`))
  console.log(chalk.gray(`  Location: ${options.global ? "global" : "local"}`))
  console.log(chalk.gray("━".repeat(50)))
  console.log("")
}
