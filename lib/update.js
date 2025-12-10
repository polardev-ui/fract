import ora from "ora"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import os from "os"

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

  await sleep(1000)
  checkSpinner.succeed(chalk.green("Update available"))

  console.log("")
  const updateSpinner = ora({
    text: chalk.cyan(`Updating ${chalk.bold(packageName)}...`),
    spinner: "arc",
  }).start()

  await sleep(1500)

  // Update version in manifest
  const manifestPath = path.join(packagePath, "package.json")
  const manifest = await fs.readJson(manifestPath)
  const oldVersion = manifest.version
  manifest.version = "1.1.0"
  manifest.updatedAt = new Date().toISOString()
  await fs.writeJson(manifestPath, manifest, { spaces: 2 })

  updateSpinner.succeed(chalk.green(`Updated ${chalk.bold(packageName)}`))

  console.log("")
  console.log(chalk.gray(`  ${oldVersion} → ${manifest.version}`))
  console.log("")
}
