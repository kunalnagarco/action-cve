import fetch from 'node-fetch'
import { Octokit } from '@octokit/rest'

import { Alert, isActiveAlert, toAlert } from './entities'

export const fetchAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  severity: string,
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
    severity,
    per_page: count,
  })
  const alerts: Alert[] = []
  for (const dependabotAlert of response.data) {
    if (isActiveAlert(dependabotAlert)) {
      alerts.push(toAlert(dependabotAlert, repositoryName, repositoryOwner))
    }
  }
  return alerts
}
