import { PackageCveMap } from '../../entities/package-cve'

/**
 * Parse a comma-separated list of package names and their associated CVEs.
 *
 * @param {string} input "foo#CVE-2021-21291,foo#CVE-2021-21292,bar"
 * @returns {PackageCveMap} {'foo': ['CVE-2021-21291', 'CVE-2021-21292'], 'bar': []}
 */
export function parseIgnorePackages(input: string): PackageCveMap {
  const packages = input.split(',').map((p) => p.trim())

  return packages.reduce((acc, packageCve) => {
    const [pkg, cve] = packageCve.split('#')

    if (!acc[pkg]) acc[pkg] = []

    if (cve) acc[pkg] = [...acc[pkg], cve]

    return acc
  }, {} as PackageCveMap)
}
