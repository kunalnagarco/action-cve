import { ACTION_ICON, ACTION_SHORT_SUMMARY } from '../constants'
import { Alert } from '../entities'
import { IncomingWebhook } from '@slack/webhook'
import { KnownBlock } from '@slack/types'

const createSummaryBlock = (
  alertCount: number,
  repositoryName: string,
  repositoryOwner: string,
): KnownBlock => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `You have ${alertCount} vulnerabilities in *${repositoryOwner}/${repositoryName}*`,
    },
  }
}

const createDividerBlock = (): KnownBlock => {
  return {
    type: 'divider',
  }
}

const createAlertBlock = (alert: Alert): KnownBlock => {
  return {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `
*Package name:* ${alert.packageName}
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
  }
}

export const validateSlackWebhookUrl = (url: string): boolean => {
  const regexPattern = new RegExp(
    /^https:\/\/hooks\.slack\.com\/services\/T[a-zA-Z0-9_]{8,10}\/B[a-zA-Z0-9_]{10}\/[a-zA-Z0-9_]{24}/,
  )
  return regexPattern.test(url)
}

export const sendAlertsToSlack = async (
  webhookUrl: string,
  alerts: Alert[],
): Promise<void> => {
  const webhook = new IncomingWebhook(webhookUrl)
  const alertBlocks: KnownBlock[] = []
  for (const alert of alerts) {
    alertBlocks.push(createAlertBlock(alert))
  }
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
