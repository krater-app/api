import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { EmailVerificationCodeStatus } from '@core/email-verification-code-status/email-verification-code-status.value-object';
import { PersistedEmailVerificationCode } from '@core/email-verification-code/email-verification-code.entity';
import { TableNames } from '@infrastructure/table-names';
import { DatabaseTransaction, QueryBuilder } from '@krater/database';

interface Dependencies {
  queryBuilder: QueryBuilder;
}

export class AccountRegistrationRepositoryImpl implements AccountRegistrationRepository {
  public readonly name = 'accountRegistrationRepository';

  private currentTransaction: DatabaseTransaction = null;

  constructor(private readonly dependencies: Dependencies) {}

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

    const [verificationCode] = accountRegistration.getEmailVerificationCodes();

    await this.currentTransaction
      .insert({
        id: verificationCode.getId(),
        code: verificationCode.getCode(),
        status: verificationCode.getStatus().props.value,
        generated_at: verificationCode.getGeneratedAt().toISOString(),
        account_id: accountRegistration.getId(),
      })
      .into(TableNames.EmailVerificationCode);
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

  public async findById(id: string): Promise<AccountRegistration> {
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
      .where('id', id)
      .first();

    const verificationCodes = await this.dependencies.queryBuilder
      .select<PersistedEmailVerificationCode>({
        id: 'id',
        code: 'code',
        status: 'status',
        generatedAt: 'generated_at',
      })
      .from(TableNames.EmailVerificationCode)
      .where('account_id', id);

    return result
      ? AccountRegistration.fromPersistence({
          ...result,
          verificationCodes,
        })
      : null;
  }

  public async update(accountRegistration: AccountRegistration): Promise<void> {
    await this.currentTransaction
      .update({
        status: accountRegistration.getStatus(),
      })
      .where('id', accountRegistration.getId())
      .into(TableNames.Account);

    const updateVerificationCodePromises = accountRegistration
      .getEmailVerificationCodes()
      .map((verificationCode) =>
        this.currentTransaction
          .update({
            status: verificationCode.getStatus().props.value,
          })
          .where('id', verificationCode.getId())
          .into(TableNames.EmailVerificationCode),
      );

    await Promise.all(updateVerificationCodePromises);

    const emailVerificationCodeToInsert = accountRegistration
      .getEmailVerificationCodes()
      .find((verificationCode) =>
        verificationCode.getStatus().equals(EmailVerificationCodeStatus.Active),
      );

    if (emailVerificationCodeToInsert) {
      await this.currentTransaction
        .insert({
          id: emailVerificationCodeToInsert.getId(),
          code: emailVerificationCodeToInsert.getCode(),
          status: emailVerificationCodeToInsert.getStatus().props.value,
          generated_at: emailVerificationCodeToInsert.getGeneratedAt().toISOString(),
          account_id: accountRegistration.getId(),
        })
        .into(TableNames.EmailVerificationCode);
    }
  }

  public setCurrentTransaction(transaction: DatabaseTransaction): void {
    this.currentTransaction = transaction;
  }
}
