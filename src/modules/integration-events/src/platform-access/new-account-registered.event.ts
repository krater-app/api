import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface NewAccountRegisteredEventPayload {
  accountId: string;
  accountEmail: string;
  accountNickname: string;
  emailVerificationCode: string;
}

export class NewAccountRegisteredEvent implements DomainEvent<NewAccountRegisteredEventPayload> {
  name = NewAccountRegisteredEvent.name;

  module = ModuleNames.PlatformAccess;

  constructor(public readonly payload: NewAccountRegisteredEventPayload) {}
}
