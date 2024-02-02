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

export const getFullRepositoryNameFromAlert = (alert: Alert): string =>
  `${alert.repository.owner}/${alert.repository.name}`
