import { Repository as GitHubRepository } from '@octokit/graphql-schema'

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
