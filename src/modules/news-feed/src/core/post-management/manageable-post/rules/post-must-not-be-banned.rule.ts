import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class PostMustNotBeBannedRule implements BusinessRule {
  message = 'This post is already banned.';

  constructor(private readonly status: PostStatus) {}

  public isBroken(): boolean | Promise<boolean> {
    return this.status.equals(PostStatus.Banned);
  }
}
