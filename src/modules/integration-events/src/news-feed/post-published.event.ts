import { DomainEvent } from '@krater/building-blocks';

interface PostPublishedEventPayload {
  postId: string;
  tags: string[];
}

export class PostPublishedEvent implements DomainEvent<PostPublishedEventPayload> {
  public readonly name = PostPublishedEvent.name;

  public readonly module = 'news-feed';

  constructor(public readonly payload: PostPublishedEventPayload) {}
}
