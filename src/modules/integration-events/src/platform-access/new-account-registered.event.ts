import { DomainEvent } from '@krater/building-blocks';

export interface NewAccountRegisteredEventPayload {
  accountId: string;
  accountEmail: string;
  emailVerificationCode: string;
}

export class NewAccountRegisteredEvent implements DomainEvent<NewAccountRegisteredEventPayload> {
  name = NewAccountRegisteredEvent.name;

  module = 'platform-access';

  constructor(public readonly payload: NewAccountRegisteredEventPayload) {}
}
