import { Octokit } from '@octokit/rest'

import { RepositoryAlert, toRepositoryAlert } from './RepositoryAlert'

export const fetchRepositoryAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  severity: string,
  ecosystem: string,
  count: number,
): Promise<RepositoryAlert[] | []> => {
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
  const alerts: RepositoryAlert[] = response.data.map((dependabotAlert) =>
    toRepositoryAlert(dependabotAlert, repositoryName, repositoryOwner),
  )
  return alerts
}
