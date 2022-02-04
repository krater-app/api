import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface AccountEmailConfirmedEventPayload {
  accountId: string;
  accountEmail: string;
  accountNickname: string;
  registeredAt: string;
}

export class AccountEmailConfirmedEvent implements DomainEvent<AccountEmailConfirmedEventPayload> {
  name = AccountEmailConfirmedEvent.name;

  module = ModuleNames.PlatformAccess;

  constructor(public readonly payload: AccountEmailConfirmedEventPayload) {}
}
