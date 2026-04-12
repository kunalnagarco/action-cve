import { describe, it, expect } from 'vitest'

import { toRepositoryAlert, toOrgAlert, toEnterpriseAlert } from './alert'
import { getFullRepositoryNameFromAlert } from './repository'

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
  repository: {
    name: 'my-repo',
    owner: { login: 'my-org' },
  },
}

describe('toRepositoryAlert', () => {
  it('maps repository name and owner from parameters', () => {
    const result = toRepositoryAlert(mockRawAlert as any, 'my-repo', 'my-org')
    expect(result.repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('maps packageName from security_vulnerability', () => {
    const result = toRepositoryAlert(mockRawAlert as any, 'my-repo', 'my-org')
    expect(result.packageName).toBe('lodash')
  })

  it('maps advisory and vulnerability fields', () => {
    const result = toRepositoryAlert(mockRawAlert as any, 'my-repo', 'my-org')
    expect(result.advisory?.severity).toBe('CRITICAL')
    expect(result.advisory?.url).toBe('https://github.com/advisories/GHSA-xyz')
    expect(result.vulnerability?.firstPatchedVersion).toBe('4.17.21')
    expect(result.vulnerability?.vulnerableVersionRange).toBe('< 4.17.21')
  })

  it('maps createdAt', () => {
    const result = toRepositoryAlert(mockRawAlert as any, 'my-repo', 'my-org')
    expect(result.createdAt).toBe('2021-01-01T00:00:00Z')
  })
})

describe('toOrgAlert', () => {
  it('maps repository name and owner from the alert payload', () => {
    const result = toOrgAlert(mockRawOrgEnterpriseAlert as any)
    expect(result.repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('maps packageName and advisory fields', () => {
    const result = toOrgAlert(mockRawOrgEnterpriseAlert as any)
    expect(result.packageName).toBe('lodash')
    expect(result.advisory?.severity).toBe('CRITICAL')
  })
})

describe('toEnterpriseAlert', () => {
  it('maps repository name and owner from the alert payload', () => {
    const result = toEnterpriseAlert(mockRawOrgEnterpriseAlert as any)
    expect(result.repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('maps packageName and advisory fields', () => {
    const result = toEnterpriseAlert(mockRawOrgEnterpriseAlert as any)
    expect(result.packageName).toBe('lodash')
    expect(result.advisory?.severity).toBe('CRITICAL')
  })
})

describe('getFullRepositoryNameFromAlert', () => {
  it('returns owner/name format', () => {
    const alert = toRepositoryAlert(mockRawAlert as any, 'my-repo', 'my-org')
    expect(getFullRepositoryNameFromAlert(alert)).toBe('my-org/my-repo')
  })
})
