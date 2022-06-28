/* eslint-disable no-console */
import { Alert, toAlert } from './entities'
import {
  Repository,
  RepositoryVulnerabilityAlertEdge,
} from '@octokit/graphql-schema'
import { getOctokit } from '@actions/github'

const isValidAlert = (
  gitHubAlert: RepositoryVulnerabilityAlertEdge,
): boolean => {
  console.log(
    typeof gitHubAlert?.node?.dismissedAt,
    gitHubAlert?.node?.dismissedAt,
    typeof gitHubAlert?.node?.fixedAt,
    gitHubAlert?.node?.fixedAt,
  )
  if (
    typeof gitHubAlert?.node?.dismissedAt === null ||
    typeof gitHubAlert?.node?.fixedAt === null
  ) {
    return true
  }
  return false
}

export const fetchAlerts = async (
  gitHubPersonalAccessToken: string,
  repositoryName: string,
  repositoryOwner: string,
  count: number,
): Promise<Alert[] | []> => {
  const octokit = getOctokit(gitHubPersonalAccessToken)
  const { repository } = await octokit.graphql<{
    repository: Repository
  }>(`
    query {
      repository(owner:"${repositoryOwner}" name:"${repositoryName}") {
        vulnerabilityAlerts(last: ${count}) {
          edges {
            node {
              id
              dismissedAt
              fixedAt
              repository {
                name
                owner {
                  login
                }
              }
              securityAdvisory {
                id
                description
                cvss {
                  score
                  vectorString
                }
                permalink
                severity
                summary
              }
              securityVulnerability {
                firstPatchedVersion {
                  identifier
                }
                package {
                  ecosystem
                  name
                }
                vulnerableVersionRange
                advisory {
                  cvss {
                    score
                    vectorString
                  }
                  summary
                }
              }
            }
          }
        }
      }
    }
  `)
  const gitHubAlerts = repository.vulnerabilityAlerts?.edges
  if (gitHubAlerts) {
    const alerts: Alert[] = []
    for (const gitHubAlert of gitHubAlerts) {
      if (gitHubAlert && gitHubAlert.node && isValidAlert(gitHubAlert)) {
        alerts.push(toAlert(gitHubAlert.node))
      }
    }
    return alerts
  }
  return []
}
