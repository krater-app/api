import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface NewPostCreatedEventPayload {
  postId: string;
  tags: string[];
  authorId: string;
}

export class NewPostCreatedEvent implements DomainEvent<NewPostCreatedEventPayload> {
  public readonly name = NewPostCreatedEvent.name;

  public readonly module = ModuleNames.NewsFeed;

  constructor(public readonly payload: NewPostCreatedEventPayload) {}
}
