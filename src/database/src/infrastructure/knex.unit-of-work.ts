import { UnitOfWorkRepository } from '.';
import { DatabaseTransaction } from './database-transaction';
import { QueryBuilder } from './query-builder';
import { UnitOfWork } from './unit-of-work';

interface Dependencies {
  queryBuilder: QueryBuilder;
  repositories: UnitOfWorkRepository[];
}

export class KnexUnitOfWork implements UnitOfWork {
  private currentTransaction: DatabaseTransaction | null;

  constructor(private readonly dependencies: Dependencies) {
    this.currentTransaction = null;
  }

  public async start() {
    if (this.currentTransaction !== null) {
      throw new Error("Can't start new transaction. There is another transaction in progress.");
    }

    this.currentTransaction = await this.dependencies.queryBuilder.transaction();
  }

  public getRepository<RepositoryType extends UnitOfWorkRepository>(
    repositoryName: string,
  ): RepositoryType {
    if (this.currentTransaction === null) {
      throw new Error('Transaction not started. Please use "start" method first.');
    }

    const existingRepository = this.dependencies.repositories.find(
      (repository) => repository.name === repositoryName,
    );

    if (!existingRepository) {
      throw new Error(`Repository with name "${repositoryName}" does not exist.`);
    }

    existingRepository.setCurrentTransaction(this.currentTransaction);

    return existingRepository as RepositoryType;
  }

  public async complete<ResponseType extends void | object = void>(
    job: () => Promise<ResponseType>,
  ): Promise<ResponseType> {
    try {
      const result = await job();
      await this.currentTransaction.commit();

      return result;
    } catch (error) {
      await this.currentTransaction.rollback();

      throw error;
    } finally {
      this.currentTransaction = null;
    }
  }

  public getCurrentTransaction(): DatabaseTransaction {
    if (this.currentTransaction === null) {
      throw new Error(`Can't get current transaction. Please use "start" method first.`);
    }

    return this.currentTransaction;
  }
}
