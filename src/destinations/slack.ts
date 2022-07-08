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

      Nullam ornare lobortis augue, quis fringilla tellus aliquet vel. Donec ac tellus eros. Donec efficitur libero ut ipsum consectetur iaculis. Suspendisse potenti. Donec mollis vehicula mattis. Vivamus malesuada euismod turpis ac efficitur. Quisque commodo orci turpis, id blandit urna sodales eu. Maecenas accumsan posuere augue, ac pulvinar sem semper efficitur. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque viverra hendrerit tellus quis luctus.

      In condimentum condimentum nisl quis dapibus. Nunc feugiat nisi nec leo finibus efficitur. Etiam vitae viverra lorem, id ornare purus. Mauris sed eros auctor, varius ante sed, tincidunt tortor. Sed tincidunt fringilla lorem sit amet semper. Sed quis malesuada eros. Praesent ex turpis, semper vel ex non, scelerisque pharetra odio. Vivamus vulputate arcu nec mollis congue. Suspendisse quis risus finibus, molestie velit id, scelerisque est. Curabitur eu iaculis nunc. Nullam ac justo ac dolor gravida interdum. Phasellus non consequat lectus.

      Duis purus ante, accumsan sed justo ut, posuere mattis ipsum. Curabitur blandit non massa pellentesque rutrum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In quis felis nunc. Nam hendrerit urna vel felis malesuada mattis. Mauris congue ornare tellus, et accumsan leo fringilla sed. Fusce egestas aliquet lectus, euismod feugiat lectus tempus in. Nam eleifend lacus in velit tempor, rhoncus venenatis sem tempus. Donec vestibulum vestibulum euismod. Aliquam gravida tortor eget justo tempus tincidunt. Maecenas efficitur ut ex vel viverra.

      Ut quis sodales felis. Nullam id dolor rhoncus, placerat magna ac, egestas risus. Vivamus varius lacus vel erat sodales, quis tincidunt nisl viverra.
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
  // for (const alert of alerts) {
  for (let i = 0; i < 3; i++) {
    alertBlocks.push(createAlertBlock(alerts[i]))
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
