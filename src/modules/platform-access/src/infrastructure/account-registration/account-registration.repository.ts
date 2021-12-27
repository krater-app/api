import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { TableNames } from '@infrastructure/table-names';
import { KnexRepository, QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRegistrationRepositoryImpl
  extends KnexRepository
  implements AccountRegistrationRepository
{
  public readonly name = 'accountRegistrationRepository';

  constructor(private readonly dependencies: Dependencies) {
    super();
  }

  public async insert(accountRegistration: AccountRegistration): Promise<void> {
    await this.currentTransaction
      .insert({
        id: accountRegistration.getId(),
        email: accountRegistration.getEmail(),
        nickname: accountRegistration.getNickname(),
        password_hash: accountRegistration.getPasswordHash(),
        status: accountRegistration.getStatus(),
        registered_at: accountRegistration.getRegisteredAt().toISOString(),
        email_confirmed_at: accountRegistration.getEmailConfirmedAt()
          ? accountRegistration.getEmailConfirmedAt().toISOString()
          : null,
      })
      .into(TableNames.Account);
  }

  public async findByEmail(email: string): Promise<AccountRegistration> {
    const result = await this.dependencies.queryBuilder
      .select([
        'id',
        'email',
        'nickname',
        'password_hash AS passwordHash',
        'status',
        'registered_at AS registeredAt',
        'email_confirmed_at AS emailConfirmedAt',
      ])
      .from(TableNames.Account)
      .where('email', email)
      .first();

    return result ? AccountRegistration.fromPersistence(result) : null;
  }
}
