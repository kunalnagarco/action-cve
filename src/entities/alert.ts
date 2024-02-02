import { Endpoints } from '@octokit/types'

import { Advisory, toAdvisory } from './advisory'
import { Repository } from './repository'
import { Vulnerability, toVulnerability } from './vulnerability'

export type DependabotAlert =
  Endpoints['GET /repos/{owner}/{repo}/dependabot/alerts']['response']['data'][0]

export interface Alert {
  repository: Repository
  packageName: string
  advisory?: Advisory
  vulnerability?: Vulnerability
  createdAt: string
}

export const toAlert = (
  dependabotAlert: DependabotAlert,
  repositoryName: string,
  repositoryOwner: string,
): Alert => ({
  repository: {
    name: repositoryName,
    owner: repositoryOwner,
  },
  packageName: dependabotAlert.security_vulnerability.package.name || '',
  advisory: dependabotAlert.security_advisory
    ? toAdvisory(dependabotAlert.security_advisory)
    : undefined,
  vulnerability: dependabotAlert.security_vulnerability
    ? toVulnerability(dependabotAlert.security_vulnerability)
    : undefined,
  createdAt: dependabotAlert.created_at,
})

export const isActiveAlert = (dependabotAlert: DependabotAlert): boolean => {
  if (
    dependabotAlert.dismissed_at === null &&
    dependabotAlert.fixed_at === null
  ) {
    return true
  }
  return false
}
