import { describe, it, expect } from 'vitest'

import { DependabotAlert } from '../../src/entities/alert'
import { toAdvisory } from '../../src/entities/advisory'

type SecurityAdvisory = DependabotAlert['security_advisory']

const mockSecurityAdvisory: SecurityAdvisory = {
  ghsa_id: 'GHSA-xyz',
  cve_id: null,
  summary: 'Prototype Pollution',
  description: 'Affected versions of lodash are vulnerable',
  severity: 'critical',
  cvss: { score: 9.8, vector_string: 'CVSS:3.1/AV:N' },
  cwes: [],
  identifiers: [],
  references: [{ url: 'https://github.com/advisories/GHSA-xyz' }],
  published_at: '2021-01-01T00:00:00Z',
  updated_at: '2021-01-02T00:00:00Z',
  withdrawn_at: null,
  vulnerabilities: [],
  cvss_severities: {},
}

describe('toAdvisory', () => {
  it('maps all fields correctly', () => {
    const result = toAdvisory(mockSecurityAdvisory)
    expect(result.cvssScore).toBe(9.8)
    expect(result.severity).toBe('CRITICAL')
    expect(result.summary).toBe('Prototype Pollution')
    expect(result.description).toBe('Affected versions of lodash are vulnerable')
    expect(result.url).toBe('https://github.com/advisories/GHSA-xyz')
    expect(result.publishedAt).toBe('2021-01-01T00:00:00Z')
    expect(result.updatedAt).toBe('2021-01-02T00:00:00Z')
  })

  it('normalizes severity to uppercase', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, severity: 'high' })
    expect(result.severity).toBe('HIGH')
  })

  it('defaults cvssScore to 0 when cvss is missing', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, cvss: { score: 0, vector_string: null } })
    expect(result.cvssScore).toBe(0)
  })

  it('defaults severity to LOW when severity is missing', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, severity: null })
    expect(result.severity).toBe('LOW')
  })

  it('returns empty string for url when references array is empty', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, references: [] })
    expect(result.url).toBe('')
  })

  it('returns empty string for url when references is null', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, references: null as unknown as [] })
    expect(result.url).toBe('')
  })
})
