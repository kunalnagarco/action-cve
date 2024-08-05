import { Endpoints } from '@octokit/types'

import { BaseAlert } from '../base-alert'
import { Repository } from '../repository'
import { toAdvisory } from '../advisory'
import { toVulnerability } from '../vulnerability'

export type DependabotRepositoryAlert =
  Endpoints['GET /repos/{owner}/{repo}/dependabot/alerts']['response']['data'][0]

export interface RepositoryAlert extends BaseAlert {
  repository: Repository
}

export const toRepositoryAlert = (
  dependabotRepositoryAlert: DependabotRepositoryAlert,
  repositoryName: string,
  repositoryOwner: string,
): RepositoryAlert => ({
  repository: {
    name: repositoryName,
    owner: repositoryOwner,
  },
  packageName:
    dependabotRepositoryAlert.security_vulnerability.package.name || '',
  advisory: dependabotRepositoryAlert.security_advisory
    ? toAdvisory(dependabotRepositoryAlert.security_advisory)
    : undefined,
  vulnerability: dependabotRepositoryAlert.security_vulnerability
    ? toVulnerability(dependabotRepositoryAlert.security_vulnerability)
    : undefined,
  createdAt: dependabotRepositoryAlert.created_at,
})
