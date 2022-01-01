import { EventSubscriber } from '@krater/building-blocks';
import { KnexOutboxRepository, UnitOfWork } from '@krater/database';
import { NewAccountRegisteredEvent } from '@krater/integration-events';

export class NewAccountRegisteredSubscriber implements EventSubscriber<NewAccountRegisteredEvent> {
  public readonly type = NewAccountRegisteredEvent.name;

  public async handle(event: NewAccountRegisteredEvent, unitOfWork: UnitOfWork): Promise<void> {
    const outboxRepository = unitOfWork.getRepository<KnexOutboxRepository>('outboxRepository');

    await outboxRepository.insert({
      data: event.payload,
      type: event.name,
      module: event.module,
    });
  }
}
