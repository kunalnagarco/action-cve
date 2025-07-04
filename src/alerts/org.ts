import { Octokit } from '@octokit/rest'

import { Alert, PackageCveMap, toOrgAlert } from '../entities'

import { filterPackages } from './filters'

export const fetchOrgAlerts = async (
  gitHubPersonalAccessToken: string,
  org: string,
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
  const response = await octokit.dependabot.listAlertsForOrg({
    org,
    state: 'open',
    severity,
    ecosystem: ecosystem.length > 0 ? ecosystem : undefined,
    per_page: count,
  })

  return response.data
    .filter((dependabotAlert) =>
      filterPackages(dependabotAlert, ignorePackages),
    )
    .map(toOrgAlert)
}
