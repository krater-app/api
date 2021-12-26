import { PasswordNotStrongEnoughError } from '@errors/password-not-strong-enough.error';
import { ValueObject } from '@krater/building-blocks';
import { PasswordHashProviderService } from './password-hash-provider.service';
import { PasswordMustBeStrongRule } from './rules/password-must-be-strong.rule';

interface AccountPasswordProps {
  passwordHash: string;
}

export class AccountPassword extends ValueObject<AccountPasswordProps> {
  private constructor(passwordHash: string) {
    super({
      passwordHash,
    });
  }

  public static async createNew(
    password: string,
    passwordHashProviderService: PasswordHashProviderService,
  ) {
    AccountPassword.checkRule(new PasswordMustBeStrongRule(password), PasswordNotStrongEnoughError);

    const passwordHash = await passwordHashProviderService.hashPassword(password);

    return new AccountPassword(passwordHash);
  }

  public static fromPersistence(passwordHash: string) {
    return new AccountPassword(passwordHash);
  }

  public async isValid(password: string, passwordHashProviderService: PasswordHashProviderService) {
    return passwordHashProviderService.isValidPassword(password, this.props.passwordHash);
  }
}
