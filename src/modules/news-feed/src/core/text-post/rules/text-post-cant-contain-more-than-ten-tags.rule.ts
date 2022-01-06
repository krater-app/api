import { BusinessRule } from '@krater/building-blocks';

export class TextPostCantContainMoreThanTenTagsRule implements BusinessRule {
  message = "Text post can't contain more than 10 tags.";

  constructor(private readonly tags: string[]) {}

  public isBroken(): boolean {
    return this.tags.length > 10;
  }
}
