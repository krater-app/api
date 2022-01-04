import { DatabaseTransaction } from '.';

export interface UnitOfWorkRepository {
  name: string;
  setCurrentTransaction(transaction: DatabaseTransaction): void;
}

export interface UnitOfWork {
  start(): Promise<void>;

  complete<ResponseType extends object | void = void>(
    job: () => Promise<ResponseType>,
  ): Promise<ResponseType>;

  getRepository<RepositoryType extends UnitOfWorkRepository>(
    repositoryName: string,
  ): RepositoryType;
}
