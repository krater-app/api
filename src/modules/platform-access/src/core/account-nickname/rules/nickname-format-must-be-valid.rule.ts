import { BusinessRule } from '@krater/building-blocks';

export class NicknameFormatMustBeValidRule implements BusinessRule {
  message = 'Provided nickname have invalid format. Provide at least 3 characters.';

  constructor(private readonly nickname: string) {}

  public isBroken(): boolean | Promise<boolean> {
    return this.nickname.trim().length < 3;
  }
}
