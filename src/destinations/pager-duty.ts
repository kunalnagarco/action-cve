/* eslint-disable no-console */
import { Alert } from '../entities'
import { event } from '@pagerduty/pdjs'

export const sendAlertsToPagerDuty = async (
  routingKey: string,
  alerts: Alert[],
): Promise<void> => {
  const result = await event({
    data: {
      routing_key: routingKey,
      event_action: 'trigger',
      payload: {
        summary: `You have ${alerts.length} vulnerabilities in ${alerts[0].repository.owner}/${alerts[0].repository.name}`,
        source: 'GitHub Dependabot Alerts',
        severity: 'info',
        custom_details: { ...alerts },
      },
      images: [
        {
          src: 'https://github.com/kunalnagarco/action-cve/raw/main/icons/ladybug.png',
          alt: 'GitHub Action Icon',
          href: 'https://github.com/kunalnagarco/action-cve',
        },
      ],
    },
  })
  const response = result.response
  console.log(JSON.stringify(response.body))
  console.log(response.status, response.ok)
}
