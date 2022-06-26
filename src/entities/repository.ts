import { Repository as GitHubRepository } from '@octokit/graphql-schema'
import { Alert } from '.'

export interface Repository {
  /**
   * The name of the repository.
   */
  name: string
  /**
   * The username used to login.
   */
  owner: string
}

export const toRepository = (repository: GitHubRepository): Repository => ({
  name: repository.name,
  owner: repository.owner.login,
})

export const getFullRepositoryNameFromAlert = (alert: Alert): string =>
  `${alert.repository.owner}/${alert.repository.name}`
