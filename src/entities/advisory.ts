import { DependabotAlert } from './alert'

type SecurityAdvisory = DependabotAlert['security_advisory']

export interface Advisory {
  /**
   * The CVSS score associated with this advisory
   */
  cvssScore: number
  /**
   * The severity of the advisory
   */
  severity: AdvisorySeverity
  /**
   * A short plaintext summary of the advisory
   */
  summary: string
  /**
   * This is a long plaintext description of the advisory
   */
  description: string
  /**
   * The permalink for the advisory
   */
  url: string
  /**
   * When the advisory was published
   */
  publishedAt: string
  /**
   * When the advisory was last updated
   */
  updatedAt: string
  /**
   * When the advisory was withdrawn, if it has been withdrawn
   */
  withdrawnAt?: string
}

type AdvisorySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export const toAdvisory = (securityAdvisory: SecurityAdvisory): Advisory => ({
  cvssScore: securityAdvisory.cvss?.score || 0,
  severity:
    (securityAdvisory.severity?.toUpperCase() as AdvisorySeverity) || 'LOW',
  summary: securityAdvisory.summary,
  description: securityAdvisory.description || '',
  url: securityAdvisory.references[0].url,
  publishedAt: securityAdvisory.published_at || '',
  updatedAt: securityAdvisory.updated_at || '',
  withdrawnAt: securityAdvisory.withdrawn_at || '',
})
