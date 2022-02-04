import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface VerificationEmailSentAgainEventPayload {
  accountId: string;
  accountEmail: string;
  verificationCode: string;
}

export class VerificationEmailSentAgainEvent implements DomainEvent {
  public readonly module = ModuleNames.PlatformAccess;

  public readonly name = VerificationEmailSentAgainEvent.name;

  constructor(public readonly payload: VerificationEmailSentAgainEventPayload) {}
}
