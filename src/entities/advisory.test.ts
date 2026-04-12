import { describe, it, expect } from 'vitest'

import { toAdvisory } from './advisory'

const mockSecurityAdvisory = {
  cvss: { score: 9.8 },
  severity: 'critical',
  summary: 'Prototype Pollution',
  description: 'Affected versions of lodash are vulnerable',
  references: [{ url: 'https://github.com/advisories/GHSA-xyz' }],
  published_at: '2021-01-01T00:00:00Z',
  updated_at: '2021-01-02T00:00:00Z',
  withdrawn_at: null,
}

describe('toAdvisory', () => {
  it('maps all fields correctly', () => {
    const result = toAdvisory(mockSecurityAdvisory as any)
    expect(result.cvssScore).toBe(9.8)
    expect(result.severity).toBe('CRITICAL')
    expect(result.summary).toBe('Prototype Pollution')
    expect(result.description).toBe('Affected versions of lodash are vulnerable')
    expect(result.url).toBe('https://github.com/advisories/GHSA-xyz')
    expect(result.publishedAt).toBe('2021-01-01T00:00:00Z')
    expect(result.updatedAt).toBe('2021-01-02T00:00:00Z')
  })

  it('normalizes severity to uppercase', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, severity: 'high' } as any)
    expect(result.severity).toBe('HIGH')
  })

  it('defaults cvssScore to 0 when cvss is missing', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, cvss: null } as any)
    expect(result.cvssScore).toBe(0)
  })

  it('defaults severity to LOW when severity is missing', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, severity: null } as any)
    expect(result.severity).toBe('LOW')
  })

  it('returns empty string for url when references array is empty', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, references: [] } as any)
    expect(result.url).toBe('')
  })

  it('returns empty string for url when references is null', () => {
    const result = toAdvisory({ ...mockSecurityAdvisory, references: null } as any)
    expect(result.url).toBe('')
  })
})
