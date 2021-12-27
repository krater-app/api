import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountEmail } from '@core/account-email/account-email.value-object';
import { AccountNicknameCheckerService } from '@core/account-nickname/account-nickname-checker.service';
import { AccountNickname } from '@core/account-nickname/account-nickname.value-object';
import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/account-status/account-status.value-object';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import { NewAccountRegisteredEvent } from './events/new-account-registered.event';

interface AccountRegistrationProps {
  email: AccountEmail;
  nickname: AccountNickname;
  password: AccountPassword;
  status: AccountStatus;
  registeredAt: Date;
  emailConfirmedAt: Date | null;
}

interface RegisterNewAccount {
  email: string;
  nickname: string;
  password: string;
}

interface RegisterNewAccountDependencies {
  accountEmailCheckerService: AccountEmailCheckerService;
  accountNicknameCheckerService: AccountNicknameCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
}

export interface PersistedAccountRegistration {
  id: string;
  email: string;
  nickname: string;
  passwordHash: string;
  status: string;
  registeredAt: string;
  emailConfirmedAt: string | null;
}

export class AccountRegistration extends AggregateRoot<AccountRegistrationProps> {
  private constructor(props: AccountRegistrationProps, id?: UniqueEntityID) {
    super(props, id);
  }

  public static async registerNew(
    { email, nickname, password }: RegisterNewAccount,
    {
      accountEmailCheckerService,
      accountNicknameCheckerService,
      passwordHashProviderService,
    }: RegisterNewAccountDependencies,
  ) {
    const accountRegistration = new AccountRegistration({
      email: await AccountEmail.createNew(email, accountEmailCheckerService),
      nickname: await AccountNickname.createNew(nickname, accountNicknameCheckerService),
      password: await AccountPassword.createNew(password, passwordHashProviderService),
      status: AccountStatus.WaitingForEmailConfirmation,
      registeredAt: new Date(),
      emailConfirmedAt: null,
    });

    accountRegistration.addDomainEvent(
      new NewAccountRegisteredEvent({
        accountId: accountRegistration.id.value,
        accountEmail: accountRegistration.getEmail(),
      }),
    );

    return accountRegistration;
  }

  public static fromPersistence({
    emailConfirmedAt,
    nickname,
    status,
    id,
    registeredAt,
    email,
    passwordHash,
  }: PersistedAccountRegistration) {
    return new AccountRegistration(
      {
        email: AccountEmail.fromPersistence(email),
        password: AccountPassword.fromPersistence(passwordHash),
        status: AccountStatus.fromValue(status),
        registeredAt: new Date(registeredAt),
        emailConfirmedAt: emailConfirmedAt ? new Date(emailConfirmedAt) : null,
        nickname: AccountNickname.fromPersistence(nickname),
      },
      new UniqueEntityID(id),
    );
  }

  public getId() {
    return this.id.value;
  }

  public getEmail() {
    return this.props.email.toString();
  }

  public getNickname() {
    return this.props.nickname.props.value;
  }

  public getPasswordHash() {
    return this.props.password.props.passwordHash;
  }

  public getStatus() {
    return this.props.status.props.value;
  }

  public getRegisteredAt() {
    return this.props.registeredAt;
  }

  public getEmailConfirmedAt() {
    return this.props.emailConfirmedAt;
  }
}
