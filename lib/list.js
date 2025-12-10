import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import os from "os"

export async function list() {
  console.log("")
  console.log(chalk.cyan.bold("Installed Packages:"))
  console.log(chalk.gray("━".repeat(50)))
  console.log("")

  const localDir = path.join(process.cwd(), "fract_modules")
  const globalDir = path.join(os.homedir(), ".fract", "packages")

  let foundAny = false

  // List local packages
  if (await fs.pathExists(localDir)) {
    const localPackages = await fs.readdir(localDir)
    if (localPackages.length > 0) {
      console.log(chalk.white.bold("Local:"))
      for (const pkg of localPackages) {
        const manifestPath = path.join(localDir, pkg, "package.json")
        if (await fs.pathExists(manifestPath)) {
          const manifest = await fs.readJson(manifestPath)
          console.log(chalk.green("  ✓ ") + chalk.white(pkg) + chalk.gray(` v${manifest.version}`))
          foundAny = true
        }
      }
      console.log("")
    }
  }

  // List global packages
  if (await fs.pathExists(globalDir)) {
    const globalPackages = await fs.readdir(globalDir)
    if (globalPackages.length > 0) {
      console.log(chalk.white.bold("Global:"))
      for (const pkg of globalPackages) {
        const manifestPath = path.join(globalDir, pkg, "package.json")
        if (await fs.pathExists(manifestPath)) {
          const manifest = await fs.readJson(manifestPath)
          console.log(chalk.green("  ✓ ") + chalk.white(pkg) + chalk.gray(` v${manifest.version}`))
          foundAny = true
        }
      }
      console.log("")
    }
  }

  if (!foundAny) {
    console.log(chalk.gray("  No packages installed yet."))
    console.log("")
  }
}
