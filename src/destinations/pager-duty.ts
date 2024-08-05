import { event } from '@pagerduty/pdjs'

import { ACTION_ICON, ACTION_SHORT_SUMMARY, ACTION_URL } from '../constants'
import { Alert } from '../entities'

export const sendAlertsToPagerDuty = async (
  integrationKey: string,
  alerts: Alert[],
): Promise<void> => {
  await event({
    data: {
      routing_key: integrationKey,
      event_action: 'trigger',
      payload: {
        summary: `You have ${alerts.length} vulnerabilities`,
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
