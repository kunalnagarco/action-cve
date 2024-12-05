import { Octokit } from '@octokit/rest'

import { Alert, toEnterpriseAlert, PackageCveMap } from '../entities'

import { filterPackages } from './filters'

export const fetchEnterpriseAlerts = async (
  gitHubPersonalAccessToken: string,
  enterprise: string,
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
  const response = await octokit.dependabot.listAlertsForEnterprise({
    enterprise,
    state: 'open',
    severity,
    ecosystem: ecosystem.length > 0 ? ecosystem : undefined,
    per_page: count,
  })

  return response.data
    .filter((dependabotAlert) =>
      filterPackages(dependabotAlert, ignorePackages),
    )
    .map(toEnterpriseAlert)
}
