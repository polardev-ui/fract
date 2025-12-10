import ora from "ora"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"
import os from "os"

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export async function uninstall(packageName, options) {
  console.log("")

  const spinner = ora({
    text: chalk.yellow(`Removing ${chalk.bold(packageName)}...`),
    spinner: "dots",
  }).start()

  await sleep(1000)

  const installDir = options.global
    ? path.join(os.homedir(), ".fract", "packages")
    : path.join(process.cwd(), "fract_modules")

  const packagePath = path.join(installDir, packageName)

  if (await fs.pathExists(packagePath)) {
    await fs.remove(packagePath)
    spinner.succeed(chalk.green(`Removed ${chalk.bold(packageName)}`))
  } else {
    spinner.fail(chalk.red(`Package ${chalk.bold(packageName)} not found`))
  }

  console.log("")
}
