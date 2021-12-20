import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
import fetch from 'unfetch'

export const sendAlertsToZenduty = async (
  apiKey: string,
  serviceId: string,
  escalationPolicyId: string,
  alerts: Alert[],
): Promise<void> => {
  const payload = {
    service: serviceId,
    escalation_policy: escalationPolicyId,
    user: null,
    title: `${ACTION_SHORT_SUMMARY} - ${alerts[0].repository.name}`,
    summary: `
      You have ${alerts.length} vulnerabilities in ${
      alerts[0].repository.owner
    }/${alerts[0].repository.name}

      ${{ ...alerts }}
    `,
  }
  // eslint-disable-next-line i18n-text/no-en
  const bearer = `Bearer ${apiKey}`
  fetch('https://www.zenduty.com/api/incidents', {
    method: 'POST',
    headers: {
      Authorization: bearer,
    },
    body: JSON.stringify(payload),
  })
}
