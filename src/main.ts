import { getInput, setFailed } from '@actions/core'
import {
  sendAlertsToMicrosoftTeams,
  sendAlertsToPagerDuty,
  sendAlertsToSlack,
  sendAlertsToZenduty,
  validateSlackWebhookUrl,
} from './destinations'
import { context } from '@actions/github'
import { fetchAlerts } from './fetch-alerts'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const microsoftTeamsWebhookUrl = getInput('microsoft_teams_webhook')
    const slackWebhookUrl = getInput('slack_webhook')
    const pagerDutyIntegrationKey = getInput('pager_duty_integration_key')
    const zenDutyApiKey = getInput('zenduty_api_key')
    const zenDutyServiceId = getInput('zenduty_service_id')
    const zenDutyEscalationPolicyId = getInput('zenduty_escalation_policy_id')
    const count = parseInt(getInput('count'))
    const owner = context.repo.owner
    const repo = context.repo.repo
    const alerts = await fetchAlerts(token, repo, owner, count)
    if (alerts.length > 0) {
      if (microsoftTeamsWebhookUrl) {
        await sendAlertsToMicrosoftTeams(microsoftTeamsWebhookUrl, alerts)
      }
      if (slackWebhookUrl) {
        if (!validateSlackWebhookUrl(slackWebhookUrl)) {
          setFailed(new Error('Invalid Slack Webhook URL'))
        } else {
          await sendAlertsToSlack(slackWebhookUrl, alerts)
        }
      }
      if (pagerDutyIntegrationKey) {
        await sendAlertsToPagerDuty(pagerDutyIntegrationKey, alerts)
      }
      if (zenDutyApiKey) {
        if (zenDutyServiceId && zenDutyEscalationPolicyId) {
          await sendAlertsToZenduty(
            zenDutyApiKey,
            zenDutyServiceId,
            zenDutyEscalationPolicyId,
            alerts,
          )
        } else {
          setFailed(
            new Error('Check your Zenduty Service ID and Escalation Policy ID'),
          )
        }
      }
    }
  } catch (err) {
    if (err instanceof Error) {
      setFailed(err)
    }
  }
}

run()
