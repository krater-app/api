import { EventSubscriber } from '@krater/building-blocks';
import { OutboxRepository, UnitOfWork } from '@krater/database';
import { AccountEmailConfirmedEvent } from '@krater/integration-events';

export class AccountEmailConfirmedSubscriber
  implements EventSubscriber<AccountEmailConfirmedEvent>
{
  public readonly type = AccountEmailConfirmedEvent.name;

  public async handle(event: AccountEmailConfirmedEvent, unitOfWork: UnitOfWork): Promise<void> {
    const outboxRepository = unitOfWork.getRepository<OutboxRepository>('outboxRepository');

    await outboxRepository.insert({
      data: event.payload,
      type: event.name,
      module: event.module,
    });
  }
}
