import { EmailVerificationCodeProviderService } from '@core/email-verification-code/email-verification-code-provider.service';
import { AccountRegistrationRepositoryImpl } from '@infrastructure/account-registration/account-registration.repository';
import { CommandHandler, EventDispatcher, UnauthenticatedError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { ResendConfirmationEmailCommand } from './resend-confirmation-email.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  emailVerificationCodeProviderService: EmailVerificationCodeProviderService;
  eventDispatcher: EventDispatcher;
}

export class ResendConfirmationEmailCommandHandler
  implements CommandHandler<ResendConfirmationEmailCommand>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: ResendConfirmationEmailCommand): Promise<void> {
    const { unitOfWork, emailVerificationCodeProviderService, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    const accountRegistrationRepository =
      unitOfWork.getRepository<AccountRegistrationRepositoryImpl>('accountRegistrationRepository');

    await unitOfWork.complete(async () => {
      const accountRegistration = await accountRegistrationRepository.findById(
        command.payload.accountId,
      );

      if (!accountRegistration) {
        throw new UnauthenticatedError();
      }

      accountRegistration.resendEmailConfirmationLink(emailVerificationCodeProviderService);

      await eventDispatcher.dispatchEventsForAggregate(accountRegistration, unitOfWork);

      await accountRegistrationRepository.update(accountRegistration);
    });
  }
}
