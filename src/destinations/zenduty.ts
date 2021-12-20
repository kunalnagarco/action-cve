/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable import/no-commonjs */
import { ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
const zenduty = require('zenduty-sdk')

export const sendAlertsToZenduty = async (
  apiKey: string,
  serviceId: string,
  escalationPolicyId: string,
  alerts: Alert[],
): Promise<void> => {
  console.log(zenduty)
  console.log(JSON.stringify(zenduty))
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
