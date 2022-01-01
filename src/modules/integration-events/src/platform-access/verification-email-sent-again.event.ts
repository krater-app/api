import { DomainEvent } from '@krater/building-blocks';

export interface VerificationEmailSentAgainEventPayload {
  accountId: string;
  accountEmail: string;
  verificationCode: string;
}

export class VerificationEmailSentAgainEvent implements DomainEvent {
  public readonly module = 'platform-access';

  public readonly name = VerificationEmailSentAgainEvent.name;

  constructor(public readonly payload: VerificationEmailSentAgainEventPayload) {}
}
