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

export const toRepositoryAlert = (
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

export type DependabotOrgAlert =
  Endpoints['GET /orgs/{org}/dependabot/alerts']['response']['data'][0]

export const toOrgAlert = (dependabotOrgAlert: DependabotOrgAlert): Alert => ({
  repository: {
    name: dependabotOrgAlert.repository.name,
    owner: dependabotOrgAlert.repository.owner.login,
  },
  packageName: dependabotOrgAlert.security_vulnerability.package.name || '',
  advisory: dependabotOrgAlert.security_advisory
    ? toAdvisory(dependabotOrgAlert.security_advisory)
    : undefined,
  vulnerability: dependabotOrgAlert.security_vulnerability
    ? toVulnerability(dependabotOrgAlert.security_vulnerability)
    : undefined,
  createdAt: dependabotOrgAlert.created_at,
})

export type DependabotEnterpriseAlert =
  Endpoints['GET /enterprises/{enterprise}/dependabot/alerts']['response']['data'][0]

export const toEnterpriseAlert = (
  dependabotEnterpriseAlert: DependabotEnterpriseAlert,
): Alert => ({
  repository: {
    name: dependabotEnterpriseAlert.repository.name,
    owner: dependabotEnterpriseAlert.repository.owner.login,
  },
  packageName:
    dependabotEnterpriseAlert.security_vulnerability.package.name || '',
  advisory: dependabotEnterpriseAlert.security_advisory
    ? toAdvisory(dependabotEnterpriseAlert.security_advisory)
    : undefined,
  vulnerability: dependabotEnterpriseAlert.security_vulnerability
    ? toVulnerability(dependabotEnterpriseAlert.security_vulnerability)
    : undefined,
  createdAt: dependabotEnterpriseAlert.created_at,
})
