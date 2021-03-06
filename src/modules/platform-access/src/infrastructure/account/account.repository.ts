import { Account, PersistedAccount } from '@core/account/account.aggregate-root';
import { AccountRepository } from '@core/account/account.repository';
import { TableNames } from '@infrastructure/table-names';
import { QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRepositoryImpl implements AccountRepository {
  public readonly name = 'accountRepository';

  constructor(private readonly dependencies: Dependencies) {}

  public async findByEmail(email: string): Promise<Account | null> {
    const result = await this.dependencies.queryBuilder
      .select<PersistedAccount>({
        id: 'id',
        passwordHash: 'password_hash',
        status: 'status',
      })
      .from(TableNames.Account)
      .where('email', email)
      .first();

    return result ? Account.fromPersistence(result) : null;
  }

  public async findByNickname(nickname: string): Promise<Account | null> {
    const result = await this.dependencies.queryBuilder
      .select<PersistedAccount>({
        id: 'id',
        passwordHash: 'password_hash',
        status: 'status',
      })
      .from(TableNames.Account)
      .where('nickname', nickname)
      .first();

    return result ? Account.fromPersistence(result) : null;
  }

  public async findById(id: string): Promise<Account | null> {
    const result = await this.dependencies.queryBuilder
      .select<PersistedAccount>({
        id: 'id',
        passwordHash: 'password_hash',
        status: 'status',
      })
      .from(TableNames.Account)
      .where('id', id)
      .first();

    return result ? Account.fromPersistence(result) : null;
  }

  public setCurrentTransaction(): void {}
}
