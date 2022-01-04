import { EventSubscriber } from '@krater/building-blocks';
import { OutboxRepository, UnitOfWork } from '@krater/database';
import { VerificationEmailSentAgainEvent } from '@krater/integration-events';

export class VerificationEmailSentAgainSubscriber
  implements EventSubscriber<VerificationEmailSentAgainEvent>
{
  public readonly type = VerificationEmailSentAgainEvent.name;

  public async handle(
    event: VerificationEmailSentAgainEvent,
    unitOfWork: UnitOfWork,
  ): Promise<void> {
    const outboxRepository = unitOfWork.getRepository<OutboxRepository>('outboxRepository');

    await outboxRepository.insert({
      data: event.payload,
      module: event.module,
      type: event.name,
    });
  }
}
