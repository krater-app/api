import { AccountRegistrationController } from '@api/account-registration/account-registration.controller';
import { AccountController } from '@api/account/account.controller';
import { ConfirmEmailAddressCommandHandler } from '@app/commands/confirm-email-address/confirm-email-address.command-handler';
import { LoginCommandHandler } from '@app/commands/login/login.command-handler';
import { RefreshTokenCommandHandler } from '@app/commands/refresh-token/refresh-token.command-handler';
import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { ResendConfirmationEmailCommandHandler } from '@app/commands/resend-confirmation-email/resend-confirmation-email.command-handler';
import { GetAccountInformationQueryHandler } from '@app/queries/get-account-information/get-account-information.query-handler';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
import { VerificationEmailSentAgainSubscriber } from '@app/subscribers/verification-email-sent-again/verification-email-sent-again.subscriber';
import { AccountEmailCheckerServiceImpl } from '@infrastructure/account-email/account-email-checker.service';
import { AccountNicknameCheckerServiceImpl } from '@infrastructure/account-nickname/account-nickname-checker.service';
import { BcryptPasswordHashProviderService } from '@infrastructure/account-password/password-hash-provider.service';
import { AccountRegistrationRepositoryImpl } from '@infrastructure/account-registration/account-registration.repository';
import { AccountRepositoryImpl } from '@infrastructure/account/account.repository';
import { EmailVerificationCodeProviderServiceImpl } from '@infrastructure/email-verification-code/email-verification-code-provider.service';
import { ContainerBuilder, JwtTokenProviderService } from '@krater/building-blocks';
import { KnexOutboxRepository, KnexUnitOfWork } from '@krater/database';
import { asClass } from 'awilix';

export const platformAccessContainer = () => {
  return new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([
      asClass(RegisterNewAccountCommandHandler).singleton(),
      asClass(LoginCommandHandler).singleton(),
      asClass(ConfirmEmailAddressCommandHandler).singleton(),
      asClass(ResendConfirmationEmailCommandHandler).singleton(),
      asClass(RefreshTokenCommandHandler).singleton(),
    ])
    .setQueryHandlers([asClass(GetAccountInformationQueryHandler).singleton()])
    .setSubscribers([
      asClass(NewAccountRegisteredSubscriber).singleton(),
      asClass(VerificationEmailSentAgainSubscriber).singleton(),
    ])
    .setRepositories([
      asClass(AccountRegistrationRepositoryImpl).singleton(),
      asClass(AccountRepositoryImpl).singleton(),
      asClass(KnexOutboxRepository).singleton(),
    ])
    .setControllers([
      asClass(AccountRegistrationController).singleton(),
      asClass(AccountController).singleton(),
    ])
    .setCustom({
      passwordHashProviderService: asClass(BcryptPasswordHashProviderService).singleton(),
      accountEmailCheckerService: asClass(AccountEmailCheckerServiceImpl).singleton(),
      accountNicknameCheckerService: asClass(AccountNicknameCheckerServiceImpl).singleton(),
      unitOfWork: asClass(KnexUnitOfWork).transient(),
      emailVerificationCodeProviderService: asClass(
        EmailVerificationCodeProviderServiceImpl,
      ).singleton(),
      tokenProviderService: asClass(JwtTokenProviderService).singleton(),
    })
    .build();
};
