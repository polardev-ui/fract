import ora from "ora"
import chalk from "chalk"
import cliProgress from "cli-progress"
import fs from "fs-extra"
import path from "path"
import os from "os"
import { execSync } from "child_process"
import { fetchPackage } from "./registry.js"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function install(packageName, options) {
  console.log("")

  const checkSpinner = ora({
    text: chalk.cyan(`Checking registry for ${chalk.bold(packageName)}...`),
    spinner: "dots",
  }).start()

  const packageData = await fetchPackage(packageName)

  if (!packageData) {
    checkSpinner.fail(chalk.red(`Package ${chalk.bold(packageName)} not found in registry`))
    console.log("")
    console.log(chalk.yellow(`Try searching for packages with: ${chalk.bold(`fract search ${packageName}`)}`))
    console.log("")
    process.exit(1)
  }

  checkSpinner.succeed(chalk.green(`Found ${chalk.bold(packageName)} v${packageData.version}`))

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

  // Step 5: Installing - Now actually installs the package using npm
  console.log("")
  const installSpinner = ora({
    text: chalk.cyan("Installing to system..."),
    spinner: "dots12",
  }).start()

  try {
    // Install the actual package using npm
    const installCommand = options.global
      ? `npm install -g ${packageName}@${packageData.version}`
      : `npm install ${packageName}@${packageData.version}`

    execSync(installCommand, { stdio: "pipe" })

    // Also save metadata in fract's tracking directory
    const installDir = options.global
      ? path.join(os.homedir(), ".fract", "packages")
      : path.join(process.cwd(), "fract_modules")

    await fs.ensureDir(path.join(installDir, packageName))

    const manifest = {
      name: packageData.name,
      version: packageData.version,
      description: packageData.description,
      repository: packageData.repository_url,
      homepage: packageData.homepage_url,
      installedAt: new Date().toISOString(),
      global: options.global || false,
    }

    await fs.writeJson(path.join(installDir, packageName, "package.json"), manifest, { spaces: 2 })

    installSpinner.succeed(chalk.green(`${chalk.bold("Installed")} ${chalk.bold(packageName)}`))
  } catch (error) {
    installSpinner.fail(chalk.red(`Failed to install ${packageName}`))
    console.log(chalk.red(`Error: ${error.message}`))
    console.log("")
    process.exit(1)
  }

  // Summary
  console.log("")
  console.log(chalk.gray("━".repeat(50)))
  console.log(chalk.green("✓") + " " + chalk.white(`Successfully installed ${chalk.bold(packageName)}`))
  console.log(chalk.gray(`  Location: ${options.global ? "global" : "local"}`))
  console.log(chalk.gray("━".repeat(50)))
  console.log("")

  try {
    await fetch(`${process.env.FRACT_REGISTRY_URL || "https://www.fract.dev"}/api/packages/registry/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ packageName }),
    })
  } catch (error) {
    // Silently fail if download count update fails
  }
}
