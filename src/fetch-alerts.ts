import { Octokit } from '@octokit/rest'

import {
  Alert,
  toRepositoryAlert,
  toOrgAlert,
  toEnterpriseAlert,
} from './entities'

export const fetchRepositoryAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  severity: string,
  ecosystem: string,
  ignoreDependencies: string[],
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
  const alerts: Alert[] = response
                            .data
                            .filter((dependabotAlert) =>
                              !ignoreDependencies.includes(dependabotAlert.security_vulnerability.package.name)
                            )
                            .map((dependabotAlert) =>
                              toRepositoryAlert(dependabotAlert, repositoryName, repositoryOwner),
                            )
  return alerts
}

export const fetchOrgAlerts = async (
  gitHubPersonalAccessToken: string,
  org: string,
  severity: string,
  ecosystem: string,
  ignoreDependencies: string[],
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
  const alerts: Alert[] = response
                            .data
                            .filter((dependabotOrgAlert) =>
                              !ignoreDependencies.includes(dependabotOrgAlert.security_vulnerability.package.name)
                            )
                            .map((dependabotOrgAlert) =>
                              toOrgAlert(dependabotOrgAlert),
                            )
  return alerts
}

export const fetchEnterpriseAlerts = async (
  gitHubPersonalAccessToken: string,
  enterprise: string,
  severity: string,
  ecosystem: string,
  ignoreDependencies: string[],
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
  const alerts: Alert[] = response
                            .data
                            .filter((dependabotEnterpriseAlert) =>
                              !ignoreDependencies.includes(dependabotEnterpriseAlert.security_vulnerability.package.name)
                            )
                            .map((dependabotEnterpriseAlert) =>
                              toEnterpriseAlert(dependabotEnterpriseAlert),
                            )
  return alerts
}
