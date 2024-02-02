import fetch from 'node-fetch'
import { Octokit } from '@octokit/rest'

import { Alert, isActiveAlert, toAlert } from './entities'

export const fetchAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  count: number,
): Promise<Alert[] | []> => {
  const octokit = new Octokit({
    auth: gitHubPersonalAccessToken,
    request: {
      fetch,
    },
  })
  const dependabotAlerts = await octokit.paginate(
    octokit.dependabot.listAlertsForRepo,
    {
      owner: repositoryOwner,
      repo: repositoryName,
      first: count,
    },
  )
  const alerts: Alert[] = []
  for (const dependabotAlert of dependabotAlerts) {
    if (isActiveAlert(dependabotAlert)) {
      alerts.push(toAlert(dependabotAlert, repositoryName, repositoryOwner))
    }
  }
  return alerts
}
