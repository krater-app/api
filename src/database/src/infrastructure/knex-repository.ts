import { DatabaseTransaction } from '.';

export abstract class KnexRepository {
  protected currentTransaction: DatabaseTransaction;

  public readonly name: string;

  public setCurrentTransaction(currentTransaction: DatabaseTransaction) {
    this.currentTransaction = currentTransaction;
  }
}
