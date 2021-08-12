import { IRepository } from './repository'

export interface IAlert {
  createdAt: string
  repository: IRepository
}

const a: IAlert = {
  createdAt: '123123123123',
}
