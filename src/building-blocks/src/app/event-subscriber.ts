import { DomainEvent, UnitOfWork } from '..';

export interface EventSubscriber<EventType extends DomainEvent<any>> {
  type: string;

  handle(event: EventType, unitOfWork: UnitOfWork): Promise<void>;
}
