import { Octokit } from '@octokit/rest'

import { Alert, PackageCveMap, toRepositoryAlert } from '../entities'

import { filterPackages } from './filters'

export const fetchRepositoryAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  severity: string,
  ecosystem: string,
  ignorePackages: PackageCveMap,
  count: number,
): Promise<Alert[] | []> => {
  const octokit = new Octokit({
    auth: gitHubPersonalAccessToken,
    request: {
      fetch,
    },
  })
  const response = await octokit.dependabot.listAlertsForRepo({
    owner: repositoryOwner,
    repo: repositoryName,
    state: 'open',
    severity,
    ecosystem: ecosystem.length > 0 ? ecosystem : undefined,
    per_page: count,
  })

  return response.data
    .filter((dependabotAlert) =>
      filterPackages(dependabotAlert, ignorePackages),
    )
    .map((alert) => toRepositoryAlert(alert, repositoryName, repositoryOwner))
}
