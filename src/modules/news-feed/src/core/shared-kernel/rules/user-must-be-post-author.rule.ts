import { BusinessRule, UniqueEntityID } from '@krater/building-blocks';

export class UserMustBePostAuthor implements BusinessRule {
  message = 'Only post author can edit post.';

  constructor(private readonly accountId: string, private readonly authorId: UniqueEntityID) {}

  public isBroken(): boolean {
    return !this.authorId.equals(new UniqueEntityID(this.accountId));
  }
}
