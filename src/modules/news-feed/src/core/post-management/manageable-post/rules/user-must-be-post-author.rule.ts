import { BusinessRule, UniqueEntityID } from '@krater/building-blocks';

export class UserMustBePostAuthorRule implements BusinessRule {
  message = 'You need to be post author to interact with selected post.';

  constructor(private readonly postAuthorId: UniqueEntityID, private readonly userId: string) {}

  public isBroken(): boolean {
    return !this.postAuthorId.equals(new UniqueEntityID(this.userId));
  }
}
