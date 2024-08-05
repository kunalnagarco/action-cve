import { Advisory } from '../advisory'
import { Vulnerability } from '../vulnerability'

export interface BaseAlert {
  packageName: string
  advisory?: Advisory
  vulnerability?: Vulnerability
  createdAt: string
}
