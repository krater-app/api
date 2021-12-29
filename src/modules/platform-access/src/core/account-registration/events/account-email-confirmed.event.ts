import { DomainEvent } from '@krater/building-blocks';

export interface AccountEmailConfirmedEventPayload {
  accountId: string;
  accountEmail: string;
}

export class AccountEmailConfirmedEvent implements DomainEvent<AccountEmailConfirmedEventPayload> {
  name = AccountEmailConfirmedEvent.name;

  module = 'platform-access';

  constructor(public readonly payload: AccountEmailConfirmedEventPayload) {}
}
