import * as zenduty from 'zenduty-sdk'
import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'

export const sendAlertsToZenduty = async (
  apiKey: string,
  serviceId: string,
  escalationPolicyId: string,
  alerts: Alert[],
): Promise<void> => {
  const apiObject = zenduty.IncidentsApi(zenduty.ApiClient(apiKey))
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
  await apiObject.create_incident(payload)
}