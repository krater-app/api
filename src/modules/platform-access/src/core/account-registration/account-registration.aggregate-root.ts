import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountEmail } from '@core/account-email/account-email.value-object';
import { AccountNicknameCheckerService } from '@core/account-nickname/account-nickname-checker.service';
import { AccountNickname } from '@core/account-nickname/account-nickname.value-object';
import { AccountPassword } from '@core/account-password/account-password.value-object';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { AccountStatus } from '@core/account-status/account-status.value-object';
import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';
import {
  EmailVerificationCode,
  PersistedEmailVerificationCode,
} from '@core/email-verification-code/email-verification-code.entity';
import { AggregateRoot, UniqueEntityID } from '@krater/building-blocks';
import {
  AccountEmailConfirmedEvent,
  VerificationEmailSentAgainEvent,
  NewAccountRegisteredEvent,
} from '@krater/integration-events';
import { EmailMustNotBeConfrimedAlreadyRule } from './rules/email-must-not-be-confirmed-already.rule';
import { EmailVerificationCodeMustBeValidRule } from './rules/email-verification-code-must-be-valid.rule';

interface AccountRegistrationProps {
  email: AccountEmail;
  nickname: AccountNickname;
  password: AccountPassword;
  status: AccountStatus;
  registeredAt: Date;
  emailConfirmedAt: Date | null;
  verificationCodes: EmailVerificationCode[];
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
  emailVerificationCodeProviderService: EmailVerificationCodeProviderService;
}

export interface PersistedAccountRegistration {
  id: string;
  email: string;
  nickname: string;
  passwordHash: string;
  status: string;
  registeredAt: string;
  emailConfirmedAt: string | null;
  verificationCodes: PersistedEmailVerificationCode[];
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
      emailVerificationCodeProviderService,
    }: RegisterNewAccountDependencies,
  ) {
    const accountRegistration = new AccountRegistration({
      email: await AccountEmail.createNew(email, accountEmailCheckerService),
      nickname: await AccountNickname.createNew(nickname, accountNicknameCheckerService),
      password: await AccountPassword.createNew(password, passwordHashProviderService),
      status: AccountStatus.WaitingForEmailConfirmation,
      registeredAt: new Date(),
      emailConfirmedAt: null,
      verificationCodes: [],
    });

    const verificationCode = EmailVerificationCode.createNew(emailVerificationCodeProviderService);

    accountRegistration.props.verificationCodes.push(verificationCode);

    accountRegistration.addDomainEvent(
      new NewAccountRegisteredEvent({
        accountId: accountRegistration.id.value,
        accountEmail: accountRegistration.getEmail(),
        emailVerificationCode: verificationCode.getCode(),
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
    verificationCodes,
  }: PersistedAccountRegistration) {
    return new AccountRegistration(
      {
        email: AccountEmail.fromPersistence(email),
        password: AccountPassword.fromPersistence(passwordHash),
        status: AccountStatus.fromValue(status),
        registeredAt: new Date(registeredAt),
        emailConfirmedAt: emailConfirmedAt ? new Date(emailConfirmedAt) : null,
        nickname: AccountNickname.fromPersistence(nickname),
        verificationCodes: verificationCodes.map(EmailVerificationCode.fromPersistence),
      },
      new UniqueEntityID(id),
    );
  }

  public confirmEmail(verificationCode: string) {
    AccountRegistration.checkRule(new EmailMustNotBeConfrimedAlreadyRule(this.props.status));
    AccountRegistration.checkRule(
      new EmailVerificationCodeMustBeValidRule(verificationCode, this.props.verificationCodes),
    );

    this.props.status = AccountStatus.EmailConfirmed;
    this.props.emailConfirmedAt = new Date();

    const existingVerificationCode = this.props.verificationCodes.find(
      (code) => code.getCode() === verificationCode,
    );

    existingVerificationCode.confirm();

    this.props.verificationCodes = [
      ...this.props.verificationCodes
        .filter((code) => code.getId() !== existingVerificationCode.getId())
        .map((code) => {
          code.archive();
          return code;
        }),
      existingVerificationCode,
    ];

    this.addDomainEvent(
      new AccountEmailConfirmedEvent({
        accountId: this.getId(),
        accountEmail: this.getEmail(),
      }),
    );
  }

  public resendEmailConfirmationLink(
    emailVerificationCodeProviderService: EmailVerificationCodeProviderService,
  ) {
    AccountRegistration.checkRule(new EmailMustNotBeConfrimedAlreadyRule(this.props.status));

    const newEmailVerificationCode = EmailVerificationCode.createNew(
      emailVerificationCodeProviderService,
    );

    this.props.verificationCodes = [
      ...this.props.verificationCodes.map((code) => {
        code.archive();
        return code;
      }),
      newEmailVerificationCode,
    ];

    this.addDomainEvent(
      new VerificationEmailSentAgainEvent({
        accountEmail: this.getEmail(),
        accountId: this.getId(),
        verificationCode: newEmailVerificationCode.getCode(),
      }),
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

  public getEmailVerificationCodes(): ReadonlyArray<EmailVerificationCode> {
    return this.props.verificationCodes;
  }
}
