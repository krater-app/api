import { CommandHandler } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { AccountRegistrationRepositoryImpl } from '@infrastructure/account-registration/account-registration.repository';
import { AccountRegistration } from '@core/account-registration/account-registration.aggregate-root';
import { AccountEmailCheckerService } from '@core/account-email/account-email-checker.service';
import { AccountNicknameCheckerService } from '@core/account-nickname/account-nickname-checker.service';
import { PasswordHashProviderService } from '@core/account-password/password-hash-provider.service';
import { RegisterNewAccountCommand } from './register-new-account.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  accountEmailCheckerService: AccountEmailCheckerService;
  accountNicknameCheckerService: AccountNicknameCheckerService;
  passwordHashProviderService: PasswordHashProviderService;
}

export class RegisterNewAccountCommandHandler implements CommandHandler<RegisterNewAccountCommand> {
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: RegisterNewAccountCommand): Promise<void> {
    const {
      unitOfWork,
      passwordHashProviderService,
      accountNicknameCheckerService,
      accountEmailCheckerService,
    } = this.dependencies;

    await unitOfWork.start();

    const repository = unitOfWork.getRepository<AccountRegistrationRepositoryImpl>(
      'accountRegistrationRepository',
    );

    await unitOfWork.complete(async () => {
      const accountRegistration = await AccountRegistration.registerNew(command.payload, {
        accountEmailCheckerService,
        accountNicknameCheckerService,
        passwordHashProviderService,
      });

      await repository.insert(accountRegistration);
    });
  }
}
