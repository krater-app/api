import { PostStatus } from '@core/post-status/post-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class TextPostMustNotBePublishedAlreadyRule implements BusinessRule {
  message = 'This text post is already published.';

  constructor(private readonly status: PostStatus) {}

  public isBroken(): boolean {
    return this.status.equals(PostStatus.Active);
  }
}
