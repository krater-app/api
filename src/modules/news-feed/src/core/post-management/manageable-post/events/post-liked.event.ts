import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface PostLikedEventPayload {
  postId: string;
  accountId: string;
  likedAt: string;
}

export class PostLikedEvent implements DomainEvent<PostLikedEventPayload> {
  public readonly name = PostLikedEvent.name;

  public readonly module = ModuleNames.NewsFeed;

  constructor(public readonly payload: PostLikedEventPayload) {}
}
