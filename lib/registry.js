import chalk from "chalk"

// Get the registry URL from environment or default to production
const REGISTRY_URL = process.env.FRACT_REGISTRY_URL || "https://fract.dev"

export async function fetchPackage(packageName) {
  try {
    const response = await fetch(`${REGISTRY_URL}/api/packages/registry?name=${encodeURIComponent(packageName)}`)

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch package: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(chalk.red(`Error fetching package from registry: ${error.message}`))
    return null
  }
}

export async function searchPackages(query) {
  try {
    const response = await fetch(`${REGISTRY_URL}/api/packages/registry?query=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`Failed to search packages: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(chalk.red(`Error searching registry: ${error.message}`))
    return []
  }
}

export async function listPackages() {
  try {
    const response = await fetch(`${REGISTRY_URL}/api/packages/registry`)

    if (!response.ok) {
      throw new Error(`Failed to list packages: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(chalk.red(`Error listing packages: ${error.message}`))
    return []
  }
}
