import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { TableNames } from '@infrastructure/table-names';
import { QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountEmailCheckerServiceImpl implements AccountEmailCheckerService {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(email: string): Promise<boolean> {
    const result = await this.dependencies.queryBuilder
      .select(['id'])
      .where('email', email)
      .from(TableNames.Account);

    return result.length === 0;
  }
}
