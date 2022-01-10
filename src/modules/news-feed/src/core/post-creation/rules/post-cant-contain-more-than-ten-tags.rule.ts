import { BusinessRule } from '@krater/building-blocks';

export class PostCantContainMoreThanTenTagsRule implements BusinessRule {
  message = "Post can't contain more than 10 tags.";

  constructor(private readonly tags: string[]) {}

  public isBroken(): boolean {
    return this.tags.length > 10;
  }
}
