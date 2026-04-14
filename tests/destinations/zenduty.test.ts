import { describe, it, expect, vi, beforeEach } from 'vitest'

import { Alert } from '../../src/entities'
import { request } from '../../src/utils'
import { sendAlertsToZenduty, sendAlertsToZendutyViaIntegration } from '../../src/destinations/zenduty'

vi.mock('../../src/utils', () => ({
  request: vi.fn().mockResolvedValue(undefined),
}))

const mockRequest = vi.mocked(request)

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

describe('sendAlertsToZendutyViaIntegration', () => {
  beforeEach(() => mockRequest.mockClear())

  it('does nothing when alerts array is empty', async () => {
    await sendAlertsToZendutyViaIntegration('int-key', [])
    expect(mockRequest).not.toHaveBeenCalled()
  })

  it('posts to the Zenduty events endpoint with the integration key in the URL', async () => {
    await sendAlertsToZendutyViaIntegration('int-key', [mockAlert])
    expect(mockRequest).toHaveBeenCalledWith(
      'https://events.zenduty.com/api/events/int-key/',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('sends no Authorization header', async () => {
    await sendAlertsToZendutyViaIntegration('int-key', [mockAlert])
    const options = mockRequest.mock.calls[0][1]
    expect((options!.headers as Record<string, string>).Authorization).toBeUndefined()
  })

  it('sets alert_type to critical', async () => {
    await sendAlertsToZendutyViaIntegration('int-key', [mockAlert])
    const body = JSON.parse(mockRequest.mock.calls[0][1]!.body as string)
    expect(body.alert_type).toBe('critical')
  })

  it('includes package and severity in the summary', async () => {
    await sendAlertsToZendutyViaIntegration('int-key', [mockAlert])
    const body = JSON.parse(mockRequest.mock.calls[0][1]!.body as string)
    expect(body.summary).toContain('lodash')
    expect(body.summary).toContain('CRITICAL')
  })
})

describe('sendAlertsToZenduty', () => {
  it('does nothing when alerts array is empty', async () => {
    await sendAlertsToZenduty('api-key', 'svc-id', 'policy-id', [])
    expect(mockRequest).not.toHaveBeenCalled()
  })

  it('posts to the Zenduty incidents endpoint', async () => {
    await sendAlertsToZenduty('api-key', 'svc-id', 'policy-id', [mockAlert])
    expect(mockRequest).toHaveBeenCalledWith(
      'https://www.zenduty.com/api/incidents/',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('includes the service and escalation policy in the payload', async () => {
    await sendAlertsToZenduty('api-key', 'svc-id', 'policy-id', [mockAlert])
    const options = mockRequest.mock.calls[0][1]
    const body = JSON.parse(options!.body as string)
    expect(body.service).toBe('svc-id')
    expect(body.escalation_policy).toBe('policy-id')
  })

  it('sets the Authorization header with the api key', async () => {
    await sendAlertsToZenduty('api-key', 'svc-id', 'policy-id', [mockAlert])
    const options = mockRequest.mock.calls[0][1]
    expect((options!.headers as Record<string, string>).Authorization).toBe('Token api-key')
  })

  it('includes package and severity in the summary', async () => {
    await sendAlertsToZenduty('api-key', 'svc-id', 'policy-id', [mockAlert])
    const options = mockRequest.mock.calls[0][1]
    const body = JSON.parse(options!.body as string)
    expect(body.summary).toContain('lodash')
    expect(body.summary).toContain('CRITICAL')
  })
})
