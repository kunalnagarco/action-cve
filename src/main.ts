/* eslint-disable @typescript-eslint/no-unused-vars */
import { getInput, setFailed } from '@actions/core'
import { getOctokit } from '@actions/github'
import { sendAlertsToSlack } from './destinations'
import { fetchAlerts } from './fetchAlerts'

async function run(): Promise<void> {
  try {
    const token = getInput('token')
    const webhookUrl = getInput('slack_webhook')
    const octokit = getOctokit(token)
    // const owner = context.repo.owner
    const owner = 'kunalnagarco'
    // const repo = context.repo.repo
    const repo = 'cve-base'
    const alerts = await fetchAlerts(token, repo, owner)
    await sendAlertsToSlack(webhookUrl, alerts)
  } catch (err) {
    setFailed(err)
  }
}

run()
