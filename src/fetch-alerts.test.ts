import { describe, it, expect, vi, beforeEach } from 'vitest'

import { fetchRepositoryAlerts, fetchOrgAlerts, fetchEnterpriseAlerts } from './fetch-alerts'

const mockRawAlert = {
  security_vulnerability: {
    package: { name: 'lodash' },
    first_patched_version: { identifier: '4.17.21' },
    vulnerable_version_range: '< 4.17.21',
  },
  security_advisory: {
    cvss: { score: 9.8 },
    severity: 'critical',
    summary: 'Prototype Pollution',
    description: 'Affected versions of lodash are vulnerable',
    references: [{ url: 'https://github.com/advisories/GHSA-xyz' }],
    published_at: '2021-01-01T00:00:00Z',
    updated_at: '2021-01-02T00:00:00Z',
    withdrawn_at: null,
  },
  created_at: '2021-01-01T00:00:00Z',
}

const mockRawOrgEnterpriseAlert = {
  ...mockRawAlert,
  repository: { name: 'my-repo', owner: { login: 'my-org' } },
}

const mockListAlertsForRepo = vi.hoisted(() => vi.fn())
const mockListAlertsForOrg = vi.hoisted(() => vi.fn())
const mockListAlertsForEnterprise = vi.hoisted(() => vi.fn())

vi.mock('@octokit/rest', () => ({
  Octokit: vi.fn().mockImplementation(function () {
    return {
      dependabot: {
        listAlertsForRepo: mockListAlertsForRepo,
        listAlertsForOrg: mockListAlertsForOrg,
        listAlertsForEnterprise: mockListAlertsForEnterprise,
      },
    }
  }),
}))

beforeEach(() => {
  mockListAlertsForRepo.mockResolvedValue({ data: [mockRawAlert] })
  mockListAlertsForOrg.mockResolvedValue({ data: [mockRawOrgEnterpriseAlert] })
  mockListAlertsForEnterprise.mockResolvedValue({ data: [mockRawOrgEnterpriseAlert] })
})

describe('fetchRepositoryAlerts', () => {
  it('returns mapped alerts', async () => {
    const alerts = await fetchRepositoryAlerts('token', 'my-repo', 'my-org', '', '', 20)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].packageName).toBe('lodash')
    expect(alerts[0].repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('passes ecosystem as undefined when empty', async () => {
    await fetchRepositoryAlerts('token', 'my-repo', 'my-org', '', '', 20)
    expect(mockListAlertsForRepo).toHaveBeenCalledWith(
      expect.objectContaining({ ecosystem: undefined }),
    )
  })

  it('passes ecosystem when provided', async () => {
    await fetchRepositoryAlerts('token', 'my-repo', 'my-org', '', 'npm', 20)
    expect(mockListAlertsForRepo).toHaveBeenCalledWith(
      expect.objectContaining({ ecosystem: 'npm' }),
    )
  })

  it('passes count as per_page', async () => {
    await fetchRepositoryAlerts('token', 'my-repo', 'my-org', '', '', 5)
    expect(mockListAlertsForRepo).toHaveBeenCalledWith(
      expect.objectContaining({ per_page: 5 }),
    )
  })
})

describe('fetchOrgAlerts', () => {
  it('returns mapped alerts', async () => {
    const alerts = await fetchOrgAlerts('token', 'my-org', '', '', 20)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].packageName).toBe('lodash')
    expect(alerts[0].repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('passes ecosystem as undefined when empty', async () => {
    await fetchOrgAlerts('token', 'my-org', '', '', 20)
    expect(mockListAlertsForOrg).toHaveBeenCalledWith(
      expect.objectContaining({ ecosystem: undefined }),
    )
  })
})

describe('fetchEnterpriseAlerts', () => {
  it('returns mapped alerts', async () => {
    const alerts = await fetchEnterpriseAlerts('token', 'my-enterprise', '', '', 20)
    expect(alerts).toHaveLength(1)
    expect(alerts[0].packageName).toBe('lodash')
  })

  it('passes ecosystem as undefined when empty', async () => {
    await fetchEnterpriseAlerts('token', 'my-enterprise', '', '', 20)
    expect(mockListAlertsForEnterprise).toHaveBeenCalledWith(
      expect.objectContaining({ ecosystem: undefined }),
    )
  })
})
