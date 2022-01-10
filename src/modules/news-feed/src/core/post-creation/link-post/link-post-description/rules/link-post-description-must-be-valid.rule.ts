import { BusinessRule } from '@krater/building-blocks';

export class LinkPostDescriptionMustBeValidRule implements BusinessRule {
  public readonly message =
    'Provided link post description is invalid. Please, use at least 10 words and maximum of 300 words.';

  constructor(private readonly postDescription: string | null) {}

  public isBroken(): boolean {
    if (this.postDescription === null) {
      return false;
    }

    return this.postDescription.trim().length < 10 || this.postDescription.split(' ').length > 300;
  }
}
