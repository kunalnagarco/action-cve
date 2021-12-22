import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
import { request } from '../utils'

export const sendAlertsToZenduty = async (
  apiKey: string,
  serviceId: string,
  escalationPolicyId: string,
  alerts: Alert[],
): Promise<void> => {
  let summary = `
    You have ${alerts.length} vulnerabilities in ${alerts[0].repository.owner}/${alerts[0].repository.name}

    ---

  `
  for (const alert of alerts) {
    summary += `
      Package name: ${alert.packageName}
      Vulnerability Version Range: ${alert.vulnerability?.vulnerableVersionRange}
      Patched Version: ${alert.vulnerability?.firstPatchedVersion}
      Severity: ${alert.advisory?.severity}
      Summary: ${alert.advisory?.summary}
    `
  }

  summary += `

    ---
  `
  const payload = {
    service: serviceId,
    escalation_policy: escalationPolicyId,
    title: `${ACTION_SHORT_SUMMARY} - ${alerts[0].repository.name}`,
    urgency: 0,
    summary,
  }
  // eslint-disable-next-line i18n-text/no-en
  const bearer = `Token ${apiKey}`
  await request('https://www.zenduty.com/api/incidents/', {
    method: 'POST',
    headers: {
      Authorization: bearer,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
