import {
  DependabotAlert,
  DependabotEnterpriseAlert,
  DependabotOrgAlert,
  PackageCveMap,
} from '../entities'

/**
 * Filters Dependabot alerts based on ignored packages and CVEs.
 *
 * @param dependabotAlert - The Dependabot alert to be filtered. Can be a DependabotAlert, DependabotOrgAlert, or DependabotEnterpriseAlert.
 * @param ignorePackages - A map of package names to ignore, potentially with associated CVEs.
 * @returns A boolean indicating whether the alert should be included (true) or filtered out (false).
 */
export function filterPackages(
  dependabotAlert:
    | DependabotAlert
    | DependabotOrgAlert
    | DependabotEnterpriseAlert,
  ignorePackages: PackageCveMap,
): boolean {
  const packageCve =
    ignorePackages[dependabotAlert.security_vulnerability.package.name]

  if (!packageCve) return true

  if (packageCve.length === 0) return false

  if (
    dependabotAlert.security_advisory.cve_id &&
    packageCve.includes(dependabotAlert.security_advisory.cve_id)
  )
    return false

  return true
}
