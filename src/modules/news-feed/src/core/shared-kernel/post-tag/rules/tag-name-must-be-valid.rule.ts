import { BusinessRule } from '@krater/building-blocks';

export class TagNameMustBeValidRule implements BusinessRule {
  message = 'Tag name must contain at least 3 characters.';

  constructor(private readonly tag: string) {}

  public isBroken(): boolean {
    return this.tag.trim().length < 3;
  }
}
