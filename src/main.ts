/* eslint-disable no-console */
import { getInput, setFailed } from '@actions/core'
import { sendAlertsToSlack, validateSlackWebhookUrl } from './destinations'
// import { context } from '@actions/github'
import { fetchAlerts } from './fetch-alerts'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const slackWebhookUrl = getInput('slack_webhook')
    const count = parseInt(getInput('count'))
    const owner = 'kunalnagar'
    const repo = 'cve-base'
    const alerts = await fetchAlerts(token, repo, owner, count)
    if (alerts.length > 0) {
      if (slackWebhookUrl) {
        const result = validateSlackWebhookUrl(slackWebhookUrl)
        console.log(result)
        if (!result) {
          setFailed(new Error('Invalid Slack Webhook URL'))
        } else {
          await sendAlertsToSlack(slackWebhookUrl, alerts)
        }
      }
    }
  } catch (err) {
    setFailed(err)
  }
}

run()
