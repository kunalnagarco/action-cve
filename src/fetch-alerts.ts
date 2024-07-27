import { Octokit } from '@octokit/rest'

import { Alert, toAlert } from './entities'

export const fetchAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  severity: string,
  ecosystem: string,
  count: number,
): Promise<Alert[] | []> => {
  const octokit = new Octokit({
    auth: gitHubPersonalAccessToken,
    request: {
      fetch,
    },
  })
  console.log('severity', severity)
  const response = await octokit.dependabot.listAlertsForRepo({
    owner: repositoryOwner,
    repo: repositoryName,
    state: 'open',
    severity,
    ecosystem,
    per_page: count,
  })
  const alerts: Alert[] = response.data.map((dependabotAlert) =>
    toAlert(dependabotAlert, repositoryName, repositoryOwner),
  )
  return alerts
}
