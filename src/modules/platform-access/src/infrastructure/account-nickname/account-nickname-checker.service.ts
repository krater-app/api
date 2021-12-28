import { AccountNicknameCheckerService } from '@core/account-nickname/account-nickname-checker.service';
import { TableNames } from '@infrastructure/table-names';
import { QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountNicknameCheckerServiceImpl implements AccountNicknameCheckerService {
  constructor(private readonly dependencies: Dependencies) {}

  public async isUnique(nickname: string): Promise<boolean> {
    const result = await this.dependencies.queryBuilder
      .select(['id'])
      .where('nickname', nickname)
      .from(TableNames.Account);

    return result.length === 0;
  }
}
