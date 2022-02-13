import { BusinessRule } from '@krater/building-blocks';

export class LinkMustBeInValidFormatRule implements BusinessRule {
  public readonly message = 'Provided link is in invalid format.';

  constructor(private readonly link: string) {}

  public isBroken(): boolean {
    return !/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\\+\\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\\+~%\\/.\w-_]*)?\??(?:[-\\+=&;%@.\w_]*)#?(?:[\w]*))?)/.test(
      this.link,
    );
  }
}
