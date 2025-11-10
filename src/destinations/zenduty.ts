import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert, getFullRepositoryNameFromAlert } from '../entities'
import { request } from '../utils'

export const sendAlertsToZenduty = async (
  zenDutyIntegrationKey: string,
  alerts: Alert[],
): Promise<void> => {
  let summary = `
    You have ${alerts.length} vulnerabilities in ${alerts[0].repository.owner}/${alerts[0].repository.name}

    ---

  `
  alerts.forEach((alert) => {
    summary += `
      Package: ${alert.packageName}
      Repository: ${getFullRepositoryNameFromAlert(alert)}
      Vulnerability Version Range: ${alert.vulnerability?.vulnerableVersionRange}
      Patched Version: ${alert.vulnerability?.firstPatchedVersion}
      Severity: ${alert.advisory?.severity}
      Summary: ${alert.advisory?.summary}
    `
  })

  summary += `

    ---
  `
  const payload = {
    alert_type: "critical",
    message: `${ACTION_SHORT_SUMMARY} - ${alerts[0].repository.name}` ,
    summary: summary,
  }
  await request('https://www.zenduty.com/api/events/${zenDutyIntegrationKey}/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
