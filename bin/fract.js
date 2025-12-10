#!/usr/bin/env node

import { program } from "commander"
import chalk from "chalk"
import boxen from "boxen"
import { install } from "../lib/install.js"
import { uninstall } from "../lib/uninstall.js"
import { list } from "../lib/list.js"
import { search } from "../lib/search.js"
import { update } from "../lib/update.js"
import { selfUpdate } from "../lib/self-update.js"
import { checkForUpdates, showUpdateNotification } from "../lib/version-check.js"

const version = "1.0.0"

console.log(
  boxen(chalk.cyan.bold("fract") + chalk.gray(" v" + version) + "\n" + chalk.white("Modern package management"), {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "cyan",
  }),
)

program.name("fract").description("A modern package manager with beautiful terminal animations").version(version)

program
  .command("install <package>")
  .alias("i")
  .description("Install a package")
  .option("-g, --global", "Install package globally")
  .action(async (packageName, options) => {
    await install(packageName, options)
    const latestVersion = await checkForUpdates(version)
    if (latestVersion) showUpdateNotification(latestVersion)
  })

program
  .command("uninstall <package>")
  .alias("remove")
  .description("Uninstall a package")
  .option("-g, --global", "Uninstall package globally")
  .action(async (packageName, options) => {
    await uninstall(packageName, options)
    const latestVersion = await checkForUpdates(version)
    if (latestVersion) showUpdateNotification(latestVersion)
  })

program
  .command("list")
  .alias("ls")
  .description("List installed packages")
  .action(async () => {
    await list()
    const latestVersion = await checkForUpdates(version)
    if (latestVersion) showUpdateNotification(latestVersion)
  })

program
  .command("search <query>")
  .description("Search for packages")
  .action(async (query) => {
    await search(query)
    const latestVersion = await checkForUpdates(version)
    if (latestVersion) showUpdateNotification(latestVersion)
  })

program
  .command("update <package>")
  .description("Update a package")
  .action(async (packageName) => {
    await update(packageName)
    const latestVersion = await checkForUpdates(version)
    if (latestVersion) showUpdateNotification(latestVersion)
  })

program
  .command("self-update")
  .alias("upgrade")
  .description("Update fract to the latest version")
  .action(async () => {
    await selfUpdate()
  })

program.parse(process.argv)

if (!process.argv.slice(2).length) {
  program.outputHelp()
}
