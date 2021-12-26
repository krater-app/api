import { DomainEvent } from '@krater/building-blocks';

export interface NewAccountRegisteredEventPayload {
  accountId: string;
  accountEmail: string;
}

export class NewAccountRegisteredEvent implements DomainEvent<NewAccountRegisteredEventPayload> {
  name = NewAccountRegisteredEvent.name;

  constructor(public readonly payload: NewAccountRegisteredEventPayload) {}
}
