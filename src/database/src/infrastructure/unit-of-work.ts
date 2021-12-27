import { KnexRepository } from './knex-repository';

export interface UnitOfWork {
  start(): Promise<void>;

  complete<ResponseType extends object | void = void>(
    job: () => Promise<ResponseType>,
  ): Promise<ResponseType>;

  getRepository<RepositoryType extends KnexRepository>(repositoryName: string): RepositoryType;
}
