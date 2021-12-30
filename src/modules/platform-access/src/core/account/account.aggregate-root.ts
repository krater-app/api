import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/account-status/account-status.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { PasswordMustBeValidRule } from './rules/password-must-be-valid.rule';

interface AccountProps {
  password: AccountPassword;
  status: AccountStatus;
}

export interface PersistedAccount {
  id: string;
  passwordHash: string;
  status: string;
}

export class Account extends AggregateRoot<AccountProps> {
  private constructor(props: AccountProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static fromPersistence({ id, status, passwordHash }: PersistedAccount) {
    return new Account(
      {
        status: AccountStatus.fromValue(status),
        password: AccountPassword.fromPersistence(passwordHash),
      },
      new UniqueEntityID(id),
    );
  }

  public async login(password: string, passwordHashProviderService: PasswordHashProviderService) {
    await Account.checkRule(
      new PasswordMustBeValidRule(this.props.password, password, passwordHashProviderService),
    );
  }

  public getId(): Readonly<string> {
    return this.id.value;
  }
}
