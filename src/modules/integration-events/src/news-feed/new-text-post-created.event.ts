import { DomainEvent } from '@krater/building-blocks';

export interface NewTextPostCreatedEventPayload {
  textPostId: string;
  tags: string[];
}

export class NewTextPostCreatedEvent implements DomainEvent<NewTextPostCreatedEventPayload> {
  public readonly name = NewTextPostCreatedEvent.name;

  public readonly module = 'news-feed';

  constructor(public readonly payload: NewTextPostCreatedEventPayload) {}
}
