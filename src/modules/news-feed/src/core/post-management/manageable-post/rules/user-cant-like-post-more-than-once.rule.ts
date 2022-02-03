import { BusinessRule, UniqueEntityID } from '@krater/building-blocks';

export class UserCantLikePostMoreThanOnceRule implements BusinessRule {
  public readonly message = 'You already like this post.';

  constructor(private readonly userId: string, private readonly likedUserIDs: UniqueEntityID[]) {}

  public isBroken(): boolean {
    const uniqueUserId = new UniqueEntityID(this.userId);

    return this.likedUserIDs.some((id) => id.equals(uniqueUserId));
  }
}
