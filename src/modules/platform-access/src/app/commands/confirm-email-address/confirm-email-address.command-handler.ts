import { AccountRegistrationRepository } from '@core/account-registration/account-registration.repository';
import { CommandHandler, EventDispatcher, UnauthenticatedError } from '@krater/building-blocks';
import { UnitOfWork } from '@krater/database';
import { ConfirmEmailAddressCommand } from './confirm-email-address.command';

interface Dependencies {
  unitOfWork: UnitOfWork;
  eventDispatcher: EventDispatcher;
}

export class ConfirmEmailAddressCommandHandler
  implements CommandHandler<ConfirmEmailAddressCommand>
{
  constructor(private readonly dependencies: Dependencies) {}

  public async handle(command: ConfirmEmailAddressCommand): Promise<void> {
    const { unitOfWork, eventDispatcher } = this.dependencies;

    await unitOfWork.start();

    const accountRegistrationRepository = unitOfWork.getRepository<AccountRegistrationRepository>(
      'accountRegistrationRepository',
    );

    await unitOfWork.complete(async () => {
      const accountRegistration = await accountRegistrationRepository.findById(
        command.payload.accountId,
      );

      if (!accountRegistration) {
        throw new UnauthenticatedError();
      }

      accountRegistration.confirmEmail(command.payload.activationCode);

      await eventDispatcher.dispatchEventsForAggregate(accountRegistration, unitOfWork);

      await accountRegistrationRepository.update(accountRegistration);
    });
  }
}
