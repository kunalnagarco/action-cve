import { describe, it, expect, vi } from 'vitest'

import { sendAlertsToZenduty } from './zenduty'
import { request } from '../utils'
import { Alert } from '../entities'

vi.mock('../utils', () => ({
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
