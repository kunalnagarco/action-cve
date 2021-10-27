import { getInput, setFailed, info } from '@actions/core'
import {
  sendAlertsToPagerDuty,
  sendAlertsToSlack,
  validateSlackWebhookUrl,
} from './destinations'
import { context } from '@actions/github'
import { fetchAlerts } from './fetch-alerts'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const slackWebhookUrl = getInput('slack_webhook')
    const pagerDutyIntegrationKey = getInput('pager_duty_integration_key')
    const repos = JSON.parse(getInput('list_repos'))
    core.info(repos)
    const count = parseInt(getInput('count'))
    const owner = context.repo.owner
    for (var val of repos) {
      const repo = val
      const alerts = await fetchAlerts(token, repo, owner, count)
      core.info(token + " " + repo + " " owner + " " + count )
      core.info(alerts)
      if (alerts.length > 0) {
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
    }
    
    }
  } catch (err) {
    if (err instanceof Error) {
      setFailed(err)
    }
  }
}

run()
