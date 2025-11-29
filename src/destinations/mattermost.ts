import { request } from '../utils'
import { ACTION_ICON, ACTION_SHORT_SUMMARY } from '../constants'
import { Alert, getFullRepositoryNameFromAlert } from '../entities'

export const MAX_COUNT_MATTERMOST = 30

const createMaxAlertsMarkdownNotice = (): string =>
  `*Note:* Only ${MAX_COUNT_MATTERMOST} have been sent due to message length restrictions.`

interface MattermostAttachment {
  color?: string
  title?: string
  text?: string
  fields?: Array<{
    title: string
    value: string
    short?: boolean
  }>
  actions?: Array<{
    type: string
    name: string
    integration: {
      url: string
      context: any
    }
  }>
}

interface MattermostMessage {
  text?: string
  username?: string
  icon_url?: string
  attachments?: MattermostAttachment[]
}

const colorMap: Record<string, string> = {
  CRITICAL: 'danger',
  HIGH: 'danger',
  MEDIUM: 'warning',
  LOW: 'good',
  UNKNOWN: 'default',
}

const createAlertAttachment = (alert: Alert): MattermostAttachment => ({
  color: colorMap[alert.advisory?.severity?.toUpperCase() || 'UNKNOWN'],
  title: `${alert.packageName} - ${alert.advisory?.severity?.toUpperCase()} Severity`,
  fields: [
    {
      title: 'Package',
      value: alert.packageName,
      short: true,
    },
    {
      title: 'Repository',
      value: getFullRepositoryNameFromAlert(alert),
      short: true,
    },
    {
      title: 'Vulnerability Version Range',
      value: alert.vulnerability?.vulnerableVersionRange || 'N/A',
      short: true,
    },
    {
      title: 'Patched Version',
      value: alert.vulnerability?.firstPatchedVersion || 'N/A',
      short: true,
    },
    {
      title: 'Severity',
      value: alert.advisory?.severity || 'Unknown',
      short: true,
    },
    {
      title: 'Summary',
      value: alert.advisory?.summary || 'No summary available',
      short: false,
    },
  ],
  actions: alert.advisory?.url
    ? [
        {
          type: 'button',
          name: 'View Advisory',
          integration: {
            url: alert.advisory.url,
            context: {},
          },
        },
      ]
    : undefined,
})

export const validateMattermostWebhookUrl = (url: string): boolean => {
  const regexPattern = /^https:\/\/[^/]+\/hooks\/[a-zA-Z0-9]+$/
  return regexPattern.test(url)
}

export const sendAlertsToMattermost = async (
  webhookUrl: string,
  alerts: Alert[],
): Promise<void> => {
  const alertCount = alerts.length
  const repositoryOwner = alerts[0].repository.owner
  const repositoryName = alerts[0].repository.name

  const limitedAlerts = alerts.slice(0, MAX_COUNT_MATTERMOST)

  const attachments: MattermostAttachment[] = limitedAlerts.map(
    createAlertAttachment,
  )

  const message: MattermostMessage = {
    text: `You have ${alertCount} vulnerabilities in **${repositoryOwner}/${repositoryName}**.${
      alertCount > MAX_COUNT_MATTERMOST
        ? `\n${createMaxAlertsMarkdownNotice()}`
        : ''
    }`,
    username: ACTION_SHORT_SUMMARY,
    icon_url: ACTION_ICON,
    attachments,
  }

  await request(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}
