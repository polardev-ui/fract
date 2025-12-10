import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import os from "os"

const VERSION_CHECK_FILE = path.join(os.homedir(), ".fract", "last-version-check.json")
const CHECK_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export async function checkForUpdates(currentVersion) {
  try {
    // Check if we recently checked for updates
    if (await fs.pathExists(VERSION_CHECK_FILE)) {
      const data = await fs.readJson(VERSION_CHECK_FILE)
      if (Date.now() - data.lastCheck < CHECK_INTERVAL) {
        return data.updateAvailable ? data.latestVersion : null
      }
    }

    // Fetch latest version from GitHub
    const response = await fetch("https://api.github.com/repos/polardev-ui/fract/releases/latest")
    if (!response.ok) return null

    const release = await response.json()
    const latestVersion = release.tag_name.replace(/^v/, "")

    // Save check result
    await fs.ensureDir(path.dirname(VERSION_CHECK_FILE))
    await fs.writeJson(VERSION_CHECK_FILE, {
      lastCheck: Date.now(),
      latestVersion,
      updateAvailable: latestVersion !== currentVersion,
    })

    return latestVersion !== currentVersion ? latestVersion : null
  } catch (error) {
    return null
  }
}

export function showUpdateNotification(latestVersion) {
  console.log("")
  console.log(chalk.yellow("━".repeat(60)))
  console.log(
    chalk.yellow("  ⚠ ") + chalk.white(`A new version of fract is available: `) + chalk.green.bold(`v${latestVersion}`),
  )
  console.log(chalk.gray("  Run ") + chalk.cyan.bold("fract self-update") + chalk.gray(" to update"))
  console.log(chalk.yellow("━".repeat(60)))
  console.log("")
}
