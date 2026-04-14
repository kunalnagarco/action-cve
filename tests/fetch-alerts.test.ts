import { describe, it, expect, vi, beforeEach } from 'vitest'

import {
  DependabotAlert,
  DependabotOrgAlert,
} from '../src/entities/alert'
import { fetchRepositoryAlerts, fetchOrgAlerts, fetchEnterpriseAlerts, filterIgnoredAlerts } from '../src/fetch-alerts'

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

const mockRawOrgEnterpriseAlert: DependabotOrgAlert = {
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

describe('filterIgnoredAlerts', () => {
  const alerts = [
    { packageName: 'lodash', repository: { name: 'repo', owner: 'org' }, createdAt: '' },
    { packageName: 'axios', repository: { name: 'repo', owner: 'org' }, createdAt: '' },
    { packageName: 'express', repository: { name: 'repo', owner: 'org' }, createdAt: '' },
  ]

  it('returns all alerts when ignore list is empty', () => {
    expect(filterIgnoredAlerts(alerts, [])).toHaveLength(3)
  })

  it('removes a single ignored package', () => {
    const result = filterIgnoredAlerts(alerts, ['lodash'])
    expect(result).toHaveLength(2)
    expect(result.map((a) => a.packageName)).not.toContain('lodash')
  })

  it('removes multiple ignored packages', () => {
    const result = filterIgnoredAlerts(alerts, ['lodash', 'axios'])
    expect(result).toHaveLength(1)
    expect(result[0].packageName).toBe('express')
  })

  it('returns all alerts when no packages match the ignore list', () => {
    expect(filterIgnoredAlerts(alerts, ['moment'])).toHaveLength(3)
  })
})
