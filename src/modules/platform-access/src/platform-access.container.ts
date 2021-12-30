import { AccountRegistrationController } from '@api/account-registration/account-registration.controller';
import { AccountController } from '@api/account/account.controller';
import { LoginCommandHandler } from '@app/commands/login/login.command-handler';
import { RegisterNewAccountCommandHandler } from '@app/commands/register-new-account/register-new-account.command-handler';
import { NewAccountRegisteredSubscriber } from '@app/subscribers/new-account-registered/new-account-registered.subscriber';
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
  const container = new ContainerBuilder()
    .loadActions([`${__dirname}/**/*.action.ts`, `${__dirname}/**/*.action.js`])
    .setCommandHandlers([
      asClass(RegisterNewAccountCommandHandler).singleton(),
      asClass(LoginCommandHandler).singleton(),
    ])
    .setQueryHandlers([])
    .setSubscribers([asClass(NewAccountRegisteredSubscriber).singleton()])
    .setRepositories([
      asClass(AccountRegistrationRepositoryImpl).singleton(),
      asClass(AccountRepositoryImpl).singleton(),
      asClass(KnexOutboxRepository).singleton(),
    ])
    .setControllers([
      asClass(AccountRegistrationController).singleton(),
      asClass(AccountController).singleton(),
    ])
    .build();

  container.register({
    passwordHashProviderService: asClass(BcryptPasswordHashProviderService).singleton(),
    accountEmailCheckerService: asClass(AccountEmailCheckerServiceImpl).singleton(),
    accountNicknameCheckerService: asClass(AccountNicknameCheckerServiceImpl).singleton(),
    unitOfWork: asClass(KnexUnitOfWork).singleton(),
    emailVerificationCodeProviderService: asClass(
      EmailVerificationCodeProviderServiceImpl,
    ).singleton(),
    tokenProviderService: asClass(JwtTokenProviderService).singleton(),
  });

  return container;
};
