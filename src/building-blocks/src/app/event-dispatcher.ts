import { UnitOfWork } from '@infrastructure/unit-of-work';
import { AggregateRoot, DomainEvent } from '..';

export interface EventDispatcher {
  dispatchEvent(event: DomainEvent, unitOfWork: UnitOfWork): Promise<void>;

  dispatchEventsForAggregate(aggregate: AggregateRoot, unitOfWork: UnitOfWork): Promise<void>;
}
