import { BusinessRule, UniqueEntityID } from '@krater/building-blocks';

export class UserCantDisslikePostMoreThanOnceRule implements BusinessRule {
  public readonly message = 'You already dissliked this post.';

  constructor(
    private readonly disslikedUserIDs: UniqueEntityID[],
    private readonly userId: string,
  ) {}

  public isBroken(): boolean {
    const uniqueUserId = new UniqueEntityID(this.userId);

    return this.disslikedUserIDs.some((disslikeId) => disslikeId.equals(uniqueUserId));
  }
}
