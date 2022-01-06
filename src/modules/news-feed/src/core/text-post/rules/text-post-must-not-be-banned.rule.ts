import { PostStatus } from '@core/post-status/post-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class TextPostMustNotBeBannedRule implements BusinessRule {
  message = 'This text post is banned.';

  constructor(private readonly status: PostStatus) {}

  public isBroken(): boolean | Promise<boolean> {
    return this.status.equals(PostStatus.Banned);
  }
}
