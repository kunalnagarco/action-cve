import { SecurityAdvisory } from '@octokit/graphql-schema'

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

type AdvisorySeverity = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'

export const toAdvisory = (securityAdvisory: SecurityAdvisory): Advisory => ({
  cvssScore: securityAdvisory.cvss.score,
  severity: securityAdvisory.severity,
  summary: securityAdvisory.summary,
  description: securityAdvisory.description,
  url: securityAdvisory.permalink,
  publishedAt: securityAdvisory.publishedAt,
  updatedAt: securityAdvisory.updatedAt,
  withdrawnAt: securityAdvisory.withdrawnAt,
})
