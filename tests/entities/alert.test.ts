import { describe, it, expect } from 'vitest'

import {
  DependabotAlert,
  DependabotOrgAlert,
  DependabotEnterpriseAlert,
  toRepositoryAlert,
  toOrgAlert,
  toEnterpriseAlert,
} from '../../src/entities/alert'
import { getFullRepositoryNameFromAlert } from '../../src/entities/repository'

const mockRawAlert: DependabotAlert = {
  number: 1,
  state: 'open',
  dependency: {
    package: { ecosystem: 'npm', name: 'lodash' },
    manifest_path: 'package.json',
    scope: 'runtime',
  },
  security_advisory: {
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
  },
  security_vulnerability: {
    package: { ecosystem: 'npm', name: 'lodash' },
    severity: 'critical',
    vulnerable_version_range: '< 4.17.21',
    first_patched_version: { identifier: '4.17.21' },
  },
  url: 'https://api.github.com/repos/my-org/my-repo/dependabot/alerts/1',
  html_url: 'https://github.com/my-org/my-repo/security/dependabot/1',
  created_at: '2021-01-01T00:00:00Z',
  updated_at: '2021-01-02T00:00:00Z',
  dismissed_at: null,
  dismissed_by: null,
  dismissed_reason: null,
  dismissed_comment: null,
  fixed_at: null,
  auto_dismissed_at: null,
}

const mockRawOrgAlert: DependabotOrgAlert = {
  ...mockRawAlert,
  repository: {
    id: 1,
    node_id: 'abc',
    name: 'my-repo',
    full_name: 'my-org/my-repo',
    private: false,
    owner: {
      login: 'my-org',
      id: 1,
      node_id: 'abc',
      avatar_url: '',
      gravatar_id: '',
      url: '',
      html_url: '',
      followers_url: '',
      following_url: '',
      gists_url: '',
      starred_url: '',
      subscriptions_url: '',
      organizations_url: '',
      repos_url: '',
      events_url: '',
      received_events_url: '',
      type: 'Organization',
      site_admin: false,
      user_view_type: 'public',
    },
    html_url: '',
    description: null,
    fork: false,
    url: '',
    forks_url: '',
    keys_url: '',
    collaborators_url: '',
    teams_url: '',
    hooks_url: '',
    issue_events_url: '',
    events_url: '',
    assignees_url: '',
    branches_url: '',
    tags_url: '',
    blobs_url: '',
    git_tags_url: '',
    git_refs_url: '',
    trees_url: '',
    statuses_url: '',
    languages_url: '',
    stargazers_url: '',
    contributors_url: '',
    subscribers_url: '',
    subscription_url: '',
    commits_url: '',
    git_commits_url: '',
    comments_url: '',
    issue_comment_url: '',
    contents_url: '',
    compare_url: '',
    merges_url: '',
    archive_url: '',
    downloads_url: '',
    issues_url: '',
    pulls_url: '',
    milestones_url: '',
    notifications_url: '',
    labels_url: '',
    releases_url: '',
    deployments_url: '',
  },
}

const mockRawEnterpriseAlert: DependabotEnterpriseAlert = mockRawOrgAlert

describe('toRepositoryAlert', () => {
  it('maps repository name and owner from parameters', () => {
    const result = toRepositoryAlert(mockRawAlert, 'my-repo', 'my-org')
    expect(result.repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('maps packageName from security_vulnerability', () => {
    const result = toRepositoryAlert(mockRawAlert, 'my-repo', 'my-org')
    expect(result.packageName).toBe('lodash')
  })

  it('maps advisory and vulnerability fields', () => {
    const result = toRepositoryAlert(mockRawAlert, 'my-repo', 'my-org')
    expect(result.advisory?.severity).toBe('CRITICAL')
    expect(result.advisory?.url).toBe('https://github.com/advisories/GHSA-xyz')
    expect(result.vulnerability?.firstPatchedVersion).toBe('4.17.21')
    expect(result.vulnerability?.vulnerableVersionRange).toBe('< 4.17.21')
  })

  it('maps createdAt', () => {
    const result = toRepositoryAlert(mockRawAlert, 'my-repo', 'my-org')
    expect(result.createdAt).toBe('2021-01-01T00:00:00Z')
  })
})

describe('toOrgAlert', () => {
  it('maps repository name and owner from the alert payload', () => {
    const result = toOrgAlert(mockRawOrgAlert)
    expect(result.repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('maps packageName and advisory fields', () => {
    const result = toOrgAlert(mockRawOrgAlert)
    expect(result.packageName).toBe('lodash')
    expect(result.advisory?.severity).toBe('CRITICAL')
  })
})

describe('toEnterpriseAlert', () => {
  it('maps repository name and owner from the alert payload', () => {
    const result = toEnterpriseAlert(mockRawEnterpriseAlert)
    expect(result.repository).toEqual({ name: 'my-repo', owner: 'my-org' })
  })

  it('maps packageName and advisory fields', () => {
    const result = toEnterpriseAlert(mockRawEnterpriseAlert)
    expect(result.packageName).toBe('lodash')
    expect(result.advisory?.severity).toBe('CRITICAL')
  })
})

describe('getFullRepositoryNameFromAlert', () => {
  it('returns owner/name format', () => {
    const alert = toRepositoryAlert(mockRawAlert, 'my-repo', 'my-org')
    expect(getFullRepositoryNameFromAlert(alert)).toBe('my-org/my-repo')
  })
})
