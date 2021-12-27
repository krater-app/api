import { UnitOfWork } from '@krater/database';
import { DomainEvent } from '..';

export interface EventSubscriber<EventType extends DomainEvent<any>> {
  type: string;

  handle(event: EventType, unitOfWork: UnitOfWork): Promise<void>;
}
