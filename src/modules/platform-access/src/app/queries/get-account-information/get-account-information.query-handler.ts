import { AccountStatusValue } from '@core/account-status/account-status.value-object';
import { TableNames } from '@infrastructure/table-names';
import { QueryHandler, UnauthenticatedError } from '@krater/building-blocks';
import { QueryBuilder } from '@krater/database';
import { AccountInformationDTO } from '@root/dtos/account-information.dto';
import { GetAccountInformationQuery } from './get-account-information.query';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class GetAccountInformationQueryHandler
  implements QueryHandler<GetAccountInformationQuery, AccountInformationDTO>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(query: GetAccountInformationQuery): Promise<AccountInformationDTO> {
    const { queryBuilder } = this.dependencies;

    const result = await queryBuilder
      .select(['id', 'nickname', 'status'])
      .where('id', query.payload.accountId)
      .from(TableNames.Account)
      .first();

    if (!result) {
      throw new UnauthenticatedError();
    }

    const { status, ...rest } = result;

    return {
      ...rest,
      accountConfirmed: status === AccountStatusValue.EmailConfirmed,
    };
  }
}
