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
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sollicitudin, augue ac finibus tincidunt, diam quam tincidunt quam, id ultrices ligula lectus eget lectus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Curabitur ac tortor at orci ultrices molestie. Ut suscipit urna quis quam tristique, quis eleifend est semper. Morbi ut urna egestas ipsum efficitur sagittis eu at sapien. Duis convallis euismod ligula vel laoreet. Proin sed hendrerit justo. Curabitur fringilla porttitor diam id porttitor. Nunc ex magna, fringilla in nunc in, aliquet faucibus dolor. Etiam vitae ipsum malesuada, scelerisque enim quis, egestas risus. Suspendisse eget nunc vitae urna elementum feugiat. Vivamus scelerisque metus nec dui maximus, eu sagittis nunc consectetur. Aliquam a felis sit amet leo hendrerit gravida et imperdiet nulla. Cras facilisis eleifend metus, ac pellentesque tortor pulvinar nec. Mauris id gravida ante, eu bibendum nisi. Nunc gravida diam a lacus elementum mattis.
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
