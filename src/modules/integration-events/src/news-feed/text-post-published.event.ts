import { DomainEvent } from '@krater/building-blocks';

interface TextPostPublishedEventPayload {
  textPostId: string;
  tags: string[];
}

export class TextPostPublishedEvent implements DomainEvent<TextPostPublishedEventPayload> {
  public readonly name = TextPostPublishedEvent.name;

  public readonly module = 'news-feed';

  constructor(public readonly payload: TextPostPublishedEventPayload) {}
}
