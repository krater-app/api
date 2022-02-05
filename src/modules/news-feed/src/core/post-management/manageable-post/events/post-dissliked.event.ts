import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface PostDisslikedEventPayload {
  postId: string;
  accountId: string;
  disslikedAt: string;
}

export class PostDisslikedEvent implements DomainEvent<PostDisslikedEventPayload> {
  public readonly name = PostDisslikedEvent.name;

  public readonly module = ModuleNames.NewsFeed;

  constructor(public readonly payload: PostDisslikedEventPayload) {}
}
