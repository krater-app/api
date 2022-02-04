import { PostStatus } from '@core/shared-kernel/post-status/post-status.value-object';
import { BusinessRule } from '@krater/building-blocks';

export class PostMustBePublishedRule implements BusinessRule {
  public readonly message = 'Post must be published to perform action.';

  constructor(private readonly status: PostStatus) {}

  public isBroken(): boolean {
    return !this.status.equals(PostStatus.Active);
  }
}
