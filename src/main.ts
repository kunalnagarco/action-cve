import { getInput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { sendAlertsToSlack } from './destinations'
import { fetchAlerts } from './fetchAlerts'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const slackWebhookUrl = getInput('slack_webhook')
    const owner = context.repo.owner
    const repo = context.repo.repo
    const alerts = await fetchAlerts(token, repo, owner)
    if (alerts.length > 0) {
      if (slackWebhookUrl) {
        await sendAlertsToSlack(slackWebhookUrl, alerts)
      }
    }
  } catch (err) {
    setFailed(err)
  }
}

run()
