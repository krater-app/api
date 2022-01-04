import { CommandHandler, EventDispatcher } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountNicknameCheckerService } from '@core/account-nickname/account-nickname-checker.service';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';
import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { RegisterNewAccountCommand } from './register-new-account.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  accountEmailCheckerService: AccountEmailCheckerService;
  accountNicknameCheckerService: AccountNicknameCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
  eventDispatcher: EventDispatcher;
  emailVerificationCodeProviderService: EmailVerificationCodeProviderService;
}

export class RegisterNewAccountCommandHandler implements CommandHandler<RegisterNewAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: RegisterNewAccountCommand): Promise<void> {
    const {
      unitOfWork,
      passwordHashProviderService,
      accountNicknameCheckerService,
      accountEmailCheckerService,
      eventDispatcher,
      emailVerificationCodeProviderService,
    } = this.dependencies;

    await unitOfWork.start();

    const repository = unitOfWork.getRepository<AccountRegistrationRepository>(
      'accountRegistrationRepository',
    );

    await unitOfWork.complete(async () => {
      const accountRegistration = await AccountRegistration.registerNew(command.payload, {
        accountEmailCheckerService,
        accountNicknameCheckerService,
        passwordHashProviderService,
        emailVerificationCodeProviderService,
      });

      await eventDispatcher.dispatchEventsForAggregate(accountRegistration, unitOfWork);

      await repository.insert(accountRegistration);
    });
  }
}
