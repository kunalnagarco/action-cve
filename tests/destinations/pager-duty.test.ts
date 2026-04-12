import { describe, it, expect, vi } from 'vitest'

import { ACTION_ICON, ACTION_SHORT_SUMMARY, ACTION_URL } from '../../src/constants'
import { Alert } from '../../src/entities'

import { sendAlertsToPagerDuty } from '../../src/destinations/pager-duty'

const mockEvent = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))

vi.mock('@pagerduty/pdjs', () => ({
  event: mockEvent,
}))

const mockAlert: Alert = {
  repository: { name: 'my-repo', owner: 'my-org' },
  packageName: 'lodash',
  advisory: {
    cvssScore: 9.8,
    severity: 'CRITICAL',
    summary: 'Prototype Pollution',
    description: 'Affected versions of lodash are vulnerable',
    url: 'https://github.com/advisories/GHSA-xyz',
    publishedAt: '2021-01-01T00:00:00Z',
    updatedAt: '2021-01-02T00:00:00Z',
  },
  vulnerability: {
    firstPatchedVersion: '4.17.21',
    vulnerableVersionRange: '< 4.17.21',
  },
  createdAt: '2021-01-01T00:00:00Z',
}

describe('sendAlertsToPagerDuty', () => {
  it('calls event() with the integration key as routing_key', async () => {
    await sendAlertsToPagerDuty('my-integration-key', [mockAlert])
    const { data } = mockEvent.mock.calls[0][0]
    expect(data.routing_key).toBe('my-integration-key')
  })

  it('sets event_action to trigger', async () => {
    await sendAlertsToPagerDuty('key', [mockAlert])
    const { data } = mockEvent.mock.calls[0][0]
    expect(data.event_action).toBe('trigger')
  })

  it('includes the alert count in the payload summary', async () => {
    await sendAlertsToPagerDuty('key', [mockAlert, mockAlert])
    const { data } = mockEvent.mock.calls[0][0]
    expect(data.payload.summary).toContain('2')
  })

  it('includes the action icon image', async () => {
    await sendAlertsToPagerDuty('key', [mockAlert])
    const { data } = mockEvent.mock.calls[0][0]
    expect(data.images[0]).toEqual({
      src: ACTION_ICON,
      alt: ACTION_SHORT_SUMMARY,
      href: ACTION_URL,
    })
  })
})
