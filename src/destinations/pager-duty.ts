import { ACTION_ICON, ACTION_SHORT_SUMMARY, ACTION_URL } from '../constants'
import { Alert } from '../entities'
import { event } from '@pagerduty/pdjs'

export const sendAlertsToPagerDuty = async (
  integrationKey: string,
  alerts: Alert[],
): Promise<void> => {
  await event({
    data: {
      routing_key: integrationKey,
      event_action: 'trigger',
      payload: {
        summary: `You have ${alerts.length} vulnerabilities in ${alerts[0].repository.owner}/${alerts[0].repository.name}`,
        source: 'GitHub Dependabot Alerts',
        severity: 'info',
        custom_details: { ...alerts },
      },
      images: [
        {
          src: ACTION_ICON,
          alt: ACTION_SHORT_SUMMARY,
          href: ACTION_URL,
        },
      ],
    },
  })
}
