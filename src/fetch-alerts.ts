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
  count: number,
): Promise<Alert[] | []> => {
  const octokit = new Octokit({
    auth: gitHubPersonalAccessToken,
    request: {
      fetch,
    },
  })
  let response;
  try {
    response = await octokit.dependabot.listAlertsForRepo({
      owner: repositoryOwner,
      repo: repositoryName,
      state: 'open',
      severity,
      ecosystem: ecosystem.length > 0 ? ecosystem : undefined,
      per_page: count,
    })
  } catch (error) {
    console.error("Error fetching repository alerts", error);
    return [];
  }
  const alerts: Alert[] = response.data.map((dependabotAlert) =>
    toRepositoryAlert(dependabotAlert, repositoryName, repositoryOwner),
  )
  return alerts
}

export const fetchOrgAlerts = async (
  gitHubPersonalAccessToken: string,
  org: string,
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
  let response;
  try {
    response = await octokit.dependabot.listAlertsForOrg({
      org,
      state: 'open',
      severity,
      ecosystem: ecosystem.length > 0 ? ecosystem : undefined,
      per_page: count,
    })
  } catch (error) {
    console.error("Error fetching org alerts", error);
    return [];
  }
  const alerts: Alert[] = response.data.map((dependabotOrgAlert) =>
    toOrgAlert(dependabotOrgAlert),
  )
  return alerts
}

export const fetchEnterpriseAlerts = async (
  gitHubPersonalAccessToken: string,
  enterprise: string,
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
  let response;
  try {
    response = await octokit.dependabot.listAlertsForEnterprise({
      enterprise,
      state: 'open',
      severity,
      ecosystem: ecosystem.length > 0 ? ecosystem : undefined,
      per_page: count,
    })
  } catch(error) {
    console.error("Error fetching enterprise alerts", error);
    return [];
  }
  const alerts: Alert[] = response.data.map((dependabotEnterpriseAlert) =>
    toEnterpriseAlert(dependabotEnterpriseAlert),
  )
  return alerts
}
