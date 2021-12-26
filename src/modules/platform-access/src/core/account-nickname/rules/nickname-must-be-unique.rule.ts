import { BusinessRule } from '@krater/building-blocks';
import { AccountNicknameCheckerService } from '../account-nickname-checker.service';

export class NicknameMustBeUniqueRule implements BusinessRule {
  message = 'Provided nickname is already taken. Please use different one.';

  constructor(
    private readonly nickname: string,
    private readonly accountNicknameCheckerService: AccountNicknameCheckerService,
  ) {}

  public async isBroken(): Promise<boolean> {
    return !(await this.accountNicknameCheckerService.isUnique(this.nickname));
  }
}
