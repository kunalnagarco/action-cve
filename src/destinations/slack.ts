import { IncomingWebhook } from '@slack/webhook'
import { KnownBlock } from '@slack/types'

import { ACTION_ICON, ACTION_SHORT_SUMMARY } from '../constants'
import { Alert, getFullRepositoryNameFromAlert } from '../entities'

export const MAX_COUNT_SLACK = 30

const createMaxAlertsMarkdownNotice = (): string =>
  `*Note:* Only ${MAX_COUNT_SLACK} have been sent due to message length restrictions.`

const createSummaryBlock = (
  alertCount: number,
  repositoryName: string,
  repositoryOwner: string,
): KnownBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `
        You have ${alertCount} vulnerabilities in *${repositoryOwner}/${repositoryName}*.
${alertCount > MAX_COUNT_SLACK ? createMaxAlertsMarkdownNotice() : ''}
      `,
  },
})

const createDividerBlock = (): KnownBlock => ({
  type: 'divider',
})

const createAlertBlock = (alert: Alert): KnownBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text: `
*Package:* ${alert.packageName}
*Repository:* ${getFullRepositoryNameFromAlert(alert)}
*Vulnerability Version Range:* ${alert.vulnerability?.vulnerableVersionRange}
*Patched Version:* ${alert.vulnerability?.firstPatchedVersion}
*Severity:* ${alert.advisory?.severity}
*Summary:* ${alert.advisory?.summary}
            `,
  },
  accessory: {
    type: 'button',
    text: {
      type: 'plain_text',
      text: 'View Advisory',
      emoji: true,
    },
    style: 'danger',
    url: alert.advisory?.url,
  },
})

export const validateSlackWebhookUrl = (url: string): boolean => {
  const regexPattern =
    /^https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8,10}\/B[a-zA-Z0-9_]{10}\/[a-zA-Z0-9_]{24}/
  return regexPattern.test(url)
}

export const sendAlertsToSlack = async (
  webhookUrl: string,
  alerts: Alert[],
): Promise<void> => {
  const webhook = new IncomingWebhook(webhookUrl)
  const alertBlocks: KnownBlock[] = []
  alerts.forEach((alert) => {
    alertBlocks.push(createAlertBlock(alert))
  })
  await webhook.send({
    blocks: [
      createSummaryBlock(
        alerts.length,
        alerts[0].repository.name,
        alerts[0].repository.owner,
      ),
      createDividerBlock(),
      ...alertBlocks,
    ],
    icon_url: ACTION_ICON,
    username: ACTION_SHORT_SUMMARY,
  })
}
