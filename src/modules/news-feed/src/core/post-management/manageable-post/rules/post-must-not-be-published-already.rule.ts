import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class PostMustNotBePublishedAlreadyRule implements BusinessRule {
  message = 'This post is already published.';

  constructor(private readonly status: PostStatus) {}

  public isBroken(): boolean {
    return this.status.equals(PostStatus.Active);
  }
}
