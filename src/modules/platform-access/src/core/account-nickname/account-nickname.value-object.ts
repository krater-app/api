import { ValueObject } from '@krater/building-blocks';
import { AccountNicknameCheckerService } from './account-nickname-checker.service';
import { NicknameFormatMustBeValidRule } from './rules/nickname-format-must-be-valid.rule';
import { NicknameMustBeUniqueRule } from './rules/nickname-must-be-unique.rule';

interface AccountNicknameProps {
  value: string;
}

export class AccountNickname extends ValueObject<AccountNicknameProps> {
  private constructor(value: string) {
    super({
      value,
    });
  }

  public static async createNew(
    nickname: string,
    accountNicknameCheckerService: AccountNicknameCheckerService,
  ) {
    AccountNickname.checkRule(new NicknameFormatMustBeValidRule(nickname));

    await AccountNickname.checkRule(
      new NicknameMustBeUniqueRule(nickname, accountNicknameCheckerService),
    );

    return new AccountNickname(nickname);
  }

  public static fromPersistence(nickname: string) {
    return new AccountNickname(nickname);
  }
}
