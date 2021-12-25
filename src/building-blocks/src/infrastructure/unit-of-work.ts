import { Constructor } from '@tools/constructor.type';

export interface UnitOfWork {
  start(): Promise<void>;

  complete<ResponseType extends object | void = void>(
    job: () => Promise<ResponseType>,
  ): Promise<ResponseType>;

  getRepository<RepositoryType extends Constructor<unknown>>(
    RepositoryType: RepositoryType,
  ): InstanceType<RepositoryType>;
}
