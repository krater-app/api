import { BusinessRule } from '@krater/building-blocks';

export class TextPostContentMustBeValidRule implements BusinessRule {
  message = 'Provided content is not valid. Provide at least 10 characters.';

  constructor(private readonly content: string) {}

  public isBroken(): boolean {
    return this.content.length < 10;
  }
}
