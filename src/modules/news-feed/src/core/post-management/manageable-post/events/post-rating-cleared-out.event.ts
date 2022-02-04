import { DomainEvent, ModuleNames } from '@krater/building-blocks';

export interface PostRatingClearedOutEventPayload {
  postId: string;
  accountId: string;
  clearedOutAt: string;
}

export class PostRatingClearedOutEvent implements DomainEvent<PostRatingClearedOutEventPayload> {
  public readonly name = PostRatingClearedOutEvent.name;

  public readonly module = ModuleNames.NewsFeed;

  constructor(public readonly payload: PostRatingClearedOutEventPayload) {}
}
