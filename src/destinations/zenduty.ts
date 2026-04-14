import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert, getFullRepositoryNameFromAlert } from '../entities'
import { request } from '../utils'

const buildSummary = (alerts: Alert[]): string => {
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
  return summary
}

export const sendAlertsToZendutyViaIntegration = async (
  integrationKey: string,
  alerts: Alert[],
): Promise<void> => {
  if (alerts.length === 0) return
  await request(`https://events.zenduty.com/api/events/${integrationKey}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `${ACTION_SHORT_SUMMARY} - ${alerts[0].repository.name}`,
      alert_type: 'critical',
      summary: buildSummary(alerts),
      payload: { alerts },
    }),
  })
}

export const sendAlertsToZenduty = async (
  apiKey: string,
  serviceId: string,
  escalationPolicyId: string,
  alerts: Alert[],
): Promise<void> => {
  if (alerts.length === 0) return
  await request('https://www.zenduty.com/api/incidents/', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service: serviceId,
      escalation_policy: escalationPolicyId,
      title: `${ACTION_SHORT_SUMMARY} - ${alerts[0].repository.name}`,
      urgency: 0,
      summary: buildSummary(alerts),
    }),
  })
}
