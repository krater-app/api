import { Account, PersistedAccount } from '@core/account/account.aggregate-root';
import { AccountRepository } from '@core/account/account.repository';
import { TableNames } from '@infrastructure/table-names';
import { KnexRepository, QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRepositoryImpl extends KnexRepository implements AccountRepository {
  public readonly name = 'accountRepository';

  constructor(private readonly dependencies: Dependencies) {
    super();
  }

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
}
