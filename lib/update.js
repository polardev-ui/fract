import ora from "ora"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import os from "os"
import { execSync } from "child_process"
import { fetchPackage } from "./registry.js"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function update(packageName) {
  console.log("")

  // Check if package exists
  const localDir = path.join(process.cwd(), "fract_modules")
  const globalDir = path.join(os.homedir(), ".fract", "packages")

  const localPath = path.join(localDir, packageName)
  const globalPath = path.join(globalDir, packageName)

  let packagePath = null
  let isGlobal = false

  if (await fs.pathExists(localPath)) {
    packagePath = localPath
  } else if (await fs.pathExists(globalPath)) {
    packagePath = globalPath
    isGlobal = true
  }

  if (!packagePath) {
    console.log(chalk.red(`Package ${chalk.bold(packageName)} not found`))
    console.log("")
    return
  }

  const checkSpinner = ora({
    text: chalk.cyan("Checking for updates..."),
    spinner: "dots",
  }).start()

  const packageData = await fetchPackage(packageName)

  if (!packageData) {
    checkSpinner.fail(chalk.red(`Package ${chalk.bold(packageName)} not found in registry`))
    console.log("")
    return
  }

  const manifestPath = path.join(packagePath, "package.json")
  const manifest = await fs.readJson(manifestPath)
  const oldVersion = manifest.version

  if (oldVersion === packageData.version) {
    checkSpinner.succeed(chalk.green(`Already on latest version (v${oldVersion})`))
    console.log("")
    return
  }

  checkSpinner.succeed(chalk.green(`Update available: v${oldVersion} → v${packageData.version}`))

  console.log("")
  const updateSpinner = ora({
    text: chalk.cyan(`Updating ${chalk.bold(packageName)}...`),
    spinner: "arc",
  }).start()

  try {
    const updateCommand = isGlobal ? `npm update -g ${packageName}` : `npm update ${packageName}`

    execSync(updateCommand, { stdio: "pipe" })

    // Update metadata
    manifest.version = packageData.version
    manifest.updatedAt = new Date().toISOString()
    await fs.writeJson(manifestPath, manifest, { spaces: 2 })

    updateSpinner.succeed(chalk.green(`Updated ${chalk.bold(packageName)}`))

    console.log("")
    console.log(chalk.gray(`  ${oldVersion} → ${packageData.version}`))
    console.log("")
  } catch (error) {
    updateSpinner.fail(chalk.red(`Failed to update ${packageName}`))
    console.log(chalk.red(`Error: ${error.message}`))
    console.log("")
  }
}
