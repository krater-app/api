import { BusinessRule } from '@krater/building-blocks';

export class PostTitleMustBeValid implements BusinessRule {
  message = 'Provided title is not valid. Provide at least 3 characters.';

  constructor(private readonly title: string | null) {}

  public isBroken(): boolean {
    return this.title.trim().length < 3;
  }
}
