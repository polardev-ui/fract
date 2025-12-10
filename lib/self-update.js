import ora from "ora"
import chalk from "chalk"
import { execSync } from "child_process"
import fs from "fs-extra"
import path from "path"
import os from "os"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function selfUpdate() {
  console.log("")

  const checkSpinner = ora({
    text: chalk.cyan("Checking for updates..."),
    spinner: "dots",
  }).start()

  try {
    // Fetch latest version from GitHub
    const response = await fetch("https://api.github.com/repos/polardev-ui/fract/releases/latest")
    if (!response.ok) {
      checkSpinner.fail(chalk.red("Failed to check for updates"))
      return
    }

    const release = await response.json()
    const latestVersion = release.tag_name.replace(/^v/, "")

    // Read current version
    const packageJsonPath = path.join(os.homedir(), ".fract", "cli", "package.json")
    const currentPackage = await fs.readJson(packageJsonPath)
    const currentVersion = currentPackage.version

    if (latestVersion === currentVersion) {
      checkSpinner.succeed(chalk.green(`Already on latest version (v${currentVersion})`))
      console.log("")
      return
    }

    checkSpinner.succeed(chalk.green(`Update available: v${currentVersion} → v${latestVersion}`))

    // Download and install update
    console.log("")
    const downloadSpinner = ora({
      text: chalk.cyan("Downloading update..."),
      spinner: "bouncingBar",
    }).start()

    await sleep(1000)

    downloadSpinner.succeed(chalk.green("Update downloaded"))

    console.log("")
    const installSpinner = ora({
      text: chalk.cyan("Installing update..."),
      spinner: "dots12",
    }).start()

    // Run the install script
    execSync("curl -fsSL https://raw.githubusercontent.com/polardev-ui/fract/main/install.sh | bash", {
      stdio: "inherit",
    })

    installSpinner.succeed(chalk.green("Update installed"))

    console.log("")
    console.log(chalk.gray("━".repeat(50)))
    console.log(chalk.green("✓") + " " + chalk.white(`Successfully updated to ${chalk.bold(`v${latestVersion}`)}`))
    console.log(chalk.gray("━".repeat(50)))
    console.log("")
  } catch (error) {
    checkSpinner.fail(chalk.red("Failed to update fract"))
    console.log(chalk.red(`Error: ${error.message}`))
    console.log("")
  }
}
