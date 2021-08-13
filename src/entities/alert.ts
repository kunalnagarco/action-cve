import { Advisory, toAdvisory } from './advisory'
import { Repository, toRepository } from './repository'
import { toVulnerability, Vulnerability } from './vulnerability'
import { RepositoryVulnerabilityAlert } from '@octokit/graphql-schema'

export interface Alert {
  repository: Repository
  advisory?: Advisory
  vulnerability?: Vulnerability
  manifest: string
  createdAt: string
}

export const toAlert = (
  repositoryVulnerabilityAlert: RepositoryVulnerabilityAlert,
): Alert => ({
  repository: toRepository(repositoryVulnerabilityAlert.repository),
  advisory: repositoryVulnerabilityAlert.securityAdvisory
    ? toAdvisory(repositoryVulnerabilityAlert.securityAdvisory)
    : undefined,
  vulnerability: repositoryVulnerabilityAlert.securityVulnerability
    ? toVulnerability(repositoryVulnerabilityAlert.securityVulnerability)
    : undefined,
  manifest: repositoryVulnerabilityAlert.vulnerableManifestFilename,
  createdAt: repositoryVulnerabilityAlert.createdAt,
})
